// Trust strip — the logo bar every enterprise site opens with.
// Pre-launch, so it names target industries instead of
// customers; a slow marquee keeps it alive.

const INDUSTRIES = [
  "Automotive OEMs",
  "EV Manufacturers",
  "Aerospace Primes",
  "Industrial Equipment",
  "Electronics Manufacturing",
  "Tier-1 · 2 · 3 Suppliers",
];

export default function IndustriesStrip() {
  // Duplicate once for a seamless marquee loop
  const items = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section className="rule-b bg-bone">
      <div className="mx-auto max-w-6xl overflow-hidden px-6 py-6">
        <p className="coord-label mb-4 text-center">
          Built for complex, exposed supplier networks
        </p>
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="animate-marquee gap-12">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-display whitespace-nowrap text-[1.0625rem] font-medium tracking-wide text-ink-soft"
                aria-hidden={i >= INDUSTRIES.length}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
