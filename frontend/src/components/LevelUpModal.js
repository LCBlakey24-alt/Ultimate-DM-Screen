import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Heart, Shield, Star, Dumbbell, Brain, Eye,
  Zap, Check, X, Sparkles, Award, ChevronRight, Dice6
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Tron Legacy Blue theme for player section
const playerBlue = '#3B82F6';
const playerBlueHover = '#60A5FA';
const playerBlueSubtle = 'rgba(59, 130, 246, 0.15)';
const playerCyan = '#06B6D4';
const playerCyanGlow = '#22D3EE';

// Ability data - Tron Legacy blue gradient
const ABILITIES = [
  { key: 'strength', label: 'STR', fullName: 'Strength', color: '#3B82F6', icon: Dumbbell },
  { key: 'dexterity', label: 'DEX', fullName: 'Dexterity', color: '#06B6D4', icon: Zap },
  { key: 'constitution', label: 'CON', fullName: 'Constitution', color: '#0EA5E9', icon: Shield },
  { key: 'intelligence', label: 'INT', fullName: 'Intelligence', color: '#6366F1', icon: Brain },
  { key: 'wisdom', label: 'WIS', fullName: 'Wisdom', color: '#8B5CF6', icon: Eye },
  { key: 'charisma', label: 'CHA', fullName: 'Charisma', color: '#A855F7', icon: Star }
];

// Copyright-safe feats (generic versions)
const AVAILABLE_FEATS = [
  { name: 'Alert', description: '+5 to initiative. You cannot be surprised while conscious.' },
  { name: 'Athlete', description: '+1 STR or DEX. Standing from prone costs only 5 feet. Climbing doesn\'t cost extra movement.' },
  { name: 'Tough', description: 'Your hit point maximum increases by 2 for every level.' },
  { name: 'Durable', description: '+1 CON. When you roll Hit Dice to regain HP, the minimum is double your CON modifier.' },
  { name: 'Lucky', description: '3 luck points per long rest. Reroll any attack, ability check, or saving throw.' },
  { name: 'Mobile', description: '+10 feet speed. Difficult terrain doesn\'t cost extra when you Dash. No opportunity attacks after melee.' },
  { name: 'Observant', description: '+1 INT or WIS. +5 to passive Perception and Investigation. Can read lips.' },
  { name: 'Resilient', description: '+1 to chosen ability score. Gain proficiency in that ability\'s saving throw.' },
  { name: 'Skilled', description: 'Gain proficiency in any combination of three skills or tools.' },
  { name: 'Tavern Brawler', description: '+1 STR or CON. Proficient with improvised weapons. Unarmed strikes deal 1d4. Grapple as bonus action.' },
  { name: 'War Caster', description: 'Advantage on CON saves for concentration. Can cast spells for opportunity attacks.' },
  { name: 'Sentinel', description: 'Creatures you hit with opportunity attacks have 0 speed. Can attack when creatures within 5ft attack others.' },
  { name: 'Great Weapon Master', description: 'On crit or kill, bonus action melee attack. -5 to hit for +10 damage with heavy weapons.' },
  { name: 'Sharpshooter', description: 'No disadvantage at long range. Ignore half/three-quarters cover. -5 to hit for +10 damage.' },
  { name: 'Defensive Duelist', description: 'When hit with melee attack, use reaction to add proficiency bonus to AC.' },
  { name: 'Dual Wielder', description: '+1 AC when dual wielding. Can use non-light weapons. Draw two weapons at once.' }
];

// Hit die by class
const HIT_DIE_MAP = {
  'barbarian': 12, 'fighter': 10, 'paladin': 10, 'ranger': 10,
  'bard': 8, 'cleric': 8, 'druid': 8, 'monk': 8, 'rogue': 8, 'warlock': 8,
  'sorcerer': 6, 'wizard': 6
};

