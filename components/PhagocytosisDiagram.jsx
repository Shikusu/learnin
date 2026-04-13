"use client";
import { useState } from "react";

const STEPS = [
  {
    id: 0,
    label: "Reconnaissance & Adhésion",
    icon: "👁️",
    color: "#2980b9",
    desc: "Les récepteurs du phagocyte (récepteurs Fc, CR1/CR3 pour C3b, PRR/TLR) reconnaissent les opsonines ou directement les PAMP bactériens. L'adhésion déclenche le signal d'activation.",
    molecules: ["Récepteurs Fc (IgG)", "CR1/CR3 (C3b)", "TLR, Lectines", "Mannose-R"],
  },
  {
    id: 1,
    label: "Formation de pseudopodes",
    icon: "🦾",
    color: "#27ae60",
    desc: "Le cytosquelette d'actine se réorganise pour former des pseudopodes qui englobent progressivement le pathogène. Processus actif nécessitant du glucose (glycolyse).",
    molecules: ["Actine-F", "Myosine", "Rho GTPases", "Rac1, Cdc42"],
  },
  {
    id: 2,
    label: "Formation du phagosome",
    icon: "🫧",
    color: "#8e44ad",
    desc: "Fusion des pseudopodes → formation d'une vacuole fermée (phagosome) contenant le pathogène. La membrane plasmique devient la membrane du phagosome.",
    molecules: ["Phagosome", "PI3K", "Dynamine"],
  },
  {
    id: 3,
    label: "Bactéricidie",
    icon: "⚡",
    color: "#c0392b",
    desc: "Le phagosome fusionne avec des lysosomes → phagolysosme. Deux mécanismes : oxygène-dépendant (explosion oxydative, NADPH oxydase → O₂⁻, H₂O₂, HOCl) et oxygène-indépendant (pH acide, enzymes lytiques, défensines, lactoferrine).",
    molecules: ["NADPH oxydase", "MPO", "Élastase", "Cathepsines", "Défensines"],
  },
  {
    id: 4,
    label: "Digestion intracellulaire",
    icon: "🔬",
    color: "#e67e22",
    desc: "Les enzymes lysosomiales (protéases, lipases, nucléases) dégradent les composants bactériens. Les fragments peptidiques sont chargés sur le CMH II pour la présentation aux LT CD4+.",
    molecules: ["Protéases", "Lipases", "Nucléases", "pH 4–5"],
  },
  {
    id: 5,
    label: "Exocytose des débris",
    icon: "🗑️",
    color: "#16a085",
    desc: "Les résidus non dégradables sont expulsés par exocytose. Les peptides bactériens sont présentés sur CMH II → activation de la réponse immunitaire adaptative (LT CD4+).",
    molecules: ["Exocytose", "CMH II", "Peptides Ag", "Activation LT"],
  },
];

