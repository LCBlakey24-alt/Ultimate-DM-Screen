import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, LogIn, RefreshCw, Search, Users as UsersIcon } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { AUTH_USERNAME_KEY, getAuthToken, setAuthToken } from '@/lib/auth';

const rq = {
  panel: 'var(--rq-bg-panel, #242424)',
  input: 'var(--rq-bg-input, #1F1F1F)',
  border: 'var(--rq-accent-border, rgba(193,18,31,0.35))',
  borderDefault: 'var(--rq-border-default, #3A3A3A)',
  accent: 'var(--rq-accent-primary, #C1121F)',
  accentHover: 'var(--rq-accent-hover, #D62839)',
  accentSoft: 'var(--rq-accent-soft, rgba(193,18,31,0.12))',
  text: 'var(--rq-text-primary, #FFFFFF)',
  textSecondary: 'var(--rq-text-secondary, #D6D6D6)',
  muted: 'var(--rq-text-muted, #A0A0A0)',
  radius: 'var(--rq-radius-md, 6px)',
  radiusSm: 'var(--rq-radius-sm, 4px)',
};

const buttonStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: rq.accentSoft,
  border: `1px solid ${rq.border}`,
  color: rq.text,
  padding: '9px 12px', borderRadius: rq.radiusSm,
  fontSize: 12, fontWeight: 900,
  cursor: 'pointer'
};

const subtleButtonStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'transparent',
  border: `1px solid ${rq.border}`,
  color: rq.textSecondary,
  padding: '7px 10px', borderRadius: rq.radiusSm,
  fontSize: 11, fontWeight: 800, cursor: 'pointer'
};

/**
 * AdminUsersTab — user account list + email visibility + usage counts + CSV exports + impersonation.
 * Impersonation stashes the admin's current token in sessionStorage so the
 * admin can restore their session later via the top-banner "Stop impersonating" button.
 */
