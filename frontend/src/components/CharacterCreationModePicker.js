import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Baby,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

const modes = [
  {
    key: 'kids',
    title: 'Kids Mode',
    eyebrow: 'Young adventurers',
    icon: Baby,
    route: '/characters/new/kids',
    time: '2–4 mins',
    badge: 'Simplest',
    description: 'Simple choices, plain language, and a friendly guided setup for younger players or absolute beginners.',
    bestFor: 'Children, family tables, first-time roleplay, and anyone who wants less rules noise.',
    includes: ['Plain-English choices', 'Quick hero identity', 'Minimal rules pressure'],
  },
  {
    key: 'premade',
    title: 'Premade Characters',
    eyebrow: 'Ready to play',
    icon: Users,
    route: '/characters/new/premade',
    time: '1–3 mins',
    badge: 'Fastest',
    description: 'Pick a ready-to-play hero and jump straight into the game with a solid starting character.',
    bestFor: 'One-shots, new players, guest players, or anyone joining a session at short notice.',
    includes: ['Ready-made builds', 'Quick selection', 'Easy table entry'],
  },
  {
    key: 'basic',
    title: 'Basic Build',
    eyebrow: 'Guided setup',
    icon: Zap,
    route: '/characters/new/basic',
    time: '5–8 mins',
    badge: 'Recommended',
    description: 'Choose the important bits — name, race, class, and level — then let ROOK fill in the fiddly parts.',
    bestFor: 'Players who want ownership without getting buried under every character-building rule.',
    includes: ['Core choices only', 'Auto-filled details', 'Beginner-friendly control'],
    featured: true,
  },
  {
    key: 'full',
    title: 'Full Creation',
    eyebrow: 'Complete control',
    icon: Wand2,
    route: '/characters/new/full',
    time: '12–20 mins',
    badge: 'Detailed',
    description: 'Build from the ground up with full control over background, ability scores, skills, spells, gear, and personality.',
    bestFor: 'Experienced players, long campaigns, theorycrafters, and anyone who loves character creation.',
    includes: ['Ability score methods', 'Skills and spells', 'Portrait and personality'],
  },
];

export default function CharacterCreationModePicker() {
  const navigate = useNavigate();

  return (
    <main className="character-mode-page">
      <style>{pageCss}</style>
      <div className="character-mode-shell">
        <button
          onClick={() => navigate('/home')}
          data-testid="mode-picker-back"
          className="character-mode-back"
        >
          <ChevronLeft size={17} /> Dashboard
        </button>

        <section className="character-mode-hero">
          <div className="character-mode-hero-copy">
            <div className="character-mode-kicker">
              <Sparkles size={16} /> New Character
            </div>
            <h1>How do you want to build your hero?</h1>
            <p>
              Choose the creation style that matches your table, your confidence, and how much control you want. You can edit the character later, so this choice is not a trapdoor into doom.
            </p>
          </div>

          <aside className="character-mode-tip" data-testid="mode-picker-help-card">
            <div className="character-mode-tip-icon"><HelpCircle size={20} /></div>
            <div>
              <h2>Not sure?</h2>
              <p>
                Start with <strong>Basic Build</strong>. It gives you the important choices without making character creation feel like tax paperwork with goblins.
              </p>
            </div>
          </aside>
        </section>

        <section className="character-mode-grid" aria-label="Character creation modes">
          {modes.map((mode) => (
            <ModeCard key={mode.key} mode={mode} onChoose={() => navigate(mode.route)} />
          ))}
        </section>

        <section className="character-mode-summary" data-testid="mode-picker-summary">
          <div>
            <ShieldCheck size={18} />
            <span>All modes create a saved character sheet.</span>
          </div>
          <div>
            <Crown size={18} />
            <span>You can edit and improve characters after creation.</span>
          </div>
          <div>
            <Clock size={18} />
            <span>Short on time? Pick Premade or Basic.</span>
          </div>
        </section>
      </div>
    </main>
  );
}

