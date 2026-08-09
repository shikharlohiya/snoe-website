// Homepage — server component; interactivity lives in leaves.

import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import IndustriesStrip from "@/components/home/IndustriesStrip";
import ProblemStrip from "@/components/home/ProblemStrip";
import BlindspotSection from "@/components/home/BlindspotSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CapabilitiesGrid from "@/components/home/CapabilitiesGrid";
import QuoteBand from "@/components/home/QuoteBand";
import CtaBand from "@/components/ui/CtaBand";

export const metadata: Metadata = {
  description:
    "SNOE models your suppliers as a living network — sensing geopolitical, tariff, and logistics risk across every tier and recommending explainable actions before disruption reaches production.",
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <IndustriesStrip />
      <ProblemStrip />
      <BlindspotSection />
      <HowItWorksSection />
      <QuoteBand />
      <CapabilitiesGrid />
      <CtaBand />
    </main>
  );
}
