// Shared display helpers for character-sheet attack/spell cards.
// Keeps the mobile card layout consistent: top identity/details + bottom stat boxes.

export function buildAttackCardModel({
  title,
  type = 'Action',
  details = '',
  attackMod = null,
  saveText = null,
  damageText = '—',
  damageType = '—',
  damage = null,
  attackLabel = '',
}) {
  return {
    title: title || 'Attack',
    type,
    details,
    attackMod,
    saveText,
    damageText,
    damageType,
    damage,
    attackLabel: attackLabel || `${title || 'Attack'} Roll`,
  };
}

export function formatAttackMod(value) {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value) || 0;
  return number >= 0 ? `+${number}` : `${number}`;
}

export function formatDamageText({ dice, modifier = 0 }) {
  if (!dice) return '—';
  const mod = Number(modifier) || 0;
  if (!mod) return dice;
  return `${dice} ${mod >= 0 ? '+' : '-'} ${Math.abs(mod)}`;
}
