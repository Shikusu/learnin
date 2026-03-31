"use client";

import { File, FileText, Copy, Check, ClipboardPaste } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveDeck } from "@/firebase/decks";

const TABS = [
  { id: "pdf", label: "Generate from PDF" },
  { id: "llm", label: "Ask an LLM" },
  { id: "json", label: "Import JSON" },
];

const PROMPT_TEMPLATE = `Read the content I'm sharing and generate a JSON quiz using exactly this format:

{
  "topic": "Name of the topic",
  "questions": [
    {
      "id": 1,
      "question": "What is...?",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A",
      "explanation": "Because..."
    }
  ]
}

Rules:
- Detect the language of the document and use that same language for ALL output (topic, questions, options, explanations)
- Generate as many meaningful, non-redundant questions as the content supports
- Cover the breadth of the document, not just the introduction
- Each question must have exactly 4 options labeled A, B, C, D
- Wrong options must be plausible, not obviously incorrect
- The "answer" field must be just the letter (A, B, C, or D)
- Include a clear explanation for each correct answer
- Avoid trivial, trick, or ambiguous questions
- Return ONLY the raw JSON — no intro text, no markdown backticks, nothing else`;

// Sanitize a string field — strip HTML tags and limit length
const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
};

// Deep-validate and sanitize a parsed deck object
const sanitizeDeck = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, error: "JSON must be an object." };
  }

  const topic = sanitizeString(raw.topic, 120);
  if (!topic) return { valid: false, error: "Missing or empty \"topic\" field." };

  if (!Array.isArray(raw.questions) || raw.questions.length === 0) {
    return { valid: false, error: "\"questions\" must be a non-empty array." };
  }

  if (raw.questions.length > 200) {
    return { valid: false, error: "Too many questions (max 200)." };
  }

  const VALID_ANSWERS = new Set(["A", "B", "C", "D"]);

  const questions = raw.questions.map((q, i) => {
    const label = `Question ${i + 1}`;

    if (!q || typeof q !== "object") throw new Error(`${label}: invalid format.`);

    const question = sanitizeString(q.question, 600);
    if (!question) throw new Error(`${label}: missing "question" text.`);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`${label}: must have exactly 4 options.`);
    }

    const options = q.options.map((opt, oi) => {
      const s = sanitizeString(opt, 300);
      if (!s) throw new Error(`${label}, option ${oi + 1}: empty option.`);
      return s;
    });

    const answer = sanitizeString(q.answer, 1).toUpperCase();
    if (!VALID_ANSWERS.has(answer)) {
      throw new Error(`${label}: "answer" must be A, B, C, or D.`);
    }

    const explanation = sanitizeString(q.explanation ?? "", 800);

    return { id: i + 1, question, options, answer, explanation };
  });

  return { valid: true, data: { topic, questions } };
};

