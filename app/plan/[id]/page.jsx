"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { PLANS } from "@/constants/plans";

// Group flat headings into sections (level 0 = section header, level > 0 = children)
function groupHeadings(headings) {
  const sections = [];
  let current = null;
  for (const h of headings) {
    if (h.level === 0) {
      current = { heading: h, children: [] };
      sections.push(current);
    } else if (current) {
      current.children.push(h);
    }
  }
  return sections;
}

function CheckIcon({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path
        d="M2 5l2.5 2.5L8 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
      }}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
        transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
        background: "var(--accent)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: 99,
        fontSize: 13,
        fontWeight: 500,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 50,
      }}
    >
      {message}
    </div>
  );
}

export default function PlanPage() {
  const router = useRouter();
  const { id } = useParams();
  const plan = PLANS.find((p) => p.id === id);
  const sections = plan ? groupHeadings(plan.headings) : [];

  // openSections: Set of section indices that are expanded
  const [openSections, setOpenSections] = useState(new Set());
  // checkedItems: Map of "sectionIdx-childIdx" -> boolean
  const [checkedItems, setCheckedItems] = useState({});
  // toast
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = useCallback((msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  const toggleSection = useCallback((i) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  const toggleItem = useCallback(
    (si, ci) => {
      const key = `${si}-${ci}`;
      setCheckedItems((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        // Check if whole section is now done
        const sec = sections[si];
        const allDone = sec.children.every(
          (_, j) => (j === ci ? !prev[key] : prev[`${si}-${j}`])
        );
        if (allDone && !prev[key]) {
          setTimeout(() => showToast("Section complete! 🎉"), 50);
        }
        return next;
      });
    },
    [sections, showToast]
  );

  // Progress — lone level-0 sections count as 1 item each
  const totalItems = sections.reduce(
    (a, s) => a + (s.children.length > 0 ? s.children.length : 1),
    0
  );
  const doneItems = Object.values(checkedItems).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  // Section completion
  const isSectionDone = (si) => {
    const sec = sections[si];
    if (sec.children.length === 0) return !!checkedItems[`${si}-self`];
    return sec.children.every((_, j) => checkedItems[`${si}-${j}`]);
  };

  const toggleSelf = useCallback(
    (si) => {
      const key = `${si}-self`;
      setCheckedItems((prev) => {
        if (!prev[key]) setTimeout(() => showToast("Done! 🎉"), 50);
        return { ...prev, [key]: !prev[key] };
      });
    },
    [showToast]
  );

  if (!plan) {
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Plan introuvable.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--bg)",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: -160,
          right: -112,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.06,
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          bottom: 80,
          left: -96,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.04,
          filter: "blur(80px)",
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(var(--bg-rgb, 15,15,18),0.75)",
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: "4px 8px 4px 0",
            display: "flex",
            alignItems: "center",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M11 4L6 9l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--accent)",
            fontSize: 18,
            letterSpacing: "0.12em",
            flex: 1,
          }}
        >
          Let's learn
        </span>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pct}%
        </span>
      </nav>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
          margin: "0 auto",
          padding: "24px 0 80px",
        }}
      >
        {/* Header */}
        <div style={{ padding: "0 16px 20px" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            {sections.length} section{sections.length > 1 ? "s" : ""}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(26px, 6vw, 36px)",
              lineHeight: 1.2,
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            {plan.title}
          </h1>

          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            <span>
              {doneItems} of {totalItems} completed
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
          </div>
          <div
            style={{
              height: 3,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "var(--accent)",
                borderRadius: 99,
                transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.07)",
            margin: "0 0 4px",
          }}
        />

        {/* Sections */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sections.map((sec, si) => {
            const isOpen = openSections.has(si);
            const done = isSectionDone(si);
            const childDoneCount = sec.children.filter(
              (_, j) => checkedItems[`${si}-${j}`]
            ).length;

            const isLone = sec.children.length === 0;
            const selfChecked = !!checkedItems[`${si}-self`];

            return (
              <li
                key={si}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                {/* Section header — lone items are directly checkable */}
                <button
                  onClick={() => isLone ? toggleSelf(si) : toggleSection(si)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    textAlign: "left",
                    WebkitTapHighlightColor: "transparent",
                    transition: "background 0.15s",
                  }}
                  onTouchStart={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Circle indicator (sections with children) or checkbox (lone) */}
                  {isLone ? (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `1.5px solid ${selfChecked ? "var(--accent)" : "rgba(255,255,255,0.15)"}`,
                        background: selfChecked ? "var(--accent)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "#fff",
                        transition: "all 0.2s",
                      }}
                    >
                      {selfChecked && <CheckIcon size={10} />}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: `1.5px solid ${done ? "var(--accent)" : isOpen ? "var(--accent)" : "rgba(255,255,255,0.12)"}`,
                        background: done ? "var(--accent)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 600,
                        color: done ? "#fff" : isOpen ? "var(--accent)" : "var(--text-muted)",
                        transition: "all 0.25s",
                      }}
                    >
                      {done ? <CheckIcon size={11} /> : si + 1}
                    </div>
                  )}

                  {/* Label */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      color: (isLone ? selfChecked : done) ? "var(--text-muted)" : "var(--text)",
                      textDecorationLine: (isLone && selfChecked) ? "line-through" : "none",
                      textDecorationColor: "rgba(107,107,120,0.5)",
                      textDecorationStyle: "solid",
                      transition: "color 0.2s",
                    }}
                  >
                    {sec.heading.text}
                  </span>

                  {/* Count badge or chevron */}
                  {!isLone && (
                    <>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginRight: 4,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {childDoneCount}/{sec.children.length}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>
                        <ChevronIcon open={isOpen} />
                      </span>
                    </>
                  )}
                </button>

                {/* Children — animated expand */}
                {!isLone && (
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight: isOpen ? `${sec.children.length * 60 + 8}px` : "0px",
                      transition: "max-height 0.3s cubic-bezier(.4,0,.2,1)",
                    }}
                  >
                    <ul style={{ listStyle: "none", padding: "0 0 8px", margin: 0 }}>
                      {sec.children.map((child, ci) => {
                        const key = `${si}-${ci}`;
                        const checked = !!checkedItems[key];
                        const isLevel2 = child.level === 2;
const isLevel3 = child.level >= 3;
                        return (
                          <li key={ci}>
                            <button
                              onClick={() => toggleItem(si, ci)}
                              style={{
                                width: "100%",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: isLevel3
  ? `6px 16px 6px ${16 + 28 + 12 + 20 + 16}px`
  : isLevel2
  ? `8px 16px 8px ${16 + 28 + 12 + 20}px`
  : `10px 16px 10px ${16 + 28 + 12}px`,
                                textAlign: "left",
                                WebkitTapHighlightColor: "transparent",
                                transition: "background 0.15s",
                              }}
                              onTouchStart={(e) =>
                                (e.currentTarget.style.background = "rgba(255,255,255,0.025)")
                              }
                              onTouchEnd={(e) =>
                                (e.currentTarget.style.background = "transparent")
                              }
                            >
                              {/* Checkbox — smaller for level 2 */}
                              {isLevel3 ? (
  <div style={{
    width: 11, height: 11, borderRadius: 2,
    border: `1px solid ${checked ? "var(--accent)" : "rgba(255,255,255,0.1)"}`,
    background: checked ? "var(--accent)" : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color: "#fff", transition: "all 0.2s",
  }}>
    {checked && <CheckIcon size={7} />}
  </div>
) :
                              isLevel2 ? (
                                <div
                                  style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 3,
                                    border: `1px solid ${checked ? "var(--accent)" : "rgba(255,255,255,0.12)"}`,
                                    background: checked ? "var(--accent)" : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: "#fff",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  {checked && <CheckIcon size={8} />}
                                </div>
                              ) : (
                                <div
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 5,
                                    border: `1.5px solid ${checked ? "var(--accent)" : "rgba(255,255,255,0.15)"}`,
                                    background: checked ? "var(--accent)" : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    color: "#fff",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  {checked && <CheckIcon size={10} />}
                                </div>
                              )}

                              {/* Text — level 2 is visually subordinate */}
                              <span
                                style={{
                                  fontSize: isLevel2 ? 11 : 13,
                                  color: checked
                                    ? "var(--text-muted)"
                                    : isLevel2
                                    ? "var(--text-muted)"
                                    : "var(--text)",
                                  textDecorationLine: checked ? "line-through" : "none",
                                  textDecorationColor: "rgba(107,107,120,0.5)",
                                  textDecorationStyle: "solid",
                                  transition: "color 0.2s",
                                  lineHeight: 1.4,
                                  letterSpacing: isLevel2 ? "0.01em" : 0,
                                }}
                              >
                                {isLevel2 && (
                                  <span style={{ marginRight: 5, opacity: 0.4, fontSize: 10 }}>↳</span>
                                )}
                                {child.text}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Reset button — only when there's progress */}
        {doneItems > 0 && (
          <div style={{ padding: "24px 16px 0" }}>
            <button
              onClick={() => setCheckedItems({})}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: 13,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.15s",
              }}
            >
              Reset progress
            </button>
          </div>
        )}
      </main>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}