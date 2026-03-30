import type { PositionWithMetrics } from "@/lib/api/types";

type Props = {
  positions: PositionWithMetrics[];
  loading?: boolean;
};

export default function MarketMovers({ positions, loading }: Props) {
  const rows = positions.map((p) => ({
    ticker: p.ticker,
    change: p.daily_change_percent,
  }));

  const gainers = [...rows].sort((a, b) => b.change - a.change).slice(0, 3);
  const losers = [...rows].sort((a, b) => a.change - b.change).slice(0, 3);

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Market movers</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Top Gainers and Losers</h3>
      </header>

      {loading && rows.length === 0 && <p className="text-sm text-neutral-400">Loading&hellip;</p>}
      {!loading && rows.length === 0 && <p className="text-sm text-neutral-500">No positions to display.</p>}

      {rows.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#334155] bg-black p-4">
            <p className="mb-3 text-sm font-semibold text-[#2dd4bf]">Top Gainers</p>
            <ul className="space-y-2">
              {gainers.map((row) => (
                <li key={row.ticker} className="flex items-center justify-between text-sm text-white">
                  <span>{row.ticker}</span>
                  <span className="font-semibold text-[#2dd4bf]">+{(row.change * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#334155] bg-black p-4">
            <p className="mb-3 text-sm font-semibold text-rose-300">Top Losers</p>
            <ul className="space-y-2">
              {losers.map((row) => (
                <li key={row.ticker} className="flex items-center justify-between text-sm text-white">
                  <span>{row.ticker}</span>
                  <span className="font-semibold text-rose-300">{(row.change * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
