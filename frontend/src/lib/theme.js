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

/**
 * Per-class accent palette — subtle border / icon tint within the Navy/Gold theme.
 * Keep saturation LOW so it never overpowers the gold outline.
 * `tint` = used as a soft border-shadow / left-border accent
 * `icon` = used for the class crest dot next to character name + section headers
 */
export const CLASS_ACCENTS = {
  Barbarian: { tint: 'rgba(180, 83, 9, 0.35)',  icon: '#B45309', label: 'Barbarian' },
  Bard:      { tint: 'rgba(217, 119, 6, 0.35)', icon: '#D97706', label: 'Bard' },
  Cleric:    { tint: 'rgba(229, 231, 235, 0.45)',icon: '#E5E7EB', label: 'Cleric' },
  Druid:     { tint: 'rgba(22, 101, 52, 0.45)', icon: '#16A34A', label: 'Druid' },
  Fighter:   { tint: 'rgba(100, 116, 139, 0.5)',icon: '#94A3B8', label: 'Fighter' },
  Monk:      { tint: 'rgba(214, 162, 74, 0.4)', icon: '#D6A24A', label: 'Monk' },
  Paladin:   { tint: 'rgba(245, 197, 66, 0.5)', icon: '#F5C542', label: 'Paladin' },
  Ranger:    { tint: 'rgba(22, 101, 52, 0.4)',  icon: '#22C55E', label: 'Ranger' },
  Rogue:     { tint: 'rgba(30, 41, 59, 0.7)',   icon: '#475569', label: 'Rogue' },
  Sorcerer:  { tint: 'rgba(220, 38, 38, 0.35)', icon: '#DC2626', label: 'Sorcerer' },
  Warlock:   { tint: 'rgba(127, 29, 29, 0.45)', icon: '#7F1D1D', label: 'Warlock' },
  Wizard:    { tint: 'rgba(30, 64, 175, 0.45)', icon: '#3B82F6', label: 'Wizard' },
};

/**
 * Helper: returns class accent object for a character (handles multiclass — picks primary class).
 * Falls back to gold-only accent when class is unknown.
 */
export function getClassAccent(character) {
  if (!character) return { tint: theme.border, icon: theme.accent.primary, label: '' };
  // Multiclass: pick the highest-level class as primary
  const ml = character.multiclass_levels || character.class_levels;
  let primary = character.character_class;
  if (ml && Object.keys(ml).length > 1) {
    primary = Object.entries(ml).sort((a, b) => b[1] - a[1])[0][0];
  }
  return CLASS_ACCENTS[primary] || { tint: theme.border, icon: theme.accent.primary, label: primary || '' };
}
