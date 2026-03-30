"use client";

import { useMemo, useState } from "react";
import TradingViewChart from "@/app/components/mainApp/charts/tradingViewChart";

type ComparisonChartProps = {
  labels: string[];
  portfolio: number[];
  benchmark: number[];
  benchmarkSymbol: string;
};

export default function ComparisonChart({ labels, portfolio, benchmark, benchmarkSymbol }: ComparisonChartProps) {
  const [fromLabel, setFromLabel] = useState(labels[0]);
  const [toLabel, setToLabel] = useState(labels[labels.length - 1]);

  const filtered = useMemo(() => {
    const fromIdx = labels.indexOf(fromLabel);
    const toIdx = labels.indexOf(toLabel);
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const filteredLabels = labels.slice(start, end + 1);
    const filteredPortfolio = portfolio.slice(start, end + 1);
    const filteredBenchmark = benchmark.slice(start, end + 1);

    if (filteredLabels.length >= 2) {
      return { filteredLabels, filteredPortfolio, filteredBenchmark, start, end };
    }

    return {
      filteredLabels: labels,
      filteredPortfolio: portfolio,
      filteredBenchmark: benchmark,
      start: 0,
      end: labels.length - 1,
    };
  }, [labels, portfolio, benchmark, fromLabel, toLabel]);

  function shiftWindow(step: number) {
    const size = filtered.end - filtered.start;
    const nextStart = Math.min(Math.max(0, filtered.start + step), labels.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromLabel(labels[nextStart]);
    setToLabel(labels[nextEnd]);
  }

  const tradingSeries = [
    {
      id: "benchmark",
      type: "line" as const,
      color: "#94a3b8",
      lineWidth: 2 as const,
      data: filtered.filteredLabels.map((label, index) => ({
        time: label,
        value: filtered.filteredBenchmark[index],
      })),
    },
    {
      id: "portfolio",
      type: "line" as const,
      color: "#14b8a6",
      lineWidth: 3 as const,
      data: filtered.filteredLabels.map((label, index) => ({
        time: label,
        value: filtered.filteredPortfolio[index],
      })),
    },
  ];

  const canGoBack = filtered.start > 0;
  const canGoForward = filtered.end < labels.length - 1;

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Cumulative returns</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio vs {benchmarkSymbol}</h3>
      </header>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">From</label>
        <select
          value={fromLabel}
          onChange={(event) => setFromLabel(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <label className="text-xs text-neutral-400">To</label>
        <select
          value={toLabel}
          onChange={(event) => setToLabel(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => shiftWindow(-1)}
          disabled={!canGoBack}
          className="ml-auto rounded-lg border border-[#334155] bg-black px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => shiftWindow(1)}
          disabled={!canGoForward}
          className="rounded-lg border border-[#334155] bg-black px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-black p-2 h-56">
        <TradingViewChart series={tradingSeries} height={220} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
        <span>{filtered.filteredLabels[0]}</span>
        <span>{filtered.filteredLabels[filtered.filteredLabels.length - 1]}</span>
      </div>
    </section>
  );
}
