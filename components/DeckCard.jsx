  "use client";

  export default function DeckCard({ deck, score, onClick, onDelete }) {
    const date = deck.createdAt instanceof Date
      ? deck.createdAt
      : new Date(deck.createdAt);

    const formatted = date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

    const handleDelete = (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${deck.topic}"?`)) onDelete(deck.id);
    };

    return (
      <div
        onClick={() => onClick(deck)}
        className="
          w-full text-left cursor-pointer
          bg-(--surface) hover:bg-(--surface-2)
          border border-(--border) hover:border-(--accent)/40
          rounded-xl p-5
          transition-all duration-150
          group
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-(--text) font-medium truncate group-hover:text-(--accent) transition-colors">
              {deck.topic}
            </h3>
            <p className="text-xs text-(--text-muted) mt-1">
              {deck.questions?.length ?? 0} questions · {formatted}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Last score badge */}
            {score && (
              <span className={`
                text-xs font-medium tabular-nums px-2 py-0.5 rounded-md
                ${score.pct >= 80
                  ? "bg-(--accent)/10 text-(--accent)"
                  : score.pct >= 50
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-(--danger)/10 text-(--danger)"}
              `}>
                {score.pct}%
              </span>
            )}

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-(--text-muted) hover:text-(--danger) text-sm leading-none p-1 rounded"
              title="Delete deck"
            >
              ✕
            </button>

            <span className="text-(--text-muted) group-hover:text-(--accent) transition-colors text-lg">
              →
            </span>
          </div>
        </div>
      </div>
    );
  }