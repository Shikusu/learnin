import { C } from "@/constants/colors";
import {Pill } from "./Pill";
export function GlycolysisMap({ step, setStep }) {
  const steps = [
    { n:1, label:"Glucose → G6P",    enzyme:"Hexokinase",         cost:"-1 ATP", product:null, color:C.accent4 },
    { n:2, label:"G6P → F6P",        enzyme:"Phosphoglucose isomérase", cost:null, product:null, color:C.muted },
    { n:3, label:"F6P → F1,6BP",     enzyme:"Phosphofructokinase", cost:"-1 ATP", product:null, color:C.accent4 },
    { n:4, label:"F1,6BP → 2×PGAL",  enzyme:"Aldolase",           cost:null, product:"Coupure C₆→2×C₃", color:C.accent3 },
    { n:5, label:"PGAL → 1,3BPG",    enzyme:"G3P déshydrogénase", cost:null, product:"+2 NADH", color:C.accent5 },
    { n:6, label:"1,3BPG → 3PG",     enzyme:"Phosphoglycérate kinase", cost:null, product:"+2 ATP", color:C.accent2 },
    { n:7, label:"3PG → 2PG",        enzyme:"Phosphoglycérate mutase", cost:null, product:null, color:C.muted },
    { n:8, label:"2PG → PEP",        enzyme:"Énolase",            cost:null, product:null, color:C.muted },
    { n:9, label:"PEP → Pyruvate",   enzyme:"Pyruvate kinase",    cost:null, product:"+2 ATP", color:C.accent2 },
    { n:10,label:"Pyruvate → ?",     enzyme:"Selon O₂",           cost:null, product:"Carrefour!", color:C.accent3 },
  ];
  const active = steps[step];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Step list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 8, cursor: "pointer",
            background: step === i ? `${s.color}22` : "transparent",
            border: `1px solid ${step === i ? s.color : "transparent"}`,
            transition: "all .15s"
          }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: `${s.color}33`,
              color: s.color, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0 }}>{s.n}</span>
            <span style={{ fontSize: 13, color: step === i ? C.text : C.muted }}>{s.label}</span>
            {s.cost && <span style={{ marginLeft: "auto", fontSize: 11, color: C.accent4, fontWeight: 700 }}>{s.cost}</span>}
            {s.product && !s.cost && <span style={{ marginLeft: "auto", fontSize: 11, color: C.accent2, fontWeight: 700 }}>{s.product}</span>}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "slide-up .25s ease" }}>
        <div style={{ background: `${active.color}18`, border: `1px solid ${active.color}44`,
          borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 11, color: active.color, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>ÉTAPE {active.n}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.text, marginBottom: 6 }}>{active.label}</div>
          <div style={{ fontSize: 13, color: C.muted }}>Enzyme : <span style={{ color: C.text }}>{active.enzyme}</span></div>
          {active.cost && <div style={{ marginTop: 10, padding: "8px 14px", background: `${C.accent4}18`,
            borderRadius: 8, color: C.accent4, fontWeight: 700 }}>💸 Coût : {active.cost}</div>}
          {active.product && <div style={{ marginTop: 10, padding: "8px 14px", background: `${C.accent2}18`,
            borderRadius: 8, color: C.accent2, fontWeight: 700 }}>✅ Gain : {active.product}</div>}
        </div>

        {/* Phase badge */}
        <div style={{ borderRadius: 10, padding: "12px 16px",
          background: step < 4 ? `${C.accent4}12` : `${C.accent2}12`,
          border: `1px solid ${step < 4 ? C.accent4 : C.accent2}33` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: step < 4 ? C.accent4 : C.accent2, marginBottom: 4 }}>
            {step < 4 ? "⬇️ Phase PRÉPARATOIRE" : "⬆️ Phase de RÉCUPÉRATION"}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            {step < 4 ? "Investissement de 2 ATP – activation du glucose" : "Production nette de 4 ATP, 2 NADH"}
          </div>
        </div>

        {/* ATP counter */}
        <div style={{ display: "flex", gap: 10 }}>
          <Pill val="-2" label="ATP investis" color={C.accent4}/>
          <Pill val="+4" label="ATP produits" color={C.accent2}/>
          <Pill val="= 2" label="ATP net" color={C.accent1}/>
        </div>
      </div>
    </div>
  );
}
