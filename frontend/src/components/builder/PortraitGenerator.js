import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles, Wand2, Loader2, Check, RefreshCw, Upload, AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";

const API = API_BASE;
const BACKEND_AVAILABLE = Boolean(API && API.length > 0);

const theme = {
  gold: "#EF4444",
  text: { primary: "#FFFFFF", secondary: "#D1D5DB", muted: "#9CA3AF" },
  border: "rgba(239, 68, 68, 0.35)",
  bg: { primary: "#1F1F23", surface: "#27272B" }
};

const STYLE_LABELS = {
  photoreal: "Photoreal",
  painterly: "Painterly",
  stylized: "Stylized"
};

function recoverablePortraitMessage(err) {
  const raw = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "";
  const text = typeof raw === "string" ? raw : raw?.message || JSON.stringify(raw);
  const lower = String(text).toLowerCase();
  const unavailable = err?.response?.status === 503 || lower.includes("not configured") || lower.includes("api_key") || lower.includes("api key") || lower.includes("gemini") || lower.includes("openai");
  return {
    unavailable,
    message: unavailable
      ? "AI portrait generation is not available on this server right now. You can still create your character without a portrait, or upload your own image."
      : "Portrait generation failed. You can still create your character without a portrait, or upload your own image."
  };
}

export default function PortraitGenerator({ character = {}, portrait = "", onChange }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [description, setDescription] = useState(character.description || "");
  const [gender, setGender] = useState(character.gender || "");
  const [softError, setSoftError] = useState("");
  const [imageGenAvailable, setImageGenAvailable] = useState(BACKEND_AVAILABLE);
  const fileInputRef = React.useRef(null);

  const generate = async () => {
    if (!BACKEND_AVAILABLE || !imageGenAvailable) {
      setSoftError("AI portrait generation is not available right now. You can still create your character or upload your own portrait.");
      return;
    }

    setLoading(true);
    setOptions([]);
    setSoftError("");
    try {
      const payload = {
        race: character.race || "",
        subrace: character.subrace || "",
        character_class: character.className || character.character_class || "",
        subclass: character.subclass || "",
        background: character.background || "",
        alignment: character.alignment || "",
        gender,
        description,
        portrait_framing: "3:4 upper torso portrait, full head visible, space above head, shoulders visible, not cropped, not extreme close-up"
      };
      const { data } = await axios.post(`${API}/ai/portrait/batch`, payload);
      setOptions(data.portraits || []);
      const good = (data.portraits || []).filter(p => p.image_base64).length;
      if (good === 0) {
        setSoftError("No portraits were generated. You can still create your character without a portrait, or upload your own image.");
        toast.error("No portraits generated — character creation is still safe.");
      } else {
        toast.success(`Generated ${good} portrait${good === 1 ? "" : "s"} — pick your favorite`);
      }
    } catch (err) {
      const recovered = recoverablePortraitMessage(err);
      if (recovered.unavailable) setImageGenAvailable(false);
      setSoftError(recovered.message);
      toast.error("Portrait generation unavailable — character creation is still safe.");
    } finally {
      setLoading(false);
    }
  };

  const pick = (option) => {
    if (!option.image_base64) return;
    const dataUri = `data:${option.mime_type || "image/png"};base64,${option.image_base64}`;
    onChange?.(dataUri);
    setSoftError("");
    toast.success(`Selected ${STYLE_LABELS[option.style] || option.style} portrait`);
  };

  const onUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      e.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large (max 4MB). Please resize or pick a smaller file.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange?.(reader.result);
      setSoftError("");
      toast.success("Portrait uploaded");
    };
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const isSelected = (option) => {
    if (!option?.image_base64 || !portrait) return false;
    return portrait.includes(option.image_base64.slice(0, 64));
  };

  return (
    <div
      data-testid="portrait-generator"
      style={{
        padding: 16, borderRadius: 0,
        background: "rgba(39, 39, 43, 0.86)",
        border: `1px solid ${theme.border}`,
        marginBottom: 20
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Sparkles size={14} color={theme.gold} />
        <div style={{ fontSize: 12, fontWeight: 800, color: theme.gold, letterSpacing: 1 }}>
          AI PORTRAIT
        </div>
        <span style={{ fontSize: 10, color: theme.text.muted, fontStyle: "italic" }}>
          optional — generate, upload, or continue without one
        </span>
      </div>

      {softError && (
        <div data-testid="portrait-soft-warning" style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: 12, marginBottom: 12, background: "rgba(239, 68, 68, 0.10)", border: `1px solid ${theme.border}`, color: theme.text.secondary, fontSize: 12, lineHeight: 1.45 }}>
          <AlertCircle size={16} color={theme.gold} style={{ flex: "0 0 auto", marginTop: 1 }} />
          <span>{softError}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }} className="portrait-input-grid">
        <div>
          <div style={{ fontSize: 11, color: theme.text.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>
            Gender / pronouns (optional)
          </div>
          <input type="text" value={gender} onChange={e => setGender(e.target.value)} placeholder="e.g. female, male, non-binary" data-testid="portrait-gender-input" style={{ width: "100%", padding: "8px 10px", background: theme.bg.primary, color: theme.text.primary, border: `1px solid ${theme.border}`, borderRadius: 0, fontSize: 13, outline: "none" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: theme.text.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 0.5 }}>
            Appearance description
          </div>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. auburn hair, emerald eyes, leather armour" data-testid="portrait-description-input" style={{ width: "100%", padding: "8px 10px", background: theme.bg.primary, color: theme.text.primary, border: `1px solid ${theme.border}`, borderRadius: 0, fontSize: 13, outline: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button type="button" onClick={generate} disabled={loading || !imageGenAvailable} data-testid="generate-portraits-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: loading || !imageGenAvailable ? "rgba(255,255,255,0.04)" : "rgba(239, 68, 68, 0.16)", border: `1px solid ${loading || !imageGenAvailable ? "rgba(255,255,255,0.12)" : theme.gold}`, borderRadius: 0, color: loading || !imageGenAvailable ? theme.text.muted : theme.gold, cursor: loading || !imageGenAvailable ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 800, letterSpacing: 0.5 }}>
          {loading ? <Loader2 size={14} className="rq-spin" /> : <Wand2 size={14} />}
          {loading ? "Conjuring portraits…" : options.length ? "Regenerate" : "Generate 3 Portraits"}
        </button>

        <label htmlFor="portrait-file-upload" data-testid="portrait-upload-label" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 0, color: theme.text.secondary, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
          <Upload size={13} /> Upload your own
          <input id="portrait-file-upload" ref={fileInputRef} type="file" accept="image/*" onChange={onUploadFile} data-testid="portrait-file-input" style={{ display: "none" }} />
        </label>
      </div>

      <div style={{ color: theme.text.muted, fontSize: 11, lineHeight: 1.45, marginBottom: options.length ? 12 : 0 }}>
        Portraits are optional. You can create the character without one and add it later.
      </div>

      {options.length > 0 && (
        <div data-testid="portrait-options-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
          {options.map(opt => {
            const selected = isSelected(opt);
            const hasImage = !!opt.image_base64;
            return (
              <button key={opt.style} type="button" onClick={() => pick(opt)} disabled={!hasImage} data-testid={`portrait-option-${opt.style}`} style={{ padding: 0, overflow: "hidden", borderRadius: 0, background: theme.bg.primary, border: selected ? `3px solid ${theme.gold}` : `1px solid ${theme.border}`, cursor: hasImage ? "pointer" : "not-allowed", position: "relative", transition: "transform 0.15s" }}>
                {hasImage ? (
                  <div style={{ aspectRatio: "3 / 4", background: "#0B0B0C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={`data:${opt.mime_type || "image/png"};base64,${opt.image_base64}`} alt={opt.style} style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", objectPosition: "center top" }} />
                  </div>
                ) : (
                  <div style={{ padding: "40px 12px", textAlign: "center", color: theme.text.muted, fontSize: 11, fontStyle: "italic" }}>
                    {opt.error ? `Generation failed (${opt.error})` : "Loading…"}
                  </div>
                )}
                <div style={{ padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", background: selected ? "rgba(239, 68, 68, 0.18)" : "rgba(39, 39, 43, 0.9)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: theme.text.primary }}>
                  <span>{(STYLE_LABELS[opt.style] || opt.style).toUpperCase()}</span>
                  {selected && <Check size={14} color={theme.gold} />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {portrait && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: theme.text.secondary }}>
          <div style={{ width: 64, aspectRatio: "3 / 4", background: "#0B0B0C", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
            <img src={portrait} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center top" }} onError={e => { e.currentTarget.style.display = "none"; }} />
          </div>
          <span>Current portrait chosen — will save with your character.</span>
          <button type="button" onClick={() => onChange?.("")} data-testid="clear-portrait-btn" style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: `1px solid ${theme.border}`, color: theme.text.muted, padding: "8px 10px", borderRadius: 0, fontSize: 11, cursor: "pointer" }}>
            <RefreshCw size={11} /> Clear
          </button>
        </div>
      )}

      <style>{`
        @keyframes rqSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .rq-spin { animation: rqSpin 0.9s linear infinite; }
        @media (max-width: 640px) { .portrait-input-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
