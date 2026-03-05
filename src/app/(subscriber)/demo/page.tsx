"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "@/components/header";
import { DateNavigator } from "@/components/date-navigator";
import { IntroCard } from "@/components/intro-card";
import { StoryCard } from "@/components/story-card";
import { EmptyState } from "@/components/empty-state";
import {
  getDigestForDate,
  getAdjacentDate,
  mockDigests,
  type StoryItem,
} from "@/lib/mock-data";
import { fetchDigestForDate } from "@/lib/api/digest";
import { getCurrentUser } from "@/lib/api/auth";

const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

interface PageDigest {
  introText: string;
  stories: StoryItem[];
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

const slideVariants = {
  enter: (dir: "next" | "prev") => ({
    x: dir === "next" ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: "next" | "prev") => ({
    x: dir === "next" ? -40 : 40,
    opacity: 0,
  }),
};

export default function Home() {
  const [currentDate, setCurrentDate] = useState("2026-03-04");
  const [digest, setDigest] = useState<PageDigest | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      if (USE_SUPABASE) {
        try {
          const user = await getCurrentUser();
          const result = await fetchDigestForDate(currentDate, user?.id);
          if (!cancelled && result) {
            setDigest({
              introText: result.digest.intro_text ?? "",
              stories: result.items.map((item) => ({
                id: item.id,
                position: item.position,
                headline: item.headline,
                category: item.category,
                intensityTag: item.intensity_tag ?? "MEH",
                summary: item.summary,
                sourceUrl: item.source_url,
                sourceName: item.source_name,
              })),
            });
            setLoading(false);
            return;
          }
        } catch {
          // Fall through to mock data
        }
      }

      if (!cancelled) {
        const mock = getDigestForDate(currentDate);
        setDigest(
          mock ? { introText: mock.introText, stories: mock.stories } : null,
        );
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentDate]);

  const handleNavigate = useCallback((dir: "prev" | "next") => {
    setDirection(dir);
    setCurrentDate((prev) => getAdjacentDate(prev, dir));
  }, []);

  const hasPrev = !!mockDigests[getAdjacentDate(currentDate, "prev")];
  const hasNext =
    getAdjacentDate(currentDate, "next") <= getTodayString() &&
    !!mockDigests[getAdjacentDate(currentDate, "next")];

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 pb-16 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
      </motion.div>

      <DateNavigator
        currentDate={currentDate}
        onNavigate={handleNavigate}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />

      <AnimatePresence mode="wait" custom={direction}>
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : digest ? (
          <motion.div
            key={currentDate}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <IntroCard text={digest.introText} />
            <div>
              {digest.stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1 + index * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer
        className="mt-16 border-t border-card-border pt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="font-sans text-xs text-muted/60">
          Made with love (and mild exasperation) by{" "}
          <span className="text-gold/50">The Download</span>
        </p>
      </motion.footer>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Intro card skeleton */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 sm:p-8">
        <div className="mb-4 h-3 w-28 animate-pulse rounded-full bg-foreground/8" />
        <div className="space-y-2.5">
          <div className="h-3 w-full animate-pulse rounded bg-foreground/8" />
          <div className="h-3 w-[90%] animate-pulse rounded bg-foreground/8" />
          <div className="h-3 w-[70%] animate-pulse rounded bg-foreground/8" />
        </div>
      </div>

      {/* Story card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-5 border-t border-card-border pt-8"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-8 w-6 animate-pulse rounded bg-foreground/5" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-14 animate-pulse rounded-full bg-foreground/8" />
              <div className="h-5 w-10 animate-pulse rounded bg-foreground/5" />
            </div>
            <div className="h-5 w-[85%] animate-pulse rounded bg-foreground/10" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full animate-pulse rounded bg-foreground/6" />
              <div className="h-3 w-[95%] animate-pulse rounded bg-foreground/6" />
              <div className="h-3 w-[80%] animate-pulse rounded bg-foreground/6" />
            </div>
            <div className="h-3 w-24 animate-pulse rounded bg-foreground/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
