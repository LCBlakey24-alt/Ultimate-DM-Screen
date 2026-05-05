import React from 'react';

export default function CharacterTabs({ visibleTabs, activeTab, setActiveTab, theme }) {
  return (
    <div className="character-sheet-tabs" style={{
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
      flexWrap: 'wrap',
      padding: '10px',
      background: theme.bg.panel,
      border: `2px solid ${theme.borderActive}`,
      borderRadius: '10px',
      boxShadow: '0 10px 26px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255,255,255,0.02)',
      position: 'relative',
      zIndex: 4
    }}>
      {visibleTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} data-testid={`character-tab-${tab.id}`} className={`tab-glow press-scale ${isActive ? 'tab-active' : ''}`} style={{
            flex: '1 1 auto',
            minWidth: '112px',
            minHeight: '50px',
            padding: '10px 14px',
            background: isActive ? theme.accent.primary : theme.bg.elevated,
            color: isActive ? theme.text.primary : theme.text.secondary,
            border: isActive ? `1px solid ${theme.accent.primary}` : `1px solid ${theme.border}`,
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.22s ease',
            boxShadow: isActive ? `0 0 18px ${theme.accent.soft}` : '0 4px 12px rgba(0,0,0,0.28)'
          }}>
            <Icon size={17} strokeWidth={2.4} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