function LevelUpModal({ character, open, onClose, onLevelUp }) {
  const [step, setStep] = useState(1); // 1: Overview, 2: Choice (ASI/Feat), 3: Confirm
  const [choiceType, setChoiceType] = useState(null); // 'asi' or 'feat'
  const [asiChoices, setAsiChoices] = useState({ ability1: '', ability2: '' });
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [hpRoll, setHpRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentLevel = character?.level || 1;
  const newLevel = currentLevel + 1;
  const charClass = character?.character_class?.toLowerCase() || 'fighter';
  
  // Determine if this is an ASI level
  const asiLevels = useMemo(() => {
    const base = [4, 8, 12, 16, 19];
    if (charClass === 'fighter') return [...base, 6, 14].sort((a, b) => a - b);
    if (charClass === 'rogue') return [...base, 10].sort((a, b) => a - b);
    return base;
  }, [charClass]);
  
  const isAsiLevel = asiLevels.includes(newLevel);
  
  // Calculate HP values
  const hitDie = HIT_DIE_MAP[charClass] || 8;
  const conMod = Math.floor((character?.constitution || 10) - 10) / 2;
  const averageHp = Math.floor(hitDie / 2) + 1 + conMod;
  const currentMaxHp = character?.max_hit_points || 10;
  
  // New proficiency bonus
  const newProfBonus = 2 + Math.floor((newLevel - 1) / 4);
  const currentProfBonus = 2 + Math.floor((currentLevel - 1) / 4);
  const profBonusIncreased = newProfBonus > currentProfBonus;

  const rollHitDie = () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rollCount = 0;
    const interval = setInterval(() => {
      setHpRoll(Math.floor(Math.random() * hitDie) + 1);
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * hitDie) + 1;
        setHpRoll(finalRoll);
        setIsRolling(false);
        
        if (finalRoll === hitDie) {
          toast.success(`Critical! Rolled a ${finalRoll}!`);
        } else if (finalRoll === 1) {
          toast.error(`Rolled a 1... Consider using average instead.`);
        } else {
          toast.success(`Rolled a ${finalRoll} for HP!`);
        }
      }
    }, 80);
  };

  const useAverageHp = () => {
    setHpRoll(null); // null means use average
    toast.success(`Using average: +${averageHp} HP`);
  };

  const handleAsiSelect = (ability) => {
    if (!asiChoices.ability1) {
      setAsiChoices({ ability1: ability, ability2: '' });
    } else if (!asiChoices.ability2) {
      setAsiChoices({ ...asiChoices, ability2: ability });
    } else {
      // Reset and start over
      setAsiChoices({ ability1: ability, ability2: '' });
    }
  };

  const clearAsiChoice = (which) => {
    if (which === 'ability1') {
      setAsiChoices({ ability1: asiChoices.ability2, ability2: '' });
    } else {
      setAsiChoices({ ...asiChoices, ability2: '' });
    }
  };

  const handleLevelUp = async () => {
    setLoading(true);
    try {
      const payload = {
        new_level: newLevel,
        choice_type: isAsiLevel ? choiceType : 'standard',
        hp_roll: hpRoll
      };

      if (choiceType === 'asi' && asiChoices.ability1) {
        payload.asi_choices = asiChoices;
      } else if (choiceType === 'feat' && selectedFeat) {
        payload.feat_choice = {
          name: selectedFeat.name,
          description: selectedFeat.description
        };
      }

      const response = await axios.post(
        `${API}/characters/${character.id}/level-up`,
        payload
      );

      toast.success(`Level Up! You are now level ${newLevel}!`, {
        description: `Gained ${response.data.level_up_summary.hp_gained} HP`
      });

      onLevelUp(response.data.character);
      onClose();
    } catch (error) {
      toast.error('Level up failed', {
        description: error.response?.data?.detail || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      data-testid="level-up-modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: `linear-gradient(135deg, ${playerBlueSubtle}, transparent)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: playerBlue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', fontFamily: 'Montserrat' }}>
                  Level Up!
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  {character?.name} • Level {currentLevel} → {newLevel}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  background: step >= s ? playerBlue : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Step 1: Overview */}
          {step === 1 && (
            <div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Level {newLevel} Benefits
              </h3>

              {/* HP Section */}
              <div style={{
                background: '#111',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Heart size={24} color="#ef4444" />
                  <div>
                    <h4 style={{ color: '#ef4444', fontSize: '16px', fontWeight: '700' }}>Hit Points</h4>
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                      Roll d{hitDie} + {conMod >= 0 ? '+' : ''}{conMod} (CON) or take average ({averageHp})
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Button
                    onClick={rollHitDie}
                    disabled={isRolling}
                    data-testid="roll-hp-btn"
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      padding: '12px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Dice6 size={18} className={isRolling ? 'animate-spin' : ''} />
                    {isRolling ? 'Rolling...' : `Roll d${hitDie}`}
                  </Button>
                  
                  <Button
                    onClick={useAverageHp}
                    data-testid="average-hp-btn"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      color: '#ef4444',
                      padding: '12px 20px'
                    }}
                  >
                    Use Average (+{averageHp})
                  </Button>

                  {hpRoll !== null && (
                    <div style={{
                      background: hpRoll === hitDie ? 'rgba(6, 182, 212, 0.2)' : hpRoll === 1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#fff', fontSize: '14px' }}>Rolled:</span>
                      <span style={{ 
                        color: hpRoll === hitDie ? '#06B6D4' : hpRoll === 1 ? '#ef4444' : playerBlue,
                        fontSize: '24px',
                        fontWeight: '800'
                      }}>
                        {hpRoll}
                      </span>
                      <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                        (+{Math.max(1, hpRoll + conMod)} HP total)
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '12px', color: '#9CA3AF', fontSize: '13px' }}>
                  New Max HP: <span style={{ color: '#ef4444', fontWeight: '700' }}>
                    {currentMaxHp} → {currentMaxHp + (hpRoll !== null ? Math.max(1, hpRoll + conMod) : averageHp)}
                  </span>
                </div>
              </div>

              {/* Proficiency Bonus */}
              {profBonusIncreased && (
                <div style={{
                  background: '#111',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Award size={24} color="#8B5CF6" />
                  <div>
                    <h4 style={{ color: '#8B5CF6', fontSize: '14px', fontWeight: '700' }}>Proficiency Bonus Increased!</h4>
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                      +{currentProfBonus} → +{newProfBonus}
                    </p>
                  </div>
                </div>
              )}

              {/* ASI/Feat Notice */}
              {isAsiLevel && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.1))',
                  border: `1px solid ${playerBlue}`,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Sparkles size={24} color={playerBlue} />
                  <div>
                    <h4 style={{ color: playerBlue, fontSize: '14px', fontWeight: '700' }}>
                      Ability Score Improvement!
                    </h4>
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                      Choose +2 to one ability, +1 to two abilities, or select a Feat
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <Button
                  onClick={() => setStep(isAsiLevel ? 2 : 3)}
                  data-testid="next-step-btn"
                  style={{
                    background: playerBlue,
                    border: 'none',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isAsiLevel ? 'Choose ASI or Feat' : 'Confirm Level Up'}
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: ASI or Feat Choice */}
          {step === 2 && isAsiLevel && (
            <div>
              {/* Choice Toggle */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '24px' }}>
                <button
                  onClick={() => { setChoiceType('asi'); setSelectedFeat(null); }}
                  data-testid="choose-asi-btn"
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: choiceType === 'asi' ? playerBlue : '#111',
                    border: 'none',
                    color: choiceType === 'asi' ? '#fff' : '#9CA3AF',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ABILITY SCORE IMPROVEMENT
                </button>
                <button
                  onClick={() => { setChoiceType('feat'); setAsiChoices({ ability1: '', ability2: '' }); }}
                  data-testid="choose-feat-btn"
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: choiceType === 'feat' ? '#a855f7' : '#111',
                    border: 'none',
                    color: choiceType === 'feat' ? '#fff' : '#9CA3AF',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  SELECT A FEAT
                </button>
              </div>

              {/* ASI Selection */}
              {choiceType === 'asi' && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
                    Select two abilities to increase by +1 each, or the same ability twice for +2
                  </p>

                  {/* Selected Choices */}
                  {(asiChoices.ability1 || asiChoices.ability2) && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      marginBottom: '20px',
                      padding: '12px',
                      background: playerBlueSubtle,
                      border: `1px solid ${playerBlue}30`
                    }}>
                      {asiChoices.ability1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '14px' }}>
                            +1 {ABILITIES.find(a => a.key === asiChoices.ability1)?.fullName}
                          </span>
                          <button
                            onClick={() => clearAsiChoice('ability1')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                          >
                            <X size={14} color="#ef4444" />
                          </button>
                        </div>
                      )}
                      {asiChoices.ability2 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '14px' }}>
                            +1 {ABILITIES.find(a => a.key === asiChoices.ability2)?.fullName}
                          </span>
                          <button
                            onClick={() => clearAsiChoice('ability2')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                          >
                            <X size={14} color="#ef4444" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ability Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {ABILITIES.map(ability => {
                      const currentScore = character?.[ability.key] || 10;
                      const isSelected = asiChoices.ability1 === ability.key || asiChoices.ability2 === ability.key;
                      const timesSelected = (asiChoices.ability1 === ability.key ? 1 : 0) + (asiChoices.ability2 === ability.key ? 1 : 0);
                      const newScore = currentScore + timesSelected;
                      const isMaxed = newScore >= 20;
                      const Icon = ability.icon;

                      return (
                        <button
                          key={ability.key}
                          onClick={() => !isMaxed && handleAsiSelect(ability.key)}
                          disabled={isMaxed && !isSelected}
                          data-testid={`asi-${ability.key}`}
                          style={{
                            padding: '16px',
                            background: isSelected ? `${ability.color}20` : '#111',
                            border: isSelected ? `2px solid ${ability.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: isMaxed && !isSelected ? 'not-allowed' : 'pointer',
                            opacity: isMaxed && !isSelected ? 0.5 : 1,
                            textAlign: 'center'
                          }}
                        >
                          <Icon size={24} color={ability.color} style={{ marginBottom: '8px' }} />
                          <div style={{ color: ability.color, fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                            {ability.label}
                          </div>
                          <div style={{ color: '#fff', fontSize: '24px', fontWeight: '800' }}>
                            {currentScore}
                            {timesSelected > 0 && (
                              <span style={{ color: '#22c55e', fontSize: '14px', marginLeft: '4px' }}>
                                +{timesSelected}
                              </span>
                            )}
                          </div>
                          {isMaxed && (
                            <div style={{ color: '#f97316', fontSize: '10px', marginTop: '4px' }}>MAX</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feat Selection */}
              {choiceType === 'feat' && (
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
                    Choose a feat to gain new abilities
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {AVAILABLE_FEATS.filter(feat => 
                      !character?.feats?.some(f => f.name === feat.name)
                    ).map(feat => (
                      <button
                        key={feat.name}
                        onClick={() => setSelectedFeat(feat)}
                        data-testid={`feat-${feat.name.toLowerCase().replace(/ /g, '-')}`}
                        style={{
                          padding: '16px',
                          background: selectedFeat?.name === feat.name ? 'rgba(168, 85, 247, 0.2)' : '#111',
                          border: selectedFeat?.name === feat.name ? '2px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          border: selectedFeat?.name === feat.name ? '2px solid #a855f7' : '2px solid #475569',
                          background: selectedFeat?.name === feat.name ? '#a855f7' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {selectedFeat?.name === feat.name && <Check size={14} color="#fff" />}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            {feat.name}
                          </div>
                          <div style={{ color: '#9CA3AF', fontSize: '12px', lineHeight: '1.5' }}>
                            {feat.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <Button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#9CA3AF',
                    padding: '12px 24px'
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={choiceType === 'asi' ? !asiChoices.ability1 || !asiChoices.ability2 : !selectedFeat}
                  data-testid="confirm-choice-btn"
                  style={{
                    background: (choiceType === 'asi' && asiChoices.ability1 && asiChoices.ability2) || selectedFeat ? playerBlue : '#475569',
                    border: 'none',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: (choiceType === 'asi' ? !asiChoices.ability1 || !asiChoices.ability2 : !selectedFeat) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Review Changes
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                Confirm Level Up
              </h3>

              {/* Summary */}
              <div style={{
                background: '#111',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <TrendingUp size={24} color={playerBlue} />
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>
                      {character?.name}
                    </h4>
                    <p style={{ color: playerBlue, fontSize: '14px' }}>
                      Level {currentLevel} → Level {newLevel} {character?.character_class}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* HP Change */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: '#9CA3AF' }}>Hit Points</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>
                      {currentMaxHp} → {currentMaxHp + (hpRoll !== null ? Math.max(1, hpRoll + conMod) : averageHp)}
                      <span style={{ color: '#22c55e', marginLeft: '8px' }}>
                        (+{hpRoll !== null ? Math.max(1, hpRoll + conMod) : averageHp})
                      </span>
                    </span>
                  </div>

                  {/* Proficiency Bonus */}
                  {profBonusIncreased && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#9CA3AF' }}>Proficiency Bonus</span>
                      <span style={{ color: '#a855f7', fontWeight: '600' }}>
                        +{currentProfBonus} → +{newProfBonus}
                      </span>
                    </div>
                  )}

                  {/* ASI Changes */}
                  {choiceType === 'asi' && asiChoices.ability1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#9CA3AF' }}>Ability Scores</span>
                      <span style={{ color: playerBlue, fontWeight: '600' }}>
                        {asiChoices.ability1 === asiChoices.ability2 ? (
                          `+2 ${ABILITIES.find(a => a.key === asiChoices.ability1)?.fullName}`
                        ) : (
                          `+1 ${ABILITIES.find(a => a.key === asiChoices.ability1)?.fullName}, +1 ${ABILITIES.find(a => a.key === asiChoices.ability2)?.fullName}`
                        )}
                      </span>
                    </div>
                  )}

                  {/* Feat */}
                  {choiceType === 'feat' && selectedFeat && (
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#9CA3AF' }}>New Feat</span>
                        <span style={{ color: '#a855f7', fontWeight: '600' }}>{selectedFeat.name}</span>
                      </div>
                      <p style={{ color: '#6B7280', fontSize: '12px', lineHeight: '1.5' }}>
                        {selectedFeat.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => setStep(isAsiLevel ? 2 : 1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#9CA3AF',
                    padding: '12px 24px'
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={handleLevelUp}
                  disabled={loading}
                  data-testid="confirm-level-up-btn"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                    border: 'none',
                    padding: '12px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Check size={18} />
                      Confirm Level Up
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LevelUpModal;
