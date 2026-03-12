import React, { useMemo, useState } from "react";
import "../App.css";
import "../styles/designSystem.css";

const DEFAULT_CONDITIONS = [
  "Blinded",
  "Charmed",
  "Deafened",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious"
];

const startingCombatants = [
  {
    id: "c1",
    name: "Javen Krow",
    type: "Player",
    initiative: 18,
    hp: 12,
    maxHp: 12,
    ac: 14,
    conditions: []
  },
  {
    id: "c2",
    name: "Thalia Emberheart",
    type: "Player",
    initiative: 15,
    hp: 22,
    maxHp: 22,
    ac: 15,
    conditions: []
  },
  {
    id: "c3",
    name: "Goblin Scout",
    type: "Enemy",
    initiative: 14,
    hp: 7,
    maxHp: 7,
    ac: 13,
    conditions: []
  },
  {
    id: "c4",
    name: "Goblin Boss",
    type: "Enemy",
    initiative: 11,
    hp: 21,
    maxHp: 21,
    ac: 15,
    conditions: []
  }
];

function CombatPage() {
  const [combatants, setCombatants] = useState(startingCombatants);
  const [round, setRound] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [combatStarted, setCombatStarted] = useState(true);

  const sortedCombatants = useMemo(() => {
    return [...combatants].sort((a, b) => b.initiative - a.initiative);
  }, [combatants]);

  const currentCombatant = sortedCombatants[turnIndex] || null;
  const nextCombatant =
    sortedCombatants.length > 0
      ? sortedCombatants[(turnIndex + 1) % sortedCombatants.length]
      : null;

  const updateCombatant = (id, updater) => {
    setCombatants((prev) =>
      prev.map((combatant) =>
        combatant.id === id ? { ...combatant, ...updater(combatant) } : combatant
      )
    );
  };

  const adjustHp = (id, amount) => {
    updateCombatant(id, (combatant) => {
      const nextHp = Math.max(
        0,
        Math.min(combatant.maxHp, combatant.hp + amount)
      );
      return { hp: nextHp };
    });
  };

  const toggleCondition = (id, condition) => {
    updateCombatant(id, (combatant) => {
      const hasCondition = combatant.conditions.includes(condition);
      return {
        conditions: hasCondition
          ? combatant.conditions.filter((c) => c !== condition)
          : [...combatant.conditions, condition]
      };
    });
  };

  const nextTurn = () => {
    if (sortedCombatants.length === 0) return;

    if (turnIndex >= sortedCombatants.length - 1) {
      setTurnIndex(0);
      setRound((prev) => prev + 1);
    } else {
      setTurnIndex((prev) => prev + 1);
    }
  };

  const previousTurn = () => {
    if (sortedCombatants.length === 0) return;

    if (turnIndex === 0) {
      setTurnIndex(sortedCombatants.length - 1);
      setRound((prev) => Math.max(1, prev - 1));
    } else {
      setTurnIndex((prev) => prev - 1);
    }
  };

  const resetCombat = () => {
    setCombatants(startingCombatants);
    setRound(1);
    setTurnIndex(0);
    setCombatStarted(false);
  };

  const startCombat = () => {
    setCombatStarted(true);
    setRound(1);
    setTurnIndex(0);
  };

  const getHpColor = (hp, maxHp) => {
    const ratio = maxHp > 0 ? hp / maxHp : 0;
    if (ratio <= 0.25) return "#E74C3C";
    if (ratio <= 0.5) return "#E7B94C";
    return "#2ECC71";
  };

  return (
    <div style={{ padding: "32px" }}>
      <div
        className="rq-panel"
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1 className="rq-title" style={{ margin: 0, fontSize: "40px" }}>
            Combat Tracker
          </h1>
          <p className="rq-muted" style={{ marginTop: "8px", marginBottom: 0 }}>
            Track initiative, HP, and conditions during live encounters.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {!combatStarted ? (
            <button className="rq-button-primary" onClick={startCombat}>
              Start Combat
            </button>
          ) : (
            <button className="rq-button-primary" onClick={nextTurn}>
              Next Turn
            </button>
          )}
          <button className="rq-button-secondary" onClick={previousTurn}>
            Previous Turn
          </button>
          <button className="rq-button-secondary" onClick={resetCombat}>
            Reset Combat
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 2fr",
          gap: "24px",
          alignItems: "start"
        }}
      >
        <div className="rq-panel">
          <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
            Turn Order
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "18px"
            }}
          >
            {sortedCombatants.map((combatant, index) => {
              const isActive = index === turnIndex;

              return (
                <div
                  key={combatant.id}
                  className="rq-card"
                  style={{
                    border: isActive
                      ? "1px solid rgba(231,185,76,0.55)"
                      : "1px solid rgba(255,255,255,0.05)",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(123,47,247,0.15), rgba(249,115,22,0.10))"
                      : "var(--rq-bg-panel)",
                    boxShadow: isActive
                      ? "0 0 16px rgba(231,185,76,0.18)"
                      : "none"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: isActive
                            ? "var(--rq-gold-soft)"
                            : "var(--rq-text-main)"
                        }}
                      >
                        {combatant.name}
                      </div>
                      <div className="rq-muted" style={{ marginTop: "4px" }}>
                        {combatant.type}
                      </div>
                    </div>

                    <div
                      style={{
                        minWidth: "48px",
                        textAlign: "center",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        background: "var(--rq-bg-panel-soft)",
                        color: "var(--rq-gold-soft)",
                        fontWeight: 700
                      }}
                    >
                      {combatant.initiative}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div
            className="rq-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px"
            }}
          >
            <div className="rq-card">
              <div className="rq-muted" style={{ marginBottom: "8px" }}>
                Current Turn
              </div>
              <div style={{ fontWeight: 700, color: "var(--rq-gold-soft)" }}>
                {currentCombatant ? currentCombatant.name : "—"}
              </div>
            </div>

            <div className="rq-card">
              <div className="rq-muted" style={{ marginBottom: "8px" }}>
                Next Up
              </div>
              <div style={{ fontWeight: 700, color: "var(--rq-text-main)" }}>
                {nextCombatant ? nextCombatant.name : "—"}
              </div>
            </div>

            <div className="rq-card">
              <div className="rq-muted" style={{ marginBottom: "8px" }}>
                Round
              </div>
              <div style={{ fontWeight: 700, color: "var(--rq-gold-soft)" }}>
                {round}
              </div>
            </div>
          </div>

          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Combatants
            </h2>

            <div
              style={{
                display: "grid",
                gap: "18px",
                marginTop: "18px"
              }}
            >
              {sortedCombatants.map((combatant) => (
                <div key={combatant.id} className="rq-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "18px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div>
                      <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
                        {combatant.name}
                      </h3>
                      <div className="rq-muted" style={{ marginBottom: "4px" }}>
                        {combatant.type}
                      </div>
                      <div className="rq-muted">AC: {combatant.ac}</div>
                    </div>

                    <div style={{ minWidth: "220px", flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px"
                        }}
                      >
                        <span className="rq-muted">Hit Points</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: getHpColor(combatant.hp, combatant.maxHp)
                          }}
                        >
                          {combatant.hp} / {combatant.maxHp}
                        </span>
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "10px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                          marginBottom: "12px"
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(
                              0,
                              (combatant.hp / combatant.maxHp) * 100
                            )}%`,
                            height: "100%",
                            background: getHpColor(combatant.hp, combatant.maxHp)
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          marginBottom: "12px"
                        }}
                      >
                        {[-10, -5, -1, 1, 5, 10].map((amount) => (
                          <button
                            key={amount}
                            className="rq-button-secondary"
                            onClick={() => adjustHp(combatant.id, amount)}
                            style={{
                              padding: "8px 12px",
                              color: amount < 0 ? "#E74C3C" : "#2ECC71"
                            }}
                          >
                            {amount > 0 ? `+${amount}` : amount}
                          </button>
                        ))}
                      </div>

                      <div>
                        <div className="rq-muted" style={{ marginBottom: "8px" }}>
                          Conditions
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap"
                          }}
                        >
                          {DEFAULT_CONDITIONS.map((condition) => {
                            const active = combatant.conditions.includes(condition);

                            return (
                              <button
                                key={condition}
                                onClick={() =>
                                  toggleCondition(combatant.id, condition)
                                }
                                style={{
                                  padding: "8px 10px",
                                  borderRadius: "999px",
                                  border: active
                                    ? "1px solid rgba(231,185,76,0.45)"
                                    : "1px solid rgba(255,255,255,0.08)",
                                  background: active
                                    ? "rgba(123,47,247,0.18)"
                                    : "var(--rq-bg-panel-soft)",
                                  color: active
                                    ? "var(--rq-gold-soft)"
                                    : "var(--rq-text-main)",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                {condition}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Turn Reference
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "18px"
              }}
            >
              <div className="rq-card">
                <strong>Action</strong>
                <div className="rq-muted" style={{ marginTop: "8px" }}>
                  Attack, cast, dash, dodge, help, hide, disengage.
                </div>
              </div>

              <div className="rq-card">
                <strong>Bonus Action</strong>
                <div className="rq-muted" style={{ marginTop: "8px" }}>
                  Use class features, spells, or off-hand options if available.
                </div>
              </div>

              <div className="rq-card">
                <strong>Reaction</strong>
                <div className="rq-muted" style={{ marginTop: "8px" }}>
                  Opportunity attacks and triggered abilities.
                </div>
              </div>

              <div className="rq-card">
                <strong>Movement</strong>
                <div className="rq-muted" style={{ marginTop: "8px" }}>
                  Move up to speed, split movement around actions if needed.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CombatPage;
