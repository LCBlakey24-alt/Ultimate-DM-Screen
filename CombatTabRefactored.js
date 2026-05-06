import React from 'react';
import { Heart, Activity, ShieldAlert, Zap, Sword } from 'lucide-react';

const CombatCard = ({ title, icon: Icon, children, theme }) => (
  <div style={{ 
    background: theme.bg.panel, 
    border: `1px solid ${theme.border}`, 
    borderRadius: '12px', 
    marginBottom: '20px',
    overflow: 'hidden'
  }}>
    <div style={{ 
      padding: '12px 16px', 
      background: theme.accent.soft, 
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      {Icon && <Icon size={16} color={theme.accent?.primary || theme.accent} />}
      <span style={{ fontSize: '12px', fontWeight: '700', color: theme.accent?.primary || theme.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '16px' }}>{children}</div>
  </div>
);

const CombatTabRefactored = ({ character, theme }) => {
  const is2024 = character.edition === '2024' || character.campaign?.rules_edition === '2024';

  return (
    <div style={{ 
      display: 'grid', 
      // Use auto-fit to stack on small screens and go 2-column on tablets/desktops
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
      gap: '20px', 
      alignItems: 'start',
      maxWidth: '1200px'
    }}>
      
      {/* LEFT COLUMN: Vitals & Status */}
      <div>
        <CombatCard title="Hit Points" icon={Heart} theme={theme}>
          {/* HP Logic goes here (DMG/HEAL buttons) */}
          <div style={{ fontSize: '24px', textAlign: 'center', fontWeight: 'bold' }}>
            {character.current_hit_points} / {character.max_hit_points}
          </div>
        </CombatCard>

        <CombatCard title="Conditions" icon={Activity} theme={theme}>
          {/* Pill-based condition display */}
        </CombatCard>

        <CombatCard title="Exhaustion & Effects" icon={ShieldAlert} theme={theme}>
          {/* 1-6 Tracker */}
        </CombatCard>

        {is2024 && (
          <CombatCard title="Weapon Masteries" icon={Sword} theme={theme}>
            <div style={{ fontSize: '12px', color: theme.text.muted }}>
              Your mastered weapons grant special properties like <b>Topple</b>, <b>Vex</b>, or <b>Slow</b>.
            </div>
          </CombatCard>
        )}
      </div>

      {/* RIGHT COLUMN: Actions & Attacks */}
      <div>
        <CombatCard title="Attacks & Spellcasting" icon={Zap} theme={theme}>
          {/* List-based attacks with clear row separation */}
        </CombatCard>

        <CombatCard title="Combat Resources" theme={theme}>
          {/* Superiority Dice, Ki, Sorcery Points, etc. */}
        </CombatCard>
      </div>
    </div>
  );
};

export default CombatTabRefactored;