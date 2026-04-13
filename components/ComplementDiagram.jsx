"use client";
import { useState } from "react";

const STEPS = [
  { id: "classique", label: "Voie Classique", trigger: "Complexes Ag-Ac (IgG, IgM)", color: "#2980b9", x: 60, components: "C1q → C1r → C1s → C4 → C2 → C3 convertase (C4b2a)" },
  { id: "lectines", label: "Voie des Lectines", trigger: "MBL + mannose bactérien", color: "#27ae60", x: 150, components: "MBL → MASP-1/2 → C4 → C2 → C3 convertase" },
  { id: "alterne", label: "Voie Alterne", trigger: "Surfaces microbiennes directement", color: "#8e44ad", x: 240, components: "C3(H₂O) → Facteur B → Facteur D → C3 convertase (C3bBb)" },
  { id: "commune", label: "Voie Commune", trigger: "Toutes les 3 voies convergent", color: "#c0392b", x: 150, components: "C3b → C5 → C5a + C5b → C6-C9 → MAC" },
  { id: "mac", label: "Complexe d'Attaque Membranaire", trigger: "Lyse bactérienne", color: "#e67e22", x: 150, components: "C5b-6-7-8-9 → Pore dans la membrane → Lyse osmotique" },
];

const ROLES = [
  { icon: "💥", label: "Lyse directe", desc: "Le MAC perfore les membranes des pathogènes" },
  { icon: "🍽️", label: "Opsonisation", desc: "C3b se fixe sur les bactéries → phagocytose facilitée" },
  { icon: "📣", label: "Inflammation", desc: "C3a et C5a sont des anaphylatoxines → recrutement cellulaire" },
  { icon: "🗑️", label: "Élimination complexes", desc: "Clearance des complexes immuns" },
];

