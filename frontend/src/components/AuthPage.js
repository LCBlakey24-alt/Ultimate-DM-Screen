
import React, { useState } from "react";
import "../App.css";
import "../styles/designSystem.css";

export default function AuthPage({ onLogin, onRegister }) {

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");

    if (mode === "login") {
      onLogin?.({ email, password });
    } else {
      if (!username) {
        setError("Please choose a username.");
        return;
      }
      onRegister?.({ username, email, password });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--rq-bg-main)"
      }}
    >
      <div
        className="rq-panel"
        style={{
          width: "100%",
          maxWidth: "480px",
          display: "grid",
          gap: "18px"
        }}
      >

        <div style={{ textAlign: "center" }}>
          <h2 className="rq-title">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <p className="rq-muted">
            {mode === "login"
              ? "Access your Rookie Quest dashboard"
              : "Start your Rookie Quest journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>

          {mode === "register" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "var(--rq-bg-panel-soft)",
                color: "var(--rq-text-main)"
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "var(--rq-bg-panel-soft)",
              color: "var(--rq-text-main)"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "var(--rq-bg-panel-soft)",
              color: "var(--rq-text-main)"
            }}
          />

          {error && (
            <div
              style={{
                color: "#ff8e8e",
                background: "rgba(231,76,60,0.12)",
                border: "1px solid rgba(231,76,60,0.22)",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px"
              }}
            >
              {error}
            </div>
          )}

          <button className="rq-button-primary" type="submit">
            {mode === "login" ? "Login" : "Create Account"}
          </button>

        </form>

        <div style={{ textAlign: "center" }}>
          <button
            className="rq-button-secondary"
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login"
              ? "Create new account"
              : "Already have an account?"}
          </button>
        </div>

      </div>
    </div>
  );
}
