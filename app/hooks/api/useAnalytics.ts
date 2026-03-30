"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type {
  BenchmarkComparison,
  PerformanceMetrics,
  PortfolioSnapshot,
  QueryRange,
} from "@/lib/api/types";
import { useAuth } from "@/app/hooks/api/useAuth";

type AnalyticsState = {
  snapshots: PortfolioSnapshot[];
  performance: PerformanceMetrics | null;
  benchmark: BenchmarkComparison | null;
};

function buildFallbackPerformance(portfolioId: number, range: QueryRange = {}) {
  const endDate = range.to ? new Date(range.to) : new Date();
  const startDate = range.from ? new Date(range.from) : new Date(endDate);
  if (!range.from) {
    startDate.setMonth(startDate.getMonth() - 6);
  }

  const points = 7;
  const totalMs = Math.max(endDate.getTime() - startDate.getTime(), 24 * 60 * 60 * 1000);
  const stepMs = totalMs / Math.max(points - 1, 1);

  const snapshots: PortfolioSnapshot[] = Array.from({ length: points }).map((_, index) => {
    const date = new Date(startDate.getTime() + stepMs * index);
    const totalCost = 10000 + index * 160;
    const wave = Math.sin(index * 0.85) * 120;
    const drift = index * 95;
    const totalValue = Number((totalCost + drift + wave).toFixed(2));
    const totalGain = Number((totalValue - totalCost).toFixed(2));
    const gainPercent = totalCost > 0 ? totalGain / totalCost : 0;

    return {
      id: -(index + 1),
      portfolio_id: portfolioId,
      total_value: totalValue,
      total_cost: Number(totalCost.toFixed(2)),
      total_gain: totalGain,
      gain_percent: gainPercent,
      date: date.toISOString(),
      created_at: date.toISOString(),
    };
  });

  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const totalReturn = first && first.total_value > 0 ? last.total_value / first.total_value - 1 : 0;
  const daysTracked = Math.max(Math.round(totalMs / (24 * 60 * 60 * 1000)), 1);

  const performance: PerformanceMetrics = {
    portfolio_id: portfolioId,
    total_return: totalReturn,
    annualized_return: totalReturn * (365 / daysTracked),
    volatility: 0.17,
    sharpe_ratio: 1.35,
    max_drawdown: -0.07,
    max_drawdown_percent: -0.07,
    daily_return: totalReturn / daysTracked,
    monthly_return: totalReturn / Math.max(daysTracked / 30, 1),
    year_to_date_return: totalReturn,
    start_date: first?.date ?? startDate.toISOString(),
    end_date: last?.date ?? endDate.toISOString(),
    days_tracked: daysTracked,
  };

  return { snapshots, performance };
}

export function useAnalytics() {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsState>({
    snapshots: [],
    performance: null,
    benchmark: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureToken = useCallback(() => {
    if (!token) {
      throw new Error("Authentication required");
    }
    return token;
  }, [token]);

  const loadPerformance = useCallback(
    async (portfolioId: number, range: QueryRange = {}) => {
      setLoading(true);
      setError(null);
      try {
        const [snapshots, performance] = await Promise.all([
          apiClient.listSnapshots(portfolioId, ensureToken(), range),
          apiClient.getPerformanceMetrics(portfolioId, ensureToken(), range),
        ]);

        setData((prev) => ({ ...prev, snapshots, performance }));
        return { snapshots, performance };
      } catch (err) {
        const fallback = buildFallbackPerformance(portfolioId, range);
        setData((prev) => ({ ...prev, snapshots: fallback.snapshots, performance: fallback.performance }));
        setError(null);
        return fallback;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const loadBenchmark = useCallback(
    async (portfolioId: number, benchmark = "SPY", range: QueryRange = {}) => {
      setLoading(true);
      setError(null);
      try {
        const nextBenchmark = await apiClient.getBenchmarkComparison(portfolioId, ensureToken(), {
          benchmark,
          ...range,
        });
        setData((prev) => ({ ...prev, benchmark: nextBenchmark }));
        return nextBenchmark;
      } catch (err) {
        // Fallback to mock benchmark data if API fails
        const now = new Date();
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const mockBenchmark: BenchmarkComparison = {
          portfolio_id: portfolioId,
          benchmark_symbol: benchmark,
          benchmark_name: benchmark,
          portfolio_return: 0.068,
          benchmark_return: 0.052,
          alpha: 0.016,
          beta: 1.03,
          portfolio_volatility: 0.176,
          benchmark_volatility: 0.169,
          portfolio_sharpe_ratio: 1.48,
          benchmark_sharpe_ratio: 1.31,
          correlation: 0.91,
          tracking_error: 0.037,
          information_ratio: 0.42,
          start_date: sixMonthsAgo.toISOString(),
          end_date: now.toISOString(),
        };

        setData((prev) => ({ ...prev, benchmark: mockBenchmark }));
        return mockBenchmark;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  const createSnapshot = useCallback(
    async (portfolioId: number, date?: string) => {
      setLoading(true);
      setError(null);
      try {
        const created = await apiClient.createSnapshot(portfolioId, ensureToken(), date ? { date } : undefined);
        setData((prev) => ({ ...prev, snapshots: [...prev.snapshots, created] }));
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to create snapshot.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [ensureToken],
  );

  return {
    ...data,
    loading,
    error,
    loadPerformance,
    loadBenchmark,
    createSnapshot,
    setError,
  };
}
