import { useState, useMemo } from 'react';
import { CLASS_RESOURCES, getResourceMax, getRestoreType, FEATURE_COSTS, FEATURE_TYPE_CONFIG } from '../data/classResources';
import { CLASS_FEATURES } from '../data/classFeatures';
import { ALL_WEAPONS, ARMOR } from '../data/equipmentDatabase';
import { SPELLCASTING_CLASSES, SPELL_SLOTS, PACT_MAGIC_SLOTS } from '../data/spellDatabase';

// 5e SRD conditions
const CONDITIONS = [
  { key: 'blinded', label: 'Blinded', desc: 'Auto-fail sight checks, attacks have disadvantage, attacks against have advantage' },
  { key: 'charmed', label: 'Charmed', desc: "Can't attack charmer, charmer has advantage on social checks" },
  { key: 'deafened', label: 'Deafened', desc: 'Auto-fail hearing checks' },
  { key: 'frightened', label: 'Frightened', desc: "Disadvantage on checks/attacks while source in sight, can't willingly move closer" },
  { key: 'grappled', label: 'Grappled', desc: 'Speed 0, ends if grappler incapacitated or you are moved away' },
  { key: 'incapacitated', label: 'Incapacitated', desc: "Can't take actions or reactions" },
  { key: 'invisible', label: 'Invisible', desc: 'Heavily obscured, advantage on attacks, attacks against have disadvantage' },
  { key: 'paralyzed', label: 'Paralyzed', desc: 'Incapacitated, auto-fail STR/DEX saves, attacks have advantage, melee crits' },
  { key: 'petrified', label: 'Petrified', desc: 'Turned to stone, weight x10, immune to poison/disease' },
  { key: 'poisoned', label: 'Poisoned', desc: 'Disadvantage on attacks and ability checks' },
  { key: 'prone', label: 'Prone', desc: 'Disadvantage on attacks, melee attacks have advantage, ranged have disadvantage' },
  { key: 'restrained', label: 'Restrained', desc: 'Speed 0, disadvantage on attacks/DEX saves, attacks against have advantage' },
  { key: 'stunned', label: 'Stunned', desc: 'Incapacitated, auto-fail STR/DEX saves, attacks have advantage' },
  { key: 'unconscious', label: 'Unconscious', desc: 'Drop what held, prone, incapacitated, auto-fail STR/DEX, advantage to hit, melee crits' },
  { key: 'exhaustion', label: 'Exhaustion', desc: 'Cumulative penalty levels (1-6)' },
  { key: 'concentrating', label: 'Concentrating', desc: 'Maintaining a spell. CON save on damage (DC = max of 10 or half damage)' },
];

