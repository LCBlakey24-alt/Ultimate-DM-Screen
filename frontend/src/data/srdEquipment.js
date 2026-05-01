// SRD 5.1 Equipment Reference — Open Game License Content
// Source: SRD 5.1 / Creative Commons Attribution 4.0
// These tables are for GM quick-reference during live play.

// ─── WEAPONS ─────────────────────────────────────────────────────────────
// cost in gp, weight in lb
export const SIMPLE_MELEE_WEAPONS = [
  { name: 'Club',          cost: 0.1, damage: '1d4 bludgeoning', weight: 2, properties: ['Light'] },
  { name: 'Dagger',        cost: 2,   damage: '1d4 piercing',     weight: 1, properties: ['Finesse', 'Light', 'Thrown (20/60)'] },
  { name: 'Greatclub',     cost: 0.2, damage: '1d8 bludgeoning',  weight: 10, properties: ['Two-Handed'] },
  { name: 'Handaxe',       cost: 5,   damage: '1d6 slashing',     weight: 2, properties: ['Light', 'Thrown (20/60)'] },
  { name: 'Javelin',       cost: 0.5, damage: '1d6 piercing',     weight: 2, properties: ['Thrown (30/120)'] },
  { name: 'Light Hammer',  cost: 2,   damage: '1d4 bludgeoning',  weight: 2, properties: ['Light', 'Thrown (20/60)'] },
  { name: 'Mace',          cost: 5,   damage: '1d6 bludgeoning',  weight: 4, properties: [] },
  { name: 'Quarterstaff',  cost: 0.2, damage: '1d6 bludgeoning',  weight: 4, properties: ['Versatile (1d8)'] },
  { name: 'Sickle',        cost: 1,   damage: '1d4 slashing',     weight: 2, properties: ['Light'] },
  { name: 'Spear',         cost: 1,   damage: '1d6 piercing',     weight: 3, properties: ['Thrown (20/60)', 'Versatile (1d8)'] },
];

export const SIMPLE_RANGED_WEAPONS = [
  { name: 'Crossbow, light', cost: 25,  damage: '1d8 piercing',    weight: 5,   properties: ['Ammunition (80/320)', 'Loading', 'Two-Handed'] },
  { name: 'Dart',            cost: 0.05, damage: '1d4 piercing',   weight: 0.25, properties: ['Finesse', 'Thrown (20/60)'] },
  { name: 'Shortbow',        cost: 25,  damage: '1d6 piercing',    weight: 2,   properties: ['Ammunition (80/320)', 'Two-Handed'] },
  { name: 'Sling',           cost: 0.1, damage: '1d4 bludgeoning', weight: 0,   properties: ['Ammunition (30/120)'] },
];

export const MARTIAL_MELEE_WEAPONS = [
  { name: 'Battleaxe',   cost: 10, damage: '1d8 slashing',    weight: 4, properties: ['Versatile (1d10)'] },
  { name: 'Flail',       cost: 10, damage: '1d8 bludgeoning', weight: 2, properties: [] },
  { name: 'Glaive',      cost: 20, damage: '1d10 slashing',   weight: 6, properties: ['Heavy', 'Reach', 'Two-Handed'] },
  { name: 'Greataxe',    cost: 30, damage: '1d12 slashing',   weight: 7, properties: ['Heavy', 'Two-Handed'] },
  { name: 'Greatsword',  cost: 50, damage: '2d6 slashing',    weight: 6, properties: ['Heavy', 'Two-Handed'] },
  { name: 'Halberd',     cost: 20, damage: '1d10 slashing',   weight: 6, properties: ['Heavy', 'Reach', 'Two-Handed'] },
  { name: 'Lance',       cost: 10, damage: '1d12 piercing',   weight: 6, properties: ['Reach', 'Special'] },
  { name: 'Longsword',   cost: 15, damage: '1d8 slashing',    weight: 3, properties: ['Versatile (1d10)'] },
  { name: 'Maul',        cost: 10, damage: '2d6 bludgeoning', weight: 10, properties: ['Heavy', 'Two-Handed'] },
  { name: 'Morningstar', cost: 15, damage: '1d8 piercing',    weight: 4, properties: [] },
  { name: 'Pike',        cost: 5,  damage: '1d10 piercing',   weight: 18, properties: ['Heavy', 'Reach', 'Two-Handed'] },
  { name: 'Rapier',      cost: 25, damage: '1d8 piercing',    weight: 2, properties: ['Finesse'] },
  { name: 'Scimitar',    cost: 25, damage: '1d6 slashing',    weight: 3, properties: ['Finesse', 'Light'] },
  { name: 'Shortsword',  cost: 10, damage: '1d6 piercing',    weight: 2, properties: ['Finesse', 'Light'] },
  { name: 'Trident',     cost: 5,  damage: '1d6 piercing',    weight: 4, properties: ['Thrown (20/60)', 'Versatile (1d8)'] },
  { name: 'War pick',    cost: 5,  damage: '1d8 piercing',    weight: 2, properties: [] },
  { name: 'Warhammer',   cost: 15, damage: '1d8 bludgeoning', weight: 2, properties: ['Versatile (1d10)'] },
  { name: 'Whip',        cost: 2,  damage: '1d4 slashing',    weight: 3, properties: ['Finesse', 'Reach'] },
];