export default function AdminUsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const downloadCsv = async (kind) => {
    try {
      const res = await apiClient.get(`/admin/export/${kind}.csv`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rook-${kind}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${kind} CSV`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || `Failed to export ${kind}`);
    }
  };

  const impersonate = async (targetUsername) => {
    if (!window.confirm(`Impersonate ${targetUsername}? Your current session will be stashed and restorable via the top banner.`)) return;
    try {
      const res = await apiClient.post(`/admin/users/${encodeURIComponent(targetUsername)}/impersonate`, {});
      const { token, username } = res.data || {};
      if (!token) throw new Error('No token returned');
      const adminToken = getAuthToken();
      const adminUsername = localStorage.getItem(AUTH_USERNAME_KEY);
      sessionStorage.setItem('rq_admin_token_stash', adminToken || '');
      sessionStorage.setItem('rq_admin_username_stash', adminUsername || '');
      setAuthToken(token);
      localStorage.setItem(AUTH_USERNAME_KEY, username);
      toast.success(`Now viewing as ${username}`);
      window.location.assign('/home');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Impersonation failed');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(user => [
      user.username,
      user.email,
      user.created_at,
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [users, query]);

  const totals = useMemo(() => ({
    users: users.length,
    filtered: filtered.length,
    characters: users.reduce((sum, user) => sum + Number(user.character_count || 0), 0),
    ownedCampaigns: users.reduce((sum, user) => sum + Number(user.owned_campaign_count || 0), 0),
    joinedCampaigns: users.reduce((sum, user) => sum + Number(user.joined_campaign_count || 0), 0),
  }), [users, filtered]);

  return (
    <div data-testid="admin-users-tab" style={wrapStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}><UsersIcon size={20} /> User Accounts</h2>
          <p style={subtitleStyle}>Track who has signed up, which email they used, and how much they are using the site.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={loadUsers} style={buttonStyle}><RefreshCw size={14} /> Refresh</button>
          <button type="button" onClick={() => downloadCsv('users')} data-testid="export-users-csv-btn" style={buttonStyle}>
            <Download size={14} /> Export Users CSV
          </button>
          <button type="button" onClick={() => downloadCsv('campaigns')} data-testid="export-campaigns-csv-btn" style={buttonStyle}>
            <Download size={14} /> Export Campaigns CSV
          </button>
        </div>
      </div>

      <div style={metricsStyle}>
        <Metric label="Accounts" value={totals.users} />
        <Metric label="Showing" value={totals.filtered} />
        <Metric label="Characters" value={totals.characters} />
        <Metric label="GM Campaigns" value={totals.ownedCampaigns} />
        <Metric label="Joined Campaigns" value={totals.joinedCampaigns} />
      </div>

      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={14} color={rq.muted} style={{ position: 'absolute', top: 12, left: 12 }} />
        <input
          data-testid="admin-user-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by username, email, or created date..."
          style={searchStyle}
        />
      </div>

      {loading ? (
        <div style={emptyStyle}>Loading users...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ color: rq.muted, textAlign: 'left', letterSpacing: 1, fontWeight: 900 }}>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email Used</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Characters</th>
                <th style={thStyle}>GM Campaigns</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Feedback</th>
                <th style={thStyle}>Reviews</th>
                <th style={{ ...thStyle, width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" style={{ color: rq.muted, padding: 24, textAlign: 'center' }}>No users match</td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.username || user.email} data-testid={`user-row-${user.username}`} style={trStyle}>
                    <td style={tdStrongStyle}>{user.username || '-'}</td>
                    <td style={tdStyle}>{user.email || '-'}</td>
                    <td style={tdStyle}>{formatDate(user.created_at)}</td>
                    <td style={tdNumberStyle}>{user.character_count || 0}</td>
                    <td style={tdNumberStyle}>{user.owned_campaign_count || 0}</td>
                    <td style={tdNumberStyle}>{user.joined_campaign_count || 0}</td>
                    <td style={tdNumberStyle}>{user.feedback_count || 0}</td>
                    <td style={tdNumberStyle}>{user.review_count || 0}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => impersonate(user.username)}
                        data-testid={`impersonate-${user.username}`}
                        style={subtleButtonStyle}
                        disabled={!user.username}
                      >
                        <LogIn size={12} /> Impersonate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={metricStyle}>
      <div style={{ color: rq.text, fontSize: 24, fontWeight: 900 }}>{value}</div>
      <div style={{ color: rq.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '-';
  try { return new Date(value).toLocaleDateString(); } catch { return value; }
}

const wrapStyle = { background: rq.panel, border: `1px solid ${rq.border}`, borderRadius: rq.radius, padding: 'clamp(14px, 3vw, 24px)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 };
const titleStyle = { color: rq.text, fontSize: 20, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 10 };
const subtitleStyle = { color: rq.muted, fontSize: 13, margin: '6px 0 0' };
const metricsStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 14 };
const metricStyle = { background: rq.input, border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, padding: 12, textAlign: 'center' };
const searchStyle = { width: '100%', padding: '10px 14px 10px 34px', background: rq.input, color: rq.text, border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, fontSize: 13, outline: 'none' };
const emptyStyle = { color: rq.muted, fontSize: 13, padding: 28, textAlign: 'center', background: rq.input, border: `1px dashed ${rq.borderDefault}`, borderRadius: rq.radiusSm };
const thStyle = { padding: '9px 10px', borderBottom: `1px solid ${rq.border}`, whiteSpace: 'nowrap', textTransform: 'uppercase' };
const trStyle = { color: rq.text, borderBottom: `1px solid rgba(193,18,31,0.10)` };
const tdStyle = { padding: '10px', color: rq.textSecondary, whiteSpace: 'nowrap' };
const tdStrongStyle = { padding: '10px', color: rq.text, fontWeight: 900, whiteSpace: 'nowrap' };
const tdNumberStyle = { padding: '10px', color: rq.accentHover, fontWeight: 900, textAlign: 'center' };
