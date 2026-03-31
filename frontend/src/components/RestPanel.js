import React, { useState, useCallback } from 'react';
import { Bed, Sun, Dices, Heart, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const HIT_DICE_MAP = {
  Barbarian: 12, Fighter: 10, Paladin: 10, Ranger: 10,
  Bard: 8, Cleric: 8, Druid: 8, Monk: 8, Rogue: 8, Warlock: 8,
  Sorcerer: 6, Wizard: 6,
};

export default function RestPanel({ character, theme, onRest, onUpdateCharacter }) {
  const [expanded, setExpanded] = useState(false);
  const [hitDiceToSpend, setHitDiceToSpend] = useState(1);
  const [resting, setResting] = useState(false);

  const hitDie = HIT_DICE_MAP[character?.character_class] || 8;
  const conMod = Math.floor(((character?.constitution || 10) - 10) / 2);
  const maxHitDice = character?.level || 1;
  const hitDiceRemaining = character?.hit_dice_remaining ?? maxHitDice;
  const exhaustionLevel = character?.exhaustion_level || 0;

  const handleShortRest = useCallback(async () => {
    setResting(true);
    try {
      await onRest('short');
      const hpGain = Array.from({ length: hitDiceToSpend }, () =>
        Math.max(1, Math.floor(Math.random() * hitDie) + 1 + conMod)
      ).reduce((a, b) => a + b, 0);
      toast.success(`Short Rest: Spent ${hitDiceToSpend} hit dice, recovered ~${hpGain} HP`);
    } catch {
      toast.error('Short rest failed');
    }
    setResting(false);
  }, [hitDiceToSpend, hitDie, conMod, onRest]);

  const handleLongRest = useCallback(async () => {
    setResting(true);
    try {
      await onRest('long');
      const effects = ['HP fully restored', `${Math.floor(maxHitDice / 2) || 1} hit dice recovered`];
      if (exhaustionLevel > 0) effects.push('Exhaustion reduced by 1');
      toast.success(`Long Rest: ${effects.join(', ')}`);
      if (exhaustionLevel > 0) {
        onUpdateCharacter?.({ exhaustion_level: Math.max(0, exhaustionLevel - 1) });
      }
    } catch {
      toast.error('Long rest failed');
    }
    setResting(false);
  }, [maxHitDice, exhaustionLevel, onRest, onUpdateCharacter]);

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '10px 14px', borderRadius: '8px', cursor: resting ? 'wait' : 'pointer',
    fontSize: '12px', fontWeight: 600, border: 'none', transition: 'all 0.2s',
    opacity: resting ? 0.6 : 1,
  };

  return (
    <div data-testid="rest-panel" style={{ borderRadius: '10px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
      <button data-testid="rest-panel-toggle" onClick={() => setExpanded(!expanded)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: theme.bg.elevated || 'rgba(255,255,255,0.03)',
        border: 'none', cursor: 'pointer', color: theme.text.primary,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
          <Bed size={14} color={theme.accent?.primary || '#4DD0E1'} />
          REST
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: theme.text.muted }}>
            {hitDiceRemaining}/{maxHitDice} HD
          </span>
          {expanded ? <ChevronUp size={12} color={theme.text.muted} /> : <ChevronDown size={12} color={theme.text.muted} />}
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '12px 14px', background: theme.bg.surface || 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Short Rest */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px' }}>SHORT REST</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: theme.text.muted }}>Hit Dice:</span>
                <select data-testid="hit-dice-selector" value={hitDiceToSpend} onChange={e => setHitDiceToSpend(Number(e.target.value))}
                  style={{
                    background: theme.bg.elevated || 'rgba(255,255,255,0.05)', color: theme.text.primary,
                    border: `1px solid ${theme.border}`, borderRadius: '4px', padding: '2px 4px', fontSize: '11px',
                  }}>
                  {Array.from({ length: Math.min(hitDiceRemaining, maxHitDice) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <span style={{ fontSize: '10px', color: theme.text.muted }}>d{hitDie}+{conMod}</span>
              </div>
            </div>
            <button data-testid="short-rest-btn" onClick={handleShortRest} disabled={resting || hitDiceRemaining <= 0}
              style={{ ...btnBase, width: '100%', background: 'rgba(59,130,246,0.15)', color: '#60A5FA' }}>
              <Zap size={13} /> Short Rest
            </button>
          </div>

          {/* Long Rest */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px', marginBottom: '6px' }}>LONG REST</div>
            <div style={{ fontSize: '10px', color: theme.text.secondary, marginBottom: '6px', lineHeight: 1.5 }}>
              <Heart size={10} style={{ display: 'inline', marginRight: '4px' }} />Full HP &bull; Recover {Math.floor(maxHitDice / 2) || 1} hit dice &bull; Reset spell slots
              {exhaustionLevel > 0 && <span style={{ color: '#F59E0B' }}> &bull; Exhaustion -{1}</span>}
            </div>
            <button data-testid="long-rest-btn" onClick={handleLongRest} disabled={resting}
              style={{ ...btnBase, width: '100%', background: 'rgba(16,185,129,0.15)', color: '#34D399' }}>
              <Sun size={13} /> Long Rest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
