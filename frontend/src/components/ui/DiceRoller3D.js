import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const DiceRoller3D = ({ isOpen, onClose, rolls, label, modifier = 0, total, isCrit, isFumble, theme = 'gm' }) => {
  const [phase, setPhase] = useState('idle');
  // sequential: dice appear one by one | hold: all shown | smash: fly to center | final: total
  const [revealedDice, setRevealedDice] = useState([]);
  const [activeDieIndex, setActiveDieIndex] = useState(-1);
  const [spinNumbers, setSpinNumbers] = useState({});
  const [smashProgress, setSmashProgress] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [flameIntensity, setFlameIntensity] = useState(0);
  const timerRef = useRef([]);

  const clearTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };
  const addTimer = (fn, ms) => { const t = setTimeout(fn, ms); timerRef.current.push(t); return t; };

  // Theme colors
  const colors = theme === 'player'
    ? { primary: '#4DD0E1', secondary: '#0066FF', flame: '#4DD0E1', flameDark: '#0284C7', glow: 'rgba(77, 208, 225, 0.6)' }
    : { primary: '#8A2BE2', secondary: '#4B0082', flame: '#9333EA', flameDark: '#4B0082', glow: 'rgba(138, 43, 226, 0.6)' };

  // Override flame colors for nat 1 / nat 20
  const getFlameColor = () => {
    if (isCrit) return { flame: '#22C55E', flameDark: '#166534', glow: 'rgba(34, 197, 94, 0.8)' };
    if (isFumble) return { flame: '#EF4444', flameDark: '#991B1B', glow: 'rgba(239, 68, 68, 0.8)' };
    return colors;
  };

  const getEdgeGlowColor = () => {
    if (isCrit) return 'rgba(34, 197, 94, 0.8)';
    if (isFumble) return 'rgba(239, 68, 68, 0.8)';
    return colors.glow;
  };

  const getCritColor = () => {
    if (isCrit) return '#22C55E';
    if (isFumble) return '#EF4444';
    return colors.primary;
  };

  useEffect(() => {
    if (!isOpen || !rolls || rolls.length === 0) {
      setPhase('idle');
      setRevealedDice([]);
      setActiveDieIndex(-1);
      setSpinNumbers({});
      setSmashProgress(0);
      setShowTotal(false);
      setScreenShake(false);
      setFlameIntensity(0);
      clearTimers();
      return;
    }

    // Start the sequential roll sequence
    setPhase('sequential');
    setRevealedDice([]);
    setActiveDieIndex(-1);
    setFlameIntensity(0.3);

    let delay = 200; // initial delay
    const dieTime = rolls.length > 3 ? 500 : 700; // faster for many dice

    rolls.forEach((roll, idx) => {
      // Start spinning this die
      addTimer(() => {
        setActiveDieIndex(idx);
        // Spin random numbers
        const spinId = setInterval(() => {
          setSpinNumbers(prev => ({ ...prev, [idx]: Math.floor(Math.random() * roll.sides) + 1 }));
        }, 50);
        timerRef.current.push(spinId);

        // Reveal this die after spinning
        addTimer(() => {
          clearInterval(spinId);
          setSpinNumbers(prev => ({ ...prev, [idx]: roll.result }));
          setRevealedDice(prev => [...prev, idx]);
          setFlameIntensity(prev => Math.min(1, prev + 0.2));
        }, dieTime * 0.7);
      }, delay);

      delay += dieTime;
    });

    // Hold phase - all dice visible
    addTimer(() => {
      setPhase('hold');
      setFlameIntensity(0.8);
    }, delay + 200);

    // Smash phase - dice fly together
    addTimer(() => {
      setPhase('smash');
      setSmashProgress(1);
      // Screen shake on impact
      addTimer(() => {
        setScreenShake(true);
        addTimer(() => setScreenShake(false), 300);
      }, 400);
    }, delay + 800);

    // Final phase - show total
    addTimer(() => {
      setPhase('final');
      setShowTotal(true);
      setFlameIntensity(1);
    }, delay + 1400);

    // Auto close
    addTimer(() => {
      onClose();
    }, delay + 4500);

    return clearTimers;
  }, [isOpen, rolls, onClose, isCrit, isFumble]);

  if (!isOpen) return null;

  const flameColors = getFlameColor();
  const edgeGlow = getEdgeGlowColor();
  const dieCount = rolls?.length || 0;

  // Calculate positions for sequential layout
  const getDiePosition = (index, total) => {
    if (phase === 'smash' || phase === 'final') {
      return { x: 0, y: 0, scale: phase === 'final' ? 0 : 0.5, opacity: phase === 'final' ? 0 : 1 };
    }
    // Spread dice horizontally
    const spacing = Math.min(160, 600 / total);
    const totalWidth = spacing * (total - 1);
    const x = -totalWidth / 2 + index * spacing;
    return { x, y: 0, scale: 1, opacity: 1 };
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 10000, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        transform: screenShake ? `translate(${Math.random() * 8 - 4}px, ${Math.random() * 8 - 4}px)` : 'none',
        transition: screenShake ? 'none' : 'transform 0.1s',
      }}
    >
      {/* Edge Glow - All 4 sides */}
      {(phase === 'final' || phase === 'smash') && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '180px',
            background: `linear-gradient(180deg, ${edgeGlow} 0%, transparent 100%)`,
            opacity: flameIntensity, pointerEvents: 'none', animation: 'edgeGlowPulse 1.5s ease-in-out infinite', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
            background: `linear-gradient(0deg, ${edgeGlow} 0%, transparent 100%)`,
            opacity: flameIntensity, pointerEvents: 'none', animation: 'edgeGlowPulse 1.5s ease-in-out infinite', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '180px',
            background: `linear-gradient(90deg, ${edgeGlow} 0%, transparent 100%)`,
            opacity: flameIntensity, pointerEvents: 'none', animation: 'edgeGlowPulse 1.5s ease-in-out infinite', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '180px',
            background: `linear-gradient(270deg, ${edgeGlow} 0%, transparent 100%)`,
            opacity: flameIntensity, pointerEvents: 'none', animation: 'edgeGlowPulse 1.5s ease-in-out infinite', zIndex: 1 }} />
          {/* Corner intensifiers for crits */}
          {(isCrit || isFumble) && (
            <>
              {[['0%','0%','top','left'], ['0%','100%','top','right'], ['100%','0%','bottom','left'], ['100%','100%','bottom','right']].map(([cy, cx, v, h], i) => (
                <div key={i} style={{
                  position: 'absolute', [v]: 0, [h]: 0, width: '350px', height: '350px',
                  background: `radial-gradient(circle at ${cx} ${cy}, ${edgeGlow} 0%, transparent 70%)`,
                  opacity: flameIntensity, pointerEvents: 'none',
                  animation: 'cornerPulse 0.8s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`, zIndex: 2,
                }} />
              ))}
            </>
          )}
        </>
      )}

      {/* Ambient flame particles in background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flame-particle" style={{
            position: 'absolute',
            left: `${10 + Math.random() * 80}%`,
            bottom: `${-5 - Math.random() * 10}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${20 + Math.random() * 40}px`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: `linear-gradient(0deg, ${flameColors.flameDark}, ${flameColors.flame}, transparent)`,
            opacity: flameIntensity * (0.2 + Math.random() * 0.4),
            animation: `flameRise ${2 + Math.random() * 3}s ease-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }} />
        ))}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: '22px',
        color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px',
        textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '500',
        opacity: phase === 'final' ? 1 : 0.7, transition: 'opacity 0.3s', zIndex: 10,
      }}>
        {label}
      </div>

      {/* Dice Container */}
      <div style={{
        position: 'relative', width: '700px', height: '200px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        perspective: '1200px', zIndex: 10,
      }}>
        {(rolls || []).map((die, index) => {
          const pos = getDiePosition(index, dieCount);
          const isActive = activeDieIndex === index;
          const isRevealed = revealedDice.includes(index);
          const isVisible = index <= activeDieIndex || phase === 'hold';
          const displayNum = spinNumbers[index] || die.result;
          const isHighlight = isRevealed && (die.result === die.sides || die.result === 1);
          const dieColor = isRevealed
            ? (die.result === die.sides ? '#22C55E' : die.result === 1 ? '#EF4444' : colors.primary)
            : colors.primary;
          const dieSize = dieCount > 4 ? 100 : 130;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: `${dieSize}px`, height: `${dieSize}px`,
                transform: `translateX(${pos.x}px) translateY(${pos.y}px) scale(${pos.scale})`,
                opacity: isVisible ? pos.opacity : 0,
                transition: phase === 'smash' ? 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 0.3s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isActive ? 20 : 10,
              }}
            >
              {/* Flame aura around active die */}
              {(isActive || isRevealed) && phase !== 'smash' && phase !== 'final' && (
                <div style={{
                  position: 'absolute', inset: '-20px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${flameColors.flame}30 0%, ${flameColors.flame}10 40%, transparent 70%)`,
                  animation: 'dieFlameAura 0.8s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Die flame wisps */}
              {(isActive && !isRevealed) && (
                <>
                  {Array.from({ length: 6 }).map((_, fi) => (
                    <div key={fi} style={{
                      position: 'absolute',
                      left: `${20 + Math.random() * 60}%`,
                      bottom: '80%',
                      width: `${3 + Math.random() * 5}px`,
                      height: `${15 + Math.random() * 25}px`,
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      background: `linear-gradient(0deg, ${flameColors.flameDark}, ${flameColors.flame}, transparent)`,
                      opacity: 0.7,
                      animation: `dieFlameWisp ${0.5 + Math.random() * 0.8}s ease-out infinite`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      pointerEvents: 'none',
                    }} />
                  ))}
                </>
              )}

              {/* Die body */}
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(145deg, rgba(30, 30, 40, 0.95), rgba(15, 15, 20, 0.98))',
                border: `4px solid ${dieColor}`,
                borderRadius: die.sides === 4 ? '4px' : die.sides === 6 ? '20px' : '50%',
                boxShadow: isRevealed
                  ? `0 0 40px ${dieColor}80, 0 0 80px ${dieColor}40, inset 0 0 30px ${dieColor}25`
                  : `0 0 20px ${dieColor}40, inset 0 0 15px ${dieColor}10`,
                animation: isActive && !isRevealed
                  ? 'dieSpinBounce 0.15s ease-in-out infinite alternate'
                  : isRevealed ? 'dieLandBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                transform: die.sides === 4 ? 'rotate(45deg)' : 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}>
                {/* Die type label (d20, d6, etc) */}
                <div style={{
                  position: 'absolute', top: '6px', right: '8px',
                  fontSize: '10px', color: `${dieColor}80`, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  transform: die.sides === 4 ? 'rotate(-45deg)' : 'none',
                }}>
                  d{die.sides}
                </div>

                {/* Number */}
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: displayNum >= 10 ? `${dieSize * 0.38}px` : `${dieSize * 0.46}px`,
                  fontWeight: '800',
                  color: isRevealed ? (isHighlight ? dieColor : '#FFFFFF') : 'rgba(255, 255, 255, 0.85)',
                  transform: die.sides === 4 ? 'rotate(-45deg)' : 'none',
                  textShadow: isRevealed
                    ? `0 0 30px ${dieColor}, 0 0 60px ${dieColor}90`
                    : '0 0 10px rgba(255,255,255,0.3)',
                  transition: 'color 0.2s, text-shadow 0.2s',
                }}>
                  {isVisible ? displayNum : ''}
                </span>
              </div>
            </div>
          );
        })}

        {/* Smash impact burst */}
        {phase === 'smash' && (
          <div style={{
            position: 'absolute',
            width: '300px', height: '300px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${flameColors.flame}60 0%, ${flameColors.flame}20 30%, transparent 70%)`,
            animation: 'impactBurst 0.6s ease-out forwards',
            zIndex: 30,
          }} />
        )}
      </div>

      {/* Total Display */}
      {showTotal && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'smashReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 10,
        }}>
          {/* Breakdown */}
          {(modifier !== 0 || dieCount > 1) && (
            <div style={{
              fontFamily: "'Manrope', sans-serif", fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px',
              animation: 'fadeInUp 0.4s ease-out',
            }}>
              {(rolls || []).map(r => r.result).join(' + ')}{modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : ''}
            </div>
          )}

          {/* Total number with flames */}
          <div style={{ position: 'relative' }}>
            {/* Flame effect behind total */}
            <div style={{
              position: 'absolute', inset: '-40px -30px',
              background: `radial-gradient(ellipse, ${flameColors.flame}30 0%, transparent 70%)`,
              animation: 'totalFlameAura 1.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: '110px', fontWeight: '800',
              color: getCritColor(),
              textShadow: `0 0 60px ${getCritColor()}, 0 0 120px ${getCritColor()}70`,
              lineHeight: 1, position: 'relative',
            }}>
              {total}
            </div>
          </div>

          {/* Crit/Fumble label */}
          {(isCrit || isFumble) && (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: '30px', fontWeight: '700',
              color: isCrit ? '#22C55E' : '#EF4444',
              textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '16px',
              textShadow: `0 0 30px ${isCrit ? '#22C55E' : '#EF4444'}`,
              animation: 'critTextPulse 0.6s ease-in-out infinite alternate',
            }}>
              {isCrit ? 'NATURAL 20!' : 'NATURAL 1!'}
            </div>
          )}
        </div>
      )}

      {/* Click to close */}
      <div style={{
        position: 'absolute', bottom: '30px',
        fontFamily: "'Manrope', sans-serif", fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.2)', letterSpacing: '0.1em', zIndex: 10,
      }}>
        Click anywhere to close
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes edgeGlowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes flameRise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(-40vh) scaleX(0.8); opacity: 0.6; }
          100% { transform: translateY(-100vh) scaleX(0.3); opacity: 0; }
        }
        @keyframes dieFlameAura {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }
        @keyframes dieFlameWisp {
          0% { transform: translateY(0) scaleX(1); opacity: 0.8; }
          100% { transform: translateY(-30px) scaleX(0.3); opacity: 0; }
        }
        @keyframes dieSpinBounce {
          from { transform: ${''} scale(1) rotate(0deg); }
          to { transform: ${''} scale(1.05) rotate(3deg); }
        }
        @keyframes dieLandBounce {
          0% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes impactBurst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes smashReveal {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes critTextPulse {
          from { opacity: 0.85; transform: scale(1); letter-spacing: 0.2em; }
          to { opacity: 1; transform: scale(1.05); letter-spacing: 0.25em; }
        }
        @keyframes totalFlameAura {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default DiceRoller3D;
