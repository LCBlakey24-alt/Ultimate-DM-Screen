import React, { useState, useMemo } from 'react';
import { ScrollText, Sword, Heart, BookOpen, Shield, Bed, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ICONS = {
  attack: Sword,
  damage: Heart,
  heal: Heart,
  spell: BookOpen,
  rest: Bed,
  condition: Shield,
  roll: ScrollText,
};

const COLORS = {
  attack: '#F87171',
  damage: '#EF4444',
  heal: '#10B981',
  spell: '#A78BFA',
  rest: '#34D399',
  condition: '#F59E0B',
  roll: '#D4A017',
};

const formatTime = (ts) => {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
};

/**
 * Per-character combat log. Entries are kept in memory (passed in via props)
 * and rendered newest-first.
 *  entry: { id, ts, type, text }
 *
 * type ∈ 'attack' | 'damage' | 'heal' | 'spell' | 'rest' | 'condition' | 'roll'
 */
export default function CombatLog({ entries = [], onClear, theme }) {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter(e => e.type === filter);
  }, [entries, filter]);

  const types = ['all', 'attack', 'damage', 'heal', 'spell', 'rest', 'condition'];

  const border = theme?.border || 'rgba(212, 160, 23, 0.35)';
  const surface = theme?.bg?.surface || '#0F2440';
  const muted = theme?.text?.muted || '#64748B';
  const primary = theme?.text?.primary || '#F8FAFC';

  return (
    <div data-testid="combat-log" style={{
      borderRadius: 10, border: `1px solid ${border}`, overflow: 'hidden',
      background: surface,
    }}>
      {/* Header */}
      <button
        data-testid="combat-log-toggle"
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', background: 'rgba(212, 160, 23, 0.08)',
          border: 'none', cursor: 'pointer', color: primary,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          <ScrollText size={14} color="#D4A017" />
          COMBAT LOG
          <span style={{ fontSize: 10, color: muted, fontWeight: 600 }}>({entries.length})</span>
        </span>
        {collapsed ? <ChevronDown size={14} color={muted} /> : <ChevronUp size={14} color={muted} />}
      </button>

      {!collapsed && (
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Filters + clear */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {types.map(t => (
              <button
                key={t}
                data-testid={`combat-log-filter-${t}`}
                onClick={() => setFilter(t)}
                style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700,
                  background: filter === t ? 'rgba(212, 160, 23, 0.2)' : 'transparent',
                  border: `1px solid ${filter === t ? '#D4A017' : border}`,
                  color: filter === t ? '#D4A017' : muted,
                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.4,
                }}
              >
                {t}
              </button>
            ))}
            {entries.length > 0 && onClear && (
              <button
                data-testid="combat-log-clear"
                onClick={onClear}
                title="Clear combat log"
                style={{
                  marginLeft: 'auto',
                  padding: '2px 8px', borderRadius: 4, fontSize: 9,
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}
              >
                <Trash2 size={9} /> CLEAR
              </button>
            )}
          </div>

          {/* Entries */}
          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 12, textAlign: 'center', color: muted, fontSize: 11 }}>
                No combat events yet. Roll attacks, take damage, or cast spells to fill this log.
              </div>
            ) : (
              filtered.slice().reverse().map((e) => {
                const Icon = ICONS[e.type] || ScrollText;
                const color = COLORS[e.type] || '#D4A017';
                return (
                  <div key={e.id} data-testid={`combat-log-entry-${e.type}`} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 6,
                    background: 'rgba(15, 36, 64, 0.6)',
                    border: `1px solid ${border}`,
                    borderLeft: `3px solid ${color}`,
                  }}>
                    <Icon size={12} color={color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: primary, flex: 1, lineHeight: 1.4 }}>{e.text}</span>
                    <span style={{ fontSize: 9, color: muted, fontFamily: 'monospace' }}>{formatTime(e.ts)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
