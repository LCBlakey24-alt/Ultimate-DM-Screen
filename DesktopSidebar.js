import React from 'react';

const AbilityCard = ({ label, score, theme }) => {
  const mod = Math.floor((score - 10) / 2);
  const modStr = mod >= 0 ? `+${mod}` : mod;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px'
    }}>
      <span style={{ fontSize: '10px', fontWeight: '700', color: theme.text.muted, textTransform: 'uppercase' }}>{label}</span>
      <div style={{ fontSize: '20px', fontWeight: '800', color: theme.accent || '#D4A017' }}>{modStr}</div>
      <div style={{ fontSize: '11px', color: theme.text.primary, background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{score}</div>
    </div>
  );
};

const DesktopSidebar = ({ character, theme }) => {
  const abilities = [
    { label: 'Str', val: character.strength || 10 },
    { label: 'Dex', val: character.dexterity || 10 },
    { label: 'Con', val: character.constitution || 10 },
    { label: 'Int', val: character.intelligence || 10 },
    { label: 'Wis', val: character.wisdom || 10 },
    { label: 'Cha', val: character.charisma || 10 },
  ];

  return (
    <aside style={{
      width: '320px',
      background: 'rgba(3, 0, 20, 0.5)',
      borderRight: `1px solid ${theme.border}`,
      padding: '24px',
      height: 'calc(100vh - 160px)',
      position: 'sticky',
      top: '160px',
      overflowY: 'auto',
      scrollbarWidth: 'none'
    }}>
      {/* Ability Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '32px' }}>
        {abilities.map(a => <AbilityCard key={a.label} label={a.label} score={a.val} theme={theme} />)}
      </div>

      {/* Skills Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: theme.accent, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
          Skills & Proficiencies
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Acrobatics', 'Athletics', 'Insight', 'Perception', 'Stealth'].map(skill => (
            <div key={skill} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '13px',
              padding: '6px 0',
              borderBottom: `1px solid rgba(255,255,255,0.05)`
            }}>
              <span style={{ color: theme.text.primary }}>{skill}</span>
              <span style={{ fontWeight: '700', color: theme.accent }}>+4</span>
            </div>
          ))}
        </div>
      </div>

      {/* Passive Scores */}
      <div style={{ 
        background: 'rgba(212,160,23,0.05)', 
        borderRadius: '8px', 
        padding: '16px',
        border: `1px solid ${theme.accent}33`
      }}>
        {[
          { label: 'Passive Perception', val: 14 },
          { label: 'Passive Investigation', val: 12 },
          { label: 'Passive Insight', val: 15 }
        ].map(p => (
          <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: theme.text.muted }}>{p.label}</span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: theme.accent }}>{p.val}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default DesktopSidebar;