export default function ComplementDiagram() {
  const [active, setActive] = useState(null);
  const activeStep = STEPS.find((s) => s.id === active);

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
        Voies d'Activation du Complément
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Cliquez sur une voie pour les détails</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Cascade SVG */}
        <div>
          <svg viewBox="0 0 320 360" style={{ width: "100%" }}>
            {/* Three starting paths */}
            {STEPS.slice(0, 3).map((step, i) => (
              <g key={step.id} onClick={() => setActive(active === step.id ? null : step.id)} style={{ cursor: "pointer" }}>
                <rect
                  x={step.x - 50} y={20} width={100} height={56} rx={8}
                  fill={active === step.id ? step.color + "20" : step.color + "10"}
                  stroke={step.color}
                  strokeWidth={active === step.id ? 2.5 : 1.5}
                />
                <text x={step.x} y={44} textAnchor="middle" fontSize={9} fill={step.color} fontWeight="700">{step.label.split("Voie ")[1]}</text>
                <text x={step.x} y={58} textAnchor="middle" fontSize={7.5} fill="#6b7280">{step.trigger.split(" ").slice(0, 3).join(" ")}</text>
                {/* Arrow down */}
                <line x1={step.x} y1={76} x2={150} y2={130} stroke={step.color} strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrow)" />
              </g>
            ))}

            {/* Arrow marker */}
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#c0392b" />
              </marker>
            </defs>

            {/* C3 junction */}
            <g>
              <ellipse cx={150} cy={148} rx={42} ry={18} fill="#fdecea" stroke="#c0392b" strokeWidth="2" />
              <text x={150} y={145} textAnchor="middle" fontSize={9} fill="#c0392b" fontWeight="700">C3 Convertase</text>
              <text x={150} y={158} textAnchor="middle" fontSize={8} fill="#c0392b">C3 → C3a + C3b</text>
            </g>

            {/* C3a branch (inflammation) */}
            <g>
              <line x1={108} y1={155} x2={60} y2={195} stroke="#e67e22" strokeWidth="1.5" strokeDasharray="3,2" />
              <rect x={20} y={195} width={80} height={36} rx={6} fill="#fff3e0" stroke="#e67e22" strokeWidth="1.5" />
              <text x={60} y={210} textAnchor="middle" fontSize={8.5} fill="#e67e22" fontWeight="700">C3a / C5a</text>
              <text x={60} y={223} textAnchor="middle" fontSize={7.5} fill="#6b7280">Anaphylatoxines</text>
            </g>

            {/* C3b → Opsonisation */}
            <g>
              <line x1={170} y1={162} x2={240} y2={195} stroke="#27ae60" strokeWidth="1.5" strokeDasharray="3,2" />
              <rect x={210} y={195} width={90} height={36} rx={6} fill="#f0faf4" stroke="#27ae60" strokeWidth="1.5" />
              <text x={255} y={210} textAnchor="middle" fontSize={8.5} fill="#27ae60" fontWeight="700">C3b → Opsonine</text>
              <text x={255} y={223} textAnchor="middle" fontSize={7.5} fill="#6b7280">Phagocytose ↑</text>
            </g>

            {/* C5 convertase → MAC */}
            <line x1={150} y1={166} x2={150} y2={215} stroke="#c0392b" strokeWidth="2" />
            <g onClick={() => setActive(active === "commune" ? null : "commune")} style={{ cursor: "pointer" }}>
              <rect x={100} y={215} width={100} height={40} rx={8}
                fill={active === "commune" ? "#fdecea" : "#fff5f5"}
                stroke="#c0392b" strokeWidth={active === "commune" ? 2.5 : 1.5}
              />
              <text x={150} y={231} textAnchor="middle" fontSize={9} fill="#c0392b" fontWeight="700">C5 Convertase</text>
              <text x={150} y={248} textAnchor="middle" fontSize={7.5} fill="#6b7280">C5 → C5a + C5b</text>
            </g>

            <line x1={150} y1={255} x2={150} y2={282} stroke="#c0392b" strokeWidth="2" />

            {/* MAC */}
            <g onClick={() => setActive(active === "mac" ? null : "mac")} style={{ cursor: "pointer" }}>
              <rect x={85} y={282} width={130} height={50} rx={10}
                fill={active === "mac" ? "#fff3e0" : "#fafafa"}
                stroke="#e67e22" strokeWidth={active === "mac" ? 2.5 : 2}
              />
              <text x={150} y={303} textAnchor="middle" fontSize={9.5} fill="#e67e22" fontWeight="700">MAC</text>
              <text x={150} y={317} textAnchor="middle" fontSize={7.5} fill="#6b7280">C5b–C6–C7–C8–C9</text>
              <text x={150} y={327} textAnchor="middle" fontSize={7.5} fill="#e67e22">Lyse cellulaire 💥</text>
            </g>
          </svg>
        </div>

        {/* Info Panel */}
        <div>
          {activeStep ? (
            <div style={{ animation: "fadeUp 0.25s ease both" }}>
              <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: activeStep.color + "15", color: activeStep.color, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, marginBottom: 12, textTransform: "uppercase"  }}>
                {activeStep.id}
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 8, color: activeStep.color }}>{activeStep.label}</h4>
              <div style={{ background: activeStep.color + "08", border: `1px solid ${activeStep.color}25`, borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: activeStep.color, fontFamily: "var(--font-mono)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase"  }}>Déclencheur</div>
                <p style={{ fontSize: 14, color: "#374151" }}>{activeStep.trigger}</p>
              </div>
              <div style={{ background: "#f9fafb", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "var(--font-mono)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase"  }}>Composantes</div>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, fontFamily: "var(--font-mono)" }}>{activeStep.components}</p>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Sélectionnez une voie dans le schéma.</p>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Rôles biologiques</div>
              <div style={{ display: "grid", gap: 10 }}>
                {ROLES.map((r) => (
                  <div key={r.label} style={{ display: "flex", gap: 12, padding: 12, background: "#f9fafb", borderRadius: 8, border: "1px solid #e2ded5" }}>
                    <span style={{ fontSize: 22 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
