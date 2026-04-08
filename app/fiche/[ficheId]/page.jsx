"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFiche } from "@/firebase/fiches";
import NotFound from "@/components/NotFound";
import Shell from "@/components/Shell";

// ── Collapsible outline node (recursive) ─────────────────────────────────────
function OutlineNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2); // top two levels open by default
  const hasChildren = node.children?.length > 0;

  return (
    <div className={depth > 0 ? "ml-4 border-l border-(--border) pl-3" : ""}>
      <button
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={`
          flex items-center gap-2 w-full text-left py-1.5 group
          ${hasChildren ? "cursor-pointer" : "cursor-default"}
        `}
      >
        {hasChildren && (
          <span className={`text-(--text-muted) text-xs transition-transform duration-200 shrink-0 ${open ? "rotate-90" : ""}`}>
            ▶
          </span>
        )}
        {!hasChildren && (
          <span className="w-3 shrink-0 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-(--text-muted)/50 inline-block" />
          </span>
        )}
        <span className={`
          text-sm leading-snug transition-colors
          ${depth === 0 ? "font-semibold text-(--text)" : ""}
          ${depth === 1 ? "font-medium text-(--text)" : ""}
          ${depth >= 2 ? "text-(--text-muted)" : ""}
          ${hasChildren ? "group-hover:text-(--accent)" : ""}
        `}>
          {node.title}
        </span>
      </button>

      {hasChildren && open && (
        <div className="mt-0.5 mb-1">
          {node.children.map((child, i) => (
            <OutlineNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[.12em] uppercase text-(--accent) mb-4">
        {label}
      </p>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FichePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { ficheId } = useParams();

  const [fiche, setFiche] = useState(null);
  const [ficheLoading, setFicheLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !ficheId) return;
    getFiche(user.uid, ficheId)
      .then((f) => setFiche(f))
      .finally(() => setFicheLoading(false));
  }, [user, ficheId]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (loading || ficheLoading || !user) return null;
  if (!fiche) return <NotFound onBack={() => router.push("/dashboard")} />;

  return (
    <Shell>
      {/* Nav */}
      <nav className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-xs text-(--text-muted) hover:text-(--text) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Fiches
        </button>
        <span className="text-xs text-(--text-muted) font-medium tracking-widest uppercase truncate max-w-45">
          {fiche.topic}
        </span>
        <span className="text-xs text-(--text-muted) tabular-nums">
          {fiche.key_concepts.length} concepts
        </span>
      </nav>

      {/* Content */}
      <div className={`flex flex-col gap-10 transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

        {/* Title */}
        <h1 className="font-(--font-display) text-3xl leading-snug text-(--text)">
          {fiche.topic}
        </h1>

        {/* Summary */}
        <Section label="Summary">
          <div className="flex flex-col gap-2.5">
            {fiche.summary.map((sentence, i) => (
              <p key={i} className="text-sm text-(--text-muted) leading-relaxed">
                {sentence}
              </p>
            ))}
          </div>
        </Section>

        {/* Key concepts */}
        <Section label={`Key concepts · ${fiche.key_concepts.length}`}>
          <div className="flex flex-col gap-2.5">
            {fiche.key_concepts.map((c, i) => (
              <div
                key={i}
                className="bg-(--surface) border border-(--border) rounded-xl px-5 py-4"
              >
                <p className="text-sm font-medium text-(--text) mb-1">{c.term}</p>
                <p className="text-sm text-(--text-muted) leading-relaxed">{c.definition}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Outline */}
        <Section label="Outline">
          <div className="bg-(--surface) border border-(--border) rounded-xl px-5 py-4">
            <OutlineNode node={fiche.outline} depth={0} />
          </div>
        </Section>

        {/* Mnemonics — only rendered if present */}
        {fiche.mnemonics.length > 0 && (
          <Section label={`Mnemonics · ${fiche.mnemonics.length}`}>
            <div className="flex flex-col gap-3">
              {fiche.mnemonics.map((m, i) => (
                <div
                  key={i}
                  className="bg-(--accent)/5 border border-(--accent)/20 rounded-xl px-5 py-4"
                >
                  <p className="text-xs font-medium tracking-wide uppercase text-(--accent) mb-1">
                    {m.concept}
                  </p>
                  <p className="text-sm font-semibold text-(--text) mb-1.5">{m.mnemonic}</p>
                  {m.explanation && (
                    <p className="text-xs text-(--text-muted) leading-relaxed">{m.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </Shell>
  );
}