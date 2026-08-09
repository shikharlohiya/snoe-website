// ============================================================
// AgentRoster — the Solutions page showpiece.
// All twelve SNOE agents as a technical spec sheet, grouped
// MONITOR / REASONING / ACTION, with mono IDs and techniques.
// Data from the SNOE product development document.
// ============================================================

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

type Agent = {
  id: string;
  name: string;
  role: string;
  techniques: string;
};

type AgentGroup = {
  label: string;
  blurb: string;
  agents: Agent[];
};

const GROUPS: AgentGroup[] = [
  {
    label: "Monitor",
    blurb: "Watch the world. Convert raw signals into structured risk.",
    agents: [
      {
        id: "AGT-M-01",
        name: "Geopolitical Event Detection",
        role: "Converts news and event feeds into structured supplier-risk signals",
        techniques: "TF-IDF · Gradient boosting · Transformer classifiers",
      },
      {
        id: "AGT-M-02",
        name: "Trade Regulation Tracker",
        role: "Classifies tariff, sanction, and export-control changes by type and severity",
        techniques: "Decision trees · Random forest · Gradient boosting",
      },
      {
        id: "AGT-M-03",
        name: "Logistics Disruption Detection",
        role: "Flags abnormal shipping delays across ports, lanes, and carriers",
        techniques: "Isolation forest · Z-score anomaly detection · K-means",
      },
      {
        id: "AGT-M-04",
        name: "Supplier Health Monitoring",
        role: "Predicts supplier distress before it becomes a missed delivery",
        techniques: "Random forest · XGBoost · Imputation pipelines",
      },
    ],
  },
  {
    label: "Reasoning",
    blurb: "Map events onto the network. Quantify what cascades where.",
    agents: [
      {
        id: "AGT-R-01",
        name: "Network Impact Analysis",
        role: "Models cascading risk through the multi-tier knowledge graph",
        techniques: "Graph centrality · Edge weighting · Impact scoring",
      },
      {
        id: "AGT-R-02",
        name: "Disruption Propagation",
        role: "Forecasts how a delay ripples downstream over time",
        techniques: "ARIMA · LSTM · Gradient-boost regression",
      },
      {
        id: "AGT-R-03",
        name: "Risk Classification",
        role: "Sorts suppliers into risk tiers as conditions change",
        techniques: "Random forest · Class-weighted ensembles · SMOTE",
      },
      {
        id: "AGT-R-04",
        name: "Multi-Objective Optimization",
        role: "Trades off cost, lead time, and resilience explicitly",
        techniques: "Linear programming · Genetic algorithms · Cost models",
      },
    ],
  },
  {
    label: "Action",
    blurb: "Turn analysis into governed moves — and explain every one.",
    agents: [
      {
        id: "AGT-A-01",
        name: "Mitigation Options",
        role: "Ranks alternative suppliers, countries, and routes",
        techniques: "Collaborative filtering · Ranking models · Clustering",
      },
      {
        id: "AGT-A-02",
        name: "Scenario Simulation",
        role: "Simulates tariff and geopolitical shock outcomes before they land",
        techniques: "Monte Carlo simulation · Gradient-boost regression",
      },
      {
        id: "AGT-A-03",
        name: "Explainable Recommendations",
        role: "Attaches plain-language rationale to every recommendation",
        techniques: "SHAP · Feature importance · Interpretation layer",
      },
      {
        id: "AGT-A-04",
        name: "Autonomous Low-Risk Actions",
        role: "Executes governed, reversible decisions like re-routing",
        techniques: "Q-learning · Policy gradients · Reward shaping",
      },
    ],
  },
];

export default function AgentRoster() {
  return (
    <section className="rule-b bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Personnel File — 12 Agents"
            title="The agent roster."
            lede="SNOE is staffed by twelve specialized AI agents operating on the shared supplier knowledge graph — four that monitor, four that reason, four that act."
          />
        </Reveal>

        <div className="mt-8 md:mt-14 space-y-12">
          {GROUPS.map((group) => (
            <Reveal key={group.label}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-3">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-ink">
                  {group.label}
                </h3>
                <p className="text-sm italic text-ink-faint">{group.blurb}</p>
              </div>

              <ul>
                {group.agents.map((agent) => (
                  <li
                    key={agent.id}
                    className="grid gap-x-6 gap-y-1 border-b border-l-2 border-hairline border-l-transparent py-4 pl-3 transition-colors hover:border-l-accent hover:bg-paper-raised md:grid-cols-[7.5rem_15rem_1fr] md:items-baseline"
                  >
                    <span className="font-mono text-xs font-medium text-accent-deep">
                      {agent.id}
                    </span>
                    <span className="font-display text-[1.0625rem] font-semibold leading-snug text-ink">
                      {agent.name}
                    </span>
                    <span className="text-sm leading-relaxed text-ink-soft">
                      {agent.role}
                      {/* ML technique detail HIDDEN on the public site —
                          Everstream and peers don't publish their algorithms.
                          Restore by un-commenting; data still lives in the
                          `techniques` field of each agent above.
                      <span className="mt-1 hidden font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint sm:block">
                        {agent.techniques}
                      </span>
                      */}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
