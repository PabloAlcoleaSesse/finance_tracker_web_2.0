import { formatPercent } from "@/app/components/mainApp/mock/format";

type Row = {
  month: string;
  return: number;
};

type MonthlyReturnsGridProps = {
  rows: Row[];
};

export default function MonthlyReturnsGrid({ rows }: MonthlyReturnsGridProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Monthly returns</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Month-over-Month Grid</h3>
      </header>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {rows.map((row, index) => {
          const positive = row.return >= 0;
          return (
            <article
              key={`${row.month}-${index}`}
              className={`rounded-xl border p-3 ${
                positive ? "border-[#14b8a6]/30 bg-[#14b8a6]/10" : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.08em] text-neutral-400">{row.month}</p>
              <p className={`mt-1 text-sm font-semibold ${positive ? "text-[#2dd4bf]" : "text-rose-300"}`}>
                {formatPercent(row.return)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
