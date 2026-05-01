import type { Quote } from "@/types";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5 hover:bg-[var(--bg-secondary)] transition-colors h-full flex flex-col">
      <p className="text-[var(--text-primary)] text-base leading-relaxed mb-3 flex-1">
        &ldquo;{truncateText(quote.text, 200)}&rdquo;
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