function ModeCard({ mode, onChoose }) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      data-testid={`mode-${mode.key}`}
      onClick={onChoose}
      className={`character-mode-card${mode.featured ? ' is-featured' : ''}`}
    >
      <div className="character-mode-card-topline">
        <span>{mode.eyebrow}</span>
        <em>{mode.badge}</em>
      </div>

      <div className="character-mode-card-header">
        <div className="character-mode-icon-box">
          <Icon size={22} />
        </div>
        <div>
          <h2>{mode.title}</h2>
          <div className="character-mode-time"><Clock size={13} /> {mode.time}</div>
        </div>
      </div>

      <p className="character-mode-description">{mode.description}</p>

      <div className="character-mode-best-for">
        <strong>Best for:</strong> {mode.bestFor}
      </div>

      <ul className="character-mode-includes">
        {mode.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="character-mode-choose">
        <span>Choose this mode</span>
        <ChevronRight size={18} />
      </div>
    </button>
  );
}

const pageCss = `
.character-mode-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(212,160,23,0.15), transparent 34%),
    linear-gradient(180deg, rgba(10,22,40,0.98), rgba(10,22,40,1));
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding: 28px 18px 44px;
}

.character-mode-shell {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.character-mode-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 18px;
  padding: 8px 11px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.character-mode-back:hover {
  border-color: var(--rq-gold-bright);
  color: var(--rq-gold-bright);
  background: var(--rq-gold-soft);
}

.character-mode-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 18px;
  align-items: stretch;
  margin-bottom: 20px;
}

.character-mode-hero-copy,
.character-mode-tip,
.character-mode-summary {
  background: rgba(16, 33, 58, 0.76);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-lg);
}

.character-mode-hero-copy {
  padding: 24px 22px;
}

.character-mode-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--rq-gold-bright);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.character-mode-hero h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: clamp(30px, 5vw, 52px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -1.4px;
}

.character-mode-hero p {
  color: var(--text-secondary);
  margin: 14px 0 0;
  max-width: 760px;
  font-size: 15px;
  line-height: 1.65;
}

.character-mode-tip {
  background: rgba(212,160,23,0.10);
  border-color: var(--rq-gold-border);
  padding: 18px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.character-mode-tip-icon {
  width: 42px;
  height: 42px;
  border: 1px solid var(--rq-gold-border-strong);
  color: var(--rq-gold-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.character-mode-tip h2 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
}

.character-mode-tip p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.character-mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
  gap: 16px;
}

.character-mode-card {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  color: var(--text-primary);
  border-radius: var(--radius-none);
  padding: 18px;
  text-align: left;
  cursor: pointer;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
  box-shadow: var(--shadow-md);
}

.character-mode-card:hover {
  transform: translateY(-3px);
  border-color: var(--rq-gold-bright);
  background: var(--bg-elevated);
  box-shadow: 0 22px 52px rgba(0,0,0,0.38);
}

.character-mode-card.is-featured {
  border-color: var(--rq-gold-bright);
  box-shadow: 0 22px 48px rgba(212,160,23,0.16);
}

.character-mode-card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.character-mode-card-topline span {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.9px;
}

.character-mode-card-topline em {
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  background: rgba(255,255,255,0.04);
  padding: 4px 7px;
  border-radius: var(--radius-none);
  font-style: normal;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.character-mode-card.is-featured .character-mode-card-topline em {
  color: var(--rq-navy);
  border-color: var(--rq-gold-bright);
  background: var(--rq-gold-bright);
}

.character-mode-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.character-mode-icon-box {
  width: 48px;
  height: 48px;
  border: 1px solid var(--rq-gold-border-strong);
  color: var(--rq-gold-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: var(--rq-gold-soft);
}

.character-mode-card h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.4px;
}

.character-mode-time {
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 800;
}

.character-mode-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.character-mode-best-for {
  border: 1px solid var(--border-subtle);
  background: rgba(0,0,0,0.12);
  padding: 10px 11px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.character-mode-includes {
  margin: 0;
  padding-left: 18px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.75;
}

.character-mode-choose {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border-subtle);
  padding-top: 13px;
  color: var(--rq-gold-bright);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.character-mode-summary {
  margin-top: 16px;
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.character-mode-summary div {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
}

.character-mode-summary svg {
  color: var(--rq-gold-bright);
}

@media (max-width: 820px) {
  .character-mode-hero {
    grid-template-columns: 1fr;
  }
}
`;
