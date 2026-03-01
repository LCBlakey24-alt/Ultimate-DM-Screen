import React, { useState } from 'react';
import { Dices, X, ChevronUp, Minus } from 'lucide-react';

function FloatingDiceRoller() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [rolls, setRolls] = useState([]);
  const [customDice, setCustomDice] = useState('');

  const diceTypes = [
    { sides: 4, color: '#ef4444' },
    { sides: 6, color: '#f97316' },
    { sides: 8, color: '#eab308' },
    { sides: 10, color: '#22c55e' },
    { sides: 12, color: '#4a7dff' },
    { sides: 20, color: '#a855f7' },
    { sides: 100, color: '#ec4899' },
  ];

  const rollDice = (sides, count = 1) => {
    const results = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }
    
    const newRoll = {
      id: Date.now(),
      dice: `${count}d${sides}`,
      results,
      total,
      isCrit: sides === 20 && results.includes(20),
      isFail: sides === 20 && results.includes(1),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setRolls(prev => [newRoll, ...prev.slice(0, 9)]);
  };

  const parseAndRoll = (input) => {
    // Parse formats like "2d6", "d20", "4d8+5"
    const match = input.toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/);
    if (match) {
      const count = parseInt(match[1]) || 1;
      const sides = parseInt(match[2]);
      const modifier = parseInt(match[3]) || 0;
      
      if (sides > 0 && sides <= 100 && count > 0 && count <= 20) {
        const results = [];
        let total = modifier;
        for (let i = 0; i < count; i++) {
          const roll = Math.floor(Math.random() * sides) + 1;
          results.push(roll);
          total += roll;
        }
        
        const newRoll = {
          id: Date.now(),
          dice: input.toLowerCase(),
          results,
          total,
          modifier,
          isCrit: sides === 20 && results.includes(20),
          isFail: sides === 20 && results.includes(1),
          timestamp: new Date().toLocaleTimeString()
        };
        
        setRolls(prev => [newRoll, ...prev.slice(0, 9)]);
        setCustomDice('');
      }
    }
  };

  const clearRolls = () => setRolls([]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        data-testid="floating-dice-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 30px rgba(168, 85, 247, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.5)';
        }}
      >
        <Dices size={28} color="#fff" />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '200px' : '320px',
        background: 'linear-gradient(180deg, #1a1a3e 0%, #0f0f23 100%)',
        border: '2px solid #a855f7',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.3)',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'linear-gradient(90deg, #a855f7 0%, #7c3aed 100%)',
        cursor: 'move'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dices size={20} color="#fff" />
          <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>Dice Roller</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isMinimized ? <ChevronUp size={16} color="#fff" /> : <Minus size={16} color="#fff" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} color="#fff" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div style={{ padding: '16px' }}>
          {/* Quick Dice Buttons */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            {diceTypes.map(({ sides, color }) => (
              <button
                key={sides}
                onClick={() => rollDice(sides)}
                data-testid={`roll-d${sides}-btn`}
                style={{
                  padding: '10px 4px',
                  background: `${color}20`,
                  border: `2px solid ${color}`,
                  borderRadius: '8px',
                  color: color,
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `${color}40`;
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = `${color}20`;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                d{sides}
              </button>
            ))}
            {/* Advantage/Disadvantage */}
            <button
              onClick={() => {
                const roll1 = Math.floor(Math.random() * 20) + 1;
                const roll2 = Math.floor(Math.random() * 20) + 1;
                setRolls(prev => [{
                  id: Date.now(),
                  dice: '2d20 (Adv)',
                  results: [roll1, roll2],
                  total: Math.max(roll1, roll2),
                  isCrit: Math.max(roll1, roll2) === 20,
                  isFail: Math.max(roll1, roll2) === 1,
                  timestamp: new Date().toLocaleTimeString()
                }, ...prev.slice(0, 9)]);
              }}
              style={{
                padding: '10px 4px',
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                color: '#22c55e',
                fontWeight: '700',
                fontSize: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ADV
            </button>
          </div>

          {/* Custom Roll Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={customDice}
              onChange={(e) => setCustomDice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && parseAndRoll(customDice)}
              placeholder="e.g., 2d6+3"
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '2px solid #374151',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            <button
              onClick={() => parseAndRoll(customDice)}
              style={{
                padding: '10px 16px',
                background: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Roll
            </button>
          </div>

          {/* Roll History */}
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '8px'
          }}>
            {rolls.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                Click a die to roll!
              </p>
            ) : (
              rolls.map((roll) => (
                <div
                  key={roll.id}
                  style={{
                    padding: '10px 12px',
                    marginBottom: '6px',
                    background: roll.isCrit ? 'rgba(34, 197, 94, 0.2)' : roll.isFail ? 'rgba(239, 68, 68, 0.2)' : 'rgba(74, 125, 255, 0.1)',
                    border: `1px solid ${roll.isCrit ? '#22c55e' : roll.isFail ? '#ef4444' : '#1e40af'}`,
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>{roll.dice}</span>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{roll.timestamp}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ 
                      color: roll.isCrit ? '#22c55e' : roll.isFail ? '#ef4444' : '#fff',
                      fontWeight: '800',
                      fontSize: '20px',
                      fontFamily: 'Montserrat'
                    }}>
                      {roll.total}
                    </span>
                    {roll.results.length > 1 && (
                      <span style={{ color: '#64748b', fontSize: '11px' }}>
                        ({roll.results.join(' + ')}{roll.modifier ? ` ${roll.modifier > 0 ? '+' : ''}${roll.modifier}` : ''})
                      </span>
                    )}
                    {roll.isCrit && <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: '700' }}>NAT 20!</span>}
                    {roll.isFail && <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: '700' }}>NAT 1!</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {rolls.length > 0 && (
            <button
              onClick={clearRolls}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '8px',
                background: 'transparent',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#64748b',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Clear History
            </button>
          )}
        </div>
      )}

      {isMinimized && (
        <div style={{ padding: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[4, 6, 8, 10, 12, 20].map(sides => (
            <button
              key={sides}
              onClick={() => rollDice(sides)}
              style={{
                padding: '6px 10px',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid #a855f7',
                borderRadius: '6px',
                color: '#a855f7',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              d{sides}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FloatingDiceRoller;
