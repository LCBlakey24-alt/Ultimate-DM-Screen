import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dice6 } from 'lucide-react';

// Player theme - Blue
const theme = {
  primary: '#3B82F6',
  hover: '#60A5FA',
  subtle: 'rgba(59, 130, 246, 0.15)',
  crit: '#22C55E',
  fail: '#EF4444',
  text: '#FFFFFF'
};

/**
 * Clickable dice roll button for character sheets
 * Shows modifier and rolls d20 + modifier on click
 */
export function DiceRollButton({ 
  modifier, 
  label, 
  diceType = 'd20',
  advantage = false,
  disadvantage = false,
  showDice = true,
  size = 'default',  // 'small', 'default', 'large'
  color = theme.primary
}) {
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);

  const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

  const handleRoll = (e) => {
    e.stopPropagation();
    setRolling(true);
    
    let roll1, roll2, finalRoll;
    const sides = parseInt(diceType.replace('d', '')) || 20;
    
    if (advantage || disadvantage) {
      roll1 = rollDice(sides);
      roll2 = rollDice(sides);
      finalRoll = advantage ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
    } else {
      finalRoll = rollDice(sides);
    }
    
    const total = finalRoll + modifier;
    setLastRoll({ roll: finalRoll, total, advantage, disadvantage, roll1, roll2 });
    
    // Determine roll type for styling
    let rollType = 'normal';
    if (sides === 20) {
      if (finalRoll === 20) rollType = 'crit';
      else if (finalRoll === 1) rollType = 'fail';
    }
    
    // Build message
    let message = `${label}: ${diceType}`;
    if (modifier >= 0) message += ` + ${modifier}`;
    else message += ` - ${Math.abs(modifier)}`;
    
    let description = `Rolled ${finalRoll}`;
    if (advantage) description += ` (Advantage: ${roll1}, ${roll2})`;
    if (disadvantage) description += ` (Disadvantage: ${roll1}, ${roll2})`;
    description += ` = ${total}`;
    
    // Show toast
    if (rollType === 'crit') {
      toast.success(`CRITICAL! ${message}`, { 
        description,
        style: { background: '#166534', border: '2px solid #22C55E' }
      });
    } else if (rollType === 'fail') {
      toast.error(`NAT 1! ${message}`, { 
        description,
        style: { background: '#7F1D1D', border: '2px solid #EF4444' }
      });
    } else {
      toast(message, { 
        description,
        icon: <Dice6 size={18} color={color} />
      });
    }
    
    setTimeout(() => setRolling(false), 300);
  };

  // Size variants
  const sizes = {
    small: { fontSize: '13px', padding: '4px 8px', iconSize: 12 },
    default: { fontSize: '14px', padding: '6px 12px', iconSize: 14 },
    large: { fontSize: '18px', padding: '8px 16px', iconSize: 18 }
  };
  
  const s = sizes[size] || sizes.default;
  const displayModifier = modifier >= 0 ? `+${modifier}` : `${modifier}`;

  return (
    <button
      onClick={handleRoll}
      data-testid={`dice-roll-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: s.padding,
        background: rolling ? theme.subtle : 'transparent',
        border: `1px solid transparent`,
        borderRadius: '4px',
        color: theme.text,
        fontSize: s.fontSize,
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: rolling ? 'scale(1.1)' : 'scale(1)'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = theme.subtle;
        e.target.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        if (!rolling) {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = 'transparent';
        }
      }}
      title={`Click to roll ${diceType}${displayModifier} for ${label}`}
    >
      {showDice && <Dice6 size={s.iconSize} color={color} />}
      <span>{displayModifier}</span>
    </button>
  );
}

/**
 * Inline clickable modifier (no dice icon, more compact)
 */
export function ClickableModifier({ 
  modifier, 
  label, 
  color = theme.primary 
}) {
  return (
    <DiceRollButton 
      modifier={modifier} 
      label={label} 
      showDice={false} 
      size="small"
      color={color}
    />
  );
}

/**
 * Dice roller for damage rolls (various dice types)
 */
export function DamageRollButton({ 
  diceFormula,  // e.g., "2d6+3"
  label = 'Damage',
  damageType = 'slashing',
  color = '#EF4444'
}) {
  const [rolling, setRolling] = useState(false);

  const parseDiceFormula = (formula) => {
    // Parse formulas like "2d6+3", "1d8", "3d6-1"
    const match = formula.match(/(\d+)?d(\d+)([+-]\d+)?/i);
    if (!match) return { count: 1, sides: 6, modifier: 0 };
    return {
      count: parseInt(match[1]) || 1,
      sides: parseInt(match[2]) || 6,
      modifier: parseInt(match[3]) || 0
    };
  };

  const handleRoll = (e) => {
    e.stopPropagation();
    setRolling(true);
    
    const { count, sides, modifier } = parseDiceFormula(diceFormula);
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    total += modifier;
    
    const rollsStr = rolls.join(' + ');
    let description = `${rollsStr}`;
    if (modifier !== 0) {
      description += modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;
    }
    description += ` = ${total} ${damageType}`;
    
    toast(`${label}: ${diceFormula}`, {
      description,
      icon: <Dice6 size={18} color={color} />
    });
    
    setTimeout(() => setRolling(false), 300);
  };

  return (
    <button
      onClick={handleRoll}
      data-testid={`damage-roll-${label.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: rolling ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
        border: '1px solid transparent',
        borderRadius: '4px',
        color: theme.text,
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(239, 68, 68, 0.15)';
        e.target.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        if (!rolling) {
          e.target.style.background = 'transparent';
          e.target.style.borderColor = 'transparent';
        }
      }}
      title={`Click to roll ${diceFormula} ${damageType} damage`}
    >
      <Dice6 size={14} color={color} />
      <span>{diceFormula}</span>
    </button>
  );
}

export default DiceRollButton;
