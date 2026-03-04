"use client";

import { useState } from "react";
import {
  Search,
  Sparkles,
  ArrowUp,
  Download,
  ExternalLink,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  formatAsObsidianMarkdown,
  downloadAsMarkdownFile,
  openInObsidian,
} from "@/lib/obsidian/export";

interface SavedArticle {
  id: string;
  title: string;
  author: string;
  sourceUrl: string;
  platform: string;
  date: string;
  summary: string;
  rawText: string;
  tags: string[];
}

const MOCK_ARTICLES: SavedArticle[] = [
  {
    id: "1",
    title: "Why AI Agents Are the Next Platform Shift",
    author: "@pmarca",
    sourceUrl: "https://x.com/pmarca/status/123",
    platform: "x",
    date: "2026-03-04",
    summary:
      "Marc Andreessen argues that AI agents represent a platform shift comparable to mobile. The key insight: agents don't just automate tasks, they create entirely new categories of software.",
    rawText:
      "Thread: AI agents aren't just automation. They're the next platform. Here's why...",
    tags: ["ai", "venture-capital"],
  },
  {
    id: "2",
    title: "The Japan Carry Trade Unwind Explained",
    author: "Matt Levine",
    sourceUrl: "https://substack.com/finance/japan-carry",
    platform: "substack",
    date: "2026-03-03",
    summary:
      "The yen carry trade is unwinding as the Bank of Japan signals rate hikes. This matters because trillions in leveraged positions could trigger a global margin call.",
    rawText:
      "When the BOJ raised rates, every hedge fund running the carry trade...",
    tags: ["finance", "macro"],
  },
  {
    id: "3",
    title: "Ethereum's Pectra Upgrade: What Actually Changed",
    author: "Vitalik Buterin",
    sourceUrl: "https://vitalik.eth.limo/pectra",
    platform: "rss",
    date: "2026-03-02",
    summary:
      "The Pectra upgrade introduces account abstraction and blob scaling. In plain English: your wallet gets smarter and the network gets cheaper.",
    rawText:
      "The Pectra hard fork introduces EIP-7702 for native account abstraction...",
    tags: ["crypto", "ethereum"],
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  x: "text-blue-400",
  substack: "text-orange-400",
  rss: "text-emerald-400",
  linkedin: "text-sky-400",
  manual: "text-muted",
};

export default function BrainPage() {
  const [query, setQuery] = useState("");
  const [openExportId, setOpenExportId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setQuery("");
  };

  const handleDownload = (article: SavedArticle) => {
    const md = formatAsObsidianMarkdown({
      title: article.title,
      sourceUrl: article.sourceUrl,
      author: article.author,
      date: article.date,
      tags: [...article.tags, "the-download"],
      translatedSummary: article.summary,
      rawText: article.rawText,
    });
    downloadAsMarkdownFile(md, article.title);
    setOpenExportId(null);
  };

  const handleOpenObsidian = (article: SavedArticle) => {
    const md = formatAsObsidianMarkdown({
      title: article.title,
      sourceUrl: article.sourceUrl,
      author: article.author,
      date: article.date,
      tags: [...article.tags, "the-download"],
      translatedSummary: article.summary,
      rawText: article.rawText,
    });
    openInObsidian(md, article.title);
    setOpenExportId(null);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-4xl flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Knowledge Base
        </h1>
        <p className="mt-2 font-sans text-sm text-muted">
          Ask anything about your saved content. Powered by RAG.
        </p>
      </div>

      {/* Saved Articles */}
      <div className="mb-6">
        <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted">
          Saved Articles
        </h2>
        <div className="space-y-3">
          {MOCK_ARTICLES.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-card-border bg-card-bg/50 p-5 transition-colors hover:border-card-border/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className={`font-sans text-xs font-medium uppercase ${PLATFORM_COLORS[article.platform] || "text-muted"}`}
                    >
                      {article.platform}
                    </span>
                    <span className="text-muted/30">&middot;</span>
                    <span className="font-sans text-xs text-muted">
                      {article.author}
                    </span>
                    <span className="text-muted/30">&middot;</span>
                    <span className="font-sans text-xs text-muted">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">
                    {article.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gold/10 px-2 py-0.5 font-sans text-[10px] font-medium text-gold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Export dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setOpenExportId(
                        openExportId === article.id ? null : article.id,
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 font-sans text-xs text-muted transition-colors hover:border-gold/30 hover:text-foreground"
                  >
                    <FileText size={14} />
                    Export
                    <ChevronDown size={12} />
                  </button>

                  {openExportId === article.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-48 overflow-hidden rounded-xl border border-card-border bg-card-bg shadow-lg">
                      <button
                        onClick={() => handleDownload(article)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-sm text-foreground transition-colors hover:bg-card-border/50"
                      >
                        <Download size={14} className="text-muted" />
                        Download .md
                      </button>
                      <button
                        onClick={() => handleOpenObsidian(article)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-sm text-foreground transition-colors hover:bg-card-border/50"
                      >
                        <ExternalLink size={14} className="text-muted" />
                        Open in Obsidian
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RAG response area */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-card-border bg-card-bg/50 px-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
          <Sparkles size={24} className="text-gold" />
        </div>
        <h2 className="mt-5 font-serif text-xl font-semibold text-foreground">
          Your Second Brain
        </h2>
        <p className="mt-2 max-w-md text-center font-sans text-sm leading-relaxed text-muted">
          Ask questions about your saved content and get AI-powered answers
          grounded in your own feed. Try something like:
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            "What did @pmarca say about AI agents?",
            "Summarize the Japan carry trade thesis",
            "What's the latest on Ethereum's roadmap?",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="rounded-full border border-card-border bg-card-bg px-3.5 py-2 font-sans text-xs text-muted transition-colors hover:border-gold/30 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <form onSubmit={handleSubmit} className="mt-4 pb-4">
        <div className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg px-4 py-3 transition-colors focus-within:border-gold/40">
          <Search size={18} className="shrink-0 text-muted/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your feed..."
            className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder:text-muted/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold text-background transition-opacity disabled:opacity-30"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
