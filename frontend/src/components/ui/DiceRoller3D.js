import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Dice face configurations for 3D effect
const DICE_FACES = {
  d4: ['1', '2', '3', '4'],
  d6: ['1', '2', '3', '4', '5', '6'],
  d8: ['1', '2', '3', '4', '5', '6', '7', '8'],
  d10: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  d12: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  d20: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
  d100: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '00']
};

const DiceRoller3D = ({ isOpen, onClose, rolls, label, modifier = 0, total, isCrit, isFumble, theme = 'gm' }) => {
  const [phase, setPhase] = useState('rolling'); // rolling, bouncing, final
  const [displayNumbers, setDisplayNumbers] = useState([]);
  const [showTotal, setShowTotal] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!isOpen) {
      setPhase('rolling');
      setDisplayNumbers([]);
      setShowTotal(false);
      setRotation({ x: 0, y: 0, z: 0 });
      return;
    }

    // Phase 1: Rolling animation with random numbers and rotation
    let spinInterval;
    const rollInterval = setInterval(() => {
      setDisplayNumbers(rolls.map(roll => ({
        ...roll,
        display: Math.floor(Math.random() * roll.sides) + 1
      })));
    }, 50);

    // Spin animation
    spinInterval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 25,
        y: prev.y + 35,
        z: prev.z + 15
      }));
    }, 30);

    // Phase 2: Stop rolling, show bounce
    setTimeout(() => {
      clearInterval(rollInterval);
      clearInterval(spinInterval);
      setRotation({ x: 0, y: 0, z: 0 });
      setDisplayNumbers(rolls.map(roll => ({
        ...roll,
        display: roll.result
      })));
      setPhase('bouncing');
    }, 800);

    // Phase 3: Show final with total
    setTimeout(() => {
      setPhase('final');
      setShowTotal(true);
    }, 1500);

    // Auto close after display
    setTimeout(() => {
      onClose();
    }, 3500);

    return () => {
      clearInterval(rollInterval);
      clearInterval(spinInterval);
    };
  }, [isOpen, rolls, onClose]);

  if (!isOpen) return null;

  // Theme colors
  const colors = theme === 'player' 
    ? { primary: '#4DD0E1', secondary: '#0066FF', glow: 'rgba(77, 208, 225, 0.4)' }
    : { primary: '#8A2BE2', secondary: '#4B0082', glow: 'rgba(138, 43, 226, 0.4)' };

  const getCritColor = () => {
    if (isCrit) return '#F59E0B';
    if (isFumble) return '#ef4444';
    return colors.primary;
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Dark blurred overlay - much darker than before
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Subtle gradient glow at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: theme === 'player'
          ? 'radial-gradient(ellipse at 50% 100%, rgba(77, 208, 225, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at 50% 100%, rgba(138, 43, 226, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Label */}
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: '24px',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        fontWeight: '500',
        opacity: phase === 'final' ? 1 : 0.7,
        transition: 'opacity 0.3s'
      }}>
        {label}
      </div>

      {/* Dice Container */}
      <div style={{
        display: 'flex',
        gap: '40px',
        marginBottom: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        perspective: '1000px'
      }}>
        {displayNumbers.map((die, index) => {
          const isHighlight = die.result === die.sides || die.result === 1;
          const dieColor = die.result === die.sides ? '#F59E0B' : die.result === 1 ? '#ef4444' : colors.primary;
          
          return (
            <div
              key={index}
              style={{
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: phase === 'rolling' 
                  ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
                  : phase === 'bouncing'
                    ? 'rotateX(0deg) rotateY(0deg) scale(1.1)'
                    : 'rotateX(0deg) rotateY(0deg) scale(1)',
                transition: phase === 'rolling' ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Dice shape */}
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(145deg, rgba(20, 20, 30, 0.9), rgba(10, 10, 15, 0.95))`,
                border: `3px solid ${dieColor}`,
                borderRadius: die.sides === 4 ? '4px' : die.sides === 6 ? '20px' : '50%',
                boxShadow: phase === 'final' 
                  ? `0 0 40px ${dieColor}60, 0 0 80px ${dieColor}30, inset 0 0 30px ${dieColor}20`
                  : `0 0 20px ${dieColor}40, inset 0 0 15px ${dieColor}10`,
                animation: phase === 'final' && isHighlight ? 'critGlow 1.5s ease-in-out infinite' : 'none',
                transform: die.sides === 4 ? 'rotate(45deg)' : 'none'
              }}>
                {/* Number */}
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: die.display >= 10 ? '48px' : '60px',
                  fontWeight: '800',
                  color: phase === 'final' ? (isHighlight ? dieColor : '#FFFFFF') : 'rgba(255, 255, 255, 0.8)',
                  transform: die.sides === 4 ? 'rotate(-45deg)' : 'none',
                  textShadow: phase === 'final' 
                    ? `0 0 30px ${dieColor}, 0 0 60px ${dieColor}80`
                    : 'none',
                  transition: 'color 0.3s, text-shadow 0.3s'
                }}>
                  {die.display}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Display */}
      {showTotal && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.5s ease-out'
        }}>
          {/* Modifier display */}
          {modifier !== 0 && (
            <div style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '8px'
            }}>
              {rolls.map(r => r.result).join(' + ')}{modifier >= 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`}
            </div>
          )}
          
          {/* Total number */}
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '80px',
            fontWeight: '800',
            color: getCritColor(),
            textShadow: `0 0 40px ${getCritColor()}, 0 0 80px ${getCritColor()}60`,
            lineHeight: 1
          }}>
            {total}
          </div>

          {/* Crit/Fumble label */}
          {(isCrit || isFumble) && (
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '24px',
              fontWeight: '700',
              color: isCrit ? '#F59E0B' : '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginTop: '12px',
              textShadow: `0 0 20px ${isCrit ? '#F59E0B' : '#ef4444'}`,
              animation: 'pulse 0.5s ease-in-out infinite alternate'
            }}>
              {isCrit ? 'CRITICAL HIT!' : 'CRITICAL MISS!'}
            </div>
          )}
        </div>
      )}

      {/* Click to close hint */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        fontFamily: "'Manrope', sans-serif",
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: '0.1em'
      }}>
        Click anywhere to close
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes critGlow {
          0%, 100% { 
            box-shadow: 0 0 40px currentColor, 0 0 80px currentColor;
            transform: ${rolls[0]?.sides === 4 ? 'rotate(45deg) scale(1)' : 'scale(1)'};
          }
          50% { 
            box-shadow: 0 0 60px currentColor, 0 0 120px currentColor;
            transform: ${rolls[0]?.sides === 4 ? 'rotate(45deg) scale(1.05)' : 'scale(1.05)'};
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          from { opacity: 0.8; transform: scale(1); }
          to { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default DiceRoller3D;
