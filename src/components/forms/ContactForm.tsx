"use client";

// Contact inquiry form → Web3Forms.
// Company-email check is a soft warning here (investors and
// advisors may legitimately write from personal addresses).

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { isCompanyEmail, isValidEmail } from "@/lib/freeEmailDomains";
import { submitLead } from "@/lib/web3forms";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = [
  "Product briefing",
  "Pilot inquiry",
  "Investor inquiry",
  "Partnership",
  "Other",
];

const INPUT_CLS =
  "w-full rounded-lg border border-hairline bg-paper-raised px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/50";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [emailNote, setEmailNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function onEmailBlur(value: string) {
    setEmailNote(
      value && isValidEmail(value) && !isCompanyEmail(value)
        ? "Tip: a company email helps us route your inquiry faster."
        : ""
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots that tick it get silently dropped.
    if (data.get("botcheck")) return;

    const email = String(data.get("email") ?? "");
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const result = await submitLead({
      subject: `SNOE — Contact inquiry (${String(data.get("topic"))})`,
      name: String(data.get("name") ?? ""),
      email,
      company: String(data.get("company") ?? ""),
      role: String(data.get("role") ?? ""),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (result.ok) {
      setStatus("success");
      form.reset();
    } else {
      setErrorMsg(result.message || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="crop-marks rounded-xl border border-hairline bg-paper-raised p-8">
        <p className="coord-label text-accent-deep">Transmission received</p>
        <h3 className="font-display mt-3 text-2xl font-semibold text-ink">
          Thank you — we&apos;ll be in touch.
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
          Your inquiry is logged. Expect a reply within two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="coord-label mb-2 block">
            Name *
          </label>
          <input id="name" name="name" required autoComplete="name" className={INPUT_CLS} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="email" className="coord-label mb-2 block">
            Work email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={INPUT_CLS}
            placeholder="jane@company.com"
            onBlur={(e) => onEmailBlur(e.target.value)}
          />
          {emailNote && <p className="mt-1.5 text-xs text-ink-faint">{emailNote}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="coord-label mb-2 block">
            Company *
          </label>
          <input id="company" name="company" required autoComplete="organization" className={INPUT_CLS} placeholder="Acme Manufacturing" />
        </div>
        <div>
          <label htmlFor="role" className="coord-label mb-2 block">
            Role
          </label>
          <input id="role" name="role" autoComplete="organization-title" className={INPUT_CLS} placeholder="VP Supply Chain" />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="coord-label mb-2 block">
          Topic *
        </label>
        <select id="topic" name="topic" required className={INPUT_CLS} defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="coord-label mb-2 block">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={INPUT_CLS}
          placeholder="Tell us about your supplier network and what you'd like to see."
        />
      </div>

      {status === "error" && (
        <p role="alert" className="border border-accent bg-accent-wash px-4 py-3 text-sm text-accent-deep">
          {errorMsg}
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Transmitting…" : "Send inquiry"}
      </Button>
    </form>
  );
}
