// Sunset theme adapter — map legacy sunset tokens to centralized `theme` tokens.
import { theme } from '../lib/theme';

// Keep a lightweight compatibility layer so components that import
// `sunsetTheme` don't break, but prefer the single `theme` source-of-truth.
export const sunsetTheme = {
  bg: {
    void: theme.bg.deep || '#05030A',
    primary: theme.bg.primary,
    surface: theme.bg.surface,
    elevated: theme.bg.elevated,
    hover: theme.bg.elevated
  },

  sunset: {
    purple: theme.accent.primary,
    purpleGlow: theme.accent.line,
    pink: theme.accent.primary,
    pinkGlow: theme.accent.line,
    gold: theme.accent.primary,
    goldGlow: theme.accent.line,
    orange: theme.warning
  },

  gm: {
    primary: theme.accent.primary,
    secondary: theme.accent.secondary || theme.accent.primary,
    glow: theme.accent.line,
    subtle: theme.accent.soft
  },
  player: {
    primary: theme.accent.primary,
    secondary: theme.accent.secondary || theme.accent.primary,
    glow: theme.accent.line,
    subtle: theme.accent.soft
  },

  text: {
    primary: theme.text.primary,
    secondary: theme.text.secondary,
    muted: theme.text.muted
  },

  border: {
    subtle: theme.accent.line,
    default: theme.border,
    strong: theme.accent.line
  },

  status: {
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
    info: theme.accent.primary
  },

  gradient: {
    sunset: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.primary} 50%, ${theme.warning} 100%)`,
    purple: `linear-gradient(135deg, ${theme.accent.primary} 0%, ${theme.accent.primary} 100%)`,
    gold: `linear-gradient(135deg, ${theme.warning} 0%, ${theme.warning} 100%)`,
    surface: `linear-gradient(180deg, ${theme.bg.surface} 0%, ${theme.bg.primary} 100%)`
  }
};

export const glassPanel = {
  background: theme.bg.surface,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${theme.accent.line}`,
  borderRadius: '16px',
  boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${theme.accent.line}`
};

export const glassPanelStrong = {
  ...glassPanel,
  background: theme.bg.elevated,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)'
};

export const card = {
  background: theme.bg.surface,
  border: `1px solid ${theme.accent.line}`,
  borderRadius: '12px',
  transition: 'all 0.3s ease'
};

export const cardHover = {
  border: `1px solid ${theme.accent.line}`,
  boxShadow: `0 8px 32px ${theme.accent.line}`,
  transform: 'translateY(-2px)'
};

export const buttonPrimary = {
  background: theme.accent.primary,
  color: theme.text.primary,
  border: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export const buttonSecondary = {
  background: theme.bg.surface,
  color: theme.text.primary,
  border: `1px solid ${theme.accent.line}`,
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export const buttonGold = {
  background: theme.warning,
  color: theme.bg.primary,
  border: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export const input = {
  background: theme.bg.primary,
  border: `1px solid ${theme.accent.line}`,
  borderRadius: '10px',
  padding: '12px 16px',
  color: theme.text.primary,
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.3s ease'
};

export const inputFocus = {
  borderColor: theme.accent.primary,
  boxShadow: `0 0 0 2px ${theme.accent.line}`
};

export const tab = {
  padding: '10px 20px',
  background: 'transparent',
  border: 'none',
  color: theme.text.secondary,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderBottom: '2px solid transparent'
};

export const tabActive = {
  color: theme.accent.primary,
  borderBottomColor: theme.accent.primary
};

export default sunsetTheme;
