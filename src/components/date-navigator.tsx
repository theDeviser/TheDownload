"use client";

import { formatDateForDisplay } from "@/lib/mock-data";

interface DateNavigatorProps {
  currentDate: string;
  onNavigate: (direction: "prev" | "next") => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function DateNavigator({
  currentDate,
  onNavigate,
  hasNext,
  hasPrev,
}: DateNavigatorProps) {
  const displayDate = formatDateForDisplay(currentDate);

  return (
    <nav className="flex items-center justify-center gap-4 py-6 sm:gap-6">
      <button
        onClick={() => onNavigate("prev")}
        disabled={!hasPrev}
        className="group flex h-9 w-9 items-center justify-center rounded-full border border-card-border transition-all hover:border-gold/50 hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-25"
        aria-label="Previous day"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-muted transition-colors group-hover:text-gold"
        >
          <path
            d="M8.5 3L4.5 7L8.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="text-center">
        <span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
          {displayDate}
        </span>
      </div>

      <button
        onClick={() => onNavigate("next")}
        disabled={!hasNext}
        className="group flex h-9 w-9 items-center justify-center rounded-full border border-card-border transition-all hover:border-gold/50 hover:bg-gold/5 disabled:cursor-not-allowed disabled:opacity-25"
        aria-label="Next day"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-muted transition-colors group-hover:text-gold"
        >
          <path
            d="M5.5 3L9.5 7L5.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
