"use client";

import { useCallback, useEffect, useState } from "react";
import ReturnsPeriodSelector from "@/app/components/mainApp/returns/returnsPeriodSelector";
import CumulativeReturnsChart from "@/app/components/mainApp/returns/cumulativeReturnsChart";
import MonthlyReturnsGrid from "@/app/components/mainApp/returns/monthlyReturnsGrid";
import ContributionsTracker from "@/app/components/mainApp/returns/contributionsTracker";
import AssetClassPerformance from "@/app/components/mainApp/returns/assetClassPerformance";
import DrawdownChart from "@/app/components/mainApp/returns/drawdownChart";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useAnalytics } from "@/app/hooks/api/useAnalytics";
import { usePositions } from "@/app/hooks/api/usePositions";
import type { PortfolioSnapshot } from "@/lib/api/types";

function isoToLabel(date: string) {
  return date.slice(0, 7); // "YYYY-MM"
}

/** Derive cumulative points from snapshots.
 *  `value` = total portfolio value at that snapshot.
 *  `exContributions` = approx pure-gain line: total_gain + initial_cost (cost basis fixed to first snapshot).
 */
function deriveCumulative(snapshots: PortfolioSnapshot[]) {
  if (snapshots.length === 0) return [];
  const baseCost = snapshots[0].total_cost;
  return snapshots.map((s) => ({
    period: s.date.slice(0, 10),
    value: s.total_value,
    exContributions: s.total_gain + baseCost,
  }));
}

/** Derive monthly returns by grouping snapshots into months. */
function deriveMonthlyReturns(snapshots: PortfolioSnapshot[]) {
  const byMonth = new Map<string, PortfolioSnapshot[]>();
  for (const s of snapshots) {
    const key = isoToLabel(s.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key)!.push(s);
  }
  return Array.from(byMonth.entries()).map(([month, snaps]) => {
    const first = snaps[0].total_value;
    const last = snaps[snaps.length - 1].total_value;
    return { month: month.slice(5), return: first > 0 ? (last - first) / first : 0 };
  });
}

/** Derive contribution amounts per month (delta in total_cost). */
function deriveContributions(snapshots: PortfolioSnapshot[]) {
  if (snapshots.length < 2) return [];
  const byMonth = new Map<string, number>();
  for (let i = 1; i < snapshots.length; i++) {
    const key = isoToLabel(snapshots[i].date);
    const delta = Math.max(0, snapshots[i].total_cost - snapshots[i - 1].total_cost);
    byMonth.set(key, (byMonth.get(key) ?? 0) + delta);
  }
  return Array.from(byMonth.entries()).map(([period, value]) => ({ period, value }));
}

/** Derive drawdown per snapshot (running peak-to-trough). */
function deriveDrawdown(snapshots: PortfolioSnapshot[]) {
  let peak = -Infinity;
  return snapshots.map((s) => {
    if (s.total_value > peak) peak = s.total_value;
    const dd = peak > 0 ? (s.total_value - peak) / peak : 0;
    return { period: s.date.slice(0, 10), value: dd };
  });
}

export default function HistoricReturnsView() {
  const { selectedPortfolioId } = usePortfolio();
  const { loadPerformance, snapshots, loading, error } = useAnalytics();
  const { load: loadPositions, items: positions } = usePositions();
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

  const refresh = useCallback(async () => {
    if (!selectedPortfolioId) return;
    await Promise.all([
      loadPerformance(selectedPortfolioId, { from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) }),
      loadPositions(selectedPortfolioId),
    ]);
  }, [selectedPortfolioId, loadPerformance, loadPositions]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const cumulative = deriveCumulative(snapshots);
  const monthlyReturns = deriveMonthlyReturns(snapshots);
  const contributions = deriveContributions(snapshots);
  const drawdown = deriveDrawdown(snapshots);

  // Asset class performance: current values per type from positions (latest period only)
  const byType = positions.reduce(
    (acc, p) => {
      if (!acc[p.asset_type]) acc[p.asset_type] = 0;
      acc[p.asset_type] += p.total_value;
      return acc;
    },
    {} as Record<string, number>,
  );
  const assetClass = Object.keys(byType).length > 0
    ? [
        {
          period: "Current",
          stocks: byType["Stocks"] ?? 0,
          index: byType["Index Fund"] ?? 0,
          crypto: byType["Crypto"] ?? 0,
          fixedIncome: byType["Fixed Income"] ?? 0,
        },
      ]
    : [];

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-2xl border border-[#334155] bg-black p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Analytics</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Historic Returns Tracker</h1>
          </div>
          <ReturnsPeriodSelector selected={period} onSelect={setPeriod} />
        </header>

        {loading && snapshots.length === 0 && (
          <p className="text-sm text-neutral-400 px-2">Loading returns data&hellip;</p>
        )}

        {error && (
          <p className="text-sm text-rose-400 px-2">{error}</p>
        )}

        {!loading && !error && snapshots.length === 0 && (
          <p className="text-sm text-neutral-500 px-2">No snapshot history yet. Create snapshots to start tracking returns.</p>
        )}

        {cumulative.length >= 2 && (
          <CumulativeReturnsChart points={cumulative} />
        )}

        <section className="grid gap-4 xl:grid-cols-2">
          {monthlyReturns.length > 0 && <MonthlyReturnsGrid rows={monthlyReturns} />}
          {contributions.length > 0 && <ContributionsTracker rows={contributions} />}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {assetClass.length > 0 && <AssetClassPerformance rows={assetClass} />}
          {drawdown.length > 0 && <DrawdownChart rows={drawdown} />}
        </section>
      </div>
    </div>
  );
}
