export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
          <div className="h-4 bg-[var(--border-color)] rounded mb-3" />
          <div className="h-4 bg-[var(--border-color)] rounded w-3/4 mb-3" />
          <div className="h-4 bg-[var(--border-color)] rounded w-1/2 mb-4" />
          <div className="h-3 bg-[var(--border-color)] rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
