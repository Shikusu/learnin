import { C } from "@/constants/colors";
import { Pill } from "./Pill";

export function GlycolysisMap({ step, setStep }) {
  const steps = [
    { n:1,  label:"Glucose → G6P",    enzyme:"Hexokinase",               cost:"-1 ATP", product:null,           color:C.accent4 },
    { n:2,  label:"G6P → F6P",        enzyme:"Phosphoglucose isomérase", cost:null,     product:null,           color:C.muted },
    { n:3,  label:"F6P → F1,6BP",     enzyme:"Phosphofructokinase",      cost:"-1 ATP", product:null,           color:C.accent4 },
    { n:4,  label:"F1,6BP → 2×PGAL", enzyme:"Aldolase",                  cost:null,     product:"Coupure C₆→2×C₃", color:C.accent3 },
    { n:5,  label:"PGAL → 1,3BPG",   enzyme:"G3P déshydrogénase",        cost:null,     product:"+2 NADH",      color:C.accent5 },
    { n:6,  label:"1,3BPG → 3PG",    enzyme:"Phosphoglycérate kinase",   cost:null,     product:"+2 ATP",       color:C.accent2 },
    { n:7,  label:"3PG → 2PG",       enzyme:"Phosphoglycérate mutase",   cost:null,     product:null,           color:C.muted },
    { n:8,  label:"2PG → PEP",       enzyme:"Énolase",                   cost:null,     product:null,           color:C.muted },
    { n:9,  label:"PEP → Pyruvate",  enzyme:"Pyruvate kinase",           cost:null,     product:"+2 ATP",       color:C.accent2 },
    { n:10, label:"Pyruvate → ?",    enzyme:"Selon O₂",                  cost:null,     product:"Carrefour!",   color:C.accent3 },
  ];

  const active = steps[step];

  return (
    <div className="flex flex-col gap-5">

      {/* Step list — full width, scrollable row on mobile */}
      <div className="flex flex-col gap-1.5">
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 border"
            style={{
              background: step === i ? `${s.color}22` : "transparent",
              borderColor: step === i ? s.color : "transparent",
            }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black"
              style={{ background: `${s.color}33`, color: s.color }}>{s.n}</span>
            <span className="text-[13px]" style={{ color: step === i ? C.text : C.muted }}>{s.label}</span>
            {s.cost && (
              <span className="ml-auto text-[11px] font-bold shrink-0" style={{ color: C.accent4 }}>{s.cost}</span>
            )}
            {s.product && !s.cost && (
              <span className="ml-auto text-[11px] font-bold shrink-0" style={{ color: C.accent2 }}>{s.product}</span>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="flex flex-col gap-3" style={{ animation: "slide-up .25s ease" }}>

        {/* Main card */}
        <div className="rounded-2xl p-5 border"
          style={{ background: `${active.color}18`, borderColor: `${active.color}44` }}>
          <div className="text-[11px] font-bold mb-2 tracking-widest" style={{ color: active.color }}>
            ÉTAPE {active.n}
          </div>
          <div className="text-lg font-black mb-1.5" style={{ color: C.text }}>{active.label}</div>
          <div className="text-[13px]" style={{ color: C.muted }}>
            Enzyme : <span style={{ color: C.text }}>{active.enzyme}</span>
          </div>
          {active.cost && (
            <div className="mt-2.5 px-3.5 py-2 rounded-lg font-bold"
              style={{ background: `${C.accent4}18`, color: C.accent4 }}>
              💸 Coût : {active.cost}
            </div>
          )}
          {active.product && (
            <div className="mt-2.5 px-3.5 py-2 rounded-lg font-bold"
              style={{ background: `${C.accent2}18`, color: C.accent2 }}>
              ✅ Gain : {active.product}
            </div>
          )}
        </div>

        {/* Phase badge */}
        <div className="rounded-xl px-4 py-3 border"
          style={{
            background: step < 4 ? `${C.accent4}12` : `${C.accent2}12`,
            borderColor: step < 4 ? `${C.accent4}33` : `${C.accent2}33`,
          }}>
          <div className="font-bold text-[13px] mb-1"
            style={{ color: step < 4 ? C.accent4 : C.accent2 }}>
            {step < 4 ? "⬇️ Phase PRÉPARATOIRE" : "⬆️ Phase de RÉCUPÉRATION"}
          </div>
          <div className="text-xs" style={{ color: C.muted }}>
            {step < 4
              ? "Investissement de 2 ATP – activation du glucose"
              : "Production nette de 4 ATP, 2 NADH"}
          </div>
        </div>

        {/* ATP counter */}
        <div className="flex gap-2.5 flex-wrap">
          <Pill val="-2" label="ATP investis" color={C.accent4} />
          <Pill val="+4" label="ATP produits" color={C.accent2} />
          <Pill val="= 2" label="ATP net" color={C.accent1} />
        </div>
      </div>

    </div>
  );
}