"use client";

import { useState, useEffect, useCallback, useMemo, useRef, useDeferredValue, startTransition } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const mountedRef = useRef(false);

  const deferredSearch = useDeferredValue(search);
  const deferredTags = useDeferredValue(selectedTags);
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

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearch(value);
    });
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    startTransition(() => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    });
  }, []);

  const filteredQuotes = useMemo(() => {
    if (!data) return [];
    const lowerSearch = deferredSearch.toLowerCase();
    const quoteTags = deferredTags;
    return data.quotes.filter((quote) => {
      const matchesSearch =
        deferredSearch === "" ||
        quote.text.toLowerCase().includes(lowerSearch) ||
        quote.author.toLowerCase().includes(lowerSearch);
      const matchesTags =
        quoteTags.length === 0 ||
        quoteTags.every((tag) => quote.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [data, deferredSearch, deferredTags]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTags]);

  const quotesPerPage = 50;
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const paginatedQuotes = useMemo(() => {
    const start = (currentPage - 1) * quotesPerPage;
    return filteredQuotes.slice(start, start + quotesPerPage);
  }, [filteredQuotes, currentPage]);

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
              {loading ? (
                <>Fetching updated quotes...</>
              ) : (
                <>
                  {data.totalQuotes} quotes from {data.totalAuthors} authors · Updated {formattedDate}
                </>
              )}
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
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
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
          onSearchChange={handleSearchChange}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      )}

      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
              <div className="h-4 bg-[var(--border-color)] rounded mb-3" />
              <div className="h-4 bg-[var(--border-color)] rounded w-3/4 mb-3" />
              <div className="h-4 bg-[var(--border-color)] rounded w-1/2 mb-4" />
              <div className="h-3 bg-[var(--border-color)] rounded w-1/3" />
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
                startTransition(() => {
                  setSearch("");
                  setSelectedTags([]);
                  setCurrentPage(1);
                });
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedQuotes.map((quote, index) => (
          <QuoteCard key={`${quote.author}-${index}`} quote={quote} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => startTransition(() => setCurrentPage((p) => Math.max(1, p - 1)))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-[var(--border-color)] rounded text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => startTransition(() => setCurrentPage((p) => Math.min(totalPages, p + 1)))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-[var(--border-color)] rounded text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}