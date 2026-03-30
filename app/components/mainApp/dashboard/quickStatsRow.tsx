import type { PortfolioSummary, PositionWithMetrics } from "@/lib/api/types";

type Props = {
  summary: PortfolioSummary | null;
  positions: PositionWithMetrics[];
};

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

export default function QuickStatsRow({ summary, positions }: Props) {
  const assetTypes = new Set(positions.map((p) => p.asset_type)).size;
  const unrealizedGains = summary ? summary.total_gain : null;

  const stats = [
    { label: "Total Positions", value: positions.length > 0 ? String(positions.length) : "--" },
    { label: "Diversification", value: assetTypes > 0 ? `${assetTypes} Asset Types` : "--" },
    { label: "Unrealized Gains", value: unrealizedGains !== null ? eur.format(unrealizedGains) : "--" },
    { label: "Base Currency", value: summary?.base_currency ?? "--" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{stat.label}</p>
          <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
        </article>
      ))}
    </section>
  );
}
