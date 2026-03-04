"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";

const TOPICS: { id: Category; label: string; emoji: string; description: string }[] = [
  { id: "ai", label: "AI & Tech", emoji: "🤖", description: "Artificial intelligence, gadgets, and the future" },
  { id: "crypto", label: "Crypto", emoji: "₿", description: "Bitcoin, Ethereum, and the wild west of digital money" },
  { id: "finance", label: "Wall Street", emoji: "📈", description: "Markets, the Fed, and things that move money" },
  { id: "vc", label: "Venture Capital", emoji: "💰", description: "Startups, funding rounds, and Silicon Valley drama" },
];

const TONE_LABELS = [
  "Just the facts",
  "Light touch",
  "Balanced",
  "Pretty sarcastic",
  "Maximum snark",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<Category[]>([]);
  const [tone, setTone] = useState(3);
  const [partnerName, setPartnerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleTopic = (id: Category) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (partnerName.trim()) {
        await supabase
          .from("profiles")
          .update({ partner_name: partnerName.trim(), onboarding_completed: true })
          .eq("id", user.id);
      } else {
        await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id);
      }

      await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          topics: selectedTopics,
          tone,
        },
        { onConflict: "user_id" },
      );

      router.push("/");
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-10 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-0.5 flex-1 rounded-full transition-colors duration-500"
              style={{
                backgroundColor:
                  i <= step ? "var(--gold)" : "var(--card-border)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                What does your partner
                <br />
                <span className="text-gold">obsess over?</span>
              </h1>
              <p className="mb-8 font-sans text-sm text-muted">
                Pick all the topics they can&apos;t stop reading about.
                We&apos;ll curate their daily briefing around these.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TOPICS.map((topic) => {
                  const selected = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-gold/50 bg-gold/5"
                          : "border-card-border bg-card-bg hover:border-card-border hover:bg-card-bg/80"
                      }`}
                    >
                      <span className="text-2xl">{topic.emoji}</span>
                      <div>
                        <span
                          className={`block font-sans text-sm font-semibold ${
                            selected ? "text-gold" : "text-foreground"
                          }`}
                        >
                          {topic.label}
                        </span>
                        <span className="block font-sans text-xs text-muted">
                          {topic.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={selectedTopics.length === 0}
                className="mt-8 w-full rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                How sarcastic should
                <br />
                <span className="text-gold">we get?</span>
              </h1>
              <p className="mb-10 font-sans text-sm text-muted">
                Slide to set the tone of your daily briefings.
              </p>

              <div className="rounded-xl border border-card-border bg-card-bg p-6 sm:p-8">
                <div className="mb-6 text-center">
                  <span className="font-serif text-xl font-semibold text-gold">
                    {TONE_LABELS[tone - 1]}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={5}
                  value={tone}
                  onChange={(e) => setTone(parseInt(e.target.value, 10))}
                  className="tone-slider w-full accent-gold"
                  style={
                    {
                      "--slider-progress": `${((tone - 1) / 4) * 100}%`,
                    } as React.CSSProperties
                  }
                />

                <div className="mt-3 flex justify-between font-sans text-[10px] uppercase tracking-wider text-muted">
                  <span>Straight facts</span>
                  <span>Maximum snark</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="rounded-full border border-card-border px-6 py-3 font-sans text-sm font-medium text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                One last thing —
                <br />
                <span className="text-gold">what&apos;s your name?</span>
              </h1>
              <p className="mb-8 font-sans text-sm text-muted">
                So we can personalize your briefings. Or skip if you prefer
                &ldquo;Hi love.&rdquo;
              </p>

              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g., Sarah"
                className="w-full rounded-xl border border-card-border bg-card-bg px-4 py-3 font-sans text-foreground placeholder:text-muted/50 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20"
              />

              {error && (
                <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 font-sans text-xs text-red-400">
                  {error}
                </p>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-full border border-card-border px-6 py-3 font-sans text-sm font-medium text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving}
                  className="flex-1 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Setting up..." : "Start my first Download"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
