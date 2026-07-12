"use client";

// Sticky top navigation. Paper surface with a hairline rule;
// gains a slight blur/tint once scrolled. Active page gets an
// orange underline. Mobile: hamburger → full-screen paper
// overlay with large serif links.

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { NAV_ITEMS, SITE } from "@/lib/site";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false
  );

  // Lock body scroll while the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b border-hairline transition-colors duration-300",
        scrolled ? "bg-paper/90 backdrop-blur-md" : "bg-paper"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            SNOE
          </span>
          <span className="coord-label hidden sm:inline">
            Supplier Network Optimization Engine
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "relative py-1 text-[0.9rem] font-medium transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                )}
              >
                {label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-accent" />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="rounded-lg bg-accent px-4 py-2 text-[0.875rem] font-semibold text-[#12070A] transition-all hover:bg-accent-deep hover:shadow-[0_0_20px_rgba(255,107,44,0.3)]"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={clsx(
              "h-px w-6 bg-ink transition-transform duration-200",
              menuOpen && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={clsx(
              "h-px w-6 bg-ink transition-transform duration-200",
              menuOpen && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 flex flex-col bg-paper bg-graticule px-6 pt-10 md:hidden"
          >
            {[...NAV_ITEMS, { label: "Contact", href: "/contact" }].map(
              ({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      "font-display block border-b border-hairline py-5 text-3xl font-medium",
                      pathname === href ? "text-accent-deep" : "text-ink"
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              )
            )}
            <p className="coord-label mt-10">{SITE.fullName}</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
