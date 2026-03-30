"use client";

import { useEffect, useMemo, useState } from "react";
import BenchmarkSelector from "@/app/components/mainApp/benchmarks/benchmarkSelector";
import ComparisonChart from "@/app/components/mainApp/benchmarks/comparisonChart";
import ComparisonMetrics from "@/app/components/mainApp/benchmarks/comparisonMetrics";
import AlphaBetaExplanation from "@/app/components/mainApp/benchmarks/alphaBetaExplanation";
import RiskMetricsTable from "@/app/components/mainApp/benchmarks/riskMetricsTable";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useAnalytics } from "@/app/hooks/api/useAnalytics";
import { formatPercent } from "@/app/components/mainApp/mock/format";

const benchmarkOptions = ["SPY", "VOO", "QQQ", "VTI"];

function monthsToRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 6);
  return { from: from.toISOString(), to: to.toISOString() };
}

export default function BenchmarksView() {
  const { selectedPortfolioId } = usePortfolio();
  const { benchmark, loading, error, loadBenchmark } = useAnalytics();
  const [selectedBenchmark, setSelectedBenchmark] = useState("SPY");
  const fallbackRange = useMemo(() => monthsToRange(), []);

  useEffect(() => {
    if (!selectedPortfolioId) {
      return;
    }
    void loadBenchmark(selectedPortfolioId, selectedBenchmark, monthsToRange());
  }, [selectedPortfolioId, selectedBenchmark, loadBenchmark]);

  const chartLabels = [
    benchmark?.start_date ?? fallbackRange.from,
    benchmark?.end_date ?? fallbackRange.to,
  ];
  const chartPortfolio = [1, 1 + (benchmark?.portfolio_return ?? 0)];
  const chartBenchmark = [1, 1 + (benchmark?.benchmark_return ?? 0)];

  const metrics = useMemo(
    () => ({
      portfolio_return: benchmark?.portfolio_return ?? 0,
      benchmark_return: benchmark?.benchmark_return ?? 0,
      alpha: benchmark?.alpha ?? 0,
      beta: benchmark?.beta ?? 0,
      portfolio_sharpe: benchmark?.portfolio_sharpe_ratio ?? 0,
      benchmark_sharpe: benchmark?.benchmark_sharpe_ratio ?? 0,
      correlation: benchmark?.correlation ?? 0,
      tracking_error: benchmark?.tracking_error ?? 0,
      information_ratio: benchmark?.information_ratio ?? 0,
    }),
    [benchmark],
  );

  const riskRows = useMemo(
    () => [
      {
        label: "Volatility",
        portfolio: formatPercent(benchmark?.portfolio_volatility ?? 0),
        benchmark: formatPercent(benchmark?.benchmark_volatility ?? 0),
      },
      {
        label: "Tracking Error",
        portfolio: formatPercent(benchmark?.tracking_error ?? 0),
        benchmark: "-",
      },
      {
        label: "Correlation",
        portfolio: (benchmark?.correlation ?? 0).toFixed(2),
        benchmark: "1.00",
      },
      {
        label: "Information Ratio",
        portfolio: (benchmark?.information_ratio ?? 0).toFixed(2),
        benchmark: "-",
      },
    ],
    [benchmark],
  );

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Analytics</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Benchmark Comparison</h1>
        </header>

        {loading ? <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">Loading benchmark comparison...</p> : null}
        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}

        <BenchmarkSelector
          options={benchmarkOptions}
          selected={selectedBenchmark}
          onSelect={setSelectedBenchmark}
        />

        <ComparisonChart
          labels={chartLabels}
          portfolio={chartPortfolio}
          benchmark={chartBenchmark}
          benchmarkSymbol={selectedBenchmark}
        />

        <ComparisonMetrics metrics={metrics} />

        <section className="grid gap-4 xl:grid-cols-2">
          <RiskMetricsTable benchmarkSymbol={selectedBenchmark} rows={riskRows} />
          <AlphaBetaExplanation />
        </section>
      </div>
    </div>
  );
}
