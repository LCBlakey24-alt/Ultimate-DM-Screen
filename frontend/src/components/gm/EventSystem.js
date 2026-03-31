import React, { useState, useCallback } from 'react';
import { CalendarDays, Dices, Coins, Heart, Sword, Users, Plus, Trash2, Play, Clock, AlertTriangle, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const EVENT_TEMPLATES = [
  { name: 'Tavern Brawl', type: 'combat', difficulty: 'easy', description: 'A drunken fight breaks out in the local tavern.', rewards: '50 GP', risks: 'Minor injuries (1d4 damage)' },
  { name: 'Merchant Caravan Escort', type: 'travel', difficulty: 'medium', description: 'Escort a merchant through bandit territory.', rewards: '200 GP + 1 rare item', risks: 'Ambush encounter, possible exhaustion' },
  { name: 'Thieves Guild Heist', type: 'stealth', difficulty: 'hard', description: 'Break into a noble\'s vault and steal a valuable artifact.', rewards: '500 GP + artifact', risks: 'Arrest, bounty placed on party' },
  { name: 'Arena Tournament', type: 'combat', difficulty: 'medium', description: 'Enter the gladiatorial arena for fame and fortune.', rewards: '300 GP + reputation', risks: '2d6 damage per round lost' },
  { name: 'Magical Research', type: 'exploration', difficulty: 'easy', description: 'Spend time in a wizard\'s library researching ancient lore.', rewards: 'New spell/knowledge', risks: 'Wild magic surge on failure' },
  { name: 'Festival Games', type: 'social', difficulty: 'easy', description: 'Participate in the town festival activities.', rewards: '25 GP + local reputation', risks: 'None' },
  { name: 'Monster Hunt', type: 'combat', difficulty: 'hard', description: 'Track and slay a dangerous monster terrorizing the region.', rewards: '1000 GP + monster parts', risks: 'Death (CR 8+ creature)' },
  { name: 'Diplomacy Mission', type: 'social', difficulty: 'medium', description: 'Negotiate a peace treaty between rival factions.', rewards: 'Political favor + land', risks: 'War breaks out on failure' },
];

const DIFFICULTY_COLORS = {
  easy: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  hard: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  deadly: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' },
};

const TYPE_ICONS = { combat: Sword, travel: Clock, stealth: AlertTriangle, exploration: Sparkles, social: Users };

export default function EventSystem({ theme }) {
  const [events, setEvents] = useState(EVENT_TEMPLATES);
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', type: 'combat', difficulty: 'medium', description: '', rewards: '', risks: '' });
  const [activeEvent, setActiveEvent] = useState(null);
  const [rollResult, setRollResult] = useState(null);

  const addEvent = useCallback(() => {
    if (!newEvent.name.trim()) return;
    setEvents(prev => [...prev, { ...newEvent }]);
    setNewEvent({ name: '', type: 'combat', difficulty: 'medium', description: '', rewards: '', risks: '' });
    setShowCreate(false);
    toast.success('Event created!');
  }, [newEvent]);

  const removeEvent = (idx) => setEvents(prev => prev.filter((_, i) => i !== idx));

  const runEvent = (event) => {
    setActiveEvent(event);
    const roll = Math.floor(Math.random() * 20) + 1;
    const dc = event.difficulty === 'easy' ? 8 : event.difficulty === 'medium' ? 13 : event.difficulty === 'hard' ? 16 : 20;
    setRollResult({ roll, dc, success: roll >= dc });
  };

  const inputStyle = { background: theme.bg.card || 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text.primary, padding: '6px 8px', fontSize: '12px', outline: 'none', width: '100%', fontFamily: 'inherit' };

  return (
    <div data-testid="event-system" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', color: theme.accent?.gm || theme.accent?.primary, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarDays size={18} /> Event System
        </h3>
        <button data-testid="create-event-btn" onClick={() => setShowCreate(!showCreate)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', background: theme.accent?.primary + '20', color: theme.accent?.primary, border: `1px solid ${theme.accent?.primary}40` }}>
          <Plus size={12} /> Create Event
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px' }}>NAME</label>
              <input data-testid="event-name-input" value={newEvent.name} onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))} placeholder="Event name" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px' }}>TYPE</label>
              <select value={newEvent.type} onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))} style={inputStyle}>
                {['combat', 'travel', 'stealth', 'exploration', 'social'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px' }}>DIFFICULTY</label>
              <select value={newEvent.difficulty} onChange={e => setNewEvent(prev => ({ ...prev, difficulty: e.target.value }))} style={inputStyle}>
                {['easy', 'medium', 'hard', 'deadly'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>DESCRIPTION</label><textarea value={newEvent.description} onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div><label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>REWARDS</label><input value={newEvent.rewards} onChange={e => setNewEvent(prev => ({ ...prev, rewards: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>RISKS</label><input value={newEvent.risks} onChange={e => setNewEvent(prev => ({ ...prev, risks: e.target.value }))} style={inputStyle} /></div>
          </div>
          <button data-testid="save-event-btn" onClick={addEvent} style={{ padding: '8px', borderRadius: '6px', background: theme.accent?.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Save Event</button>
        </div>
      )}

      {/* Active Event Roll */}
      {activeEvent && rollResult && (
        <div data-testid="event-roll-result" style={{ background: rollResult.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${rollResult.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '4px' }}>{activeEvent.name}</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: rollResult.success ? '#10B981' : '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>{rollResult.roll}</div>
          <div style={{ fontSize: '12px', color: theme.text.muted }}>DC {rollResult.dc}</div>
          <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 700, color: rollResult.success ? '#10B981' : '#EF4444' }}>
            {rollResult.success ? <><Trophy size={16} style={{ display: 'inline', marginRight: '4px' }} />SUCCESS! {activeEvent.rewards}</> : <><AlertTriangle size={16} style={{ display: 'inline', marginRight: '4px' }} />FAILURE! {activeEvent.risks}</>}
          </div>
          <button onClick={() => { setActiveEvent(null); setRollResult(null); }} style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, color: theme.text.muted }}>Dismiss</button>
        </div>
      )}

      {/* Event List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {events.map((event, idx) => {
          const dc = DIFFICULTY_COLORS[event.difficulty] || DIFFICULTY_COLORS.medium;
          const Icon = TYPE_ICONS[event.type] || CalendarDays;
          return (
            <div key={idx} data-testid={`event-card-${idx}`} style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} color={dc.color} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text.primary }}>{event.name}</span>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: dc.bg, color: dc.color, textTransform: 'uppercase' }}>{event.difficulty}</span>
              </div>
              <div style={{ fontSize: '11px', color: theme.text.secondary, lineHeight: 1.4 }}>{event.description}</div>
              {event.rewards && <div style={{ fontSize: '10px', color: '#10B981' }}><Coins size={10} style={{ display: 'inline', marginRight: '3px' }} />{event.rewards}</div>}
              {event.risks && <div style={{ fontSize: '10px', color: '#F87171' }}><AlertTriangle size={10} style={{ display: 'inline', marginRight: '3px' }} />{event.risks}</div>}
              <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                <button data-testid={`run-event-${idx}`} onClick={() => runEvent(event)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', background: dc.bg, color: dc.color, border: `1px solid ${dc.color}40` }}>
                  <Play size={10} /> Run Event
                </button>
                <button onClick={() => removeEvent(idx)} style={{ padding: '5px 8px', borderRadius: '5px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', cursor: 'pointer' }}>
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
