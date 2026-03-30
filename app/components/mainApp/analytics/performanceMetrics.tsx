import { formatPercent } from "@/app/components/mainApp/mock/format";

type PerformanceMetricsProps = {
  metrics: {
    total_return: number;
    annualized_return: number;
    volatility: number;
    sharpe_ratio: number;
    max_drawdown: number;
    ytd_return: number;
  };
};

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const cards = [
    { label: "Total Return", value: formatPercent(metrics.total_return) },
    { label: "Annualized Return", value: formatPercent(metrics.annualized_return) },
    { label: "Volatility", value: formatPercent(metrics.volatility) },
    { label: "Sharpe Ratio", value: metrics.sharpe_ratio.toFixed(2) },
    { label: "Max Drawdown", value: formatPercent(metrics.max_drawdown) },
    { label: "YTD Return", value: formatPercent(metrics.ytd_return) },
  ];

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Risk and Return Metrics</h3>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-[#334155] bg-black p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
