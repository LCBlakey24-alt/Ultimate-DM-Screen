/**
 * ROOK — Shared design theme.
 * Block A design reset: dark navy background + gold outlines. No gradients, no glow.
 * Import via:  import { theme } from '@/lib/theme';
 */

export const theme = {
  // Backgrounds
  bg: {
    primary: '#0A1628',     // main dark navy page bg
    surface: '#0F2440',     // panel/card bg
    elevated: '#14304F',    // hover / elevated panel
    deep: '#08121F',        // deepest (modal backdrop)
    panel: '#0F2440'
  },
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B',
    gold: '#D4A017'
  },
  // Accents — gold-only palette
  accent: {
    primary: '#D4A017',     // main gold
    hover: '#F5C542',       // bright gold on hover
    soft: 'rgba(212, 160, 23, 0.15)',
    line: 'rgba(212, 160, 23, 0.35)',
    secondary: '#D4A017',   // no cyan any more — collapse to gold
    highlight: '#F5C542',
    pink: '#D4A017'
  },
  // Gold = universal border
  border: 'rgba(212, 160, 23, 0.35)',
  borderActive: '#D4A017',
  // State colors (kept meaningful)
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  // Legacy compatibility shims (so existing `theme.sunset.xxx` lookups don't explode)
  sunset: { purple: '#D4A017', pink: '#D4A017', gold: '#D4A017' },
  gradient: '#D4A017',  // Components referencing theme.gradient now get a flat gold
  glow: 'none',         // Disable glows
  player:  { primary: '#D4A017', hover: '#F5C542', secondary: '#D4A017' },
  gm:      { primary: '#D4A017', hover: '#F5C542', secondary: '#D4A017' },
};

/** Common panel style: navy surface + gold 1px outline. */
export const panelStyle = {
  background: theme.bg.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: 12,
  padding: 16,
};

export const buttonStyle = {
  background: theme.bg.surface,
  border: `1px solid ${theme.accent.primary}`,
  borderRadius: 8,
  color: theme.accent.primary,
  padding: '8px 14px',
  fontWeight: 600,
  cursor: 'pointer',
};
