import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { User, Sword, Shield, Sparkles, Dices, ChevronLeft, Save, RotateCcw, BookOpen, Info } from "lucide-react";
import {
  BACKGROUND_OPTIONS,
  CLASS_OPTIONS,
  RACE_OPTIONS
} from "../data/characterOptions";
import {
  ABILITIES,
  STANDARD_ARRAY,
  MIN_ABILITY_SCORE,
  MAX_ABILITY_SCORE,
  POINT_BUY_TOTAL,
  clampScore,
  calculatePointBuyCost,
  validateAbilityScores
} from "../lib/characterRules";
import { RACES, CLASSES, BACKGROUNDS, EDITIONS } from "../data/characterRules5e";
import { API_BASE } from "../lib/api";

const DRAFT_KEY = "rq_character_builder_draft_v1";

// Theme colors
const theme = {
  bg: { primary: '#0F0A1E', surface: '#1A112E', elevated: '#2E1F45' },
  sunset: { purple: '#8B5CF6', pink: '#EC4899', gold: '#F59E0B' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
  border: 'rgba(139, 92, 246, 0.3)'
};

const formatAbility = (ability) => ability.slice(0, 3).toUpperCase();
const getModifier = (score) => (Number(score) ? Math.floor((Number(score) - 10) / 2) : 0);
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

const getClassPrimaryAbility = (className) => {
  const map = {
    Barbarian: "strength", Bard: "charisma", Cleric: "wisdom", Druid: "wisdom",
    Fighter: "strength", Monk: "dexterity", Paladin: "charisma", Ranger: "wisdom",
    Rogue: "dexterity", Sorcerer: "charisma", Warlock: "charisma", Wizard: "intelligence"
  };
  return map[className] || "intelligence";
};

const getInitialState = () => ({
  name: "", race: "", subrace: "", className: "", subclass: "", background: "", portrait: "",
  method: "standard",
  edition: "2014",
  stats: { strength: 15, dexterity: 14, constitution: 13, intelligence: 12, wisdom: 10, charisma: 8 }
});

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return getInitialState();
    const sanitizedStats = ABILITIES.reduce((acc, ability) => {
      acc[ability] = clampScore(parsed?.stats?.[ability]) || 10;
      return acc;
    }, {});
    return { ...getInitialState(), ...parsed, stats: sanitizedStats };
  } catch {
    return getInitialState();
  }
};

