import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-3">Not Found</h2>
        <p className="text-[var(--text-secondary)] mb-6">Could not find the requested resource</p>
        <Link 
          href='/'
          className="inline-block px-5 py-2.5 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
