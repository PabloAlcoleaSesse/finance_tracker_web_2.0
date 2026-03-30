"use client";

import { useMemo, useState } from "react";
import { eur } from "@/app/components/mainApp/mock/format";
import TradingViewChart from "@/app/components/mainApp/charts/tradingViewChart";

type Point = {
  period: string;
  value: number;
  exContributions: number;
};

type CumulativeReturnsChartProps = {
  points: Point[];
};

export default function CumulativeReturnsChart({ points }: CumulativeReturnsChartProps) {
  const [fromPeriod, setFromPeriod] = useState(points[0].period);
  const [toPeriod, setToPeriod] = useState(points[points.length - 1].period);

  const filtered = useMemo(() => {
    const labels = points.map((point) => point.period);
    const fromIdx = labels.indexOf(fromPeriod);
    const toIdx = labels.indexOf(toPeriod);
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const next = points.slice(start, end + 1);

    if (next.length >= 2) {
      return { points: next, start, end };
    }

    return { points, start: 0, end: points.length - 1 };
  }, [points, fromPeriod, toPeriod]);

  function shiftWindow(step: number) {
    const size = filtered.end - filtered.start;
    const nextStart = Math.min(Math.max(0, filtered.start + step), points.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromPeriod(points[nextStart].period);
    setToPeriod(points[nextEnd].period);
  }

  const values = filtered.points.map((item) => item.value);

  const tradingSeries = useMemo(
    () => [
      {
        id: "portfolio-total",
        type: "line" as const,
        color: "#14b8a6",
        lineWidth: 3 as const,
        data: filtered.points.map((point) => ({
          time: point.period,
          value: point.value,
        })),
      },
      {
        id: "portfolio-ex-contributions",
        type: "line" as const,
        color: "#94a3b8",
        lineStyle: "dashed" as const,
        lineWidth: 2 as const,
        data: filtered.points.map((point) => ({
          time: point.period,
          value: point.exContributions,
        })),
      },
    ],
    [filtered.points],
  );

  const canGoBack = filtered.start > 0;
  const canGoForward = filtered.end < points.length - 1;

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Cumulative returns</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Growth vs Gains-Only</h2>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">From</label>
        <select
          value={fromPeriod}
          onChange={(event) => setFromPeriod(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {points.map((point) => (
            <option key={point.period} value={point.period}>
              {point.period}
            </option>
          ))}
        </select>
        <label className="text-xs text-neutral-400">To</label>
        <select
          value={toPeriod}
          onChange={(event) => setToPeriod(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {points.map((point) => (
            <option key={point.period} value={point.period}>
              {point.period}
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

      <div className="rounded-2xl border border-[#334155] bg-black p-2 h-64">
        <TradingViewChart series={tradingSeries} height={240} />
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-300">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-[#2dd4bf]" />Total value</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-slate-400" />Excluding contributions</span>
        <span className="ml-auto text-neutral-400">Latest: {eur.format(values[values.length - 1])}</span>
      </div>
    </section>
  );
}
