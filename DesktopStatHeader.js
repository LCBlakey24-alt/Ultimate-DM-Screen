import React from 'react';
import { Heart, Shield, Zap, Wind, Star, Coffee, Moon } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, theme, color = '#D4A017' }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
      <Icon size={12} color={color} />
      <span style={{ fontSize: '10px', fontWeight: '700', color: theme.text.muted, textTransform: 'uppercase' }}>{label}</span>
    </div>
    <div style={{ fontSize: '18px', fontWeight: '800', color: theme.text.primary }}>{value}</div>
  </div>
);

const DesktopStatHeader = ({ character, theme, onRest }) => {
  const is2024 = character.edition === '2024' || character.campaign?.rules_edition === '2024';
  const raceLabel = is2024 ? 'Species' : 'Race';
  const editionLabel = is2024 ? '2024 Rules' : '2014 Rules';

  return (
    <div style={{
      background: theme.bg.panel,
      borderBottom: `1px solid ${theme.border}`,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '32px'
    }}>
      {/* Identity Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${theme.accent || '#D4A017'} 0%, #F5C542 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 15px ${theme.accent}44`
        }}>
          <span style={{ fontSize: '28px', fontWeight: '900', color: '#0A1628' }}>
            {character.name?.charAt(0)}
          </span>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: theme.accent || '#D4A017' }}>
            {character.name}
          </h1>
          <div style={{ fontSize: '13px', color: theme.text.muted, marginTop: '2px' }}>
            Level {character.level} {character.race || character.species} {character.character_class}
          </div>
          <div style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${theme.accent}44`, fontSize: '10px', color: theme.accent, fontWeight: '800' }}>
            {editionLabel}
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <StatCard 
          label="HP" 
          value={`${character.current_hit_points}/${character.max_hit_points}`} 
          icon={Heart} 
          theme={theme} 
          color="#ef4444" 
        />
        <StatCard label="Armor" value={character.armor_class} icon={Shield} theme={theme} />
        <StatCard label="Init" value="+2" icon={Zap} theme={theme} />
        <StatCard label="Speed" value="30ft" icon={Wind} theme={theme} />
        <StatCard label="Prof" value={`+${character.proficiency_bonus || 2}`} icon={Star} theme={theme} />
      </div>

      {/* Action Economy Visualizer */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: theme.text.muted, marginBottom: '2px' }}>ACT</div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }}></div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: theme.text.muted, marginBottom: '2px' }}>BON</div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.accent }}></div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: theme.text.muted, marginBottom: '2px' }}>REA</div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: `1px solid ${theme.border}` }}></div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${theme.border}` }}>
          <button 
            onClick={() => onRest('short')}
            style={{
              background: 'transparent',
              border: 'none',
              borderRight: `1px solid ${theme.border}`,
              color: theme.text.primary,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Short Rest"
          >
            <Coffee size={14} />
          </button>
          <button 
            onClick={() => onRest('long')}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.text.primary,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Long Rest"
          >
            <Moon size={14} />
          </button>
        </div>
        <button style={{
          background: theme.accent || '#D4A017',
          border: 'none',
          color: '#0A1628',
          padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '700',
          cursor: 'pointer'
        }}>LEVEL UP</button>
      </div>
    </div>
  );
};

export default DesktopStatHeader;