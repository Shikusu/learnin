"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDecks, getScores, deleteDeck } from "@/firebase/decks";
import { getFiches, deleteFiche } from "@/firebase/fiches"; // you'll create this
import ImportModal from "@/components/ImportModal";
import FicheImportModal from "@/components/FicheImportModal";
import DeckCard from "@/components/DeckCard";
import FicheCard from "@/components/FicheCard";
import { LESSONS } from "@/constants/lessons";

function useStaggeredMount(count) {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    setVisible([]);
    const timers = Array.from({ length: count }, (_, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), 80 + i * 55)
    );
    return () => timers.forEach(clearTimeout);
  }, [count]);
  return visible;
}

const TABS = [
  { id: "decks", label: "Decks", icon: "🗂" },
  { id: "fiches", label: "Fiches", icon: "📋" },
  { id: "docu", label: "Leçons", icon: "📖" },
];

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState("decks");

  const [decks, setDecks] = useState([]);
  const [scores, setScores] = useState({});
  const [decksLoading, setDecksLoading] = useState(true);

  const [fiches, setFiches] = useState([]);
  const [fichesLoading, setFichesLoading] = useState(true);

  const [showImport, setShowImport] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  const activeList = tab === "decks" ? decks : tab === "fiches" ? fiches : LESSONS;


  const visibleItems = useStaggeredMount(activeList.length);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([getDecks(user.uid), getScores(user.uid)])
      .then(([d, s]) => { setDecks(d); setScores(s); })
      .finally(() => setDecksLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getFiches(user.uid)
      .then((f) => setFiches(f))
      .finally(() => setFichesLoading(false));
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 60);
    return () => clearTimeout(t);
  }, []);


  const handleImportSuccess = (newDeck) => {
    setDecks((prev) => [newDeck, ...prev]);
    setShowImport(false);
  };

  // You'll wire this up once the fiche import modal is ready
  const handleFicheSuccess = (newFiche) => {
    setFiches((prev) => [newFiche, ...prev]);
    setShowImport(false);
  };

  const handleDeleteDeck = async (deckId) => {
    await deleteDeck(user.uid, deckId);
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  const handleDeleteFiche = async (ficheId) => {
    await deleteFiche(user.uid, ficheId);
    setFiches((prev) => prev.filter((f) => f.id !== ficheId));
  };

  const isLoading = tab === "decks" ? decksLoading : tab === "fiches" ? fichesLoading : false;
  const isEmpty = !isLoading && activeList.length === 0;

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-(--bg) relative overflow-x-hidden">
      <div className="pointer-events-none fixed -top-40 -right-28 w-125 h-125 rounded-full bg-(--accent)/6 blur-[90px]" />
      <div className="pointer-events-none fixed bottom-20 -left-24 w-90 h-90 rounded-full bg-(--accent)/4 blur-[80px]" />

      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-4.5 border-b border-white/6 backdrop-blur-xl bg-(--bg)/75">
        <span className="font-(--font-display) text-(--accent) text-lg tracking-widest">
          Let's learn
        </span>
        <div className="flex items-center gap-5">
          <span className="hidden sm:block text-xs text-(--text-muted)">{user.email}</span>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="text-xs text-(--text-muted) hover:text-(--text) transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-1 max-w-2xl mx-auto px-6 py-14 pb-28">

        {/* Header */}
        <div className={`flex items-end justify-between transition-all duration-500 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
          <div>
            <p className="text-[11px] font-medium tracking-[.12em] uppercase text-(--accent) mb-1.5">
              {tab === "decks"
                ? decks.length > 0 ? `${decks.length} deck${decks.length > 1 ? "s" : ""}` : "No decks yet"
                : tab === "fiches"
                  ? fiches.length > 0 ? `${fiches.length} fiche${fiches.length > 1 ? "s" : ""}` : "No fiches yet"
                  : LESSONS.length > 0 ? `${LESSONS.length} leçon${LESSONS.length > 1 ? "s" : ""}` : "0 leçons "
              }
            </p>
            <h1 className="font-(--font-display) text-4xl leading-tight text-(--text)">
              {tab === "decks" ? "Your decks" : tab === "fiches" ? "Your fiches" : "Des leçons"}
            </h1>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 bg-(--accent) text-[#0a1a10] text-sm font-medium px-4.5 py-2.5 rounded-full transition-all duration-150 hover:opacity-85 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(74,222,128,.22)] active:translate-y-0"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {tab === "decks" ? "Import" : "New fiche"}
          </button>
        </div>

{/* Bottom Navbar */}
<nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-6 py-3 border-t border-white/6 backdrop-blur-xl bg-(--bg)/85">
  {TABS.map((t) => (
    <button
      key={t.id}
      onClick={() => setTab(t.id)}
      className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all duration-150 ${
        tab === t.id ? "text-(--accent)" : "text-(--text-muted) hover:text-(--text)"
      }`}
    >
      <span className="text-xl">{t.icon}</span>
      {t.label}
    </button>
  ))}
