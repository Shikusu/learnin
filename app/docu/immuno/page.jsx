"use client";
import Link from "next/link";
import { MODULES } from "@/data/modules";
import { useState } from "react";

export default function HomePage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header
        style={{
          background: "#0f1923",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(192,57,43,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(192,57,43,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(192,57,43,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "80px 32px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#c0392b",
                background: "rgba(192,57,43,0.12)",
                padding: "4px 10px",
                borderRadius: 4,
                border: "1px solid rgba(192,57,43,0.25)",
              }}
            >
              Guide Interactif
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Immuno<span style={{ color: "#c0392b" }}>Guide</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#94a3b8",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 40,
            }}
          >
            Almost better than good
          </p>
        </div>
      </header>

      <main
        style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px 80px" }}
      >
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Les cours
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Clique sur un module pour accéder aux fiches interactives
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {MODULES.map((mod, i) => (
            <Link
              key={mod.slug}
              href={`immuno/modules/${mod.slug}`}
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHovered(mod.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  padding: "24px 24px 20px",
                  border: `1px solid ${
                    hovered === mod.slug ? mod.color + "40" : "var(--border)"
                  }`,
                  transition: "all 0.22s ease",
                  transform: hovered === mod.slug ? "translateY(-3px)" : "none",
                  boxShadow:
                    hovered === mod.slug
                      ? `0 12px 32px ${mod.color}18`
                      : "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  animation: "fadeUp 0.4s ease both",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: mod.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {mod.icon}
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: "var(--text)",
                    lineHeight: 1.3,
                  }}
                >
                  {mod.name}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  {mod.subtitle}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {mod.topics.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: mod.bg,
                        color: mod.color,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {mod.topics.length > 3 && (
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        padding: "3px 4px",
                      }}
                    >
                      +{mod.topics.length - 3}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    height: 2,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${mod.color}, ${mod.color}30)`,
                    opacity: hovered === mod.slug ? 1 : 0.3,
                    transition: "opacity 0.22s",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
