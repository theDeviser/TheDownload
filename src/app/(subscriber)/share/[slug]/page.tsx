import { Newspaper } from "lucide-react";

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const displayName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" & ");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
          <Newspaper size={28} className="text-gold" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground">
          {displayName}&apos;s Download
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-muted">
          A daily digest of everything that matters, translated into
          plain English. No jargon, no doom-scrolling required.
        </p>
        <div className="mt-8 rounded-xl border border-dashed border-card-border bg-card-bg/50 px-8 py-12">
          <p className="font-sans text-sm text-muted/60">
            No digest published yet. Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
