"use client";
import { useState } from "react";

const PARTS = [
  {
    id: "fab1",
    label: "Fragment Fab (1)",
    desc: "Fragment de liaison à l'antigène. Contient le paratope formé par les régions hypervariables (CDR) des chaînes H et L.",
    color: "#c0392b",
  },
  {
    id: "fab2",
    label: "Fragment Fab (2)",
    desc: "Deuxième bras de liaison — chaque IgG possède 2 sites de fixation à l'antigène (bivalence).",
    color: "#c0392b",
  },
  {
    id: "fc",
    label: "Fragment Fc",
    desc: "Région cristallisable. Responsable des fonctions effectrices : activation du complément, fixation aux récepteurs Fc des cellules immunitaires (opsonisation, ADCC).",
    color: "#2980b9",
  },
  {
    id: "vh",
    label: "Région Variable VH",
    desc: "Région N-terminale de la chaîne lourde (¼ de la chaîne). Contient 3 régions hypervariables (CDR1, CDR2, CDR3) qui forment le paratope avec VL.",
    color: "#27ae60",
  },
  {
    id: "ch",
    label: "Région Constante CH",
    desc: "Région C-terminale de la chaîne lourde (¾ de la chaîne). Détermine l'isotype (IgG, IgM, IgA, IgD, IgE) et les fonctions effectrices.",
    color: "#8e44ad",
  },
  {
    id: "hinge",
    label: "Région Charnière",
    desc: "Zone de flexibilité entre les fragments Fab et Fc. Contient les ponts disulfures interchaînes lourdes. Permet la rotation des bras Fab.",
    color: "#e67e22",
  },
  {
    id: "disulfide",
    label: "Ponts Disulfures",
    desc: "Liaisons covalentes S-S entre les chaînes (interchaînes) et au sein des domaines (intrachaînes). Stabilisent la structure quaternaire de l'Ig.",
    color: "#16a085",
  },
];

