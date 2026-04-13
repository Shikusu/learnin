"use client";
import { useState } from "react";

const CYTOKINES = [
  { id: "il1", name: "IL-1", source: "Macrophages, monocytes", targets: ["Lymphocytes T", "Hépatocytes", "Hypothalamus"], effects: ["Activation LT", "Protéines phase aiguë", "Fièvre"], color: "#c0392b", x: 80, y: 60, type: "innée" },
  { id: "il2", name: "IL-2", source: "LT CD4+ activés", targets: ["LT CD8+", "LT CD4+", "NK"], effects: ["Prolifération LT", "Activation NK", "Auto-stimulation"], color: "#2980b9", x: 200, y: 40, type: "adaptative" },
  { id: "il4", name: "IL-4", source: "LT CD4+ Th2", targets: ["Lymphocytes B", "Mastocytes"], effects: ["Commutation IgE", "Activation Th2", "Anti-inflammatoire"], color: "#27ae60", x: 320, y: 70, type: "adaptative" },
  { id: "il6", name: "IL-6", source: "Macrophages, LT, fibroblastes", targets: ["Hépatocytes", "Lymphocytes B", "LT"], effects: ["Protéines phase aiguë", "Différenciation LB → plasmocytes", "Fièvre"], color: "#8e44ad", x: 80, y: 160, type: "innée" },
  { id: "tnfa", name: "TNF-α", source: "Macrophages, NK", targets: ["Nombreuses cellules", "Endothélium"], effects: ["Inflammation", "Apoptose", "Choc septique (↑↑)"], color: "#e67e22", x: 210, y: 180, type: "innée" },
  { id: "ifng", name: "IFN-γ", source: "LT CD4+ Th1, LT CD8+, NK", targets: ["Macrophages", "CPA"], effects: ["Activation macrophages", "↑ CMH I & II", "Polarisation Th1"], color: "#16a085", x: 330, y: 160, type: "adaptative" },
  { id: "tgfb", name: "TGF-β", source: "Treg, plaquettes", targets: ["LT effecteurs", "LB"], effects: ["Immunosuppression", "Tolérance", "Commutation IgA"], color: "#7f8c8d", x: 200, y: 280, type: "régulatrice" },
  { id: "il10", name: "IL-10", source: "Macrophages M2, Treg", targets: ["Macrophages", "Th1"], effects: ["Anti-inflammatoire", "↓ CMH II", "↓ IL-12"], color: "#2c3e50", x: 330, y: 270, type: "régulatrice" },
];

const CONNECTIONS = [
  { from: "il1", to: "il2", label: "Active" },
  { from: "il2", to: "ifng", label: "Promeut Th1" },
  { from: "il4", to: "tgfb", label: "Promeut" },
  { from: "tnfa", to: "il6", label: "Synergique" },
  { from: "ifng", to: "il10", label: "Inhibé par" },
  { from: "il10", to: "tnfa", label: "Inhibe" },
  { from: "tgfb", to: "il2", label: "Inhibe" },
];

const TYPE_COLORS ={ innée: "#c0392b", adaptative: "#2980b9", régulatrice: "#7f8c8d" };

export default function CytokineDiagram() {
  const [active, setActive] = useState(null);
  const activeCyt = CYTOKINES.find((c) => c.id === active);

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
        Réseau des Cytokines (Cytokine Network)
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        Cliquez sur une cytokine pour ses propriétés
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
            Immunité {type}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Network SVG */}
        <div style={{ background: "#fafafa", borderRadius: 12, border: "1px solid #e2ded5", overflow: "hidden" }}>
          <svg viewBox="0 0 420 340" style={{ width: "100%" }}>
            <defs>
              <marker id="netArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker id="inhibArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,3 L6,0 L6,6 Z" fill="#c0392b" />
              </marker>
            </defs>

            {/* Connection lines */}
            {CONNECTIONS.map((c) => {
              const from = CYTOKINES.find((cy) => cy.id === c.from);
              const to = CYTOKINES.find((cy) => cy.id === c.to);
              if (!from || !to) return null;
              const isInhib = c.label.includes("Inhib");
              return (
                <g key={`${c.from}-${c.to}`}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isInhib ? "#fca5a5" : "#e2e8f0"}
                    strokeWidth={active === c.from || active === c.to ? 2 : 1}
                    strokeDasharray={isInhib ? "4,3" : "none"}
                    markerEnd={`url(#${isInhib ? "inhibArrow" : "netArrow"})`}
                  />
                </g>
              );
            })}

            {/* Cytokine nodes */}
            {CYTOKINES.map((cyt) => (
              <g
                key={cyt.id}
                onClick={() => setActive(active === cyt.id ? null : cyt.id)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cyt.x} cy={cyt.y} r={active === cyt.id ? 26 : 22}
                  fill={active === cyt.id ? cyt.color : cyt.color + "18"}
                  stroke={cyt.color}
                  strokeWidth={active === cyt.id ? 2.5 : 1.5}
                  style={{ transition: "all 0.2s" }}
                />
                <text x={cyt.x} y={cyt.y + 4} textAnchor="middle" fontSize="9" fill={active === cyt.id ? "white" : cyt.color} fontWeight="700">{cyt.name}</text>
                <text x={cyt.x} y={cyt.y + 36} textAnchor="middle" fontSize="7" fill="#94a3b8">{cyt.type}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Details panel */}
        <div>
          {activeCyt ? (
            <div style={{ animation: "fadeUp 0.25s ease both" }} key={activeCyt.id}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 8, background: activeCyt.color, marginBottom: 14 }}>
                <span style={{ color: "white", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>{activeCyt.name}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, textTransform: "uppercase" }}>Immunité {activeCyt.type}</span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>Source</div>
                <p style={{ fontSize: 13, color: "#374151", background: "#f9fafb", padding: "8px 12px", borderRadius: 6 }}>{activeCyt.source}</p>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 }}>Cellules cibles</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {activeCyt.targets.map((t) => (
                    <span key={t} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: activeCyt.color + "12", color: activeCyt.color, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" , marginBottom: 6 }}>Effets</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {activeCyt.effects.map((e) => (
                    <div key={e} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: activeCyt.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#374151" }}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔗</div>
              <p style={{ marginBottom: 16, lineHeight: 1.6 }}>Sélectionnez une cytokine pour voir ses propriétés.</p>
              <div style={{ background: "#f9fafb", borderRadius: 8, padding: 14, border: "1px solid #e2ded5" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Propriétés fondamentales :</p>
                {["Pléiotropisme — plusieurs effets sur différentes cellules", "Redondance — plusieurs cytokines ont le même effet", "Synergie — effets addictifs ou potentialisateurs", "Antagonisme — inhibition mutuelle"].map((p) => (
                  <div key={p} style={{ fontSize: 11.5, color: "#6b7280", marginBottom: 6, paddingLeft: 10, borderLeft: "2px solid #e2ded5" }}>{p}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
