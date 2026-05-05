import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Assuming framer-motion is used for animations

/**
 * CenteredDiceResultOverlay
 * Shows the roll result in the center of the screen with a "hold" duration.
 */
const CenteredDiceResultOverlay = ({ result, type, isVisible, onComplete, theme }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Hold the number on screen for 5 seconds for better visibility
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.2, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'rgba(3, 0, 20, 0.4)', // Dim the background slightly
            backdropFilter: 'blur(2px)'
          }}
        >
          <div style={{
            textAlign: 'center',
            background: 'rgba(10, 22, 40, 0.9)',
            border: `2px solid ${theme.accent || '#D4A017'}`,
            borderRadius: '50%',
            width: '180px',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 60px ${theme.accent}88, inset 0 0 20px ${theme.accent}44`,
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: theme.accent, 
              textTransform: 'uppercase', 
              fontWeight: '800', 
              letterSpacing: '0.1em',
              marginBottom: '4px'
            }}>
              {type || 'ROLL RESULT'}
            </div>
            <div style={{ fontSize: '72px', fontWeight: '900', color: '#fff', lineHeight: 1 }}>
              {result}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CenteredDiceResultOverlay;