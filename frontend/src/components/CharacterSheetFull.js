import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import "../App.css";
import "../styles/designSystem.css";
import {
  Heart, Shield, Zap, Swords, BookOpen, Backpack,
  ChevronDown, ChevronUp, Plus, Minus, Edit3, Save, X,
  Skull, Star, Award, Target, Clock, Eye, Search,
  Dices, Sparkles, Users, Scroll, Flame, Droplet, Wind, Mountain
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Ability score utilities
const getModifier = (score) => Math.floor((score - 10) / 2);
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

// Skills data
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

const ABILITY_NAMES = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA'
};

export default function CharacterSheetFull() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('combat');
  const [currentHp, setCurrentHp] = useState(0);
  const [tempHp, setTempHp] = useState(0);
  const [deathSaves, setDeathSaves] = useState({ successes: 0, failures: 0 });

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API}/characters/${characterId}`);
      const charData = response.data;
      setCharacter(charData);
      setCurrentHp(charData.hp || charData.max_hp || 10);
      setTempHp(charData.temp_hp || 0);
    } catch (err) {
      console.error('Failed to fetch character:', err);
      setError('Failed to load character');
      toast.error('Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  // Calculate derived stats
  const abilities = useMemo(() => {
    if (!character) return {};
    return {
      strength: character.strength || 10,
      dexterity: character.dexterity || 10,
      constitution: character.constitution || 10,
      intelligence: character.intelligence || 10,
      wisdom: character.wisdom || 10,
      charisma: character.charisma || 10
    };
  }, [character]);

  const proficiencyBonus = useMemo(() => {
    if (!character) return 2;
    const level = character.level || 1;
    return Math.ceil(level / 4) + 1;
  }, [character]);

  const maxHp = useMemo(() => {
    if (!character) return 10;
    return character.max_hp || (8 + getModifier(abilities.constitution));
  }, [character, abilities]);

  const armorClass = useMemo(() => {
    if (!character) return 10;
    return character.ac || (10 + getModifier(abilities.dexterity));
  }, [character, abilities]);

  const initiative = useMemo(() => {
    return getModifier(abilities.dexterity);
  }, [abilities]);

  const speed = useMemo(() => {
    return character?.speed || 30;
  }, [character]);

  const handleHpChange = async (delta) => {
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    setCurrentHp(newHp);
    
    try {
      await axios.patch(`${API}/characters/${characterId}`, { hp: newHp });
    } catch (err) {
      console.error('Failed to update HP:', err);
    }
  };

  const handleDeathSave = (type, success) => {
    setDeathSaves(prev => ({
      ...prev,
      [type]: Math.min(3, prev[type] + (success ? 1 : 0))
    }));
  };

  const resetDeathSaves = () => {
    setDeathSaves({ successes: 0, failures: 0 });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--rq-bg-main)", padding: "20px" }}>
        <div className="rq-panel" style={{ textAlign: "center", padding: "40px" }}>
          <div className="rq-muted">Loading character...</div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--rq-bg-main)", padding: "20px" }}>
        <div className="rq-panel" style={{ textAlign: "center", padding: "40px" }}>
          <h2 className="rq-title">Character Not Found</h2>
          <p className="rq-muted">{error || "The character you're looking for doesn't exist."}</p>
          <button className="rq-button-secondary" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--rq-bg-main)", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {character.portrait_url && (
              <img
                src={character.portrait_url}
                alt="portrait"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "2px solid var(--rq-gold)"
                }}
              />
            )}
            <div>
              <h1 className="rq-title" style={{ margin: 0 }}>{character.name}</h1>
              <div className="rq-muted">
                {character.race} {character.character_class} • Level {character.level || 1}
              </div>
              {character.background && (
                <div className="rq-muted" style={{ fontSize: "14px" }}>
                  {character.background}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="rq-button-secondary" onClick={() => navigate('/home')}>
              Back to Home
            </button>
            <button className="rq-button-secondary" onClick={() => navigate('/player')}>
              My Characters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px" }}>
          {/* Left Sidebar - Abilities & Skills */}
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Ability Scores */}
            <div className="rq-card">
              <h3 style={{ marginBottom: "12px" }}>Ability Scores</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {Object.entries(abilities).map(([ability, score]) => (
                  <div
                    key={ability}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      background: "var(--rq-bg-panel-soft)",
                      borderRadius: "8px"
                    }}
                  >
                    <div className="rq-muted" style={{ fontSize: "12px" }}>
                      {ABILITY_NAMES[ability]}
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>{score}</div>
                    <div style={{ fontSize: "14px", color: "var(--rq-gold)" }}>
                      {formatModifier(getModifier(score))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proficiency Bonus */}
            <div className="rq-card" style={{ textAlign: "center" }}>
              <div className="rq-muted">Proficiency Bonus</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--rq-gold)" }}>
                +{proficiencyBonus}
              </div>
            </div>

            {/* Skills */}
            <div className="rq-card">
              <h3 style={{ marginBottom: "12px" }}>Skills</h3>
              <div style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
                {SKILLS.map(skill => {
                  const abilityMod = getModifier(abilities[skill.ability]);
                  const isProficient = character.skill_proficiencies?.includes(skill.name);
                  const bonus = abilityMod + (isProficient ? proficiencyBonus : 0);
                  
                  return (
                    <div
                      key={skill.name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 8px",
                        background: isProficient ? "rgba(255, 215, 0, 0.1)" : "transparent",
                        borderRadius: "4px"
                      }}
                    >
                      <span style={{ color: isProficient ? "var(--rq-gold)" : "inherit" }}>
                        {isProficient && "● "}{skill.name}
                      </span>
                      <span style={{ fontWeight: "bold" }}>{formatModifier(bonus)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Combat Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {/* HP */}
              <div className="rq-card" style={{ textAlign: "center" }}>
                <div className="rq-muted" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Heart size={16} /> Hit Points
                </div>
                <div style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>
                  <span style={{ color: currentHp < maxHp / 2 ? "#ef4444" : "inherit" }}>
                    {currentHp}
                  </span>
                  <span className="rq-muted"> / {maxHp}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  <button className="rq-button-secondary" style={{ padding: "4px 12px" }} onClick={() => handleHpChange(-1)}>
                    <Minus size={16} />
                  </button>
                  <button className="rq-button-secondary" style={{ padding: "4px 12px" }} onClick={() => handleHpChange(1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* AC */}
              <div className="rq-card" style={{ textAlign: "center" }}>
                <div className="rq-muted" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Shield size={16} /> Armor Class
                </div>
                <div style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0" }}>
                  {armorClass}
                </div>
              </div>

              {/* Initiative */}
              <div className="rq-card" style={{ textAlign: "center" }}>
                <div className="rq-muted" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Zap size={16} /> Initiative
                </div>
                <div style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0" }}>
                  {formatModifier(initiative)}
                </div>
              </div>

              {/* Speed */}
              <div className="rq-card" style={{ textAlign: "center" }}>
                <div className="rq-muted" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Wind size={16} /> Speed
                </div>
                <div style={{ fontSize: "32px", fontWeight: "bold", margin: "8px 0" }}>
                  {speed} ft
                </div>
              </div>
            </div>

            {/* Death Saves */}
            {currentHp === 0 && (
              <div className="rq-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Skull size={20} /> Death Saves
                  </h3>
                  <button className="rq-button-secondary" style={{ padding: "4px 12px" }} onClick={resetDeathSaves}>
                    Reset
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div className="rq-muted" style={{ marginBottom: "8px" }}>Successes</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[0, 1, 2].map(i => (
                        <button
                          key={i}
                          onClick={() => handleDeathSave('successes', deathSaves.successes <= i)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid var(--rq-gold)",
                            background: deathSaves.successes > i ? "var(--rq-gold)" : "transparent",
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="rq-muted" style={{ marginBottom: "8px" }}>Failures</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[0, 1, 2].map(i => (
                        <button
                          key={i}
                          onClick={() => handleDeathSave('failures', deathSaves.failures <= i)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "2px solid #ef4444",
                            background: deathSaves.failures > i ? "#ef4444" : "transparent",
                            cursor: "pointer"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
              {['combat', 'spells', 'inventory', 'notes'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={activeTab === tab ? "rq-button-primary" : "rq-button-secondary"}
                  style={{ textTransform: "capitalize" }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="rq-card">
              {activeTab === 'combat' && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Combat Actions</h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div className="rq-card" style={{ background: "var(--rq-bg-panel-soft)" }}>
                      <div style={{ fontWeight: "bold" }}>Unarmed Strike</div>
                      <div className="rq-muted">
                        +{proficiencyBonus + getModifier(abilities.strength)} to hit • 
                        1 + {getModifier(abilities.strength)} bludgeoning damage
                      </div>
                    </div>
                    {character.weapons?.map((weapon, i) => (
                      <div key={i} className="rq-card" style={{ background: "var(--rq-bg-panel-soft)" }}>
                        <div style={{ fontWeight: "bold" }}>{weapon.name}</div>
                        <div className="rq-muted">
                          {weapon.attack_bonus && `+${weapon.attack_bonus} to hit`}
                          {weapon.damage && ` • ${weapon.damage}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'spells' && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Spellcasting</h3>
                  {character.spells && character.spells.length > 0 ? (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {character.spells.map((spell, i) => (
                        <div key={i} className="rq-card" style={{ background: "var(--rq-bg-panel-soft)" }}>
                          <div style={{ fontWeight: "bold" }}>{spell.name}</div>
                          <div className="rq-muted">{spell.level ? `Level ${spell.level}` : 'Cantrip'} • {spell.school}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rq-muted">No spells known.</div>
                  )}
                </div>
              )}

              {activeTab === 'inventory' && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Inventory</h3>
                  {character.equipment && character.equipment.length > 0 ? (
                    <div style={{ display: "grid", gap: "8px" }}>
                      {character.equipment.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px", background: "var(--rq-bg-panel-soft)", borderRadius: "6px" }}>
                          <span>{item.name || item}</span>
                          {item.quantity && <span className="rq-muted">x{item.quantity}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rq-muted">No items in inventory.</div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 style={{ marginBottom: "16px" }}>Character Notes</h3>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {character.notes || "No notes yet."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
