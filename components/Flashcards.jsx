"use client";
import { useState } from "react";

export default function Flashcards({ cards, color = "#c0392b" }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [mode, setMode] = useState("all");

  const filtered = mode === "unknown" ? cards.filter((_, i) => !known.has(i)) : cards;
  const current = filtered[idx % Math.max(filtered.length, 1)];

  const handleKnow = () => {
    setKnown((prev) => new Set([...prev, cards.indexOf(current)]));
    setFlipped(false);
    setIdx((i) => i + 1);
  };

  const handleRepeat = () => {
    setFlipped(false);
    setIdx((i) => i + 1);
  };

  if (!current) {
    return (
      <div style={{ background, borderRadius: 16, padding: 32, border, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Toutes les cartes maîtrisées !</h3>
        <p style={{ color, marginBottom: 24 }}>{cards.length} définitions apprises</p>
        <button onClick={() => { setIdx(0); setKnown(new Set()); setFlipped(false); }} style={{ padding, borderRadius: 8, background: color, color, border, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Fiches de Révision</h3>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            {Math.min(idx + 1, filtered.length)}/{filtered.length} · {known.size} mémorisées
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "unknown"] ).map((m) => (
            <button key={m} onClick={() => { setMode(m); setIdx(0); setFlipped(false); }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2ded5", background: mode === m ? "#1a1a2e" : "white", color: mode === m ? "white" : "#6b7280", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-mono)" }}>
              {m === "all" ? "Toutes" : "À revoir"}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#f3f4f6", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(known.size / cards.length) * 100}%`, background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          minHeight: 200,
          background: flipped ? "#0f1923" : color + "08",
          border: `2px solid ${flipped ? "#0f1923" : color + "30"}`,
          borderRadius: 12,
          padding: "32px 28px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column" ,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center" ,
          transition: "all 0.3s ease",
          marginBottom: 20,
          position: "relative" ,
        }}
      >
        <div style={{ position: "absolute" , top: 14, left: 16, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600, color: flipped ? "#94a3b8" : color, textTransform: "uppercase" , letterSpacing: "0.06em" }}>
          {flipped ? "Réponse" : "Question"}
        </div>
        {current.category && (
          <div style={{ position: "absolute" , top: 14, right: 16, fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: 4, background: flipped ? "rgba(255,255,255,0.1)" : color + "15", color: flipped ? "#94a3b8" : color }}>
            {current.category}
          </div>
        )}
        <p style={{ fontSize: 16, fontWeight: flipped ? 400 : 600, color: flipped ? "white" : "#1a1a2e", lineHeight: 1.65, fontFamily: flipped ? "var(--font-body)" : "var(--font-display)" }}>
          {flipped ? current.a : current.q}
        </p>
        {!flipped && <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>Cliquez pour révéler la réponse</p>}
      </div>

      {/* Actions */}
      {flipped ? (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleRepeat} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #e2ded5", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
            🔁 À revoir
          </button>
          <button onClick={handleKnow} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: "#27ae60", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>
            ✓ Je sais !
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <button onClick={() => { setFlipped(false); setIdx((i) => Math.max(0, i - 1)); }} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e2ded5", background: "white", cursor: "pointer", fontSize: 13, color: "#6b7280" }}>←</button>
          <button onClick={() => { setFlipped(false); setIdx((i) => i + 1); }} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #e2ded5", background: "white", cursor: "pointer", fontSize: 13, color: "#6b7280" }}>→</button>
        </div>
      )}
    </div>
  );
}
