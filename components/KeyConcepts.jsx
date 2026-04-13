"use client";
import { useState } from "react";

function cleanContent(raw) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10)
    .filter((l) => !/^[IVX]+\.|^\d+$/.test(l))
    .slice(0, 12);
}

function SubSection({ subsection, color, index }) {
  const [open, setOpen] = useState(false);
  const points = cleanContent(subsection.content || "");

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${open ? color + "30" : "#f0ece6"}`,
        overflow: "hidden",
        transition: "border-color 0.2s",
        background: open ? color + "05" : "#fafafa",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: 8,
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: open ? color + "20" : "#ece8e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: color,
              flexShrink: 0,
            }}
          >
            {String.fromCharCode(65 + index)}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: open ? color : "#374151",
              transition: "color 0.2s",
            }}
          >
            {subsection.title}
          </span>
        </div>
        <span
          style={{
            fontSize: 14,
            color: color,
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            display: "inline-block",
            opacity: 0.7,
          }}
        >
          ↓
        </span>
      </button>

      {open && points.length > 0 && (
        <div style={{ padding: "0 14px 12px 42px" }}>
          <div style={{ height: 1, background: color + "15", marginBottom: 10 }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {points.map((point, j) => (
              <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: color, fontWeight: 700, fontSize: 12, lineHeight: "20px", flexShrink: 0 }}>
                  ·
                </span>
                <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function KeyConcepts({ sections, color = "#c0392b" }) {
  const [open, setOpen] = useState(0);

  const meaningful = sections.filter(
    (s) =>
      s.content.trim().length > 30 &&
      !s.title.includes("OBJECTIF") &&
      !s.title.includes("PRE-REQUIS") &&
      !s.title.includes("MERCI") &&
      !s.title.includes("PLAN\n")
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {meaningful.map((section, i) => {
        const isOpen = open === i;
        const points = cleanContent(section.content);
        const hasSubsections = section.subsections && section.subsections.length > 0;

        return (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: 10,
              border: `1px solid ${isOpen ? color + "40" : "#e2ded5"}`,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                gap: 12,
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: isOpen ? color : color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: isOpen ? "white" : color,
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: isOpen ? color : "#1a1a2e",
                      transition: "color 0.2s",
                    }}
                  >
                    {section.title.replace(/\(\d+\)/, "").trim().slice(0, 70)}
                  </span>
                  {hasSubsections && (
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>
                      {section.subsections.length} sous-section{section.subsections.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontSize: 18,
                  color: color,
                  flexShrink: 0,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                  display: "inline-block",
                }}
              >
                ↓
              </span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 20px 20px 60px", animation: "fadeUp 0.25s ease both" }}>
                <div style={{ height: 1, background: color + "20", marginBottom: 16 }} />

                {points.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, marginBottom: hasSubsections ? 16 : 0 }}>
                    {points.map((point, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", animationDelay: `${j * 30}ms`, animation: "fadeUp 0.3s ease both" }}>
                        <span style={{ color: color, fontWeight: 700, fontSize: 14, lineHeight: "22px", flexShrink: 0 }}>·</span>
                        <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {hasSubsections && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {points.length > 0 && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                        Sous-sections
                      </div>
                    )}
                    {section.subsections.map((sub, k) => (
                      <SubSection key={k} subsection={sub} color={color} index={k} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}