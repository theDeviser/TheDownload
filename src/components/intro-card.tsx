"use client";

interface IntroCardProps {
  text: string;
}

export function IntroCard({ text }: IntroCardProps) {
  return (
    <div className="relative mb-10 rounded-xl border border-card-border bg-card-bg px-6 py-6 sm:px-8 sm:py-8">
      <div className="absolute -top-3 left-6 sm:left-8">
        <span className="rounded-full bg-gold/10 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
          Today&apos;s Briefing
        </span>
      </div>
      <p className="font-sans text-sm leading-[1.8] text-foreground/80 sm:text-base sm:leading-[1.9]">
        {text}
      </p>
    </div>
  );
}
