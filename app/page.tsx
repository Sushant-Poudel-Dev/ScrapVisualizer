"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { ScrapeResult, ApiResponse } from "@/types";
import QuoteCard from "./components/QuoteCard";
import SearchFilter from "./components/SearchFilter";
import { useTheme } from "./components/ThemeProvider";

export default function Home() {
  const [data, setData] = useState<ScrapeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const mountedRef = useRef(false);
  const { theme, toggleTheme } = useTheme();

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scrape");

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const json: ApiResponse = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error ?? "Unexpected response from server");
      }

      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    fetchQuotes();
  }, [fetchQuotes]);

  const allTags = useMemo(() => {
    if (!data) return [];
    const tagSet = new Set(data.quotes.flatMap((q) => q.tags));
    return Array.from(tagSet).sort();
  }, [data]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const filteredQuotes = useMemo(() => {
    if (!data) return [];
    return data.quotes.filter((quote) => {
      const lowerSearch = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        quote.text.toLowerCase().includes(lowerSearch) ||
        quote.author.toLowerCase().includes(lowerSearch);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => quote.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [data, search, selectedTags]);

  const formattedDate = data
    ? new Date(data.lastUpdated).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 md:px-8 md:py-12">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
        <div className="flex-1">
          <span className="block text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">
            Curated Collection
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--text-primary)] mb-2">
            Quote Dashboard
          </h1>
          {data && (
            <p className="text-[var(--text-secondary)] text-sm">
              {data.totalQuotes} quotes from {data.totalAuthors} authors · Updated {formattedDate}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="px-4 py-3 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className="p-3 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors disabled:opacity-50"
            onClick={fetchQuotes}
            disabled={loading}
            aria-busy={loading}
            aria-label="Refresh quotes"
          >
            {loading ? "..." : "↻"}
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-4 p-4 mb-6 bg-red-500/20 border border-red-500/50 rounded-lg" role="alert">
          <p className="text-[var(--text-primary)]">{error}</p>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            onClick={fetchQuotes}
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-[var(--border-color)] rounded mb-3" />
              <div className="h-4 bg-[var(--border-color)] rounded w-3/4 mb-3" />
              <div className="h-4 bg-[var(--border-color)] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && filteredQuotes.length === 0 && data && (
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg">
          <p className="text-[var(--text-secondary)] mb-4">No quotes found</p>
          {(search || selectedTags.length > 0) && (
            <button
              className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded hover:bg-[var(--bg-secondary)] transition-colors"
              onClick={() => {
                setSearch("");
                setSelectedTags([]);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote, index) => (
          <QuoteCard key={`${quote.author}-${index}`} quote={quote} />
        ))}
      </div>
    </main>
  );
}