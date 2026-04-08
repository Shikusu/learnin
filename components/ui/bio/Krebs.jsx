// KrebsCycle.jsx
import { useState } from "react";

const steps = [
  { label: "Acétyl-CoA + Oxaloacétate", product: "Citrate (6C)", enzyme: "Citrate synthase", color: "#1D9E75" },
  { label: "Citrate", product: "Isocitrate (6C)", enzyme: "Aconitase", color: "#888780" },
  { label: "Isocitrate", product: "α-cétoglutarate (5C)", enzyme: "Isocitrate DH", extra: "+NADH  +CO₂", color: "#BA7517" },
  { label: "α-cétoglutarate", product: "Succinyl-CoA (4C)", enzyme: "α-KG DH", extra: "+NADH  +CO₂", color: "#BA7517" },
  { label: "Succinyl-CoA", product: "Succinate (4C)", enzyme: "Succinyl-CoA synthétase", extra: "+GTP", color: "#378ADD" },
  { label: "Succinate", product: "Fumarate (4C)", enzyme: "Succinate DH", extra: "+FADH₂", color: "#D4537E" },
  { label: "Fumarate", product: "Malate (4C)", enzyme: "Fumarase", color: "#888780" },
  { label: "Malate", product: "Oxaloacétate (4C)", enzyme: "Malate DH", extra: "+NADH", color: "#BA7517" },
];

const cx = 160, cy = 148, r = 100;

const BILAN = [
  { label: "3 NADH", color: "#BA7517" }, { label: "1 FADH₂", color: "#D4537E" },
  { label: "1 GTP", color: "#378ADD" },  { label: "2 CO₂", color: "#888780" },
];
const BILAN2 = [
  { label: "6 NADH", color: "#BA7517" }, { label: "2 FADH₂", color: "#D4537E" },
  { label: "2 GTP", color: "#378ADD" },  { label: "4 CO₂", color: "#888780" },
];

export function KrebsCycle() {
  const [active, setActive] = useState(null);
  const activeStep = active !== null ? steps[active] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

      {/* SVG Cycle */}
      <svg viewBox="0 0 320 300" className="w-full">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)"
          strokeWidth="1" strokeDasharray="4,3" />
        <text x={cx} y={140} fill="rgba(255,255,255,0.35)" fontSize="10" textAnchor="middle">cycle</text>
        <text x={cx} y={155} fill="white" fontSize="15" fontWeight="500" textAnchor="middle">Krebs</text>
        <text x={cx} y={170} fill="rgba(255,255,255,0.35)" fontSize="9" textAnchor="middle">× 2 / glucose</text>

        {steps.map((s, i) => {
          const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const isActive = active === i;
          return (
            <g key={i} style={{ cursor: "pointer" }} onClick={() => setActive(isActive ? null : i)}>
              <circle cx={x} cy={y} r={isActive ? 22 : 18}
                fill={isActive ? s.color : `${s.color}22`}
                stroke={s.color} strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "all .15s" }} />
              <text x={x} y={y + 4} fill={isActive ? "#fff" : s.color}
                fontSize="11" fontWeight="500" textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      <div className="flex flex-col gap-3">
        {activeStep ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"
            style={{ animation: "slideUp .18s ease" }}>
            <span className="inline-block text-[11px] font-medium px-3 py-1 rounded-full mb-3"
              style={{ background: `${activeStep.color}22`, color: activeStep.color }}>
              Étape {active + 1}
            </span>
            <div className="text-base font-medium text-(--text) mb-1.5">{activeStep.label}</div>
            <div className="text-sm text-(--text-muted) mb-3">
              → <span style={{ color: activeStep.color }}>{activeStep.product}</span>
            </div>
            <div className="text-sm text-(--text-muted)">
              Enzyme : <span className="text-(--text)">{activeStep.enzyme}</span>
            </div>
            {activeStep.extra && (
              <div className="mt-3 px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: `${activeStep.color}18`, color: activeStep.color }}>
                {activeStep.extra}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="text-2xl mb-2">☝️</div>
            <div className="text-sm text-(--text-muted)">
              Appuyez sur un numéro pour voir le détail de chaque étape
            </div>
          </div>
        )}

        {/* Bilan */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-medium text-(--text-muted) mb-2">Par tour</p>
          <div className="grid grid-cols-2 gap-1.5">
            {BILAN.map(({ label, color }) => (
              <div key={label} className="rounded-lg px-3 py-2 text-xs font-medium border border-white/5 bg-white/4"
                style={{ color }}>{label}</div>
            ))}
          </div>
          <div className="h-px bg-white/[.07] my-3" />
          <p className="text-[11px] font-medium text-(--text-muted) mb-2">× 2 tours</p>
          <div className="grid grid-cols-2 gap-1.5">
            {BILAN2.map(({ label, color }) => (
              <div key={label} className="rounded-lg px-3 py-2 text-xs font-medium border border-white/5 bg-white/4"
                style={{ color }}>{label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}