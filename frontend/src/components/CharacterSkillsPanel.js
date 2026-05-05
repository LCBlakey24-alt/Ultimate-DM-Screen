import React from 'react';
import { Sparkles } from 'lucide-react';
import { getConditionRollEffect, getConditionIndicator } from '../data/conditionEffects';

const SKILLS = [
  { name: 'Acrobatics', ability: 'dexterity' },
  { name: 'Animal Handling', ability: 'wisdom' },
  { name: 'Arcana', ability: 'intelligence' },
  { name: 'Athletics', ability: 'strength' },
  { name: 'Deception', ability: 'charisma' },
  { name: 'History', ability: 'intelligence' },
  { name: 'Insight', ability: 'wisdom' },
  { name: 'Intimidation', ability: 'charisma' },
  { name: 'Investigation', ability: 'intelligence' },
  { name: 'Medicine', ability: 'wisdom' },
  { name: 'Nature', ability: 'intelligence' },
  { name: 'Perception', ability: 'wisdom' },
  { name: 'Performance', ability: 'charisma' },
  { name: 'Persuasion', ability: 'charisma' },
  { name: 'Religion', ability: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'dexterity' },
  { name: 'Stealth', ability: 'dexterity' },
  { name: 'Survival', ability: 'wisdom' }
];

const getModifier = (score) => Math.floor((score - 10) / 2);
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

export default function CharacterSkillsPanel({ character, theme, abilities, profBonus, rollDice }) {
  const ABILITY_ORDER = [
    { key: 'strength', short: 'STR' },
    { key: 'dexterity', short: 'DEX' },
    { key: 'constitution', short: 'CON' },
    { key: 'intelligence', short: 'INT' },
    { key: 'wisdom', short: 'WIS' },
    { key: 'charisma', short: 'CHA' },
  ];

  // Group skills by ability so subskills appear under their related ability header
  const grouped = ABILITY_ORDER.map(a => ({
    ability: a.key,
    short: a.short,
    skills: SKILLS.filter(s => s.ability === a.key)
  }));

  return (
    <div style={{ background: theme.bg.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h3 style={{ fontFamily: "'Montserrat', sans-serif", color: theme.accent.secondary, margin: 0, padding: '12px', fontSize: '0.85rem' }}>Skills</h3>
      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {grouped.map(group => {
          if (!group.skills || group.skills.length === 0) return null;
          const abilityScore = abilities?.[group.ability] ?? 10;
          const abilityMod = getModifier(abilityScore);
          return (
            <div key={group.ability}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: theme.text.muted }}>{group.short}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.text.primary }}>{abilityScore} <span style={{ color: theme.accent.highlight, marginLeft: 6 }}>{formatModifier(abilityMod)}</span></div>
                </div>
                <div style={{ fontSize: 11, color: theme.text.muted, fontWeight: 700 }}>{group.skills.length} skill{group.skills.length>1?'s':''}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.skills.map(skill => {
                  const mod = getModifier(abilities[skill.ability]);
                  const isProficient = character.skill_proficiencies?.includes(skill.name);
                  const isExpertise = character.skill_expertise?.includes(skill.name) || character.expertise?.includes(skill.name);
                  const profMultiplier = isExpertise ? 2 : isProficient ? 1 : 0;
                  const bonus = mod + (profBonus * profMultiplier);
                  const skillContext = `${skill.ability.substring(0, 3).toLowerCase()}_check`;
                  const condIndicator = getConditionIndicator(character?.conditions || [], skillContext, character?.exhaustion_level || 0);
                  const condEffect = getConditionRollEffect(character?.conditions || [], skillContext, 'normal', character?.exhaustion_level || 0);
                  const profIcon = isExpertise ? '★' : isProficient ? '●' : '○';
                  const profIconColor = isExpertise ? '#F5C542' : isProficient ? theme.accent.primary : theme.text.muted;

                  return (
                    <button key={skill.name} onClick={() => rollDice('1d20', bonus, skill.name, condEffect.mode)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: isExpertise ? 'rgba(245,197,66,0.15)' : isProficient ? 'rgba(212,160,23,0.10)' : condIndicator ? `${condIndicator.color}08` : 'transparent', border: isExpertise ? '1px solid rgba(245,197,66,0.45)' : isProficient ? '1px solid rgba(212,160,23,0.30)' : '1px solid transparent', borderRadius: '6px', color: theme.text.secondary, fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: profIconColor, fontSize: '12px', fontWeight: 800, width: 14, textAlign: 'center' }}>{profIcon}</span>
                        {skill.name}
                        {condIndicator && <span title={condIndicator.tooltip} style={{ fontSize: '10px', fontWeight: 800, color: condIndicator.color }}>{condIndicator.symbol}</span>}
                      </span>
                      <span style={{ fontWeight: '700', color: isExpertise ? '#F5C542' : isProficient ? theme.accent.primary : theme.text.primary, fontSize: '13px' }}>{formatModifier(bonus)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
