import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Sparkles, FileText, ScrollText, Loader, ChevronDown, ChevronUp, Clock, CheckSquare, Square, ListChecks, ClipboardList } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORY_CONFIG = {
  npcs: { label: 'NPCs', color: '#8B5CF6' },
  maps: { label: 'Maps', color: '#3B82F6' },
  encounters: { label: 'Encounters', color: '#EF4444' },
  loot: { label: 'Loot', color: '#F59E0B' },
  story: { label: 'Story', color: '#10B981' },
  atmosphere: { label: 'Atmosphere', color: '#6366F1' },
  handouts: { label: 'Handouts', color: '#EC4899' },
  rules: { label: 'Rules', color: '#14B8A6' },
};

const PRIORITY_BADGE = {
  high: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', label: 'HIGH' },
  medium: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', label: 'MED' },
  low: { bg: 'rgba(107,114,128,0.15)', color: '#9CA3AF', label: 'LOW' },
};

const AISessionPlanner = ({ theme, campaignId }) => {
  const [mode, setMode] = useState('outline');
  const [generating, setGenerating] = useState(false);

  const [focus, setFocus] = useState('balanced');
  const [tone, setTone] = useState('classic fantasy');
  const [gmNotes, setGmNotes] = useState('');
  const [outlines, setOutlines] = useState([]);

  const [style, setStyle] = useState('narrative');
  const [sessionNumber, setSessionNumber] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [replays, setReplays] = useState([]);

  const [checklists, setChecklists] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOutlines();
    fetchReplays();
    fetchChecklists();
  }, [campaignId]);

  const fetchOutlines = async () => { try { const res = await axios.get(`${API}/ai/session-outlines/${campaignId}`); setOutlines(res.data.outlines || []); } catch {} };
  const fetchReplays = async () => { try { const res = await axios.get(`${API}/ai/session-replays/${campaignId}`); setReplays(res.data.replays || []); } catch {} };
  const fetchChecklists = async () => { try { const res = await axios.get(`${API}/ai/session-checklists/${campaignId}`); setChecklists(res.data.checklists || []); } catch {} };

  const generateOutline = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/ai/session-outline/${campaignId}`, { focus, tone, gm_notes: gmNotes });
      setOutlines(prev => [res.data, ...prev]);
      setExpandedId(res.data.id);
      toast.success('Session outline generated!');
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to generate outline'); }
    finally { setGenerating(false); }
  };

  const generateReplay = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/ai/session-replay/${campaignId}`, { style, session_number: sessionNumber, extra_context: extraContext });
      setReplays(prev => [res.data, ...prev]);
      setExpandedId(res.data.id);
      toast.success('Session replay generated!');
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to generate replay'); }
    finally { setGenerating(false); }
  };

  const generateChecklist = useCallback(async (outlineId) => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/ai/session-checklist/${campaignId}`, { outline_id: outlineId || null });
      setChecklists(prev => [res.data, ...prev]);
      setExpandedId(res.data.id);
      setMode('checklist');
      toast.success('Prep checklist generated!');
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to generate checklist'); }
    finally { setGenerating(false); }
  }, [campaignId]);

  const toggleChecklistItem = async (checklistId, itemId, completed) => {
    try {
      const res = await axios.patch(`${API}/ai/session-checklist/${checklistId}`, { item_id: itemId, completed });
      setChecklists(prev => prev.map(c => c.id === checklistId ? res.data : c));
    } catch { toast.error('Failed to update checklist'); }
  };

  const selectStyle = { background: theme.bg.elevated, border: `1px solid ${theme.border}`, color: theme.text.primary, borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', cursor: 'pointer', width: '100%' };
  const inputStyle = { ...selectStyle, resize: 'vertical', fontFamily: 'inherit' };

  const modes = [
    { id: 'outline', icon: FileText, label: 'Outline' },
    { id: 'replay', icon: ScrollText, label: 'Replay' },
    { id: 'checklist', icon: ListChecks, label: 'Checklist' },
  ];

  const items = mode === 'outline' ? outlines : mode === 'replay' ? replays : checklists;

  return (
    <div data-testid="ai-session-planner" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {modes.map(m => (
          <button key={m.id} data-testid={`planner-mode-${m.id}`} onClick={() => setMode(m.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              background: mode === m.id ? theme.accent.primary : theme.bg.elevated,
              color: mode === m.id ? '#fff' : theme.text.secondary,
              border: `1px solid ${mode === m.id ? theme.accent.primary : theme.border}`,
              transition: 'all 0.2s',
            }}>
            <m.icon size={14} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Config Panel */}
      <div style={{ background: theme.bg.surface, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mode === 'outline' && (
          <>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>FOCUS</label>
                <select data-testid="outline-focus" value={focus} onChange={e => setFocus(e.target.value)} style={selectStyle}>
                  <option value="balanced">Balanced</option>
                  <option value="combat-heavy">Combat Heavy</option>
                  <option value="roleplay-heavy">Roleplay Heavy</option>
                  <option value="exploration">Exploration</option>
                  <option value="mystery">Mystery / Investigation</option>
                  <option value="political">Political Intrigue</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>TONE</label>
                <select data-testid="outline-tone" value={tone} onChange={e => setTone(e.target.value)} style={selectStyle}>
                  <option value="classic fantasy">Classic Fantasy</option>
                  <option value="dark and gritty">Dark & Gritty</option>
                  <option value="lighthearted">Lighthearted</option>
                  <option value="horror">Horror</option>
                  <option value="epic heroic">Epic / Heroic</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>GM NOTES (optional)</label>
              <textarea data-testid="outline-gm-notes" value={gmNotes} onChange={e => setGmNotes(e.target.value)}
                placeholder="E.g., Party needs to reach the ruins by session end, introduce the BBEG's lieutenant..."
                rows={3} style={inputStyle} />
            </div>
          </>
        )}

        {mode === 'replay' && (
          <>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>STYLE</label>
                <select data-testid="replay-style" value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
                  <option value="narrative">Epic Narrative</option>
                  <option value="chronicle">Historical Chronicle</option>
                  <option value="comedic">Comedic Retelling</option>
                  <option value="dark">Dark Fantasy</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>SESSION #</label>
                <input data-testid="replay-session-number" type="text" value={sessionNumber} onChange={e => setSessionNumber(e.target.value)}
                  placeholder="e.g. 12" style={selectStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px', display: 'block' }}>EXTRA CONTEXT (optional)</label>
              <textarea data-testid="replay-extra-context" value={extraContext} onChange={e => setExtraContext(e.target.value)}
                placeholder="Key moments to highlight, funny quotes, epic dice rolls..." rows={3} style={inputStyle} />
            </div>
          </>
        )}

        {mode === 'checklist' && (
          <div style={{ fontSize: '13px', color: theme.text.secondary, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>Generate an AI prep checklist from a session outline, or create one from your campaign context.</p>
            <p style={{ margin: '8px 0 0', fontSize: '11px', color: theme.text.muted }}>
              Tip: Generate an outline first, then create a checklist from it for best results.
            </p>
          </div>
        )}

        <button data-testid="generate-ai-btn"
          onClick={mode === 'outline' ? generateOutline : mode === 'replay' ? generateReplay : () => generateChecklist(null)}
          disabled={generating}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '12px', borderRadius: '10px', cursor: generating ? 'wait' : 'pointer',
            background: generating ? theme.bg.elevated : `linear-gradient(135deg, ${theme.accent.secondary}, ${theme.accent.primary})`,
            color: '#fff', border: 'none', fontSize: '14px', fontWeight: 700,
            opacity: generating ? 0.7 : 1, transition: 'all 0.2s',
          }}>
          {generating ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : mode === 'checklist' ? <ClipboardList size={16} /> : <Sparkles size={16} />}
          {generating ? 'Generating...' : mode === 'outline' ? 'Generate Session Outline' : mode === 'replay' ? 'Generate Session Replay' : 'Generate Prep Checklist'}
        </button>
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: theme.text.muted, fontSize: '13px' }}>
            {mode === 'outline' ? 'No session outlines yet. Generate your first one above!'
              : mode === 'replay' ? 'No session replays yet. Generate your first one above!'
              : 'No prep checklists yet. Generate one above or from a session outline!'}
          </div>
        )}

        {items.map(item => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} data-testid={`planner-item-${item.id}`}
              style={{
                background: theme.bg.surface, border: `1px solid ${isExpanded ? theme.accent.primary : theme.border}`,
                borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
              <button onClick={() => setExpandedId(isExpanded ? null : item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: theme.text.primary,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {mode === 'checklist' ? <ListChecks size={14} color={theme.accent.primary} /> : mode === 'outline' ? <FileText size={14} color={theme.accent.primary} /> : <ScrollText size={14} color={theme.accent.primary} />}
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    {mode === 'outline' ? `Outline - ${item.focus || 'Balanced'}`
                      : mode === 'replay' ? `Replay${item.session_number ? ` #${item.session_number}` : ''} - ${item.style || 'Narrative'}`
                      : `Prep Checklist${item.outline_id ? ' (from outline)' : ''}`}
                  </span>
                  {mode === 'checklist' && item.items && (
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', color: '#10B981', fontWeight: 700 }}>
                      {item.items.filter(i => i.completed).length}/{item.items.length}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: theme.text.muted }}>
                    <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    {new Date(item.generated_at).toLocaleDateString()}
                  </span>
                  {isExpanded ? <ChevronUp size={14} color={theme.text.muted} /> : <ChevronDown size={14} color={theme.text.muted} />}
                </div>
              </button>

              {isExpanded && mode !== 'checklist' && (
                <div style={{
                  padding: '0 16px 16px', fontSize: '13px', color: theme.text.secondary,
                  lineHeight: 1.7, whiteSpace: 'pre-wrap', borderTop: `1px solid ${theme.border}`,
                  maxHeight: '500px', overflowY: 'auto',
                }}>
                  <div style={{ paddingTop: '12px' }} dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content || '') }} />
                  {mode === 'outline' && (
                    <button data-testid={`generate-checklist-from-${item.id}`}
                      onClick={(e) => { e.stopPropagation(); generateChecklist(item.id); }}
                      disabled={generating}
                      style={{
                        marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                        color: '#10B981', fontSize: '12px', fontWeight: 600,
                      }}>
                      <ClipboardList size={13} />
                      Generate Prep Checklist from this Outline
                    </button>
                  )}
                </div>
              )}

              {isExpanded && mode === 'checklist' && item.items && (
                <ChecklistPanel items={item.items} checklistId={item.id} theme={theme} onToggle={toggleChecklistItem} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

function ChecklistPanel({ items, checklistId, theme, onToggle }) {
  const categories = [...new Set(items.map(i => i.category))];
  const completedCount = items.filter(i => i.completed).length;
  const pct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div style={{ borderTop: `1px solid ${theme.border}`, padding: '12px 16px 16px' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: theme.text.muted, fontWeight: 600 }}>PREP PROGRESS</span>
          <span style={{ fontSize: '11px', color: pct === 100 ? '#10B981' : theme.text.muted, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '3px', transition: 'width 0.3s ease',
            width: `${pct}%`,
            background: pct === 100 ? '#10B981' : `linear-gradient(90deg, ${theme.accent.primary}, ${theme.accent.secondary})`,
          }} />
        </div>
      </div>

      {/* Items by category */}
      {categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        const cfg = CATEGORY_CONFIG[cat] || { label: cat, color: '#6B7280' };
        return (
          <div key={cat} style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: cfg.color, letterSpacing: '0.5px', marginBottom: '4px', textTransform: 'uppercase' }}>
              {cfg.label}
            </div>
            {catItems.map(ci => {
              const pri = PRIORITY_BADGE[ci.priority] || PRIORITY_BADGE.medium;
              return (
                <div key={ci.id} data-testid={`checklist-item-${ci.id}`}
                  onClick={() => onToggle(checklistId, ci.id, !ci.completed)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 8px',
                    borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s',
                    background: ci.completed ? 'rgba(16,185,129,0.04)' : 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ci.completed ? 'rgba(16,185,129,0.04)' : 'transparent'; }}>
                  {ci.completed
                    ? <CheckSquare size={15} color="#10B981" style={{ marginTop: '1px', flexShrink: 0 }} />
                    : <Square size={15} color={theme.text.muted} style={{ marginTop: '1px', flexShrink: 0 }} />}
                  <span style={{
                    fontSize: '12px', lineHeight: 1.5, flex: 1,
                    color: ci.completed ? theme.text.muted : theme.text.secondary,
                    textDecoration: ci.completed ? 'line-through' : 'none',
                  }}>{ci.text}</span>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px',
                    background: pri.bg, color: pri.color, flexShrink: 0,
                  }}>{pri.label}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderMarkdown(text) {
  return text
    .replace(/### (.*)/g, '<h4 style="color:#F8F8FF;margin:12px 0 6px;font-size:14px">$1</h4>')
    .replace(/## (.*)/g, '<h3 style="color:#F8F8FF;margin:16px 0 8px;font-size:15px;font-weight:700">$1</h3>')
    .replace(/# (.*)/g, '<h2 style="color:#F8F8FF;margin:20px 0 10px;font-size:17px;font-weight:800">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F8F8FF">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*)/gm, '<li style="margin-left:16px;list-style:disc">$1</li>')
    .replace(/\n/g, '<br/>');
}

export default AISessionPlanner;
