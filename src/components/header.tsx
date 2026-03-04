"use client";

export function Header() {
  return (
    <header className="pt-12 pb-2 text-center">
      <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        The Download
      </h1>
      <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted sm:text-base">
        everything your spouse was doom-scrolling today,
        <br />
        explained like you&apos;re a normal person.
      </p>
      <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
    </header>
  );
}
