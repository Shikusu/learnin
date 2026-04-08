import { useState } from "react";
import { C } from "@/constants/colors";
import { Card } from "./Card";
import { Tag } from "./Tag";

export function RespiratoryChain() {
  const [active, setActive] = useState(null);

  const complexes = [
    {
      id: "I", label: "Complexe I", sub: "NADH-CoQ Réductase",
      input: "NADH + H⁺", output: "NAD⁺", pump: true, atpEquiv: "3 ATP",
      color: C.accent5,
      detail: "Oxyde NADH → NAD⁺. Transfère 2e⁻ sur CoQ. Pompe 4 H⁺ vers l'espace intermembranaire. Inhibé par la Roténone."
    },
    {
      id: "II", label: "Complexe II", sub: "Succinate-CoQ Réductase",
      input: "FADH₂", output: "FAD", pump: false, atpEquiv: "2 ATP",
      color: C.accent1,
      detail: "Oxyde FADH₂ → FAD. PAS de pompe à H⁺ (ΔG trop faible). Court-circuite le Cpl I."
    },
    {
      id: "III", label: "Complexe III", sub: "Cytochrome bc1",
      input: "UQH₂", output: "UQ", pump: true,
      color: C.accent3,
      detail: "Réoxyde UQH₂. Transfère e⁻ sur Cytochrome c. Pompe 4 H⁺. Inhibé par l'Antimycine A."
    },
    {
      id: "IV", label: "Complexe IV", sub: "Cytochrome c Oxydase",
      input: "4 cyt.c réduit", output: "H₂O", pump: true,
      color: C.accent2,
      detail: "Transfère les e⁻ vers O₂ → H₂O. Pompe 2 H⁺. ACCEPTEUR FINAL d'e⁻. Inhibé par Cyanure, CO, H₂S."
    },
    {
      id: "V", label: "Complexe V", sub: "ATP Synthase (F₀F₁)",
      input: "ADP + Pi", output: "ATP", pump: false, atp: true,
      color: C.accent1,
      detail: "NE transporte PAS d'e⁻. Le flux de H⁺ via F₀ fait tourner F₁ → synthèse d'ATP. Inhibé par Oligomycine."
    },
  ];

  const activeComplex = complexes.find(c => c.id === active);

  return (
    <div>
      {/* ── DESKTOP SVG (hidden on mobile) ── */}
      <div className="hidden sm:block">
        <svg viewBox="0 0 720 320" style={{ width: "100%" }}>
          <defs>
            <marker id="arrowElectron" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill={C.accent5}/>
            </marker>
            <marker id="arrowH" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill={C.accent3}/>
            </marker>
          </defs>

          {/* Membrane layers */}
          <rect x="0" y="100" width="720" height="120" fill={`${C.accent1}08`}/>
          <rect x="0" y="100" width="720" height="14" fill={`${C.accent1}18`}/>
          <rect x="0" y="206" width="720" height="14" fill={`${C.accent1}18`}/>
          <text x="12" y="92" fill={C.muted} fontSize="10">Espace intermembranaire (H⁺ ↑)</text>
          <text x="12" y="235" fill={C.muted} fontSize="10">Matrice mitochondriale</text>

          {/* Mobile carriers */}
          <text x="265" y="170" fill={C.accent3} fontSize="9" textAnchor="middle" fontWeight="700">CoQ/UQ</text>
          <text x="265" y="182" fill={C.muted} fontSize="8" textAnchor="middle">(mobile)</text>
          <text x="405" y="170" fill={C.accent3} fontSize="9" textAnchor="middle" fontWeight="700">Cyt. c</text>
          <text x="405" y="182" fill={C.muted} fontSize="8" textAnchor="middle">(mobile)</text>

          {/* Electron flow */}
          <path d="M 110,160 L 188,160 M 250,160 L 318,160 M 382,160 L 458,160 M 522,160 L 588,160"
            stroke={C.accent5} strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrowElectron)"/>

          {/* Complexes */}
          {[
            { id:"I", x:60 }, { id:"II", x:190 }, { id:"III", x:320 },
            { id:"IV", x:460 }, { id:"V", x:590 }
          ].map(({ id, x }) => {
            const c = complexes.find(cx => cx.id === id);
            const isActive = active === id;
            return (
              <g key={id} style={{ cursor: "pointer" }} onClick={() => setActive(isActive ? null : id)}>
                <rect x={x} y={110} width={110} height={100} rx="10"
                  fill={isActive ? `${c.color}28` : `${c.color}14`}
                  stroke={c.color} strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: "all .2s" }}/>
                <text x={x+55} y={128} fill={c.color} fontSize="12" fontWeight="900" textAnchor="middle">Cpl. {id}</text>
                <text x={x+55} y={142} fill={C.muted} fontSize="8" textAnchor="middle">{c.sub.split(" ").slice(0,2).join(" ")}</text>
                <text x={x+55} y={162} fill={C.text} fontSize="9" textAnchor="middle">{c.input}</text>
                <text x={x+55} y={172} fill={C.muted} fontSize="8" textAnchor="middle">↓</text>
                <text x={x+55} y={184} fill={c.atp ? C.accent2 : C.muted} fontSize="9" textAnchor="middle"
                  fontWeight={c.atp ? "900" : "normal"}>{c.output}</text>
                {c.pump && <text x={x+55} y={200} fill={C.accent3} fontSize="8" textAnchor="middle">⬆ H⁺ pump</text>}
              </g>
            );
          })}

          {/* H+ arrows */}
          {[110, 360, 490].map((x, i) => (
            <g key={i}>
              <line x1={x+15} y1="98" x2={x+15} y2="75" stroke={C.accent3} strokeWidth="1.5"
                markerEnd="url(#arrowH)" strokeDasharray="3,2"/>
              <text x={x+20} y="80" fill={C.accent3} fontSize="8">H⁺</text>
            </g>
          ))}

          {/* O2 → H2O */}
          <text x="515" y="260" fill={C.accent2} fontSize="10" textAnchor="middle">O₂ → H₂O</text>
          <line x1="515" y1="255" x2="515" y2="212" stroke={C.accent2} strokeWidth="1.5"
            strokeDasharray="3,2" markerEnd="url(#arrowElectron)"/>

          {/* H+ return */}
          <path d="M 650,78 Q 680,78 680,250 Q 680,275 645,275" fill="none" stroke={C.accent1}
            strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowElectron)"/>
          <text x="688" y="180" fill={C.accent1} fontSize="9" textAnchor="middle">H⁺</text>
        </svg>
      </div>

      {/* ── MOBILE CARD LIST (hidden on sm+) ── */}
      <div className="flex flex-col gap-2 sm:hidden">
        {/* Membrane label */}
        <div className="text-[11px] font-medium px-3 py-2 rounded-xl text-center"
          style={{ background: `${C.accent1}10`, color: C.muted }}>
          Membrane interne mitochondriale · e⁻ flow: I → II → III → IV → V
        </div>

        {complexes.map((c, i) => (
          <div key={c.id}>
            {/* Electron carrier between complexes */}
            {i === 1 && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                <div className="h-px flex-1" style={{ background: `${C.accent3}44` }} />
                <span className="text-[10px] font-bold" style={{ color: C.accent3 }}>CoQ/UQ</span>
                <div className="h-px flex-1" style={{ background: `${C.accent3}44` }} />
              </div>
            )}
            {i === 3 && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                <div className="h-px flex-1" style={{ background: `${C.accent3}44` }} />
                <span className="text-[10px] font-bold" style={{ color: C.accent3 }}>Cyt. c</span>
                <div className="h-px flex-1" style={{ background: `${C.accent3}44` }} />
              </div>
            )}

            <div onClick={() => setActive(active === c.id ? null : c.id)}
              className="rounded-2xl px-4 py-3 border cursor-pointer transition-all duration-150"
              style={{
                background: active === c.id ? `${c.color}22` : `${c.color}10`,
                borderColor: active === c.id ? c.color : `${c.color}44`,
              }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[13px] font-black" style={{ color: c.color }}>Cpl. {c.id}</span>
                  <span className="text-[11px] ml-2" style={{ color: C.muted }}>{c.sub}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {c.pump && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${C.accent3}20`, color: C.accent3 }}>H⁺ pump</span>
                  )}
                  {c.atpEquiv && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${C.accent2}20`, color: C.accent2 }}>≈ {c.atpEquiv}</span>
                  )}
                </div>
              </div>
              <div className="text-[12px] mt-1.5" style={{ color: C.muted }}>
                {c.input} → <span style={{ color: c.atp ? C.accent2 : C.text }}>{c.output}</span>
              </div>
              {active === c.id && (
                <div className="text-[12px] mt-2.5 leading-relaxed" style={{ color: C.muted }}>
                  {c.detail}
                </div>
              )}
            </div>

            {/* Arrow between complexes */}
            {i < complexes.length - 1 && (
              <div className="flex justify-center py-0.5">
                <span className="text-sm" style={{ color: C.accent5 }}>↓</span>
              </div>
            )}
          </div>
        ))}

        {/* O2/H2O footer */}
        <div className="flex justify-between px-3 py-2 rounded-xl text-[11px]"
          style={{ background: `${C.accent2}10`, color: C.accent2 }}>
          <span>O₂ → H₂O (Complexe IV)</span>
          <span style={{ color: C.accent1 }}>H⁺ → ATP (Complexe V)</span>
        </div>
      </div>

      {/* Detail panel — desktop only (mobile shows inline) */}
      {active && (
        <div className="hidden sm:block">
          <Card style={{ marginTop: 12, borderColor: activeComplex.color, animation: "slide-up .2s ease" }}>
            <div className="flex justify-between items-center mb-2.5">
              <Tag color={activeComplex.color}>Complexe {activeComplex.id}</Tag>
              {activeComplex.atpEquiv && <Tag color={C.accent2}>≈ {activeComplex.atpEquiv}</Tag>}
              {!activeComplex.pump && activeComplex.id !== "V" && <Tag color={C.muted}>Pas de pompe H⁺</Tag>}
            </div>
            <div className="font-bold text-[15px] mb-1.5" style={{ color: C.text }}>
              {activeComplex.label} — {activeComplex.sub}
            </div>
            <div className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{activeComplex.detail}</div>
          </Card>
        </div>
      )}

      {!active && (
        <p className="hidden sm:block text-center text-[13px] mt-2" style={{ color: C.muted }}>
          Clique sur un complexe pour voir le détail
        </p>
      )}
    </div>
  );
}