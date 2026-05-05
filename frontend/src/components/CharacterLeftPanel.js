import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { getConditionRollEffect, getConditionIndicator } from '../data/conditionEffects';

const ABILITY_SHORT = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };
const getModifier = (score) => Math.floor((score - 10) / 2);

export default function CharacterLeftPanel({ character, theme, abilities, profBonus, rollDice, handleUpdateCharacter }) {
  const SAVING_THROWS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

  return (
    <div className="card-hover" style={{ background: theme.bg.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h3 style={{ fontFamily: "'Montserrat', sans-serif", color: theme.accent.primary, marginBottom: '6px', fontSize: '0.85rem', padding: '12px' }}>Ability Scores</h3>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
        {SAVING_THROWS.map((ability) => {
          const score = abilities[ability];
          const mod = getModifier(score);
          const saveMod = mod + (character.saving_throw_proficiencies?.includes(ability) ? profBonus : 0);
          const isProficient = character.saving_throw_proficiencies?.includes(ability);
          const saveContext = `${ABILITY_SHORT[ability].toLowerCase()}_save`;
          const condIndicator = getConditionIndicator(character?.conditions || [], saveContext, character?.exhaustion_level || 0);
          const condEffect = getConditionRollEffect(character?.conditions || [], saveContext, 'normal', character?.exhaustion_level || 0);

          return (
            <div key={ability} style={{ marginBottom: '4px', background: 'rgba(15, 10, 30, 0.5)', borderRadius: '8px', padding: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: theme.text.muted, letterSpacing: '1px', fontWeight: '600' }}>{ABILITY_SHORT[ability]}</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: theme.text.primary }}>{score}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: theme.accent.highlight }}>{mod >= 0 ? `+${mod}` : mod}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => {
                  if (condEffect.autoFail) return;
                  rollDice('1d20', mod, `${ABILITY_SHORT[ability]} Check`, condEffect.mode);
                }} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: condIndicator ? `${condIndicator.color}14` : 'rgba(212,175,55,0.08)', border: `1px solid ${condIndicator ? `${condIndicator.color}66` : theme.border}`, color: theme.text.secondary }}>Check <span style={{ fontWeight: 700 }}>{mod >= 0 ? `+${mod}` : mod}</span></button>

                <button onClick={() => {
                  if (condEffect.autoFail) return;
                  rollDice('1d20', saveMod, `${ABILITY_SHORT[ability]} Save`, condEffect.mode);
                }} style={{ flex: 1, padding: '6px', borderRadius: '6px', background: isProficient ? 'rgba(245,158,11,0.2)' : 'rgba(212,175,55,0.12)', border: `1px solid ${isProficient ? 'rgba(245,158,11,0.4)' : theme.border}`, color: isProficient ? theme.accent.highlight : theme.text.secondary }}>Save <span style={{ fontWeight: 700 }}>{saveMod >= 0 ? `+${saveMod}` : saveMod}</span></button>
              </div>
            </div>
          );
        })}

        <div style={{ textAlign: 'center', padding: '8px', borderRadius: '6px', marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: '10px', color: theme.text.muted, fontWeight: '500' }}>PROF</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: theme.accent.secondary }}>+{profBonus}</span>
        </div>

        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: `1px solid ${theme.border}` }}>
          <h4 style={{ fontSize: '11px', color: theme.accent.primary, fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Training</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Shield size={14} color={theme.text.muted} />
              <div>
                <div style={{ fontSize: '10px', color: theme.text.muted, fontWeight: '700' }}>ARMOR</div>
                <div style={{ fontSize: '12px', color: theme.text.primary }}>Light, Medium, Shields</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ fontSize: '10px', color: theme.text.muted, fontWeight: '700' }}>WEAPONS</div>
              <div style={{ fontSize: '12px', color: theme.text.primary }}>Simple, Martial</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ fontSize: '10px', color: theme.text.muted, fontWeight: '700' }}>LANGUAGES</div>
              <div style={{ fontSize: '12px', color: theme.text.primary }}>Common, Elvish</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
