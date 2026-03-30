"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getDeck, saveScore } from "@/firebase/decks";
import ScoreScreen from "@/components/ScoreScreen";
import NotFound from "@/components/NotFound";
import Shell from "@/components/Shell";
import { buildRun } from "@/utils/buildRun";
import { resolveAnswer } from "@/utils/resolveAnswer";

export default function QuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { deckId } = useParams();
 
  const [deck, setDeck] = useState(null);
  const [deckLoading, setDeckLoading] = useState(true);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
 
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  // scores[i] = { correct: bool, question: q, chosen: opt }
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
 
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);
 
  useEffect(() => {
    if (!user || !deckId) return;
    getDeck(user.uid, deckId)
      .then((d) => {
        setDeck(d);
        if (d) setShuffledQuestions(buildRun(d.questions));
      })
      .finally(() => setDeckLoading(false));
  }, [user, deckId]);
 
  useEffect(() => {
    setCardVisible(false);
    const t = setTimeout(() => setCardVisible(true), 60);
    return () => clearTimeout(t);
  }, [index, finished]);
 
  if (loading || deckLoading || !user) return null;
  if (!deck) return <NotFound onBack={() => router.push("/dashboard")} />;
 
  const questions = shuffledQuestions;
  const total = questions.length;
  const q = questions[index];
  const correctAnswer = resolveAnswer(q.options, q.answer);
  const progress = ((index + (revealed ? 1 : 0)) / total) * 100;
 
  const handleSelect = (opt) => {
    if (revealed) return;
    const correct = opt === correctAnswer;
    setSelected(opt);
    setRevealed(true);
    setScores((s) => [...s, { correct, question: q, chosen: opt, correctAnswer }]);
  };
 
  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setCardVisible(false);
    setTimeout(() => {
      if (index + 1 >= total) {
        setFinished(true);
        // use functional update to get the latest scores
        setScores((finalScores) => {
          const correct = finalScores.filter((s) => s.correct).length;
          const pct = Math.round((correct / total) * 100);
          saveScore(user.uid, deckId, { pct, correct, total }).catch(() => {});
          return finalScores;
        });
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        setRevealed(false);
      }
      setAnimating(false);
    }, 220);
  };
 
  const handleRestart = () => {
    setShuffledQuestions(buildRun(deck.questions));
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScores([]);
    setFinished(false);
  };
 
  if (finished) {
    const correct = scores.filter((s) => s.correct).length;
    const pct = Math.round((correct / total) * 100);
    const wrong = scores.filter((s) => !s.correct);
    return (
      <Shell>
        <div className={`transition-all duration-500 ease-out ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <ScoreScreen
            correct={correct}
            total={total}
            pct={pct}
            wrongItems={wrong}
            onRestart={handleRestart}
            onBack={() => router.push("/dashboard")}
          />
        </div>
      </Shell>
    );
  }
 
  return (
    <Shell>
      {/* Nav */}
      <nav className="flex items-center justify-between mb-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-xs text-(--text-muted) hover:text-(--text) transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Decks
        </button>
        <span className="text-xs text-(--text-muted) font-medium tracking-widest uppercase">
          {deck.topic}
        </span>
        <span className="text-xs text-(--text-muted) tabular-nums">
          {index + 1} / {total}
        </span>
      </nav>
 
      {/* Progress bar */}
      <div className="h-px bg-white/[.07] rounded-full mb-8 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-(--accent) rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
 
      {/* Card */}
      <div className={`transition-all duration-300 ease-out ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        <p className="text-[11px] font-medium tracking-[.12em] uppercase text-(--accent) mb-3">
          Question {index + 1}
        </p>
        <h2 className="font-(--font-display) text-2xl leading-snug text-(--text) mb-8">
          {q.question}
        </h2>
 
        <ul className="flex flex-col gap-3 mb-6">
          {q.options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrect = opt === correctAnswer;
            let state = "idle";
            if (revealed) {
              if (isCorrect) state = "correct";
              else if (isSelected) state = "wrong";
              else state = "dim";
            }
            return (
              <li key={opt}>
                <button
                  onClick={() => handleSelect(opt)}
                  disabled={revealed}
                  className={`
                    w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-200
                    ${state === "idle" ? "border-(--border) bg-(--surface) hover:border-(--accent)/50 hover:bg-(--surface-2) hover:-translate-y-px" : ""}
                    ${state === "correct" ? "border-(--accent) bg-(--accent)/10 text-(--accent)" : ""}
                    ${state === "wrong" ? "border-(--danger) bg-(--danger)/10 text-(--danger)" : ""}
                    ${state === "dim" ? "border-(--border) opacity-35" : ""}
                    ${revealed ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>{opt}</span>
                    {state === "correct" && <span className="text-base shrink-0">✓</span>}
                    {state === "wrong"   && <span className="text-base shrink-0">✗</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
 
        {revealed && (
          <div className="animate-[fadeUp_.3s_ease_forwards]">
            {q.explanation && (
              <div className="mb-5 px-5 py-4 rounded-xl bg-(--surface-2) border border-(--border) text-sm text-(--text-muted) leading-relaxed">
                <span className="text-(--text) font-medium">Explication — </span>
                {q.explanation}
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-(--accent) text-[#0a1a10] text-sm font-medium rounded-xl transition-all duration-150 hover:opacity-85 hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(74,222,128,.2)] active:translate-y-0"
            >
              {index + 1 < total ? "Next question →" : "See results →"}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

