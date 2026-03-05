import Link from "next/link";
import {
  Newspaper,
  ArrowRight,
  Rss,
  Sparkles,
  Send,
  Shield,
  Brain,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5">
              <Newspaper size={14} className="text-gold" />
              <span className="font-sans text-xs font-medium text-gold">
                Your daily briefing, translated
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Everything your spouse was{" "}
              <span className="text-gold">doom-scrolling</span> today
            </h1>

            <p className="mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed text-muted sm:text-xl">
              explained like you&apos;re a normal person. No jargon, no
              panic, just the stories that actually matter.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-8 font-sans text-sm font-semibold text-background transition-all hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-card-border bg-card-bg/50 px-8 font-sans text-sm font-medium text-foreground transition-colors hover:border-gold/30 hover:text-gold"
              >
                See a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-card-border bg-card-bg/30">
        <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-sans text-sm text-muted">
              Three steps from doom-scroll chaos to a clean, daily briefing
              your partner will actually enjoy reading.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Rss,
                title: "Curate",
                description:
                  "Save articles, tweets, and threads from your daily scroll. We ingest from RSS, X, Substack, and more.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Translate",
                description:
                  "Our AI rewrites the complex jargon into witty, human-readable summaries anyone can understand.",
              },
              {
                step: "03",
                icon: Send,
                title: "Share",
                description:
                  "Your partner gets a beautiful daily digest with a unique link. No app install, no account required.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-card-border bg-card-bg/50 p-8 transition-all hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl font-bold text-gold/30">
                    {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                    <item.icon size={20} className="text-gold" />
                  </div>
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-card-border">
        <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Built for Curators
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-sans text-sm text-muted">
              More than a newsletter tool. The Download is your personal
              knowledge base with superpowers.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Brain,
                title: "Second Brain",
                description:
                  "Every article you save becomes searchable. Ask your feed anything with AI-powered RAG queries.",
              },
              {
                icon: Shield,
                title: "Privacy-First Sharing",
                description:
                  "Subscribers get a unique link. No tracking, no account required. Just clean, curated content.",
              },
              {
                icon: Zap,
                title: "Instant Ingestion",
                description:
                  "Webhooks, browser extensions, and API integrations. Save from X, Substack, LinkedIn, and RSS.",
              },
              {
                icon: Sparkles,
                title: "AI Translation",
                description:
                  "GPT-powered summaries that turn dense tech jargon into something your partner actually wants to read.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-xl border border-card-border bg-card-bg/30 p-6 transition-colors hover:border-gold/15"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                  <feature.icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border bg-card-bg/30">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Ready to translate the chaos?
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-muted">
            Start curating your daily digest today. Free during beta, no
            credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-8 font-sans text-sm font-semibold text-background transition-all hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-gold/60" />
            <span className="font-sans text-xs text-muted/60">
              The Download &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/demo"
              className="font-sans text-xs text-muted/60 transition-colors hover:text-foreground"
            >
              Demo
            </Link>
            <Link
              href="/auth/login"
              className="font-sans text-xs text-muted/60 transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
