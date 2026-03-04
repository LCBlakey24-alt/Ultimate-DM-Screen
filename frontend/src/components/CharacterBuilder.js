import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, ArrowRight, User, Sparkles, Loader, Wand2, 
  Check, Shield, Heart, Swords, BookOpen, Image
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Quick suggestion prompts
const AI_SUGGESTIONS = [
  "A sneaky rogue with a bow and dark past",
  "A holy warrior seeking redemption",
  "A wizard obsessed with ancient secrets",
  "A druid protecting their homeland",
  "A charming bard collecting tales"
];

// 5e Data
const RACES = [
  { name: 'Human', bonus: '+1 to all stats' },
  { name: 'Elf', bonus: '+2 DEX' },
  { name: 'Dwarf', bonus: '+2 CON' },
  { name: 'Halfling', bonus: '+2 DEX' },
  { name: 'Dragonborn', bonus: '+2 STR, +1 CHA' },
  { name: 'Gnome', bonus: '+2 INT' },
  { name: 'Half-Elf', bonus: '+2 CHA, +1 to two others' },
  { name: 'Half-Orc', bonus: '+2 STR, +1 CON' },
  { name: 'Tiefling', bonus: '+2 CHA, +1 INT' }
];

const CLASSES = [
  { name: 'Barbarian', color: '#DC2626', hitDie: 'd12', primary: 'STR' },
  { name: 'Bard', color: '#EC4899', hitDie: 'd8', primary: 'CHA' },
  { name: 'Cleric', color: '#F59E0B', hitDie: 'd8', primary: 'WIS' },
  { name: 'Druid', color: '#22C55E', hitDie: 'd8', primary: 'WIS' },
  { name: 'Fighter', color: '#EF4444', hitDie: 'd10', primary: 'STR/DEX' },
  { name: 'Monk', color: '#14B8A6', hitDie: 'd8', primary: 'DEX/WIS' },
  { name: 'Paladin', color: '#FBBF24', hitDie: 'd10', primary: 'STR/CHA' },
  { name: 'Ranger', color: '#10B981', hitDie: 'd10', primary: 'DEX/WIS' },
  { name: 'Rogue', color: '#6B7280', hitDie: 'd8', primary: 'DEX' },
  { name: 'Sorcerer', color: '#7C3AED', hitDie: 'd6', primary: 'CHA' },
  { name: 'Warlock', color: '#6366F1', hitDie: 'd8', primary: 'CHA' },
  { name: 'Wizard', color: '#8B5CF6', hitDie: 'd6', primary: 'INT' }
];

const BACKGROUNDS = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 
  'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'
];

const ALIGNMENTS = [
  ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
  ['Lawful Neutral', 'Neutral', 'Chaotic Neutral'],
  ['Lawful Evil', 'Neutral Evil', 'Chaotic Evil']
];

function CharacterBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  
  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  
  // Portrait state
  const [portraitGenerating, setPortraitGenerating] = useState(false);
  const [portraitImage, setPortraitImage] = useState(null);
  const [gender, setGender] = useState('neutral');
  
  const [characterData, setCharacterData] = useState({
    name: '',
    race: 'Human',
    character_class: 'Fighter',
    background: 'Folk Hero',
    level: 1,
    alignment: 'Neutral Good',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    backstory: '',
    personality_traits: '',
    ideals: '',
    bonds: '',
    flaws: ''
  });

  const handleChange = (field, value) => {
    setCharacterData(prev => ({ ...prev, [field]: value }));
  };

  // AI Character Generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || aiPrompt.trim().length < 10) {
      toast.error('Please describe your character (at least 10 characters)');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await axios.post(`${API}/ai/generate-character`, {
        description: aiPrompt
      });

      if (response.data.success && response.data.character) {
        const generated = response.data.character;
        setCharacterData(prev => ({
          ...prev,
          name: generated.name || prev.name,
          race: generated.race || prev.race,
          character_class: generated.character_class || prev.character_class,
          background: generated.background || prev.background,
          level: generated.level || 1,
          alignment: generated.alignment || prev.alignment,
          strength: generated.strength || 10,
          dexterity: generated.dexterity || 10,
          constitution: generated.constitution || 10,
          intelligence: generated.intelligence || 10,
          wisdom: generated.wisdom || 10,
          charisma: generated.charisma || 10,
          personality_traits: generated.personality_traits || '',
          ideals: generated.ideals || '',
          bonds: generated.bonds || '',
          flaws: generated.flaws || '',
          backstory: generated.backstory || ''
        }));
        setAiGenerated(true);
        toast.success(`${generated.name} has been created!`, {
          description: 'Review and customize below'
        });
      }
    } catch (error) {
      toast.error('AI generation failed', {
        description: error.response?.data?.detail || 'Try again'
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // Portrait Generation
  const handleGeneratePortrait = async () => {
    if (!characterData.name.trim()) {
      toast.error('Enter a name first');
      return;
    }

    setPortraitGenerating(true);
    try {
      const response = await axios.post(`${API}/ai/generate-portrait`, {
        name: characterData.name,
        race: characterData.race,
        character_class: characterData.character_class,
        gender: gender,
        appearance: characterData.backstory?.substring(0, 200) || ''
      });

      if (response.data.success && response.data.image_base64) {
        setPortraitImage(`data:image/png;base64,${response.data.image_base64}`);
        toast.success('Portrait generated!');
      }
    } catch (error) {
      toast.error('Portrait generation failed');
    } finally {
      setPortraitGenerating(false);
    }
  };

  const calculateModifier = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const handleSubmit = async () => {
    if (!characterData.name.trim()) {
      toast.error('Please enter a character name');
      return;
    }

    setCreating(true);
    try {
      const payload = {
        ...characterData,
        max_hp: parseInt(CLASSES.find(c => c.name === characterData.character_class)?.hitDie?.slice(1) || 8) + 
                Math.floor((characterData.constitution - 10) / 2),
        armor_class: 10 + Math.floor((characterData.dexterity - 10) / 2),
        portrait_url: portraitImage || null
      };

      await axios.post(`${API}/characters`, payload);
      toast.success('Character created!');
      navigate('/player');
    } catch (error) {
      toast.error('Failed to create character');
    } finally {
      setCreating(false);
    }
  };

  const getClassColor = () => {
    return CLASSES.find(c => c.name === characterData.character_class)?.color || '#7C3AED';
  };

  const steps = ['Concept', 'Race & Class', 'Abilities', 'Details'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0B0F19 0%, #111827 50%, #0B0F19 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Button onClick={() => navigate('/player')} className="btn-icon">
            <ArrowLeft size={20} />
          </Button>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '28px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '800',
              color: '#ffffff'
            }}>
              Create Character
            </h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '32px',
          padding: '0 20px'
        }}>
          {steps.map((s, i) => (
            <div 
              key={i}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                opacity: i + 1 <= step ? 1 : 0.4
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: i + 1 < step ? '#10B981' : i + 1 === step ? getClassColor() : '#1F2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: '700',
                fontSize: '14px',
                marginRight: '10px'
              }}>
                {i + 1 < step ? <Check size={18} /> : i + 1}
              </div>
              <span style={{ 
                color: i + 1 === step ? '#fff' : '#9CA3AF',
                fontWeight: i + 1 === step ? '600' : '400',
                fontSize: '14px',
                display: i === steps.length - 1 || i === 0 ? 'block' : 'none'
              }} className="step-label">
                {s}
              </span>
              {i < steps.length - 1 && (
                <div style={{
                  height: '2px',
                  width: '60px',
                  background: i + 1 < step ? '#10B981' : '#1F2937',
                  margin: '0 12px',
                  display: 'none'
                }} className="step-connector" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Concept with AI */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* AI Generation Panel */}
            <Card style={{
              background: aiGenerated 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 211, 238, 0.1))'
                : 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(139, 92, 246, 0.1))',
              border: aiGenerated ? '1px solid #10B981' : '1px solid #7C3AED',
              borderRadius: '16px'
            }}>
              <CardContent style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wand2 size={24} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ 
                      color: '#fff', 
                      fontSize: '18px', 
                      fontWeight: '700',
                      fontFamily: 'Montserrat, sans-serif'
                    }}>
                      Unseen Servant
                    </h3>
                    <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                      Describe your character idea
                    </p>
                  </div>
                </div>

                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Example: A mysterious half-elf wizard who was exiled for practicing forbidden magic..."
                  data-testid="ai-prompt"
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '14px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    borderRadius: '12px',
                    color: '#E5E7EB',
                    fontSize: '14px',
                    resize: 'none',
                    marginBottom: '12px'
                  }}
                />

                {/* Quick Ideas */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '8px' }}>Quick ideas:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {AI_SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setAiPrompt(s)}
                        style={{
                          padding: '5px 10px',
                          background: 'rgba(124, 58, 237, 0.15)',
                          border: '1px solid rgba(124, 58, 237, 0.3)',
                          borderRadius: '16px',
                          color: '#C4B5FD',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAiGenerate}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  data-testid="ai-generate-btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: aiGenerating ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: aiGenerating || !aiPrompt.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {aiGenerating ? (
                    <><Loader className="spin" size={18} /> Generating...</>
                  ) : (
                    <><Sparkles size={18} /> Generate Character</>
                  )}
                </Button>

                {aiGenerated && (
                  <p style={{ color: '#10B981', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
                    ✓ Character generated! Review on the right →
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Manual Entry Panel */}
            <Card style={{
              background: '#111827',
              border: '1px solid #1F2937',
              borderRadius: '16px'
            }}>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  fontFamily: 'Montserrat, sans-serif',
                  marginBottom: '20px'
                }}>
                  Basic Info
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                    Character Name *
                  </label>
                  <Input
                    value={characterData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter name..."
                    className="input"
                    data-testid="character-name"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                      Race
                    </label>
                    <select
                      value={characterData.race}
                      onChange={(e) => handleChange('race', e.target.value)}
                      className="input"
                      style={{ width: '100%' }}
                    >
                      {RACES.map(r => (
                        <option key={r.name} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                      Class
                    </label>
                    <select
                      value={characterData.character_class}
                      onChange={(e) => handleChange('character_class', e.target.value)}
                      className="input"
                      style={{ width: '100%' }}
                    >
                      {CLASSES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                      Background
                    </label>
                    <select
                      value={characterData.background}
                      onChange={(e) => handleChange('background', e.target.value)}
                      className="input"
                      style={{ width: '100%' }}
                    >
                      {BACKGROUNDS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                      Level
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={characterData.level}
                      onChange={(e) => handleChange('level', parseInt(e.target.value) || 1)}
                      className="input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Race & Class Details */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Race Selection */}
            <Card style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px' }}>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  <User size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#22D3EE' }} />
                  Choose Race
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {RACES.map(race => (
                    <button
                      key={race.name}
                      onClick={() => handleChange('race', race.name)}
                      style={{
                        padding: '14px 16px',
                        background: characterData.race === race.name ? 'rgba(34, 211, 238, 0.15)' : '#1F2937',
                        border: characterData.race === race.name ? '2px solid #22D3EE' : '1px solid #374151',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{race.name}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{race.bonus}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Class Selection */}
            <Card style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px' }}>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                  <Swords size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: getClassColor() }} />
                  Choose Class
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {CLASSES.map(cls => (
                    <button
                      key={cls.name}
                      onClick={() => handleChange('character_class', cls.name)}
                      style={{
                        padding: '12px',
                        background: characterData.character_class === cls.name ? `${cls.color}25` : '#1F2937',
                        border: characterData.character_class === cls.name ? `2px solid ${cls.color}` : '1px solid #374151',
                        borderRadius: '10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>{cls.name}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{cls.hitDie} • {cls.primary}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Ability Scores */}
        {step === 3 && (
          <Card style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px' }}>
            <CardContent style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>
                Ability Scores
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { key: 'strength', label: 'STR', icon: Swords },
                  { key: 'dexterity', label: 'DEX', icon: ArrowRight },
                  { key: 'constitution', label: 'CON', icon: Heart },
                  { key: 'intelligence', label: 'INT', icon: BookOpen },
                  { key: 'wisdom', label: 'WIS', icon: User },
                  { key: 'charisma', label: 'CHA', icon: Sparkles }
                ].map(stat => (
                  <div 
                    key={stat.key}
                    style={{
                      background: '#1F2937',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center'
                    }}
                  >
                    <stat.icon size={24} style={{ color: getClassColor(), marginBottom: '8px' }} />
                    <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                      {stat.label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleChange(stat.key, Math.max(3, characterData[stat.key] - 1))}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#374151',
                          border: 'none',
                          color: '#fff',
                          fontSize: '18px',
                          cursor: 'pointer'
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        color: '#fff', 
                        fontSize: '28px', 
                        fontWeight: '800',
                        minWidth: '40px'
                      }}>
                        {characterData[stat.key]}
                      </span>
                      <button
                        onClick={() => handleChange(stat.key, Math.min(20, characterData[stat.key] + 1))}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#374151',
                          border: 'none',
                          color: '#fff',
                          fontSize: '18px',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ color: getClassColor(), fontSize: '14px', fontWeight: '700', marginTop: '8px' }}>
                      {calculateModifier(characterData[stat.key])}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats Summary */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '24px', 
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(124, 58, 237, 0.1)',
                borderRadius: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Heart size={20} style={{ color: '#EF4444', marginBottom: '4px' }} />
                  <div style={{ color: '#EF4444', fontSize: '20px', fontWeight: '700' }}>
                    {parseInt(CLASSES.find(c => c.name === characterData.character_class)?.hitDie?.slice(1) || 8) + 
                     Math.floor((characterData.constitution - 10) / 2)}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '11px' }}>HP</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Shield size={20} style={{ color: '#22D3EE', marginBottom: '4px' }} />
                  <div style={{ color: '#22D3EE', fontSize: '20px', fontWeight: '700' }}>
                    {10 + Math.floor((characterData.dexterity - 10) / 2)}
                  </div>
                  <div style={{ color: '#9CA3AF', fontSize: '11px' }}>AC</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Details & Portrait */}
        {step === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            <Card style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px' }}>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
                  Character Details
                </h3>

                {/* Alignment Grid */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                    Alignment
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                    {ALIGNMENTS.flat().map(align => (
                      <button
                        key={align}
                        onClick={() => handleChange('alignment', align)}
                        style={{
                          padding: '10px 6px',
                          background: characterData.alignment === align ? getClassColor() + '30' : '#1F2937',
                          border: characterData.alignment === align ? `1px solid ${getClassColor()}` : '1px solid #374151',
                          borderRadius: '6px',
                          color: characterData.alignment === align ? '#fff' : '#9CA3AF',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backstory */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#22D3EE', fontSize: '13px', fontWeight: '600' }}>
                    Backstory
                  </label>
                  <textarea
                    value={characterData.backstory}
                    onChange={(e) => handleChange('backstory', e.target.value)}
                    placeholder="Where did your character come from? What drives them?"
                    className="textarea"
                    style={{ minHeight: '150px' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Portrait Panel */}
            <Card style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px', height: 'fit-content' }}>
              <CardContent style={{ padding: '24px' }}>
                <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Image size={18} style={{ color: '#7C3AED' }} />
                  Portrait
                </h3>

                {/* Portrait Display */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: portraitImage ? 'transparent' : 'rgba(124, 58, 237, 0.1)',
                  border: '2px dashed #374151',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  {portraitImage ? (
                    <img 
                      src={portraitImage} 
                      alt="Character portrait"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  ) : (
                    <User size={48} style={{ color: '#374151' }} />
                  )}
                </div>

                {/* Gender Selection */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  {['male', 'female', 'neutral'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: gender === g ? '1px solid #7C3AED' : '1px solid #374151',
                        background: gender === g ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                        color: gender === g ? '#C4B5FD' : '#9CA3AF',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleGeneratePortrait}
                  disabled={portraitGenerating || !characterData.name.trim()}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: portraitGenerating ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: portraitGenerating || !characterData.name.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {portraitGenerating ? (
                    <><Loader className="spin" size={16} /> Generating...</>
                  ) : (
                    <><Sparkles size={16} /> Generate Portrait</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '32px',
          padding: '20px',
          background: '#111827',
          borderRadius: '12px',
          border: '1px solid #1F2937'
        }}>
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="btn-secondary"
            style={{ opacity: step === 1 ? 0.5 : 1 }}
          >
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={() => setStep(Math.min(4, step + 1))}
              className="btn-primary"
            >
              Next
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={creating || !characterData.name.trim()}
              data-testid="create-character-btn"
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #10B981, #22D3EE)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '15px',
                cursor: creating || !characterData.name.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)'
              }}
            >
              {creating ? (
                <><Loader className="spin" size={18} /> Creating...</>
              ) : (
                <><Check size={18} /> Create Character</>
              )}
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .step-label { display: none !important; }
          .step-connector { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default CharacterBuilder;
