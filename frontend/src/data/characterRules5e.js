// D&D 5e Character Rules - Supporting both 2014 and 2024 editions
// This file contains all rules data for character creation, leveling, and multiclassing

export const EDITIONS = {
  '2014': { name: '2014 (Original)', description: 'Race → Class → Ability Scores → Background' },
  '2024': { name: '2024 (Revised)', description: 'Class → Origin (Background + Species) → Ability Scores' }
};

// ============================================
// RACES / SPECIES
// ============================================

export const RACES = {
  // Common Races
  Human: {
    name: 'Human',
    description: 'Versatile and ambitious',
    speed: 30,
    size: 'Medium',
    asi2014: { all: 1 }, // +1 to all in 2014
    asi2024: null, // ASI comes from background in 2024
    traits: ['Extra Language', 'Versatile (feat in 2024)'],
    languages: ['Common', 'One of choice']
  },
  Elf: {
    name: 'Elf',
    description: 'Graceful and long-lived',
    speed: 30,
    size: 'Medium',
    asi2014: { dexterity: 2 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Keen Senses (Perception proficiency)', 'Fey Ancestry', 'Trance'],
    languages: ['Common', 'Elvish'],
    subraces: {
      'High Elf': { asi2014: { intelligence: 1 }, traits: ['Cantrip (Wizard list)', 'Extra Language'] },
      'Wood Elf': { asi2014: { wisdom: 1 }, traits: ['Fleet of Foot (+5 speed)', 'Mask of the Wild'], speed: 35 },
      'Dark Elf (Drow)': { asi2014: { charisma: 1 }, traits: ['Superior Darkvision 120ft', 'Sunlight Sensitivity', 'Drow Magic'] }
    }
  },
  Dwarf: {
    name: 'Dwarf',
    description: 'Stout and sturdy',
    speed: 25,
    size: 'Medium',
    asi2014: { constitution: 2 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Dwarven Resilience (poison advantage)', 'Stonecunning', 'Tool Proficiency'],
    languages: ['Common', 'Dwarvish'],
    subraces: {
      'Hill Dwarf': { asi2014: { wisdom: 1 }, traits: ['Dwarven Toughness (+1 HP/level)'] },
      'Mountain Dwarf': { asi2014: { strength: 2 }, traits: ['Dwarven Armor Training (light/medium)'] }
    }
  },
  Halfling: {
    name: 'Halfling',
    description: 'Small but brave',
    speed: 25,
    size: 'Small',
    asi2014: { dexterity: 2 },
    asi2024: null,
    traits: ['Lucky (reroll 1s)', 'Brave (advantage vs frightened)', 'Halfling Nimbleness'],
    languages: ['Common', 'Halfling'],
    subraces: {
      'Lightfoot': { asi2014: { charisma: 1 }, traits: ['Naturally Stealthy'] },
      'Stout': { asi2014: { constitution: 1 }, traits: ['Stout Resilience (poison advantage)'] }
    }
  },
  Gnome: {
    name: 'Gnome',
    description: 'Curious and inventive',
    speed: 25,
    size: 'Small',
    asi2014: { intelligence: 2 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Gnome Cunning (advantage on INT/WIS/CHA saves vs magic)'],
    languages: ['Common', 'Gnomish'],
    subraces: {
      'Forest Gnome': { asi2014: { dexterity: 1 }, traits: ['Natural Illusionist', 'Speak with Small Beasts'] },
      'Rock Gnome': { asi2014: { constitution: 1 }, traits: ["Artificer's Lore", 'Tinker'] }
    }
  },
  'Half-Orc': {
    name: 'Half-Orc',
    description: 'Strong and enduring',
    speed: 30,
    size: 'Medium',
    asi2014: { strength: 2, constitution: 1 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Menacing (Intimidation proficiency)', 'Relentless Endurance', 'Savage Attacks'],
    languages: ['Common', 'Orc']
  },
  'Half-Elf': {
    name: 'Half-Elf',
    description: 'Best of both worlds',
    speed: 30,
    size: 'Medium',
    asi2014: { charisma: 2, choice: 2 }, // +1 to two others
    asi2024: null,
    traits: ['Darkvision 60ft', 'Fey Ancestry', 'Skill Versatility (2 skill proficiencies)'],
    languages: ['Common', 'Elvish', 'One of choice']
  },
  Tiefling: {
    name: 'Tiefling',
    description: 'Fiendish heritage',
    speed: 30,
    size: 'Medium',
    asi2014: { charisma: 2, intelligence: 1 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Hellish Resistance (fire)', 'Infernal Legacy (thaumaturgy, hellish rebuke, darkness)'],
    languages: ['Common', 'Infernal']
  },
  // 2024 New Races
  Aasimar: {
    name: 'Aasimar',
    description: 'Celestial heritage',
    speed: 30,
    size: 'Medium',
    asi2014: { charisma: 2 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Celestial Resistance (necrotic, radiant)', 'Healing Hands', 'Light Bearer'],
    languages: ['Common', 'Celestial'],
    edition2024: true
  },
  Goliath: {
    name: 'Goliath',
    description: 'Mountain-born giants',
    speed: 35,
    size: 'Medium',
    asi2014: { strength: 2, constitution: 1 },
    asi2024: null,
    traits: ['Powerful Build', "Stone's Endurance", 'Mountain Born'],
    languages: ['Common', 'Giant'],
    edition2024: true
  },
  Orc: {
    name: 'Orc',
    description: 'Fierce warriors',
    speed: 30,
    size: 'Medium',
    asi2014: { strength: 2, constitution: 1 },
    asi2024: null,
    traits: ['Darkvision 60ft', 'Adrenaline Rush', 'Powerful Build', 'Relentless Endurance'],
    languages: ['Common', 'Orc'],
    edition2024: true
  }
};

// ============================================
// CLASSES
// ============================================

export const CLASSES = {
  Barbarian: {
    name: 'Barbarian',
    hitDie: 12,
    primaryAbility: 'strength',
    savingThrows: ['strength', 'constitution'],
    armorProficiencies: ['light', 'medium', 'shields'],
    weaponProficiencies: ['simple', 'martial'],
    skillChoices: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    skillCount: 2,
    startingEquipment: ['Greataxe or martial melee', 'Handaxes (2) or simple weapon', "Explorer's pack", 'Javelins (4)'],
    features: {
      1: ['Rage', 'Unarmored Defense'],
      2: ['Reckless Attack', 'Danger Sense'],
      3: ['Primal Path'],
      4: ['ASI'],
      5: ['Extra Attack', 'Fast Movement'],
      6: ['Path Feature'],
      7: ['Feral Instinct'],
      8: ['ASI'],
      9: ['Brutal Critical (1 die)'],
      10: ['Path Feature'],
      11: ['Relentless Rage'],
      12: ['ASI'],
      13: ['Brutal Critical (2 dice)'],
      14: ['Path Feature'],
      15: ['Persistent Rage'],
      16: ['ASI'],
      17: ['Brutal Critical (3 dice)'],
      18: ['Indomitable Might'],
      19: ['ASI'],
      20: ['Primal Champion']
    },
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of the Ancestral Guardian', 'Path of the Storm Herald', 'Path of the Zealot', 'Path of the Beast', 'Path of Wild Magic'],
    multiclassRequirements: { strength: 13 }
  },
  Bard: {
    name: 'Bard',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrows: ['dexterity', 'charisma'],
    armorProficiencies: ['light'],
    weaponProficiencies: ['simple', 'hand crossbow', 'longsword', 'rapier', 'shortsword'],
    skillChoices: 'any',
    skillCount: 3,
    spellcasting: { ability: 'charisma', type: 'known', ritual: false },
    features: {
      1: ['Spellcasting', 'Bardic Inspiration (d6)'],
      2: ['Jack of All Trades', 'Song of Rest (d6)'],
      3: ['Bard College', 'Expertise'],
      4: ['ASI'],
      5: ['Bardic Inspiration (d8)', 'Font of Inspiration'],
      6: ['Countercharm', 'College Feature'],
      7: ['---'],
      8: ['ASI'],
      9: ['Song of Rest (d8)'],
      10: ['Bardic Inspiration (d10)', 'Expertise', 'Magical Secrets'],
      11: ['---'],
      12: ['ASI'],
      13: ['Song of Rest (d10)'],
      14: ['Magical Secrets', 'College Feature'],
      15: ['Bardic Inspiration (d12)'],
      16: ['ASI'],
      17: ['Song of Rest (d12)'],
      18: ['Magical Secrets'],
      19: ['ASI'],
      20: ['Superior Inspiration']
    },
    subclasses: ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Swords', 'College of Whispers', 'College of Creation', 'College of Eloquence'],
    multiclassRequirements: { charisma: 13 }
  },
  Cleric: {
    name: 'Cleric',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['light', 'medium', 'shields'],
    weaponProficiencies: ['simple'],
    skillChoices: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    skillCount: 2,
    spellcasting: { ability: 'wisdom', type: 'prepared', ritual: true },
    features: {
      1: ['Spellcasting', 'Divine Domain'],
      2: ['Channel Divinity (1/rest)', 'Domain Feature'],
      3: ['---'],
      4: ['ASI'],
      5: ['Destroy Undead (CR 1/2)'],
      6: ['Channel Divinity (2/rest)', 'Domain Feature'],
      7: ['---'],
      8: ['ASI', 'Destroy Undead (CR 1)', 'Domain Feature'],
      9: ['---'],
      10: ['Divine Intervention'],
      11: ['Destroy Undead (CR 2)'],
      12: ['ASI'],
      13: ['---'],
      14: ['Destroy Undead (CR 3)'],
      15: ['---'],
      16: ['ASI'],
      17: ['Destroy Undead (CR 4)', 'Domain Feature'],
      18: ['Channel Divinity (3/rest)'],
      19: ['ASI'],
      20: ['Divine Intervention Improvement']
    },
    subclasses: ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain', 'Death Domain', 'Forge Domain', 'Grave Domain', 'Order Domain', 'Peace Domain', 'Twilight Domain'],
    multiclassRequirements: { wisdom: 13 }
  },
  Druid: {
    name: 'Druid',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrows: ['intelligence', 'wisdom'],
    armorProficiencies: ['light', 'medium', 'shields (nonmetal)'],
    weaponProficiencies: ['club', 'dagger', 'dart', 'javelin', 'mace', 'quarterstaff', 'scimitar', 'sickle', 'sling', 'spear'],
    skillChoices: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    skillCount: 2,
    spellcasting: { ability: 'wisdom', type: 'prepared', ritual: true },
    features: {
      1: ['Druidic', 'Spellcasting'],
      2: ['Wild Shape', 'Druid Circle'],
      3: ['---'],
      4: ['ASI', 'Wild Shape Improvement'],
      5: ['---'],
      6: ['Circle Feature'],
      7: ['---'],
      8: ['ASI', 'Wild Shape Improvement'],
      9: ['---'],
      10: ['Circle Feature'],
      11: ['---'],
      12: ['ASI'],
      13: ['---'],
      14: ['Circle Feature'],
      15: ['---'],
      16: ['ASI'],
      17: ['---'],
      18: ['Timeless Body', 'Beast Spells'],
      19: ['ASI'],
      20: ['Archdruid']
    },
    subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of Dreams', 'Circle of the Shepherd', 'Circle of Spores', 'Circle of Stars', 'Circle of Wildfire'],
    multiclassRequirements: { wisdom: 13 }
  },
  Fighter: {
    name: 'Fighter',
    hitDie: 10,
    primaryAbility: 'strength',
    savingThrows: ['strength', 'constitution'],
    armorProficiencies: ['all', 'shields'],
    weaponProficiencies: ['simple', 'martial'],
    skillChoices: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    skillCount: 2,
    features: {
      1: ['Fighting Style', 'Second Wind'],
      2: ['Action Surge (1 use)'],
      3: ['Martial Archetype'],
      4: ['ASI'],
      5: ['Extra Attack'],
      6: ['ASI'],
      7: ['Archetype Feature'],
      8: ['ASI'],
      9: ['Indomitable (1 use)'],
      10: ['Archetype Feature'],
      11: ['Extra Attack (2)'],
      12: ['ASI'],
      13: ['Indomitable (2 uses)'],
      14: ['ASI'],
      15: ['Archetype Feature'],
      16: ['ASI'],
      17: ['Action Surge (2 uses)', 'Indomitable (3 uses)'],
      18: ['Archetype Feature'],
      19: ['ASI'],
      20: ['Extra Attack (3)']
    },
    subclasses: ['Champion', 'Battle Master', 'Eldritch Knight', 'Arcane Archer', 'Cavalier', 'Samurai', 'Echo Knight', 'Psi Warrior', 'Rune Knight'],
    multiclassRequirements: { strength: 13, dexterity: 13, or: true }
  },
  Monk: {
    name: 'Monk',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrows: ['strength', 'dexterity'],
    armorProficiencies: [],
    weaponProficiencies: ['simple', 'shortsword'],
    skillChoices: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    skillCount: 2,
    features: {
      1: ['Unarmored Defense', 'Martial Arts'],
      2: ['Ki', 'Unarmored Movement'],
      3: ['Monastic Tradition', 'Deflect Missiles'],
      4: ['ASI', 'Slow Fall'],
      5: ['Extra Attack', 'Stunning Strike'],
      6: ['Ki-Empowered Strikes', 'Tradition Feature'],
      7: ['Evasion', 'Stillness of Mind'],
      8: ['ASI'],
      9: ['Unarmored Movement Improvement'],
      10: ['Purity of Body'],
      11: ['Tradition Feature'],
      12: ['ASI'],
      13: ['Tongue of the Sun and Moon'],
      14: ['Diamond Soul'],
      15: ['Timeless Body'],
      16: ['ASI'],
      17: ['Tradition Feature'],
      18: ['Empty Body'],
      19: ['ASI'],
      20: ['Perfect Self']
    },
    subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of the Drunken Master', 'Way of the Kensei', 'Way of the Sun Soul', 'Way of Mercy', 'Way of the Astral Self'],
    multiclassRequirements: { dexterity: 13, wisdom: 13 }
  },
  Paladin: {
    name: 'Paladin',
    hitDie: 10,
    primaryAbility: 'charisma',
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['all', 'shields'],
    weaponProficiencies: ['simple', 'martial'],
    skillChoices: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    skillCount: 2,
    spellcasting: { ability: 'charisma', type: 'prepared', ritual: false, halfCaster: true },
    features: {
      1: ['Divine Sense', 'Lay on Hands'],
      2: ['Fighting Style', 'Spellcasting', 'Divine Smite'],
      3: ['Divine Health', 'Sacred Oath'],
      4: ['ASI'],
      5: ['Extra Attack'],
      6: ['Aura of Protection'],
      7: ['Oath Feature'],
      8: ['ASI'],
      9: ['---'],
      10: ['Aura of Courage'],
      11: ['Improved Divine Smite'],
      12: ['ASI'],
      13: ['---'],
      14: ['Cleansing Touch'],
      15: ['Oath Feature'],
      16: ['ASI'],
      17: ['---'],
      18: ['Aura Improvements'],
      19: ['ASI'],
      20: ['Oath Feature']
    },
    subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oath of Conquest', 'Oath of Redemption', 'Oath of Glory', 'Oath of the Watchers', 'Oathbreaker'],
    multiclassRequirements: { strength: 13, charisma: 13 }
  },
  Ranger: {
    name: 'Ranger',
    hitDie: 10,
    primaryAbility: 'wisdom',
    savingThrows: ['strength', 'dexterity'],
    armorProficiencies: ['light', 'medium', 'shields'],
    weaponProficiencies: ['simple', 'martial'],
    skillChoices: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    skillCount: 3,
    spellcasting: { ability: 'wisdom', type: 'known', ritual: false, halfCaster: true },
    features: {
      1: ['Favored Enemy', 'Natural Explorer'],
      2: ['Fighting Style', 'Spellcasting'],
      3: ['Ranger Archetype', 'Primeval Awareness'],
      4: ['ASI'],
      5: ['Extra Attack'],
      6: ['Favored Enemy Improvement', 'Natural Explorer Improvement'],
      7: ['Archetype Feature'],
      8: ['ASI', "Land's Stride"],
      9: ['---'],
      10: ['Natural Explorer Improvement', 'Hide in Plain Sight'],
      11: ['Archetype Feature'],
      12: ['ASI'],
      13: ['---'],
      14: ['Favored Enemy Improvement', 'Vanish'],
      15: ['Archetype Feature'],
      16: ['ASI'],
      17: ['---'],
      18: ['Feral Senses'],
      19: ['ASI'],
      20: ['Foe Slayer']
    },
    subclasses: ['Hunter', 'Beast Master', 'Gloom Stalker', 'Horizon Walker', 'Monster Slayer', 'Fey Wanderer', 'Swarmkeeper', 'Drakewarden'],
    multiclassRequirements: { dexterity: 13, wisdom: 13 }
  },
  Rogue: {
    name: 'Rogue',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrows: ['dexterity', 'intelligence'],
    armorProficiencies: ['light'],
    weaponProficiencies: ['simple', 'hand crossbow', 'longsword', 'rapier', 'shortsword'],
    skillChoices: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    skillCount: 4,
    features: {
      1: ['Expertise', 'Sneak Attack (1d6)', "Thieves' Cant"],
      2: ['Cunning Action'],
      3: ['Roguish Archetype', 'Sneak Attack (2d6)'],
      4: ['ASI'],
      5: ['Uncanny Dodge', 'Sneak Attack (3d6)'],
      6: ['Expertise'],
      7: ['Evasion', 'Sneak Attack (4d6)'],
      8: ['ASI'],
      9: ['Archetype Feature', 'Sneak Attack (5d6)'],
      10: ['ASI'],
      11: ['Reliable Talent', 'Sneak Attack (6d6)'],
      12: ['ASI'],
      13: ['Archetype Feature', 'Sneak Attack (7d6)'],
      14: ['Blindsense'],
      15: ['Slippery Mind', 'Sneak Attack (8d6)'],
      16: ['ASI'],
      17: ['Archetype Feature', 'Sneak Attack (9d6)'],
      18: ['Elusive'],
      19: ['ASI', 'Sneak Attack (10d6)'],
      20: ['Stroke of Luck']
    },
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster', 'Inquisitive', 'Mastermind', 'Scout', 'Swashbuckler', 'Phantom', 'Soulknife'],
    multiclassRequirements: { dexterity: 13 }
  },
  Sorcerer: {
    name: 'Sorcerer',
    hitDie: 6,
    primaryAbility: 'charisma',
    savingThrows: ['constitution', 'charisma'],
    armorProficiencies: [],
    weaponProficiencies: ['dagger', 'dart', 'sling', 'quarterstaff', 'light crossbow'],
    skillChoices: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    skillCount: 2,
    spellcasting: { ability: 'charisma', type: 'known', ritual: false },
    features: {
      1: ['Spellcasting', 'Sorcerous Origin'],
      2: ['Font of Magic'],
      3: ['Metamagic'],
      4: ['ASI'],
      5: ['---'],
      6: ['Origin Feature'],
      7: ['---'],
      8: ['ASI'],
      9: ['---'],
      10: ['Metamagic'],
      11: ['---'],
      12: ['ASI'],
      13: ['---'],
      14: ['Origin Feature'],
      15: ['---'],
      16: ['ASI'],
      17: ['Metamagic'],
      18: ['Origin Feature'],
      19: ['ASI'],
      20: ['Sorcerous Restoration']
    },
    subclasses: ['Draconic Bloodline', 'Wild Magic', 'Divine Soul', 'Shadow Magic', 'Storm Sorcery', 'Aberrant Mind', 'Clockwork Soul'],
    multiclassRequirements: { charisma: 13 }
  },
  Warlock: {
    name: 'Warlock',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrows: ['wisdom', 'charisma'],
    armorProficiencies: ['light'],
    weaponProficiencies: ['simple'],
    skillChoices: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    skillCount: 2,
    spellcasting: { ability: 'charisma', type: 'known', ritual: false, pactMagic: true },
    features: {
      1: ['Otherworldly Patron', 'Pact Magic'],
      2: ['Eldritch Invocations'],
      3: ['Pact Boon'],
      4: ['ASI'],
      5: ['---'],
      6: ['Patron Feature'],
      7: ['---'],
      8: ['ASI'],
      9: ['---'],
      10: ['Patron Feature'],
      11: ['Mystic Arcanum (6th)'],
      12: ['ASI'],
      13: ['Mystic Arcanum (7th)'],
      14: ['Patron Feature'],
      15: ['Mystic Arcanum (8th)'],
      16: ['ASI'],
      17: ['Mystic Arcanum (9th)'],
      18: ['---'],
      19: ['ASI'],
      20: ['Eldritch Master']
    },
    subclasses: ['The Archfey', 'The Fiend', 'The Great Old One', 'The Celestial', 'The Hexblade', 'The Fathomless', 'The Genie', 'The Undead'],
    multiclassRequirements: { charisma: 13 }
  },
  Wizard: {
    name: 'Wizard',
    hitDie: 6,
    primaryAbility: 'intelligence',
    savingThrows: ['intelligence', 'wisdom'],
    armorProficiencies: [],
    weaponProficiencies: ['dagger', 'dart', 'sling', 'quarterstaff', 'light crossbow'],
    skillChoices: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    skillCount: 2,
    spellcasting: { ability: 'intelligence', type: 'prepared', ritual: true },
    features: {
      1: ['Spellcasting', 'Arcane Recovery'],
      2: ['Arcane Tradition'],
      3: ['---'],
      4: ['ASI'],
      5: ['---'],
      6: ['Tradition Feature'],
      7: ['---'],
      8: ['ASI'],
      9: ['---'],
      10: ['Tradition Feature'],
      11: ['---'],
      12: ['ASI'],
      13: ['---'],
      14: ['Tradition Feature'],
      15: ['---'],
      16: ['ASI'],
      17: ['---'],
      18: ['Spell Mastery'],
      19: ['ASI'],
      20: ['Signature Spells']
    },
    subclasses: ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation', 'Bladesinging', 'War Magic', 'Chronurgy Magic', 'Graviturgy Magic', 'Order of Scribes'],
    multiclassRequirements: { intelligence: 13 }
  }
};

// ============================================
// BACKGROUNDS (2024 style with origin feats)
// ============================================

export const BACKGROUNDS = {
  // 2014 Backgrounds (simpler)
  Acolyte: {
    name: 'Acolyte',
    description: 'Served in a temple',
    skillProficiencies: ['Insight', 'Religion'],
    languages: 2,
    equipment: ['Holy symbol', 'Prayer book', 'Incense (5 sticks)', 'Vestments', 'Common clothes', '15 gp'],
    feature: 'Shelter of the Faithful',
    // 2024 additions
    asi2024: { wisdom: 2, intelligence: 1 },
    originFeat2024: 'Magic Initiate (Cleric)'
  },
  Criminal: {
    name: 'Criminal',
    description: 'Life of crime',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiencies: ["Thieves' tools", 'Gaming set'],
    equipment: ['Crowbar', 'Dark common clothes with hood', '15 gp'],
    feature: 'Criminal Contact',
    asi2024: { dexterity: 2, intelligence: 1 },
    originFeat2024: 'Alert'
  },
  Entertainer: {
    name: 'Entertainer',
    description: 'Performance artist',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiencies: ['Disguise kit', 'Musical instrument'],
    equipment: ['Musical instrument', 'Favor from admirer', 'Costume', '15 gp'],
    feature: 'By Popular Demand',
    asi2024: { charisma: 2, dexterity: 1 },
    originFeat2024: 'Musician'
  },
  'Folk Hero': {
    name: 'Folk Hero',
    description: 'Champion of the common people',
    skillProficiencies: ['Animal Handling', 'Survival'],
    toolProficiencies: ['Artisan tools', 'Vehicles (land)'],
    equipment: ['Artisan tools', 'Shovel', 'Iron pot', 'Common clothes', '10 gp'],
    feature: 'Rustic Hospitality',
    asi2024: { constitution: 2, wisdom: 1 },
    originFeat2024: 'Tough'
  },
  'Guild Artisan': {
    name: 'Guild Artisan',
    description: 'Member of an artisan guild',
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiencies: ['Artisan tools'],
    languages: 1,
    equipment: ['Artisan tools', 'Letter of introduction', 'Traveler clothes', '15 gp'],
    feature: 'Guild Membership',
    asi2024: { intelligence: 2, charisma: 1 },
    originFeat2024: 'Crafter'
  },
  Hermit: {
    name: 'Hermit',
    description: 'Lived in seclusion',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiencies: ['Herbalism kit'],
    languages: 1,
    equipment: ['Scroll case with notes', 'Winter blanket', 'Common clothes', 'Herbalism kit', '5 gp'],
    feature: 'Discovery',
    asi2024: { wisdom: 2, constitution: 1 },
    originFeat2024: 'Healer'
  },
  Noble: {
    name: 'Noble',
    description: 'Born to privilege',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiencies: ['Gaming set'],
    languages: 1,
    equipment: ['Fine clothes', 'Signet ring', 'Scroll of pedigree', '25 gp'],
    feature: 'Position of Privilege',
    asi2024: { charisma: 2, intelligence: 1 },
    originFeat2024: 'Skilled'
  },
  Outlander: {
    name: 'Outlander',
    description: 'Grew up in the wilds',
    skillProficiencies: ['Athletics', 'Survival'],
    toolProficiencies: ['Musical instrument'],
    languages: 1,
    equipment: ['Staff', 'Hunting trap', 'Trophy', 'Traveler clothes', '10 gp'],
    feature: 'Wanderer',
    asi2024: { wisdom: 2, strength: 1 },
    originFeat2024: 'Alert'
  },
  Sage: {
    name: 'Sage',
    description: 'Devoted to scholarly pursuits',
    skillProficiencies: ['Arcana', 'History'],
    languages: 2,
    equipment: ['Bottle of ink', 'Quill', 'Small knife', 'Letter from dead colleague', 'Common clothes', '10 gp'],
    feature: 'Researcher',
    asi2024: { intelligence: 2, wisdom: 1 },
    originFeat2024: 'Magic Initiate (Wizard)'
  },
  Sailor: {
    name: 'Sailor',
    description: 'Life at sea',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiencies: ["Navigator's tools", 'Vehicles (water)'],
    equipment: ['Belaying pin', '50 ft silk rope', 'Lucky charm', 'Common clothes', '10 gp'],
    feature: "Ship's Passage",
    asi2024: { dexterity: 2, wisdom: 1 },
    originFeat2024: 'Tavern Brawler'
  },
  Soldier: {
    name: 'Soldier',
    description: 'Military service',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiencies: ['Gaming set', 'Vehicles (land)'],
    equipment: ['Insignia of rank', 'Trophy', 'Dice or cards', 'Common clothes', '10 gp'],
    feature: 'Military Rank',
    asi2024: { strength: 2, constitution: 1 },
    originFeat2024: 'Savage Attacker'
  },
  Urchin: {
    name: 'Urchin',
    description: 'Grew up on the streets',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiencies: ['Disguise kit', "Thieves' tools"],
    equipment: ['Small knife', 'Map of home city', 'Pet mouse', 'Token from parents', 'Common clothes', '10 gp'],
    feature: 'City Secrets',
    asi2024: { dexterity: 2, wisdom: 1 },
    originFeat2024: 'Lucky'
  }
};

// ============================================
// MULTICLASSING
// ============================================

export const MULTICLASS_REQUIREMENTS = {
  Barbarian: { strength: 13 },
  Bard: { charisma: 13 },
  Cleric: { wisdom: 13 },
  Druid: { wisdom: 13 },
  Fighter: { strength: 13, dexterity: 13, or: true },
  Monk: { dexterity: 13, wisdom: 13 },
  Paladin: { strength: 13, charisma: 13 },
  Ranger: { dexterity: 13, wisdom: 13 },
  Rogue: { dexterity: 13 },
  Sorcerer: { charisma: 13 },
  Warlock: { charisma: 13 },
  Wizard: { intelligence: 13 }
};

export const MULTICLASS_PROFICIENCIES = {
  Barbarian: { armor: ['shields'], weapons: ['simple', 'martial'] },
  Bard: { armor: ['light'], weapons: [], skills: 1 },
  Cleric: { armor: ['light', 'medium', 'shields'], weapons: [] },
  Druid: { armor: ['light', 'medium', 'shields (nonmetal)'], weapons: [] },
  Fighter: { armor: ['light', 'medium', 'shields'], weapons: ['simple', 'martial'] },
  Monk: { armor: [], weapons: ['simple', 'shortsword'] },
  Paladin: { armor: ['light', 'medium', 'shields'], weapons: ['simple', 'martial'] },
  Ranger: { armor: ['light', 'medium', 'shields'], weapons: ['simple', 'martial'], skills: 1 },
  Rogue: { armor: ['light'], weapons: [], skills: 1 },
  Sorcerer: { armor: [], weapons: [] },
  Warlock: { armor: ['light'], weapons: ['simple'] },
  Wizard: { armor: [], weapons: [] }
};

// Check if character can multiclass into a class
export const canMulticlassInto = (stats, targetClass) => {
  const reqs = MULTICLASS_REQUIREMENTS[targetClass];
  if (!reqs) return false;
  
  if (reqs.or) {
    // OR requirement (like Fighter: STR 13 OR DEX 13)
    return Object.entries(reqs).some(([stat, min]) => {
      if (stat === 'or') return false;
      return stats[stat] >= min;
    });
  }
  
  // AND requirements (all must be met)
  return Object.entries(reqs).every(([stat, min]) => {
    if (stat === 'or') return true;
    return stats[stat] >= min;
  });
};

// Check if character can multiclass out of their current class
export const canMulticlassFrom = (stats, currentClass) => {
  return canMulticlassInto(stats, currentClass);
};

// Get available classes for multiclassing
export const getMulticlassOptions = (stats, currentClasses) => {
  // Must meet requirements of all current classes to multiclass at all
  const canLeave = currentClasses.every(cls => canMulticlassFrom(stats, cls));
  if (!canLeave) return [];
  
  return Object.keys(CLASSES).filter(cls => {
    // Can't take a class you already have (would just be adding levels)
    // Actually in D&D you CAN add levels to existing multiclass, so filter out nothing
    return canMulticlassInto(stats, cls);
  });
};

// ============================================
// LEVEL UP RULES
// ============================================

export const HIT_DICE = {
  Barbarian: 12,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Fighter: 10,
  Monk: 8,
  Paladin: 10,
  Ranger: 10,
  Rogue: 8,
  Sorcerer: 6,
  Warlock: 8,
  Wizard: 6
};

export const PROFICIENCY_BONUS = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6
};

// ASI levels (some classes get extra)
export const ASI_LEVELS = {
  default: [4, 8, 12, 16, 19],
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 10, 12, 16, 19]
};

export const getASILevels = (className) => ASI_LEVELS[className] || ASI_LEVELS.default;

// Calculate total character level from class levels
export const getTotalLevel = (classLevels) => {
  return Object.values(classLevels).reduce((sum, level) => sum + level, 0);
};

// Get proficiency bonus based on total level
export const getProficiencyBonus = (totalLevel) => {
  return PROFICIENCY_BONUS[Math.min(20, Math.max(1, totalLevel))] || 2;
};

// Calculate multiclass spellcaster level
export const getSpellcasterLevel = (classLevels) => {
  let level = 0;
  
  Object.entries(classLevels).forEach(([className, classLevel]) => {
    const classData = CLASSES[className];
    if (!classData?.spellcasting) return;
    
    if (classData.spellcasting.pactMagic) {
      // Warlock doesn't add to multiclass spellcasting
      return;
    }
    
    if (classData.spellcasting.halfCaster) {
      // Paladin, Ranger: half level (rounded down)
      level += Math.floor(classLevel / 2);
    } else if (className === 'Fighter' || className === 'Rogue') {
      // Eldritch Knight, Arcane Trickster: 1/3 level (rounded down)
      level += Math.floor(classLevel / 3);
    } else {
      // Full caster
      level += classLevel;
    }
  });
  
  return level;
};

export default {
  EDITIONS,
  RACES,
  CLASSES,
  BACKGROUNDS,
  MULTICLASS_REQUIREMENTS,
  MULTICLASS_PROFICIENCIES,
  HIT_DICE,
  PROFICIENCY_BONUS,
  ASI_LEVELS,
  canMulticlassInto,
  canMulticlassFrom,
  getMulticlassOptions,
  getASILevels,
  getTotalLevel,
  getProficiencyBonus,
  getSpellcasterLevel
};
