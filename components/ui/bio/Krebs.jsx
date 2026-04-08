import { useState } from "react";
import {Card} from "./Card";
import { C } from "@/constants/colors";
import { Tag } from "./Tag";
export function KrebsCycle() {
  const [active, setActive] = useState(null);
  const cx = 200, cy = 170, r = 120;
  const steps = [
    { label: "Acétyl-CoA\n+ Oxaloacétate", product: "Citrate (6C)", enzyme: "Citrate synthase", color: C.accent3 },
    { label: "Citrate", product: "Isocitrate (6C)", enzyme: "Aconitase", color: C.muted },
    { label: "Isocitrate", product: "α-cétoglutarate (5C)", enzyme: "Isocitrate DH", extra: "+NADH +CO₂", color: C.accent5 },
    { label: "α-cétoglutarate", product: "Succinyl-CoA (4C)", enzyme: "α-KG DH", extra: "+NADH +CO₂", color: C.accent5 },
    { label: "Succinyl-CoA", product: "Succinate (4C)", enzyme: "Succinyl-CoA synthétase", extra: "+GTP", color: C.accent2 },
    { label: "Succinate", product: "Fumarate (4C)", enzyme: "Succinate DH", extra: "+FADH₂", color: C.accent1 },
    { label: "Fumarate", product: "Malate (4C)", enzyme: "Fumarase", color: C.muted },
    { label: "Malate", product: "Oxaloacétate (4C)", enzyme: "Malate DH", extra: "+NADH", color: C.accent5 },
  ];
  const n = steps.length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
      <svg viewBox="0 0 400 340" style={{ width: "100%" }}>
        {/* Circle path arrows */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="1" strokeDasharray="4,3"/>
        {steps.map((s, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          const isActive = active === i;
          return (
            <g key={i} style={{ cursor: "pointer" }} onClick={() => setActive(isActive ? null : i)}>
              <circle cx={x} cy={y} r={isActive ? 20 : 15}
                fill={isActive ? s.color : `${s.color}33`}
                stroke={s.color} strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "all .2s" }}/>
              <text x={x} y={y + 4} fill={isActive ? "#fff" : s.color}
                fontSize="11" textAnchor="middle" fontWeight="900">{i + 1}</text>
            </g>
          );
        })}
        {/* Center label */}
        <text x={cx} y={cy - 10} fill={C.muted} fontSize="11" textAnchor="middle">CYCLE</text>
        <text x={cx} y={cy + 6} fill={C.accent5} fontSize="14" textAnchor="middle" fontWeight="900">KREBS</text>
        <text x={cx} y={cy + 22} fill={C.muted} fontSize="9" textAnchor="middle">× 2 / glucose</text>

        {/* Bilan */}
        <text x="310" y="30" fill={C.text} fontSize="12" fontWeight="700">Par tour :</text>
        {[["3 NADH", C.accent5], ["1 FADH₂", C.accent1], ["1 GTP", C.accent2], ["2 CO₂", C.muted]].map(([t, c], i) => (
          <text key={i} x="310" y={48 + i * 16} fill={c} fontSize="11">{t}</text>
        ))}
        <line x1="300" y1="130" x2="380" y2="130" stroke={C.border} strokeWidth="1"/>
        <text x="310" y="144" fill={C.accent3} fontSize="11" fontWeight="700">× 2 tours =</text>
        <text x="310" y="160" fill={C.accent5} fontSize="11">6 NADH</text>
        <text x="310" y="175" fill={C.accent1} fontSize="11">2 FADH₂</text>
        <text x="310" y="190" fill={C.accent2} fontSize="11">2 GTP</text>
        <text x="310" y="205" fill={C.muted} fontSize="11">4 CO₂</text>
      </svg>

      {/* Detail panel */}
      <div>
        {active !== null ? (
          <div style={{ animation: "slide-up .2s ease" }}>
            <Card glow>
              <Tag color={steps[active].color}>Étape {active + 1}</Tag>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: "10px 0 4px" }}>
                {steps[active].label.replace("\n", " ")}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
                → <span style={{ color: steps[active].color }}>{steps[active].product}</span>
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>Enzyme : <span style={{ color: C.text }}>{steps[active].enzyme}</span></div>
              {steps[active].extra && (
                <div style={{ marginTop: 12, padding: "8px 14px", background: `${steps[active].color}18`,
                  borderRadius: 8, color: steps[active].color, fontWeight: 700 }}>
                  ✅ {steps[active].extra}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>☝️</div>
            <div style={{ color: C.muted, fontSize: 14 }}>Clique sur un numéro du cycle pour voir le détail de chaque étape</div>
          </Card>
        )}

        {/* Key concept */}
        <Card style={{ marginTop: 16, background: `${C.accent5}0a` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent5, marginBottom: 8 }}>💡 À RETENIR</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            Le pyruvate est d'abord transformé en <span style={{ color: C.accent3 }}>Acétyl-CoA</span> (+ NADH + CO₂) par la <strong>pyruvate déshydrogénase</strong>, <em>avant</em> d'entrer dans le cycle.
            Le cycle ne produit pas directement beaucoup d'ATP — il charge les <span style={{ color: C.accent5 }}>porteurs d'électrons</span> (NADH, FADH₂) qui alimenteront la chaîne respiratoire.
          </div>
        </Card>
      </div>
    </div>
  );
}

