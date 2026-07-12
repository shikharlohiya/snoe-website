"use client";

// Whitepaper registration gate → Web3Forms.
// Company email is a HARD requirement here (lead quality).
// Registration is remembered in localStorage so returning
// readers skip straight to the download. The PDF itself is a
// public static asset — this gate is lead capture, not access
// control.

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Stamp from "@/components/ui/Stamp";
import { isCompanyEmail, isValidEmail } from "@/lib/freeEmailDomains";
import { submitLead } from "@/lib/web3forms";

type Status = "idle" | "submitting" | "success" | "error";

const STORAGE_KEY = "snoe:wp-registered";
const PDF_PATH = "/snoe-whitepaper.pdf";

const INPUT_CLS =
  "w-full rounded-lg border border-hairline bg-paper px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/50";

export default function WhitepaperGate() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Returning registrants skip the form. Server snapshot is
  // false so SSR always renders the form; the client corrects
  // itself after hydration without a cascading-render effect.
  const alreadyRegistered = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(STORAGE_KEY) === "1",
    () => false
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (data.get("botcheck")) return; // honeypot

    const email = String(data.get("email") ?? "");
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!isCompanyEmail(email)) {
      setErrorMsg("Please use your company email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const result = await submitLead({
      subject: "SNOE — Whitepaper registration",
      name: String(data.get("name") ?? ""),
      email,
      company: String(data.get("company") ?? ""),
    });

    if (result.ok) {
      localStorage.setItem(STORAGE_KEY, "1");
      setStatus("success");
    } else {
      setErrorMsg(result.message || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (alreadyRegistered || status === "success") {
    return (
      <div className="crop-marks rounded-xl border border-hairline bg-paper-raised p-8">
        <Stamp>Cleared for release</Stamp>
        <h3 className="font-display mt-6 text-2xl font-semibold text-ink">
          Your copy is ready.
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
          Thanks for registering. The whitepaper is cleared for download.
        </p>
        <div className="mt-7">
          <Button href={PDF_PATH}>Download whitepaper</Button>
        </div>
        <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-faint">
          SNOE-WP-001 · PDF · v1.0
        </p>
      </div>
    );
  }

  return (
    <div className="crop-marks rounded-xl border border-hairline bg-paper-raised p-8">
      <p className="coord-label">Registration required</p>
      <h3 className="font-display mt-3 text-xl font-semibold text-ink">
        Get the whitepaper.
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Register with your company email and the download unlocks immediately.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="wp-name" className="coord-label mb-2 block">
            Name *
          </label>
          <input id="wp-name" name="name" required autoComplete="name" className={INPUT_CLS} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="wp-company" className="coord-label mb-2 block">
            Company *
          </label>
          <input id="wp-company" name="company" required autoComplete="organization" className={INPUT_CLS} placeholder="Acme Manufacturing" />
        </div>
        <div>
          <label htmlFor="wp-email" className="coord-label mb-2 block">
            Company email *
          </label>
          <input
            id="wp-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={INPUT_CLS}
            placeholder="jane@company.com"
          />
        </div>

        {status === "error" && (
          <p role="alert" className="border border-accent bg-accent-wash px-4 py-3 text-sm text-accent-deep">
            {errorMsg}
          </p>
        )}

        <Button type="submit" disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Registering…" : "Register & download"}
        </Button>
      </form>
    </div>
  );
}
