"use client";
import { useState } from "react";

export default function Flashcards({ cards, color = "#c0392b" }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [mode, setMode] = useState("all");

  const filtered =
    mode === "unknown" ? cards.filter((_, i) => !known.has(i)) : cards;
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

  // Mastery Screen
  if (!current) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: 16,
          padding: 48,
          border: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Toutes les cartes maîtrisées !
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
          {cards.length} définitions apprises
        </p>
        <button
          onClick={() => {
            setIdx(0);
            setKnown(new Set());
            setFlipped(false);
          }}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            background: color,
            color: "white",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 16,
        padding: 32,
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            Fiches de Révision
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {Math.min(idx + 1, filtered.length)}/{filtered.length} ·{" "}
            {known.size} mémorisées
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "unknown"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setIdx(0);
                setFlipped(false);
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background:
                  mode === m ? "var(--foreground)" : "var(--background)",
                color: mode === m ? "var(--background)" : "var(--text-muted)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {m === "all" ? "Toutes" : "À revoir"}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          background: "var(--background)",
          borderRadius: 2,
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(known.size / cards.length) * 100}%`,
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          minHeight: 220,
          background: flipped ? "var(--foreground)" : `${color}08`,
          border: `2px solid ${flipped ? "var(--foreground)" : `${color}30`}`,
          borderRadius: 12,
          padding: "32px 28px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          transition: "all 0.3s ease",
          marginBottom: 20,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: flipped ? "var(--background)" : color,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            opacity: 0.8,
          }}
        >
          {flipped ? "Réponse" : "Question"}
        </div>

        <p
          style={{
            fontSize: 17,
            fontWeight: flipped ? 400 : 600,
            color: flipped ? "var(--background)" : "var(--foreground)",
            lineHeight: 1.6,
            fontFamily: flipped ? "var(--font-body)" : "var(--font-display)",
          }}
        >
          {flipped ? current.a : current.q}
        </p>

        {!flipped && (
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 20,
              opacity: 0.7,
            }}
          >
            Cliquez pour révéler
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        {flipped ? (
          <>
            <button onClick={handleRepeat} style={actionButtonStyle}>
              🔁 À revoir
            </button>
            <button
              onClick={handleKnow}
              style={{
                ...actionButtonStyle,
                background: "#27ae60",
                color: "white",
                border: "none",
              }}
            >
              ✓ Je sais !
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setFlipped(false);
                setIdx((i) => Math.max(0, i - 1));
              }}
              style={actionButtonStyle}
            >
              ←
            </button>
            <button
              onClick={() => {
                setFlipped(false);
                setIdx((i) => i + 1);
              }}
              style={actionButtonStyle}
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const actionButtonStyle = {
  flex: 1,
  padding: "12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--background)",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-muted)",
  transition: "all 0.2s",
};
