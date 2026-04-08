'use client';
import { useState} from "react";
export const dynamic = 'force-static';
import Flashcards from "@/components/StaticFlascards";
import Quiz from "@/components/StaticQuizzes";
import { OverviewMap,GlycolysisMap, KrebsCycle, RespiratoryChain, Card, Pill, Tag} from "@/components/ui/bio";
import { quizzesBio as quizzes }  from "@/constants/staticQuizzes";
import { flashcardsBio as flashcards } from "@/constants/staticFiches";
import { C } from "@/constants/colors";
const pulse = `
@keyframes pulse-glow{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes flow-right{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@keyframes rotate-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes bounce-in{0%{transform:scale(.6);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes slide-up{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
`;

function SectionTitle({ icon, children, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900,
          background: `linear-gradient(90deg,${C.text},${C.accent1})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{children}</h2>
      </div>
      {sub && <p style={{ margin: 0, color: C.muted, fontSize: 14, paddingLeft: 40 }}>{sub}</p>}
    </div>
  );
}

// ─── BILAN TABLE ─────────────────────────────────────────────────────────────
function BilanTable() {
  const rows = [
    { phase: "Glycolyse", lieu: "Cytosol", atp: "2", nadh: "2 (cytosol)", fadh: "—", total: "2" },
    { phase: "Pyruvate → Acétyl-CoA (×2)", lieu: "Mitochondrie", atp: "—", nadh: "2", fadh: "—", total: "5" },
    { phase: "Cycle de Krebs (×2)", lieu: "Mitochondrie", atp: "2 GTP", nadh: "6", fadh: "2", total: "20" },
    { phase: "Chaîne respiratoire", lieu: "Membrane interne", atp: "voir →", nadh: "×2.5", fadh: "×1.5", total: "~30" },
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            {["Phase", "Lieu", "ATP direct", "NADH produit", "FADH₂ produit", "~ATP total"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}33`, background: i % 2 === 0 ? `${C.card}` : "transparent" }}>
              <td style={{ padding: "10px 12px", color: C.text, fontWeight: 600 }}>{r.phase}</td>
              <td style={{ padding: "10px 12px", color: C.muted }}>{r.lieu}</td>
              <td style={{ padding: "10px 12px", color: C.accent2, fontWeight: 700 }}>{r.atp}</td>
              <td style={{ padding: "10px 12px", color: C.accent5 }}>{r.nadh}</td>
              <td style={{ padding: "10px 12px", color: C.accent1 }}>{r.fadh}</td>
              <td style={{ padding: "10px 12px", color: C.accent3, fontWeight: 900, fontSize: 15 }}>{r.total}</td>
            </tr>
          ))}
          <tr style={{ borderTop: `2px solid ${C.border}` }}>
            <td colSpan={5} style={{ padding: "12px", color: C.text, fontWeight: 700, textAlign: "right" }}>TOTAL (aérobiose) :</td>
            <td style={{ padding: "12px", color: C.accent2, fontWeight: 900, fontSize: 20 }}>30–32 ATP</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 14, padding: 14, background: `${C.accent4}0f`, border: `1px solid ${C.accent4}33`, borderRadius: 10, fontSize: 12, color: C.muted }}>
        ⚠️ En <strong style={{ color: C.accent4 }}>anaérobiose</strong> : le pyruvate est réduit en <strong>lactate</strong> (muscle) ou en <strong>éthanol</strong> (levures). Bilan = seulement <strong style={{ color: C.accent4 }}>2 ATP</strong>. Le NADH cytosolique est réoxydé par cette fermentation.
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "overview", label: "🗺 Vue globale", icon: "🗺" },
  { id: "bioenergie", label: "⚡ Bioénergie", icon: "⚡" },
  { id: "glycolyse", label: "🔬 Glycolyse", icon: "🔬" },
  { id: "krebs", label: "🌀 Krebs", icon: "🌀" },
  { id: "chaine", label: "⛓ Chaîne Respi.", icon: "⛓" },
  { id: "bilan", label: "📊 Bilan ATP", icon: "📊" },
  { id: "flashcards", label: "🃏 Flashcards", icon: "🃏" },
  { id: "quiz", label: "📝 Quiz", icon: "📝" },
];

