// Converts starting-equipment choice labels into structured item objects.
// This bridges the class starting-equipment selector and the character sheet's
// weapon/armour attack/AC helpers.

import { findWeaponRule } from './equipmentRules5e';
import { findArmorRule } from './armorRules5e';

function cleanQuantityName(label = '') {
  const text = String(label).trim();
  const qtyMatch = text.match(/(.+?)\s*x\s*(\d+)$/i);
  if (qtyMatch) return { name: qtyMatch[1].trim(), quantity: Number(qtyMatch[2]) || 1 };

  const plusMatch = text.match(/(.+?)\s*\+\s*(.+)$/i);
  if (plusMatch) return null;

  const ammoMatch = text.match(/(.+?)\s*\+\s*(arrows|bolts)$/i);
  if (ammoMatch) return null;

  return { name: text, quantity: 1 };
}

function makeWeaponItem(name, quantity = 1) {
  const rule = findWeaponRule(name);
  if (!rule) return null;
  return {
    name: rule.name,
    type: 'Weapon',
    item_type: 'weapon',
    quantity,
    damage: rule.damage,
    damage_dice: rule.damage,
    damage_type: rule.damageType,
    range: rule.range,
    properties: (rule.properties || []).join(', '),
    attack_ability: rule.ability,
    equipped: false,
  };
}

function makeArmorItem(name, quantity = 1) {
  const rule = findArmorRule(name);
  if (!rule) return null;
  return {
    name: rule.name,
    type: rule.category === 'shield' ? 'Shield' : 'Armour',
    item_type: rule.category === 'shield' ? 'shield' : 'armor',
    quantity,
    armor_category: rule.category,
    armor_class: rule.baseAc || null,
    ac_bonus: rule.acBonus || null,
    stealth_disadvantage: Boolean(rule.stealthDisadvantage),
    strength_required: rule.strengthRequired || null,
    weight: rule.weight || 0,
    equipped: false,
  };
}

function makeGenericItem(name, quantity = 1) {
  return {
    name,
    type: 'Item',
    item_type: 'item',
    quantity,
    description: '',
    equipped: false,
  };
}

export function itemFromEquipmentLabel(label) {
  if (!label) return [];
  const text = String(label).trim();

  // Split common bundles like "Longsword + Shield" into separate items.
  if (text.includes('+')) {
    return text
      .split('+')
      .map(part => part.trim())
      .flatMap(part => itemFromEquipmentLabel(part));
  }

  const quantityData = cleanQuantityName(text);
  if (!quantityData) return [makeGenericItem(text, 1)];
  const { name, quantity } = quantityData;

  const weapon = makeWeaponItem(name, quantity);
  if (weapon) return [weapon];

  const armor = makeArmorItem(name, quantity);
  if (armor) return [armor];

  // Common simple bundle expansions.
  if (/arrows/i.test(name)) return [makeGenericItem('Arrows', 20)];
  if (/bolts/i.test(name)) return [makeGenericItem('Crossbow Bolts', 20)];
  if (/simple weapon/i.test(name)) return [makeGenericItem('Simple weapon choice', quantity)];
  if (/martial weapon/i.test(name)) return [makeGenericItem('Martial weapon choice', quantity)];

  return [makeGenericItem(name, quantity)];
}

export function itemsFromStartingEquipmentLabels(labels = []) {
  const seen = new Map();
  labels.flatMap(itemFromEquipmentLabel).forEach(item => {
    const key = `${item.name}-${item.item_type}`.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, item);
      return;
    }
    const existing = seen.get(key);
    seen.set(key, { ...existing, quantity: (Number(existing.quantity) || 1) + (Number(item.quantity) || 1) });
  });
  return Array.from(seen.values());
}