export default function CharacterBuilder({ onCreateCharacter, editMode = false }) {
  const navigate = useNavigate();
  const { characterId } = useParams();
  const initialState = useMemo(loadDraft, []);
  
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [loadingCharacter, setLoadingCharacter] = useState(editMode);
  const [name, setName] = useState(initialState.name);
  const [race, setRace] = useState(initialState.race);
  const [subrace, setSubrace] = useState(initialState.subrace || "");
  const [className, setClassName] = useState(initialState.className);
  const [subclass, setSubclass] = useState(initialState.subclass || "");
  const [background, setBackground] = useState(initialState.background);
  const [portrait, setPortrait] = useState(initialState.portrait);
  const [method, setMethod] = useState(initialState.method);
  const [edition, setEdition] = useState(initialState.edition || "2014");
  const [stats, setStats] = useState(initialState.stats);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing character data in edit mode
  useEffect(() => {
    if (editMode && characterId) {
      loadCharacterForEdit();
    }
  }, [editMode, characterId]);
  
  const loadCharacterForEdit = async () => {
    try {
      setLoadingCharacter(true);
      const response = await axios.get(`${API_BASE}/characters/${characterId}`);
      const char = response.data;
      
      setName(char.name || "");
      setRace(char.race || "");
      setSubrace(char.subrace || "");
      setClassName(char.character_class || "");
      setSubclass(char.subclass || "");
      setBackground(char.background || "");
      setPortrait(char.portrait_url || "");
      setEdition(char.edition || "2014");
      setStats({
        strength: char.strength || 10,
        dexterity: char.dexterity || 10,
        constitution: char.constitution || 10,
        intelligence: char.intelligence || 10,
        wisdom: char.wisdom || 10,
        charisma: char.charisma || 10
      });
      setMethod("manual"); // Set to manual in edit mode since scores are already set
    } catch (error) {
      toast.error("Failed to load character for editing");
      navigate("/home");
    } finally {
      setLoadingCharacter(false);
    }
  };

  // Get race data with subraces
  const raceData = RACES[race] || null;
  const availableSubraces = raceData?.subraces ? Object.keys(raceData.subraces) : [];
  
  // Get class data with subclasses
  const classData = CLASSES[className] || null;
  const availableSubclasses = classData?.subclasses || [];

  // Get background data
  const backgroundData = BACKGROUNDS[background] || null;

  // Calculate ASI from race (2014) or background (2024)
  const asiSource = edition === "2014" ? raceData : backgroundData;
  const asiBonus = useMemo(() => {
    const bonus = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    if (!asiSource) return bonus;
    
    if (edition === "2014" && raceData) {
      const asi = raceData.asi2014 || {};
      if (asi.all) {
        // Human +1 all
        ABILITIES.forEach(a => bonus[a] = asi.all);
      } else {
        Object.entries(asi).forEach(([stat, val]) => {
          if (stat !== 'choice' && bonus[stat] !== undefined) bonus[stat] = val;
        });
      }
      // Add subrace ASI
      if (subrace && raceData.subraces?.[subrace]?.asi2014) {
        Object.entries(raceData.subraces[subrace].asi2014).forEach(([stat, val]) => {
          if (bonus[stat] !== undefined) bonus[stat] += val;
        });
      }
    } else if (edition === "2024" && backgroundData?.asi2024) {
      Object.entries(backgroundData.asi2024).forEach(([stat, val]) => {
        if (bonus[stat] !== undefined) bonus[stat] = val;
      });
    }
    return bonus;
  }, [edition, raceData, backgroundData, subrace, asiSource]);

  // Auto-save draft
  useEffect(() => {
    const draft = { name, race, subrace, className, subclass, background, portrait, method, edition, stats };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [name, race, subrace, className, subclass, background, portrait, method, edition, stats]);

  const pointBuySpent = useMemo(
    () => ABILITIES.reduce((sum, ability) => sum + calculatePointBuyCost(stats[ability]), 0),
    [stats]
  );
  const pointBuyRemaining = POINT_BUY_TOTAL - pointBuySpent;

  const derivedStats = useMemo(() => {
    // Apply ASI bonuses to base stats
    const finalStats = {};
    ABILITIES.forEach(a => {
      finalStats[a] = Number(stats[a]) + asiBonus[a];
    });
    
    const conMod = Math.floor((finalStats.constitution - 10) / 2);
    const dexMod = Math.floor((finalStats.dexterity - 10) / 2);
    const primaryAbility = getClassPrimaryAbility(className);
    const primaryMod = Math.floor((finalStats[primaryAbility] - 10) / 2);
    const hitDie = classData?.hitDie || 8;
    
    return {
      hp: Math.max(1, hitDie + conMod),
      ac: 10 + dexMod,
      proficiency: 2,
      spellDC: 8 + 2 + primaryMod,
      spellAttack: 2 + primaryMod,
      primaryAbility,
      hitDie,
      finalStats
    };
  }, [stats, className, asiBonus, classData]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    const reset = getInitialState();
    setName(reset.name); setRace(reset.race); setSubrace(""); setClassName(reset.className);
    setSubclass(""); setBackground(reset.background); setPortrait(reset.portrait);
    setMethod(reset.method); setEdition(reset.edition); setStats(reset.stats); setErrors({});
  };

  const setMethodAndStats = (nextMethod) => {
    setMethod(nextMethod);
    setErrors({});
    if (nextMethod === "standard") {
      const assigned = {};
      ABILITIES.forEach((a, i) => { assigned[a] = STANDARD_ARRAY[i]; });
      setStats(assigned);
    } else if (nextMethod === "point") {
      setStats(ABILITIES.reduce((acc, a) => ({ ...acc, [a]: 8 }), {}));
    } else if (nextMethod === "roll") {
      const rolled = {};
      ABILITIES.forEach((a) => {
        const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
        dice.sort((x, y) => y - x);
        rolled[a] = dice[0] + dice[1] + dice[2];
      });
      setStats(rolled);
    }
  };

  const handleStatChange = (ability, value) => {
    const clamped = clampScore(value);
    setStats((prev) => ({ ...prev, [ability]: clamped }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!race) nextErrors.race = "Select a race";
    if (!className) nextErrors.className = "Select a class";
    if (method === "point" && pointBuyRemaining !== 0) {
      nextErrors.stats = `Use exactly ${POINT_BUY_TOTAL} points (${pointBuyRemaining} remaining)`;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!validateAbilityScores(stats)) {
      setErrors((prev) => ({ ...prev, stats: `Scores must be ${MIN_ABILITY_SCORE}-${MAX_ABILITY_SCORE}` }));
      return;
    }

    // Use final stats with ASI bonuses (only apply bonuses for new characters, not edits)
    const finalStats = isEditMode ? stats : derivedStats.finalStats;
    
    const payload = {
      name: name.trim(), 
      race, 
      subrace: subrace || null,
      character_class: className, 
      subclass: subclass || null,
      background, 
      edition,
      strength: Number(finalStats.strength), 
      dexterity: Number(finalStats.dexterity),
      constitution: Number(finalStats.constitution), 
      intelligence: Number(finalStats.intelligence),
      wisdom: Number(finalStats.wisdom), 
      charisma: Number(finalStats.charisma),
      notes: `Edition: ${edition}, Method: ${method}`, 
      portrait_url: portrait || ""
    };
    
    // Only set level and HP for new characters
    if (!isEditMode) {
      payload.level = 1;
      payload.max_hp = derivedStats.hp;
      payload.current_hp = derivedStats.hp;
    }

    try {
      setIsSubmitting(true);
      
      if (isEditMode && characterId) {
        // Update existing character
        await axios.patch(`${API_BASE}/characters/${characterId}`, payload);
        toast.success("Character updated!");
        navigate(`/characters/${characterId}`);
      } else {
        // Create new character
        const response = await axios.post(`${API_BASE}/characters`, payload);
        onCreateCharacter?.(response.data?.character);
        localStorage.removeItem(DRAFT_KEY);
        toast.success("Character created!");
        navigate(response.data?.character_id ? `/characters/${response.data.character_id}` : '/home');
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} character`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    background: `linear-gradient(180deg, rgba(15, 10, 30, 0.85) 0%, rgba(15, 10, 30, 0.95) 100%), url('https://static.prod-images.emergentagent.com/jobs/b9fc55bd-0a80-4d15-9934-a7087e3445c8/images/9be68b2095230a13a9d52ed25ea5ba93da54c6f47b915d5cd89f4c7b8992a6d3.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    padding: '24px'
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto'
  };

  const panelStyle = {
    background: 'rgba(26, 17, 46, 0.8)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${theme.border}`,
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(15, 10, 30, 0.6)',
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    color: theme.text.primary,
    fontSize: '15px',
    outline: 'none'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: theme.text.secondary,
    fontSize: '14px',
    fontWeight: '500'
  };

  const methodBtnStyle = (active) => ({
    flex: 1,
    padding: '12px 16px',
    background: active ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(139, 92, 246, 0.1)',
    border: active ? 'none' : `1px solid ${theme.border}`,
    borderRadius: '10px',
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const abilityCardStyle = {
    background: 'rgba(15, 10, 30, 0.5)',
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  };

  const statPreviewStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '8px',
    fontSize: '14px'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: theme.text.secondary, cursor: 'pointer', fontSize: '15px' }}
          >
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
          <button
            onClick={clearDraft}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#EF4444', cursor: 'pointer', fontSize: '14px' }}
          >
            <RotateCcw size={16} /> Clear Draft
          </button>
        </div>

        <div style={panelStyle}>
          {loadingCharacter ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ color: theme.text.muted }}>Loading character...</div>
            </div>
          ) : (
            <>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', marginBottom: '8px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isEditMode ? 'Edit Character' : 'Create Character'}
          </h1>
          <p style={{ color: theme.text.muted, marginBottom: '32px' }}>{isEditMode ? 'Modify your hero\'s details' : 'Build your hero for the adventure ahead'}</p>

          <form onSubmit={handleSubmit}>
            {/* Edition Selection */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: theme.sunset.gold, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} /> Rules Edition
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {Object.entries(EDITIONS).map(([key, ed]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEdition(key)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: edition === key ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(245, 158, 11, 0.1)',
                      border: edition === key ? 'none' : `1px solid ${theme.border}`,
                      borderRadius: '12px',
                      color: edition === key ? '#0F0A1E' : theme.text.primary,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{ed.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{ed.description}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: theme.text.muted, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} />
                {edition === '2014' ? 'Ability bonuses come from Race selection' : 'Ability bonuses come from Background (Origin)'}
              </p>
            </div>

            {/* Basic Info Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: theme.sunset.pink, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} /> Basic Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Character Name *</label>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                  {errors.name && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '6px' }}>{errors.name}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Race / Species *</label>
                  <select value={race} onChange={(e) => { setRace(e.target.value); setSubrace(""); }} style={selectStyle}>
                    <option value="">Select race...</option>
                    {Object.keys(RACES).map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.race && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '6px' }}>{errors.race}</div>}
                  {raceData && edition === '2014' && (
                    <div style={{ fontSize: '12px', color: theme.sunset.gold, marginTop: '6px' }}>
                      ASI: {Object.entries(raceData.asi2014 || {}).map(([k, v]) => k === 'all' ? `+${v} All` : `+${v} ${k.substring(0, 3).toUpperCase()}`).join(', ')}
                    </div>
                  )}
                </div>

                {/* Subrace Selection */}
                {availableSubraces.length > 0 && (
                  <div>
                    <label style={labelStyle}>Subrace</label>
                    <select value={subrace} onChange={(e) => setSubrace(e.target.value)} style={selectStyle}>
                      <option value="">Select subrace...</option>
                      {availableSubraces.map((sr) => <option key={sr} value={sr}>{sr}</option>)}
                    </select>
                    {subrace && edition === '2014' && raceData.subraces?.[subrace]?.asi2014 && (
                      <div style={{ fontSize: '12px', color: theme.sunset.gold, marginTop: '6px' }}>
                        Subrace ASI: {Object.entries(raceData.subraces[subrace].asi2014).map(([k, v]) => `+${v} ${k.substring(0, 3).toUpperCase()}`).join(', ')}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Class *</label>
                  <select value={className} onChange={(e) => { setClassName(e.target.value); setSubclass(""); }} style={selectStyle}>
                    <option value="">Select class...</option>
                    {Object.keys(CLASSES).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.className && <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '6px' }}>{errors.className}</div>}
                  {classData && (
                    <div style={{ fontSize: '12px', color: theme.text.muted, marginTop: '6px' }}>
                      Hit Die: d{classData.hitDie} • Primary: {classData.primaryAbility?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Subclass Selection (usually at level 1-3) */}
                {availableSubclasses.length > 0 && (
                  <div>
                    <label style={labelStyle}>Subclass (Choose at Lv 3)</label>
                    <select value={subclass} onChange={(e) => setSubclass(e.target.value)} style={selectStyle}>
                      <option value="">Select later...</option>
                      {availableSubclasses.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Background {edition === '2024' && '(Origin) *'}</label>
                  <select value={background} onChange={(e) => setBackground(e.target.value)} style={selectStyle}>
                    <option value="">Select background...</option>
                    {Object.keys(BACKGROUNDS).map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {backgroundData && edition === '2024' && backgroundData.asi2024 && (
                    <div style={{ fontSize: '12px', color: theme.sunset.gold, marginTop: '6px' }}>
                      ASI: {Object.entries(backgroundData.asi2024).map(([k, v]) => `+${v} ${k.substring(0, 3).toUpperCase()}`).join(', ')}
                      {backgroundData.originFeat2024 && <> • Feat: {backgroundData.originFeat2024}</>}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Portrait URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/portrait.jpg"
                  value={portrait}
                  onChange={(e) => setPortrait(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Ability Scores Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: theme.sunset.purple, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Dices size={20} /> Ability Scores
              </h3>

              {/* Method Selection */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setMethodAndStats("standard")} style={methodBtnStyle(method === "standard")}>
                  Standard Array
                </button>
                <button type="button" onClick={() => setMethodAndStats("point")} style={methodBtnStyle(method === "point")}>
                  Point Buy
                </button>
                <button type="button" onClick={() => setMethodAndStats("roll")} style={methodBtnStyle(method === "roll")}>
                  Roll Stats
                </button>
              </div>

              {method === "point" && (
                <div style={{ ...statPreviewStyle, marginBottom: '20px', background: pointBuyRemaining === 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                  <span style={{ color: pointBuyRemaining === 0 ? '#10B981' : '#F59E0B' }}>
                    Points: {pointBuySpent} / {POINT_BUY_TOTAL} ({pointBuyRemaining} remaining)
                  </span>
                </div>
              )}

              {method === "roll" && (
                <button
                  type="button"
                  onClick={() => setMethodAndStats("roll")}
                  style={{ marginBottom: '20px', padding: '10px 20px', background: 'rgba(139, 92, 246, 0.2)', border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.text.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Dices size={16} /> Re-roll All Stats
                </button>
              )}

              {/* Ability Score Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                {ABILITIES.map((ability) => {
                  const baseScore = stats[ability] || 10;
                  const bonus = asiBonus[ability] || 0;
                  const finalScore = Number(baseScore) + bonus;
                  const mod = Math.floor((finalScore - 10) / 2);
                  return (
                    <div key={ability} style={abilityCardStyle}>
                      <div style={{ fontSize: '12px', color: theme.text.muted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {formatAbility(ability)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        <input
                          type="number"
                          min={MIN_ABILITY_SCORE}
                          max={MAX_ABILITY_SCORE}
                          value={baseScore}
                          onChange={(e) => handleStatChange(ability, e.target.value)}
                          disabled={method === "standard"}
                          style={{
                            width: '60px',
                            padding: '10px',
                            background: 'rgba(15, 10, 30, 0.8)',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '8px',
                            color: theme.text.primary,
                            fontSize: '18px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        {bonus !== 0 && (
                          <span style={{ color: bonus > 0 ? '#10B981' : '#EF4444', fontSize: '14px', fontWeight: '600' }}>
                            {bonus > 0 ? '+' : ''}{bonus}
                          </span>
                        )}
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: theme.text.primary, marginLeft: '4px' }}>
                          = {finalScore}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: '600', color: mod >= 0 ? theme.sunset.gold : '#EF4444' }}>
                        {formatModifier(mod)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.stats && <div style={{ color: '#EF4444', fontSize: '14px', marginTop: '16px', textAlign: 'center' }}>{errors.stats}</div>}
            </div>

            {/* Derived Stats Preview */}
            {className && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', color: theme.sunset.gold, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={20} /> Level 1 Preview
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                  <div style={statPreviewStyle}>
                    <span style={{ color: theme.text.muted }}>HP:</span>
                    <span style={{ fontWeight: '600', color: '#EF4444' }}>{derivedStats.hp}</span>
                  </div>
                  <div style={statPreviewStyle}>
                    <span style={{ color: theme.text.muted }}>AC:</span>
                    <span style={{ fontWeight: '600', color: theme.sunset.purple }}>{derivedStats.ac}</span>
                  </div>
                  <div style={statPreviewStyle}>
                    <span style={{ color: theme.text.muted }}>Prof:</span>
                    <span style={{ fontWeight: '600', color: theme.sunset.pink }}>+{derivedStats.proficiency}</span>
                  </div>
                  {['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'].includes(className) && (
                    <>
                      <div style={statPreviewStyle}>
                        <span style={{ color: theme.text.muted }}>Spell DC:</span>
                        <span style={{ fontWeight: '600', color: theme.sunset.gold }}>{derivedStats.spellDC}</span>
                      </div>
                      <div style={statPreviewStyle}>
                        <span style={{ color: theme.text.muted }}>Spell Atk:</span>
                        <span style={{ fontWeight: '600', color: theme.sunset.gold }}>+{derivedStats.spellAttack}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
                border: 'none',
                borderRadius: '14px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 24px rgba(236, 72, 153, 0.4)'
              }}
            >
              <Save size={20} /> {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Character')}
            </button>
          </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
