"use client";
import { useState, useMemo } from "react";

/**
 * SUBSECTION COMPONENT
 * Handles bullet points and the special 'callout' box
 */
function SubSection({ subsection, color, index }) {
  const [open, setOpen] = useState(false);
  const { title, bulletPoints = [], callout } = subsection;

  return (
    <div
      style={{
        borderRadius: 8,
        border: `1px solid ${open ? `${color}40` : "var(--border)"}`,
        overflow: "hidden",
        transition: "all 0.2s",
        background: open ? `${color}05` : "var(--background)",
        marginBottom: 8,
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
              fontSize: 10,
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
            {title}
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            color: color,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        >
          ↓
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 14px 14px 42px" }}>
          {/* Bullet Points */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 12px 0",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {bulletPoints.map((point, j) => (
              <li
                key={j}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: color }}>•</span>
                {point}
              </li>
            ))}
          </ul>

          {/* Callout Box */}
          {callout && (
            <div
              style={{
                padding: "10px 12px",
                background: `${color}10`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 4,
                fontSize: 12,
                fontStyle: "italic",
                color: "var(--foreground)",
              }}
            >
              <strong>Note:</strong> {callout}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Glossary({ items, color }) {
  const [search, setSearch] = useState("");

  // 1. Filter and Group logic
  const groupedItems = useMemo(() => {
    const filtered = items.filter((item) =>
      item.term.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce((acc, item) => {
      const char = item.term[0].toUpperCase();
      if (!acc[char]) acc[char] = [];
      acc[char].push(item);
      return acc;
    }, {});
  }, [items, search]);

  const alphabet = Object.keys(groupedItems).sort();

  return (
    <div
      style={{
        marginTop: 40,
        borderTop: "1px solid var(--border)",
        paddingTop: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h3 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>Glossaire</h3>

        {/* Search Bar */}
        <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              fontSize: 14,
              outline: "none",
              color: "var(--foreground)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = color)}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      {alphabet.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            padding: 40,
          }}
        >
          Aucun terme trouvé pour "{search}"
        </div>
      ) : (
        alphabet.map((letter) => (
          <div key={letter} style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: color,
                marginBottom: 12,
                borderBottom: `2px solid ${color}20`,
                display: "inline-block",
                minWidth: 40,
              }}
            >
              {letter}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {groupedItems[letter].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: color,
                      marginBottom: 6,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.term}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "var(--text-muted)",
                    }}
                  >
                    {item.definition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function KeyConcepts({ lesson, color = "#c0392b" }) {
  const [openSection, setOpenSection] = useState(0);
  if (!lesson) return <div>nada</div>;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {/* 1. HEADER & TLDR */}
      <header>
        <h1
          style={{
            fontSize: 28,
            margin: "8px 0",
            fontFamily: "var(--font-display)",
          }}
        >
          Un petit tldr
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {lesson.tldr}
        </p>
      </header>

      {/* 2. KEY TAKEAWAYS */}
      <div
        style={{
          background: "var(--bg-card)",
          padding: 20,
          borderRadius: 16,
          border: "1px dashed var(--border)",
        }}
      >
        <h3 style={{ fontSize: 14, marginTop: 0, color: color }}>
          Points clés
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {lesson.keyTakeaways.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <span style={{ color: color }}>✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECTIONS */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lesson.sections.map((section, i) => {
          const isOpen = openSection === i;
          return (
            <div
              key={section.id}
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                border: `1px solid ${isOpen ? `${color}50` : "var(--border)"}`,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px",
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
                      fontWeight: 700,
                      color: isOpen ? "white" : color,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: isOpen ? color : "var(--foreground)",
                      }}
                    >
                      {section.title}
                    </div>
                    {section.subsections && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {section.subsections.length} Sub-modules
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
                <div style={{ padding: "0 20px 24px 66px" }}>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--foreground)",
                      marginBottom: 16,
                      lineHeight: 1.5,
                      opacity: 0.8,
                    }}
                  >
                    {section.summary}
                  </p>

                  {/* Section Main Bullets */}
                  <div style={{ marginBottom: 20 }}>
                    {section.bulletPoints.map((p, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          gap: 10,
                          marginBottom: 8,
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: color, fontWeight: 900 }}>·</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Nested Subsections */}
                  {section.subsections?.map((sub, k) => (
                    <SubSection
                      key={sub.id}
                      subsection={sub}
                      color={color}
                      index={k}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {lesson.glossary && <Glossary items={lesson.glossary} color={color} />}
    </div>
  );
}
