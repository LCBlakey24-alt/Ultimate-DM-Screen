import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ChevronRight, ChevronLeft, Check, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// D&D 5e 2024 Data
const DND_DATA = {
  races: [
    { id: 'human', name: 'Human', traits: '+1 to all abilities', speed: 30, size: 'Medium' },
    { id: 'elf', name: 'Elf', traits: 'Darkvision, Fey Ancestry, Trance', speed: 30, size: 'Medium', subraces: ['High Elf', 'Wood Elf', 'Dark Elf (Drow)'] },
    { id: 'dwarf', name: 'Dwarf', traits: 'Darkvision, Dwarven Resilience', speed: 25, size: 'Medium', subraces: ['Hill Dwarf', 'Mountain Dwarf'] },
    { id: 'halfling', name: 'Halfling', traits: 'Lucky, Brave, Halfling Nimbleness', speed: 25, size: 'Small', subraces: ['Lightfoot', 'Stout'] },
    { id: 'dragonborn', name: 'Dragonborn', traits: 'Breath Weapon, Damage Resistance', speed: 30, size: 'Medium', subraces: ['Chromatic', 'Metallic', 'Gem'] },
    { id: 'gnome', name: 'Gnome', traits: 'Darkvision, Gnome Cunning', speed: 25, size: 'Small', subraces: ['Forest Gnome', 'Rock Gnome'] },
    { id: 'half-elf', name: 'Half-Elf', traits: 'Darkvision, Fey Ancestry, Skill Versatility', speed: 30, size: 'Medium' },
    { id: 'half-orc', name: 'Half-Orc', traits: 'Darkvision, Relentless Endurance, Savage Attacks', speed: 30, size: 'Medium' },
    { id: 'tiefling', name: 'Tiefling', traits: 'Darkvision, Hellish Resistance, Infernal Legacy', speed: 30, size: 'Medium' },
    { id: 'aasimar', name: 'Aasimar', traits: 'Darkvision, Celestial Resistance, Healing Hands', speed: 30, size: 'Medium' },
    { id: 'goliath', name: 'Goliath', traits: "Stone's Endurance, Powerful Build", speed: 30, size: 'Medium' },
    { id: 'orc', name: 'Orc', traits: 'Darkvision, Adrenaline Rush', speed: 30, size: 'Medium' },
  ],
  classes: [
    { id: 'barbarian', name: 'Barbarian', hitDie: 12, primaryAbility: 'Strength', savingThrows: ['Strength', 'Constitution'], 
      subclasses: ['Path of the Berserker', 'Path of the Totem Warrior', 'Path of Wild Magic', 'Path of the Beast'] },
    { id: 'bard', name: 'Bard', hitDie: 8, primaryAbility: 'Charisma', savingThrows: ['Dexterity', 'Charisma'],
      subclasses: ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Swords'] },
    { id: 'cleric', name: 'Cleric', hitDie: 8, primaryAbility: 'Wisdom', savingThrows: ['Wisdom', 'Charisma'],
      subclasses: ['Life Domain', 'Light Domain', 'War Domain', 'Trickery Domain', 'Knowledge Domain'] },
    { id: 'druid', name: 'Druid', hitDie: 8, primaryAbility: 'Wisdom', savingThrows: ['Intelligence', 'Wisdom'],
      subclasses: ['Circle of the Land', 'Circle of the Moon', 'Circle of Spores', 'Circle of Stars'] },
    { id: 'fighter', name: 'Fighter', hitDie: 10, primaryAbility: 'Strength or Dexterity', savingThrows: ['Strength', 'Constitution'],
      subclasses: ['Champion', 'Battle Master', 'Eldritch Knight', 'Echo Knight'] },
    { id: 'monk', name: 'Monk', hitDie: 8, primaryAbility: 'Dexterity & Wisdom', savingThrows: ['Strength', 'Dexterity'],
      subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements', 'Way of Mercy'] },
    { id: 'paladin', name: 'Paladin', hitDie: 10, primaryAbility: 'Strength & Charisma', savingThrows: ['Wisdom', 'Charisma'],
      subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oath of Glory'] },
    { id: 'ranger', name: 'Ranger', hitDie: 10, primaryAbility: 'Dexterity & Wisdom', savingThrows: ['Strength', 'Dexterity'],
      subclasses: ['Hunter', 'Beast Master', 'Gloom Stalker', 'Fey Wanderer'] },
    { id: 'rogue', name: 'Rogue', hitDie: 8, primaryAbility: 'Dexterity', savingThrows: ['Dexterity', 'Intelligence'],
      subclasses: ['Thief', 'Assassin', 'Arcane Trickster', 'Swashbuckler'] },
    { id: 'sorcerer', name: 'Sorcerer', hitDie: 6, primaryAbility: 'Charisma', savingThrows: ['Constitution', 'Charisma'],
      subclasses: ['Draconic Bloodline', 'Wild Magic', 'Divine Soul', 'Aberrant Mind'] },
    { id: 'warlock', name: 'Warlock', hitDie: 8, primaryAbility: 'Charisma', savingThrows: ['Wisdom', 'Charisma'],
      subclasses: ['The Fiend', 'The Archfey', 'The Great Old One', 'The Hexblade'] },
    { id: 'wizard', name: 'Wizard', hitDie: 6, primaryAbility: 'Intelligence', savingThrows: ['Intelligence', 'Wisdom'],
      subclasses: ['School of Evocation', 'School of Abjuration', 'School of Divination', 'School of Necromancy'] },
  ],
  backgrounds: [
    { id: 'acolyte', name: 'Acolyte', skills: ['Insight', 'Religion'], feature: 'Shelter of the Faithful' },
    { id: 'charlatan', name: 'Charlatan', skills: ['Deception', 'Sleight of Hand'], feature: 'False Identity' },
    { id: 'criminal', name: 'Criminal', skills: ['Deception', 'Stealth'], feature: 'Criminal Contact' },
    { id: 'entertainer', name: 'Entertainer', skills: ['Acrobatics', 'Performance'], feature: "By Popular Demand" },
    { id: 'folk-hero', name: 'Folk Hero', skills: ['Animal Handling', 'Survival'], feature: 'Rustic Hospitality' },
    { id: 'guild-artisan', name: 'Guild Artisan', skills: ['Insight', 'Persuasion'], feature: 'Guild Membership' },
    { id: 'hermit', name: 'Hermit', skills: ['Medicine', 'Religion'], feature: 'Discovery' },
    { id: 'noble', name: 'Noble', skills: ['History', 'Persuasion'], feature: 'Position of Privilege' },
    { id: 'outlander', name: 'Outlander', skills: ['Athletics', 'Survival'], feature: 'Wanderer' },
    { id: 'sage', name: 'Sage', skills: ['Arcana', 'History'], feature: 'Researcher' },
    { id: 'sailor', name: 'Sailor', skills: ['Athletics', 'Perception'], feature: "Ship's Passage" },
    { id: 'soldier', name: 'Soldier', skills: ['Athletics', 'Intimidation'], feature: 'Military Rank' },
  ]
};

function PlayersTab({ campaignId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [characterData, setCharacterData] = useState({
    name: '',
    race: null,
    subrace: null,
    class: null,
    subclass: null,
    background: null,
    level: 1,
    stats: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    notes: ''
  });

  useEffect(() => {
    fetchPlayers();
  }, [campaignId]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API}/campaigns/${campaignId}/players`);
      setPlayers(response.data);
    } catch (error) {
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const calculateModifier = (stat) => Math.floor((stat - 10) / 2);

  const calculateHP = () => {
    if (!characterData.class) return 10;
    const classData = DND_DATA.classes.find(c => c.id === characterData.class);
    const conMod = calculateModifier(characterData.stats.constitution);
    return classData.hitDie + conMod;
  };

  const calculateAC = () => {
    return 10 + calculateModifier(characterData.stats.dexterity);
  };

  const handleSubmit = async () => {
    if (!characterData.name || !characterData.race || !characterData.class) {
      toast.error('Please complete all required steps');
      return;
    }

    const classData = DND_DATA.classes.find(c => c.id === characterData.class);
    const raceData = DND_DATA.races.find(r => r.id === characterData.race);
    const backgroundData = DND_DATA.backgrounds.find(b => b.id === characterData.background);

    const formData = {
      name: characterData.name,
      character_class: `${classData.name}${characterData.subclass ? ` (${characterData.subclass})` : ''}`,
      level: characterData.level,
      hp: calculateHP(),
      max_hp: calculateHP(),
      ac: calculateAC(),
      stats: characterData.stats,
      notes: `Race: ${raceData.name}${characterData.subrace ? ` (${characterData.subrace})` : ''}\nBackground: ${backgroundData?.name || 'None'}\nTraits: ${raceData.traits}`
    };

    try {
      if (editingPlayer) {
        await axios.put(`${API}/campaigns/${campaignId}/players/${editingPlayer.id}`, formData);
        toast.success('Player updated!');
      } else {
        await axios.post(`${API}/campaigns/${campaignId}/players`, formData);
        toast.success('Player created!');
      }
      fetchPlayers();
      resetForm();
    } catch (error) {
      toast.error('Failed to save player');
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setCharacterData({
      name: player.name,
      race: null,
      subrace: null,
      class: null,
      subclass: null,
      background: null,
      level: player.level,
      stats: player.stats,
      notes: player.notes
    });
    setWizardStep(5); // Go to stats step for editing
    setShowDialog(true);
  };

  const handleDelete = async (playerId) => {
    if (!window.confirm('Delete this player?')) return;
    try {
      await axios.delete(`${API}/campaigns/${campaignId}/players/${playerId}`);
      toast.success('Player deleted');
      fetchPlayers();
    } catch (error) {
      toast.error('Failed to delete player');
    }
  };

  const resetForm = () => {
    setCharacterData({
      name: '',
      race: null,
      subrace: null,
      class: null,
      subclass: null,
      background: null,
      level: 1,
      stats: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
      notes: ''
    });
    setEditingPlayer(null);
    setWizardStep(1);
    setShowDialog(false);
  };

  const canProceed = () => {
    switch (wizardStep) {
      case 1: return characterData.name.trim().length > 0;
      case 2: return characterData.race !== null;
      case 3: return characterData.class !== null;
      case 4: return true; // Background is optional
      case 5: return true; // Stats always valid
      default: return false;
    }
  };

  const selectedRace = DND_DATA.races.find(r => r.id === characterData.race);
  const selectedClass = DND_DATA.classes.find(c => c.id === characterData.class);

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="medieval-heading" style={{ fontSize: '28px', color: '#ffffff' }}>Players</h2>
        <Dialog open={showDialog} onOpenChange={(open) => { if (!open) resetForm(); setShowDialog(open); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-player-btn" className="btn-primary clickable-box" style={{ display: 'flex', gap: '8px' }}>
              <Plus size={18} />
              Create Character
            </Button>
          </DialogTrigger>
          <DialogContent className="modal" style={{ maxWidth: '800px', maxHeight: '85vh', overflow: 'auto' }}>
            <DialogHeader>
              <DialogTitle className="medieval-heading" style={{ fontSize: '24px', color: '#ffffff' }}>
                {editingPlayer ? 'Edit Character' : 'Character Creator'}
              </DialogTitle>
            </DialogHeader>
            
            {/* Progress Steps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', gap: '8px' }}>
              {['Name', 'Race', 'Class', 'Background', 'Stats'].map((step, idx) => (
                <div 
                  key={step}
                  onClick={() => idx + 1 <= wizardStep && setWizardStep(idx + 1)}
                  className="clickable-box"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 8px',
                    cursor: idx + 1 <= wizardStep ? 'pointer' : 'default',
                    background: wizardStep === idx + 1 ? '#ff1f8f' : idx + 1 < wizardStep ? '#22c55e' : '#1e3a5f',
                    borderColor: wizardStep === idx + 1 ? '#ff1f8f' : idx + 1 < wizardStep ? '#22c55e' : '#38bdf8',
                    opacity: idx + 1 > wizardStep ? 0.5 : 1
                  }}
                >
                  <div style={{ fontSize: '12px', marginBottom: '2px' }}>Step {idx + 1}</div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{step}</div>
                  {idx + 1 < wizardStep && <Check size={14} style={{ marginTop: '4px' }} />}
                </div>
              ))}
            </div>

            {/* Step 1: Name */}
            {wizardStep === 1 && (
              <div className="wizard-step current">
                <h3 style={{ color: '#ff1f8f', marginBottom: '16px', fontSize: '20px' }}>What is your character's name?</h3>
                <Input
                  data-testid="character-name-input"
                  value={characterData.name}
                  onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                  placeholder="Enter character name..."
                  className="input"
                  style={{ fontSize: '18px', padding: '16px' }}
                  autoFocus
                />
              </div>
            )}

            {/* Step 2: Race */}
            {wizardStep === 2 && (
              <div className="wizard-step current">
                <h3 style={{ color: '#ff1f8f', marginBottom: '16px', fontSize: '20px' }}>Choose your race</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {DND_DATA.races.map(race => (
                    <div
                      key={race.id}
                      data-testid={`race-${race.id}`}
                      className={`wizard-option ${characterData.race === race.id ? 'selected' : ''}`}
                      onClick={() => setCharacterData({ ...characterData, race: race.id, subrace: null })}
                    >
                      <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{race.name}</div>
                      <div style={{ fontSize: '11px', color: '#bae6fd' }}>Speed: {race.speed}ft • {race.size}</div>
                    </div>
                  ))}
                </div>
                {selectedRace?.subraces && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '12px' }}>Choose Subrace</h4>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {selectedRace.subraces.map(subrace => (
                        <div
                          key={subrace}
                          className={`wizard-option ${characterData.subrace === subrace ? 'selected' : ''}`}
                          onClick={() => setCharacterData({ ...characterData, subrace })}
                          style={{ minWidth: '120px' }}
                        >
                          {subrace}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedRace && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#0a1628', border: '2px solid #38bdf8', borderRadius: '8px' }}>
                    <p style={{ color: '#bae6fd', fontSize: '13px' }}><strong style={{ color: '#ff1f8f' }}>Traits:</strong> {selectedRace.traits}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Class */}
            {wizardStep === 3 && (
              <div className="wizard-step current">
                <h3 style={{ color: '#ff1f8f', marginBottom: '16px', fontSize: '20px' }}>Choose your class</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {DND_DATA.classes.map(cls => (
                    <div
                      key={cls.id}
                      data-testid={`class-${cls.id}`}
                      className={`wizard-option ${characterData.class === cls.id ? 'selected' : ''}`}
                      onClick={() => setCharacterData({ ...characterData, class: cls.id, subclass: null })}
                    >
                      <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{cls.name}</div>
                      <div style={{ fontSize: '11px', color: '#bae6fd' }}>Hit Die: d{cls.hitDie}</div>
                      <div style={{ fontSize: '10px', color: '#7dd3fc' }}>{cls.primaryAbility}</div>
                    </div>
                  ))}
                </div>
                {selectedClass && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#38bdf8', marginBottom: '12px' }}>Choose Subclass (at Level 3+)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                      {selectedClass.subclasses.map(subclass => (
                        <div
                          key={subclass}
                          className={`wizard-option ${characterData.subclass === subclass ? 'selected' : ''}`}
                          onClick={() => setCharacterData({ ...characterData, subclass })}
                        >
                          {subclass}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Background */}
            {wizardStep === 4 && (
              <div className="wizard-step current">
                <h3 style={{ color: '#ff1f8f', marginBottom: '16px', fontSize: '20px' }}>Choose your background</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {DND_DATA.backgrounds.map(bg => (
                    <div
                      key={bg.id}
                      data-testid={`background-${bg.id}`}
                      className={`wizard-option ${characterData.background === bg.id ? 'selected' : ''}`}
                      onClick={() => setCharacterData({ ...characterData, background: bg.id })}
                    >
                      <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{bg.name}</div>
                      <div style={{ fontSize: '11px', color: '#bae6fd' }}>Skills: {bg.skills.join(', ')}</div>
                      <div style={{ fontSize: '10px', color: '#7dd3fc', marginTop: '4px' }}>{bg.feature}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Stats */}
            {wizardStep === 5 && (
              <div className="wizard-step current">
                <h3 style={{ color: '#ff1f8f', marginBottom: '16px', fontSize: '20px' }}>Set ability scores</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                  {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(stat => (
                    <div key={stat} style={{ background: '#0a1628', border: '2px solid #ff1f8f', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <label style={{ display: 'block', color: '#38bdf8', marginBottom: '8px', textTransform: 'uppercase', fontSize: '12px', fontWeight: '600' }}>
                        {stat.slice(0, 3)}
                      </label>
                      <Input
                        data-testid={`stat-${stat}`}
                        type="number"
                        min="1"
                        max="20"
                        value={characterData.stats[stat]}
                        onChange={(e) => setCharacterData({
                          ...characterData,
                          stats: { ...characterData.stats, [stat]: parseInt(e.target.value) || 10 }
                        })}
                        className="input"
                        style={{ textAlign: 'center', fontSize: '20px', fontWeight: '700' }}
                      />
                      <div style={{ marginTop: '4px', color: '#ff1f8f', fontWeight: '600' }}>
                        {calculateModifier(characterData.stats[stat]) >= 0 ? '+' : ''}{calculateModifier(characterData.stats[stat])}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#0a1628', border: '2px solid #38bdf8', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ color: '#bae6fd', fontSize: '12px', marginBottom: '4px' }}>Hit Points</div>
                    <div style={{ color: '#ff1f8f', fontSize: '28px', fontWeight: '700' }}>{calculateHP()}</div>
                  </div>
                  <div style={{ background: '#0a1628', border: '2px solid #38bdf8', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ color: '#bae6fd', fontSize: '12px', marginBottom: '4px' }}>Armor Class</div>
                    <div style={{ color: '#ff1f8f', fontSize: '28px', fontWeight: '700' }}>{calculateAC()}</div>
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', color: '#ffffff', marginBottom: '8px' }}>Level</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={characterData.level}
                    onChange={(e) => setCharacterData({ ...characterData, level: parseInt(e.target.value) || 1 })}
                    className="input"
                    style={{ width: '100px' }}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Button
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                className="btn-secondary clickable-box"
                disabled={wizardStep === 1}
                style={{ opacity: wizardStep === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} /> Back
              </Button>
              {wizardStep < 5 ? (
                <Button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="btn-primary"
                  disabled={!canProceed()}
                  style={{ opacity: canProceed() ? 1 : 0.5 }}
                >
                  Next <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  data-testid="create-character-btn"
                  onClick={handleSubmit}
                  className="btn-primary"
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <Check size={16} />
                  {editingPlayer ? 'Update' : 'Create'} Character
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {players.length === 0 ? (
        <Card className="parchment-dark" style={{ padding: '40px', textAlign: 'center' }}>
          <User size={48} style={{ color: '#ff1f8f', margin: '0 auto 16px' }} />
          <p style={{ color: '#ffffff' }}>No players added yet. Create your first character!</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '20px' }}>
          {players.map(player => (
            <Card key={player.id} data-testid={`player-card-${player.id}`} className="card">
              <CardHeader>
                <CardTitle className="medieval-heading" style={{ fontSize: '20px', color: '#ffffff', marginBottom: '4px' }}>
                  {player.name}
                </CardTitle>
                <p style={{ fontSize: '14px', color: '#ff1f8f', fontWeight: '600' }}>
                  {player.character_class} • Level {player.level}
                </p>
              </CardHeader>
              <CardContent>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#bae6fd' }}>HP</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{player.hp}/{player.max_hp}</span>
                  </div>
                  <div className="hp-bar">
                    <div className="hp-bar-fill" style={{ width: `${(player.hp / player.max_hp) * 100}%` }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div className="stat-block" style={{ flex: 1 }}>
                    <div className="stat-label">AC</div>
                    <div className="stat-value">{player.ac}</div>
                  </div>
                  <div className="stat-block" style={{ flex: 1 }}>
                    <div className="stat-label">STR</div>
                    <div className="stat-value">{player.stats.strength}</div>
                  </div>
                  <div className="stat-block" style={{ flex: 1 }}>
                    <div className="stat-label">DEX</div>
                    <div className="stat-value">{player.stats.dexterity}</div>
                  </div>
                </div>
                {player.notes && (
                  <p style={{ fontSize: '11px', color: '#bae6fd', marginBottom: '12px', whiteSpace: 'pre-line' }}>{player.notes}</p>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button data-testid={`edit-player-btn-${player.id}`} onClick={() => handleEdit(player)} className="btn-secondary clickable-box" style={{ flex: 1 }}>
                    <Edit size={14} />
                  </Button>
                  <Button data-testid={`delete-player-btn-${player.id}`} onClick={() => handleDelete(player.id)} className="btn-danger">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayersTab;
