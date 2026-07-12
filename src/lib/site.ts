// ============================================================
// Single source of truth for site-wide constants:
// name, URL, contact email, nav items.
// ============================================================

export const SITE = {
  name: "SNOE",
  fullName: "Supplier Network Optimization Engine",
  url: "https://snoe-ai.com",
  email: "snoetech@gmail.com",
  description:
    "SNOE is an agentic AI decision-intelligence platform that models multi-tier supplier ecosystems as living networks — sensing geopolitical, tariff, and logistics risk, and recommending explainable actions before disruption reaches production.",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation (Contact is rendered as the nav CTA button). */
export const NAV_ITEMS: NavItem[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Whitepaper", href: "/whitepaper" },
  { label: "Investors", href: "/investors" },
];

export const FOOTER_LINKS = {
  pages: [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: "About", href: "/about" },
    { label: "Investors", href: "/investors" },
  ],
  resources: [
    { label: "Whitepaper", href: "/whitepaper" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
} as const;
