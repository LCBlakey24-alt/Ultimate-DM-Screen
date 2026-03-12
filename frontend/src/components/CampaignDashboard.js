import React, { useEffect, useMemo, useState } from "react";
import "../App.css";
import "../styles/designSystem.css";

function CampaignDashboard() {
  const [campaignName] = useState("The Cursed Heights");
  const [campaignSummary] = useState(
    "A dark fantasy campaign of ancient ruins, uneasy alliances, and rising threats in the highlands."
  );

  const [partyMembers] = useState([
    { name: "Javen Krow", role: "Fighter", level: 2, status: "Active" },
    { name: "Thalia Emberheart", role: "Sorcerer", level: 2, status: "Active" },
    { name: "Kael Ironfist", role: "Cleric", level: 2, status: "Active" }
  ]);

  const [recentActivity] = useState([
    "Session recap generated for Session 4",
    "New location added: Ruined Watchtower",
    "Goblin Boss encounter updated",
    "Party note added: Strange sigil found in the shrine"
  ]);

  const [quickLinks] = useState([
    { title: "Open Session Notes", description: "Review the latest live notes and clues." },
    { title: "View Encounters", description: "Manage active and prepared combat encounters." },
    { title: "Open World Map", description: "Jump to the current region and tracked markers." },
    { title: "Review NPCs", description: "Check important allies, enemies, and quest figures." }
  ]);

  useEffect(() => {
    document.title = `${campaignName} | Rookie Quest`;
  }, [campaignName]);

  const campaignStats = useMemo(
    () => [
      { label: "Party Size", value: partyMembers.length },
      { label: "Average Level", value: "2" },
      { label: "Active Plot Threads", value: "3" },
      { label: "Last Session", value: "2 days ago" }
    ],
    [partyMembers.length]
  );

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
            {campaignName}
          </h1>
          <p className="rq-muted" style={{ marginTop: "10px", marginBottom: 0, maxWidth: "760px" }}>
            {campaignSummary}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="rq-button-primary">Open Campaign</button>
          <button className="rq-button-secondary">Add Note</button>
          <button className="rq-button-secondary">Manage World</button>
        </div>
      </div>

      <div
        className="rq-panel"
        style={{
          marginBottom: "24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px"
        }}
      >
        {campaignStats.map((stat) => (
          <div key={stat.label} className="rq-card">
            <div className="rq-muted" style={{ marginBottom: "8px" }}>
              {stat.label}
            </div>
            <div style={{ fontWeight: 700, color: "var(--rq-gold-soft)", fontSize: "20px" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
          alignItems: "start"
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Party Overview
            </h2>

            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "18px"
              }}
            >
              {partyMembers.map((member) => (
                <div
                  key={member.name}
                  className="rq-card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{member.name}</div>
                    <div className="rq-muted" style={{ marginTop: "6px" }}>
                      {member.role} • Level {member.level}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "999px",
                      background: "rgba(46,204,113,0.12)",
                      border: "1px solid rgba(46,204,113,0.25)",
                      color: "#2ECC71",
                      fontSize: "13px",
                      fontWeight: 600
                    }}
                  >
                    {member.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Recent Activity
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "18px"
              }}
            >
              {recentActivity.map((item, index) => (
                <div key={`${item}-${index}`} className="rq-card">
                  <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                    Update {index + 1}
                  </div>
                  <div className="rq-muted">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Quick Actions
            </h2>

            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "18px"
              }}
            >
              {quickLinks.map((link) => (
                <div key={link.title} className="rq-card">
                  <div style={{ fontWeight: 700, marginBottom: "6px" }}>{link.title}</div>
                  <div className="rq-muted" style={{ marginBottom: "12px" }}>
                    {link.description}
                  </div>
                  <button className="rq-button-secondary">Open</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rq-panel">
            <h2 className="rq-title" style={{ fontSize: "24px", marginTop: 0 }}>
              Campaign Focus
            </h2>

            <div className="rq-card" style={{ marginTop: "18px" }}>
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                Current Direction
              </div>
              <div className="rq-muted">
                The party is following clues through the ruined shrine while a hidden force manipulates events in the region.
              </div>
            </div>

            <div className="rq-card" style={{ marginTop: "14px" }}>
              <div style={{ fontWeight: 700, marginBottom: "8px" }}>
                GM Reminder
              </div>
              <div className="rq-muted">
                Keep pressure on the investigation, foreshadow the larger enemy, and reward note-taking and exploration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDashboard;