export const MARTIAL_RANGED_WEAPONS = [
  { name: 'Blowgun',         cost: 10, damage: '1 piercing',    weight: 1, properties: ['Ammunition (25/100)', 'Loading'] },
  { name: 'Crossbow, hand',  cost: 75, damage: '1d6 piercing',  weight: 3, properties: ['Ammunition (30/120)', 'Light', 'Loading'] },
  { name: 'Crossbow, heavy', cost: 50, damage: '1d10 piercing', weight: 18, properties: ['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'] },
  { name: 'Longbow',         cost: 50, damage: '1d8 piercing',  weight: 2, properties: ['Ammunition (150/600)', 'Heavy', 'Two-Handed'] },
  { name: 'Net',             cost: 1,  damage: '—',             weight: 3, properties: ['Special', 'Thrown (5/15)'] },
];

// Derived: Finesse / Thrown / Two-Handed / Light groups (for quick GM filter chips)
const hasProperty = (w, prop) => w.properties.some(p => p.toLowerCase().includes(prop.toLowerCase()));
export const ALL_WEAPONS = [
  ...SIMPLE_MELEE_WEAPONS.map(w => ({ ...w, category: 'Simple Melee' })),
  ...SIMPLE_RANGED_WEAPONS.map(w => ({ ...w, category: 'Simple Ranged' })),
  ...MARTIAL_MELEE_WEAPONS.map(w => ({ ...w, category: 'Martial Melee' })),
  ...MARTIAL_RANGED_WEAPONS.map(w => ({ ...w, category: 'Martial Ranged' })),
];
export const FINESSE_WEAPONS = ALL_WEAPONS.filter(w => hasProperty(w, 'finesse'));
export const THROWN_WEAPONS = ALL_WEAPONS.filter(w => hasProperty(w, 'thrown'));
export const TWO_HANDED_WEAPONS = ALL_WEAPONS.filter(w => hasProperty(w, 'two-handed'));
export const LIGHT_WEAPONS = ALL_WEAPONS.filter(w => hasProperty(w, 'light'));

// ─── ARMOR ───────────────────────────────────────────────────────────────
export const LIGHT_ARMOR = [
  { name: 'Padded',     cost: 5,   ac: '11 + Dex',    weight: 8,  strReq: 0,  stealth: 'Disadvantage', donTime: '1 minute' },
  { name: 'Leather',    cost: 10,  ac: '11 + Dex',    weight: 10, strReq: 0,  stealth: '—', donTime: '1 minute' },
  { name: 'Studded leather', cost: 45, ac: '12 + Dex', weight: 13, strReq: 0, stealth: '—', donTime: '1 minute' },
];

