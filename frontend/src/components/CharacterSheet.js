
import React from "react";
import "../App.css";
import "../styles/designSystem.css";

export default function CharacterSheet({ character }) {

  if (!character) {
    return (
      <div className="rq-panel">
        <h2 className="rq-title">No Character Loaded</h2>
        <p className="rq-muted">Select a character to view the sheet.</p>
      </div>
    );
  }

  return (
    <div className="rq-panel" style={{display:"grid", gap:"20px"}}>

      <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
        {character.portrait && (
          <img
            src={character.portrait}
            alt="portrait"
            style={{
              width:"100px",
              height:"100px",
              objectFit:"cover",
              borderRadius:"10px",
              border:"2px solid var(--rq-gold)"
            }}
          />
        )}

        <div>
          <h2 className="rq-title">{character.name}</h2>
          <div className="rq-muted">
            {character.race} {character.class} • Level {character.level}
          </div>
        </div>
      </div>

      <div className="rq-card">
        <h3>Core Stats</h3>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(6,1fr)",
          gap:"12px"
        }}>

          {Object.entries(character.abilities || {}).map(([key,val]) => (
            <div key={key} className="rq-stat">
              <div className="rq-muted">{key.toUpperCase()}</div>
              <div style={{fontSize:"20px", fontWeight:"bold"}}>{val}</div>
            </div>
          ))}

        </div>
      </div>

      <div className="rq-card">
        <h3>Combat</h3>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gap:"16px"
        }}>

          <div>
            <div className="rq-muted">HP</div>
            <div style={{fontSize:"22px", fontWeight:"bold"}}>
              {character.hp}/{character.max_hp}
            </div>
          </div>

          <div>
            <div className="rq-muted">Armor Class</div>
            <div style={{fontSize:"22px", fontWeight:"bold"}}>
              {character.ac}
            </div>
          </div>

          <div>
            <div className="rq-muted">Speed</div>
            <div style={{fontSize:"22px", fontWeight:"bold"}}>
              {character.speed}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
