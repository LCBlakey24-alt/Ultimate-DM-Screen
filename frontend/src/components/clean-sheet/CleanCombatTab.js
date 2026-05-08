import React, { useMemo, useState } from 'react';

const mod = (score = 10) => Math.floor((Number(score || 10) - 10) / 2);
const fmt = (value) => (value >= 0 ? `+${value}` : `${value}`);

const WEAPON_FALLBACKS = {
  dagger: { count: 1, sides: 4, ability: 'dexterity' },
  club: { count: 1, sides: 4, ability: 'strength' },
  mace: { count: 1, sides: 6, ability: 'strength' },
  shortsword: { count: 1, sides: 6, ability: 'dexterity' },
  scimitar: { count: 1, sides: 6, ability: 'dexterity' },
  handaxe: { count: 1, sides: 6, ability: 'strength' },
  spear: { count: 1, sides: 6, ability: 'strength' },
  quarterstaff: { count: 1, sides: 6, ability: 'strength' },
  longsword: { count: 1, sides: 8, ability: 'strength' },
  rapier: { count: 1, sides: 8, ability: 'dexterity' },
  warhammer: { count: 1, sides: 8, ability: 'strength' },
  battleaxe: { count: 1, sides: 8, ability: 'strength' },
  longbow: { count: 1, sides: 8, ability: 'dexterity' },
  shortbow: { count: 1, sides: 6, ability: 'dexterity' },
  crossbow: { count: 1, sides: 8, ability: 'dexterity' },
  greatsword: { count: 2, sides: 6, ability: 'strength' },
  greataxe: { count: 1, sides: 12, ability: 'strength' },
  glaive: { count: 1, sides: 10, ability: 'strength' },
  halberd: { count: 1, sides: 10, ability: 'strength' },
};

function rollDice(count = 1, sides = 8, modifier = 0) {
  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = Math.max(1, rolls.reduce((sum, value) => sum + value, 0) + modifier);
  return { rolls, total, notation: `${count}d${sides}${modifier ? ` ${fmt(modifier)}` : ''}` };
}

function parseDamageDice(value) {
  if (!value) return null;
  const text = typeof value === 'string' ? value : String(value);
  const match = text.match(/(\d+)d(\d+)/i);
  if (!match) return null;
  return { count: Number(match[1]), sides: Number(match[2]) };
}

function normaliseName(name = '') {
  return String(name).toLowerCase().replace(/[^a-z]/g, '');
}

function getItemName(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.name || item.item_name || item.label || item.title || '';
}

function isWeaponLike(item) {
  const name = normaliseName(getItemName(item));
  const type = normaliseName(item?.type || item?.category || item?.item_type || '');
  return type.includes('weapon') || Boolean(WEAPON_FALLBACKS[name]) || Object.keys(WEAPON_FALLBACKS).some(key => name.includes(key));
}

function getWeaponProfile(item, strengthMod, dexterityMod, bestAbilityMod) {
  const name = getItemName(item) || 'Weapon Attack';
  const normalised = normaliseName(name);
  const fallbackKey = Object.keys(WEAPON_FALLBACKS).find(key => normalised.includes(key));
  const fallback = fallbackKey ? WEAPON_FALLBACKS[fallbackKey] : null;
  const dice = parseDamageDice(item?.damage || item?.damage_dice || item?.dice || item?.damageDice) || fallback || { count: 1, sides: 8 };
  const ability = item?.ability || item?.attack_ability || fallback?.ability || 'best';
  const abilityMod = ability === 'strength'
    ? strengthMod
    : ability === 'dexterity'
      ? dexterityMod
      : bestAbilityMod;

  return {
    id: `weapon-${normalised || Math.random()}`,
    title: name,
    type: 'Action',
    attackLabel: `${name} Attack`,
    description: `Roll d20 ${fmt(abilityMod)} + proficiency to hit. Damage ${dice.count}d${dice.sides} ${fmt(abilityMod)}.`,
    attackMod: abilityMod,
    damage: { label: `${name} Damage`, count: dice.count, sides: dice.sides, modifier: abilityMod }
  };
}

