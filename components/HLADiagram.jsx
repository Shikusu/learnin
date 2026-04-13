"use client";
import { useState } from "react";

const CMH_I = [
  { id: "alpha", label: "Chaîne α (lourde)", desc: "Chaîne transmembranaire codée par le CMH. Possède 3 domaines : α1 et α2 forment le sillon de liaison au peptide, α3 interagit avec CD8.", color: "#c0392b" },
  { id: "b2m", label: "β2-microglobuline", desc: "Petite chaîne non polymorphe non codée par le CMH. Stabilise la molécule. Non transmembranaire.", color: "#2980b9" },
  { id: "groove1", label: "Sillon de liaison (CMH I)", desc: "Formé par α1 + α2. Présente des peptides de 8–10 acides aminés issus de protéines endogènes (voie cytosolique). Reconnu par les LT CD8+.", color: "#27ae60" },
  { id: "peptide1", label: "Peptide endogène", desc: "Fragment protéique (8–10 AA) produit par le protéasome. Transporté dans le RE par TAP. Présenté aux LT CD8+ cytotoxiques.", color: "#8e44ad" },
];

const CMH_II = [
  { id: "alpha2", label: "Chaîne α", desc: "Chaîne transmembranaire du CMH II. Domaines α1 (polymorphe) et α2 (constant).", color: "#e67e22" },
  { id: "beta", label: "Chaîne β", desc: "Chaîne transmembranaire. Domaines β1 (très polymorphe, forme le sillon) et β2 (constant, lie CD4).", color: "#16a085" },
  { id: "groove2", label: "Sillon de liaison (CMH II)", desc: "Formé par α1 + β1. Ouvert aux deux extrémités → peptides de 13–25 AA. Présente des antigènes exogènes (voie endosomale) aux LT CD4+.", color: "#c0392b" },
  { id: "peptide2", label: "Peptide exogène", desc: "Fragment de protéine extracellulaire dégradée dans les endosomes/lysosomes. Chargé sur CMH II en déplaçant la chaîne invariante (CLIP).", color: "#2980b9" },
];

const COMPARISON = [
  { aspect: "Gènes", cI: "HLA-A, B, C", cII: "HLA-DR, DP, DQ" },
  { aspect: "Structure", cI: "1 chaîne α + β2m", cII: "Chaîne α + Chaîne β" },
  { aspect: "Peptides", cI: "8–10 acides aminés", cII: "13–25 acides aminés" },
  { aspect: "Origine Ag", cI: "Endogène (cytosolique)", cII: "Exogène (endosomal)" },
  { aspect: "Cellules présentatrices", cI: "Toutes cellules nucléées", cII: "CPA professionnelles" },
  { aspect: "Lymphocytes reconnaissants", cI: "LT CD8+ (cytotoxiques)", cII: "LT CD4+ (auxiliaires)" },
  { aspect: "Voie de traitement", cI: "Protéasome → TAP → RE", cII: "Endosome → Lysosome" },
];

