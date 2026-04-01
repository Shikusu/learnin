"use client";

export default function FicheCard({ fiche, onClick, onDelete }) {
  const date = fiche.createdAt instanceof Date
    ? fiche.createdAt
    : new Date(fiche.createdAt);

  const formatted = date.toLocaleDateString("fr-FR", {
    month: "short", day: "numeric", year: "numeric",
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete "${fiche.topic}"?`)) onDelete(fiche.id);
  };

  const conceptCount = fiche.key_concepts?.length ?? 0;
  const hasMnemonics = fiche.mnemonics?.length > 0;

  return (
    <div
      onClick={() => onClick(fiche)}
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
            {fiche.topic}
          </h3>
          <p className="text-xs text-(--text-muted) mt-1">
            {conceptCount} concept{conceptCount !== 1 ? "s" : ""}
            {hasMnemonics ? " · mnemonics" : ""}
            {" · "}{formatted}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Fiche type badge */}
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-(--accent)/10 text-(--accent)">
            fiche
          </span>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-(--text-muted) hover:text-(--danger) text-sm leading-none p-1 rounded"
            title="Delete fiche"
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