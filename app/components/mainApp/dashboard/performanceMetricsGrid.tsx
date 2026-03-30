import type { PerformanceMetrics } from "@/lib/api/types";

type Props = {
  metrics: PerformanceMetrics | null;
  loading?: boolean;
};

type Card = {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
};

function toneClasses(tone: Card["tone"]) {
  if (tone === "good") return "border-[#14b8a6]/30 text-[#2dd4bf]";
  if (tone === "warn") return "border-rose-500/30 text-rose-300";
  return "border-[#334155] text-white";
}

function pct(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(1)}%`;
}

export default function PerformanceMetricsGrid({ metrics, loading }: Props) {
  const cards: Card[] = metrics
    ? [
        { label: "Daily Return", value: pct(metrics.daily_return), tone: metrics.daily_return >= 0 ? "good" : "warn" },
        { label: "Monthly Return", value: pct(metrics.monthly_return), tone: metrics.monthly_return >= 0 ? "good" : "warn" },
        { label: "YTD Return", value: pct(metrics.year_to_date_return), tone: metrics.year_to_date_return >= 0 ? "good" : "warn" },
        { label: "Volatility", value: `${(metrics.volatility * 100).toFixed(0)}%`, tone: "neutral" },
        { label: "Sharpe Ratio", value: metrics.sharpe_ratio.toFixed(2), tone: "neutral" },
        { label: "Max Drawdown", value: pct(metrics.max_drawdown_percent), tone: "warn" },
      ]
    : [];

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Performance metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Risk and Return Snapshot</h3>
      </header>

      {loading && cards.length === 0 && (
        <p className="text-sm text-neutral-400">Loading&hellip;</p>
      )}

      {!loading && !metrics && (
        <p className="text-sm text-neutral-500">No metrics available. Create a snapshot first.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border bg-black p-4 ${toneClasses(card.tone)}`}>
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
