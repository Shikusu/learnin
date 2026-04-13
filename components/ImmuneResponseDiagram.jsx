"use client";
import { useState } from "react";

const PRIMARY = [
  { t: 0, label: "Exposition Ag", y: 90, color: "#e67e22" },
  { t: 4, label: "Latence", y: 85, color: "#e67e22" },
  { t: 7, label: "Montée IgM", y: 60, color: "#2980b9" },
  { t: 10, label: "Pic IgM", y: 30, color: "#2980b9" },
  { t: 14, label: "IgG apparaît", y: 45, color: "#27ae60" },
  { t: 21, label: "Pic IgG", y: 20, color: "#27ae60" },
  { t: 30, label: "Déclin lent", y: 55, color: "#27ae60" },
];

const SECONDARY = [
  { t: 0, label: "2ème exposition", y: 80, color: "#e67e22" },
  { t: 2, label: "Réponse rapide", y: 50, color: "#c0392b" },
  { t: 5, label: "Pic IgG élevé", y: 10, color: "#c0392b" },
  { t: 15, label: "Mémoire prolongée", y: 25, color: "#c0392b" },
];

const DIFFERENCES = [
  { aspect: "Délai", primaire: "5–10 jours", secondaire: "1–3 jours" },
  { aspect: "Amplitude", primaire: "Faible", secondaire: "10–100× plus forte" },
  { aspect: "Isotype dominant", primaire: "IgM puis IgG", secondaire: "IgG, IgA, IgE" },
  { aspect: "Affinité", primaire: "Faible à modérée", secondaire: "Élevée (maturation)" },
  { aspect: "Durée", primaire: "Courte", secondaire: "Longue (mémoire)" },
  { aspect: "Cellules", primaire: "Lymphocytes naïfs", secondaire: "Cellules mémoires" },
];

export default function ImmuneResponseDiagram() {
  const [view, setView] = useState("graph");

  const toPath = (points, xScale, xOffset) => {
    const pts = points.map((p) => `${xOffset + p.t * xScale},${p.y}`);
    return "M" + pts.join(" L");
  };

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>
          Réponse Primaire vs Secondaire
        </h3>
        <div style={{ display: "flex", gap: 6 }}>
          {["graph", "table"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v === "graph" ? "graph" : "table")}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #e2ded5",
                background: view === v ? "#1a1a2e" : "white",
                color: view === v ? "white" : "#6b7280",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                transition: "all 0.15s",
              }}
            >
              {v === "graph" ? "📈 Graphe" : "📋 Tableau"}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
        Cinétique de la réponse anticorps humorale
      </p>

      {view === "graph" ? (
        <div>
          <svg viewBox="0 0 600 200" style={{ width: "100%", background: "#fafafa", borderRadius: 10, border: "1px solid #e2ded5" }}>
            {/* Grid lines */}
            {[30, 60, 90, 120, 150].map((y) => (
              <line key={y} x1="50" y1={y} x2="580" y2={y} stroke="#e5e7eb" strokeWidth="1" />
            ))}

            {/* Axes */}
            <line x1="50" y1="160" x2="580" y2="160" stroke="#374151" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="165" stroke="#374151" strokeWidth="1.5" />

            {/* Y axis label */}
            <text x="16" y="100" textAnchor="middle" fontSize="10" fill="#6b7280" transform="rotate(-90, 16, 100)">Taux Ac</text>
            <text x="320" y="185" textAnchor="middle" fontSize="10" fill="#6b7280">Temps (jours)</text>

            {/* Primary response curve */}
            <path
              d={toPath(PRIMARY, 8, 55)}
              fill="none" stroke="#2980b9" strokeWidth="2.5" strokeLinejoin="round"
            />
            {/* IgM */}
            <path
              d="M55,155 L111,155 L127,70 L143,35 L175,80 L207,130 L270,155"
              fill="none" stroke="#8e44ad" strokeWidth="2" strokeDasharray="5,3"
            />

            {/* Divider */}
            <line x1="295" y1="20" x2="295" y2="160" stroke="#e2ded5" strokeWidth="1.5" strokeDasharray="6,4" />
            <text x="295" y="15" textAnchor="middle" fontSize="8.5" fill="#9ca3af">2ème exposition</text>

            {/* Secondary response — bigger and faster */}
            <path
              d="M300,155 L316,120 L332,40 L348,12 L380,20 L420,35 L480,55 L540,70"
              fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinejoin="round"
            />

            {/* Labels */}
            <rect x="55" y="20" width="100" height="16" rx="3" fill="#e3f2fd" />
            <text x="105" y="32" textAnchor="middle" fontSize="8.5" fill="#2980b9" fontWeight="700">Réponse Primaire</text>

            <rect x="330" y="20" width="120" height="16" rx="3" fill="#fdecea" />
            <text x="390" y="32" textAnchor="middle" fontSize="8.5" fill="#c0392b" fontWeight="700">Réponse Secondaire</text>

            {/* IgM label */}
            <text x="150" y="52" fontSize="8" fill="#8e44ad" fontWeight="600">IgM</text>
            {/* IgG label */}
            <text x="220" y="78" fontSize="8" fill="#2980b9" fontWeight="600">IgG</text>
            {/* Secondary IgG */}
            <text x="430" y="30" fontSize="8" fill="#c0392b" fontWeight="600">IgG ↑↑</text>

            {/* Time markers */}
            {[7, 14, 21, 28].map((d) => (
              <text key={d} x={55 + d * 8} y="173" textAnchor="middle" fontSize="8" fill="#9ca3af">J{d}</text>
            ))}
          </svg>

          <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap"  }}>
            {[
              { color: "#2980b9", label: "IgG — Réponse primaire" },
              { color: "#8e44ad", label: "IgM — Réponse primaire", dashed: true },
              { color: "#c0392b", label: "IgG — Réponse secondaire" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
                <div style={{ width: 24, height: 2, background: l.color, borderRadius: 1, borderTop: l.dashed ? `2px dashed ${l.color}` : "none", borderBottom: l.dashed ? "none" : "none" }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto"  }}>
          <table style={{ width: "100%", borderCollapse: "collapse" , fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" , fontWeight: 600, color: "#374151", borderBottom: "2px solid #e2ded5" }}>Caractéristique</th>
                <th style={{ padding: "12px 16px", textAlign: "center" , fontWeight: 600, color: "#2980b9", borderBottom: "2px solid #e2ded5" }}>Réponse Primaire</th>
                <th style={{ padding: "12px 16px", textAlign: "center" , fontWeight: 600, color: "#c0392b", borderBottom: "2px solid #e2ded5" }}>Réponse Secondaire</th>
              </tr>
            </thead>
            <tbody>
              {DIFFERENCES.map((d, i) => (
                <tr key={d.aspect} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{d.aspect}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" , color: "#2980b9", borderBottom: "1px solid #f3f4f6" }}>{d.primaire}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" , color: "#c0392b", fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{d.secondaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}