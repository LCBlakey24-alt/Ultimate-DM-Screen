// Class resource rules used by the clean character sheet.
// Keep feature/resource unlock levels here so the UI does not show resources
// before the class actually gains them.

const abilityMod = (score = 10) => Math.floor((Number(score || 10) - 10) / 2);
const levelOf = (character) => Number(character?.level || 1);

export const CLASS_RESOURCE_RULES = {
  Barbarian: [
    {
      key: 'rage',
      label: 'Rage',
      minLevel: 1,
      max: (character) => {
        const level = levelOf(character);
        if (level >= 17) return 6;
        if (level >= 12) return 5;
        if (level >= 6) return 4;
        if (level >= 3) return 3;
        return 2;
      },
    },
  ],
  Bard: [
    {
      key: 'bardic_inspiration',
      label: 'Bardic Inspiration',
      minLevel: 1,
      max: (character) => Math.max(1, abilityMod(character?.charisma)),
    },
  ],
  Cleric: [
    {
      key: 'channel_divinity',
      label: 'Channel Divinity',
      minLevel: 2,
      max: (character) => {
        const level = levelOf(character);
        if (level >= 18) return 3;
        if (level >= 6) return 2;
        return 1;
      },
    },
  ],
  Druid: [
    { key: 'wild_shape', label: 'Wild Shape', minLevel: 2, max: () => 2 },
  ],
  Fighter: [
    { key: 'second_wind', label: 'Second Wind', minLevel: 1, max: () => 1 },
    { key: 'action_surge', label: 'Action Surge', minLevel: 2, max: (character) => levelOf(character) >= 17 ? 2 : 1 },
    { key: 'indomitable', label: 'Indomitable', minLevel: 9, max: (character) => levelOf(character) >= 17 ? 3 : levelOf(character) >= 13 ? 2 : 1 },
  ],
  Monk: [
    { key: 'ki', label: 'Ki', minLevel: 2, max: (character) => levelOf(character) },
  ],
  Paladin: [
    { key: 'lay_on_hands', label: 'Lay on Hands', minLevel: 1, max: (character) => levelOf(character) * 5 },
    { key: 'channel_divinity', label: 'Channel Divinity', minLevel: 3, max: () => 1 },
  ],
  Ranger: [],
  Rogue: [],
  Sorcerer: [
    { key: 'sorcery_points', label: 'Sorcery Points', minLevel: 2, max: (character) => levelOf(character) },
  ],
  Warlock: [
    { key: 'pact_magic', label: 'Pact Magic', minLevel: 1, max: (character) => levelOf(character) >= 2 ? 2 : 1 },
  ],
  Wizard: [
    { key: 'arcane_recovery', label: 'Arcane Recovery', minLevel: 1, max: () => 1 },
  ],
};

export function getClassResourceRules(character) {
  const className = character?.character_class || '';
  const level = levelOf(character);
  return (CLASS_RESOURCE_RULES[className] || [])
    .filter(rule => level >= (rule.minLevel || 1))
    .map(rule => ({ ...rule, maxValue: Math.max(0, Number(rule.max?.(character) || 0)) }))
    .filter(rule => rule.maxValue > 0);
}
