"use client";

import { ScrollText } from "lucide-react";

type LogStatus = "success" | "error" | "warning" | "info";

interface LogEvent {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  status: LogStatus;
}

const MOCK_LOGS: LogEvent[] = [
  {
    id: "1",
    timestamp: "2026-03-04T09:15:00Z",
    type: "digest_published",
    message: "Daily digest published for workspace 'alex-and-sam'",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2026-03-04T09:14:32Z",
    type: "llm_summarization",
    message: "Summarized 6 articles using gpt-4o-mini (1,240 tokens)",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2026-03-04T09:12:05Z",
    type: "webhook_received",
    message: "Ingestion webhook received from X (platform: x)",
    status: "info",
  },
  {
    id: "4",
    timestamp: "2026-03-04T08:45:00Z",
    type: "llm_failed",
    message: "LLM summarization failed: Rate limit exceeded (429). Retrying in 60s.",
    status: "error",
  },
  {
    id: "5",
    timestamp: "2026-03-04T08:30:12Z",
    type: "rss_fetch",
    message: "Fetched 12 new items from TechCrunch RSS feed",
    status: "success",
  },
  {
    id: "6",
    timestamp: "2026-03-04T08:00:00Z",
    type: "cron_triggered",
    message: "Daily generation cron job triggered",
    status: "info",
  },
  {
    id: "7",
    timestamp: "2026-03-03T21:15:44Z",
    type: "webhook_received",
    message: "Ingestion webhook received from Substack (platform: substack)",
    status: "info",
  },
  {
    id: "8",
    timestamp: "2026-03-03T18:30:00Z",
    type: "embedding_generated",
    message: "Generated vector embeddings for 4 new ingestions",
    status: "success",
  },
  {
    id: "9",
    timestamp: "2026-03-03T14:22:10Z",
    type: "rss_fetch",
    message: "RSS fetch warning: CoinDesk feed returned partial data (timeout)",
    status: "warning",
  },
  {
    id: "10",
    timestamp: "2026-03-03T09:15:00Z",
    type: "digest_published",
    message: "Daily digest published for workspace 'alex-and-sam'",
    status: "success",
  },
];

const STATUS_STYLES: Record<LogStatus, { bg: string; text: string; label: string }> = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Success" },
  error: { bg: "bg-red-500/10", text: "text-red-400", label: "Error" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Warning" },
  info: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Info" },
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatEventType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LogsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
          <ScrollText size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            System Logs
          </h1>
          <p className="font-sans text-sm text-muted">
            Activity feed and system events
          </p>
        </div>
      </div>

      {/* Log table */}
      <div className="overflow-hidden rounded-xl border border-card-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border bg-card-bg">
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                  Message
                </th>
                <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {MOCK_LOGS.map((log) => {
                const style = STATUS_STYLES[log.status];
                return (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-card-bg/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-sans text-sm text-foreground">
                      {formatEventType(log.type)}
                    </td>
                    <td className="max-w-md truncate px-4 py-3 font-sans text-sm text-muted">
                      {log.message}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-medium ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