export default function PhagocytosisDiagram() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
        Étapes de la Phagocytose
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
        Cliquez sur une étape pour les détails moléculaires
      </p>

      {/* Step selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto" , paddingBottom: 4 }}>
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              display: "flex",
              flexDirection: "column" ,
              alignItems: "center",
              gap: 6,
              padding: "12px 16px",
              borderRadius: 10,
              border: `2px solid ${active === s.id ? s.color : "#e2ded5"}`,
              background: active === s.id ? s.color + "12" : "white",
              cursor: "pointer",
              minWidth: 90,
              transition: "all 0.18s",
            }}
          >
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: active === s.id ? s.color : "#6b7280", textAlign: "center" , lineHeight: 1.3 }}>
              {s.id + 1}. {s.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((active + 1) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}80)`, borderRadius: 2, transition: "width 0.35s ease" }} />
      </div>

      {/* Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* SVG visual */}
        <div>
          <svg viewBox="0 0 280 260" style={{ width: "100%" }}>
            {/* Macrophage body */}
            <ellipse cx="140" cy="150" rx="110" ry="85" fill="#fdf5ec" stroke="#e67e22" strokeWidth="2" />
            <text x="140" y="235" textAnchor="middle" fontSize="9" fill="#e67e22" fontWeight="700">Macrophage / Neutrophile</text>

            {/* Nucleus */}
            <ellipse cx="140" cy="168" rx="42" ry="28" fill="#fff3e0" stroke="#e67e22" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="140" y="172" textAnchor="middle" fontSize="8" fill="#e67e22">Noyau</text>

            {/* Lysosomes */}
            {[[80, 145], [100, 128], [175, 140]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="10" fill="#c0392b20" stroke="#c0392b" strokeWidth="1.5" />
            ))}
            <text x="82" y="165" textAnchor="middle" fontSize="7.5" fill="#c0392b">Lysosomes</text>

            {/* Step-specific visualization */}
            {active === 0 && (
              <g>
                {/* Bacterium outside */}
                <ellipse cx="140" cy="42" rx="22" ry="12" fill="#e8f5e9" stroke="#27ae60" strokeWidth="2" />
                <text x="140" y="47" textAnchor="middle" fontSize="8" fill="#27ae60" fontWeight="700">Bactérie</text>
                {/* Receptor signals */}
                {[115, 128, 145, 158, 170].map((x, i) => (
                  <circle key={i} cx={x} cy={62} r="5" fill="#2980b930" stroke="#2980b9" strokeWidth="1.5" />
                ))}
                <text x="140" y="78" textAnchor="middle" fontSize="7.5" fill="#2980b9">Récepteurs Fc / CR</text>
              </g>
            )}

            {active === 1 && (
              <g>
                <ellipse cx="140" cy="48" rx="20" ry="11" fill="#e8f5e9" stroke="#27ae60" strokeWidth="2" />
                <path d="M115,65 Q100,58 95,72 Q90,85 110,82" fill="#27ae60" stroke="#27ae60" strokeWidth="1.5" fillOpacity="0.3" />
                <path d="M165,65 Q180,58 185,72 Q190,85 170,82" fill="#27ae60" stroke="#27ae60" strokeWidth="1.5" fillOpacity="0.3" />
                <text x="140" y="48" textAnchor="middle" fontSize="8" fill="#27ae60" fontWeight="700">Bact.</text>
                <text x="140" y="92" textAnchor="middle" fontSize="7.5" fill="#27ae60">Pseudopodes (actine-F)</text>
              </g>
            )}

            {active === 2 && (
              <g>
                <circle cx="140" cy="98" r="22" fill="#f3e5f540" stroke="#8e44ad" strokeWidth="2" />
                <ellipse cx="140" cy="98" rx="13" ry="8" fill="#e8f5e9" stroke="#27ae60" strokeWidth="1.5" />
                <text x="140" y="102" textAnchor="middle" fontSize="7" fill="#27ae60">Bact.</text>
                <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#8e44ad" fontWeight="700">Phagosome</text>
              </g>
            )}

            {active === 3 && (
              <g>
                <circle cx="140" cy="105" r="22" fill="#fdecea40" stroke="#c0392b" strokeWidth="2.5" />
                <ellipse cx="140" cy="105" rx="12" ry="7" fill="#e8f5e9" stroke="#27ae60" strokeWidth="1" />
                {["⚡", "💥", "⚡"].map((e, i) => (
                  <text key={i} x={120 + i * 20} y={98} fontSize="11">{e}</text>
                ))}
                <text x="140" y="132" textAnchor="middle" fontSize="7.5" fill="#c0392b" fontWeight="700">Phagolysosme actif</text>
                <text x="140" y="142" textAnchor="middle" fontSize="7" fill="#6b7280">O₂⁻, H₂O₂, HOCl</text>
              </g>
            )}

            {active === 4 && (
              <g>
                <circle cx="140" cy="110" r="20" fill="#fff3e040" stroke="#e67e22" strokeWidth="2" />
                {["···", "···"].map((d, i) => (
                  <text key={i} x={130 + i * 14} y={114} fontSize="9" fill="#e67e22">{d}</text>
                ))}
                <text x="140" y="136" textAnchor="middle" fontSize="7.5" fill="#e67e22" fontWeight="700">Digestion enzymatique</text>
              </g>
            )}

            {active === 5 && (
              <g>
                <line x1="140" y1="72" x2="140" y2="52" stroke="#16a085" strokeWidth="2" markerEnd="url(#exitArrow)" />
                <defs>
                  <marker id="exitArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#16a085" />
                  </marker>
                </defs>
                <rect x="100" y="36" width="80" height="18" rx="4" fill="#e0f7fa" stroke="#16a085" strokeWidth="1.5" />
                <text x="140" y="49" textAnchor="middle" fontSize="7.5" fill="#16a085" fontWeight="700">Débris + CMH II</text>
                <text x="140" y="85" textAnchor="middle" fontSize="7.5" fill="#16a085">Exocytose → présentation Ag</text>
              </g>
            )}
          </svg>
        </div>

        {/* Text content */}
        <div style={{ animation: "fadeUp 0.3s ease both" }} key={active}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>{step.icon}</span>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: step.color, fontWeight: 600, textTransform: "uppercase" , marginBottom: 4 }}>Étape {step.id + 1}</div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: step.color }}>{step.label}</h4>
            </div>
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.75, color: "#374151", marginBottom: 20 }}>{step.desc}</p>

          <div style={{ background: step.color + "08", border: `1px solid ${step.color}20`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, color: step.color, textTransform: "uppercase" , marginBottom: 10, letterSpacing: "0.05em" }}>Molécules clés</div>
            <div style={{ display: "flex", flexWrap: "wrap" , gap: 6 }}>
              {step.molecules.map((m) => (
                <span key={m} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: step.color + "15", color: step.color, fontFamily: "var(--font-mono)", fontWeight: 500 }}>{m}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2ded5", background: "white", cursor: active === 0 ? "not-allowed" : "pointer", fontSize: 13, color: active === 0 ? "#d1d5db" : "#374151", fontWeight: 500 }}>← Précédent</button>
            <button onClick={() => setActive(Math.min(STEPS.length - 1, active + 1))} disabled={active === STEPS.length - 1} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2ded5", background: active === STEPS.length - 1 ? "#f9fafb" : "#1a1a2e", cursor: active === STEPS.length - 1 ? "not-allowed" : "pointer", fontSize: 13, color: active === STEPS.length - 1 ? "#d1d5db" : "white", fontWeight: 500 }}>Suivant →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
