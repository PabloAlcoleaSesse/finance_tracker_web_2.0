import { formatPercent } from "@/app/components/mainApp/mock/format";

type ComparisonMetricsProps = {
  metrics: {
    portfolio_return: number;
    benchmark_return: number;
    alpha: number;
    beta: number;
    portfolio_sharpe: number;
    benchmark_sharpe: number;
    correlation: number;
    tracking_error: number;
    information_ratio: number;
  };
};

export default function ComparisonMetrics({ metrics }: ComparisonMetricsProps) {
  const cards = [
    { label: "Portfolio Return", value: formatPercent(metrics.portfolio_return) },
    { label: "Benchmark Return", value: formatPercent(metrics.benchmark_return) },
    { label: "Alpha", value: formatPercent(metrics.alpha) },
    { label: "Beta", value: metrics.beta.toFixed(2) },
    { label: "Portfolio Sharpe", value: metrics.portfolio_sharpe.toFixed(2) },
    { label: "Benchmark Sharpe", value: metrics.benchmark_sharpe.toFixed(2) },
    { label: "Correlation", value: metrics.correlation.toFixed(2) },
    { label: "Tracking Error", value: formatPercent(metrics.tracking_error) },
    { label: "Information Ratio", value: metrics.information_ratio.toFixed(2) },
  ];

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Comparison metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Alpha and Risk Breakdown</h3>
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
