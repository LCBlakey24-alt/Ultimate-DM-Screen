import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, Crown, Shield } from 'lucide-react';

const TIER_INFO = {
  player: {
    name: 'Hero',
    color: '#3B82F6',
    icon: Shield,
    price: '£3.99/mo',
    highlight: 'Unlimited Characters'
  },
  gm: {
    name: 'Quest Master',
    color: '#E11D48',
    icon: Sparkles,
    price: '£3.99/mo',
    highlight: 'Unlimited Campaigns + ROOK AI'
  },
  legendary: {
    name: 'Legendary',
    color: '#F59E0B',
    icon: Crown,
    price: '£5.99/mo',
    highlight: 'Everything Unlimited'
  }
};

export function UpgradePrompt({ 
  type = 'character', // 'character' | 'campaign' | 'ai' | 'feature'
  currentCount = 0,
  limit = 1,
  suggestedTier = 'player',
  featureName = '',
  onClose,
  compact = false
}) {
  const navigate = useNavigate();
  const tierInfo = TIER_INFO[suggestedTier] || TIER_INFO.legendary;
  const TierIcon = tierInfo.icon;

  const getMessage = () => {
    switch (type) {
      case 'character':
        return {
          title: 'Character Limit Reached',
          description: `You've created ${currentCount}/${limit} character${limit !== 1 ? 's' : ''}. Upgrade to create unlimited characters!`
        };
      case 'campaign':
        return {
          title: 'Campaign Limit Reached',
          description: 'Free accounts can join campaigns but cannot create them. Upgrade to become a Quest Master!'
        };
      case 'ai':
        return {
          title: 'AI Calls Exhausted',
          description: `You've used all ${limit} AI calls this month. Upgrade for more (or unlimited) AI assistance!`
        };
      case 'feature':
        return {
          title: `${featureName} - Premium Feature`,
          description: `This feature requires a premium subscription. Upgrade to unlock ${featureName}!`
        };
      default:
        return {
          title: 'Upgrade Required',
          description: 'This action requires a premium subscription.'
        };
    }
  };

  const { title, description } = getMessage();

  if (compact) {
    return (
      <div 
        data-testid="upgrade-prompt-compact"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(225, 29, 72, 0.1) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px'
        }}
      >
        <Lock size={18} style={{ color: tierInfo.color, flexShrink: 0 }} />
        <span style={{ color: '#B3B3B3', fontSize: '13px', flex: 1 }}>
          {description}
        </span>
        <button
          data-testid="upgrade-btn-compact"
          onClick={() => navigate('/#pricing')}
          style={{
            padding: '6px 12px',
            background: tierInfo.color,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Upgrade
        </button>
      </div>
    );
  }

  return (
    <div 
      data-testid="upgrade-prompt-modal"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1A1A1A',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          border: `2px solid ${tierInfo.color}`,
          boxShadow: `0 0 40px ${tierInfo.color}33`
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: `${tierInfo.color}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <TierIcon size={32} style={{ color: tierInfo.color }} />
        </div>

        {/* Title */}
        <h2 style={{
          color: 'white',
          fontSize: '22px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '12px'
        }}>
          {title}
        </h2>

        {/* Description */}
        <p style={{
          color: '#B3B3B3',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          {description}
        </p>

        {/* Suggested Tier Card */}
        <div style={{
          background: '#262626',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: `1px solid ${tierInfo.color}44`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{
              color: tierInfo.color,
              fontWeight: '700',
              fontSize: '18px'
            }}>
              {tierInfo.name}
            </span>
            <span style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              {tierInfo.price}
            </span>
          </div>
          <p style={{
            color: '#808080',
            fontSize: '13px',
            margin: 0
          }}>
            {tierInfo.highlight}
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            data-testid="upgrade-cancel-btn"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              color: '#808080',
              border: '1px solid #404040',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Maybe Later
          </button>
          <button
            data-testid="upgrade-now-btn"
            onClick={() => navigate('/#pricing')}
            style={{
              flex: 1,
              padding: '14px',
              background: `linear-gradient(135deg, ${tierInfo.color} 0%, ${tierInfo.color}CC 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradePrompt;
