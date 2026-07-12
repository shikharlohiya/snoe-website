# SNOE Website

Marketing site for SNOE — the Supplier Network Optimization Engine. Built with
Next.js 16 (App Router), Tailwind CSS v4, and Framer Motion in a "Cartographic
Editorial" design language: paper surfaces, ink typography, signal-orange
accent, survey-map graphics.

## Pages

| Route | Content |
| --- | --- |
| `/` | Hero survey map, problem stats, tier blind-spot, agentic loop, capabilities |
| `/solutions` | Architecture, 12-agent roster, interactive disruption simulations |
| `/about` | Mission, why-now, 4-phase roadmap timeline, operating principles |
| `/investors` | Market sizing figure, business model, targets, competitive table |
| `/whitepaper` | Dossier contents + gated PDF download (company email required) |
| `/contact` | Inquiry form + engagement process |

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes static)
npm run lint    # eslint
```

## Lead capture (required for live forms)

Both the contact form and whitepaper registration submit through
[Web3Forms](https://web3forms.com) — submissions are emailed to the address you
register there.

1. Create a free access key at https://web3forms.com
2. `cp .env.local.example .env.local`
3. Paste the key into `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`

Without a key the forms render fine but submissions fail with a visible error.
The key is public by design; spam is mitigated by a honeypot field and
Web3Forms' own filtering. The whitepaper gate is lead capture, not access
control — the PDF is a public static asset.

## Whitepaper PDF

Source lives in `whitepaper-src/` (plain HTML + print CSS). After editing:

```bash
npm run whitepaper   # regenerates public/snoe-whitepaper.pdf via headless Chrome
```

## Before launch

- Replace the placeholder domain in `src/lib/site.ts` (`SITE.url`) with the
  real production domain — sitemap, robots, and OG URLs derive from it.
