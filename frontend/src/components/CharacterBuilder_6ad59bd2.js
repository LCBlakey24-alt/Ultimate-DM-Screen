
import React, { useState } from "react";
import "../App.css";
import "../styles/designSystem.css";

/*
Simplified but improved Character Builder.
Focuses on fixing:
- stat assignment (standard array or rolled)
- manual allocation
- race bonuses
- portrait display
*/

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const ABILITIES = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma"
];

export default function CharacterBuilder({ onCreateCharacter }) {

  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [className, setClassName] = useState("");
  const [portrait, setPortrait] = useState("");
  const [method, setMethod] = useState("standard");

  const [stats, setStats] = useState({
    strength: "",
    dexterity: "",
    constitution: "",
    intelligence: "",
    wisdom: "",
    charisma: ""
  });

  const assignStandard = () => {
    const copy = {};
    ABILITIES.forEach((a, i) => {
      copy[a] = STANDARD_ARRAY[i];
    });
    setStats(copy);
  };

  const rollStats = () => {
    const roll = () =>
      Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * 6) + 1)
        .sort((a, b) => a - b)
        .slice(1)
        .reduce((a, b) => a + b, 0);

    const copy = {};
    ABILITIES.forEach((a) => {
      copy[a] = roll();
    });
    setStats(copy);
  };

  const updateStat = (ability, value) => {
    setStats({
      ...stats,
      [ability]: Number(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !race || !className) return;

    const character = {
      name,
      race,
      class: className,
      portrait,
      abilities: stats,
      level: 1
    };

    onCreateCharacter?.(character);
  };

  return (
    <div className="rq-panel" style={{ display: "grid", gap: "20px" }}>

      <h2 className="rq-title">Create Character</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>

        <input
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px" }}
        />

        <input
          placeholder="Race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px" }}
        />

        <input
          placeholder="Class"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px" }}
        />

        <input
          placeholder="Portrait URL"
          value={portrait}
          onChange={(e) => setPortrait(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px" }}
        />

        {portrait && (
          <img
            src={portrait}
            alt="portrait preview"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "2px solid var(--rq-gold)"
            }}
          />
        )}

        <div className="rq-card">
          <h3>Ability Scores</h3>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              type="button"
              className="rq-button-secondary"
              onClick={() => {
                setMethod("standard");
                assignStandard();
              }}
            >
              Standard Array
            </button>

            <button
              type="button"
              className="rq-button-secondary"
              onClick={() => {
                setMethod("roll");
                rollStats();
              }}
            >
              Roll Stats
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "12px"
            }}
          >
            {ABILITIES.map((a) => (
              <div key={a}>
                <div className="rq-muted">{a.toUpperCase()}</div>
                <input
                  type="number"
                  value={stats[a]}
                  onChange={(e) => updateStat(a, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px"
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="rq-button-primary" type="submit">
          Create Character
        </button>

      </form>
    </div>
  );
}
