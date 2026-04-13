"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ModuleMeta, MODULES } from "@/data/modules";
import KeyConcepts from "@/components/KeyConcepts";
import Flashcards from "@/components/Flashcards";

const IgDiagram = dynamic(() => import("@/components/IgDiagram"), {
  ssr: false,
});
const ComplementDiagram = dynamic(
  () => import("@/components/ComplementDiagram"),
  { ssr: false }
);
const HLADiagram = dynamic(() => import("@/components/HLADiagram"), {
  ssr: false,
});
const PhagocytosisDiagram = dynamic(
  () => import("@/components/PhagocytosisDiagram"),
  { ssr: false }
);
const CytokineDiagram = dynamic(
  () => import("@/components/CytokineDiagram"),
  { ssr: false }
);
const ImmuneResponseDiagram = dynamic(
  () => import("@/components/ImmuneResponseDiagram"),
  { ssr: false }
);


const DIAGRAMS = {
  immunoglobulines: IgDiagram,
  complement: ComplementDiagram,
  hla: HLADiagram,
  innee: PhagocytosisDiagram,
  cytokines: CytokineDiagram,
  reponse: ImmuneResponseDiagram,
  acquise: ImmuneResponseDiagram,
};

const TABS = [
  { id: "cours", label: "📖 Cours", icon: "📖" },
  { id: "schema", label: "🔬 Schéma", icon: "🔬" },
  { id: "fiches", label: "🃏 Fiches", icon: "🃏" },
];

export default function ModuleClient({ meta, content, flashcards }) {
  const [tab, setTab] = useState("cours");
  const DiagramComponent = DIAGRAMS[meta.slug];
  const hasDiagram = !!DiagramComponent;
  const hasFlashcards = flashcards.length > 0;

  const activeTabs = TABS.filter((t) => {
    if (t.id === "schema" && !hasDiagram) return false;
    if (t.id === "fiches" && !hasFlashcards) return false;
    return true;
  });

  const modIndex = MODULES.findIndex((m) => m.slug === meta.slug);
  const prevMod = MODULES[modIndex - 1];
  const nextMod = MODULES[modIndex + 1];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Top nav */}
      <nav
        style={{
          background: "white",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 56,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          href="/docu/immuno"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--text-muted)",
            fontSize: 13,
            fontWeight: 500,
            transition: "color 0.15s",
          }}
        >
          <span>←</span> ImmunoGuide
        </Link>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: meta.color }}>
          {meta.icon} {meta.name}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {prevMod && (
            <Link
              href={`/docu/immuno/modules/${prevMod.slug}`}
              style={{
                fontSize: 12,
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--text-muted)",
                background: "white",
              }}
            >
              ← {prevMod.icon}
            </Link>
          )}
          {nextMod && (
            <Link
              href={`/docu/immuno/modules/${nextMod.slug}`}
              style={{
                fontSize: 12,
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "var(--text-muted)",
                background: "white",
              }}
            >
              {nextMod.icon} →
            </Link>
          )}
        </div>
      </nav>

      {/* Module hero */}
      <header
        style={{
          background: `linear-gradient(135deg, ${meta.color}12 0%, ${meta.bg} 60%, var(--bg) 100%)`,
          borderBottom: "1px solid var(--border)",
          padding: "40px 32px 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                background: meta.bg,
                border: `2px solid ${meta.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
              }}
            >
              {meta.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: meta.color,
                    background: meta.bg,
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontWeight: 600,
                    border: `1px solid ${meta.color}25`,
                  }}
                >
                  Module {MODULES.findIndex((m) => m.slug === meta.slug) + 1} /{" "}
                  {MODULES.length}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#6b7280",
                    background: "white",
                    padding: "3px 10px",
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                  }}
                >
                  {meta.slideCount} diapositives
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 4vw, 36px)",
                  fontWeight: 800,
                  marginBottom: 8,
                  lineHeight: 1.15,
                }}
              >
                {meta.name}
              </h1>
              <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 16 }}>
                {meta.subtitle}
              </p>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
              >
                {meta.topics.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: meta.bg,
                      color: meta.color,
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
        }}
      >
        <div
          style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 4 }}
        >
          {activeTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "14px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: tab === t.id ? meta.color : "#6b7280",
                borderBottom: `2px solid ${
                  tab === t.id ? meta.color : "transparent"
                }`,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px 80px" }}
      >
        {/* COURS TAB */}
        {tab === "cours" && content && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <KeyConcepts sections={content.sections} color={meta.color} />
          </div>
        )}

        {/* SCHEMA TAB */}
        {tab === "schema" && hasDiagram && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div
              style={{
                marginBottom: 24,
                padding: "16px 20px",
                background: meta.bg,
                borderRadius: 10,
                border: `1px solid ${meta.color}20`,
              }}
            >
              <p style={{ fontSize: 13, color: meta.color, fontWeight: 600 }}>
                🔬 Schéma interactif — {meta.name}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Explorez la structure en cliquant sur les différents éléments du
                diagramme.
              </p>
            </div>
            <DiagramComponent />
          </div>
        )}

        {/* FICHES TAB */}
        {tab === "fiches" && hasFlashcards && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>
            <div
              style={{
                marginBottom: 24,
                padding: "16px 20px",
                background: meta.bg,
                borderRadius: 10,
                border: `1px solid ${meta.color}20`,
              }}
            >
              <p style={{ fontSize: 13, color: meta.color, fontWeight: 600 }}>
                🃏 Fiches de révision — {flashcards.length} cartes
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Testez vos connaissances. Cliquez pour révéler la réponse.
              </p>
            </div>
            <Flashcards cards={flashcards} color={meta.color} />
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <div
        style={{
          background: "white",
          borderTop: "1px solid var(--border)",
          padding: "24px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {prevMod ? (
            <Link
              href={`/modules/${prevMod.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "white",
                transition: "all 0.18s",
              }}
            >
              <span style={{ fontSize: 18 }}>←</span>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Précédent
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                >
                  {prevMod.icon} {prevMod.name}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextMod ? (
            <Link
              href={`/modules/${nextMod.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: 10,
                border: `1px solid ${nextMod.color}30`,
                background: nextMod.bg,
                transition: "all 0.18s",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Suivant
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: nextMod.color,
                  }}
                >
                  {nextMod.icon} {nextMod.name}
                </div>
              </div>
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
