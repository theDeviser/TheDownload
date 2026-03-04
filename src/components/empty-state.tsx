"use client";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 font-serif text-4xl text-gold/20">—</div>
      <h2 className="mb-2 font-serif text-xl text-foreground/60">
        No briefing for this day
      </h2>
      <p className="font-sans text-sm text-muted">
        Either your partner took a day off from doom-scrolling
        <br />
        (unlikely) or we haven&apos;t generated this one yet.
      </p>
    </div>
  );
}
