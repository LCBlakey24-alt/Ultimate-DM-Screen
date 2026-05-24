import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

const defaultSettings = {
  announcement_enabled: false,
  announcement_text: '',
  maintenance_mode: false,
  signup_enabled: true,
  rook_text_enabled: true,
  feedback_enabled: true,
  reviews_enabled: true,
  uploads_enabled: true,
  campaign_creation_enabled: true,
  character_creation_enabled: true,
  beta_tools_enabled: true,
};

const controls = [
  ['signup_enabled', 'New signups'],
  ['rook_text_enabled', 'Rook text helper'],
  ['feedback_enabled', 'Feedback submissions'],
  ['reviews_enabled', 'Reviews'],
  ['uploads_enabled', 'Uploads'],
  ['campaign_creation_enabled', 'Campaign creation'],
  ['character_creation_enabled', 'Character creation'],
  ['beta_tools_enabled', 'Beta tools'],
];

export default function AdminSiteControlTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [overview, setOverview] = useState({
    users_count: 0,
    campaigns_count: 0,
    characters_count: 0,
    reviews_count: 0,
    approved_reviews_count: 0,
    feedback_count: 0,
    new_feedback_count: 0,
  });

  const load = async () => {
    try {
      setLoading(true);
      const [settingsRes, overviewRes] = await Promise.all([
        apiClient.get('/admin/site-settings'),
        apiClient.get('/admin/overview'),
      ]);
      setSettings(prev => ({ ...prev, ...(settingsRes.data || {}) }));
      setOverview(prev => ({ ...prev, ...(overviewRes.data || {}) }));
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Failed to load site controls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setField = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    try {
      setSaving(true);
      await apiClient.put('/admin/site-settings', settings);
      toast.success('Site settings updated');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || 'Failed to save site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: '#A0A0A0' }}>Loading site controls...</div>;

  return (
    <div style={{ background: '#242424', border: '1px solid rgba(193,18,31,0.35)', padding: 'clamp(12px, 3.5vw, 24px)', borderRadius: 6 }}>
      <h2 style={{ color: '#FFFFFF', marginTop: 0 }}>Site Control</h2>
      <p style={{ color: '#A0A0A0' }}>Global owner controls, feature switches, and health overview.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8, marginBottom: 16 }}>
        <Metric label="Users" value={overview.users_count || 0} />
        <Metric label="Campaigns" value={overview.campaigns_count || 0} />
        <Metric label="Characters" value={overview.characters_count || 0} />
        <Metric label="Reviews" value={overview.reviews_count || 0} />
        <Metric label="Feedback" value={overview.feedback_count || 0} />
        <Metric label="New Feedback" value={overview.new_feedback_count || 0} />
      </div>

      <Section title="Announcement">
        <ControlRow
          label="Enable announcement banner"
          checked={!!settings.announcement_enabled}
          onChange={value => setField('announcement_enabled', value)}
        />
        <textarea
          value={settings.announcement_text || ''}
          onChange={e => setField('announcement_text', e.target.value)}
          maxLength={240}
          placeholder="Announcement text (max 240 chars)"
          style={textareaStyle}
        />
        {settings.announcement_enabled && settings.announcement_text ? (
          <div style={bannerPreview}>{settings.announcement_text}</div>
        ) : null}
      </Section>

      <Section title="Maintenance">
        <ControlRow
          label="Maintenance mode"
          checked={!!settings.maintenance_mode}
          onChange={value => setField('maintenance_mode', value)}
        />
        {settings.maintenance_mode ? <p style={warningStyle}>Maintenance mode is on. Non-admin users are blocked from the app.</p> : null}
      </Section>

      <Section title="Feature switches">
        <p style={{ color: '#A0A0A0', fontSize: 12, marginTop: 0 }}>
          Feedback and reviews are enforced now. The other switches are stored and ready to connect to their features next.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
          {controls.map(([key, label]) => (
            <ControlRow key={key} label={label} checked={settings[key] !== false} onChange={value => setField(key, value)} />
          ))}
        </div>
      </Section>

      <button type="button" onClick={save} disabled={saving} style={saveButtonStyle}>
        {saving ? 'Saving...' : 'Save Site Settings'}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return <section style={sectionStyle}><h3 style={sectionTitleStyle}>{title}</h3>{children}</section>;
}

function ControlRow({ label, checked, onChange }) {
  return (
    <label style={controlRowStyle}>
      <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    </label>
  );
}

function Metric({ label, value }) {
  return <div style={metricStyle}><div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div><div style={{ fontSize: 11, color: '#A0A0A0' }}>{label}</div></div>;
}

const metricStyle = { background: '#1F1F1F', border: '1px solid #3A3A3A', padding: 10, textAlign: 'center', color: '#FFFFFF', borderRadius: 4 };
const sectionStyle = { background: '#1F1F1F', border: '1px solid rgba(193,18,31,0.35)', padding: 12, borderRadius: 4, marginBottom: 12 };
const sectionTitleStyle = { color: '#D62839', margin: '0 0 10px', fontSize: 15, fontWeight: 900 };
const controlRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#242424', border: '1px solid #3A3A3A', padding: 10, borderRadius: 4, marginBottom: 8 };
const textareaStyle = { width: '100%', minHeight: 90, marginTop: 8, background: '#242424', color: '#FFFFFF', border: '1px solid #3A3A3A', padding: 10, borderRadius: 4 };
const bannerPreview = { marginTop: 8, background: '#C1121F', color: '#FFFFFF', padding: 8, textAlign: 'center', fontWeight: 800, borderRadius: 4 };
const warningStyle = { color: '#F59E0B', fontWeight: 800, margin: '8px 0 0' };
const saveButtonStyle = { padding: '10px 16px', background: '#C1121F', color: '#FFFFFF', border: '1px solid #D62839', fontWeight: 800, borderRadius: 4 };