export const MEDIUM_ARMOR = [
  { name: 'Hide',       cost: 10,  ac: '12 + Dex (max 2)', weight: 12, strReq: 0, stealth: '—', donTime: '1 minute' },
  { name: 'Chain shirt', cost: 50, ac: '13 + Dex (max 2)', weight: 20, strReq: 0, stealth: '—', donTime: '1 minute' },
  { name: 'Scale mail', cost: 50,  ac: '14 + Dex (max 2)', weight: 45, strReq: 0, stealth: 'Disadvantage', donTime: '5 minutes' },
  { name: 'Breastplate', cost: 400, ac: '14 + Dex (max 2)', weight: 20, strReq: 0, stealth: '—', donTime: '5 minutes' },
  { name: 'Half plate', cost: 750, ac: '15 + Dex (max 2)', weight: 40, strReq: 0, stealth: 'Disadvantage', donTime: '5 minutes' },
];

export const HEAVY_ARMOR = [
  { name: 'Ring mail',  cost: 30,   ac: '14', weight: 40, strReq: 0, stealth: 'Disadvantage', donTime: '5 minutes' },
  { name: 'Chain mail', cost: 75,   ac: '16', weight: 55, strReq: 13, stealth: 'Disadvantage', donTime: '10 minutes' },
  { name: 'Splint',     cost: 200,  ac: '17', weight: 60, strReq: 15, stealth: 'Disadvantage', donTime: '10 minutes' },
  { name: 'Plate',      cost: 1500, ac: '18', weight: 65, strReq: 15, stealth: 'Disadvantage', donTime: '10 minutes' },
];

export const SHIELDS = [
  { name: 'Shield', cost: 10, ac: '+2', weight: 6, strReq: 0, stealth: '—', donTime: '1 action' },
];

