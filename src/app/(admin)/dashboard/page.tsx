"use client";

import { useState } from "react";
import { BookmarkPlus, Send, ExternalLink } from "lucide-react";

interface Ingestion {
  id: string;
  author: string;
  platform: "x" | "substack" | "linkedin" | "rss" | "manual";
  snippet: string;
  url: string;
  timestamp: string;
  isCurated: boolean;
}

const PLATFORM_STYLES: Record<string, { label: string; color: string }> = {
  x: { label: "X", color: "bg-cat-ai/20 text-cat-ai" },
  substack: { label: "Substack", color: "bg-cat-finance/20 text-cat-finance" },
  linkedin: { label: "LinkedIn", color: "bg-cat-vc/20 text-cat-vc" },
  rss: { label: "RSS", color: "bg-cat-crypto/20 text-cat-crypto" },
  manual: { label: "Manual", color: "bg-muted/20 text-muted" },
};

const MOCK_INGESTIONS: Ingestion[] = [
  {
    id: "1",
    author: "@pmarca",
    platform: "x",
    snippet:
      "The AI agent economy is going to be bigger than the app economy. Every business process that can be automated will be automated by agents within 3 years. This is not hype, this is the new reality.",
    url: "https://x.com/pmarca/status/example",
    timestamp: "2h ago",
    isCurated: false,
  },
  {
    id: "2",
    author: "Byrne Hobart",
    platform: "substack",
    snippet:
      "The carry trade unwind in Japan is creating second-order effects nobody is pricing in. When the yen strengthens 15% in a week, every levered position built on cheap yen funding gets margin called simultaneously.",
    url: "https://thediff.co/p/example",
    timestamp: "4h ago",
    isCurated: true,
  },
  {
    id: "3",
    author: "Vitalik Buterin",
    platform: "x",
    snippet:
      "Ethereum's roadmap for the next 2 years: focused on L2 scaling, account abstraction becoming default, and making the base layer a credibly neutral settlement layer. The endgame is closer than people think.",
    url: "https://x.com/VitalikButerin/status/example",
    timestamp: "5h ago",
    isCurated: false,
  },
  {
    id: "4",
    author: "Ben Thompson",
    platform: "substack",
    snippet:
      "Microsoft's Copilot strategy is fundamentally different from what Google is doing with Gemini. Microsoft is embedding AI into workflow; Google is trying to replace the workflow entirely. One of these approaches will win.",
    url: "https://stratechery.com/example",
    timestamp: "6h ago",
    isCurated: false,
  },
  {
    id: "5",
    author: "TechCrunch",
    platform: "rss",
    snippet:
      "Anthropic raises $5B at $60B valuation as the AI arms race enters its most capital-intensive phase yet. The round was led by a sovereign wealth fund, signaling a shift in who backs frontier AI labs.",
    url: "https://techcrunch.com/example",
    timestamp: "8h ago",
    isCurated: true,
  },
];

export default function DashboardPage() {
  const [ingestions, setIngestions] = useState(MOCK_INGESTIONS);

  const toggleCurate = (id: string) => {
    setIngestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCurated: !item.isCurated } : item,
      ),
    );
  };

  const curatedCount = ingestions.filter((i) => i.isCurated).length;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Command Center
        </h1>
        <p className="mt-2 font-sans text-sm text-muted">
          Your incoming feed. Curate what goes into today&apos;s Download.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-card-border bg-card-bg px-5 py-3">
        <div className="font-sans text-sm text-muted">
          <span className="font-semibold text-foreground">
            {ingestions.length}
          </span>{" "}
          items in inbox
        </div>
        <div className="h-4 w-px bg-card-border" />
        <div className="font-sans text-sm text-muted">
          <span className="font-semibold text-gold">{curatedCount}</span>{" "}
          selected for digest
        </div>
      </div>

      {/* Ingestion list */}
      <div className="space-y-3">
        {ingestions.map((item) => {
          const platform = PLATFORM_STYLES[item.platform];

          return (
            <div
              key={item.id}
              className={`group rounded-xl border transition-colors ${
                item.isCurated
                  ? "border-gold/30 bg-gold/5"
                  : "border-card-border bg-card-bg hover:border-card-border/80"
              } p-5`}
            >
              {/* Top row: author + platform + time */}
              <div className="mb-3 flex items-center gap-2">
                <span className="font-sans text-sm font-semibold text-foreground">
                  {item.author}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider ${platform.color}`}
                >
                  {platform.label}
                </span>
                <span className="ml-auto font-sans text-xs text-muted/60">
                  {item.timestamp}
                </span>
              </div>

              {/* Snippet */}
              <p className="mb-4 font-sans text-sm leading-relaxed text-foreground/80">
                {item.snippet}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCurate(item.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                    item.isCurated
                      ? "bg-gold/20 text-gold"
                      : "bg-card-border/50 text-muted hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <BookmarkPlus size={14} />
                  {item.isCurated
                    ? "In Today's Download"
                    : "Include in Today's Download"}
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-card-border/50 px-3 py-1.5 font-sans text-xs font-medium text-muted transition-colors hover:bg-card-border hover:text-foreground">
                  <Send size={14} />
                  Send to Notion
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 font-sans text-xs text-muted/50 transition-colors hover:text-foreground"
                >
                  <ExternalLink size={12} />
                  Source
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