</nav>

        <div className="h-px bg-white/[.07] my-7" />

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="block w-5 h-5 rounded-full border-2 border-white/10 border-t-(--accent) animate-spin" />
          </div>
        ) : isEmpty ? (
          <EmptyState tab={tab} onImport={() => setShowImport(true)} />
        ) : tab === "docu" ? (         // ← add this condition before the ul
  <ul className="flex flex-col gap-2.5">
    {LESSONS.map((doc, i) => (
      <li
        key={doc.id}
        className={`transition-all duration-300 ease-out ${
          visibleItems.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
        }`}
      >
        <button
          onClick={() => router.push(`/docu/${doc.id}`)}
          className="w-full text-left px-5 py-4 rounded-2xl bg-(--surface) border border-(--border) hover:border-(--accent)/40 transition-all"
        >
          <p className="text-sm font-medium text-(--text)">{doc.title}</p>
        </button>
      </li>
    ))}
  </ul>
) : (
          <ul className="flex flex-col gap-2.5">
            {tab === "decks"
              ? decks.map((deck, i) => (
                  <li
                    key={deck.id}
                    className={`transition-all duration-300 ease-out ${visibleItems.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}
                  >
                    <DeckCard
                      deck={deck}
                      score={scores[deck.id] ?? null}
                      onClick={() => router.push(`/quiz/${deck.id}`)}
                      onDelete={handleDeleteDeck}
                    />
                  </li>
                ))
              : fiches.map((fiche, i) => (
                  <li
                    key={fiche.id}
                    className={`transition-all duration-300 ease-out ${visibleItems.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"}`}
                  >
                    <FicheCard
                      fiche={fiche}
                      onClick={() => router.push(`/fiche/${fiche.id}`)}
                      onDelete={handleDeleteFiche}
                    />
                  </li>
                ))
            }
          </ul>
        )}
      </main>
      {showImport && tab === "decks" &&         <ImportModal
          onClose={() => setShowImport(false)}
          onSuccess={tab === "decks" ? handleImportSuccess : handleFicheSuccess}
        />}
{showImport && tab === "fiches" && <FicheImportModal onClose={() => setShowImport(false)} onSuccess={handleFicheSuccess} />}
    </div>
  );
}

function EmptyState({ tab, onImport }) {
  return (
    <div className="flex flex-col items-center text-center py-20 animate-[fadeUp_.45s_ease_forwards]">
      <span className="text-4xl mb-5 grayscale-[.3]">{tab === "decks" ? "🗂" : "📋"}</span>
      <p className="font-(--font-display) text-xl text-(--text) mb-2">Nothing here yet</p>
      <p className="text-sm text-(--text-muted) max-w-60 leading-relaxed mb-6">
        {tab === "decks"
          ? "Make a JSON, then import it below."
          : "Generate a fiche from a PDF to get started."}
      </p>
      <button
        onClick={onImport}
        className="text-sm text-(--accent) underline underline-offset-4 hover:opacity-65 transition-opacity"
      >
        {tab === "decks" ? "Import your first deck →" : "Generate your first fiche →"}
      </button>
    </div>
  );
}