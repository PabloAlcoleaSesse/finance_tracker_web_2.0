import type { TransactionViewModel } from "@/app/components/mainApp/transactions/types";
import { eur } from "@/app/components/mainApp/mock/format";

type TransactionsMonthlyHeatmapProps = {
  rows: TransactionViewModel[];
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthIndexFromDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return -1;
  return parsed.getMonth();
}

export default function TransactionsMonthlyHeatmap({ rows }: TransactionsMonthlyHeatmapProps) {
  const totals = Array.from({ length: 12 }, () => 0);

  for (const row of rows) {
    const index = monthIndexFromDate(row.trade_date);
    if (index >= 0) {
      totals[index] += row.total;
    }
  }

  const max = Math.max(...totals, 0);

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Activity heatmap</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Transactions Monthly Heatmap</h2>
        </div>
        <p className="text-xs text-neutral-400">Intensity by traded amount</p>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2">
        {months.map((month, index) => {
          const amount = totals[index];
          const intensity = max === 0 ? 0 : amount / max;
          const bgOpacity = Math.max(0.08, Number((intensity * 0.6).toFixed(2)));

          return (
            <article
              key={month}
              className="min-h-20 rounded-xl border border-[#334155] p-3"
              style={{ backgroundColor: `rgba(20, 184, 166, ${bgOpacity})` }}
            >
              <p className="text-xs uppercase tracking-[0.08em] text-neutral-300">{month}</p>
              <p className="mt-2 whitespace-nowrap text-xs font-semibold text-white tabular-nums sm:text-sm">{eur.format(amount)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
