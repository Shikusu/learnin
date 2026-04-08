import { useState } from "react";
import { C } from "@/constants/colors";
export function OverviewMap({ onSection }) {
  const [hov, setHov] = useState(null);
  const steps = [
    { id: "glycolyse", x: 60, y: 80, w: 160, h: 60, label: "GLYCOLYSE", sub: "Cytosol", color: C.accent3 },
    { id: "krebs",     x: 260, y: 80, w: 160, h: 60, label: "CYCLE DE KREBS", sub: "Mitochondrie", color: C.accent5 },
    { id: "chaine",    x: 460, y: 80, w: 180, h: 60, label: "CHAÎNE RESPI.", sub: "Membrane interne", color: C.accent1 },
  ];
  const molecules = [
    { x: 220, y: 107, label: "Pyruvate\n+ 2 ATP\n+ 2 NADH", color: C.accent3 },
    { x: 420, y: 107, label: "Acétyl-CoA\n+ 8 NADH\n+ 2 FADH₂\n+ 2 GTP", color: C.accent5 },
  ];
  const atpFinal = { x: 460, y: 200, label: "32-34 ATP" };

  return (
    <svg viewBox="0 0 700 280" style={{ width: "100%", maxWidth: 700 }}>
      {/* arrows between boxes */}
      <defs>
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.accent1} />
        </marker>
        <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.accent3} />
        </marker>
        <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.accent5} />
        </marker>
      </defs>

      {/* Glucose entry */}
      <rect x="10" y="90" rx="8" width="50" height="40" fill={`${C.accent2}22`} stroke={C.accent2} strokeWidth="1.5"/>
      <text x="35" y="108" fill={C.accent2} fontSize="9" textAnchor="middle" fontWeight="700">GLUCOSE</text>
      <text x="35" y="120" fill={C.muted} fontSize="8" textAnchor="middle">C₆H₁₂O₆</text>
      <line x1="60" y1="110" x2="58" y2="110" stroke={C.accent2} strokeWidth="1.5" markerEnd="url(#arrowBlue)"/>

      {/* Main boxes */}
      {steps.map(s => (
        <g key={s.id} style={{ cursor: "pointer" }}
          onClick={() => onSection(s.id)}
          onMouseEnter={() => setHov(s.id)}
          onMouseLeave={() => setHov(null)}>
          <rect x={s.x} y={s.y} rx="12" width={s.w} height={s.h}
            fill={hov === s.id ? `${s.color}33` : `${s.color}18`}
            stroke={s.color} strokeWidth={hov === s.id ? 2.5 : 1.5}
            style={{ transition: "all .2s" }}/>
          <text x={s.x + s.w/2} y={s.y + 26} fill={s.color} fontSize="13" fontWeight="900" textAnchor="middle">{s.label}</text>
          <text x={s.x + s.w/2} y={s.y + 44} fill={C.muted} fontSize="10" textAnchor="middle">{s.sub}</text>
          {hov === s.id && <text x={s.x + s.w/2} y={s.y + 58} fill={s.color} fontSize="9" textAnchor="middle">Cliquer pour explorer →</text>}
        </g>
      ))}

      {/* Arrows between steps */}
      <line x1="220" y1="110" x2="258" y2="110" stroke={C.accent3} strokeWidth="1.5" markerEnd="url(#arrowAmber)" strokeDasharray="4,2"/>
      <line x1="420" y1="110" x2="458" y2="110" stroke={C.accent5} strokeWidth="1.5" markerEnd="url(#arrowPurple)" strokeDasharray="4,2"/>

      {/* Molecule labels on arrows */}
      <text x="238" y="100" fill={C.accent3} fontSize="8.5" textAnchor="middle">Pyruvate →</text>
      <text x="438" y="100" fill={C.accent5} fontSize="8.5" textAnchor="middle">Acétyl-CoA →</text>

      {/* O2 input to chain */}
      <text x="600" y="60" fill={C.muted} fontSize="9" textAnchor="middle">O₂</text>
      <line x1="600" y1="63" x2="580" y2="79" stroke={C.muted} strokeWidth="1" markerEnd="url(#arrowBlue)"/>

      {/* ATP outputs */}
      <text x="140" y="170" fill={C.accent3} fontSize="11" textAnchor="middle" fontWeight="700">≈ 2 ATP</text>
      <text x="340" y="170" fill={C.accent5} fontSize="11" textAnchor="middle" fontWeight="700">≈ 2 GTP</text>

      {/* Final ATP bubble */}
      <ellipse cx="550" cy="210" rx="80" ry="30" fill={`${C.accent1}20`} stroke={C.accent1} strokeWidth="2"/>
      <text x="550" y="206" fill={C.accent1} fontSize="14" fontWeight="900" textAnchor="middle">32–34 ATP</text>
      <text x="550" y="220" fill={C.muted} fontSize="9" textAnchor="middle">par molécule de glucose</text>
      <line x1="550" y1="141" x2="550" y2="178" stroke={C.accent1} strokeWidth="1.5" markerEnd="url(#arrowBlue)"/>

      {/* H₂O output */}
      <text x="660" y="210" fill={C.accent2} fontSize="10" textAnchor="middle">+ H₂O</text>
      <line x1="642" y1="205" x2="630" y2="200" stroke={C.accent2} strokeWidth="1"/>

      {/* CO₂ outputs */}
      <text x="140" y="240" fill={C.muted} fontSize="9" textAnchor="middle">+ CO₂ (Krebs)</text>

      {/* NADH/FADH₂ going to chain */}
      <path d="M 340,145 Q 340,190 460,190" fill="none" stroke={C.accent5} strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#arrowPurple)"/>
      <text x="390" y="200" fill={C.accent5} fontSize="9">NADH + FADH₂ →</text>
    </svg>
  );
}