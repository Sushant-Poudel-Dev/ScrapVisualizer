"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-3">Something went wrong</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          className="px-5 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}