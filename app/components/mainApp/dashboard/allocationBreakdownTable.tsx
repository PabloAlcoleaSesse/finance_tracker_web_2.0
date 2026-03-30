"use client";

import type { PositionWithMetrics } from "@/lib/api/types";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";

type Row = {
  label: string;
  cost: number;
  value: number;
  gain: number;
  gainPercent: number | null;
};

type Props = {
  positions: PositionWithMetrics[];
  loading?: boolean;
};

const eur = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function gainClass(value: number) {
  if (value > 0) return "text-[#2dd4bf]";
  if (value < 0) return "text-rose-300";
  return "text-neutral-400";
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

function computeAggregatedRows(rows: Row[]) {
  const stock = rows.find((row) => row.label === "Stocks");
  const indexFund = rows.find((row) => row.label === "Index Fund");
  const fixedIncome = rows.find((row) => row.label === "Fixed Income");
  const gold = rows.find((row) => row.label === "Gold");
  const crypto = rows.find((row) => row.label === "Crypto");
  const cash = rows.find((row) => row.label === "Cash");

  const equitiesCost = (stock?.cost ?? 0) + (indexFund?.cost ?? 0);
  const equitiesValue = (stock?.value ?? 0) + (indexFund?.value ?? 0);
  const alternativesCost = (gold?.cost ?? 0) + (crypto?.cost ?? 0);
  const alternativesValue = (gold?.value ?? 0) + (crypto?.value ?? 0);

  const equitiesGain = equitiesValue - equitiesCost;
  const alternativesGain = alternativesValue - alternativesCost;
  const fixedGain = (fixedIncome?.value ?? 0) - (fixedIncome?.cost ?? 0);
  const cashGain = (cash?.value ?? 0) - (cash?.cost ?? 0);

  return [
    {
      label: "Equities",
      cost: equitiesCost,
      value: equitiesValue,
      gain: equitiesGain,
      gainPercent: equitiesCost > 0 ? equitiesGain / equitiesCost : null,
    },
    {
      label: "Fixed Income",
      cost: fixedIncome?.cost ?? 0,
      value: fixedIncome?.value ?? 0,
      gain: fixedGain,
      gainPercent: (fixedIncome?.cost ?? 0) > 0 ? fixedGain / (fixedIncome?.cost ?? 1) : null,
    },
    {
      label: "Alternatives",
      cost: alternativesCost,
      value: alternativesValue,
      gain: alternativesGain,
      gainPercent: alternativesCost > 0 ? alternativesGain / alternativesCost : null,
    },
    {
      label: "Cash",
      cost: cash?.cost ?? 0,
      value: cash?.value ?? 0,
      gain: cashGain,
      gainPercent: (cash?.cost ?? 0) > 0 ? cashGain / (cash?.cost ?? 1) : null,
    },
  ];
}

function BreakdownTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-black">
      <table className="min-w-full text-left">
        <thead className="bg-black text-neutral-300">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em]">Type</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em]">Cost</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em]">Value</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em]">Gain (absolute)</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em]">Gain %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[#334155] text-neutral-200">
              <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
              <td className="px-4 py-3 text-right font-semibold">{eur.format(row.cost)}</td>
              <td className="px-4 py-3 text-right font-semibold">{eur.format(row.value)}</td>
              <td className={`px-4 py-3 text-right font-extrabold ${gainClass(row.gain)}`}>
                {eur.format(row.gain)}
              </td>
              <td className={`px-4 py-3 text-right font-extrabold ${gainClass(row.gain)}`}>
                {formatPercent(row.gainPercent)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AllocationBreakdownTable({ positions, loading }: Props) {
  const { selectedPortfolioId } = usePortfolio();
  void selectedPortfolioId; // consumed by parent dashboard for data fetching

  // Derive by-type breakdown from positions
  const byType = positions.reduce(
    (acc, p) => {
      if (!acc[p.asset_type]) acc[p.asset_type] = { cost: 0, value: 0, gain: 0 };
      acc[p.asset_type].cost += p.total_cost;
      acc[p.asset_type].value += p.total_value;
      acc[p.asset_type].gain += p.gain;
      return acc;
    },
    {} as Record<string, { cost: number; value: number; gain: number }>,
  );

  const rows: Row[] = Object.entries(byType).map(([label, bucket]) => ({
    label,
    cost: bucket.cost,
    value: bucket.value,
    gain: bucket.gain,
    gainPercent: bucket.cost > 0 ? bucket.gain / bucket.cost : null,
  }));

  const aggregatedRows = computeAggregatedRows(rows);

  return (
    <section className="space-y-3 rounded-2xl border border-[#334155] bg-black p-4">
      <header>
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Allocation breakdown</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Cost vs Value by Type</h3>
      </header>

      {loading && rows.length === 0 && <p className="text-sm text-neutral-400">Loading&hellip;</p>}
      {!loading && rows.length === 0 && <p className="text-sm text-neutral-500">No positions yet.</p>}

      {rows.length > 0 && (
        <>
          <BreakdownTable rows={rows} />
          <div>
            <p className="mb-2 text-xs font-medium tracking-[0.08em] text-neutral-400">Grouped view</p>
            <BreakdownTable rows={aggregatedRows} />
          </div>
        </>
      )}
    </section>
  );
}
