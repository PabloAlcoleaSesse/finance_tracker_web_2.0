export default function AlphaBetaExplanation() {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Definitions</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Alpha, Beta, Sharpe</h3>
      </header>
      <div className="space-y-3 text-sm text-neutral-300">
        <p>
          <span className="font-semibold text-white">Alpha</span> measures excess return relative to benchmark.
          Positive alpha means the portfolio outperformed after accounting for market exposure.
        </p>
        <p>
          <span className="font-semibold text-white">Beta</span> measures sensitivity to benchmark moves.
          A beta of 1.03 means portfolio moves slightly more than the benchmark on average.
        </p>
        <p>
          <span className="font-semibold text-white">Sharpe Ratio</span> measures risk-adjusted return.
          Higher values indicate better return per unit of volatility.
        </p>
      </div>
    </section>
  );
}
