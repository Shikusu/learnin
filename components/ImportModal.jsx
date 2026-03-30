"use client";

import { File, FileText } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateDeck } from "@/lib/validateDeck";
import { saveDeck } from "@/firebase/decks";

const TABS = [
  { id: "pdf", label: "Generate from PDF" },
  { id: "json", label: "Import JSON" },
];

export default function ImportModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("pdf");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const inputRef = useRef(null);

  const reset = () => {
    setError("");
    setStatus("idle");
    setLoadingMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ── PDF → Gemini ── */
  const processPdf = useCallback(async (file) => {
    setError("");
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted here.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }

    setStatus("loading");
    setLoadingMsg("Reading document…");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setLoadingMsg("Generating questions…");
      const res = await fetch("/api/generate-deck", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        setStatus("error");
        return;
      }

      setLoadingMsg("Saving deck…");
      const result = validateDeck(data);
      if (!result.valid) {
        setError(`Validation failed: ${result.error}`);
        setStatus("error");
        return;
      }

      const deckId = await saveDeck(user.uid, result.data);
      onSuccess({ id: deckId, ...result.data, createdAt: new Date() });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [user, onSuccess]);

  /* ── Raw JSON ── */
  const processJson = useCallback(async (file) => {
    setError("");
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setError("Only .json files are accepted.");
      return;
    }

    setStatus("loading");
    setLoadingMsg("Importing…");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = validateDeck(parsed);

      if (!result.valid) {
        setError(result.error);
        setStatus("error");
        return;
      }

      const deckId = await saveDeck(user.uid, result.data);
      onSuccess({ id: deckId, ...result.data, createdAt: new Date() });
    } catch (err) {
      setError(err instanceof SyntaxError ? "Invalid JSON — could not parse file." : "Something went wrong.");
      setStatus("error");
    }
  }, [user, onSuccess]);

  const processFile = tab === "pdf" ? processPdf : processJson;
  const accept = tab === "pdf" ? "application/pdf" : ".json";

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-(--surface) border border-(--border) rounded-2xl p-8 shadow-2xl animate-[fadeUp_.2s_ease_forwards]">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-(--font-display) text-xl text-(--text)">Add a deck</h2>
              <p className="text-sm text-(--text-muted) mt-1">Generate from a PDF or import raw JSON.</p>
            </div>
            <button onClick={onClose} className="text-(--text-muted) hover:text-(--text) transition-colors text-xl leading-none mt-0.5">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-(--surface-2) rounded-xl mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); reset(); }}
                className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all duration-150 ${
                  tab === t.id
                    ? "bg-(--surface) text-(--text) shadow-sm"
                    : "text-(--text-muted) hover:text-(--text)"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => status !== "loading" && inputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-xl p-10 cursor-pointer
              transition-all duration-150
              ${dragging ? "border-(--accent) bg-(--accent)/5" : "border-(--border) hover:border-(--accent)/50 hover:bg-(--surface-2)"}
              ${status === "loading" ? "pointer-events-none opacity-60" : ""}
            `}
          >
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => processFile(e.target.files[0])} />

            {status === "loading" ? (
              <>
                <div className="w-6 h-6 border-2 border-(--border) border-t-(--accent) rounded-full animate-spin" />
                <p className="text-sm text-(--text-muted)">{loadingMsg}</p>
              </>
            ) : tab === "pdf" ? (
              <>
                <FileText className="w-8 h-8 text-(--accent)" />
                <p className="text-sm text-(--text) font-medium">Drop your PDF here</p>
                <p className="text-xs text-(--text-muted)">or click to browse · max 10MB</p>
              </>
            ) : (
              <>
                <File className="w-8 h-8 text-(--accent)" />
                <p className="text-sm text-(--text) font-medium">Drop your JSON here</p>
                <p className="text-xs text-(--text-muted)">or click to browse</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-(--danger) bg-(--danger)/10 border border-(--danger)/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* JSON schema hint */}
          {tab === "json" && (
            <details className="mt-5 group">
              <summary className="text-xs text-(--text-muted) cursor-pointer select-none hover:text-(--text) transition-colors">
                Expected JSON format ↓
              </summary>
              <pre className="mt-2 text-xs text-(--text-muted) bg-(--surface-2) border border-(--border) rounded-lg p-3 overflow-x-auto leading-relaxed">
{`{
  "topic": "Your topic name",
  "questions": [
    {
      "id": 1,
      "question": "What is...?",
      "options": ["A. x", "B. y", "C. z", "D. w"],
      "answer": "A",
      "explanation": "Because..."
    }
  ]
}`}
              </pre>
            </details>
          )}

          {/* PDF hint */}
          {tab === "pdf" && status === "idle" && (
            <p className="mt-4 text-xs text-(--text-muted) text-center leading-relaxed">
              Gemini will read your document and generate<br />as many meaningful questions as it can.
            </p>
          )}
        </div>
      </div>
    </>
  );
}