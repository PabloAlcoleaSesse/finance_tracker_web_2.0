import { compactEur } from "@/app/components/mainApp/mock/format";

type Row = {
  period: string;
  stocks: number;
  index: number;
  crypto: number;
  fixedIncome: number;
};

type AssetClassPerformanceProps = {
  rows: Row[];
};

export default function AssetClassPerformance({ rows }: AssetClassPerformanceProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Asset classes</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Value by Asset Class</h3>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Stocks</th>
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3">Crypto</th>
              <th className="px-4 py-3">Fixed Income</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3 font-semibold text-white">{row.period}</td>
                <td className="px-4 py-3">{compactEur.format(row.stocks)}</td>
                <td className="px-4 py-3">{compactEur.format(row.index)}</td>
                <td className="px-4 py-3">{compactEur.format(row.crypto)}</td>
                <td className="px-4 py-3">{compactEur.format(row.fixedIncome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
