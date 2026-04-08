import { useState } from "react";
import { C } from "@/constants/colors";
import {Tag} from "@/components/ui/bio/Tag";
export default function Quiz({ questions }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[idx].ans) setScore(s => s + 1);
  }
  function next() {
    if (idx + 1 >= questions.length) { setDone(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
  }
  function reset() { setIdx(0); setSelected(null); setScore(0); setDone(false); }

  if (done) return (
    <div style={{ textAlign: "center", padding: 32, animation: "bounce-in .4s ease" }}>
      <div style={{ fontSize: 56 }}>{score === questions.length ? "🏆" : score >= questions.length/2 ? "👍" : "📚"}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: C.accent2, margin: "12px 0" }}>{score}/{questions.length}</div>
      <div style={{ color: C.muted, marginBottom: 20 }}>
        {score === questions.length ? "Parfait ! Tu maîtrises !" : score >= questions.length/2 ? "Bien ! Continue à réviser." : "À revoir... mais tu vas y arriver !"}
      </div>
      <button onClick={reset} style={{ background: C.accent1, color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontWeight: 700 }}>Recommencer</button>
    </div>
  );

  const q = questions[idx];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Tag color={C.accent5}>Q {idx + 1}/{questions.length}</Tag>
        <Tag color={C.accent2}>Score {score}</Tag>
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 20 }}>{q.q}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.options.map((o, i) => {
          let bg = `${C.border}55`;
          let border = C.border;
          let col = C.text;
          if (selected !== null) {
            if (i === q.ans) { bg = `${C.accent2}22`; border = C.accent2; col = C.accent2; }
            else if (i === selected && i !== q.ans) { bg = `${C.accent4}22`; border = C.accent4; col = C.accent4; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 10,
              padding: "12px 14px", cursor: selected ? "default" : "pointer",
              color: col, textAlign: "left", fontSize: 14, transition: "all .2s",
              fontFamily: "inherit"
            }}>{o}</button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button onClick={next} style={{ background: C.accent1, color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontWeight: 700 }}>
            {idx + 1 >= questions.length ? "Voir résultat" : "Question suivante →"}
          </button>
        </div>
      )}
    </div>
  );
}

