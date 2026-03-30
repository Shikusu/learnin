import { useState } from "react";
export default function ScoreScreen({ correct, total, pct, wrongItems, onRestart, onBack }) {
  const [showWeak, setShowWeak] = useState(false);
  const grade =
    pct >= 80 ? { emoji: "🏆", label: "Excellent !" } :
    pct >= 60 ? { emoji: "👍", label: "Bien joué" } :
    pct >= 40 ? { emoji: "📚", label: "À retravailler" } :
                { emoji: "💪", label: "Courage !" };
 
  return (
    <div className="flex flex-col items-center text-center py-8">
      <span className="text-5xl mb-4">{grade.emoji}</span>
      <p className="font-(--font-display) text-4xl text-(--text) mb-1">{pct}%</p>
      <p className="text-sm text-(--text-muted) mb-1">{grade.label}</p>
      <p className="text-xs text-(--text-muted) mb-8 tabular-nums">{correct} / {total} correct</p>
 
      {/* Score bar */}
      <div className="w-full max-w-xs h-2 bg-white/[.07] rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-(--accent) rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
 
      {/* Weak questions toggle */}
      {wrongItems.length > 0 && (
        <div className="w-full max-w-xs mb-8 text-left">
          <button
            onClick={() => setShowWeak((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-(--border) bg-(--surface) text-sm text-(--text-muted) hover:text-(--text) hover:border-(--accent)/30 transition-all"
          >
            <span>
              <span className="text-(--danger) font-medium">{wrongItems.length}</span>
              {" "}question{wrongItems.length > 1 ? "s" : ""} à retravailler
            </span>
            <span className={`transition-transform duration-200 ${showWeak ? "rotate-180" : ""}`}>↓</span>
          </button>
 
          {showWeak && (
            <ul className="mt-2 flex flex-col gap-2 animate-[fadeUp_.25s_ease_forwards]">
              {wrongItems.map(({ question: wq, chosen, correctAnswer: ca }, i) => (
                <li key={i} className="px-4 py-3.5 rounded-xl border border-(--border) bg-(--surface) text-left">
                  <p className="text-sm text-(--text) mb-2 leading-snug">{wq.question}</p>
                  <p className="text-xs text-(--danger) mb-1">
                    <span className="opacity-60">Votre réponse : </span>{chosen}
                  </p>
                  <p className="text-xs text-(--accent)">
                    <span className="opacity-60">Bonne réponse : </span>{ca}
                  </p>
                  {wq.explanation && (
                    <p className="text-xs text-(--text-muted) mt-2 pt-2 border-t border-(--border) leading-relaxed">
                      {wq.explanation}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
 
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-(--border) text-sm text-(--text-muted) hover:text-(--text) hover:border-(--accent)/40 transition-all"
        >
          ← Decks
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-3 rounded-xl bg-(--accent) text-[#0a1a10] text-sm font-medium hover:opacity-85 hover:-translate-y-px transition-all hover:shadow-[0_6px_28px_rgba(74,222,128,.2)]"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}