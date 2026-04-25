// Static D&D 5e Level-Up Data
// Extracted from LevelUpWizard.js for maintainability

export const HIT_DICE = {
  Barbarian: 12, Fighter: 10, Paladin: 10, Ranger: 10,
  Bard: 8, Cleric: 8, Druid: 8, Monk: 8, Rogue: 8, Warlock: 8,
  Sorcerer: 6, Wizard: 6
};

export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 10, 12, 16, 19]
};

export const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
export const ABILITY_SHORT = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };

export const FEATS = [
  { name: 'Alert', description: '+5 initiative, can\'t be surprised, no advantage for hidden attackers', prereq: null },
  { name: 'Athlete', description: '+1 STR/DEX, standing from prone costs 5ft, running jump +5ft', prereq: null },
  { name: 'Actor', description: '+1 CHA, advantage on deception/performance to impersonate', prereq: null },
  { name: 'Charger', description: 'Dash action lets you attack with +5 damage or shove', prereq: null },
  { name: 'Crossbow Expert', description: 'Ignore loading, no disadvantage in melee, bonus attack', prereq: null },
  { name: 'Defensive Duelist', description: 'Reaction to add proficiency to AC vs melee', prereq: 'DEX 13+' },
  { name: 'Dual Wielder', description: '+1 AC with two weapons, dual wield non-light weapons', prereq: null },
  { name: 'Dungeon Delver', description: 'Advantage on trap detection, resistance to trap damage', prereq: null },
  { name: 'Durable', description: '+1 CON, minimum hit dice healing = 2x CON mod', prereq: null },
  { name: 'Elemental Adept', description: 'Ignore resistance, treat 1s as 2s for chosen element', prereq: 'Spellcasting' },
  { name: 'Grappler', description: 'Advantage on attacks vs grappled, can pin creatures', prereq: 'STR 13+' },
  { name: 'Great Weapon Master', description: 'Bonus attack on crit/kill, -5 to hit for +10 damage', prereq: null },
  { name: 'Healer', description: 'Stabilize + 1HP, healer\'s kit restores 1d6+4+HD HP', prereq: null },
  { name: 'Heavily Armored', description: '+1 STR, gain heavy armor proficiency', prereq: 'Medium armor proficiency' },
  { name: 'Heavy Armor Master', description: '+1 STR, reduce nonmagical bludg/pierce/slash by 3', prereq: 'Heavy armor proficiency' },
  { name: 'Inspiring Leader', description: '10min speech grants level+CHA temp HP to 6 creatures', prereq: 'CHA 13+' },
  { name: 'Keen Mind', description: '+1 INT, always know north and hours until sunrise/set', prereq: null },
  { name: 'Lightly Armored', description: '+1 STR/DEX, gain light armor proficiency', prereq: null },
  { name: 'Linguist', description: '+1 INT, learn 3 languages, create ciphers', prereq: null },
  { name: 'Lucky', description: '3 luck points per day to reroll any d20', prereq: null },
  { name: 'Mage Slayer', description: 'Reaction attack on casters, advantage on saves, conc. disadvantage', prereq: null },
  { name: 'Magic Initiate', description: '2 cantrips + 1 1st-level spell from any class', prereq: null },
  { name: 'Martial Adept', description: 'Learn 2 maneuvers, gain 1 superiority die (d6)', prereq: null },
  { name: 'Medium Armor Master', description: 'No stealth disadvantage, +3 DEX to AC in medium armor', prereq: 'Medium armor proficiency' },
  { name: 'Mobile', description: '+10 speed, no opportunity attacks from attacked targets', prereq: null },
  { name: 'Moderately Armored', description: '+1 STR/DEX, gain medium armor and shield proficiency', prereq: 'Light armor proficiency' },
  { name: 'Mounted Combatant', description: 'Advantage vs smaller unmounted, redirect attacks to you', prereq: null },
  { name: 'Observant', description: '+1 INT/WIS, +5 passive perception and investigation', prereq: null },
  { name: 'Polearm Master', description: 'Bonus d4 attack, opportunity attack when entering reach', prereq: null },
  { name: 'Resilient', description: '+1 to ability, gain saving throw proficiency in it', prereq: null },
  { name: 'Ritual Caster', description: 'Learn 2 ritual spells, can cast them as rituals', prereq: 'INT or WIS 13+' },
  { name: 'Savage Attacker', description: 'Reroll melee weapon damage once per turn', prereq: null },
  { name: 'Sentinel', description: 'Opportunity attack stops movement, attack on ally attacks', prereq: null },
  { name: 'Sharpshooter', description: 'No disadvantage at long range, -5 to hit for +10 damage', prereq: null },
  { name: 'Shield Master', description: 'Bonus shove, add shield AC to DEX saves, evasion with shield', prereq: null },
  { name: 'Skilled', description: 'Gain 3 skill or tool proficiencies', prereq: null },
  { name: 'Skulker', description: 'Hide when lightly obscured, miss doesn\'t reveal position', prereq: 'DEX 13+' },
  { name: 'Spell Sniper', description: 'Double spell range, ignore cover, learn 1 cantrip', prereq: 'Spellcasting' },
  { name: 'Tavern Brawler', description: '+1 STR/CON, proficient with improvised, grapple on hit', prereq: null },
  { name: 'Tough', description: '+2 HP per level', prereq: null },
  { name: 'War Caster', description: 'Advantage on concentration, cast with hands full, spell as OA', prereq: 'Spellcasting' },
  { name: 'Weapon Master', description: '+1 STR/DEX, proficiency with 4 weapons', prereq: null }
];
