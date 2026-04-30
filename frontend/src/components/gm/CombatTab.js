import React from 'react';
import { Swords, Users, Coins, Play, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InitiativeTracker from './InitiativeTracker';

export default function CombatTab({ theme, campaignId, scenarios, selectedScenario, setSelectedScenario, launchCombat, quickStartCombat, players, setShowQuickCombat }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '22px', color: theme.text.primary, fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Swords size={24} style={{ color: theme.accent.primary }} /> Combat Control
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Encounter Selector */}
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', color: theme.accent.gm, fontWeight: '600', marginBottom: '12px' }}>Select Encounter</h3>
          {scenarios.length === 0 ? (
            <div style={{ background: theme.bg.card, border: `1px dashed ${theme.border}`, borderRadius: '10px', padding: '30px', textAlign: 'center' }}>
              <Swords size={32} style={{ color: theme.text.muted, margin: '0 auto 12px' }} />
              <p style={{ color: theme.text.secondary, fontSize: '14px', marginBottom: '8px' }}>No encounters created</p>
              <p style={{ color: theme.text.muted, fontSize: '13px' }}>Create encounters in the Combat Creator tab of your campaign dashboard</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {scenarios.map(s => (
                <button
                  key={s.id}
                  data-testid={`encounter-${s.id}`}
                  onClick={() => setSelectedScenario(s)}
                  style={{
                    padding: '14px 16px',
                    background: selectedScenario?.id === s.id ? theme.accent.gmSubtle : theme.bg.card,
                    border: `1px solid ${selectedScenario?.id === s.id ? theme.accent.gm : theme.border}`,
                    borderLeft: selectedScenario?.id === s.id ? `3px solid ${theme.accent.gm}` : `1px solid ${theme.border}`,
                    borderRadius: '10px', color: theme.text.primary, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '4px', fontSize: '15px' }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: theme.text.secondary, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>{s.combatants?.length || 0} combatants</span>
                    {s.map_url && <span style={{ color: theme.accent.gm }}>Has Map</span>}
                    {s.combatants?.some(c => c.loot?.length > 0) && <span style={{ color: '#F59E0B' }}>Has Loot</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Combat Actions */}
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', color: theme.accent.gm, fontWeight: '600', marginBottom: '12px' }}>Launch Combat</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button onClick={launchCombat} data-testid="start-combat-btn" disabled={!selectedScenario}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', fontSize: '16px', background: selectedScenario ? theme.gradient : theme.bg.card, border: 'none', borderRadius: '10px', color: theme.text.primary, opacity: selectedScenario ? 1 : 0.5 }}>
              <Play size={18} /> Start Combat <ArrowRight size={16} />
            </Button>
            {players.length > 0 && (
              <Button onClick={quickStartCombat} data-testid="quick-combat-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'rgba(212, 160, 23, 0.1)', border: `1px solid ${theme.border}`, borderRadius: '10px', color: theme.text.secondary, fontSize: '15px' }}>
                <Users size={16} /> Quick Start with Players ({players.length})
              </Button>
            )}
            <Button onClick={() => setShowQuickCombat(true)} data-testid="spontaneous-combat-btn"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'rgba(212, 160, 23, 0.10)', border: '1px solid rgba(212, 160, 23, 0.4)', borderRadius: '10px', color: '#D4A017', fontSize: '15px', fontWeight: 700 }}>
              <Zap size={16} /> Spontaneous Combat
            </Button>
            <p style={{ fontSize: '13px', color: theme.text.muted, textAlign: 'center', fontStyle: 'italic', marginTop: '8px' }}>
              Combat opens in a dedicated full-screen view with initiative tracker and battle map
            </p>
          </div>
          
          {/* Selected Encounter Preview */}
          {selectedScenario && (
            <div style={{ marginTop: '20px', background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '14px' }}>
              <h4 style={{ fontSize: '15px', color: theme.text.primary, fontWeight: '500', marginBottom: '10px' }}>{selectedScenario.name}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedScenario.combatants?.slice(0, 6).map(c => (
                  <div key={c.id} style={{ 
                    background: c.type === 'player' ? 'rgba(212, 160, 23, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                    border: `1px solid ${c.type === 'player' ? theme.accent.primary : '#EF4444'}`,
                    padding: '6px 10px', borderRadius: '6px', fontSize: '13px', color: theme.text.primary
                  }}>
                    {c.name}
                    {c.loot?.length > 0 && <Coins size={10} style={{ marginLeft: '4px', color: '#F59E0B' }} />}
                  </div>
                ))}
                {selectedScenario.combatants?.length > 6 && (
                  <div style={{ padding: '6px 10px', fontSize: '13px', color: theme.text.muted }}>
                    +{selectedScenario.combatants.length - 6} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Initiative Tracker */}
      <div style={{ marginTop: '24px', background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '16px' }}>
        <InitiativeTracker theme={theme} campaignId={campaignId} combatants={selectedScenario?.combatants || []} />
      </div>
    </div>
  );
}
