import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function SessionTimer({ theme }) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const hours = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;
  const fmt = (n) => String(n).padStart(2, '0');

  return (
    <div data-testid="session-timer" style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 12px', borderRadius: '8px',
      background: isRunning ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isRunning ? 'rgba(16,185,129,0.2)' : theme.border}`,
    }}>
      <Timer size={14} color={isRunning ? '#10B981' : theme.text.muted} />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, letterSpacing: '1px',
        color: isRunning ? '#10B981' : theme.text.secondary, minWidth: '70px',
      }}>
        {hours > 0 ? `${fmt(hours)}:` : ''}{fmt(mins)}:{fmt(secs)}
      </span>
      <button data-testid="timer-toggle" onClick={() => setIsRunning(!isRunning)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isRunning ? '#10B981' : theme.text.muted, padding: '2px', display: 'flex' }}>
        {isRunning ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button data-testid="timer-reset" onClick={() => { setElapsed(0); setIsRunning(false); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text.muted, padding: '2px', display: 'flex', opacity: 0.6 }}>
        <RotateCcw size={12} />
      </button>
    </div>
  );
}