export default function ImportModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("pdf");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // JSON paste state
  const [pasteValue, setPasteValue] = useState("");
  const [jsonInputMode, setJsonInputMode] = useState("file"); // "file" | "paste"

  const inputRef = useRef(null);

  const reset = () => {
    setError("");
    setStatus("idle");
    setLoadingMsg("");
    setPasteValue("");
    setJsonInputMode("file");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the pre text
    }
  };

  /* ── Save a validated deck to Firebase ── */
  const persistDeck = useCallback(async (parsed) => {
    const result = sanitizeDeck(parsed);
    if (!result.valid) {
      setError(result.error);
      setStatus("error");
      return;
    }
    const deckId = await saveDeck(user.uid, result.data);
    onSuccess({ id: deckId, ...result.data, createdAt: new Date() });
  }, [user, onSuccess]);

  /* ── PDF → Gemini ── */
  const processPdf = useCallback(async (file) => {
    setError("");
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted here.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError("File too large. Max 3MB for PDF generation.");
      return;
    }

    setStatus("loading");
    setLoadingMsg("Reading document…");

    try {
      const formData = new FormData();
      formData.append("file", file);

      setLoadingMsg("Generating questions…");
      const res = await fetch("/api/generate-deck", { method: "POST", body: formData });

      // Guard against non-JSON error responses
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        setError("Unexpected server response. Please try again.");
        setStatus("error");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        setStatus("error");
        return;
      }

      setLoadingMsg("Saving deck…");
      await persistDeck(data);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [persistDeck]);

  /* ── JSON file ── */
  const processJsonFile = useCallback(async (file) => {
    setError("");
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setError("Only .json files are accepted.");
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setError("JSON file too large. Max 1MB.");
      return;
    }

    setStatus("loading");
    setLoadingMsg("Importing…");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await persistDeck(parsed);
    } catch (err) {
      setError(err instanceof SyntaxError ? "Invalid JSON — could not parse file." : "Something went wrong.");
      setStatus("error");
    }
  }, [persistDeck]);

  /* ── JSON paste ── */
  const processJsonPaste = useCallback(async () => {
    setError("");
    const raw = pasteValue.trim();
    if (!raw) {
      setError("Paste your JSON first.");
      return;
    }
    if (raw.length > 1_000_000) {
      setError("Pasted content too large. Max 1MB.");
      return;
    }

    setStatus("loading");
    setLoadingMsg("Importing…");

    try {
      // Strip accidental markdown fences
      const clean = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      const parsed = JSON.parse(clean);
      await persistDeck(parsed);
    } catch (err) {
      setError(err instanceof SyntaxError ? "Invalid JSON — check the format and try again." : "Something went wrong.");
      setStatus("error");
    }
  }, [pasteValue, persistDeck]);

  const processFile = tab === "pdf" ? processPdf : processJsonFile;
  const accept = tab === "pdf" ? "application/pdf" : ".json";

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (tab === "json" && jsonInputMode === "paste") return;
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
              <h2 className="text-xl font-semibold text-(--text)">Add a deck</h2>
              <p className="text-sm text-(--text-muted) mt-1">Generate from a PDF, use an LLM, or import JSON.</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-(--text-muted) hover:text-(--text) transition-colors text-xl leading-none mt-0.5"
            >
              ✕
            </button>
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

          {/* ── LLM Guide Tab ── */}
          {tab === "llm" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { n: "1", text: "Copy the prompt below" },
                  { n: "2", text: "Open Claude, ChatGPT, or any LLM you like" },
                  { n: "3", text: "Paste the prompt and add your notes or document text" },
                  { n: "4", text: 'Copy the JSON it returns and import it via the "Import JSON" tab' },
                ].map(({ n, text }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-(--accent)/15 text-(--accent) text-xs font-medium flex items-center justify-center mt-0.5">
                      {n}
                    </span>
                    <p className="text-sm text-(--text) leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Prompt box — copy button only, no selectable text clutter */}
              <div className="relative">
                <pre className="text-xs text-(--text-muted) bg-(--surface-2) border border-(--border) rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap wrap-break-word max-h-52 overflow-y-auto">
                  {PROMPT_TEMPLATE}
                </pre>
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-150 ${
                    copied
                      ? "bg-(--accent)/10 border-(--accent)/30 text-(--accent)"
                      : "bg-(--surface) border-(--border) text-(--text-muted) hover:text-(--text)"
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <p className="text-xs text-(--text-muted) text-center leading-relaxed">
                Works with Claude, ChatGPT, Gemini, or any LLM.<br />
                Once you have the JSON, use the <span className="text-(--text)">Import JSON</span> tab.
              </p>
            </div>
          )}

          {/* ── PDF Tab ── */}
          {tab === "pdf" && (
            <>
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
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-(--accent)" />
                    <p className="text-sm text-(--text) font-medium">Drop your PDF here</p>
                    <p className="text-xs text-(--text-muted)">or click to browse · max 3MB</p>
                  </>
                )}
              </div>

              {error && (
                <p className="mt-4 text-sm text-(--danger) bg-(--danger)/10 border border-(--danger)/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              {status === "idle" && (
                <p className="mt-4 text-xs text-(--text-muted) text-center leading-relaxed">
                  Gemini will read your document and generate as many meaningful questions as it can.
                  <br />
                  <span className="opacity-70">For larger docs, use the <span className="text-(--text)">Ask an LLM</span> tab instead.</span>
                </p>
              )}
            </>
          )}

          {/* ── JSON Tab ── */}
          {tab === "json" && (
            <>
              {/* Toggle: File vs Paste */}
              <div className="flex gap-1 p-1 bg-(--surface-2) rounded-xl mb-4">
                {[
                  { id: "file", label: "Upload file", icon: <File className="w-3 h-3" /> },
                  { id: "paste", label: "Paste JSON", icon: <ClipboardPaste className="w-3 h-3" /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setJsonInputMode(m.id); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-all duration-150 ${
                      jsonInputMode === m.id
                        ? "bg-(--surface) text-(--text) shadow-sm"
                        : "text-(--text-muted) hover:text-(--text)"
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>

              {/* File drop zone */}
              {jsonInputMode === "file" && (
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
                  <input ref={inputRef} type="file" accept=".json" className="hidden" onChange={(e) => processJsonFile(e.target.files[0])} />
                  {status === "loading" ? (
                    <>
                      <div className="w-6 h-6 border-2 border-(--border) border-t-(--accent) rounded-full animate-spin" />
                      <p className="text-sm text-(--text-muted)">{loadingMsg}</p>
                    </>
                  ) : (
                    <>
                      <File className="w-8 h-8 text-(--accent)" />
                      <p className="text-sm text-(--text) font-medium">Drop your JSON here</p>
                      <p className="text-xs text-(--text-muted)">or click to browse · max 1MB</p>
                    </>
                  )}
                </div>
              )}

              {/* Paste zone */}
              {jsonInputMode === "paste" && (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={pasteValue}
                    onChange={(e) => { setPasteValue(e.target.value); setError(""); }}
                    placeholder='Paste the JSON here — markdown fences (```json) are stripped automatically'
                    rows={8}
                    disabled={status === "loading"}
                    className="w-full bg-(--surface-2) border border-(--border) rounded-xl px-4 py-3 text-xs text-(--text) placeholder:text-(--text-muted)/50 outline-none focus:border-(--accent)/50 transition-all duration-150 resize-none font-mono leading-relaxed disabled:opacity-50"
                  />
                  <button
                    onClick={processJsonPaste}
                    disabled={status === "loading" || !pasteValue.trim()}
                    className="w-full py-3 bg-(--accent) text-[#0a1a10] text-sm font-medium rounded-xl transition-all duration-150 hover:opacity-85 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                  >
                    {status === "loading" ? loadingMsg : "Import →"}
                  </button>
                </div>
              )}

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
      "options": ["A. x", "B. y", "C. z", "D. w"],
      "answer": "A",
      "explanation": "Because..."
    }
  ]
}`}
                </pre>
              </details>
            </>
          )}

        </div>
      </div>
    </> 
  );
}