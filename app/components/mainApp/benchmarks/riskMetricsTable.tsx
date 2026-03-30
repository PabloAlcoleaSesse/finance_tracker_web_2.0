type RiskRow = {
  label: string;
  portfolio: string;
  benchmark: string;
};

type RiskMetricsTableProps = {
  benchmarkSymbol: string;
  rows: RiskRow[];
};

export default function RiskMetricsTable({ benchmarkSymbol, rows }: RiskMetricsTableProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Risk metrics</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Portfolio vs {benchmarkSymbol}</h3>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Metric</th>
              <th className="px-4 py-3">Portfolio</th>
              <th className="px-4 py-3">Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
                <td className="px-4 py-3">{row.portfolio}</td>
                <td className="px-4 py-3">{row.benchmark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
