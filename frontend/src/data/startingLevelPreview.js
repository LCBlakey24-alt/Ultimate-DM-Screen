// Starting level preview helpers for character creation.
// Uses classLevelRules.js to produce a readable checklist of choices needed
// when a player starts above level 1.

import { getChoicesForStartingLevel } from './classLevelRules';

export function getStartingLevelSummary({ className, startingLevel = 1, edition = '2014' }) {
  const level = Math.max(1, Math.min(20, Number(startingLevel || 1)));
  const choices = getChoicesForStartingLevel({ className, startingLevel: level, edition });
  const byType = choices.reduce((acc, choice) => {
    acc[choice.type] = acc[choice.type] || [];
    acc[choice.type].push(choice);
    return acc;
  }, {});

  return {
    className,
    startingLevel: level,
    edition: String(edition) === '2024' ? '2024' : '2014',
    choices,
    subclassChoices: byType.subclass || [],
    asiOrFeatChoices: byType.asi_or_feat || [],
    spellcastingStartChoices: byType.spellcasting_start || [],
    hasExtraChoices: choices.length > 0,
  };
}

export function formatStartingLevelSummary(summary) {
  if (!summary?.hasExtraChoices) return [];
  const lines = [];
  if (summary.subclassChoices.length) {
    lines.push(`Subclass choice at level ${summary.subclassChoices.map(c => c.level).join(', ')}`);
  }
  if (summary.asiOrFeatChoices.length) {
    lines.push(`ASI / feat choices at levels ${summary.asiOrFeatChoices.map(c => c.level).join(', ')}`);
  }
  if (summary.spellcastingStartChoices.length) {
    lines.push(`Spellcasting starts at level ${summary.spellcastingStartChoices.map(c => c.level).join(', ')}`);
  }
  return lines;
}