function gatherEquippedWeapons(character, strengthMod, dexterityMod, bestAbilityMod) {
  const candidates = [];
  const equipped = character?.equipped || {};

  ['mainHand', 'main_hand', 'weapon', 'offHand', 'off_hand'].forEach(key => {
    if (equipped?.[key]) candidates.push(equipped[key]);
  });

  [...(character?.equipment || []), ...(character?.inventory || [])].forEach(item => {
    if (item?.equipped || item?.is_equipped) candidates.push(item);
  });

  const weapons = candidates.filter(isWeaponLike).map(item => getWeaponProfile(item, strengthMod, dexterityMod, bestAbilityMod));
  const seen = new Set();
  return weapons.filter(weapon => {
    const key = weapon.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function CombatActionCard({ title, description, type = 'Action', onClick, children }) {
  return (
    <div className="clean-sheet-action-card-shell">
      <button type="button" className="clean-sheet-action-card" onClick={onClick}>
        <span className="clean-sheet-action-type">{type}</span>
        <strong>{title}</strong>
        <span>{description}</span>
      </button>
      {children}
    </div>
  );
}

function ActionSection({ title, children }) {
  return (
    <section className="clean-sheet-panel clean-sheet-wide">
      <h2>{title}</h2>
      <div className="clean-sheet-action-grid">
        {children}
      </div>
    </section>
  );
}

export default function CleanCombatTab({ character, ac, speed, proficiencyBonus, onRoll }) {
  const [pendingDamage, setPendingDamage] = useState(null);
  const [lastDamage, setLastDamage] = useState(null);
  const strengthMod = mod(character?.strength);
  const dexterityMod = mod(character?.dexterity);
  const bestAbilityMod = Math.max(strengthMod, dexterityMod);
  const bestAttackMod = proficiencyBonus + bestAbilityMod;
  const unarmedDamageMod = Math.max(0, strengthMod);
  const className = character?.character_class || 'Adventurer';

  const equippedWeaponAttacks = useMemo(
    () => gatherEquippedWeapons(character, strengthMod, dexterityMod, bestAbilityMod),
    [character, strengthMod, dexterityMod, bestAbilityMod]
  );

  const attackOptions = useMemo(() => ([
    ...(equippedWeaponAttacks.length > 0 ? equippedWeaponAttacks : [{
      id: 'main-attack',
      title: 'Weapon Attack',
      type: 'Action',
      attackLabel: 'Weapon Attack',
      description: `Fallback weapon attack. Roll d20 ${fmt(bestAttackMod)} to hit.`,
      attackMod: bestAttackMod,
      damage: { label: 'Weapon Damage', count: 1, sides: 8, modifier: bestAbilityMod }
    }]),
    {
      id: 'unarmed-strike',
      title: 'Unarmed Strike',
      type: 'Action',
      attackLabel: 'Unarmed Strike',
      description: `Punch, kick, headbutt or similar. Roll d20 ${fmt(proficiencyBonus + strengthMod)} to hit.`,
      attackMod: proficiencyBonus + strengthMod,
      damage: { label: 'Unarmed Damage', count: 1, sides: 1, modifier: unarmedDamageMod }
    }
  ]), [bestAbilityMod, bestAttackMod, equippedWeaponAttacks, proficiencyBonus, strengthMod, unarmedDamageMod]);

  const rollAttack = (attack) => {
    onRoll(attack.attackLabel, attack.attackMod ?? bestAttackMod);
    setPendingDamage(attack.damage);
    setLastDamage(null);
  };

  const rollDamage = (damage) => {
    const result = rollDice(damage.count, damage.sides, damage.modifier);
    setLastDamage({ ...damage, ...result });
    setPendingDamage(null);
  };

  return (
    <div className="clean-sheet-combat-wrap">
      <div className="clean-sheet-grid">
        <ActionSection title="Actions">
          {attackOptions.map(attack => (
            <CombatActionCard
              key={attack.id}
              title={attack.title}
              type={attack.type}
              description={attack.description}
              onClick={() => rollAttack(attack)}
            >
              {pendingDamage?.label === attack.damage.label && (
                <button type="button" className="clean-sheet-damage-button" onClick={() => rollDamage(attack.damage)}>
                  Roll Damage
                </button>
              )}
            </CombatActionCard>
          ))}
          <CombatActionCard title="Dash" type="Action" description="Gain extra movement equal to your speed this turn." />
          <CombatActionCard title="Disengage" type="Action" description="Your movement does not provoke opportunity attacks this turn." />
          <CombatActionCard title="Dodge" type="Action" description="Attack rolls against you have disadvantage until your next turn." />
          <CombatActionCard title="Help" type="Action" description="Give an ally advantage on a relevant check or attack." />
          <CombatActionCard title="Ready" type="Action" description="Prepare an action to trigger later this round." />
        </ActionSection>

        <ActionSection title="Bonus Actions">
          <CombatActionCard title="Off-hand Attack" type="Bonus" description="Use when dual-wielding after taking the Attack action." onClick={() => onRoll('Off-hand Attack', bestAttackMod)} />
          {className === 'Rogue' && <CombatActionCard title="Cunning Action" type="Bonus" description="Dash, Disengage, or Hide as a bonus action." />}
          {className === 'Monk' && <CombatActionCard title="Martial Arts" type="Bonus" description="Make one unarmed strike after attacking with a monk weapon or unarmed strike." onClick={() => onRoll('Martial Arts', bestAttackMod)} />}
          {className === 'Barbarian' && <CombatActionCard title="Rage" type="Bonus" description="Enter a rage if you have uses remaining." />}
          {className === 'Fighter' && <CombatActionCard title="Second Wind" type="Bonus" description="Regain hit points once per rest if available." />}
          <CombatActionCard title="Use Class Feature" type="Bonus" description="Use any bonus action feature granted by class, race, feat, or spell." />
        </ActionSection>

        <ActionSection title="Reactions">
          <CombatActionCard title="Opportunity Attack" type="Reaction" description="Attack a creature that leaves your reach." onClick={() => onRoll('Opportunity Attack', bestAttackMod)} />
          <CombatActionCard title="Readied Action" type="Reaction" description="Use your reaction to trigger a previously readied action." />
          <CombatActionCard title="Use Reaction Feature" type="Reaction" description="Use a reaction from a class feature, race, feat, spell, or item." />
        </ActionSection>

        <section className="clean-sheet-panel clean-sheet-wide">
          <h2>Combat Summary</h2>
          <div className="clean-sheet-combat-summary">
            <div><span>Armor Class</span><strong>{ac}</strong></div>
            <div><span>Speed</span><strong>{speed}ft</strong></div>
            <div><span>Proficiency</span><strong>{fmt(proficiencyBonus)}</strong></div>
            <div><span>Best Attack</span><strong>{fmt(bestAttackMod)}</strong></div>
          </div>
          {lastDamage && (
            <div className="clean-sheet-damage-result">
              <span>{lastDamage.label}</span>
              <strong>{lastDamage.total}</strong>
              <em>{lastDamage.notation} ({lastDamage.rolls.join(' + ')})</em>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
