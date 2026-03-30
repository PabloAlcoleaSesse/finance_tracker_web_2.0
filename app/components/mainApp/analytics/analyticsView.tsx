"use client";

import { useEffect, useMemo, useState } from "react";
import AssetAllocationChart from "@/app/components/mainApp/dashboard/assetAllocationChart";
import DateRangePicker from "@/app/components/mainApp/analytics/dateRangePicker";
import PerformanceChartAnalytics from "@/app/components/mainApp/analytics/performanceChartAnalytics";
import PerformanceMetrics from "@/app/components/mainApp/analytics/performanceMetrics";
import ReturnsCalendar from "@/app/components/mainApp/analytics/returnsCalendar";
import SnapshotHistory from "@/app/components/mainApp/analytics/snapshotHistory";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useAnalytics } from "@/app/hooks/api/useAnalytics";

function monthsToRange(selectedRange: "3M" | "6M" | "1Y") {
  const to = new Date();
  const from = new Date();
  const months = selectedRange === "3M" ? 3 : selectedRange === "6M" ? 6 : 12;
  from.setMonth(from.getMonth() - months);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

export default function AnalyticsView() {
  const { selectedPortfolioId } = usePortfolio();
  const { snapshots, performance, loading, error, loadPerformance } = useAnalytics();
  const [selectedRange, setSelectedRange] = useState<"3M" | "6M" | "1Y">("6M");

  useEffect(() => {
    if (!selectedPortfolioId) {
      return;
    }
    void loadPerformance(selectedPortfolioId, monthsToRange(selectedRange));
  }, [selectedPortfolioId, selectedRange, loadPerformance]);

  const returnsRows = useMemo(() => {
    if (snapshots.length < 2) {
      return [] as Array<{ month: string; return: number }>;
    }

    return snapshots.slice(1).map((snapshot, index) => {
      const previous = snapshots[index];
      const value = previous.total_value > 0 ? snapshot.total_value / previous.total_value - 1 : 0;
      const date = new Date(snapshot.date);
      const month = Number.isNaN(date.getTime())
        ? snapshot.date.slice(0, 7)
        : date.toLocaleDateString("en-US", { month: "short" });
      return { month, return: value };
    });
  }, [snapshots]);

  const metrics = useMemo(
    () => ({
      total_return: performance?.total_return ?? 0,
      annualized_return: performance?.annualized_return ?? 0,
      volatility: performance?.volatility ?? 0,
      sharpe_ratio: performance?.sharpe_ratio ?? 0,
      max_drawdown: performance?.max_drawdown ?? 0,
      ytd_return: performance?.year_to_date_return ?? 0,
    }),
    [performance],
  );

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-2xl border border-[#334155] bg-black p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Analytics</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Performance Tracker</h1>
          </div>
          <DateRangePicker selected={selectedRange} onSelect={setSelectedRange} />
        </header>

        {loading ? <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">Loading performance analytics...</p> : null}
        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}

        {!loading && !error && snapshots.length === 0 ? (
          <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">No snapshots available yet for this period.</p>
        ) : null}

        {snapshots.length > 0 ? <PerformanceChartAnalytics snapshots={snapshots} /> : null}
        <PerformanceMetrics metrics={metrics} />

        <section className="grid gap-4 xl:grid-cols-2">
          <AssetAllocationChart />
          <ReturnsCalendar rows={returnsRows} />
        </section>

        <SnapshotHistory snapshots={snapshots} />
      </div>
    </div>
  );
}
