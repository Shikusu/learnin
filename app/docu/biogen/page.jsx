'use client';
import { useState } from "react";
export const dynamic = 'force-static';
import Flashcards from "@/components/StaticFlascards";
import Quiz from "@/components/StaticQuizzes";
import { OverviewMap, GlycolysisMap, KrebsCycle, RespiratoryChain, Card, Pill, Tag } from "@/components/ui/bio";
import { quizzesBio as quizzes } from "@/constants/staticQuizzes";
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
    <div className="mb-7">
      <div className="flex items-center gap-3 mb-1.5">
        <span className="text-3xl">{icon}</span>
        <h2 className="m-0 text-2xl font-black" style={{
          background: `linear-gradient(90deg,${C.text},${C.accent1})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>{children}</h2>
      </div>
      {sub && <p className="m-0 text-sm pl-10" style={{ color: C.muted }}>{sub}</p>}
    </div>
  );
}

function BilanTable() {
  const rows = [
    { phase: "Glycolyse", lieu: "Cytosol", atp: "2", nadh: "2 (cytosol)", fadh: "—", total: "2" },
    { phase: "Pyruvate → Acétyl-CoA (×2)", lieu: "Mitochondrie", atp: "—", nadh: "2", fadh: "—", total: "5" },
    { phase: "Cycle de Krebs (×2)", lieu: "Mitochondrie", atp: "2 GTP", nadh: "6", fadh: "2", total: "20" },
    { phase: "Chaîne respiratoire", lieu: "Membrane interne", atp: "voir →", nadh: "×2.5", fadh: "×1.5", total: "~30" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.border}` }}>
            {["Phase", "Lieu", "ATP direct", "NADH produit", "FADH₂ produit", "~ATP total"].map(h => (
              <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold" style={{ color: C.muted }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${C.border}33`, background: i % 2 === 0 ? C.card : "transparent" }}>
              <td className="px-3 py-2.5 font-semibold" style={{ color: C.text }}>{r.phase}</td>
              <td className="px-3 py-2.5" style={{ color: C.muted }}>{r.lieu}</td>
              <td className="px-3 py-2.5 font-bold" style={{ color: C.accent2 }}>{r.atp}</td>
              <td className="px-3 py-2.5" style={{ color: C.accent5 }}>{r.nadh}</td>
              <td className="px-3 py-2.5" style={{ color: C.accent1 }}>{r.fadh}</td>
              <td className="px-3 py-2.5 font-black text-[15px]" style={{ color: C.accent3 }}>{r.total}</td>
            </tr>
          ))}
          <tr style={{ borderTop: `2px solid ${C.border}` }}>
            <td colSpan={5} className="px-3 py-3 font-bold text-right" style={{ color: C.text }}>TOTAL (aérobiose) :</td>
            <td className="px-3 py-3 font-black text-xl" style={{ color: C.accent2 }}>30–32 ATP</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-3.5 p-3.5 rounded-xl text-xs" style={{
        background: `${C.accent4}0f`, border: `1px solid ${C.accent4}33`, color: C.muted
      }}>
        ⚠️ En <strong style={{ color: C.accent4 }}>anaérobiose</strong> : le pyruvate est réduit en <strong>lactate</strong> (muscle) ou en <strong>éthanol</strong> (levures). Bilan = seulement <strong style={{ color: C.accent4 }}>2 ATP</strong>. Le NADH cytosolique est réoxydé par cette fermentation.
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "overview",    label: "🗺 Vue globale" },
  { id: "bioenergie", label: "⚡ Bioénergie" },
  { id: "glycolyse",  label: "🔬 Glycolyse" },
  { id: "krebs",      label: "🌀 Krebs" },
  { id: "chaine",     label: "⛓ Chaîne Respi." },
  { id: "bilan",      label: "📊 Bilan ATP" },
  { id: "flashcards", label: "🃏 Flashcards" },
  { id: "quiz",       label: "📝 Quiz" },
];

