import { useState } from "react";
import { C } from "@/constants/colors";
import {flashcardsBio as flashcards} from "@/constants/staticFiches";
export default function Flashcards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(new Set());

  function next() {
    setSeen(s => new Set([...s, idx]));
    setIdx(i => (i + 1) % flashcards.length);
    setFlipped(false);
  }
  function prev() {
    setIdx(i => (i - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: C.muted, fontSize: 13 }}>{idx + 1} / {flashcards.length}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {flashcards.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i === idx ? C.accent1 : seen.has(i) ? C.accent2 : C.border
            }}/>
          ))}
        </div>
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{
        minHeight: 160, borderRadius: 16, padding: 28, cursor: "pointer",
        background: flipped ? `${C.accent2}14` : `${C.accent1}14`,
        border: `2px solid ${flipped ? C.accent2 : C.accent1}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", transition: "all .25s", animation: "bounce-in .3s ease"
      }}>
        <div>
          <div style={{ fontSize: 11, color: flipped ? C.accent2 : C.accent1, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            {flipped ? "✅ RÉPONSE" : "❓ QUESTION — clique pour révéler"}
          </div>
          <div style={{ fontSize: 16, color: C.text, lineHeight: 1.6 }}>
            {flipped ? flashcards[idx].back : flashcards[idx].front}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "center" }}>
        <button onClick={prev} style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "8px 20px", cursor: "pointer" }}>← Précédente</button>
        <button onClick={next} style={{ background: C.accent1, border: "none", color: "#fff", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>Suivante →</button>
      </div>
    </div>
  );
}
