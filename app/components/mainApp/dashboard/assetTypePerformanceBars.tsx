import type { PositionWithMetrics } from "@/lib/api/types";

type Props = {
  positions: PositionWithMetrics[];
  loading?: boolean;
};

export default function AssetTypePerformanceBars({ positions, loading }: Props) {
  // Group positions by asset_type and compute weighted gain_percent
  const byType = positions.reduce(
    (acc, p) => {
      if (!acc[p.asset_type]) acc[p.asset_type] = { total_cost: 0, total_gain: 0 };
      acc[p.asset_type].total_cost += p.total_cost;
      acc[p.asset_type].total_gain += p.gain;
      return acc;
    },
    {} as Record<string, { total_cost: number; total_gain: number }>,
  );

  const rows = Object.entries(byType).map(([name, data]) => ({
    name,
    gainPercent: data.total_cost > 0 ? data.total_gain / data.total_cost : 0,
  }));
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Asset type performance</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Relative Gain/Loss by Class</h3>
      </header>

      {loading && rows.length === 0 && <p className="text-sm text-neutral-400">Loading&hellip;</p>}
      {!loading && rows.length === 0 && <p className="text-sm text-neutral-500">No data yet.</p>}

      <ul className="space-y-3">
        {rows.map((row) => {
          const positive = row.gainPercent >= 0;
          const width = Math.min(Math.abs(row.gainPercent) * 1000, 100);
          return (
            <li key={row.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">{row.name}</span>
                <span className={positive ? "text-[#2dd4bf]" : "text-rose-300"}>{`${positive ? "+" : ""}${(row.gainPercent * 100).toFixed(2)}%`}</span>
              </div>
              <div className="h-2 rounded-full bg-[#1e1e35]">
                <div className={`h-2 rounded-full ${positive ? "bg-[#14b8a6]" : "bg-rose-400"}`} style={{ width: `${width}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