// ─── ADVENTURING GEAR (SRD essentials) ───────────────────────────────────
export const ADVENTURING_GEAR = [
  { name: 'Abacus', cost: 2, weight: 2 },
  { name: 'Acid (vial)', cost: 25, weight: 1 },
  { name: 'Alchemist\'s fire (flask)', cost: 50, weight: 1 },
  { name: 'Arrows (20)', cost: 1, weight: 1 },
  { name: 'Backpack', cost: 2, weight: 5 },
  { name: 'Ball bearings (bag of 1,000)', cost: 1, weight: 2 },
  { name: 'Barrel', cost: 2, weight: 70 },
  { name: 'Basket', cost: 0.4, weight: 2 },
  { name: 'Bedroll', cost: 1, weight: 7 },
  { name: 'Bell', cost: 1, weight: 0 },
  { name: 'Blanket', cost: 0.5, weight: 3 },
  { name: 'Block and tackle', cost: 1, weight: 5 },
  { name: 'Book', cost: 25, weight: 5 },
  { name: 'Bottle, glass', cost: 2, weight: 2 },
  { name: 'Bucket', cost: 0.05, weight: 2 },
  { name: 'Caltrops (bag of 20)', cost: 1, weight: 2 },
  { name: 'Candle', cost: 0.01, weight: 0 },
  { name: 'Chain (10 feet)', cost: 5, weight: 10 },
  { name: 'Chalk (1 piece)', cost: 0.01, weight: 0 },
  { name: 'Chest', cost: 5, weight: 25 },
  { name: 'Climber\'s kit', cost: 25, weight: 12 },
  { name: 'Crowbar', cost: 2, weight: 5 },
  { name: 'Flask or tankard', cost: 0.02, weight: 1 },
  { name: 'Grappling hook', cost: 2, weight: 4 },
  { name: 'Hammer', cost: 1, weight: 3 },
  { name: 'Healer\'s kit', cost: 5, weight: 3 },
  { name: 'Holy symbol (amulet)', cost: 5, weight: 1 },
  { name: 'Hunting trap', cost: 5, weight: 25 },
  { name: 'Ink (1-ounce bottle)', cost: 10, weight: 0 },
  { name: 'Ink pen', cost: 0.02, weight: 0 },
  { name: 'Ladder (10-foot)', cost: 0.1, weight: 25 },
  { name: 'Lantern, bullseye', cost: 10, weight: 2 },
  { name: 'Lantern, hooded', cost: 5, weight: 2 },
  { name: 'Lock', cost: 10, weight: 1 },
  { name: 'Manacles', cost: 2, weight: 6 },
  { name: 'Mess kit', cost: 0.2, weight: 1 },
  { name: 'Mirror, steel', cost: 5, weight: 0.5 },
  { name: 'Oil (flask)', cost: 0.1, weight: 1 },
  { name: 'Paper (one sheet)', cost: 0.2, weight: 0 },
  { name: 'Parchment (one sheet)', cost: 0.1, weight: 0 },
  { name: 'Pick, miner\'s', cost: 2, weight: 10 },
  { name: 'Piton', cost: 0.05, weight: 0.25 },
  { name: 'Poison, basic (vial)', cost: 100, weight: 0 },
  { name: 'Pole (10-foot)', cost: 0.05, weight: 7 },
  { name: 'Pot, iron', cost: 2, weight: 10 },
  { name: 'Potion of healing', cost: 50, weight: 0.5 },
  { name: 'Pouch', cost: 0.5, weight: 1 },
  { name: 'Quiver', cost: 1, weight: 1 },
  { name: 'Ram, portable', cost: 4, weight: 35 },
  { name: 'Rations (1 day)', cost: 0.5, weight: 2 },
  { name: 'Robes', cost: 1, weight: 4 },
  { name: 'Rope, hempen (50 feet)', cost: 1, weight: 10 },
  { name: 'Rope, silk (50 feet)', cost: 10, weight: 5 },
  { name: 'Sack', cost: 0.01, weight: 0.5 },
  { name: 'Scale, merchant\'s', cost: 5, weight: 3 },
  { name: 'Shovel', cost: 2, weight: 5 },
  { name: 'Signal whistle', cost: 0.05, weight: 0 },
  { name: 'Signet ring', cost: 5, weight: 0 },
  { name: 'Soap', cost: 0.02, weight: 0 },
  { name: 'Spellbook', cost: 50, weight: 3 },
  { name: 'Spikes, iron (10)', cost: 1, weight: 5 },
  { name: 'Spyglass', cost: 1000, weight: 1 },
  { name: 'Tent, two-person', cost: 2, weight: 20 },
  { name: 'Tinderbox', cost: 0.5, weight: 1 },
  { name: 'Torch', cost: 0.01, weight: 1 },
  { name: 'Vial', cost: 1, weight: 0 },
  { name: 'Waterskin', cost: 0.2, weight: 5 },
  { name: 'Whetstone', cost: 0.01, weight: 1 },
];

// Weapon property reference text
export const WEAPON_PROPERTIES = [
  { name: 'Ammunition', description: 'You can use a weapon that has the ammunition property to make a ranged attack only if you have ammunition to fire from the weapon.' },
  { name: 'Finesse', description: 'When making an attack with a finesse weapon, you use your choice of your Strength or Dexterity modifier for the attack and damage rolls.' },
  { name: 'Heavy', description: 'Small creatures have disadvantage on attack rolls with heavy weapons.' },
  { name: 'Light', description: 'A light weapon is small and easy to handle, making it ideal for use when fighting with two weapons.' },
  { name: 'Loading', description: 'Because of the time required to load this weapon, you can fire only one piece of ammunition from it when you use an action, bonus action, or reaction.' },
  { name: 'Range', description: 'A weapon that can be used to make a ranged attack has a range in parentheses. The first number is the normal range; the second is the long range.' },
  { name: 'Reach', description: 'A reach weapon adds 5 feet to your reach when you attack with it.' },
  { name: 'Special', description: 'A weapon with the special property has unusual rules governing its use.' },
  { name: 'Thrown', description: 'If a weapon has the thrown property, you can throw the weapon to make a ranged attack.' },
  { name: 'Two-Handed', description: 'This weapon requires two hands when you attack with it.' },
  { name: 'Versatile', description: 'This weapon can be used with one or two hands. A damage value in parentheses appears with the property — the damage when the weapon is used with two hands.' },
];
