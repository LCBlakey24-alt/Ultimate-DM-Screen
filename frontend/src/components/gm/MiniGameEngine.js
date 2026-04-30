import React, { useState, useCallback } from 'react';
import { Dices, Trophy, Coins, AlertTriangle, Play, Users, RotateCcw, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const MINI_GAMES = [
  {
    id: 'arm_wrestling', name: 'Arm Wrestling', type: 'strength',
    description: 'A contest of raw strength. Best of 3 opposed STR checks.',
    rules: 'Both contestants roll d20+STR. Best of 3 wins.',
    buyIn: 10, payout: '2x buy-in',
  },
  {
    id: 'three_dragon_ante', name: 'Three-Dragon Ante', type: 'gambling',
    description: 'A popular card game across the realms. Requires bluffing and luck.',
    rules: 'Each round: roll d20+CHA (bluff) or d20+WIS (read). Highest wins the pot.',
    buyIn: 25, payout: 'Pot total',
  },
  {
    id: 'dragon_race', name: 'Drake Racing', type: 'racing',
    description: 'Mount a young drake and race through an obstacle course.',
    rules: '3 rounds: DEX check (obstacles), WIS check (control mount), CON check (endurance). Cumulative score wins.',
    buyIn: 50, payout: '5x buy-in',
  },
  {
    id: 'knife_throwing', name: 'Knife Throwing', type: 'skill',
    description: 'Hit the bullseye to win. Three throws, highest total score wins.',
    rules: '3 rounds of d20+DEX. Bullseye (nat 20) = 50 points. 15+ = 30 pts. 10+ = 20 pts. 5+ = 10 pts.',
    buyIn: 15, payout: '3x buy-in',
  },
  {
    id: 'drinking_contest', name: 'Drinking Contest', type: 'endurance',
    description: 'Last one standing wins! Increasing DC Constitution saves.',
    rules: 'Each round: CON save (DC starts at 8, +2 per round). Fail = eliminated.',
    buyIn: 5, payout: 'Buy-in x number of contestants',
  },
  {
    id: 'riddle_challenge', name: 'Riddle Challenge', type: 'intelligence',
    description: 'A battle of wits! Answer riddles against a cunning opponent.',
    rules: '3 rounds: INT check (DC 12/14/16). Most correct answers wins.',
    buyIn: 20, payout: '2x buy-in + a secret',
  },
];

function rollD20() { return Math.floor(Math.random() * 20) + 1; }

export default function MiniGameEngine({ theme }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState(null); // { round, playerScore, npcScore, rolls, complete, winner }
  const [participants, setParticipants] = useState([
    { name: 'Player', modifier: 3 },
    { name: 'NPC Challenger', modifier: 2 },
  ]);
  const [betAmount, setBetAmount] = useState(25);

  const startGame = useCallback((game) => {
    setSelectedGame(game);
    setGameState({ round: 0, playerScore: 0, npcScore: 0, rolls: [], complete: false, winner: null });
  }, []);

  const playRound = useCallback(() => {
    if (!gameState || gameState.complete) return;
    const playerRoll = rollD20();
    const npcRoll = rollD20();
    const pMod = participants[0].modifier;
    const nMod = participants[1].modifier;
    const playerTotal = playerRoll + pMod;
    const npcTotal = npcRoll + nMod;

    const newRolls = [...gameState.rolls, { round: gameState.round + 1, playerRoll, npcRoll, playerTotal, npcTotal }];
    const pScore = gameState.playerScore + (playerTotal > npcTotal ? 1 : 0);
    const nScore = gameState.npcScore + (npcTotal > playerTotal ? 1 : 0);
    const maxRounds = 3;
    const complete = newRolls.length >= maxRounds || pScore >= 2 || nScore >= 2;
    const winner = complete ? (pScore > nScore ? 'player' : pScore < nScore ? 'npc' : 'tie') : null;

    setGameState({ round: gameState.round + 1, playerScore: pScore, npcScore: nScore, rolls: newRolls, complete, winner });

    if (complete) {
      if (winner === 'player') toast.success(`${participants[0].name} wins! (+${betAmount * 2} GP)`);
      else if (winner === 'npc') toast.error(`${participants[1].name} wins! (-${betAmount} GP)`);
      else toast('Draw! Bets returned.');
    }
  }, [gameState, participants, betAmount]);

  const resetGame = () => { setSelectedGame(null); setGameState(null); };

  const inputStyle = { background: theme.bg.card || 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, borderRadius: '6px', color: theme.text.primary, padding: '6px 8px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' };

  return (
    <div data-testid="mini-game-engine" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', color: theme.accent?.gm || theme.accent?.primary, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Dices size={18} /> Mini-Game Engine
      </h3>

      {/* Active Game */}
      {selectedGame && gameState && (
        <div data-testid="active-game" style={{ background: theme.bg.card, border: `1px solid ${theme.accent?.primary}40`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: theme.text.primary }}>{selectedGame.name}</div>
              <div style={{ fontSize: '11px', color: theme.text.muted }}>{selectedGame.rules}</div>
            </div>
            <button onClick={resetGame} style={{ background: 'none', border: 'none', color: theme.text.muted, cursor: 'pointer' }}><RotateCcw size={14} /></button>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', padding: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '2px' }}>{participants[0].name}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#3B82F6', fontFamily: "'JetBrains Mono', monospace" }}>{gameState.playerScore}</div>
            </div>
            <span style={{ fontSize: '16px', color: theme.text.muted, fontWeight: 700 }}>VS</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: theme.text.muted, marginBottom: '2px' }}>{participants[1].name}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>{gameState.npcScore}</div>
            </div>
          </div>

          {/* Rolls */}
          {gameState.rolls.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
              <span style={{ fontSize: '10px', color: theme.text.muted, width: '50px' }}>Round {r.round}</span>
              <span style={{ flex: 1, color: r.playerTotal > r.npcTotal ? '#10B981' : theme.text.secondary, fontWeight: r.playerTotal > r.npcTotal ? 700 : 400 }}>
                {r.playerRoll}+{participants[0].modifier}={r.playerTotal}
              </span>
              <ArrowRight size={10} color={theme.text.muted} />
              <span style={{ flex: 1, textAlign: 'right', color: r.npcTotal > r.playerTotal ? '#EF4444' : theme.text.secondary, fontWeight: r.npcTotal > r.playerTotal ? 700 : 400 }}>
                {r.npcRoll}+{participants[1].modifier}={r.npcTotal}
              </span>
            </div>
          ))}

          {/* Result or Next */}
          {gameState.complete ? (
            <div style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', background: gameState.winner === 'player' ? 'rgba(16,185,129,0.1)' : gameState.winner === 'npc' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: gameState.winner === 'player' ? '#10B981' : gameState.winner === 'npc' ? '#EF4444' : '#F59E0B' }}>
                {gameState.winner === 'player' ? <><Trophy size={18} style={{ display: 'inline', marginRight: '4px' }} />{participants[0].name} Wins!</> : gameState.winner === 'npc' ? <><AlertTriangle size={18} style={{ display: 'inline', marginRight: '4px' }} />{participants[1].name} Wins!</> : 'Draw!'}
              </div>
              <div style={{ fontSize: '12px', color: theme.text.muted, marginTop: '4px' }}>
                <Coins size={12} style={{ display: 'inline', marginRight: '3px' }} />
                {gameState.winner === 'player' ? `Won ${betAmount * 2} GP` : gameState.winner === 'npc' ? `Lost ${betAmount} GP` : 'Bets returned'}
              </div>
            </div>
          ) : (
            <button data-testid="play-round-btn" onClick={playRound} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '8px', background: theme.gradient || 'linear-gradient(135deg, #D4A017, #F59E0B)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
              <Dices size={14} /> Roll Round {gameState.round + 1}
            </button>
          )}
        </div>
      )}

      {/* Game Setup (when no active game) */}
      {!selectedGame && (
        <>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>PLAYER MODIFIER</label>
              <input type="number" value={participants[0].modifier} onChange={e => setParticipants(prev => [{ ...prev[0], modifier: parseInt(e.target.value) || 0 }, prev[1]])} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>NPC MODIFIER</label>
              <input type="number" value={participants[1].modifier} onChange={e => setParticipants(prev => [prev[0], { ...prev[1], modifier: parseInt(e.target.value) || 0 }])} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted }}>BET (GP)</label>
              <input type="number" value={betAmount} onChange={e => setBetAmount(parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {MINI_GAMES.map(game => (
              <div key={game.id} data-testid={`minigame-${game.id}`} style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onClick={() => startGame(game)} onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent?.primary || '#D4A017'} onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text.primary, marginBottom: '4px' }}>{game.name}</div>
                <div style={{ fontSize: '10px', color: theme.text.secondary, lineHeight: 1.4, marginBottom: '6px' }}>{game.description}</div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10px' }}>
                  <span style={{ color: '#F59E0B' }}><Coins size={10} style={{ display: 'inline', marginRight: '2px' }} />Buy-in: {game.buyIn} GP</span>
                  <span style={{ color: '#10B981' }}><Trophy size={10} style={{ display: 'inline', marginRight: '2px' }} />{game.payout}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
