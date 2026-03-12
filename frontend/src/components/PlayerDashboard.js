
import React from "react";
import "../App.css";
import "../styles/designSystem.css";

export default function PlayerDashboard({ characters = [], onOpenCharacter, onCreateCharacter }) {

  return (
    <div className="rq-panel" style={{ display: "grid", gap: "20px" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 className="rq-title" style={{ margin: 0 }}>Player Dashboard</h2>
          <p className="rq-muted" style={{ marginTop: "6px" }}>
            Manage your characters and jump back into your campaigns.
          </p>
        </div>

        <button className="rq-button-primary" onClick={onCreateCharacter}>
          Create Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="rq-card" style={{ textAlign: "center", padding: "30px" }}>
          <h3>No Characters Yet</h3>
          <p className="rq-muted">
            Create your first character to begin your Rookie Quest adventure.
          </p>
          <button className="rq-button-secondary" onClick={onCreateCharacter}>
            New Character
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
            gap: "16px"
          }}
        >
          {characters.map((character) => (
            <div
              key={character.id || character.name}
              className="rq-card"
              style={{ display: "grid", gap: "12px" }}
            >
              {character.portrait && (
                <img
                  src={character.portrait}
                  alt="portrait"
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
              )}

              <div>
                <h3 style={{ margin: 0 }}>{character.name}</h3>
                <div className="rq-muted" style={{ marginTop: "4px" }}>
                  {character.race} {character.class} • Level {character.level}
                </div>
              </div>

              <button
                className="rq-button-secondary"
                onClick={() => onOpenCharacter?.(character)}
              >
                Open Character
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
