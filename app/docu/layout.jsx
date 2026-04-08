"use client";
import { useRouter } from "next/navigation";

export default function DocuLayout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Sticky back nav */}
      <nav className="sticky top-0 z-10 flex items-center px-6 py-4 border-b border-white/6 backdrop-blur-xl bg-(--bg)/75">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--text) transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </nav>

      {children}
    </div>
  );
}