export default function HLADiagram() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("structure");
  const allParts = [...CMH_I, ...CMH_II];
  const activePart = allParts.find((p) => p.id === active);

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Système HLA / CMH</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {(["structure", "comparison"] ).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e2ded5", background: tab === t ? "#0f1923" : "white", color: tab === t ? "white" : "#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all 0.15s" }}>
              {t === "structure" ? "🧩 Structure" : "⚖️ CMH I vs II"}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Complexe Majeur d'Histocompatibilité</p>

      {tab === "structure" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <svg viewBox="0 0 320 340" style={{ width: "100%" }}>
            {/* CMH I */}
            <text x="80" y="18" textAnchor="middle" fontSize="11" fill="#1a1a2e" fontWeight="700">CMH Classe I</text>
            {/* Membrane */}
            <rect x="20" y="200" width="140" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="90" y="212" textAnchor="middle" fontSize="8" fill="#94a3b8">Membrane plasmique</text>

            {/* Alpha chain */}
            <g onClick={() => setActive(active === "alpha" ? null : "alpha")} style={{ cursor: "pointer" }}>
              <rect x="50" y="60" width="50" height="135" rx="8" fill={active === "alpha" ? "#fdecea" : "#f9fafb"} stroke="#c0392b" strokeWidth={active === "alpha" ? 2.5 : 1.5} />
              <rect x="58" y="68" width="34" height="34" rx="4" fill="#fdecea" stroke="#c0392b" strokeWidth="1" />
              <text x="75" y="89" textAnchor="middle" fontSize="8" fill="#c0392b" fontWeight="700">α1</text>
              <rect x="58" y="108" width="34" height="34" rx="4" fill="#fdecea" stroke="#c0392b" strokeWidth="1" />
              <text x="75" y="129" textAnchor="middle" fontSize="8" fill="#c0392b" fontWeight="700">α2</text>
              <rect x="58" y="148" width="34" height="34" rx="4" fill="#fef3c7" stroke="#c0392b" strokeWidth="1" />
              <text x="75" y="169" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="700">α3</text>
              <text x="75" y="205" textAnchor="middle" fontSize="8" fill="#c0392b" fontWeight="600">Chaîne α</text>
            </g>

            {/* β2m */}
            <g onClick={() => setActive(active === "b2m" ? null : "b2m")} style={{ cursor: "pointer" }}>
              <rect x="108" y="148" width="42" height="34" rx="6" fill={active === "b2m" ? "#e3f2fd" : "#f0f7fd"} stroke="#2980b9" strokeWidth={active === "b2m" ? 2.5 : 1.5} />
              <text x="129" y="164" textAnchor="middle" fontSize="7.5" fill="#2980b9" fontWeight="700">β2m</text>
              <text x="129" y="174" textAnchor="middle" fontSize="6.5" fill="#2980b9">non-CMH</text>
            </g>

            {/* Groove with peptide */}
            <g onClick={() => setActive(active === "groove1" ? null : "groove1")} style={{ cursor: "pointer" }}>
              <path d="M52,64 L50,50 L100,50 L98,64" fill={active === "groove1" ? "#e8f5e9" : "#f0faf4"} stroke="#27ae60" strokeWidth={active === "groove1" ? 2 : 1.5} />
              <text x="75" y="60" textAnchor="middle" fontSize="7.5" fill="#27ae60" fontWeight="700">Sillon</text>
            </g>
            <g onClick={() => setActive(active === "peptide1" ? null : "peptide1")} style={{ cursor: "pointer" }}>
              <rect x="57" y="42" width="36" height="10" rx="3" fill={active === "peptide1" ? "#f3e5f5" : "#e8d5f0"} stroke="#8e44ad" strokeWidth="1.5" />
              <text x="75" y="51" textAnchor="middle" fontSize="7" fill="#8e44ad" fontWeight="700">Peptide (8–10aa)</text>
            </g>

            {/* CD8 */}
            <g style={{ opacity: 0.7 }}>
              <rect x="140" y="160" width="30" height="20" rx="4" fill="#fff8e1" stroke="#f9a825" strokeWidth="1" />
              <text x="155" y="174" textAnchor="middle" fontSize="7.5" fill="#e65100">CD8</text>
              <line x1="140" y1="170" x2="120" y2="170" stroke="#f9a825" strokeWidth="1" strokeDasharray="3,2" />
            </g>

            {/* CMH II */}
            <text x="240" y="18" textAnchor="middle" fontSize="11" fill="#1a1a2e" fontWeight="700">CMH Classe II</text>
            <rect x="175" y="200" width="140" height="16" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="245" y="212" textAnchor="middle" fontSize="8" fill="#94a3b8">Membrane plasmique</text>

            {/* Alpha II */}
            <g onClick={() => setActive(active === "alpha2" ? null : "alpha2")} style={{ cursor: "pointer" }}>
              <rect x="185" y="80" width="46" height="115" rx="8" fill={active === "alpha2" ? "#fff3e0" : "#f9fafb"} stroke="#e67e22" strokeWidth={active === "alpha2" ? 2.5 : 1.5} />
              <rect x="193" y="88" width="30" height="34" rx="4" fill="#fff3e0" stroke="#e67e22" strokeWidth="1" />
              <text x="208" y="109" textAnchor="middle" fontSize="8" fill="#e67e22" fontWeight="700">α1</text>
              <rect x="193" y="130" width="30" height="34" rx="4" fill="#fef9ec" stroke="#e67e22" strokeWidth="1" />
              <text x="208" y="151" textAnchor="middle" fontSize="8" fill="#e67e22" fontWeight="700">α2</text>
              <text x="208" y="204" textAnchor="middle" fontSize="8" fill="#e67e22" fontWeight="600">Chaîne α</text>
            </g>

            {/* Beta II */}
            <g onClick={() => setActive(active === "beta" ? null : "beta")} style={{ cursor: "pointer" }}>
              <rect x="237" y="80" width="46" height="115" rx="8" fill={active === "beta" ? "#e0f7fa" : "#f0fdfb"} stroke="#16a085" strokeWidth={active === "beta" ? 2.5 : 1.5} />
              <rect x="245" y="88" width="30" height="34" rx="4" fill="#e0f7fa" stroke="#16a085" strokeWidth="1" />
              <text x="260" y="109" textAnchor="middle" fontSize="8" fill="#16a085" fontWeight="700">β1</text>
              <rect x="245" y="130" width="30" height="34" rx="4" fill="#e8f8f5" stroke="#16a085" strokeWidth="1" />
              <text x="260" y="151" textAnchor="middle" fontSize="8" fill="#16a085" fontWeight="700">β2</text>
              <text x="260" y="204" textAnchor="middle" fontSize="8" fill="#16a085" fontWeight="600">Chaîne β</text>
            </g>

            {/* Groove II */}
            <g onClick={() => setActive(active === "groove2" ? null : "groove2")} style={{ cursor: "pointer" }}>
              <path d="M187,76 L185,60 L285,60 L283,76" fill={active === "groove2" ? "#fdecea" : "#fdf2f1"} stroke="#c0392b" strokeWidth={active === "groove2" ? 2 : 1.5} />
              <text x="235" y="72" textAnchor="middle" fontSize="7.5" fill="#c0392b" fontWeight="700">Sillon (ouvert)</text>
            </g>
            <g onClick={() => setActive(active === "peptide2" ? null : "peptide2")} style={{ cursor: "pointer" }}>
              <rect x="196" y="46" width="78" height="14" rx="4" fill={active === "peptide2" ? "#e3f2fd" : "#dbeafe"} stroke="#2980b9" strokeWidth="1.5" />
              <text x="235" y="57" textAnchor="middle" fontSize="7.5" fill="#2980b9" fontWeight="700">Peptide (13–25 aa)</text>
            </g>

            {/* CD4 */}
            <g style={{ opacity: 0.7 }}>
              <rect x="290" y="148" width="28" height="20" rx="4" fill="#fff8e1" stroke="#f9a825" strokeWidth="1" />
              <text x="304" y="162" textAnchor="middle" fontSize="7.5" fill="#e65100">CD4</text>
              <line x1="290" y1="158" x2="283" y2="158" stroke="#f9a825" strokeWidth="1" strokeDasharray="3,2" />
            </g>

            {/* T cell label */}
            <text x="80" y="240" textAnchor="middle" fontSize="9" fill="#6b7280">→ LT CD8+ (cytotoxique)</text>
            <text x="240" y="240" textAnchor="middle" fontSize="9" fill="#6b7280">→ LT CD4+ (auxiliaire)</text>
          </svg>

          <div>
            {activePart ? (
              <div style={{ animation: "fadeUp 0.25s ease both" }}>
                <div style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, background: activePart.color + "15", color: activePart.color, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, marginBottom: 12, textTransform: "uppercase"  }}>{activePart.id}</div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 12, color: activePart.color }}>{activePart.label}</h4>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#374151" }}>{activePart.desc}</p>
              </div>
            ) : (
              <div style={{ color: "#9ca3af", fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👆</div>
                <p style={{ marginBottom: 20 }}>Cliquez sur un domaine pour sa description.</p>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>Points clés</div>
                {[
                  "Le CMH détermine la compatibilité entre donneur et receveur lors des greffes",
                  "Chaque individu exprime jusqu'à 6 allèles HLA de classe I (A, B, C)",
                  "La restriction par le CMH = les LT ne reconnaissent l'Ag que présenté par le CMH du soi",
                  "Le polymorphisme HLA est le plus important du génome humain",
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ color: "#c0392b", fontWeight: 700, flexShrink: 0 }}>→</span>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{p}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto"  }}>
          <table style={{ width: "100%", borderCollapse: "collapse" , fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={{ padding: "12px 16px", textAlign: "left" , fontWeight: 600, color: "#374151", borderBottom: "2px solid #e2ded5" }}>Caractéristique</th>
                <th style={{ padding: "12px 16px", textAlign: "center" , fontWeight: 600, color: "#c0392b", borderBottom: "2px solid #e2ded5" }}>CMH Classe I</th>
                <th style={{ padding: "12px 16px", textAlign: "center" , fontWeight: 600, color: "#16a085", borderBottom: "2px solid #e2ded5" }}>CMH Classe II</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.aspect} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{row.aspect}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" , color: "#c0392b", borderBottom: "1px solid #f3f4f6" }}>{row.cI}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" , color: "#16a085", fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{row.cII}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
