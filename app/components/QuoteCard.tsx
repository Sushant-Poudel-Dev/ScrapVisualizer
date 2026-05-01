"use client";

import { useState } from "react";
import type { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const maxLength = 200;
  const shouldTruncate = quote.text.length > maxLength;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `"${quote.text}" — ${quote.author}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 hover:bg-[var(--bg-secondary)] transition-colors h-full flex flex-col">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--border-color)]"
        aria-label="Copy quote"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <p className="text-[var(--text-primary)] text-base leading-relaxed mb-3 flex-1 pr-8">
        &ldquo;{shouldTruncate && !expanded ? quote.text.slice(0, maxLength).trim() + "..." : quote.text}&rdquo;
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
          >
            {expanded ? "see less" : "see more"}
          </button>
        )}
      </p>
      <p className="text-[var(--text-muted)] text-sm">— {quote.author}</p>
      {quote.tags.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border-color)] overflow-x-auto">
          {quote.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}