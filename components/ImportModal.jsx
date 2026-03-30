"use client";

import { File } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateDeck } from "@/lib/validateDeck";
import { saveDeck } from "@/firebase/decks";

export default function ImportModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const processFile = useCallback(
    async (file) => {
      setError("");
      if (!file) return;

      if (!file.name.endsWith(".json")) {
        setError("Only .json files are accepted.");
        return;
      }

      setStatus("loading");

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
        if (err instanceof SyntaxError) {
          setError("Invalid JSON — could not parse file.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        setStatus("error");
      }
    },
    [user, onSuccess]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => {
    processFile(e.target.files[0]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-(--surface) border border-(--border) rounded-2xl p-8 shadow-2xl animate-rise">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-(--font-display) text-xl text-(--text)">
                Import a deck
              </h2>
              <p className="text-sm text-(--text-muted) mt-1">
                Upload a JSON file following the QCM format.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-(--text-muted) hover:text-(--text) transition-colors text-xl leading-none mt-0.5"
            >
              ✕
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-3
              border-2 border-dashed rounded-xl p-10 cursor-pointer
              transition-all duration-150
              ${dragging
                ? "border-(--accent) bg-(--accent)/5"
                : "border-(--border) hover:border-(--accent)/50 hover:bg-(--surface-2)"
              }
              ${status === "loading" ? "pointer-events-none opacity-60" : ""}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInput}
            />

            {status === "loading" ? (
              <>
                <Spinner />
                <p className="text-sm text-(--text-muted)">Saving </p>
              </>
            ) : (
              <>
                <File className="w-8 h-8 text-(--accent)" />
                <p className="text-sm text-(--text) font-medium">
                  Drop your JSON here
                </p>
                <p className="text-xs text-(--text-muted)">
                  or click to browse
                </p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-(--danger) bg-(--danger)/10 border border-(--danger)/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Schema hint */}
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
      "options": ["A", "B", "C", "D"],
      "answer": "A",
      "explanation": "Because..."
    }
  ]
}`}
            </pre>
          </details>
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <div className="w-6 h-6 border-2 border-(--border) border-t-(--accent) rounded-full animate-spin" />
  );
}
