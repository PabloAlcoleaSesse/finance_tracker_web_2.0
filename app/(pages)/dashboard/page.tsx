"use client";

import { useCallback, useEffect, useState } from "react";
import PortfolioOverview from "@/app/components/mainApp/dashboard/portfolioOverview";
import AssetAllocationChart from "@/app/components/mainApp/dashboard/assetAllocationChart";
import PerformanceChart from "@/app/components/mainApp/dashboard/performanceChart";
import TopPositionsTable from "@/app/components/mainApp/dashboard/topPositionsTable";
import PerformanceMetricsGrid from "@/app/components/mainApp/dashboard/performanceMetricsGrid";
import RecentActivityFeed from "@/app/components/mainApp/dashboard/recentActivityFeed";
import MarketMovers from "@/app/components/mainApp/dashboard/marketMovers";
import AssetTypePerformanceBars from "@/app/components/mainApp/dashboard/assetTypePerformanceBars";
import QuickStatsRow from "@/app/components/mainApp/dashboard/quickStatsRow";
import PortfolioSelector from "@/app/components/mainApp/dashboard/portfolioSelector";
import BenchmarkComparisonCard from "@/app/components/mainApp/dashboard/benchmarkComparisonCard";
import AllocationBreakdownTable from "@/app/components/mainApp/dashboard/allocationBreakdownTable";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useAuth } from "@/app/hooks/api/useAuth";
import { apiClient } from "@/lib/api/client";
import type {
  BenchmarkComparison,
  PerformanceMetrics,
  PortfolioSnapshot,
  PortfolioSummary,
  PositionWithMetrics,
  Transaction,
} from "@/lib/api/types";

function rangeFrom(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { selectedPortfolioId } = usePortfolio();
  const { token } = useAuth();

  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [positions, setPositions] = useState<PositionWithMetrics[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [comparison, setComparison] = useState<BenchmarkComparison | null>(null);
  const [snapshots30D, setSnapshots30D] = useState<PortfolioSnapshot[]>([]);
  const [snapshots90D, setSnapshots90D] = useState<PortfolioSnapshot[]>([]);
  const [snapshots365D, setSnapshots365D] = useState<PortfolioSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    if (!selectedPortfolioId || !token) return;
    setLoading(true);
    try {
      const [
        nextSummary,
        nextPositions,
        nextTransactions,
        nextMetrics,
        nextComparison,
        next30D,
        next90D,
        next365D,
      ] = await Promise.allSettled([
        apiClient.getPortfolioSummary(selectedPortfolioId, token),
        apiClient.listPositions(selectedPortfolioId, token),
        apiClient.listTransactions(selectedPortfolioId, token),
        apiClient.getPerformanceMetrics(selectedPortfolioId, token),
        apiClient.getBenchmarkComparison(selectedPortfolioId, token, { benchmark: "SPY" }),
        apiClient.listSnapshots(selectedPortfolioId, token, { from: rangeFrom(30) }),
        apiClient.listSnapshots(selectedPortfolioId, token, { from: rangeFrom(90) }),
        apiClient.listSnapshots(selectedPortfolioId, token, { from: rangeFrom(365) }),
      ]);

      if (nextSummary.status === "fulfilled") setSummary(nextSummary.value);
      if (nextPositions.status === "fulfilled") setPositions(nextPositions.value);
      if (nextTransactions.status === "fulfilled") setTransactions(nextTransactions.value);
      if (nextMetrics.status === "fulfilled") setMetrics(nextMetrics.value);
      if (nextComparison.status === "fulfilled") setComparison(nextComparison.value);
      if (next30D.status === "fulfilled") setSnapshots30D(next30D.value);
      if (next90D.status === "fulfilled") setSnapshots90D(next90D.value);
      if (next365D.status === "fulfilled") setSnapshots365D(next365D.value);
    } finally {
      setLoading(false);
    }
  }, [selectedPortfolioId, token]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="mainapp-card-soft w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-3 rounded-2xl border border-[#334155] bg-black p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Overview</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Intelligence</h1>
          </div>
          <PortfolioSelector />
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          <PortfolioOverview summary={summary} loading={loading} />
          <AssetAllocationChart positions={positions} loading={loading} />
        </section>

        <QuickStatsRow summary={summary} positions={positions} />

        <AllocationBreakdownTable positions={positions} loading={loading} />

        <PerformanceChart
          snapshots30D={snapshots30D}
          snapshots90D={snapshots90D}
          snapshots365D={snapshots365D}
          loading={loading}
        />

        <PerformanceMetricsGrid metrics={metrics} loading={loading} />

        <section className="grid gap-4 xl:grid-cols-2">
          <TopPositionsTable positions={positions} loading={loading} />
          <RecentActivityFeed transactions={transactions} loading={loading} />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <MarketMovers positions={positions} loading={loading} />
          <AssetTypePerformanceBars positions={positions} loading={loading} />
        </section>

        <BenchmarkComparisonCard comparison={comparison} loading={loading} />
      </div>
    </div>
  );
}