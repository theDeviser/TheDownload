"use client";

import {
  CATEGORY_META,
  INTENSITY_META,
  type StoryItem,
} from "@/lib/mock-data";

interface StoryCardProps {
  story: StoryItem;
}

export function StoryCard({ story }: StoryCardProps) {
  const category = CATEGORY_META[story.category];
  const intensity = INTENSITY_META[story.intensityTag];

  return (
    <article className="group relative flex gap-4 border-t border-card-border py-8 first:border-t-0 sm:gap-6">
      <div className="flex-shrink-0 pt-1">
        <span className="font-serif text-2xl font-bold text-gold/25 transition-colors duration-300 group-hover:text-gold/50 sm:text-3xl">
          {story.position}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider ${category.colorClass}`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${category.dotClass}`}
            />
            {category.label}
          </span>
          <span
            className={`font-sans text-[10px] font-bold uppercase tracking-wider ${intensity.colorClass}`}
          >
            {intensity.label}
          </span>
        </div>

        <h2 className="mb-3 font-serif text-lg font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-gold/90 sm:text-xl sm:leading-snug">
          {story.headline}
        </h2>

        <p className="mb-4 font-sans text-sm leading-[1.8] text-foreground/70 sm:text-[15px] sm:leading-[1.85]">
          {story.summary}
        </p>

        <a
          href={story.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-muted transition-colors hover:text-gold"
        >
          <span className="uppercase tracking-wider">
            via {story.sourceName}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path
              d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}