export default function IgDiagram() {
  const [active, setActive] = useState(null);
  const activePart = PARTS.find((p) => p.id === active);

  return (
    <div style={{ background: "white", borderRadius: 16, padding: 32, border: "1px solid #e2ded5" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
        Structure d'une Immunoglobuline (IgG)
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
        Cliquez sur une région pour en savoir plus
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
        {/* SVG Diagram */}
        <div>
          <svg viewBox="0 0 300 320" style={{ width: "100%", maxWidth: 320 }}>
            {/* Left Fab arm */}
            <g
              onClick={() => setActive(active === "fab1" ? null : "fab1")}
              style={{ cursor: "pointer" }}
            >
              <rect x="30" y="20" width="80" height="110" rx="8"
                fill={active === "fab1" ? "#fdf2f1" : "#fafafa"}
                stroke={active === "fab1" ? "#c0392b" : "#ddd"}
                strokeWidth="2"
              />
              {/* VH */}
              <rect x="38" y="28" width="28" height="45" rx="4"
                fill={active === "vh" ? "#27ae60" : "#e8f5e9"}
                stroke="#27ae60" strokeWidth="1.5"
                onClick={(e) => { e.stopPropagation(); setActive(active === "vh" ? null : "vh"); }}
                style={{ cursor: "pointer" }}
              />
              <text x="52" y="55" textAnchor="middle" fontSize="8" fill="#145a32" fontWeight="600">VH</text>
              {/* VL */}
              <rect x="74" y="28" width="28" height="45" rx="4"
                fill="#e8f5e9" stroke="#27ae60" strokeWidth="1.5"
              />
              <text x="88" y="55" textAnchor="middle" fontSize="8" fill="#145a32" fontWeight="600">VL</text>
              {/* CH1 */}
              <rect x="38" y="80" width="28" height="42" rx="4"
                fill={active === "ch" ? "#f3e5f5" : "#f3e5f5"}
                stroke="#8e44ad" strokeWidth="1.5"
                onClick={(e) => { e.stopPropagation(); setActive(active === "ch" ? null : "ch"); }}
                style={{ cursor: "pointer" }}
              />
              <text x="52" y="104" textAnchor="middle" fontSize="8" fill="#4a148c" fontWeight="600">CH1</text>
              {/* CL */}
              <rect x="74" y="80" width="28" height="42" rx="4"
                fill="#fff8e1" stroke="#f9a825" strokeWidth="1.5"
              />
              <text x="88" y="104" textAnchor="middle" fontSize="8" fill="#e65100" fontWeight="600">CL</text>
              <text x="70" y="148" textAnchor="middle" fontSize="9" fill="#c0392b" fontWeight="700">Fab 1</text>
            </g>

            {/* Right Fab arm */}
            <g
              onClick={() => setActive(active === "fab2" ? null : "fab2")}
              style={{ cursor: "pointer" }}
            >
              <rect x="190" y="20" width="80" height="110" rx="8"
                fill={active === "fab2" ? "#fdf2f1" : "#fafafa"}
                stroke={active === "fab2" ? "#c0392b" : "#ddd"}
                strokeWidth="2"
              />
              <rect x="198" y="28" width="28" height="45" rx="4" fill="#e8f5e9" stroke="#27ae60" strokeWidth="1.5" />
              <text x="212" y="55" textAnchor="middle" fontSize="8" fill="#145a32" fontWeight="600">VH</text>
              <rect x="234" y="28" width="28" height="45" rx="4" fill="#e8f5e9" stroke="#27ae60" strokeWidth="1.5" />
              <text x="248" y="55" textAnchor="middle" fontSize="8" fill="#145a32" fontWeight="600">VL</text>
              <rect x="198" y="80" width="28" height="42" rx="4" fill="#f3e5f5" stroke="#8e44ad" strokeWidth="1.5" />
              <text x="212" y="104" textAnchor="middle" fontSize="8" fill="#4a148c" fontWeight="600">CH1</text>
              <rect x="234" y="80" width="28" height="42" rx="4" fill="#fff8e1" stroke="#f9a825" strokeWidth="1.5" />
              <text x="248" y="104" textAnchor="middle" fontSize="8" fill="#e65100" fontWeight="600">CL</text>
              <text x="230" y="148" textAnchor="middle" fontSize="9" fill="#c0392b" fontWeight="700">Fab 2</text>
            </g>

            {/* Hinge region */}
            <g onClick={() => setActive(active === "hinge" ? null : "hinge")} style={{ cursor: "pointer" }}>
              <rect x="110" y="128" width="80" height="28" rx="6"
                fill={active === "hinge" ? "#fff3e0" : "#fff3e0"}
                stroke={active === "hinge" ? "#e67e22" : "#e67e22"}
                strokeWidth={active === "hinge" ? 2.5 : 1.5}
              />
              <text x="150" y="147" textAnchor="middle" fontSize="9" fill="#e67e22" fontWeight="700">CHARNIÈRE</text>
            </g>

            {/* Fc region */}
            <g onClick={() => setActive(active === "fc" ? null : "fc")} style={{ cursor: "pointer" }}>
              <rect x="105" y="162" width="90" height="130" rx="10"
                fill={active === "fc" ? "#e3f2fd" : "#fafafa"}
                stroke={active === "fc" ? "#2980b9" : "#ddd"}
                strokeWidth={active === "fc" ? 2.5 : 2}
              />
              <rect x="113" y="170" width="32" height="40" rx="4" fill="#e3f2fd" stroke="#2980b9" strokeWidth="1.5" />
              <text x="129" y="193" textAnchor="middle" fontSize="8" fill="#0d47a1" fontWeight="600">CH2</text>
              <rect x="155" y="170" width="32" height="40" rx="4" fill="#e3f2fd" stroke="#2980b9" strokeWidth="1.5" />
              <text x="171" y="193" textAnchor="middle" fontSize="8" fill="#0d47a1" fontWeight="600">CH2</text>
              <rect x="113" y="218" width="32" height="40" rx="4" fill="#e3f2fd" stroke="#2980b9" strokeWidth="1.5" />
              <text x="129" y="241" textAnchor="middle" fontSize="8" fill="#0d47a1" fontWeight="600">CH3</text>
              <rect x="155" y="218" width="32" height="40" rx="4" fill="#e3f2fd" stroke="#2980b9" strokeWidth="1.5" />
              <text x="171" y="241" textAnchor="middle" fontSize="8" fill="#0d47a1" fontWeight="600">CH3</text>
              <text x="150" y="278" textAnchor="middle" fontSize="9" fill="#2980b9" fontWeight="700">Fragment Fc</text>
            </g>

            {/* Disulfide bonds */}
            <g onClick={() => setActive(active === "disulfide" ? null : "disulfide")} style={{ cursor: "pointer" }}>
              {/* Inter-heavy chain */}
              <line x1="130" y1="135" x2="170" y2="135" stroke="#16a085" strokeWidth="2.5" strokeDasharray="4,3" />
              <line x1="130" y1="142" x2="170" y2="142" stroke="#16a085" strokeWidth="2.5" strokeDasharray="4,3" />
              {/* Heavy-light on left */}
              <line x1="66" y1="65" x2="74" y2="65" stroke="#16a085" strokeWidth="2" />
              {/* Heavy-light on right */}
              <line x1="226" y1="65" x2="234" y2="65" stroke="#16a085" strokeWidth="2" />
            </g>

            {/* Connectors from Fab to hinge */}
            <line x1="70" y1="130" x2="110" y2="138" stroke="#999" strokeWidth="1.5" />
            <line x1="230" y1="130" x2="190" y2="138" stroke="#999" strokeWidth="1.5" />

            {/* Antigen binding sites */}
            <g className="floating" style={{ animationDelay: "0s" }}>
              <ellipse cx="52" cy="18" rx="18" ry="10" fill="#fdecea" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="52" y="22" textAnchor="middle" fontSize="7.5" fill="#c0392b" fontWeight="600">Ag</text>
            </g>
            <g className="floating" style={{ animationDelay: "1s" }}>
              <ellipse cx="248" cy="18" rx="18" ry="10" fill="#fdecea" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="248" y="22" textAnchor="middle" fontSize="7.5" fill="#c0392b" fontWeight="600">Ag</text>
            </g>

            {/* Labels */}
            <text x="14" y="52" fontSize="8" fill="#999" transform="rotate(-90, 14, 52)">Chaîne L (25 kDa)</text>
          </svg>
        </div>

        {/* Info Panel */}
        <div>
          {activePart ? (
            <div style={{ animation: "fadeUp 0.25s ease both" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: activePart.color + "15",
                  color: activePart.color,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  marginBottom: 12,
                  textTransform: "uppercase" ,
                  letterSpacing: "0.06em",
                }}
              >
                {activePart.id.toUpperCase()}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: activePart.color,
                }}
              >
                {activePart.label}
              </h4>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#374151" }}>
                {activePart.desc}
              </p>
            </div>
          ) : (
            <div style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.75 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👆</div>
              <p>Cliquez sur une région du schéma pour afficher sa description.</p>
              <div style={{ marginTop: 20 }}>
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left" ,
                      padding: "8px 12px",
                      margin: "4px 0",
                      borderRadius: 6,
                      border: "1px solid #e2ded5",
                      background: "white",
                      cursor: "pointer",
                      fontSize: 13,
                      color: p.color,
                      fontWeight: 500,
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = p.color + "10")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