export default function Bioenergetique() {
  const [section, setSection] = useState("overview");
  const [glycoStep, setGlycoStep] = useState(0);
  const [quizKey, setQuizKey] = useState("glycolyse");

  return (
    <>
      <style>{`* { box-sizing: border-box; } ${pulse}`}</style>

      <div className="min-h-screen" style={{ background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Header */}
        <div className="sticky top-0 z-100 border-b backdrop-blur-xl px-6 py-5"
          style={{ background: `linear-gradient(135deg, ${C.surface} 0%, #0c1428 100%)`, borderColor: C.border }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🧬</span>
              <h1 className="m-0 text-xl font-black" style={{
                background: `linear-gradient(90deg, ${C.accent1}, ${C.accent5})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>BIOÉNERGÉTIQUE</h1>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setSection(s.id)}
                  className="rounded-lg px-3 py-1.5 text-xs cursor-pointer transition-all duration-150 border"
                  style={{
                    background: section === s.id ? `${C.accent1}22` : "transparent",
                    borderColor: section === s.id ? C.accent1 : C.border,
                    color: section === s.id ? C.accent1 : C.muted,
                    fontWeight: section === s.id ? 700 : 400,
                    fontFamily: "inherit"
                  }}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* ── OVERVIEW ── */}
          {section === "overview" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🗺" sub="Clique sur une section du schéma pour y accéder directement">
                La grande image — vue d'ensemble
              </SectionTitle>
              <Card glow style={{ marginBottom: 24 }}>
                <OverviewMap onSection={setSection} />
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "🔬", title: "Glycolyse", desc: "1 glucose → 2 pyruvate. Cytosol. Net : 2 ATP + 2 NADH.", color: C.accent3, id: "glycolyse" },
                  { icon: "🌀", title: "Cycle de Krebs", desc: "Pyruvate → Acétyl-CoA → 6 NADH + 2 FADH₂ + 2 GTP par glucose.", color: C.accent5, id: "krebs" },
                  { icon: "⛓", title: "Chaîne Respiratoire", desc: "NADH/FADH₂ → gradient H⁺ → ATP synthase → 28-30 ATP.", color: C.accent1, id: "chaine" },
                ].map(c => (
                  <div key={c.id} onClick={() => setSection(c.id)}
                    className="rounded-2xl p-5 cursor-pointer transition-all duration-200 border"
                    style={{ background: `${c.color}10`, borderColor: `${c.color}44` }}>
                    <div className="text-3xl mb-2">{c.icon}</div>
                    <div className="font-extrabold text-base mb-1.5" style={{ color: c.color }}>{c.title}</div>
                    <div className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{c.desc}</div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <Card>
                  <Tag color={C.accent1}>Définition</Tag>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: C.text }}>
                    Branche de la biochimie qui étudie les <strong>transformations et utilisations de l'énergie</strong> au sein des organismes vivants.
                    Les cellules <span style={{ color: C.accent2 }}>produisent</span>, <span style={{ color: C.accent3 }}>stockent</span> et <span style={{ color: C.accent5 }}>utilisent</span> l'énergie principalement sous forme d'<strong style={{ color: C.accent1 }}>ATP</strong>.
                  </p>
                </Card>
                <Card style={{ background: `${C.accent1}0a` }}>
                  <Tag color={C.accent3}>L'ATP</Tag>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: C.text }}>
                    <strong>Adénosine TriPhosphate</strong> = la monnaie énergétique universelle.<br />
                    Libère de l'énergie par <span style={{ color: C.accent4 }}>hydrolyse</span> d'une liaison anhydride phosphorique (ΔG°' = -30,5 kJ/mol).
                  </p>
                </Card>
              </div>

              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent3}>Les 4 types de liaisons riches en énergie</Tag>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {[
                    { n: 1, label: "Liaison anhydride phosphorique", ex: "ATP", color: C.accent1 },
                    { n: 2, label: "Liaison anhydride d'acide", ex: "1,3-bisphosphoglycérate", color: C.accent3 },
                    { n: 3, label: "Liaison énol phosphate", ex: "Phosphoénolpyruvate (PEP)", color: C.accent5 },
                    { n: 4, label: "Liaison thioester", ex: "Acétyl-CoA", color: C.accent2 },
                  ].map(b => (
                    <div key={b.n} className="px-4 py-3 rounded-xl border"
                      style={{ background: `${b.color}14`, borderColor: `${b.color}33` }}>
                      <div className="text-[11px] font-bold mb-1" style={{ color: b.color }}>TYPE {b.n}</div>
                      <div className="text-[13px] font-semibold" style={{ color: C.text }}>{b.label}</div>
                      <div className="text-[11px] mt-1" style={{ color: C.muted }}>Ex: {b.ex}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3.5 py-2.5 rounded-lg text-xs font-bold"
                  style={{ background: `${C.accent4}10`, border: `1px solid ${C.accent4}33`, color: C.accent4 }}>
                  ΔG°' &lt; -25 kJ/mol = liaison riche en énergie
                </div>
              </Card>

              <Card>
                <Tag color={C.accent5}>Transporteurs d'électrons (oxydo-réduction)</Tag>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {[
                    { name: "NAD⁺/NADH", role: "Coenzyme des déshydrogénases. Principal porteur d'e⁻.", color: C.accent5 },
                    { name: "NADP⁺/NADPH", role: "Surtout biosynthèse (voie des pentoses).", color: C.accent5 },
                    { name: "FAD/FADH₂", role: "Coenzyme des déshydrogénases. Lié aux protéines.", color: C.accent1 },
                    { name: "CoQ / Ubiquinone", role: "Mobile dans la membrane. Relie Cpl I/II → III.", color: C.accent3 },
                    { name: "Cytochromes", role: "Protéines héminiques. Transportent e⁻ dans la chaîne.", color: C.accent2 },
                  ].map(t => (
                    <div key={t.name} className="p-3 rounded-xl border"
                      style={{ background: `${t.color}10`, borderColor: `${t.color}33` }}>
                      <div className="font-extrabold text-[13px] mb-1.5" style={{ color: t.color }}>{t.name}</div>
                      <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{t.role}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3.5 rounded-xl text-[13px]" style={{ background: C.surface, color: C.muted }}>
                  <strong style={{ color: C.text }}>Rappel oxydo-réduction :</strong><br />
                  Oxydation = perte d'e⁻ / d'H / gain O₂ &nbsp;|&nbsp; Réduction = gain d'e⁻ / d'H / perte O₂<br />
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
              <div className="flex gap-3 flex-wrap mb-6">
                <Pill val="2" label="ATP net" color={C.accent2} />
                <Pill val="2" label="NADH" color={C.accent5} />
                <Pill val="2" label="Pyruvate" color={C.accent3} />
                <Pill val="Cytosol" label="Localisation" color={C.accent1} />
              </div>
              <Card style={{ marginBottom: 20 }} glow>
                <GlycolysisMap step={glycoStep} setStep={setGlycoStep} />
              </Card>
              <Card style={{ background: `${C.accent3}08`, marginBottom: 20 }}>
                <Tag color={C.accent3}>Devenir du Pyruvate — le carrefour</Tag>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl border"
                    style={{ background: `${C.accent2}10`, borderColor: `${C.accent2}33` }}>
                    <div className="font-extrabold mb-2" style={{ color: C.accent2 }}>✅ AÉROBIOSE (avec O₂)</div>
                    <div className="text-[13px] leading-relaxed" style={{ color: C.text }}>
                      Pyruvate → <strong>Acétyl-CoA</strong> + CO₂ + NADH<br />
                      Par la <span style={{ color: C.accent3 }}>pyruvate déshydrogénase</span> (complexe multienzyme)<br />
                      → Entre dans le cycle de Krebs
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border"
                    style={{ background: `${C.accent4}10`, borderColor: `${C.accent4}33` }}>
                    <div className="font-extrabold mb-2" style={{ color: C.accent4 }}>⚠️ ANAÉROBIOSE (sans O₂)</div>
                    <div className="text-[13px] leading-relaxed" style={{ color: C.text }}>
                      <strong>Muscle :</strong> Pyruvate → Lactate (lactate déshydrogénase)<br />
                      <strong>Levures :</strong> Pyruvate → Éthanol + CO₂<br />
                      But : régénérer NAD⁺ pour que la glycolyse continue
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz glycolyse</Tag>
                <div className="mt-4"><Quiz questions={quizzes.glycolyse} /></div>
              </Card>
            </div>
          )}

          {/* ── KREBS ── */}
          {section === "krebs" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="🌀" sub="Matrice mitochondriale · 8 étapes · ×2 par glucose">
                Cycle de Krebs
              </SectionTitle>
              <div className="flex gap-3 flex-wrap mb-6">
                <Pill val="6" label="NADH (×2 tours)" color={C.accent5} />
                <Pill val="2" label="FADH₂" color={C.accent1} />
                <Pill val="2" label="GTP/ATP" color={C.accent2} />
                <Pill val="4" label="CO₂" color={C.muted} />
              </div>
              <Card style={{ marginBottom: 20 }} glow>
                <KrebsCycle />
              </Card>
              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent3}>Régulation du cycle de Krebs</Tag>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { enzyme: "Citrate synthase", reg: "Inhibée par : ATP, NADH, Acétyl-CoA↑ (rétrocontrôle)", color: C.accent4 },
                    { enzyme: "Isocitrate DH", reg: "Activée par ADP. Inhibée par ATP, NADH.", color: C.accent3 },
                    { enzyme: "α-KG DH", reg: "Inhibée par NADH, succinyl-CoA (produits).", color: C.accent5 },
                  ].map(r => (
                    <div key={r.enzyme} className="p-3.5 rounded-xl border"
                      style={{ background: `${r.color}10`, borderColor: `${r.color}33` }}>
                      <div className="font-bold text-[13px] mb-1.5" style={{ color: r.color }}>{r.enzyme}</div>
                      <div className="text-xs leading-relaxed" style={{ color: C.muted }}>{r.reg}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz Krebs</Tag>
                <div className="mt-4"><Quiz questions={quizzes.krebs} /></div>
              </Card>
            </div>
          )}

          {/* ── CHAINE RESPI ── */}
          {section === "chaine" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="⛓" sub="Membrane interne mitochondriale · Phosphorylation oxydative">
                Chaîne Respiratoire Mitochondriale
              </SectionTitle>
              <div className="flex gap-3 flex-wrap mb-6">
                <Pill val="3" label="Sites pompage H⁺" color={C.accent3} />
                <Pill val="~28" label="ATP finaux" color={C.accent1} />
                <Pill val="H₂O" label="Produit final" color={C.accent2} />
              </div>
              <Card glow style={{ marginBottom: 20 }}>
                <RespiratoryChain />
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <Card style={{ background: `${C.accent1}08` }}>
                  <Tag color={C.accent1}>Théorie chimiosmotique de Mitchell</Tag>
                  <ol className="pl-4 text-[13px] leading-loose mt-3" style={{ color: C.muted }}>
                    <li>Les Cpl I, III, IV pompent <strong style={{ color: C.accent3 }}>H⁺</strong> vers l'espace intermembranaire</li>
                    <li>Création d'un <strong style={{ color: C.accent3 }}>gradient de protons</strong> (ΔpH + ΔΨ)</li>
                    <li>H⁺ reviennent dans la matrice via le canal <strong style={{ color: C.accent1 }}>F₀</strong></li>
                    <li>Le flux fait tourner <strong style={{ color: C.accent1 }}>F₁</strong> → synthèse d'ATP</li>
                  </ol>
                </Card>
                <Card>
                  <Tag color={C.accent4}>Inhibiteurs — EXAM !</Tag>
                  <div className="flex flex-col gap-2 mt-3">
                    {[
                      { drug: "Roténone", site: "Complexe I", meca: "Bloque NADH-CoQ réductase", type: "inhibiteur" },
                      { drug: "Antimycine A", site: "Complexe III", meca: "Bloque transfert e⁻ Cyt b → c₁", type: "inhibiteur" },
                      { drug: "Cyanure / CO", site: "Complexe IV", meca: "Se lie à l'hème a₃, bloque O₂", type: "inhibiteur" },
                      { drug: "Oligomycine", site: "Complexe V (F₀)", meca: "Bloque canal protonique", type: "inhibiteur" },
                      { drug: "DNP / Arséniate", site: "Membrane", meca: "DÉCOUPLANT — dissipe gradient H⁺", type: "decouplant" },
                    ].map(d => (
                      <div key={d.drug} className="flex gap-2.5 items-start px-2.5 py-2 rounded-lg border"
                        style={{
                          background: d.type === "decouplant" ? `${C.accent3}12` : `${C.accent4}0a`,
                          borderColor: d.type === "decouplant" ? `${C.accent3}33` : `${C.accent4}33`
                        }}>
                        <span className="font-extrabold text-[13px] min-w-25"
                          style={{ color: d.type === "decouplant" ? C.accent3 : C.accent4 }}>{d.drug}</span>
                        <span className="text-xs" style={{ color: C.muted }}>→ {d.site} : {d.meca}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <Card style={{ marginBottom: 20 }}>
                <Tag color={C.accent5}>Navettes de transport (NADH cytosolique)</Tag>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3.5">
                  <div className="p-3.5 rounded-xl border"
                    style={{ background: `${C.accent5}10`, borderColor: `${C.accent5}33` }}>
                    <div className="font-bold mb-1.5" style={{ color: C.accent5 }}>Navette Malate-Aspartate</div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      Foie, rein, cœur<br />Enzyme : L-malate déshydrogénase<br />
                      <strong style={{ color: C.accent2 }}>→ équivalent NADH mitochondrial = 2.5 ATP</strong>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border"
                    style={{ background: `${C.accent1}10`, borderColor: `${C.accent1}33` }}>
                    <div className="font-bold mb-1.5" style={{ color: C.accent1 }}>Navette Glycérol Phosphate</div>
                    <div className="text-xs" style={{ color: C.muted }}>
                      Muscle, cerveau<br />Enzyme : Glycérol-P déshydrogénase<br />
                      <strong style={{ color: C.accent3 }}>→ équivalent FADH₂ = 1.5 ATP seulement</strong>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <Tag color={C.accent5}>Mini-Quiz Chaîne Respiratoire</Tag>
                <div className="mt-4"><Quiz questions={quizzes.chaine} /></div>
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
                <BilanTable />
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card style={{ background: `${C.accent2}08` }}>
                  <Tag color={C.accent2}>Aérobiose — 32–34 ATP</Tag>
                  <div className="flex flex-col gap-2 mt-3.5 text-[13px]">
                    {[
                      ["Glycolyse", "2 ATP net", C.accent3],
                      ["Pyruvate → Acétyl-CoA (×2)", "2 NADH → 5 ATP", C.accent5],
                      ["Krebs × 2", "6 NADH + 2 FADH₂ + 2 GTP → ~20 ATP", C.accent5],
                      ["NADH cytosol (navettes)", "2 NADH → 3–5 ATP selon tissu", C.accent1],
                    ].map(([label, val, col]) => (
                      <div key={label} className="flex justify-between px-2.5 py-1.5 rounded-lg"
                        style={{ background: `${col}10` }}>
                        <span style={{ color: C.muted }}>{label}</span>
                        <span className="font-bold" style={{ color: col }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card style={{ background: `${C.accent4}08` }}>
                  <Tag color={C.accent4}>Anaérobiose — seulement 2 ATP</Tag>
                  <div className="text-[13px] leading-relaxed mt-3.5" style={{ color: C.muted }}>
                    <strong style={{ color: C.text }}>Pourquoi si peu ?</strong><br />
                    Sans O₂, la chaîne respiratoire s'arrête → NADH ne peut pas être réoxydé → glycolyse bloquée.<br /><br />
                    <strong style={{ color: C.accent4 }}>Solution de secours :</strong> fermentation lactique (muscle) ou alcoolique (levure) pour régénérer NAD⁺ et permettre à la glycolyse de continuer.<br /><br />
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
              <Flashcards />
            </div>
          )}

          {/* ── QUIZ ── */}
          {section === "quiz" && (
            <div style={{ animation: "slide-up .3s ease" }}>
              <SectionTitle icon="📝" sub="Teste tes connaissances par chapitre">
                Quiz interactifs
              </SectionTitle>
              <div className="flex gap-2.5 flex-wrap mb-6">
                {Object.keys(quizzes).map(k => (
                  <button key={k} onClick={() => setQuizKey(k)}
                    className="rounded-lg px-4 py-2 cursor-pointer border transition-all duration-150"
                    style={{
                      background: quizKey === k ? `${C.accent1}22` : C.card,
                      borderColor: quizKey === k ? C.accent1 : C.border,
                      color: quizKey === k ? C.accent1 : C.muted,
                      fontWeight: quizKey === k ? 700 : 400,
                      fontFamily: "inherit"
                    }}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
                ))}
              </div>
              <Card glow className="max-w-xl">
                <Quiz key={quizKey} questions={quizzes[quizKey]} />
              </Card>
            </div>
          )}

        </div>
      </div>
    </>
  );
}