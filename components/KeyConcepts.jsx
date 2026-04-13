"use client";
import { useState } from "react";

function cleanContent(raw) {
  if (!raw) return [];
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
        border: `1px solid ${open ? `${color}40` : "var(--border)"}`,
        overflow: "hidden",
        transition: "all 0.2s",
        background: open ? `${color}05` : "var(--background)",
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
              background: open ? color : "var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: open ? "white" : "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            {String.fromCharCode(65 + index)}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: open ? color : "var(--foreground)",
            }}
          >
            {subsection.title}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            color: color,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ↓
        </span>
      </button>

      {open && points.length > 0 && (
        <div style={{ padding: "0 14px 12px 42px" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {points.map((point, j) => (
              <li
                key={j}
                style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                <span style={{ color: color, fontWeight: 700, fontSize: 12 }}>
                  ·
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {point}
                </span>
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
      !s.title.includes("PLAN") &&
      !s.title.includes("MERCI")
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {meaningful.map((section, i) => {
        const isOpen = open === i;
        const points = cleanContent(section.content);
        const hasSubsections =
          section.subsections && section.subsections.length > 0;

        return (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              borderRadius: 12,
              border: `1px solid ${isOpen ? `${color}50` : "var(--border)"}`,
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
                padding: "18px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isOpen ? color : `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: isOpen ? "white" : color,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 16,
                      fontWeight: 600,
                      color: isOpen ? color : "var(--foreground)",
                    }}
                  >
                    {section.title.trim()}
                  </div>
                  {hasSubsections && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {section.subsections.length} sections
                    </div>
                  )}
                </div>
              </div>
              <span
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                  color: color,
                }}
              >
                ↓
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: "0 20px 24px 66px",
                  animation: "fadeUp 0.3s ease both",
                }}
              >
                {points.map((p, j) => (
                  <div
                    key={j}
                    style={{ display: "flex", gap: 10, marginBottom: 8 }}
                  >
                    <span style={{ color: color, fontWeight: 900 }}>·</span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "var(--foreground)",
                        lineHeight: 1.6,
                        opacity: 0.9,
                      }}
                    >
                      {p}
                    </span>
                  </div>
                ))}
                {hasSubsections && (
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {section.subsections.map((sub, k) => (
                      <SubSection
                        key={k}
                        subsection={sub}
                        color={color}
                        index={k}
                      />
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
