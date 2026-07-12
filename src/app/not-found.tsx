import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="bg-paper bg-graticule">
      <div className="mx-auto flex max-w-6xl flex-col items-start px-6 py-20 md:py-44">
        <p className="coord-label">ERROR 404 · POSITION UNKNOWN</p>
        <h1 className="font-display mt-5 max-w-[16ch] text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.08] text-ink">
          You&apos;re off the charted area.
        </h1>
        <p className="mt-5 max-w-[50ch] text-[1.0625rem] leading-relaxed text-ink-soft">
          This coordinate doesn&apos;t exist on our map. Head back to known
          territory.
        </p>
        <div className="mt-8">
          <Button href="/">Return to base</Button>
        </div>
        <Link
          href="/contact"
          className="mt-6 font-mono text-[0.8125rem] uppercase tracking-[0.12em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Report a broken link →
        </Link>
      </div>
    </main>
  );
}
