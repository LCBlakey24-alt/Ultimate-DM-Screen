import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Heart, Shield, Zap, Swords, BookOpen, Backpack, ChevronLeft,
  Plus, Minus, Skull, Eye, Scroll, Flame, Wind, Edit3
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Theme
const theme = {
  bg: { primary: '#0F0A1E', surface: '#1A112E', elevated: '#2E1F45' },
  sunset: { purple: '#8B5CF6', pink: '#EC4899', gold: '#F59E0B' },
  text: { primary: '#F8FAFC', secondary: '#94A3B8', muted: '#64748B' },
  border: 'rgba(139, 92, 246, 0.3)'
};

const getModifier = (score) => Math.floor((score - 10) / 2);
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

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

const ABILITY_SHORT = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };

export default function CharacterSheetFull() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('combat');
  const [currentHp, setCurrentHp] = useState(0);
  const [deathSaves, setDeathSaves] = useState({ successes: 0, failures: 0 });

  useEffect(() => {
    if (characterId) fetchCharacter();
  }, [characterId]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/characters/${characterId}`);
      setCharacter(response.data);
      setCurrentHp(response.data.hp || response.data.max_hp || 10);
    } catch (err) {
      setError('Failed to load character');
      toast.error('Failed to load character');
    } finally {
      setLoading(false);
    }
  };

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

  const profBonus = useMemo(() => Math.ceil((character?.level || 1) / 4) + 1, [character]);
  const maxHp = character?.max_hp || (8 + getModifier(abilities.constitution));
  const ac = character?.ac || (10 + getModifier(abilities.dexterity));
  const initiative = getModifier(abilities.dexterity);
  const speed = character?.speed || 30;

  const handleHpChange = async (delta) => {
    const newHp = Math.max(0, Math.min(maxHp, currentHp + delta));
    setCurrentHp(newHp);
    try {
      await axios.patch(`${API}/characters/${characterId}`, { hp: newHp });
    } catch (err) {
      console.error('Failed to update HP');
    }
  };

  // Styles
  const pageStyle = { minHeight: '100vh', background: theme.bg.primary, padding: '24px' };
  const panelStyle = {
    background: 'rgba(26, 17, 46, 0.8)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    padding: '20px'
  };
  const statBoxStyle = {
    background: 'rgba(15, 10, 30, 0.6)',
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  };
  const tabStyle = (active) => ({
    padding: '12px 24px',
    background: active ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'transparent',
    border: active ? 'none' : `1px solid ${theme.border}`,
    borderRadius: '10px',
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ ...panelStyle, textAlign: 'center', padding: '60px' }}>
          <div style={{ color: theme.text.muted }}>Loading character...</div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div style={pageStyle}>
        <div style={{ ...panelStyle, textAlign: 'center', padding: '60px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: theme.text.primary, marginBottom: '16px' }}>Character Not Found</h2>
          <p style={{ color: theme.text.muted, marginBottom: '24px' }}>{error}</p>
          <button onClick={() => navigate('/home')} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: theme.text.secondary, cursor: 'pointer' }}>
            <ChevronLeft size={20} /> Back to Dashboard
          </button>
          <button onClick={() => navigate(`/characters/${characterId}/edit`)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(139, 92, 246, 0.2)', border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.text.primary, cursor: 'pointer' }}>
            <Edit3 size={16} /> Edit Character
          </button>
        </div>

        {/* Character Header Card */}
        <div style={{ ...panelStyle, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {character.portrait_url && (
            <img src={character.portrait_url} alt="portrait" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '16px', border: `2px solid ${theme.sunset.gold}` }} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>
              {character.name}
            </h1>
            <div style={{ color: theme.text.secondary, fontSize: '16px' }}>
              {character.race} {character.character_class} • Level {character.level || 1}
            </div>
            {character.background && <div style={{ color: theme.text.muted, fontSize: '14px', marginTop: '4px' }}>{character.background}</div>}
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          {/* Left Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Ability Scores */}
            <div style={panelStyle}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.sunset.purple, marginBottom: '16px', fontSize: '1rem' }}>Ability Scores</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {Object.entries(abilities).map(([ability, score]) => (
                  <div key={ability} style={statBoxStyle}>
                    <div style={{ fontSize: '11px', color: theme.text.muted, letterSpacing: '1px', marginBottom: '4px' }}>{ABILITY_SHORT[ability]}</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.text.primary }}>{score}</div>
                    <div style={{ fontSize: '14px', color: theme.sunset.gold, fontWeight: '600' }}>{formatModifier(getModifier(score))}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proficiency */}
            <div style={{ ...panelStyle, textAlign: 'center' }}>
              <div style={{ color: theme.text.muted, fontSize: '12px', marginBottom: '4px' }}>Proficiency Bonus</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: theme.sunset.pink }}>+{profBonus}</div>
            </div>

            {/* Skills */}
            <div style={panelStyle}>
              <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.sunset.purple, marginBottom: '16px', fontSize: '1rem' }}>Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                {SKILLS.map(skill => {
                  const mod = getModifier(abilities[skill.ability]);
                  const isProficient = character.skill_proficiencies?.includes(skill.name);
                  const bonus = mod + (isProficient ? profBonus : 0);
                  return (
                    <div key={skill.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: isProficient ? 'rgba(245, 158, 11, 0.1)' : 'transparent', borderRadius: '6px' }}>
                      <span style={{ color: isProficient ? theme.sunset.gold : theme.text.secondary }}>{isProficient && '● '}{skill.name}</span>
                      <span style={{ fontWeight: '600', color: theme.text.primary }}>{formatModifier(bonus)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Combat Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {/* HP */}
              <div style={panelStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: theme.text.muted, fontSize: '12px', marginBottom: '8px' }}>
                  <Heart size={16} /> Hit Points
                </div>
                <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
                  <span style={{ color: currentHp < maxHp / 2 ? '#EF4444' : theme.text.primary }}>{currentHp}</span>
                  <span style={{ color: theme.text.muted }}> / {maxHp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <button onClick={() => handleHpChange(-1)} style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#EF4444', cursor: 'pointer' }}><Minus size={16} /></button>
                  <button onClick={() => handleHpChange(1)} style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10B981', cursor: 'pointer' }}><Plus size={16} /></button>
                </div>
              </div>

              {/* AC */}
              <div style={{ ...panelStyle, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: theme.text.muted, fontSize: '12px', marginBottom: '8px' }}>
                  <Shield size={16} /> Armor Class
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: theme.sunset.purple }}>{ac}</div>
              </div>

              {/* Initiative */}
              <div style={{ ...panelStyle, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: theme.text.muted, fontSize: '12px', marginBottom: '8px' }}>
                  <Zap size={16} /> Initiative
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: theme.sunset.pink }}>{formatModifier(initiative)}</div>
              </div>

              {/* Speed */}
              <div style={{ ...panelStyle, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: theme.text.muted, fontSize: '12px', marginBottom: '8px' }}>
                  <Wind size={16} /> Speed
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: theme.sunset.gold }}>{speed} ft</div>
              </div>
            </div>

            {/* Death Saves */}
            {currentHp === 0 && (
              <div style={panelStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontFamily: "'Cinzel', serif" }}><Skull size={20} /> Death Saves</h3>
                  <button onClick={() => setDeathSaves({ successes: 0, failures: 0 })} style={{ padding: '6px 12px', background: 'rgba(139, 92, 246, 0.2)', border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text.primary, cursor: 'pointer', fontSize: '13px' }}>Reset</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ color: theme.text.muted, marginBottom: '8px', fontSize: '13px' }}>Successes</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2].map(i => (
                        <button key={i} onClick={() => setDeathSaves(p => ({ ...p, successes: p.successes <= i ? i + 1 : i }))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: `2px solid ${theme.sunset.gold}`, background: deathSaves.successes > i ? theme.sunset.gold : 'transparent', cursor: 'pointer' }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: theme.text.muted, marginBottom: '8px', fontSize: '13px' }}>Failures</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2].map(i => (
                        <button key={i} onClick={() => setDeathSaves(p => ({ ...p, failures: p.failures <= i ? i + 1 : i }))} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #EF4444', background: deathSaves.failures > i ? '#EF4444' : 'transparent', cursor: 'pointer' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['combat', 'spells', 'inventory', 'notes'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={panelStyle}>
              {activeTab === 'combat' && (
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.sunset.pink, marginBottom: '16px' }}>Combat Actions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ ...statBoxStyle, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: theme.text.primary }}>Unarmed Strike</div>
                        <div style={{ color: theme.text.muted, fontSize: '13px' }}>+{profBonus + getModifier(abilities.strength)} to hit • 1 + {getModifier(abilities.strength)} bludgeoning</div>
                      </div>
                      <Swords size={20} style={{ color: theme.sunset.purple }} />
                    </div>
                    {character.weapons?.map((weapon, i) => (
                      <div key={i} style={{ ...statBoxStyle, textAlign: 'left' }}>
                        <div style={{ fontWeight: '600', color: theme.text.primary }}>{weapon.name}</div>
                        <div style={{ color: theme.text.muted, fontSize: '13px' }}>{weapon.attack_bonus && `+${weapon.attack_bonus} to hit`} {weapon.damage && `• ${weapon.damage}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'spells' && (
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.sunset.purple, marginBottom: '16px' }}>Spellcasting</h3>
                  {character.spells?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {character.spells.map((spell, i) => (
                        <div key={i} style={{ ...statBoxStyle, textAlign: 'left' }}>
                          <div style={{ fontWeight: '600', color: theme.text.primary }}>{spell.name}</div>
                          <div style={{ color: theme.text.muted, fontSize: '13px' }}>{spell.level ? `Level ${spell.level}` : 'Cantrip'} • {spell.school}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: theme.text.muted, textAlign: 'center', padding: '40px' }}>No spells known</div>
                  )}
                </div>
              )}

              {activeTab === 'inventory' && (
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.sunset.gold, marginBottom: '16px' }}>Inventory</h3>
                  {character.equipment?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {character.equipment.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(15, 10, 30, 0.5)', borderRadius: '8px' }}>
                          <span style={{ color: theme.text.primary }}>{item.name || item}</span>
                          {item.quantity && <span style={{ color: theme.text.muted }}>x{item.quantity}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: theme.text.muted, textAlign: 'center', padding: '40px' }}>No items</div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: theme.text.primary, marginBottom: '16px' }}>Character Notes</h3>
                  <div style={{ whiteSpace: 'pre-wrap', color: theme.text.secondary, lineHeight: '1.7' }}>
                    {character.notes || 'No notes yet.'}
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