export default function Bioenergetique() {
  const [section, setSection] = useState("overview");
  const [glycoStep, setGlycoStep] = useState(0);
  const [quizKey, setQuizKey] = useState("glycolyse");

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; color: ${C.text}; font-family: 'Segoe UI', system-ui, sans-serif; }
        ${pulse}
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.surface} 0%, #0c1428 100%)`,
          borderBottom: `1px solid ${C.border}`,
          padding: "24px 32px",
          position: "sticky", top: 0, zIndex: 100,
          backdropFilter: "blur(12px)"
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 28 }}>🧬</div>
                  <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900,
                      background: `linear-gradient(90deg, ${C.accent1}, ${C.accent5})`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      BIOÉNERGÉTIQUE
                    </h1>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>L2 Médecine — Dr FENOMANANA Jocia</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {SECTIONS.map(s => (
                  <button key={s.id} onClick={() => setSection(s.id)} style={{
                    background: section === s.id ? `${C.accent1}22` : "transparent",
                    border: `1px solid ${section === s.id ? C.accent1 : C.border}`,
                    color: section === s.id ? C.accent1 : C.muted,
                    borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                    fontSize: 12, fontWeight: section === s.id ? 700 : 400,
                    transition: "all .15s", fontFamily: "inherit"
                  }}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

          {/* ── OVERVIEW ── */}
          {section === "overview" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🗺" sub="Clique sur une section du schéma pour y accéder directement">
                La grande image — vue d'ensemble
              </SectionTitle>
              <Card glow style={{ marginBottom: 24 }}>
                <p style={{ color: C.muted, fontSize: 14, marginTop: 0 }}>
                  <strong style={{ color: C.text }}>Ta compréhension actuelle :</strong> "le glucose est coupé en deux, puis en présence d'O₂ le NAD devient NADH qui donne des protons à une ATP synthase..."
                  <span style={{ color: C.accent2 }}> → C'est exactement ça ! Tu as le fil conducteur. Voici la carte complète :</span>
                </p>
                <OverviewMap onSection={setSection}/>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {[
                  { icon: "🔬", title: "Glycolyse", desc: "1 glucose → 2 pyruvate. Cytosol. Net : 2 ATP + 2 NADH.", color: C.accent3, id: "glycolyse" },
                  { icon: "🌀", title: "Cycle de Krebs", desc: "Pyruvate → Acétyl-CoA → 6 NADH + 2 FADH₂ + 2 GTP par glucose.", color: C.accent5, id: "krebs" },
                  { icon: "⛓", title: "Chaîne Respiratoire", desc: "NADH/FADH₂ → gradient H⁺ → ATP synthase → 28-30 ATP.", color: C.accent1, id: "chaine" },
                ].map(c => (
                  <div key={c.id} onClick={() => setSection(c.id)} style={{
                    background: `${c.color}10`, border: `1px solid ${c.color}44`, borderRadius: 14,
                    padding: 20, cursor: "pointer", transition: "all .2s"
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontWeight: 800, color: c.color, fontSize: 16, marginBottom: 6 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BIOENERGIE ── */}
          {section === "bioenergie" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="⚡" sub="Les fondations — comprendre l'énergie cellulaire">
                Notions générales de Bioénergétique
              </SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <Card>
                  <Tag color={C.accent1}>Définition</Tag>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginTop: 12 }}>
                    Branche de la biochimie qui étudie les <strong>transformations et utilisations de l'énergie</strong> au sein des organismes vivants.
                    Les cellules <span style={{ color: C.accent2 }}>produisent</span>, <span style={{ color: C.accent3 }}>stockent</span> et <span style={{ color: C.accent5 }}>utilisent</span> l'énergie principalement sous forme d'<strong style={{ color: C.accent1 }}>ATP</strong>.
                  </p>
                </Card>
                <Card style={{ background: `${C.accent1}0a` }}>
                  <Tag color={C.accent3}>L'ATP</Tag>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, marginTop: 12 }}>
                    <strong>Adénosine TriPhosphate</strong> = la monnaie énergétique universelle.<br/>
                    Libère de l'énergie par <span style={{ color: C.accent4 }}>hydrolyse</span> d'une liaison anhydride phosphorique (ΔG°' = -30,5 kJ/mol).
                  </p>
                </Card>
              </div>

              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent3}>Les 4 types de liaisons riches en énergie</Tag>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 16 }}>
                  {[
                    { n: 1, label: "Liaison anhydride phosphorique", ex: "ATP", color: C.accent1 },
                    { n: 2, label: "Liaison anhydride d'acide", ex: "1,3-bisphosphoglycérate", color: C.accent3 },
                    { n: 3, label: "Liaison énol phosphate", ex: "Phosphoénolpyruvate (PEP)", color: C.accent5 },
                    { n: 4, label: "Liaison thioester", ex: "Acétyl-CoA", color: C.accent2 },
                  ].map(b => (
                    <div key={b.n} style={{ padding: "12px 16px", background: `${b.color}14`,
                      border: `1px solid ${b.color}33`, borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: b.color, fontWeight: 700, marginBottom: 4 }}>TYPE {b.n}</div>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Ex: {b.ex}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "10px 14px", background: `${C.accent4}10`,
                  border: `1px solid ${C.accent4}33`, borderRadius: 8, fontSize: 12, color: C.accent4, fontWeight: 700 }}>
                  ΔG°' &lt; -25 kJ/mol = liaison riche en énergie
                </div>
              </Card>

              <Card>
                <Tag color={C.accent5}>Transporteurs d'électrons (oxydo-réduction)</Tag>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 16 }}>
                  {[
                    { name: "NAD⁺/NADH", role: "Coenzyme des déshydrogénases. Principal porteur d'e⁻.", color: C.accent5 },
                    { name: "NADP⁺/NADPH", role: "Surtout biosynthèse (voie des pentoses).", color: C.accent5 },
                    { name: "FAD/FADH₂", role: "Coenzyme des déshydrogénases. Lié aux protéines.", color: C.accent1 },
                    { name: "CoQ / Ubiquinone", role: "Mobile dans la membrane. Relie Cpl I/II → III.", color: C.accent3 },
                    { name: "Cytochromes", role: "Protéines héminiques. Transportent e⁻ dans la chaîne.", color: C.accent2 },
                  ].map(t => (
                    <div key={t.name} style={{ padding: "12px", background: `${t.color}10`,
                      border: `1px solid ${t.color}33`, borderRadius: 10 }}>
                      <div style={{ fontWeight: 800, color: t.color, fontSize: 13, marginBottom: 6 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{t.role}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: 14, background: `${C.surface}`, borderRadius: 10, fontSize: 13, color: C.muted }}>
                  <strong style={{ color: C.text }}>Rappel oxydo-réduction :</strong><br/>
                  Oxydation = perte d'e⁻ / d'H / gain O₂ &nbsp;|&nbsp; Réduction = gain d'e⁻ / d'H / perte O₂<br/>
                  <em>« LEO dit GER »</em> — Loss of Electrons = Oxidation; Gain of Electrons = Reduction
                </div>
              </Card>
            </div>
          )}

          {/* ── GLYCOLYSE ── */}
          {section === "glycolyse" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🔬" sub="Cytosol · 10 étapes · Net : 2 ATP + 2 NADH">
                Glycolyse — Dégradation du glucose
              </SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <Pill val="2" label="ATP net" color={C.accent2}/>
                <Pill val="2" label="NADH" color={C.accent5}/>
                <Pill val="2" label="Pyruvate" color={C.accent3}/>
                <Pill val="Cytosol" label="Localisation" color={C.accent1}/>
              </div>
              <Card style={{ marginBottom: 20 }} glow>
                <GlycolysisMap step={glycoStep} setStep={setGlycoStep}/>
              </Card>
              <Card style={{ background: `${C.accent3}08`, marginBottom: 20 }}>
                <Tag color={C.accent3}>Devenir du Pyruvate — le carrefour</Tag>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                  <div style={{ padding: 16, background: `${C.accent2}10`, border: `1px solid ${C.accent2}33`, borderRadius: 12 }}>
                    <div style={{ color: C.accent2, fontWeight: 800, marginBottom: 8 }}>✅ AÉROBIOSE (avec O₂)</div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                      Pyruvate → <strong>Acétyl-CoA</strong> + CO₂ + NADH<br/>
                      Par la <span style={{ color: C.accent3 }}>pyruvate déshydrogénase</span> (complexe multienzyme)<br/>
                      → Entre dans le cycle de Krebs
                    </div>
                  </div>
                  <div style={{ padding: 16, background: `${C.accent4}10`, border: `1px solid ${C.accent4}33`, borderRadius: 12 }}>
                    <div style={{ color: C.accent4, fontWeight: 800, marginBottom: 8 }}>⚠️ ANAÉROBIOSE (sans O₂)</div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                      <strong>Muscle :</strong> Pyruvate → Lactate (lactate déshydrogénase)<br/>
                      <strong>Levures :</strong> Pyruvate → Éthanol + CO₂<br/>
                      But : régénérer NAD⁺ pour que la glycolyse continue
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz glycolyse</Tag>
                <div style={{ marginTop: 16 }}><Quiz questions={quizzes.glycolyse}/></div>
              </Card>
            </div>
          )}

          {/* ── KREBS ── */}
          {section === "krebs" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🌀" sub="Matrice mitochondriale · 8 étapes · ×2 par glucose">
                Cycle de Krebs
              </SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <Pill val="6" label="NADH (×2 tours)" color={C.accent5}/>
                <Pill val="2" label="FADH₂" color={C.accent1}/>
                <Pill val="2" label="GTP/ATP" color={C.accent2}/>
                <Pill val="4" label="CO₂" color={C.muted}/>
              </div>
              <Card style={{ marginBottom: 20 }} glow>
                <KrebsCycle/>
              </Card>
              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent3}>Régulation du cycle de Krebs</Tag>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
                  {[
                    { enzyme: "Citrate synthase", reg: "Inhibée par : ATP, NADH, Acétyl-CoA↑ (rétrocontrôle)", color: C.accent4 },
                    { enzyme: "Isocitrate DH", reg: "Activée par ADP. Inhibée par ATP, NADH.", color: C.accent3 },
                    { enzyme: "α-KG DH", reg: "Inhibée par NADH, succinyl-CoA (produits).", color: C.accent5 },
                  ].map(r => (
                    <div key={r.enzyme} style={{ padding: 14, background: `${r.color}10`,
                      border: `1px solid ${r.color}33`, borderRadius: 10 }}>
                      <div style={{ fontWeight: 700, color: r.color, fontSize: 13, marginBottom: 6 }}>{r.enzyme}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{r.reg}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz Krebs</Tag>
                <div style={{ marginTop: 16 }}><Quiz questions={quizzes.krebs}/></div>
              </Card>
            </div>
          )}

          {/* ── CHAINE RESPI ── */}
          {section === "chaine" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="⛓" sub="Membrane interne mitochondriale · Phosphorylation oxydative">
                Chaîne Respiratoire Mitochondriale
              </SectionTitle>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                <Pill val="3" label="Sites pompage H⁺" color={C.accent3}/>
                <Pill val="~28" label="ATP finaux" color={C.accent1}/>
                <Pill val="H₂O" label="Produit final" color={C.accent2}/>
              </div>
              <Card glow style={{ marginBottom: 20 }}>
                <RespiratoryChain/>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <Card style={{ background: `${C.accent1}08` }}>
                  <Tag color={C.accent1}>Théorie chimiosmotique de Mitchell</Tag>
                  <ol style={{ paddingLeft: 18, color: C.muted, fontSize: 13, lineHeight: 2, marginTop: 12 }}>
                    <li>Les Cpl I, III, IV pompent <strong style={{ color: C.accent3 }}>H⁺</strong> vers l'espace intermembranaire</li>
                    <li>Création d'un <strong style={{ color: C.accent3 }}>gradient de protons</strong> (ΔpH + ΔΨ)</li>
                    <li>H⁺ reviennent dans la matrice via le canal <strong style={{ color: C.accent1 }}>F₀</strong></li>
                    <li>Le flux fait tourner <strong style={{ color: C.accent1 }}>F₁</strong> → synthèse d'ATP</li>
                  </ol>
                </Card>
                <Card>
                  <Tag color={C.accent4}>Inhibiteurs — EXAM !</Tag>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                    {[
                      { drug: "Roténone", site: "Complexe I", meca: "Bloque NADH-CoQ réductase", type: "inhibiteur" },
                      { drug: "Antimycine A", site: "Complexe III", meca: "Bloque transfert e⁻ Cyt b → c₁", type: "inhibiteur" },
                      { drug: "Cyanure / CO", site: "Complexe IV", meca: "Se lie à l'hème a₃, bloque O₂", type: "inhibiteur" },
                      { drug: "Oligomycine", site: "Complexe V (F₀)", meca: "Bloque canal protonique", type: "inhibiteur" },
                      { drug: "DNP / Arséniate", site: "Membrane", meca: "DÉCOUPLANT — dissipe gradient H⁺", type: "decouplant" },
                    ].map(d => (
                      <div key={d.drug} style={{ display: "flex", gap: 10, alignItems: "start",
                        padding: "8px 10px", borderRadius: 8,
                        background: d.type === "decouplant" ? `${C.accent3}12` : `${C.accent4}0a`,
                        border: `1px solid ${d.type === "decouplant" ? C.accent3 : C.accent4}33` }}>
                        <span style={{ color: d.type === "decouplant" ? C.accent3 : C.accent4, fontWeight: 800, fontSize: 13, minWidth: 100 }}>{d.drug}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>→ {d.site} : {d.meca}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent5}>Navettes de transport (NADH cytosolique)</Tag>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
                  <div style={{ padding: 14, background: `${C.accent5}10`, borderRadius: 10, border: `1px solid ${C.accent5}33` }}>
                    <div style={{ fontWeight: 700, color: C.accent5, marginBottom: 6 }}>Navette Malate-Aspartate</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Foie, rein, cœur<br/>Enzyme : L-malate déshydrogénase<br/><strong style={{ color: C.accent2 }}>→ équivalent NADH mitochondrial = 2.5 ATP</strong></div>
                  </div>
                  <div style={{ padding: 14, background: `${C.accent1}10`, borderRadius: 10, border: `1px solid ${C.accent1}33` }}>
                    <div style={{ fontWeight: 700, color: C.accent1, marginBottom: 6 }}>Navette Glycérol Phosphate</div>
                    <div style={{ fontSize: 12, color: C.muted }}>Muscle, cerveau<br/>Enzyme : Glycérol-P déshydrogénase<br/><strong style={{ color: C.accent3 }}>→ équivalent FADH₂ = 1.5 ATP seulement</strong></div>
                  </div>
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz Chaîne Respiratoire</Tag>
                <div style={{ marginTop: 16 }}><Quiz questions={quizzes.chaine}/></div>
              </Card>
            </div>
          )}

          {/* ── BILAN ── */}
          {section === "bilan" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="📊" sub="Aérobiose vs Anaérobiose">
                Bilan énergétique complet
              </SectionTitle>
              <Card glow style={{ marginBottom: 24 }}>
                <BilanTable/>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Card style={{ background: `${C.accent2}08` }}>
                  <Tag color={C.accent2}>Aérobiose — 32–34 ATP</Tag>
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    {[
                      ["Glycolyse", "2 ATP net", C.accent3],
                      ["Pyruvate → Acétyl-CoA (×2)", "2 NADH → 5 ATP", C.accent5],
                      ["Krebs × 2", "6 NADH + 2 FADH₂ + 2 GTP → ~20 ATP", C.accent5],
                      ["NADH cytosol (navettes)", "2 NADH → 3–5 ATP selon tissu", C.accent1],
                    ].map(([label, val, col]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between",
                        padding: "6px 10px", background: `${col}10`, borderRadius: 8 }}>
                        <span style={{ color: C.muted }}>{label}</span>
                        <span style={{ color: col, fontWeight: 700 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ background: `${C.accent4}08` }}>
                  <Tag color={C.accent4}>Anaérobiose — seulement 2 ATP</Tag>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, marginTop: 14 }}>
                    <strong style={{ color: C.text }}>Pourquoi si peu ?</strong><br/>
                    Sans O₂, la chaîne respiratoire s'arrête → NADH ne peut pas être réoxydé → glycolyse bloquée.<br/><br/>
                    <strong style={{ color: C.accent4 }}>Solution de secours :</strong> fermentation lactique (muscle) ou alcoolique (levure) pour régénérer NAD⁺ et permettre à la glycolyse de continuer.<br/><br/>
                    Résultat : seulement les 2 ATP de la glycolyse sont disponibles.
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── FLASHCARDS ── */}
          {section === "flashcards" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🃏" sub="Révision rapide — retourne la carte pour voir la réponse">
                Flashcards de révision
              </SectionTitle>
              <Flashcards/>
            </div>
          )}

          {/* ── QUIZ ── */}
          {section === "quiz" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="📝" sub="Teste tes connaissances par chapitre">
                Quiz interactifs
              </SectionTitle>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {Object.keys(quizzes).map(k => (
                  <button key={k} onClick={() => setQuizKey(k)} style={{
                    background: quizKey === k ? `${C.accent1}22` : C.card,
                    border: `1px solid ${quizKey === k ? C.accent1 : C.border}`,
                    color: quizKey === k ? C.accent1 : C.muted,
                    borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                    fontWeight: quizKey === k ? 700 : 400, fontFamily: "inherit"
                  }}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
                ))}
              </div>
              <Card glow style={{ maxWidth: 600 }}>
                <Quiz key={quizKey} questions={quizzes[quizKey]}/>
              </Card>
            </div>
          )}

        </div>
      </div>
    </>
  );
}