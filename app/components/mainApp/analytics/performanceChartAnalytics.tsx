"use client";

import { useMemo, useState } from "react";
import TradingViewChart from "@/app/components/mainApp/charts/tradingViewChart";

type PerformanceChartAnalyticsProps = {
  snapshots: Array<{
    date: string;
    total_value: number;
  }>;
};

export default function PerformanceChartAnalytics({ snapshots }: PerformanceChartAnalyticsProps) {
  const [fromDate, setFromDate] = useState(snapshots[0].date);
  const [toDate, setToDate] = useState(snapshots[snapshots.length - 1].date);

  const filtered = useMemo(() => {
    const next = snapshots.filter((item) => item.date >= fromDate && item.date <= toDate);
    return next.length >= 2 ? next : snapshots;
  }, [fromDate, toDate, snapshots]);

  const firstVisibleIndex = snapshots.findIndex((item) => item.date === filtered[0].date);
  const lastVisibleIndex = snapshots.findIndex((item) => item.date === filtered[filtered.length - 1].date);

  function shiftWindow(step: number) {
    const size = lastVisibleIndex - firstVisibleIndex;
    const nextStart = Math.min(Math.max(0, firstVisibleIndex + step), snapshots.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromDate(snapshots[nextStart].date);
    setToDate(snapshots[nextEnd].date);
  }

  const tradingSeries = filtered.length > 0
    ? [
        {
          id: "portfolio",
          type: "line" as const,
          color: "#14b8a6",
          lineWidth: 3 as const,
          data: filtered.map((item) => ({
            time: item.date,
            value: item.total_value,
          })),
        },
      ]
    : [];
  const canGoBack = firstVisibleIndex > 0;
  const canGoForward = lastVisibleIndex < snapshots.length - 1;

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Performance curve</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Growth Over Time</h3>
      </header>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-400">From</label>
        <select
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {snapshots.map((item) => (
            <option key={item.date} value={item.date}>
              {item.date}
            </option>
          ))}
        </select>
        <label className="text-xs text-neutral-400">To</label>
        <select
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
        >
          {snapshots.map((item) => (
            <option key={item.date} value={item.date}>
              {item.date}
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
    </section>
  );
}
