import React, { useState, useEffect, useMemo } from 'react';
import { Package, Shield, Sword, Search, Plus, X, Coins, Weight, Sparkles, ChevronDown, ChevronUp, Zap, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ITEMS_DATABASE, ITEM_TYPES, RARITY_OPTIONS } from '@/data/itemsDatabase';
import axios from 'axios';
import { toast } from 'sonner';
import { theme as globalTheme } from '../lib/theme';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Theme colors - Electric Tundra (Player)
const theme = {
  panel: 'rgba(15, 10, 30, 0.85)',
  border: 'rgba(77, 208, 225, 0.3)',
  accent: '#4DD0E1',
  purple: '#0066FF',
  gold: '#F59E0B',
  text: '#ffffff',
  muted: '#94a3b8'
};

// Rarity colors
const rarityColors = {
  'Common': '#94a3b8',
  'Uncommon': '#22c55e',
  'Rare': '#3b82f6',
  'Very Rare': '#a855f7',
  'Legendary': '#f59e0b',
  'Artifact': '#ef4444'
};

// Currency conversion rates (to CP)
const CURRENCY_RATES = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };
const CURRENCY_LABELS = { cp: 'Copper', sp: 'Silver', ep: 'Electrum', gp: 'Gold', pp: 'Platinum' };
const CURRENCY_COLORS = { cp: '#CD7F32', sp: '#C0C0C0', ep: '#6366F1', gp: '#F59E0B', pp: '#E2E8F0' };

