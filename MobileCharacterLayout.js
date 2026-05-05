import React from 'react';

/**
 * Mobile/Tablet Layout for Character Sheet
 * Features: Compact Sticky Vitals and Horizontal Scrolling Tabs
 */
const MobileCharacterLayout = ({ character, theme, activeTab, onTabChange, children }) => {
  const tabs = ['Overview', 'Combat', 'Inventory', 'Spells', 'Story', 'Notes'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: theme.bg.main || '#030014',
      color: theme.text.primary
    }}>
      {/* COMPACT STICKY HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: theme.bg.panel,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        {/* Identity Row */}
        <div style={{ 
          padding: '12px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: theme.accent || '#D4A017' }}>
              {character.name}
            </h1>
            <div style={{ fontSize: '11px', color: theme.text.muted, textTransform: 'uppercase' }}>
              Lvl {character.level} {character.race} {character.character_class}
            </div>
          </div>
          <button style={{
            padding: '6px 12px',
            background: 'transparent',
            border: `1px solid ${theme.accent || '#D4A017'}`,
            borderRadius: '4px',
            color: theme.accent || '#D4A017',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            LEVEL UP
          </button>
        </div>

        {/* Quick Vitals Row */}
        <div style={{ 
          display: 'flex', 
          padding: '0 16px 12px 16px', 
          gap: '8px', 
          justifyContent: 'space-between' 
        }}>
          {[
            { label: 'HP', val: `${character.current_hit_points}/${character.max_hit_points}` },
            { label: 'AC', val: character.armor_class },
            { label: 'INIT', val: '+2' }, // Example static
            { label: 'SPD', val: '30ft' }
          ].map(stat => (
            <div key={stat.label} style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.03)', 
              padding: '4px', 
              borderRadius: '6px', 
              textAlign: 'center',
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ fontSize: '9px', color: theme.text.muted }}>{stat.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* HORIZONTAL SLIDING TABS */}
        <nav style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          whiteSpace: 'nowrap', 
          padding: '0 8px',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE
          WebkitOverflowScrolling: 'touch'
        }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab.toLowerCase())}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.toLowerCase() ? `3px solid ${theme.accent || '#D4A017'}` : '3px solid transparent',
                color: activeTab === tab.toLowerCase() ? theme.text.primary : theme.text.muted,
                fontWeight: '700',
                fontSize: '12px',
                transition: 'all 0.2s'
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ padding: '16px', flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default MobileCharacterLayout;