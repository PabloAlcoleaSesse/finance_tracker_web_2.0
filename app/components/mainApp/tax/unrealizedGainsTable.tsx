import { eur, formatPercent } from "@/app/components/mainApp/mock/format";

type Row = {
  ticker: string;
  shares: number;
  average_cost: number;
  current_price: number;
  unrealized_gain: number;
  gain_percent: number;
  holding_period: string;
};

type UnrealizedGainsTableProps = {
  rows: Row[];
};

export default function UnrealizedGainsTable({ rows }: UnrealizedGainsTableProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Unrealized gains</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Open Positions</h3>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Shares</th>
              <th className="px-4 py-3">Avg Cost</th>
              <th className="px-4 py-3">Current</th>
              <th className="px-4 py-3">Gain</th>
              <th className="px-4 py-3">Holding</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.ticker} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3 font-semibold text-white">{row.ticker}</td>
                <td className="px-4 py-3">{row.shares}</td>
                <td className="px-4 py-3">{eur.format(row.average_cost)}</td>
                <td className="px-4 py-3">{eur.format(row.current_price)}</td>
                <td className={`px-4 py-3 font-semibold ${row.unrealized_gain >= 0 ? "text-[#2dd4bf]" : "text-rose-300"}`}>
                  {`${eur.format(row.unrealized_gain)} (${formatPercent(row.gain_percent)})`}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-400">{row.holding_period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
