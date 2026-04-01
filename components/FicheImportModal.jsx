"use client";

import { File, FileText, Copy, Check, ClipboardPaste } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveFiche } from "@/firebase/fiches";
import { sanitizeFiche } from "@/utils/sanitizeFiche";
import { PROMPT_TEMPLATE } from "@/constants/fichePrompt";
const TABS = [
  { id: "pdf", label: "Generate from PDF" },
  { id: "llm", label: "Ask an LLM" },
  { id: "json", label: "Import JSON" },
];


export default function FicheImportModal({ onClose, onSuccess }) {
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
      // silent fail
    }
  };

  /* ── Save a validated fiche to Firebase ── */
  const persistFiche = useCallback(async (parsed) => {
    const result = sanitizeFiche(parsed);
    if (!result.valid) {
      setError(result.error);
      setStatus("error");
      return;
    }
    const ficheId = await saveFiche(user.uid, result.data);
    onSuccess({ id: ficheId, ...result.data, createdAt: new Date() });
  }, [user, onSuccess]);

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

      setLoadingMsg("Generating fiche…");
      const res = await fetch("/api/generate-fiche", { method: "POST", body: formData });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        setError("Unexpected server response. Please try again.");
        setStatus("error");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("Gemini is rate-limited right now. Use the \"Ask an LLM\" tab instead.");
        } else {
          setError(data.error ?? "Generation failed.");
        }
        setStatus("error");
        return;
      }

      setLoadingMsg("Saving fiche…");
      await persistFiche(data);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [persistFiche]);

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
      await persistFiche(parsed);
    } catch (err) {
      setError(err instanceof SyntaxError ? "Invalid JSON — could not parse file." : "Something went wrong.");
      setStatus("error");
    }
  }, [persistFiche]);

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
      const clean = raw
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/```\s*$/i, "")
  .replace(/\[cite_start\]/g, "")        
  .replace(/\[cite:\s*[\d,\s]+\]/g, "") 
  .trim();
      const parsed = JSON.parse(clean);
      await persistFiche(parsed);
    } catch (err) {
      setError(err instanceof SyntaxError ? "Invalid JSON — check the format and try again." : "Something went wrong.");
      setStatus("error");
    }
  }, [pasteValue, persistFiche]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (tab === "json" && jsonInputMode === "paste") return;
    if (tab === "pdf") processPdf(e.dataTransfer.files[0]);
    if (tab === "json") processJsonFile(e.dataTransfer.files[0]);
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
              <h2 className="text-xl font-semibold text-(--text)">Generate a fiche</h2>
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
                <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => processPdf(e.target.files[0])} />

                {status === "loading" ? (
                  <>
                    <div className="w-6 h-6 border-2 border-(--border) border-t-(--accent) rounded-full animate-spin" />
                    <p className="text-sm text-(--text-muted)">{loadingMsg}</p>
                  </>
                ) : (
                  <>
                    <FileText className="w-8 h-8 text-(--accent)" />
                    <p className="text-sm text-(--text) font-medium">Drop your PDF here</p>
                    <p className="text-xs text-(--text-muted)">or click to browse · max 10MB</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 flex items-start justify-between gap-3 text-sm text-(--danger) bg-(--danger)/10 border border-(--danger)/20 rounded-lg px-4 py-2.5">
                  <p>{error}</p>
                  <button onClick={reset} className="shrink-0 text-xs underline underline-offset-2 hover:opacity-70 transition-opacity">
                    Retry
                  </button>
                </div>
              )}

              {status === "idle" && (
                <p className="mt-4 text-xs text-(--text-muted) text-center leading-relaxed">
                  Gemini will read your document and generate a structured study sheet.
                  <br />
                  <span className="opacity-70">For larger docs, use the <span className="text-(--text)">Ask an LLM</span> tab instead.</span>
                </p>
              )}
            </>
          )}

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

    <button
      onClick={handleCopy}
      className={`w-full flex items-center justify-center gap-1.5 text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ${
        copied
          ? "bg-(--accent)/10 border-(--accent)/30 text-(--accent)"
          : "bg-(--surface) border-(--border) text-(--text-muted) hover:text-(--text)"
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "Prompt copied!" : "Copy prompt"}
    </button>

    <p className="text-xs text-(--text-muted) text-center leading-relaxed">
      Works with Claude, ChatGPT, Gemini, or any LLM.<br />
      Once you have the JSON, use the <span className="text-(--text)">Import JSON</span> tab.
    </p>
  </div>
)}
          {/* ── JSON Tab ── */}
          {tab === "json" && (
            <>
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

              {error && (
                <p className="mt-4 text-sm text-(--danger) bg-(--danger)/10 border border-(--danger)/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <details className="mt-5 group">
                <summary className="text-xs text-(--text-muted) cursor-pointer select-none hover:text-(--text) transition-colors">
                  Expected JSON format ↓
                </summary>
                <pre className="mt-2 text-xs text-(--text-muted) bg-(--surface-2) border border-(--border) rounded-lg p-3 overflow-x-auto leading-relaxed">
{`{
  "topic": "Your topic name",
  "summary": ["Key idea one.", "Key idea two."],
  "key_concepts": [
    { "term": "Term", "definition": "Definition" }
  ],
  "outline": {
    "title": "Main topic",
    "children": [
      { "title": "Subtopic", "children": [] }
    ]
  },
  "mnemonics": []
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