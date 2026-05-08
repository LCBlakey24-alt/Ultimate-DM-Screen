import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

function normaliseSpell(spell) {
  if (!spell) return { name: 'Unknown Spell', level: null, school: '' };
  if (typeof spell === 'string') return { name: spell, level: null, school: '' };
  return {
    name: spell.name || spell.spell_name || spell.title || 'Unknown Spell',
    level: spell.level ?? spell.spell_level ?? null,
    school: spell.school || spell.type || '',
    prepared: spell.prepared,
    description: spell.description || spell.desc || spell.summary || ''
  };
}

function spellLevelLabel(level) {
  if (level === 0 || level === '0') return 'Cantrip';
  if (!level && level !== 0) return 'Spell';
  return `Level ${level}`;
}

function SpellCard({ spell, tag }) {
  const [expanded, setExpanded] = useState(false);
  const normalised = normaliseSpell(spell);
  const hasDescription = Boolean(normalised.description);

  return (
    <button type="button" className={`clean-sheet-spell-card ${expanded ? 'expanded' : ''}`} onClick={() => hasDescription && setExpanded(prev => !prev)}>
      <span className="clean-sheet-spell-level">{tag || spellLevelLabel(normalised.level)}</span>
      <strong>{normalised.name}</strong>
      {normalised.school && <em>{normalised.school}</em>}
      {hasDescription && (
        <p>{expanded ? normalised.description : `${normalised.description.slice(0, 120)}${normalised.description.length > 120 ? '…' : ''}`}</p>
      )}
      {hasDescription && <small>{expanded ? 'Tap to collapse' : 'Tap to expand'}</small>}
    </button>
  );
}

function SpellList({ title, spells, emptyText, tag }) {
  return (
    <section className="clean-sheet-panel">
      <h2>{title}</h2>
      {spells.length > 0 ? (
        <div className="clean-sheet-spell-grid">
          {spells.map((spell, index) => <SpellCard key={`${normaliseSpell(spell).name}-${index}`} spell={spell} tag={tag} />)}
        </div>
      ) : (
        <p className="clean-sheet-muted">{emptyText}</p>
      )}
    </section>
  );
}

function SpellSlots({ slots = {}, remaining = {}, onChangeSlots }) {
  const [savingLevel, setSavingLevel] = useState('');
  const keys = Array.from(new Set([...Object.keys(slots || {}), ...Object.keys(remaining || {})]))
    .filter(key => Number(key) > 0)
    .sort((a, b) => Number(a) - Number(b));

  const updateLevel = async (level, delta) => {
    if (!onChangeSlots || savingLevel) return;
    const total = Number(slots[level] ?? 0);
    const current = Number(remaining[level] ?? total);
    const next = Math.max(0, Math.min(total, current + delta));
    if (next === current) return;
    setSavingLevel(level);
    const ok = await onChangeSlots({ ...(remaining || {}), [level]: next });
    if (ok !== false) {
      toast.success(delta < 0 ? `Level ${level} slot spent` : `Level ${level} slot restored`);
    }
    setSavingLevel('');
  };

  return (
    <section className="clean-sheet-panel clean-sheet-wide">
      <h2>Spell Slots</h2>
      {keys.length > 0 ? (
        <div className="clean-sheet-slot-grid">
          {keys.map(level => {
            const total = Number(slots[level] ?? 0);
            const left = Number(remaining[level] ?? total);
            return (
              <div key={level} className="clean-sheet-slot-card">
                <span>Level {level}</span>
                <strong>{left}/{total}</strong>
                <div className="clean-sheet-slot-pips" aria-label={`Level ${level} slots`}>
                  {Array.from({ length: total }).map((_, index) => (
                    <i key={index} className={index < left ? 'filled' : ''} />
                  ))}
                </div>
                <div className="clean-sheet-slot-actions">
                  <button type="button" onClick={() => updateLevel(level, -1)} disabled={savingLevel === level || left <= 0}>Spend</button>
                  <button type="button" onClick={() => updateLevel(level, 1)} disabled={savingLevel === level || left >= total}>Restore</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="clean-sheet-muted">No spell slot data found.</p>
      )}
    </section>
  );
}

export default function CleanSpellsTab({ character, onCharacterUpdate }) {
  const cantrips = character?.cantrips_known || [];
  const known = character?.spells_known || [];
  const prepared = character?.spells_prepared || [];
  const slots = character?.spell_slots || {};
  const remaining = character?.spell_slots_remaining || {};
  const spellAbility = character?.spellcasting_ability || '';
  const spellDc = character?.spell_save_dc || '';
  const spellAttack = character?.spell_attack_bonus || '';

  const sortedKnown = useMemo(() => [...known].sort((a, b) => Number(normaliseSpell(a).level || 0) - Number(normaliseSpell(b).level || 0)), [known]);
  const sortedPrepared = useMemo(() => [...prepared].sort((a, b) => Number(normaliseSpell(a).level || 0) - Number(normaliseSpell(b).level || 0)), [prepared]);

  const handleSlotChange = async (nextRemaining) => {
    if (!onCharacterUpdate) return false;
    return onCharacterUpdate({ spell_slots_remaining: nextRemaining }, { error: 'Could not update spell slots' });
  };

  return (
    <div className="clean-sheet-grid">
      <section className="clean-sheet-panel clean-sheet-wide">
        <h2>Spellcasting</h2>
        <div className="clean-sheet-spell-summary">
          <div><span>Ability</span><strong>{spellAbility || '—'}</strong></div>
          <div><span>Save DC</span><strong>{spellDc || '—'}</strong></div>
          <div><span>Attack</span><strong>{spellAttack ? `+${spellAttack}` : '—'}</strong></div>
        </div>
      </section>

      <SpellSlots slots={slots} remaining={remaining} onChangeSlots={handleSlotChange} />
      <SpellList title="Cantrips" spells={cantrips} emptyText="No cantrips found." tag="Cantrip" />
      <SpellList title="Known Spells" spells={sortedKnown} emptyText="No known spells found." />
      <SpellList title="Prepared Spells" spells={sortedPrepared} emptyText="No prepared spells found." />
    </div>
  );
}
