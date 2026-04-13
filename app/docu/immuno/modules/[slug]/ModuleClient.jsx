"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { ModuleMeta, MODULES } from "@/data/modules";
import KeyConcepts from "@/components/KeyConcepts";
import Flashcards from "@/components/Flashcards";

// Diagram imports (Keep as is)
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
const CytokineDiagram = dynamic(() => import("@/components/CytokineDiagram"), {
  ssr: false,
});
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
  { id: "cours", label: "📖 Cours" },
  { id: "schema", label: "🔬 Schéma" },
  { id: "fiches", label: "🃏 Fiches" },
];

export default function ModuleClient({ meta, content, flashcards }) {
  const [tab, setTab] = useState("cours");
  const DiagramComponent = DIAGRAMS[meta.slug];
  const hasDiagram = !!DiagramComponent;
  const hasFlashcards = flashcards?.length > 0;

  const activeTabs = TABS.filter((t) => {
    if (t.id === "schema" && !hasDiagram) return false;
    if (t.id === "fiches" && !hasFlashcards) return false;
    return true;
  });

  const modIndex = MODULES.findIndex((m) => m.slug === meta.slug);
  const prevMod = MODULES[modIndex - 1];
  const nextMod = MODULES[modIndex + 1];

  // Consistency Fix: Centralized base path for links
  const BASE_PATH = "/docu/immuno/modules";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Top nav */}
      <nav
        style={{
          background: "var(--bg-card)",
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
              href={`${BASE_PATH}/${prevMod.slug}`}
              className="nav-btn-mini"
            >
              ← {prevMod.icon}
            </Link>
          )}
          {nextMod && (
            <Link
              href={`${BASE_PATH}/${nextMod.slug}`}
              className="nav-btn-mini"
            >
              {nextMod.icon} →
            </Link>
          )}
        </div>
      </nav>

      {/* Module hero */}
      <header
        style={{
          /* Updated to use a subtle overlay so it works in dark mode */
          background: `linear-gradient(135deg, ${meta.color}15 0%, var(--background) 100%)`,
          borderBottom: "1px solid var(--border)",
          padding: "40px 32px 32px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                background: "var(--bg-card)",
                border: `2px solid ${meta.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                flexShrink: 0,
                boxShadow: `0 8px 20px ${meta.color}15`,
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
                    ...badgeStyle,
                    color: meta.color,
                    border: `1px solid ${meta.color}30`,
                  }}
                >
                  Module {modIndex + 1} / {MODULES.length}
                </span>
                <span
                  style={{
                    ...badgeStyle,
                    color: "var(--text-muted)",
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
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                {meta.subtitle}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {meta.topics.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: `${meta.color}15`,
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
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 56,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            gap: 4,
            padding: "0 32px",
          }}
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
                color: tab === t.id ? meta.color : "var(--text-muted)",
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
        {tab === "cours" && content && (
          <div className="fade-up">
            <KeyConcepts sections={content.sections} color={meta.color} />
          </div>
        )}

        {tab === "schema" && hasDiagram && (
          <div className="fade-up">
            <div
              style={{
                ...infoBoxStyle,
                background: `${meta.color}10`,
                borderColor: `${meta.color}20`,
              }}
            >
              <p style={{ fontSize: 13, color: meta.color, fontWeight: 600 }}>
                🔬 Schéma interactif — {meta.name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Explorez la structure en cliquant sur les éléments.
              </p>
            </div>
            <DiagramComponent />
          </div>
        )}

        {tab === "fiches" && hasFlashcards && (
          <div className="fade-up">
            <div
              style={{
                ...infoBoxStyle,
                background: `${meta.color}10`,
                borderColor: `${meta.color}20`,
              }}
            >
              <p style={{ fontSize: 13, color: meta.color, fontWeight: 600 }}>
                🃏 Fiches de révision — {flashcards.length} cartes
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                Cliquez pour révéler la réponse.
              </p>
            </div>
            <Flashcards cards={flashcards} color={meta.color} />
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <footer
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          padding: "40px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {prevMod ? (
            <Link href={`${BASE_PATH}/${prevMod.slug}`} style={navCardStyle}>
              <span style={{ fontSize: 18 }}>←</span>
              <div>
                <div style={navLabelStyle}>Précédent</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  {prevMod.name}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextMod && (
            <Link
              href={`${BASE_PATH}/${nextMod.slug}`}
              style={{
                ...navCardStyle,
                textAlign: "right",
                border: `1px solid ${nextMod.color}40`,
                background: `${nextMod.color}05`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={navLabelStyle}>Suivant</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: nextMod.color,
                  }}
                >
                  {nextMod.name}
                </div>
              </div>
              <span style={{ fontSize: 18 }}>→</span>
            </Link>
          )}
        </div>
      </footer>

      {/* CSS for the mini buttons since we can't use style objects for everything easily */}
      <style jsx>{`
        .nav-btn-mini {
          font-size: 12px;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid var(--border);
          text-decoration: none;
          color: var(--text-muted);
          background: var(--bg-card);
          transition: all 0.2s;
        }
        .nav-btn-mini:hover {
          border-color: var(--text-muted);
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}

// Sub-styles for cleaner code
const badgeStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  padding: "3px 10px",
  borderRadius: 4,
  fontWeight: 600,
  background: "var(--bg-card)",
};

const infoBoxStyle = {
  marginBottom: 24,
  padding: "16px 20px",
  borderRadius: 10,
  border: "1px solid",
};

const navCardStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  textDecoration: "none",
  padding: "16px 20px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--bg-card)",
  transition: "transform 0.2s ease",
};

const navLabelStyle = {
  fontSize: 10,
  color: "var(--text-muted)",
  fontFamily: "var(--font-mono)",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
