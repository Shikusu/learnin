import { useState } from "react";
import { C } from "@/constants/colors";

export function OverviewMap({ onSection }) {
  const [hov, setHov] = useState(null);

  const steps = [
    {
      id: "glycolyse", label: "GLYCOLYSE", sub: "Cytosol",
      color: C.accent3, atp: "≈ 2 ATP",
      output: "Pyruvate + 2 NADH",
    },
    {
      id: "krebs", label: "CYCLE DE KREBS", sub: "Mitochondrie",
      color: C.accent5, atp: "≈ 2 GTP",
      output: "Acétyl-CoA → 8 NADH + 2 FADH₂",
    },
    {
      id: "chaine", label: "CHAÎNE RESPI.", sub: "Membrane interne",
      color: C.accent1, atp: "≈ 28–30 ATP",
      output: "H₂O",
    },
  ];

  return (
    <div className="w-full">

      {/* Glucose entry */}
      <div className="flex justify-center mb-3">
        <div className="px-4 py-2 rounded-xl border text-center"
          style={{ background: `${C.accent2}18`, borderColor: `${C.accent2}55` }}>
          <div className="text-xs font-black" style={{ color: C.accent2 }}>GLUCOSE</div>
          <div className="text-[10px]" style={{ color: C.muted }}>C₆H₁₂O₆</div>
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center mb-3">
        <div className="w-px h-5" style={{ background: C.accent2 }} />
      </div>

      {/* Steps — horizontal on sm+, vertical on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch gap-0">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-col sm:flex-row items-center flex-1">

            {/* Box */}
            <div
              onClick={() => onSection(s.id)}
              onMouseEnter={() => setHov(s.id)}
              onMouseLeave={() => setHov(null)}
              className="w-full flex-1 rounded-2xl px-4 py-4 border cursor-pointer transition-all duration-200 text-center"
              style={{
                background: hov === s.id ? `${s.color}30` : `${s.color}15`,
                borderColor: hov === s.id ? s.color : `${s.color}55`,
                borderWidth: hov === s.id ? 2 : 1,
              }}>
              <div className="text-[11px] font-black tracking-wider mb-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-[10px] mb-2" style={{ color: C.muted }}>{s.sub}</div>
              <div className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${s.color}22`, color: s.color }}>{s.atp}</div>
              {hov === s.id && (
                <div className="text-[10px] mt-2" style={{ color: s.color }}>Cliquer pour explorer →</div>
              )}
            </div>

            {/* Connector arrow — right on sm, down on mobile */}
            {i < steps.length - 1 && (
              <div className="flex sm:flex-col items-center justify-center px-1 py-1 sm:px-2 sm:py-0 shrink-0">
                {/* Output label */}
                <div className="text-[9px] text-center leading-tight hidden sm:block mb-1 max-w-17.5"
                  style={{ color: s.color }}>{s.output}</div>
                {/* Arrow */}
                <div className="text-base" style={{ color: s.color }}>
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:block">→</span>
                </div>
                <div className="text-[9px] text-center leading-tight sm:hidden mt-0.5 max-w-30"
                  style={{ color: s.color }}>{s.output}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Final ATP bubble */}
      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-5" style={{ background: C.accent1 }} />
          <div className="px-6 py-3 rounded-full border-2 text-center"
            style={{ background: `${C.accent1}18`, borderColor: C.accent1 }}>
            <div className="text-base font-black" style={{ color: C.accent1 }}>32–34 ATP</div>
            <div className="text-[10px]" style={{ color: C.muted }}>par molécule de glucose</div>
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-[10px]" style={{ color: C.accent2 }}>+ H₂O</span>
            <span className="text-[10px]" style={{ color: C.muted }}>+ CO₂</span>
          </div>
        </div>
      </div>
    </div>
  );
}