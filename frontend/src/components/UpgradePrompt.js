import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeatureRequirement } from '@/hooks/useSubscription';

// Theme
const theme = {
  bg: { panel: '#121F3D', dark: '#0B1530' },
  text: { white: '#FFFFFF', muted: '#808080' },
  accent: { red: '#D4AF37', cyan: '#7A5AF8' },
  border: 'rgba(212, 175, 55, 0.15)'
};

/**
 * UpgradePrompt - Shows when a feature is locked behind a subscription
 * 
 * Props:
 * - feature: string - The feature code (e.g., 'unlimited_characters')
 * - title: string - Custom title for the prompt
 * - description: string - Custom description
 * - variant: 'inline' | 'modal' | 'banner' | 'card' - Display style
 * - onClose: function - Optional close handler for modal variant
 */
export function UpgradePrompt({ 
  feature, 
  title, 
  description, 
  variant = 'card',
  onClose,
  currentCount,
  limit
}) {
  const navigate = useNavigate();
  const requirement = getFeatureRequirement(feature);
  
  const defaultTitles = {
    'unlimited_characters': 'Want More Characters?',
    'unlimited_campaigns': 'Create Unlimited Campaigns',
    'world_building': 'Unlock World Building',
    'rook_ai': 'Unlock AI Features',
    'combat_tracker': 'Advanced Combat Tools',
    'session_mode': 'Session Mode',
    'party_inventory': 'Party Inventory',
    'portrait_ai': 'AI Character Portraits',
    'character_journal': 'Character Journal'
  };

  const defaultDescriptions = {
    'unlimited_characters': 'Free accounts are limited to 1 character. Upgrade to create unlimited heroes!',
    'unlimited_campaigns': 'Start creating your own campaigns and build incredible worlds.',
    'world_building': 'Create detailed worlds with locations, NPCs, lore, and interactive maps.',
    'rook_ai': 'Let Rook AI help you generate NPCs, encounters, descriptions, and more.',
    'combat_tracker': 'Advanced initiative tracking, monster management, and battle tools.',
    'session_mode': 'Focused GM view with everything you need during live play.',
    'party_inventory': 'Track shared party loot and items.',
    'portrait_ai': 'Generate unique AI portraits for your characters.',
    'character_journal': 'Keep detailed notes and journals for your character.'
  };

  const displayTitle = title || defaultTitles[feature] || 'Upgrade Required';
  const displayDesc = description || defaultDescriptions[feature] || `This feature requires ${requirement.tierName} tier.`;

  // Inline variant - small, subtle
  if (variant === 'inline') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: 'rgba(225, 29, 72, 0.1)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        fontSize: '12px',
        color: theme.text.muted
      }}>
        <Lock size={12} color={theme.accent.red} />
        <span>Requires <span style={{ color: requirement.color, fontWeight: '400' }}>{requirement.tierName}</span></span>
        <button
          onClick={() => navigate('/pricing')}
          style={{
            background: 'none',
            border: 'none',
            color: theme.accent.red,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '12px'
          }}
        >
          Upgrade
        </button>
      </div>
    );
  }

  // Banner variant - full width
  if (variant === 'banner') {
    return (
      <div style={{
        background: 'linear-gradient(90deg, rgba(225, 29, 72, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)',
        borderTop: `1px solid ${theme.accent.red}`,
        borderBottom: `1px solid ${theme.accent.red}`,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: theme.accent.red,
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <h4 style={{ color: theme.text.white, margin: 0, fontSize: '15px', fontWeight: '400' }}>
              {displayTitle}
            </h4>
            <p style={{ color: theme.text.muted, margin: 0, fontSize: '13px' }}>
              {displayDesc}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/pricing')}
          style={{
            background: theme.accent.red,
            border: 'none',
            color: '#fff',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '400'
          }}
        >
          Upgrade to {requirement.tierName}
          <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  // Modal variant - overlay
  if (variant === 'modal') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          background: theme.bg.panel,
          border: `1px solid ${theme.accent.red}`,
          padding: '32px',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center',
          position: 'relative'
        }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                color: theme.text.muted,
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ×
            </button>
          )}
          
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F2D675 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Crown size={32} color="#fff" />
          </div>
          
          <h3 style={{ 
            color: theme.text.white, 
            fontSize: '24px', 
            fontWeight: '400',
            marginBottom: '12px'
          }}>
            {displayTitle}
          </h3>
          
          <p style={{ 
            color: theme.text.muted, 
            fontSize: '15px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            {displayDesc}
          </p>

          {limit !== undefined && currentCount !== undefined && (
            <div style={{
              background: theme.bg.dark,
              padding: '12px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              alignItems: 'center'
            }}>
              <span style={{ color: theme.text.muted, fontSize: '13px' }}>Current:</span>
              <span style={{ color: theme.accent.red, fontWeight: '400', fontSize: '18px' }}>{currentCount}</span>
              <span style={{ color: theme.text.muted, fontSize: '13px' }}>/</span>
              <span style={{ color: theme.text.muted, fontSize: '18px' }}>{limit}</span>
            </div>
          )}
          
          <Button
            onClick={() => navigate('/pricing')}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #D4AF37 0%, #F2D675 100%)',
              border: 'none',
              color: '#fff',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={18} />
            Upgrade to {requirement.tierName}
          </Button>
          
          <p style={{ color: theme.text.muted, fontSize: '12px', margin: 0 }}>
            Starting at just £3.99/month
          </p>
        </div>
      </div>
    );
  }

  // Card variant (default) - standalone card
  return (
    <div 
      data-testid="upgrade-prompt-card"
      style={{
        background: theme.bg.panel,
        border: `1px solid ${theme.border}`,
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        background: 'rgba(225, 29, 72, 0.2)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <Lock size={24} color={theme.accent.red} />
      </div>
      
      <h4 style={{ 
        color: theme.text.white, 
        fontSize: '18px', 
        fontWeight: '400',
        marginBottom: '8px'
      }}>
        {displayTitle}
      </h4>
      
      <p style={{ 
        color: theme.text.muted, 
        fontSize: '13px',
        lineHeight: '1.5',
        marginBottom: '20px'
      }}>
        {displayDesc}
      </p>

      {limit !== undefined && currentCount !== undefined && (
        <div style={{
          background: theme.bg.dark,
          padding: '8px 16px',
          marginBottom: '16px',
          display: 'inline-flex',
          gap: '6px',
          alignItems: 'center',
          fontSize: '13px'
        }}>
          <span style={{ color: theme.text.muted }}>Limit:</span>
          <span style={{ color: theme.accent.red, fontWeight: '400' }}>{currentCount}/{limit}</span>
        </div>
      )}
      
      <Button
        onClick={() => navigate('/pricing')}
        style={{
          width: '100%',
          background: theme.accent.red,
          border: 'none',
          color: '#fff',
          padding: '12px 20px',
          fontWeight: '400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        Upgrade Now
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

/**
 * LimitIndicator - Shows current usage vs limit
 */
export function LimitIndicator({ current, limit, label, color = '#D4AF37' }) {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;
  const isAtLimit = current >= limit;
  
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{ color: theme.text.muted, fontSize: '12px' }}>{label}</span>
        <span style={{ 
          color: isAtLimit ? color : theme.text.white, 
          fontSize: '13px',
          fontWeight: '400'
        }}>
          {current}/{limit}
        </span>
      </div>
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(percentage, 100)}%`,
          background: isAtLimit ? color : 'rgba(255,255,255,0.3)',
          transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );
}

export default UpgradePrompt;
