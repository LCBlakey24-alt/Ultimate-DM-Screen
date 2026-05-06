import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Zap, Wand2, Baby } from 'lucide-react';

const NAVY = '#1F1F23';
const PANEL = '#27272B';
const GOLD = '#EF4444';
const GOLD_BRIGHT = '#F87171';
const TEXT = '#F8FAFC';
const TEXT_MUTED = '#94A3B8';

const modes = [
  { key: 'kids', title: 'Kids Mode', icon: Baby, description: 'Simple choices, plain language, and family-friendly character setup.' },
  { key: 'premade', title: 'Premade Characters', icon: Users, description: 'Choose a ready-to-play hero, then pick how much control you want over future choices.' },
  { key: 'basic', title: 'Basic Build', icon: Zap, description: 'Only pick name, level, class, and race. We auto-fill the rest.' },
  { key: 'full', title: 'Full Creation', icon: Wand2, description: 'Complete control over background, ability scores, skills, and detailed setup.' },
];

export default function CharacterCreationModePicker() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px', background: NAVY, color: TEXT, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={() => navigate('/home')}
          data-testid="mode-picker-back"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', color: TEXT_MUTED,
            cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0
          }}
        >
          <ChevronLeft size={16} /> Dashboard
        </button>

        <h1 style={{
          fontFamily: "'Cinzel', serif", fontSize: 30, margin: 0,
          color: GOLD, letterSpacing: '0.5px'
        }}>
          Choose Your Character Creation Mode
        </h1>
        <p style={{ color: TEXT_MUTED, marginTop: 6, marginBottom: 28, fontSize: 14 }}>
          Pick the experience that matches how you want to play.
        </p>

        <div style={{
          display: 'grid',
          // Always 2x2 on tablets+, single column on mobile — never the orphan-card 3+1 layout.
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          maxWidth: 800, gap: 16
        }}>
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                data-testid={`mode-${mode.key}`}
                onClick={() => navigate(`/characters/new/${mode.key}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD_BRIGHT; e.currentTarget.style.background = '#323235'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = PANEL; }}
                style={{
                  textAlign: 'left', padding: '20px 18px',
                  borderRadius: 10,
                  border: `1px solid ${GOLD}`,
                  background: PANEL,
                  color: TEXT,
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: `1px solid ${GOLD}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: GOLD
                  }}>
                    <Icon size={18} />
                  </div>
                  <div style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700, fontSize: 17, color: GOLD
                  }}>
                    {mode.title}
                  </div>
                </div>
                <div style={{ color: TEXT_MUTED, fontSize: 13, lineHeight: 1.5 }}>
                  {mode.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