export default function CharacterInventory({ characterId, character, onUpdate }) {
  const [inventory, setInventory] = useState(character?.inventory || []);
  const [equippedItems, setEquippedItems] = useState(character?.equipped || {
    armor: null, shield: null, mainHand: null, offHand: null
  });
  const [currency, setCurrency] = useState(character?.currency || { cp: 0, sp: 0, ep: 0, gp: character?.gold || 0, pp: 0 });
  const [attunedItems, setAttunedItems] = useState(character?.attuned_items || []);
  const [showItemBrowser, setShowItemBrowser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [expandedItem, setExpandedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCustomAdd, setShowCustomAdd] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', type: 'Weapon', damage: '', description: '' });

  // Filter items
  const filteredItems = ITEMS_DATABASE.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || item.type === typeFilter;
    const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
    return matchesSearch && matchesType && matchesRarity;
  }).slice(0, 50); // Limit results for performance

  // Calculate total weight
  const totalWeight = inventory.reduce((sum, item) => {
    const weight = parseFloat(item.weight) || 0;
    return sum + (weight * (item.quantity || 1));
  }, 0);

  // Add item to inventory
  const addItem = (item) => {
    const existingIndex = inventory.findIndex(i => i.name === item.name);
    let newInventory;
    
    if (existingIndex >= 0) {
      newInventory = [...inventory];
      newInventory[existingIndex].quantity = (newInventory[existingIndex].quantity || 1) + 1;
    } else {
      newInventory = [...inventory, { ...item, quantity: 1, id: Date.now().toString() }];
    }
    
    setInventory(newInventory);
    toast.success(`Added ${item.name} to inventory`);
  };

  // Remove item from inventory
  const removeItem = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Unequip if equipped
    const newEquipped = { ...equippedItems };
    Object.keys(newEquipped).forEach(slot => {
      if (newEquipped[slot]?.id === itemId) {
        newEquipped[slot] = null;
      }
    });
    
    if (item.quantity > 1) {
      setInventory(inventory.map(i => 
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    } else {
      setInventory(inventory.filter(i => i.id !== itemId));
    }
    
    setEquippedItems(newEquipped);
    toast.info(`Removed ${item.name}`);
  };

  // Equip item
  const equipItem = (item, slot) => {
    const newEquipped = { ...equippedItems };
    if (newEquipped[slot]) {
      toast.info(`Unequipped ${newEquipped[slot].name}`);
    }
    newEquipped[slot] = item;
    setEquippedItems(newEquipped);
    toast.success(`Equipped ${item.name}`);
    // Auto-save with stat propagation
    autoSave(inventory, newEquipped, gold);
  };

  // Unequip item
  const unequipItem = (slot) => {
    const item = equippedItems[slot];
    if (item) {
      const newEquipped = { ...equippedItems, [slot]: null };
      setEquippedItems(newEquipped);
      toast.info(`Unequipped ${item.name}`);
      autoSave(inventory, newEquipped, gold);
    }
  };

  // Get equipment slot for item type
  const getSlotForItem = (item) => {
    const type = item.type?.toLowerCase() || '';
    if (type.includes('armor') && !type.includes('shield')) return 'armor';
    if (type === 'shield') return 'shield';
    if (type.includes('weapon')) return 'mainHand';
    return null;
  };

  // Check if item is equipped in any slot
  const isItemEquipped = (itemId) => {
    return Object.values(equippedItems).some(eq => eq?.id === itemId);
  };

  // Quick toggle equip/unequip
  const toggleEquip = (item) => {
    const slot = getSlotForItem(item);
    if (!slot) return;
    
    if (isItemEquipped(item.id)) {
      // Unequip from all slots where this item is
      const newEquipped = { ...equippedItems };
      Object.keys(newEquipped).forEach(s => {
        if (newEquipped[s]?.id === item.id) newEquipped[s] = null;
      });
      setEquippedItems(newEquipped);
      toast.info(`Unequipped ${item.name}`);
      autoSave(inventory, newEquipped, currency);
    } else {
      equipItem(item, slot);
    }
  };

  // Toggle attunement
  const toggleAttune = (item) => {
    if (attunedItems.includes(item.id)) {
      setAttunedItems(prev => prev.filter(id => id !== item.id));
      toast.info(`Ended attunement with ${item.name}`);
    } else if (attunedItems.length >= 3) {
      toast.error('Cannot attune to more than 3 items');
      return;
    } else {
      setAttunedItems(prev => [...prev, item.id]);
      toast.success(`Attuned to ${item.name}`);
    }
  };

  // Currency functions
  const totalGoldValue = useMemo(() => {
    return Object.entries(currency).reduce((sum, [type, amount]) => {
      return sum + (amount * CURRENCY_RATES[type]) / 100;
    }, 0);
  }, [currency]);

  const convertCurrency = (from, to) => {
    const fromAmount = currency[from] || 0;
    if (fromAmount <= 0) return;
    const cpValue = fromAmount * CURRENCY_RATES[from];
    const toAmount = Math.floor(cpValue / CURRENCY_RATES[to]);
    const remainCp = cpValue % CURRENCY_RATES[to];
    setCurrency(prev => ({
      ...prev,
      [from]: 0,
      [to]: (prev[to] || 0) + toAmount,
      cp: from === 'cp' ? remainCp : (prev.cp || 0) + (from !== 'cp' ? remainCp / CURRENCY_RATES.cp : 0)
    }));
    toast.success(`Converted ${fromAmount} ${from.toUpperCase()} → ${toAmount} ${to.toUpperCase()}`);
  };

  // Calculate AC from equipped items
  const calculateEquippedAC = () => {
    let ac = 10;
    const dexMod = Math.floor(((character?.dexterity || 10) - 10) / 2);
    
    if (equippedItems.armor) {
      // Try to extract base AC from description or use item AC field
      const armorMatch = equippedItems.armor.description?.match(/AC\s*(\d+)/i);
      if (armorMatch) {
        ac = parseInt(armorMatch[1]);
        // Check for max Dex bonus
        const maxDexMatch = equippedItems.armor.description?.match(/max\s*\+?(\d+)/i);
        if (maxDexMatch) {
          ac += Math.min(dexMod, parseInt(maxDexMatch[1]));
        } else if (!equippedItems.armor.type?.toLowerCase().includes('heavy')) {
          ac += dexMod;
        }
      } else {
        ac += dexMod;
      }
    } else {
      ac += dexMod;
    }
    
    if (equippedItems.shield) {
      ac += 2;
    }
    
    return ac;
  };

  // Auto-save inventory and propagate stats to character
  const autoSave = async (inv, eq, cur) => {
    try {
      setSaving(true);
      let ac = 10;
      const dexMod = Math.floor(((character?.dexterity || 10) - 10) / 2);
      if (eq.armor) {
        const armorMatch = eq.armor.description?.match(/AC\s*(\d+)/i);
        if (armorMatch) {
          ac = parseInt(armorMatch[1]);
          const maxDexMatch = eq.armor.description?.match(/max\s*\+?(\d+)/i);
          if (maxDexMatch) ac += Math.min(dexMod, parseInt(maxDexMatch[1]));
          else if (!eq.armor.type?.toLowerCase().includes('heavy')) ac += dexMod;
        } else ac += dexMod;
      } else ac += dexMod;
      if (eq.shield) ac += 2;

      await axios.patch(`${API}/characters/${characterId}`, {
        inventory: inv, equipped: eq, currency: cur, gold: cur.gp || 0, 
        armor_class: ac, attuned_items: attunedItems
      });
      onUpdate?.();
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally { setSaving(false); }
  };

  // Save inventory to backend
  const saveInventory = async () => {
    await autoSave(inventory, equippedItems, currency);
    toast.success('Inventory saved!');
  };

  // Panel style
  const panelStyle = {
    background: theme.panel,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '16px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Equipment Slots */}
      <div style={panelStyle}>
        <h3 style={{ 
          fontFamily: "'Cinzel', serif", 
          fontSize: '16px', 
          color: theme.gold,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Shield size={18} /> Equipment
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {/* Armor Slot */}
          <div 
            style={{
              padding: '12px',
              background: equippedItems.armor ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${equippedItems.armor ? theme.purple : '#374151'}`,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => equippedItems.armor && unequipItem('armor')}
          >
            <div style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Armor</div>
            {equippedItems.armor ? (
              <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{equippedItems.armor.name}</div>
            ) : (
              <div style={{ color: theme.muted, fontSize: '12px' }}>None</div>
            )}
          </div>

          {/* Shield Slot */}
          <div 
            style={{
              padding: '12px',
              background: equippedItems.shield ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${equippedItems.shield ? theme.purple : '#374151'}`,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => equippedItems.shield && unequipItem('shield')}
          >
            <div style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Shield</div>
            {equippedItems.shield ? (
              <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{equippedItems.shield.name}</div>
            ) : (
              <div style={{ color: theme.muted, fontSize: '12px' }}>None</div>
            )}
          </div>

          {/* Main Hand */}
          <div 
            style={{
              padding: '12px',
              background: equippedItems.mainHand ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${equippedItems.mainHand ? '#ef4444' : '#374151'}`,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => equippedItems.mainHand && unequipItem('mainHand')}
          >
            <div style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Main Hand</div>
            {equippedItems.mainHand ? (
                  <div>
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{equippedItems.mainHand.name}</div>
                {equippedItems.mainHand.damage && (
                  <div style={{ color: globalTheme.accent.primary, fontSize: '11px' }}>{equippedItems.mainHand.damage} {equippedItems.mainHand.damage_type}</div>
                )}
              </div>
            ) : (
              <div style={{ color: theme.muted, fontSize: '12px' }}>None</div>
            )}
          </div>

          {/* Off Hand */}
          <div 
            style={{
              padding: '12px',
              background: equippedItems.offHand ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${equippedItems.offHand ? '#ef4444' : '#374151'}`,
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => equippedItems.offHand && unequipItem('offHand')}
          >
            <div style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Off Hand</div>
            {equippedItems.offHand ? (
                <div>
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{equippedItems.offHand.name}</div>
                {equippedItems.offHand.damage && (
                  <div style={{ color: globalTheme.accent.primary, fontSize: '11px' }}>{equippedItems.offHand.damage} {equippedItems.offHand.damage_type}</div>
                )}
              </div>
            ) : (
              <div style={{ color: theme.muted, fontSize: '12px' }}>None</div>
            )}
          </div>
        </div>

        {/* Calculated AC */}
        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px', 
          background: 'rgba(138, 43, 226, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: theme.muted, fontSize: '12px' }}>Equipped AC</span>
          <span style={{ color: theme.purple, fontSize: '18px', fontWeight: '700' }}>{calculateEquippedAC()}</span>
        </div>
      </div>

      {/* Inventory List */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ 
            fontFamily: "'Cinzel', serif", 
            fontSize: '16px', 
            color: theme.gold,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Package size={18} /> Inventory ({inventory.length})
          </h3>
          <Button
            onClick={() => setShowItemBrowser(!showItemBrowser)}
            size="sm"
            style={{ 
              background: `linear-gradient(135deg, #0066FF, ${theme.accent})`,
              fontSize: '12px'
            }}
          >
            <Plus size={14} /> Add Item
          </Button>
          <Button
            onClick={() => setShowCustomAdd(!showCustomAdd)}
            size="sm"
            variant="outline"
            style={{ fontSize: '12px', marginLeft: 4 }}
          >
            Custom
          </Button>
        </div>

        {/* Currency & Weight */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Weight size={14} color={theme.muted} />
              <span style={{ color: theme.muted, fontSize: '12px' }}>{totalWeight.toFixed(1)} lbs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Coins size={14} color={theme.gold} />
              <span style={{ color: theme.gold, fontSize: 12, fontWeight: 600 }}>{totalGoldValue.toFixed(1)} GP total</span>
              <button
                onClick={() => setShowConverter(!showConverter)}
                style={{ 
                  background: showConverter ? 'rgba(77,208,225,0.2)' : 'none', 
                  border: `1px solid ${showConverter ? theme.accent : 'transparent'}`,
                  borderRadius: 4, padding: '2px 6px', cursor: 'pointer',
                  color: theme.accent, fontSize: 10,
                }}
                data-testid="currency-converter-toggle"
              >
                <ArrowRightLeft size={12} />
              </button>
            </div>
          </div>
          
          {/* Multi-currency display */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Object.entries(CURRENCY_LABELS).map(([key, label]) => (
              <div key={key} style={{ 
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '4px 8px',
                border: `1px solid ${currency[key] > 0 ? CURRENCY_COLORS[key] + '40' : '#1f2937'}`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: CURRENCY_COLORS[key] }} />
                <input
                  type="number"
                  min="0"
                  value={currency[key] || 0}
                  onChange={(e) => setCurrency(prev => ({ ...prev, [key]: Math.max(0, parseInt(e.target.value) || 0) }))}
                  style={{
                    width: 48, background: 'transparent', border: 'none',
                    color: CURRENCY_COLORS[key], fontSize: 12, fontWeight: 600,
                    textAlign: 'center', outline: 'none',
                  }}
                  data-testid={`currency-${key}-input`}
                />
                <span style={{ color: theme.muted, fontSize: 10, textTransform: 'uppercase' }}>{key}</span>
              </div>
            ))}
          </div>

          {/* Currency converter */}
          {showConverter && (
            <div style={{ 
              marginTop: 8, padding: 10, background: 'rgba(0,0,0,0.3)', 
              borderRadius: 8, border: `1px solid ${theme.border}`,
            }}>
              <div style={{ fontSize: 10, color: theme.accent, fontWeight: 600, marginBottom: 6 }}>QUICK CONVERT</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[['cp', 'sp', 10], ['sp', 'gp', 10], ['ep', 'gp', 2], ['gp', 'pp', 10]].map(([from, to, rate]) => (
                  <button key={`${from}-${to}`} onClick={() => convertCurrency(from, to)}
                    style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
                      background: 'rgba(77,208,225,0.1)', border: '1px solid rgba(77,208,225,0.2)',
                      color: theme.text, transition: 'all 0.15s',
                    }}
                    data-testid={`convert-${from}-to-${to}`}
                  >
                    {currency[from] || 0} {from.toUpperCase()} → {to.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Attunement Slots */}
        {inventory.some(i => i.is_magic && i.requires_attunement) && (
          <div style={{ 
            marginBottom: 12, padding: '8px 12px',
            background: 'rgba(139,92,246,0.08)', borderRadius: 8,
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', marginBottom: 4 }}>
              ATTUNEMENT ({attunedItems.length}/3)
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => {
                const item = attunedItems[i] ? inventory.find(inv => inv.id === attunedItems[i]) : null;
                return (
                  <div key={i} style={{
                    flex: 1, padding: '4px 8px', borderRadius: 6, textAlign: 'center',
                    background: item ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.2)',
                    border: `1px dashed ${item ? '#8B5CF6' : '#374151'}`,
                    fontSize: 10, color: item ? '#8B5CF6' : theme.muted,
                  }}>
                    {item?.name || 'Empty'}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Item Browser */}
        {showItemBrowser && (
          <div style={{ 
            marginBottom: '12px', 
            padding: '12px', 
            background: 'rgba(0,0,0,0.3)', 
            borderRadius: '8px',
            border: `1px solid ${theme.border}`
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: theme.muted }} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  style={{ paddingLeft: '32px', background: 'rgba(0,0,0,0.4)', fontSize: '12px' }}
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: theme.text,
                  padding: '6px 12px',
                  fontSize: '12px'
                }}
              >
                <option value="">All Types</option>
                {ITEM_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: theme.text,
                  padding: '6px 12px',
                  fontSize: '12px'
                }}
              >
                <option value="">All Rarities</option>
                {RARITY_OPTIONS.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => addItem(item)}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #1f2937',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(138, 43, 226, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <span style={{ color: theme.text, fontSize: '13px' }}>{item.name}</span>
                    {item.rarity && (
                      <span style={{ 
                        color: rarityColors[item.rarity] || theme.muted, 
                        fontSize: '10px', 
                        marginLeft: '8px' 
                      }}>
                        {item.rarity}
                      </span>
                    )}
                    <div style={{ color: theme.muted, fontSize: '10px' }}>{item.type}</div>
                  </div>
                  <Plus size={14} color={theme.accent} />
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: theme.muted }}>
                  No items found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Item Quick-Add */}
        {showCustomAdd && (
          <div style={{ 
            marginBottom: '12px', padding: '12px', 
            background: 'rgba(0,0,0,0.3)', borderRadius: '8px',
            border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: theme.accent }}>Add Custom Item</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Input
                value={customItem.name}
                onChange={(e) => setCustomItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Item name"
                style={{ flex: 1, minWidth: 140, background: 'rgba(0,0,0,0.4)', fontSize: 12 }}
              />
              <select
                value={customItem.type}
                onChange={(e) => setCustomItem(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  background: 'rgba(0,0,0,0.4)', border: '1px solid #374151',
                  borderRadius: 6, color: theme.text, padding: '6px 10px', fontSize: 12
                }}
              >
                <option value="Weapon">Weapon</option>
                <option value="Armor">Armor</option>
                <option value="Shield">Shield</option>
                <option value="Gear">Gear</option>
                <option value="Potion">Potion</option>
                <option value="Scroll">Scroll</option>
                <option value="Wondrous">Wondrous</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                value={customItem.damage}
                onChange={(e) => setCustomItem(prev => ({ ...prev, damage: e.target.value }))}
                placeholder="Damage (e.g. 1d8) or AC"
                style={{ flex: 1, background: 'rgba(0,0,0,0.4)', fontSize: 12 }}
              />
              <Button
                size="sm"
                onClick={() => {
                  if (!customItem.name.trim()) { toast.error('Name required'); return; }
                  addItem({
                    name: customItem.name.trim(),
                    type: customItem.type,
                    damage: customItem.damage || undefined,
                    description: customItem.description || `Custom ${customItem.type.toLowerCase()}`,
                    rarity: 'Common',
                    is_magic: false,
                  });
                  setCustomItem({ name: '', type: 'Weapon', damage: '', description: '' });
                  setShowCustomAdd(false);
                }}
                style={{ background: theme.accent, color: '#000', fontWeight: 600, fontSize: 12 }}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Inventory Items */}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {inventory.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: theme.muted }}>
              <Package size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
              <p>Inventory is empty</p>
            </div>
          ) : (
            inventory.map((item) => {
              const equipped = isItemEquipped(item.id);
              const attuned = attunedItems.includes(item.id);
              const slot = getSlotForItem(item);
              return (
              <div
                key={item.id}
                data-testid={`inventory-item-${item.id}`}
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #1f2937',
                  background: equipped ? 'rgba(0,102,255,0.08)' : expandedItem === item.id ? 'rgba(138, 43, 226, 0.1)' : 'transparent',
                  borderLeft: equipped ? '3px solid #0066FF' : '3px solid transparent',
                }}
              >
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    {item.is_magic && <Sparkles size={12} color={theme.gold} />}
                    <span style={{ color: item.rarity ? rarityColors[item.rarity] : theme.text, fontSize: '13px', fontWeight: '500' }}>
                      {item.name}
                    </span>
                    {item.quantity > 1 && (
                      <span style={{ color: theme.muted, fontSize: '11px' }}>x{item.quantity}</span>
                    )}
                    {equipped && (
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 8, background: 'rgba(0,102,255,0.3)', color: '#60A5FA', fontWeight: 600 }}>
                        EQUIPPED
                      </span>
                    )}
                    {attuned && (
                      <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 8, background: 'rgba(139,92,246,0.3)', color: '#A78BFA', fontWeight: 600 }}>
                        ATTUNED
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {/* Quick equip toggle */}
                    {slot && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleEquip(item); }}
                        data-testid={`quick-equip-${item.id}`}
                        style={{ 
                          padding: '4px 8px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
                          background: equipped ? 'rgba(239,68,68,0.15)' : 'rgba(0,102,255,0.15)',
                          border: `1px solid ${equipped ? 'rgba(239,68,68,0.3)' : 'rgba(0,102,255,0.3)'}`,
                          color: equipped ? '#F87171' : '#60A5FA',
                          fontWeight: 600, transition: 'all 0.15s',
                        }}
                      >
                        {equipped ? 'Unequip' : 'Equip'}
                      </button>
                    )}
                    {/* Attune toggle for magic items */}
                    {item.is_magic && item.requires_attunement && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleAttune(item); }}
                        data-testid={`attune-${item.id}`}
                        style={{
                          padding: '4px', borderRadius: 4, cursor: 'pointer',
                          background: attuned ? 'rgba(139,92,246,0.2)' : 'transparent',
                          border: `1px solid ${attuned ? '#8B5CF6' : 'transparent'}`,
                          color: attuned ? '#8B5CF6' : theme.muted,
                          transition: 'all 0.15s',
                        }}
                        title={attuned ? 'End Attunement' : 'Attune'}
                      >
                        <Zap size={12} />
                      </button>
                    )}
                    <button 
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      {expandedItem === item.id ? <ChevronUp size={14} color={theme.muted} /> : <ChevronDown size={14} color={theme.muted} />}
                    </button>
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedItem === item.id && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #1f2937' }}>
                    <div style={{ color: theme.muted, fontSize: '11px', marginBottom: '4px' }}>{item.type}</div>
                    {item.damage && (
                      <div style={{ color: globalTheme.accent.primary, fontSize: '12px', marginBottom: '4px' }}>
                        Damage: {item.damage} {item.damage_type}
                      </div>
                    )}
                    {item.description && (
                      <div style={{ color: theme.muted, fontSize: '11px', marginBottom: '8px' }}>
                        {item.description.substring(0, 150)}{item.description.length > 150 ? '...' : ''}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
                      {item.weight && <span style={{ color: theme.muted }}>{item.weight} lbs</span>}
                      {item.value && <span style={{ color: theme.gold }}>{item.value} GP</span>}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      style={{ marginTop: '8px', fontSize: '10px' }}
                    >
                      <X size={12} /> Remove
                    </Button>
                  </div>
                )}
              </div>
            );
            })
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={saveInventory}
          disabled={saving}
          style={{ 
            marginTop: '12px',
            width: '100%',
            background: `linear-gradient(135deg, #0066FF, ${theme.accent})`
          }}
        >
          {saving ? 'Saving...' : 'Save Inventory'}
        </Button>
      </div>
    </div>
  );
}
