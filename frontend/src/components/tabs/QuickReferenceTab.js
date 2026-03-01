import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Shield, Swords, Scroll, Coins, Target, Award, ChevronDown, ChevronUp, Zap, Heart, Dices } from 'lucide-react';
import { ITEMS_DATABASE, ITEM_TYPES, RARITY_OPTIONS } from '@/data/itemsDatabase';

// D&D 5e Difficulty Classes
const DIFFICULTY_CLASSES = [
  { dc: 5, difficulty: 'Very Easy', description: 'Almost anyone can succeed' },
  { dc: 10, difficulty: 'Easy', description: 'A typical person has a 50% chance' },
  { dc: 15, difficulty: 'Medium', description: 'Requires some skill or training' },
  { dc: 20, difficulty: 'Hard', description: 'Even skilled individuals may fail' },
  { dc: 25, difficulty: 'Very Hard', description: 'Only experts attempt this' },
  { dc: 30, difficulty: 'Nearly Impossible', description: 'Heroic effort required' },
];

// Experience Thresholds by Level
const XP_THRESHOLDS = [
  { level: 1, easy: 25, medium: 50, hard: 75, deadly: 100 },
  { level: 2, easy: 50, medium: 100, hard: 150, deadly: 200 },
  { level: 3, easy: 75, medium: 150, hard: 225, deadly: 400 },
  { level: 4, easy: 125, medium: 250, hard: 375, deadly: 500 },
  { level: 5, easy: 250, medium: 500, hard: 750, deadly: 1100 },
  { level: 6, easy: 300, medium: 600, hard: 900, deadly: 1400 },
  { level: 7, easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  { level: 8, easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  { level: 9, easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  { level: 10, easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  { level: 11, easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  { level: 12, easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  { level: 13, easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  { level: 14, easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  { level: 15, easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  { level: 16, easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  { level: 17, easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  { level: 18, easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  { level: 19, easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  { level: 20, easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
];

// Conditions Reference
const CONDITIONS = [
  { name: 'Blinded', effect: 'Cannot see, auto-fail sight checks, disadvantage on attacks, attackers have advantage' },
  { name: 'Charmed', effect: 'Cannot attack charmer, charmer has advantage on social checks' },
  { name: 'Deafened', effect: 'Cannot hear, auto-fail hearing checks' },
  { name: 'Frightened', effect: 'Disadvantage on checks/attacks while source is visible, cannot willingly move closer' },
  { name: 'Grappled', effect: 'Speed becomes 0, cannot benefit from speed bonuses' },
  { name: 'Incapacitated', effect: 'Cannot take actions or reactions' },
  { name: 'Invisible', effect: 'Cannot be seen without magic, advantage on attacks, attackers have disadvantage' },
  { name: 'Paralyzed', effect: 'Incapacitated, cannot move/speak, auto-fail STR/DEX saves, attacks have advantage, hits within 5ft are crits' },
  { name: 'Petrified', effect: 'Turned to stone, weight x10, incapacitated, resistant to all damage' },
  { name: 'Poisoned', effect: 'Disadvantage on attacks and ability checks' },
  { name: 'Prone', effect: 'Disadvantage on attacks, melee attacks against have advantage, ranged have disadvantage' },
  { name: 'Restrained', effect: 'Speed 0, disadvantage on attacks and DEX saves, attacks against have advantage' },
  { name: 'Stunned', effect: 'Incapacitated, cannot move, auto-fail STR/DEX saves, attacks have advantage' },
  { name: 'Unconscious', effect: 'Incapacitated, prone, auto-fail STR/DEX saves, attacks have advantage, hits within 5ft are crits' },
  { name: 'Exhaustion', effect: 'Cumulative levels: 1=Disadvantage on checks, 2=Half speed, 3=Disadvantage on attacks/saves, 4=Half HP, 5=Speed 0, 6=Death' },
];

// Cover Rules
const COVER_RULES = [
  { type: 'Half Cover', ac: '+2', dex: '+2', description: 'Low wall, furniture, another creature' },
  { type: 'Three-Quarters Cover', ac: '+5', dex: '+5', description: 'Portcullis, arrow slit, tree trunk' },
  { type: 'Total Cover', ac: 'N/A', dex: 'N/A', description: 'Cannot be targeted directly by attacks or spells' },
];

function QuickReferenceTab({ campaignId }) {
  const [activeSection, setActiveSection] = useState('items');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [showMagicOnly, setShowMagicOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dc: true,
    xp: false,
    conditions: false,
    cover: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter items
  const filteredItems = ITEMS_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = itemTypeFilter === 'all' || item.type === itemTypeFilter;
    const matchesRarity = rarityFilter === 'all' || item.rarity === rarityFilter;
    const matchesMagic = !showMagicOnly || item.is_magic;
    return matchesSearch && matchesType && matchesRarity && matchesMagic;
  }).slice(0, 100); // Limit to 100 for performance

  const sections = [
    { id: 'items', label: 'Items & Equipment', icon: Swords },
    { id: 'rules', label: 'Rules Reference', icon: Scroll },
  ];

  return (
    <div>
      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {sections.map(section => (
          <Button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={activeSection === section.id ? 'btn-primary' : 'btn-outline'}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <section.icon size={16} />
            {section.label}
          </Button>
        ))}
      </div>

      {/* Items & Equipment Section */}
      {activeSection === 'items' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Swords size={28} style={{ color: '#eab308' }} />
              D&D Items Database
            </h2>
            <span style={{ color: '#67e8f9', fontSize: '14px' }}>
              {ITEMS_DATABASE.length.toLocaleString()} items
            </span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="input-glow"
                style={{ paddingLeft: '38px' }}
                data-testid="item-search-input"
              />
            </div>
            <select
              value={itemTypeFilter}
              onChange={(e) => setItemTypeFilter(e.target.value)}
              className="input-glow"
              style={{ padding: '8px 12px', minWidth: '150px' }}
              data-testid="item-type-filter"
            >
              <option value="all">All Types</option>
              {ITEM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="input-glow"
              style={{ padding: '8px 12px', minWidth: '130px' }}
              data-testid="rarity-filter"
            >
              <option value="all">All Rarities</option>
              {RARITY_OPTIONS.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={showMagicOnly} 
                onChange={(e) => setShowMagicOnly(e.target.checked)}
                style={{ accentColor: '#eab308' }}
              />
              <span style={{ fontSize: '13px' }}>Magic Items Only</span>
            </label>
          </div>

          {/* Items List */}
          <div style={{ 
            border: '2px solid #1e40af', 
            borderRadius: '12px', 
            overflow: 'hidden',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', 
              padding: '12px 16px', 
              background: 'rgba(10, 10, 40, 0.8)', 
              borderBottom: '2px solid #1e40af',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}>
              <span style={{ color: '#67e8f9', fontWeight: '700', fontSize: '12px' }}>NAME</span>
              <span style={{ color: '#67e8f9', fontWeight: '700', fontSize: '12px' }}>TYPE</span>
              <span style={{ color: '#67e8f9', fontWeight: '700', fontSize: '12px' }}>DAMAGE</span>
              <span style={{ color: '#67e8f9', fontWeight: '700', fontSize: '12px' }}>VALUE</span>
              <span style={{ color: '#67e8f9', fontWeight: '700', fontSize: '12px' }}>RARITY</span>
            </div>
            
            <p style={{ padding: '8px 16px', fontSize: '11px', color: '#64748b', borderBottom: '1px solid #1e40af' }}>
              Showing {filteredItems.length} of {ITEMS_DATABASE.length} items
            </p>
            
            {filteredItems.map((item, index) => (
              <div 
                key={`${item.name}-${index}`}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', 
                  padding: '12px 16px', 
                  borderBottom: '1px solid rgba(30, 64, 175, 0.5)',
                  background: index % 2 === 0 ? 'rgba(10, 10, 40, 0.4)' : 'transparent',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(234, 179, 8, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'rgba(10, 10, 40, 0.4)' : 'transparent'}
              >
                <div>
                  <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>
                    {item.name}
                  </span>
                  {item.is_magic && <span style={{ color: '#eab308', marginLeft: '6px' }}>✨</span>}
                  {item.requires_attunement && <span style={{ color: '#a855f7', marginLeft: '4px', fontSize: '10px' }}>(A)</span>}
                </div>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{item.type}</span>
                <span style={{ color: item.damage ? '#ef4444' : '#64748b', fontSize: '12px' }}>
                  {item.damage ? `${item.damage} ${item.damage_type}` : '-'}
                </span>
                <span style={{ color: item.value ? '#eab308' : '#64748b', fontSize: '12px' }}>
                  {item.value || '-'}
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  color: item.rarity === 'Legendary' ? '#eab308' : item.rarity === 'Very Rare' ? '#a855f7' : item.rarity === 'Rare' ? '#4a7dff' : item.rarity === 'Uncommon' ? '#22c55e' : '#94a3b8'
                }}>
                  {item.rarity || 'Common'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Reference Section */}
      {activeSection === 'rules' && (
        <div>
          <h2 style={{ fontSize: '24px', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Scroll size={28} style={{ color: '#4a7dff' }} />
            Quick Reference
          </h2>

          {/* Difficulty Classes */}
          <Card className="card-glow" style={{ marginBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('dc')}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: expandedSections.dc ? '1px solid #1e40af' : 'none'
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={20} style={{ color: '#ef4444' }} />
                Difficulty Classes (DC)
              </h3>
              {expandedSections.dc ? <ChevronUp size={20} color="#67e8f9" /> : <ChevronDown size={20} color="#67e8f9" />}
            </div>
            {expandedSections.dc && (
              <CardContent style={{ padding: '16px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {DIFFICULTY_CLASSES.map(dc => (
                    <div key={dc.dc} style={{ background: 'rgba(10, 10, 40, 0.5)', border: '1px solid #1e40af', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '20px' }}>DC {dc.dc}</span>
                        <span style={{ color: '#67e8f9', fontWeight: '600', fontSize: '12px' }}>{dc.difficulty}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '11px' }}>{dc.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* XP Thresholds */}
          <Card className="card-glow" style={{ marginBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('xp')}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: expandedSections.xp ? '1px solid #1e40af' : 'none'
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} style={{ color: '#eab308' }} />
                Encounter XP Thresholds (Per Character)
              </h3>
              {expandedSections.xp ? <ChevronUp size={20} color="#67e8f9" /> : <ChevronDown size={20} color="#67e8f9" />}
            </div>
            {expandedSections.xp && (
              <CardContent style={{ padding: '16px 20px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #1e40af' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#67e8f9', fontSize: '12px' }}>LEVEL</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#22c55e', fontSize: '12px' }}>EASY</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#eab308', fontSize: '12px' }}>MEDIUM</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#f97316', fontSize: '12px' }}>HARD</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#ef4444', fontSize: '12px' }}>DEADLY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {XP_THRESHOLDS.map(row => (
                        <tr key={row.level} style={{ borderBottom: '1px solid rgba(30, 64, 175, 0.3)' }}>
                          <td style={{ padding: '8px 10px', color: '#fff', fontWeight: '700' }}>{row.level}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#22c55e' }}>{row.easy.toLocaleString()}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#eab308' }}>{row.medium.toLocaleString()}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#f97316' }}>{row.hard.toLocaleString()}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#ef4444' }}>{row.deadly.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Conditions */}
          <Card className="card-glow" style={{ marginBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('conditions')}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: expandedSections.conditions ? '1px solid #1e40af' : 'none'
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} style={{ color: '#a855f7' }} />
                Conditions Reference
              </h3>
              {expandedSections.conditions ? <ChevronUp size={20} color="#67e8f9" /> : <ChevronDown size={20} color="#67e8f9" />}
            </div>
            {expandedSections.conditions && (
              <CardContent style={{ padding: '16px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                  {CONDITIONS.map(condition => (
                    <div key={condition.name} style={{ background: 'rgba(10, 10, 40, 0.5)', border: '1px solid #1e40af', borderRadius: '8px', padding: '10px 12px' }}>
                      <h4 style={{ color: '#a855f7', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{condition.name}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: '1.4' }}>{condition.effect}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Cover Rules */}
          <Card className="card-glow" style={{ marginBottom: '16px' }}>
            <div 
              onClick={() => toggleSection('cover')}
              style={{ 
                padding: '16px 20px', 
                cursor: 'pointer', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: expandedSections.cover ? '1px solid #1e40af' : 'none'
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#ffffff', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} style={{ color: '#4a7dff' }} />
                Cover Rules
              </h3>
              {expandedSections.cover ? <ChevronUp size={20} color="#67e8f9" /> : <ChevronDown size={20} color="#67e8f9" />}
            </div>
            {expandedSections.cover && (
              <CardContent style={{ padding: '16px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {COVER_RULES.map(cover => (
                    <div key={cover.type} style={{ background: 'rgba(10, 10, 40, 0.5)', border: '1px solid #1e40af', borderRadius: '8px', padding: '12px' }}>
                      <h4 style={{ color: '#4a7dff', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>{cover.type}</h4>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e', fontSize: '12px' }}>AC: {cover.ac}</span>
                        <span style={{ color: '#eab308', fontSize: '12px' }}>DEX Save: {cover.dex}</span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '11px' }}>{cover.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default QuickReferenceTab;
