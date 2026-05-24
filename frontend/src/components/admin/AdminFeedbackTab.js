import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, Filter, MessageSquare, RefreshCw, Save, Search, Trash2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';

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
  success: 'var(--rq-success, #2E8B57)',
  radius: 'var(--rq-radius-md, 6px)',
  radiusSm: 'var(--rq-radius-sm, 4px)',
};

const statuses = ['all', 'new', 'reviewing', 'planned', 'done', 'dismissed'];
const priorities = ['low', 'normal', 'high', 'urgent'];

export default function AdminFeedbackTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/feedback', { params: { status_filter: statusFilter } });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => [
      item.title,
      item.message,
      item.username,
      item.area,
      item.category,
      item.page_path,
      item.admin_notes,
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [items, query]);

  const updateLocal = (id, patch) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const saveItem = async (item) => {
    try {
      setSavingId(item.id);
      const res = await apiClient.put(`/admin/feedback/${item.id}`, {
        status: item.status,
        priority: item.priority,
        admin_notes: item.admin_notes || '',
      });
      updateLocal(item.id, res.data);
      toast.success('Feedback updated');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to update feedback');
    } finally {
      setSavingId('');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this feedback item?')) return;
    try {
      await apiClient.delete(`/admin/feedback/${id}`);
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Feedback deleted');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to delete feedback');
    }
  };

  const exportCsv = async () => {
    try {
      const res = await apiClient.get('/admin/export/feedback.csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rook-feedback.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Feedback CSV downloaded');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to export feedback');
    }
  };

  const counts = useMemo(() => ({
    total: items.length,
    new: items.filter(item => item.status === 'new').length,
    planned: items.filter(item => item.status === 'planned').length,
    done: items.filter(item => item.status === 'done').length,
  }), [items]);

  return (
    <div data-testid="admin-feedback-tab" style={wrapStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}><MessageSquare size={20} /> Improvement Feedback</h2>
          <p style={subtitleStyle}>User-submitted suggestions, bugs, confusing areas, and feature requests.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={load} style={buttonStyle}><RefreshCw size={14} /> Refresh</button>
          <button type="button" onClick={exportCsv} style={buttonStyle}><Download size={14} /> Export CSV</button>
        </div>
      </div>

      <div style={metricsStyle}>
        <Metric label="Showing" value={filtered.length} />
        <Metric label="New" value={counts.new} />
        <Metric label="Planned" value={counts.planned} />
        <Metric label="Done" value={counts.done} />
      </div>

      <div style={toolbarStyle}>
        <div style={searchWrapStyle}>
          <Search size={14} style={searchIconStyle} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search feedback, user, area, page..." style={inputStyle} />
        </div>
        <div style={filterWrapStyle}>
          <Filter size={14} color={rq.muted} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
            {statuses.map(status => <option key={status} value={status}>{status === 'all' ? 'All statuses' : status}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={emptyStyle}>Loading feedback...</div>
      ) : filtered.length === 0 ? (
        <div style={emptyStyle}>No feedback found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(item => (
            <article key={item.id} style={itemStyle}>
              <div style={itemTopStyle}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={badgeRowStyle}>
                    <Badge label={item.status || 'new'} tone="status" />
                    <Badge label={item.priority || 'normal'} tone="priority" />
                    <Badge label={item.area || 'general'} />
                    <span style={dateStyle}>{formatDate(item.created_at)}</span>
                  </div>
                  <h3 style={itemTitleStyle}>{item.title}</h3>
                  <p style={metaStyle}>From {item.username || 'Unknown'} {item.page_path ? `• ${item.page_path}` : ''}</p>
                </div>
                <button type="button" onClick={() => deleteItem(item.id)} style={dangerButtonStyle} title="Delete feedback"><Trash2 size={14} /></button>
              </div>

              <p style={messageStyle}>{item.message}</p>

              <div style={editGridStyle}>
                <label style={labelStyle}>Status
                  <select value={item.status || 'new'} onChange={e => updateLocal(item.id, { status: e.target.value })} style={selectStyle}>
                    {statuses.filter(s => s !== 'all').map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label style={labelStyle}>Priority
                  <select value={item.priority || 'normal'} onChange={e => updateLocal(item.id, { priority: e.target.value })} style={selectStyle}>
                    {priorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                  </select>
                </label>
              </div>

              <label style={labelStyle}>Admin notes / plan
                <textarea value={item.admin_notes || ''} onChange={e => updateLocal(item.id, { admin_notes: e.target.value })} placeholder="Add your thoughts, fix plan, or notes to bring back to ChatGPT..." style={textareaStyle} />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" disabled={savingId === item.id} onClick={() => saveItem(item)} style={saveButtonStyle}>
                  <Save size={14} /> {savingId === item.id ? 'Saving...' : 'Save Feedback'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return <div style={metricStyle}><div style={{ fontSize: 22, fontWeight: 900 }}>{value}</div><div style={{ fontSize: 11, color: rq.muted, textTransform: 'uppercase' }}>{label}</div></div>;
}

function Badge({ label, tone }) {
  const isPriority = tone === 'priority';
  const isStatus = tone === 'status';
  return <span style={{ ...badgeStyle, color: isPriority ? rq.accentHover : isStatus ? rq.text : rq.textSecondary, borderColor: isPriority ? rq.accent : rq.borderDefault }}>{label}</span>;
}

function formatDate(value) {
  if (!value) return '';
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

const wrapStyle = { background: rq.panel, border: `1px solid ${rq.border}`, borderRadius: rq.radius, padding: 'clamp(14px, 3vw, 24px)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 18 };
const titleStyle = { color: rq.text, fontSize: 20, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, margin: 0 };
const subtitleStyle = { color: rq.muted, fontSize: 13, margin: '6px 0 0' };
const buttonStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, background: rq.accentSoft, border: `1px solid ${rq.border}`, color: rq.text, padding: '9px 12px', borderRadius: rq.radiusSm, fontWeight: 900, cursor: 'pointer' };
const metricsStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8, marginBottom: 16 };
const metricStyle = { background: rq.input, border: `1px solid ${rq.borderDefault}`, color: rq.text, textAlign: 'center', padding: 12, borderRadius: rq.radiusSm };
const toolbarStyle = { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 };
const searchWrapStyle = { position: 'relative', flex: '1 1 260px' };
const searchIconStyle = { position: 'absolute', left: 12, top: 12, color: rq.muted };
const inputStyle = { width: '100%', background: rq.input, color: rq.text, border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, padding: '10px 12px 10px 34px', outline: 'none' };
const filterWrapStyle = { display: 'flex', alignItems: 'center', gap: 8 };
const selectStyle = { width: '100%', background: rq.input, color: rq.text, border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, padding: '9px 10px', outline: 'none' };
const emptyStyle = { color: rq.muted, textAlign: 'center', padding: 36, background: rq.input, border: `1px dashed ${rq.borderDefault}`, borderRadius: rq.radiusSm };
const itemStyle = { background: rq.input, border: `1px solid ${rq.border}`, borderRadius: rq.radiusSm, padding: 16 };
const itemTopStyle = { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' };
const badgeRowStyle = { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 };
const badgeStyle = { fontSize: 10, fontWeight: 900, textTransform: 'uppercase', border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, padding: '2px 7px', background: rq.panel };
const dateStyle = { color: rq.muted, fontSize: 11 };
const itemTitleStyle = { color: rq.text, fontSize: 16, fontWeight: 900, margin: '0 0 4px' };
const metaStyle = { color: rq.muted, fontSize: 12, margin: 0 };
const dangerButtonStyle = { background: rq.accentSoft, border: `1px solid ${rq.border}`, color: rq.accentHover, padding: 8, borderRadius: rq.radiusSm, cursor: 'pointer' };
const messageStyle = { color: rq.textSecondary, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: '14px 0' };
const editGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 };
const labelStyle = { color: rq.muted, fontSize: 12, fontWeight: 900, display: 'flex', flexDirection: 'column', gap: 6 };
const textareaStyle = { minHeight: 82, background: rq.panel, color: rq.text, border: `1px solid ${rq.borderDefault}`, borderRadius: rq.radiusSm, padding: 10, resize: 'vertical', outline: 'none' };
const saveButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, background: rq.accent, color: '#fff', border: `1px solid ${rq.accent}`, borderRadius: rq.radiusSm, padding: '9px 12px', fontWeight: 900, cursor: 'pointer' };
