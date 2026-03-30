"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortfolioSnapshot } from "@/lib/api/types";
import TradingViewChart from "@/app/components/mainApp/charts/tradingViewChart";

type Props = {
  snapshots30D: PortfolioSnapshot[];
  snapshots90D: PortfolioSnapshot[];
  snapshots365D: PortfolioSnapshot[];
  loading?: boolean;
  onRangeChange?: (range: "30D" | "90D" | "365D") => void;
};

const currency = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function PerformanceChart({ snapshots30D, snapshots90D, snapshots365D, loading, onRangeChange }: Props) {
  const [activeRange, setActiveRange] = useState<"30D" | "90D" | "365D">("30D");

  const snapshotsByRange = { "30D": snapshots30D, "90D": snapshots90D, "365D": snapshots365D };
  const data = snapshotsByRange[activeRange];

  const dateList = data.map((s) => s.date.slice(0, 10));
  const [fromDate, setFromDate] = useState(dateList[0] ?? "");
  const [toDate, setToDate] = useState(dateList[dateList.length - 1] ?? "");

  // Sync window when range or data changes
  useEffect(() => {
    const dates = data.map((s) => s.date.slice(0, 10));
    setFromDate(dates[0] ?? "");
    setToDate(dates[dates.length - 1] ?? "");
  }, [activeRange, data]);

  const filteredData = useMemo(() => {
    if (data.length === 0) return data;
    const next = data.filter((item) => item.date.slice(0, 10) >= fromDate && item.date.slice(0, 10) <= toDate);
    return next.length >= 2 ? next : data;
  }, [data, fromDate, toDate]);

  const firstVisibleIndex = data.findIndex((item) => item.date.slice(0, 10) === filteredData[0]?.date.slice(0, 10));
  const lastVisibleIndex = data.findIndex((item) => item.date.slice(0, 10) === filteredData[filteredData.length - 1]?.date.slice(0, 10));

  function shiftWindow(step: number) {
    const size = lastVisibleIndex - firstVisibleIndex;
    const nextStart = Math.min(Math.max(0, firstVisibleIndex + step), data.length - 1 - size);
    const nextEnd = nextStart + size;
    setFromDate(data[nextStart].date.slice(0, 10));
    setToDate(data[nextEnd].date.slice(0, 10));
  }

  const portfolioValues = filteredData.map((item) => item.total_value);
  const tradingSeries = filteredData.length > 0
    ? [
        {
          id: "portfolio",
          type: "line" as const,
          color: "#14b8a6",
          lineWidth: 3 as const,
          data: filteredData.map((item) => ({
            time: item.date,
            value: item.total_value,
          })),
        },
      ]
    : [];

  const canGoBack = firstVisibleIndex > 0;
  const canGoForward = lastVisibleIndex < data.length - 1;

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Performance</p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Value Trend</h3>
        </div>
        <div className="inline-flex rounded-xl border border-[#334155] bg-black p-1 text-xs font-medium text-neutral-300">
          {(["30D", "90D", "365D"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => {
                setActiveRange(range);
                onRangeChange?.(range);
              }}
              className={`rounded-lg px-3 py-1 ${activeRange === range ? "bg-[#1e1e35] text-white" : "text-neutral-300"}`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      {loading && data.length === 0 && (
        <p className="text-sm text-neutral-400">Loading chart&hellip;</p>
      )}

      {!loading && data.length === 0 && (
        <p className="text-sm text-neutral-500">No snapshots yet. Create a snapshot to start tracking performance.</p>
      )}

      {data.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="text-xs text-neutral-400">From</label>
            <select
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
            >
              {dateList.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <label className="text-xs text-neutral-400">To</label>
            <select
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="rounded-lg border border-[#334155] bg-black px-2 py-1 text-xs text-white"
            >
              {dateList.map((d) => (
                <option key={d} value={d}>{d}</option>
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

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-black p-2 h-60">
              <TradingViewChart series={tradingSeries} height={240} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-6 rounded-full bg-[#2dd4bf]" />Portfolio</span>
              {portfolioValues.length > 0 && (
                <span className="ml-auto text-neutral-400">Latest: {currency.format(portfolioValues[portfolioValues.length - 1])}</span>
              )}
            </div>

            {filteredData.length > 0 && (
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{filteredData[0].date.slice(0, 10)}</span>
                <span>{filteredData[filteredData.length - 1].date.slice(0, 10)}</span>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
