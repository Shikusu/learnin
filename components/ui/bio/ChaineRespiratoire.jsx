import { useState } from "react";
import { C } from "@/constants/colors";
import {Card} from "./Card";
import {Tag} from "./Tag";
export function RespiratoryChain() {
  const [active, setActive] = useState(null);
  const complexes = [
    {
      id: "I", x: 60, label: "Complexe I", sub: "NADH-CoQ Réductase",
      input: "NADH + H⁺", output: "NAD⁺", pump: true, atpEquiv: "3 ATP",
      color: C.accent5,
      detail: "Oxyde NADH → NAD⁺. Transfère 2e⁻ sur CoQ. Pompe 4 H⁺ vers l'espace intermembranaire. Inhibé par la Roténone."
    },
    {
      id: "II", x: 190, label: "Complexe II", sub: "Succinate-CoQ Réductase",
      input: "FADH₂", output: "FAD", pump: false, atpEquiv: "2 ATP",
      color: C.accent1,
      detail: "Oxyde FADH₂ → FAD (aussi Succinate → Fumarate). PAS de pompe à H⁺ (ΔG trop faible). Court-circuite le Cpl I."
    },
    {
      id: "III", x: 320, label: "Complexe III", sub: "Cytochrome bc1",
      input: "UQH₂", output: "UQ", pump: true,
      color: C.accent3,
      detail: "Réoxyde UQH₂. Sépare H⁺ et e⁻. e⁻ transférés sur Cytochrome c. Pompe 4 H⁺. Inhibé par l'Antimycine A."
    },
    {
      id: "IV", x: 460, label: "Complexe IV", sub: "Cytochrome c Oxydase",
      input: "4 cyt.c réduit", output: "H₂O", pump: true,
      color: C.accent2,
      detail: "Transfère les e⁻ vers O₂ → H₂O. Pompe 2 H⁺. ACCEPTEUR FINAL d'e⁻. Inhibé par le Cyanure, CO, H₂S."
    },
    {
      id: "V", x: 590, label: "Complexe V", sub: "ATP Synthase (F₀F₁)",
      input: "ADP + Pi", output: "ATP", pump: false, atp: true,
      color: C.accent1,
      detail: "NE transporte PAS d'e⁻. Le flux de H⁺ revenant dans la matrice (via canal F₀) fait tourner F₁ → synthèse d'ATP. 3 ADP → 3 ATP par NADH. Inhibé par Oligomycine."
    },
  ];

  return (
    <div>
      <svg viewBox="0 0 720 320" style={{ width: "100%" }}>
        {/* Membrane layers */}
        <rect x="0" y="100" width="720" height="120" fill={`${C.accent1}08`} rx="0"/>
        <rect x="0" y="100" width="720" height="14" fill={`${C.accent1}18`}/>
        <rect x="0" y="206" width="720" height="14" fill={`${C.accent1}18`}/>
        <text x="12" y="92" fill={C.muted} fontSize="10">Espace intermembranaire (H⁺ ↑)</text>
        <text x="12" y="235" fill={C.muted} fontSize="10">Matrice mitochondriale</text>
        <text x="12" y="248" fill={C.muted} fontSize="9">(NADH, FADH₂ produits ici)</text>

        {/* Mobile carriers */}
        <text x="265" y="170" fill={C.accent3} fontSize="9" textAnchor="middle" fontWeight="700">CoQ/UQ</text>
        <text x="265" y="182" fill={C.muted} fontSize="8" textAnchor="middle">(mobile)</text>
        <text x="405" y="170" fill={C.accent3} fontSize="9" textAnchor="middle" fontWeight="700">Cyt. c</text>
        <text x="405" y="182" fill={C.muted} fontSize="8" textAnchor="middle">(mobile)</text>

        {/* Electron flow line */}
        <path d="M 110,160 L 188,160 M 250,160 L 318,160 M 382,160 L 458,160 M 522,160 L 588,160"
          stroke={C.accent5} strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arrowElectron)"/>
        <defs>
          <marker id="arrowElectron" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={C.accent5}/>
          </marker>
          <marker id="arrowH" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={C.accent3}/>
          </marker>
        </defs>

        {/* Complexes */}
        {complexes.map((c) => {
          const isActive = active === c.id;
          const bx = c.x, by = 110, bw = 110, bh = 100;
          return (
            <g key={c.id} style={{ cursor: "pointer" }} onClick={() => setActive(isActive ? null : c.id)}>
              <rect x={bx} y={by} width={bw} height={bh} rx="10"
                fill={isActive ? `${c.color}28` : `${c.color}14`}
                stroke={c.color} strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "all .2s" }}/>
              <text x={bx + bw/2} y={by + 18} fill={c.color} fontSize="12" fontWeight="900" textAnchor="middle">Cpl. {c.id}</text>
              <text x={bx + bw/2} y={by + 32} fill={C.muted} fontSize="8" textAnchor="middle">{c.sub.split(" ").slice(0,2).join(" ")}</text>
              {/* input/output */}
              <text x={bx + bw/2} y={by + 52} fill={C.text} fontSize="9" textAnchor="middle">{c.input}</text>
              <text x={bx + bw/2} y={by + 62} fill={C.muted} fontSize="8" textAnchor="middle">↓</text>
              <text x={bx + bw/2} y={by + 74} fill={c.atp ? C.accent2 : C.muted} fontSize="9" textAnchor="middle"
                fontWeight={c.atp ? "900" : "normal"}>{c.output}</text>
              {/* pump indicator */}
              {c.pump && (
                <text x={bx + bw/2} y={by + 90} fill={C.accent3} fontSize="8" textAnchor="middle">⬆ H⁺ pump</text>
              )}
            </g>
          );
        })}

        {/* H+ gradient arrows */}
        {[110, 360, 490].map((x, i) => (
          <g key={i}>
            <line x1={x + 15} y1="98" x2={x + 15} y2="75" stroke={C.accent3} strokeWidth="1.5"
              markerEnd="url(#arrowH)" strokeDasharray="3,2"/>
            <text x={x + 20} y="80" fill={C.accent3} fontSize="8">H⁺</text>
          </g>
        ))}

        {/* O2 → H2O at complex IV */}
        <text x="515" y="260" fill={C.accent2} fontSize="10" textAnchor="middle">O₂ → H₂O</text>
        <line x1="515" y1="255" x2="515" y2="212" stroke={C.accent2} strokeWidth="1.5"
          strokeDasharray="3,2" markerEnd="url(#arrowElectron)"/>

        {/* H+ return via V */}
        <path d="M 650,78 Q 680,78 680,250 Q 680,275 645,275" fill="none" stroke={C.accent1} strokeWidth="1.5"
          strokeDasharray="4,3" markerEnd="url(#arrowElectron)"/>
        <text x="688" y="175" fill={C.accent1} fontSize="9" textAnchor="middle">H⁺</text>
        <text x="688" y="187" fill={C.accent1} fontSize="9" textAnchor="middle">retour</text>
      </svg>

      {/* Detail panel */}
      {active && (() => {
        const c = complexes.find(x => x.id === active);
        return (
          <Card style={{ marginTop: 12, borderColor: c.color, animation: "slide-up .2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Tag color={c.color}>Complexe {c.id}</Tag>
              {c.atpEquiv && <Tag color={C.accent2}>≈ {c.atpEquiv}</Tag>}
              {!c.pump && c.id !== "V" && <Tag color={C.muted}>Pas de pompe H⁺</Tag>}
            </div>
            <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 6 }}>{c.label} — {c.sub}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{c.detail}</div>
          </Card>
        );
      })()}

      {!active && (
        <div style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 8 }}>
          Clique sur un complexe pour voir le détail
        </div>
      )}
    </div>
  );
}