export default function CharacterCombatTab({
  character, onUpdateCharacter, onUpdateResources, onRest, isGMMode
}) {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [restLoading, setRestLoading] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [activeConditions, setActiveConditions] = useState(character?.conditions || []);
  const [concentratingOn, setConcentratingOn] = useState(character?.concentrating_on || '');
  const [inspiration, setInspiration] = useState(character?.inspiration || false);

  const charClass = character?.character_class || '';
  const level = character?.level || 1;
  const profBonus = character?.proficiency_bonus || (2 + Math.floor((level - 1) / 4));
  const currentHp = character?.current_hit_points ?? 0;
  const maxHp = character?.max_hit_points ?? 1;

  const getMod = (score) => Math.floor(((score || 10) - 10) / 2);
  const strMod = getMod(character?.strength);
  const dexMod = getMod(character?.dexterity);
  const conMod = getMod(character?.constitution);
  const wisMod = getMod(character?.wisdom);
  const chaMod = getMod(character?.charisma);

  const HIT_DICE = { Barbarian:12, Fighter:10, Paladin:10, Ranger:10, Bard:8, Cleric:8, Druid:8, Monk:8, Rogue:8, Warlock:8, Sorcerer:6, Wizard:6 };
  const hitDieSize = HIT_DICE[charClass] || 8;
  const hitDiceRemaining = character?.hit_dice_remaining ?? level;

  // ─── Resources ────────────────────────────────────────────────
  const classResources = CLASS_RESOURCES[charClass] || [];
  const currentResources = character?.resources || {};

  function getResCurrent(res) {
    const max = getResourceMax(res, level, {
      strength: character?.strength, dexterity: character?.dexterity,
      constitution: character?.constitution, wisdom: character?.wisdom,
      charisma: character?.charisma, intelligence: character?.intelligence
    });
    if (res.minLevel && level < res.minLevel) return { current: 0, max: 0 };
    const current = currentResources[res.key] !== undefined ? currentResources[res.key] : max;
    return { current: Math.min(current, max), max };
  }

  function spendResource(resKey, amount = 1) {
    const updated = { ...currentResources };
    updated[resKey] = Math.max(0, (updated[resKey] ?? 999) - amount);
    onUpdateResources?.(updated);
  }
  function restoreResource(resKey, amount = 1) {
    const res = classResources.find(r => r.key === resKey);
    if (!res) return;
    const max = getResourceMax(res, level, {
      strength: character?.strength, dexterity: character?.dexterity,
      constitution: character?.constitution, wisdom: character?.wisdom,
      charisma: character?.charisma, intelligence: character?.intelligence
    });
    const updated = { ...currentResources };
    updated[resKey] = Math.min(max, (updated[resKey] ?? max) + amount);
    onUpdateResources?.(updated);
  }

  // ─── Spell Slots ──────────────────────────────────────────────
  const classInfo = SPELLCASTING_CLASSES[charClass];
  const spellSlots = useMemo(() => {
    if (!classInfo) return {};
    if (classInfo.pactMagic) return PACT_MAGIC_SLOTS[level] || {};
    if (classInfo.halfCaster) return SPELL_SLOTS[Math.floor(level / 2)] || {};
    return SPELL_SLOTS[level] || {};
  }, [charClass, level, classInfo]);

  const [usedSlots, setUsedSlots] = useState(character?.used_spell_slots || {});

  function toggleSlot(slotLevel, index) {
    setUsedSlots(prev => {
      const key = classInfo?.pactMagic ? 'pact' : String(slotLevel);
      const used = prev[key] || 0;
      const isUsed = used > index;
      const newVal = isUsed ? used - 1 : used + 1;
      const updated = { ...prev, [key]: newVal };
      // Persist to character
      onUpdateCharacter?.({ used_spell_slots: updated });
      return updated;
    });
  }

  // ─── Weapon Attacks ───────────────────────────────────────────
  const equipped = character?.equipped || {};

  function getWeaponAttacks() {
    const attacks = [];
    for (const slot of ['mainHand', 'offHand']) {
      const item = equipped[slot];
      if (!item) continue;
      const wpn = ALL_WEAPONS.find(w => w.name.toLowerCase() === (item.name || '').toLowerCase() || w.id === (item.id || '').toLowerCase());
      if (wpn) {
        const isRanged = wpn.category?.includes('ranged');
        const isFinesse = wpn.properties?.includes('finesse');
        const aMod = isRanged ? dexMod : (isFinesse ? Math.max(strMod, dexMod) : strMod);
        attacks.push({
          name: wpn.name, slot, toHit: `${aMod + profBonus >= 0 ? '+' : ''}${aMod + profBonus}`,
          damage: `${wpn.damage}${aMod >= 0 ? '+' : ''}${aMod}`, damageType: wpn.damageType,
          properties: wpn.properties || [], range: wpn.range,
          versatileDamage: wpn.versatileDamage ? `${wpn.versatileDamage}${aMod >= 0 ? '+' : ''}${aMod}` : null,
        });
      } else if (item.name) {
        attacks.push({ name: item.name, slot, toHit: `+${strMod + profBonus}`, damage: item.damage || '1d4', damageType: item.damageType || '—', properties: [] });
      }
    }
    // Monk unarmed gets martial arts die
    const monkDie = charClass === 'Monk' ? (level >= 17 ? '1d10' : level >= 11 ? '1d8' : level >= 5 ? '1d6' : '1d4') : null;
    attacks.push({
      name: 'Unarmed Strike', slot: 'unarmed',
      toHit: `+${strMod + profBonus}`,
      damage: monkDie ? `${monkDie}${dexMod >= 0 ? '+' : ''}${dexMod}` : `1${strMod >= 0 ? '+' : ''}${strMod}`,
      damageType: 'bludgeoning', properties: [], isUnarmed: true,
    });
    return attacks;
  }

  // ─── Features ─────────────────────────────────────────────────
  const classData = CLASS_FEATURES[charClass.toLowerCase()];
  const features = (classData?.features || []).filter(f => f.level <= level);

  function useFeature(feature) {
    const costInfo = FEATURE_COSTS[feature.name];
    if (!costInfo || !costInfo.resource) return;
    const res = classResources.find(r => r.key === costInfo.resource);
    if (!res) return;
    const { current } = getResCurrent(res);
    if (costInfo.cost === 'variable' || costInfo.cost === 'spell_slot') return;
    if (current <= 0) return;
    spendResource(costInfo.resource, costInfo.cost);
  }
  function canUseFeature(feature) {
    const costInfo = FEATURE_COSTS[feature.name];
    if (!costInfo || !costInfo.resource) return true;
    if (costInfo.cost === 'variable' || costInfo.cost === 'spell_slot') return true;
    const res = classResources.find(r => r.key === costInfo.resource);
    if (!res) return true;
    return getResCurrent(res).current > 0;
  }

  // ─── AC Calculation ───────────────────────────────────────────
  function computeAC() {
    const armor = equipped.armor;
    const shield = equipped.shield;
    let ac = 10 + dexMod;
    const lc = charClass.toLowerCase();
    if (lc === 'barbarian' && !armor) ac = 10 + dexMod + conMod;
    if (lc === 'monk' && !armor) ac = 10 + dexMod + wisMod;
    if (armor) {
      const allArmor = [...(ARMOR.light || []), ...(ARMOR.medium || []), ...(ARMOR.heavy || [])];
      const ad = allArmor.find(a => a.name.toLowerCase() === (armor.name || '').toLowerCase());
      if (ad) {
        ac = ad.category === 'heavy' ? ad.ac : (ad.maxDexBonus != null ? ad.ac + Math.min(dexMod, ad.maxDexBonus) : ad.ac + dexMod);
      } else {
        const m = (armor.name || '').match(/AC\s*(\d+)/i);
        if (m) ac = parseInt(m[1]);
      }
    }
    if (shield) ac += 2;
    return ac;
  }

  // ─── Death Saves ──────────────────────────────────────────────
  const [deathSuccesses, setDeathSuccesses] = useState(character?.death_saves_successes || 0);
  const [deathFailures, setDeathFailures] = useState(character?.death_saves_failures || 0);
  const isDown = currentHp <= 0;

  function toggleDeathSave(type, index) {
    if (type === 'success') {
      const newVal = deathSuccesses > index ? index : index + 1;
      setDeathSuccesses(newVal);
      onUpdateCharacter?.({ death_saves_successes: newVal });
    } else {
      const newVal = deathFailures > index ? index : index + 1;
      setDeathFailures(newVal);
      onUpdateCharacter?.({ death_saves_failures: newVal });
    }
  }

  // ─── Condition toggling ───────────────────────────────────────
  function toggleCondition(key) {
    setActiveConditions(prev => {
      const next = prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key];
      onUpdateCharacter?.({ conditions: next });
      if (key === 'concentrating' && !next.includes(key)) setConcentratingOn('');
      return next;
    });
  }

  // ─── Rest handlers ────────────────────────────────────────────
  async function handleRest(type) {
    setRestLoading(true);
    try {
      if (type === 'long') {
        setUsedSlots({});
        setDeathSuccesses(0);
        setDeathFailures(0);
        setActiveConditions(prev => prev.filter(c => c === 'exhaustion'));
      }
      if (type === 'short' && classInfo?.pactMagic) setUsedSlots({});
      await onRest?.(type);
    } finally { setRestLoading(false); }
  }

  const weaponAttacks = getWeaponAttacks();
  const ac = computeAC();
  const accent = isGMMode ? '#8A2BE2' : '#4DD0E1';

  return (
    <div data-testid="combat-tab" style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>

      {/* ── Quick Stats + Inspiration ── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <StatPill label="AC" value={ac} color={accent} />
        <StatPill label="HP" value={`${currentHp}/${maxHp}`} color={currentHp < maxHp / 2 ? '#EF4444' : '#22C55E'} />
        <StatPill label="Prof" value={`+${profBonus}`} color="#F59E0B" />
        <StatPill label="Init" value={`${dexMod >= 0 ? '+' : ''}${dexMod}`} color="#8B5CF6" />
        <StatPill label="Speed" value={character?.speed || 30} color="#6B7280" />
        {/* Inspiration */}
        <button
          data-testid="inspiration-toggle"
          onClick={() => { setInspiration(!inspiration); onUpdateCharacter?.({ inspiration: !inspiration }); }}
          style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
            background: inspiration ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${inspiration ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
            color: inspiration ? '#F59E0B' : '#6B7280', cursor: 'pointer', transition: 'all 0.15s',
          }}
          title="Inspiration: advantage on one roll"
        >
          {inspiration ? '★' : '☆'} Insp
        </button>
      </div>

      {/* ── Death Saves (only when HP ≤ 0) ── */}
      {isDown && (
        <div data-testid="death-saves" style={{
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', letterSpacing: 1 }}>DEATH SAVES</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>Pass</span>
            {[0,1,2].map(i => (
              <button key={i} onClick={() => toggleDeathSave('success', i)} style={{
                width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                border: `2px solid #22C55E`, background: i < deathSuccesses ? '#22C55E' : 'transparent',
                transition: 'all 0.15s',
              }} />
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>Fail</span>
            {[0,1,2].map(i => (
              <button key={i} onClick={() => toggleDeathSave('failure', i)} style={{
                width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
                border: `2px solid #EF4444`, background: i < deathFailures ? '#EF4444' : 'transparent',
                transition: 'all 0.15s',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── Active Conditions ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <button onClick={() => setShowConditions(!showConditions)} style={{
            fontSize: 10, fontWeight: 700, color: '#9CA3AF', cursor: 'pointer',
            background: 'none', border: 'none', letterSpacing: 1, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            Conditions {activeConditions.length > 0 && <span style={{ color: '#EF4444' }}>({activeConditions.length})</span>}
            <span style={{ fontSize: 8, transform: showConditions ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {/* Active condition pills */}
          {activeConditions.map(key => {
            const cond = CONDITIONS.find(c => c.key === key);
            return (
              <span key={key} onClick={() => toggleCondition(key)} style={{
                fontSize: 10, padding: '2px 6px', borderRadius: 4, cursor: 'pointer',
                background: key === 'concentrating' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.15)',
                color: key === 'concentrating' ? '#3B82F6' : '#EF4444', fontWeight: 600,
              }} title={cond?.desc}>
                {cond?.label || key} ×
              </span>
            );
          })}
        </div>
        {showConditions && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
            {CONDITIONS.map(c => (
              <button key={c.key} onClick={() => toggleCondition(c.key)} title={c.desc} style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                background: activeConditions.includes(c.key) ? (c.key === 'concentrating' ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.2)') : 'rgba(255,255,255,0.04)',
                color: activeConditions.includes(c.key) ? (c.key === 'concentrating' ? '#3B82F6' : '#EF4444') : '#9CA3AF',
                border: `1px solid ${activeConditions.includes(c.key) ? (c.key === 'concentrating' ? 'rgba(59,130,246,0.4)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.06)'}`,
                fontWeight: activeConditions.includes(c.key) ? 600 : 400,
              }}>
                {c.label}
              </button>
            ))}
          </div>
        )}
        {/* Concentration spell name */}
        {activeConditions.includes('concentrating') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '4px 8px', background: 'rgba(59,130,246,0.08)', borderRadius: 6 }}>
            <span style={{ fontSize: 11, color: '#3B82F6', fontWeight: 600 }}>Concentrating on:</span>
            <input
              value={concentratingOn}
              onChange={(e) => { setConcentratingOn(e.target.value); onUpdateCharacter?.({ concentrating_on: e.target.value }); }}
              placeholder="Spell name..."
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#E5E7EB', fontSize: 12, outline: 'none' }}
            />
            <span style={{ fontSize: 10, color: '#6B7280' }}>CON save on damage</span>
          </div>
        )}
      </div>

      {/* ── Weapon Attacks ── */}
      <Section title="Attacks" accent={accent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {weaponAttacks.map((atk, i) => (
            <div key={i} data-testid={`attack-${atk.slot}`} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6,
              background: atk.isUnarmed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)', opacity: atk.isUnarmed ? 0.7 : 1,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#E5E7EB' }}>{atk.name}</span>
              <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{atk.toHit}</span>
              <span style={{ padding: '1px 6px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{atk.damage} {atk.damageType}</span>
              {atk.range && <span style={{ fontSize: 10, color: '#6B7280' }}>{atk.range}</span>}
              {atk.versatileDamage && <span style={{ fontSize: 10, color: '#9CA3AF' }}>(2H: {atk.versatileDamage})</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Hit Dice + Class Resources ── */}
      <Section title="Resources" accent={accent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Hit Dice */}
          <ResourceRow
            name={`Hit Dice (d${hitDieSize})`}
            current={hitDiceRemaining} max={level}
            accent={accent} restLabel="short"
            onSpend={() => onUpdateCharacter?.({ hit_dice_remaining: Math.max(0, hitDiceRemaining - 1) })}
            onRestore={() => onUpdateCharacter?.({ hit_dice_remaining: Math.min(level, hitDiceRemaining + 1) })}
          />
          {/* Class Resources */}
          {classResources.map(res => {
            const { current, max } = getResCurrent(res);
            if (max === 0) return null;
            return (
              <ResourceRow key={res.key} name={res.name} current={current} max={max}
                accent={accent} restLabel={getRestoreType(res, level)}
                onSpend={() => spendResource(res.key)} onRestore={() => restoreResource(res.key)}
                testId={`resource-${res.key}`}
              />
            );
          })}
        </div>
      </Section>

      {/* ── Spell Slots (for casters) ── */}
      {classInfo && Object.keys(spellSlots).length > 0 && (
        <Section title={classInfo.pactMagic ? 'Pact Magic' : 'Spell Slots'} accent="#EC4899">
          {classInfo.pactMagic ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#9CA3AF', minWidth: 50 }}>Lvl {spellSlots.level}</span>
              {Array.from({ length: spellSlots.slots }).map((_, i) => {
                const isUsed = (usedSlots['pact'] || 0) > i;
                return (
                  <button key={i} onClick={() => toggleSlot('pact', i)} style={{
                    width: 22, height: 22, borderRadius: 6, cursor: 'pointer',
                    border: '2px solid #EC4899', background: isUsed ? 'rgba(100,100,100,0.3)' : 'rgba(236,72,153,0.3)',
                    color: isUsed ? '#6B7280' : '#EC4899', fontSize: 11, fontWeight: 700,
                    transition: 'all 0.15s',
                  }} title={isUsed ? 'Click to recover' : 'Click to use'}>
                    {isUsed ? '○' : '●'}
                  </button>
                );
              })}
              <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600, marginLeft: 4, padding: '1px 5px', borderRadius: 3, background: 'rgba(34,197,94,0.12)' }}>SHORT</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(spellSlots).map(([lvl, count]) => (
                <div key={lvl} style={{ padding: '6px 10px', background: 'rgba(236,72,153,0.06)', borderRadius: 8, minWidth: 60, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>Lvl {lvl}</div>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    {Array.from({ length: count }).map((_, i) => {
                      const isUsed = (usedSlots[lvl] || 0) > i;
                      return (
                        <button key={i} onClick={() => toggleSlot(lvl, i)} style={{
                          width: 18, height: 18, borderRadius: '50%', cursor: 'pointer',
                          border: '2px solid #EC4899', background: isUsed ? 'rgba(100,100,100,0.3)' : 'rgba(236,72,153,0.35)',
                          padding: 0, transition: 'all 0.15s',
                        }} title={isUsed ? 'Recover slot' : 'Use slot'} />
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 9, color: '#9CA3AF', marginTop: 3 }}>{count - (usedSlots[lvl] || 0)}/{count}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── Features & Abilities ── */}
      <Section title="Features & Abilities" accent={accent}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {features.map((feat, i) => {
            const typeConfig = FEATURE_TYPE_CONFIG[feat.type] || FEATURE_TYPE_CONFIG.passive;
            const costInfo = FEATURE_COSTS[feat.name];
            const canUse = canUseFeature(feat);
            const isExpanded = expandedFeature === i;
            return (
              <div key={i} data-testid={`feature-${feat.name.replace(/\s+/g, '-').toLowerCase()}`}>
                <div onClick={() => setExpandedFeature(isExpanded ? null : i)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 5,
                  background: isExpanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', opacity: canUse ? 1 : 0.4, borderLeft: `3px solid ${typeConfig.color}`, transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: typeConfig.bg, color: typeConfig.color, minWidth: 20, textAlign: 'center' }}>{typeConfig.short}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#E5E7EB', flex: 1 }}>{feat.name}</span>
                  {costInfo?.resource && (
                    <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: canUse ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: canUse ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>
                      {costInfo.cost === 'variable' ? 'var' : costInfo.cost === 'spell_slot' ? 'slot' : costInfo.cost}
                    </span>
                  )}
                  {costInfo?.resource && costInfo.cost !== 'variable' && costInfo.cost !== 'spell_slot' && (
                    <button onClick={(e) => { e.stopPropagation(); useFeature(feat); }} disabled={!canUse} style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 3, background: canUse ? accent : 'rgba(107,114,128,0.2)',
                      color: canUse ? '#fff' : '#6B7280', border: 'none', cursor: canUse ? 'pointer' : 'not-allowed', fontWeight: 600,
                    }}>Use</button>
                  )}
                  <span style={{ fontSize: 8, color: '#6B7280', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </div>
                {isExpanded && (
                  <div style={{ padding: '6px 8px 6px 32px', fontSize: 11, color: '#9CA3AF', lineHeight: 1.5, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {feat.description}
                    {feat.level > 1 && <span style={{ display: 'block', marginTop: 3, fontSize: 10, color: '#6B7280' }}>Unlocked at level {feat.level}</span>}
                  </div>
                )}
              </div>
            );
          })}
          {features.length === 0 && <div style={{ padding: 10, fontSize: 12, color: '#6B7280', textAlign: 'center' }}>No class features data for {charClass}</div>}
        </div>
      </Section>

      {/* ── Rest Buttons ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button data-testid="short-rest-btn" onClick={() => handleRest('short')} disabled={restLoading} style={{
          flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
          color: '#22C55E', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
        }}>
          Short Rest
          <span style={{ display: 'block', fontSize: 9, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>Hit dice + short-rest resources</span>
        </button>
        <button data-testid="long-rest-btn" onClick={() => handleRest('long')} disabled={restLoading} style={{
          flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
          color: '#3B82F6', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
        }}>
          Long Rest
          <span style={{ display: 'block', fontSize: 9, fontWeight: 400, opacity: 0.7, marginTop: 1 }}>Full HP, slots, all resources</span>
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: `${color}10`, border: `1px solid ${color}30` }}>
      <span style={{ fontSize: 9, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5, paddingLeft: 2 }}>{title}</div>
      {children}
    </div>
  );
}

function ResourceRow({ name, current, max, accent, restLabel, onSpend, onRestore, testId }) {
  if (max === 0) return null;
  return (
    <div data-testid={testId} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#D1D5DB', minWidth: 110 }}>{name}</span>
      <div style={{ display: 'flex', gap: 3, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        {max <= 20 ? (
          Array.from({ length: max }).map((_, i) => (
            <button key={i} onClick={() => i < current ? onSpend() : onRestore()} style={{
              width: 18, height: 18, borderRadius: '50%', border: `2px solid ${accent}`,
              background: i < current ? accent : 'transparent', cursor: 'pointer',
              opacity: i < current ? 1 : 0.3, transition: 'all 0.15s',
            }} title={i < current ? 'Spend' : 'Restore'} />
          ))
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => { for (let i = 0; i < 5; i++) onSpend(); }} style={numBtnStyle}>-5</button>
            <button onClick={onSpend} style={numBtnStyle}>-1</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: accent, minWidth: 44, textAlign: 'center' }}>{current}/{max}</span>
            <button onClick={onRestore} style={numBtnStyle}>+1</button>
            <button onClick={() => { for (let i = 0; i < 5; i++) onRestore(); }} style={numBtnStyle}>+5</button>
          </div>
        )}
      </div>
      <span style={{
        fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 600, textTransform: 'uppercase',
        background: restLabel === 'short' ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)',
        color: restLabel === 'short' ? '#22C55E' : '#3B82F6',
      }}>{restLabel}</span>
    </div>
  );
}

const numBtnStyle = {
  width: 26, height: 22, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#D1D5DB', fontSize: 11, fontWeight: 600, cursor: 'pointer',
};
