import { formatPercent } from "@/app/components/mainApp/mock/format";

type ReturnsCalendarProps = {
  rows: Array<{
    month: string;
    return: number;
  }>;
};

export default function ReturnsCalendar({ rows }: ReturnsCalendarProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Returns calendar</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Monthly Heatmap</h3>
      </header>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
        {rows.map((item) => {
          const positive = item.return >= 0;
          return (
            <article
              key={item.month}
              className={`min-h-20 rounded-xl border p-3 text-center ${
                positive ? "border-[#14b8a6]/25 bg-[#14b8a6]/10" : "border-rose-500/25 bg-rose-500/10"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.08em] text-neutral-400">{item.month}</p>
              <p
                className={`mt-2 whitespace-nowrap text-xs font-semibold tabular-nums sm:text-sm ${
                  positive ? "text-[#2dd4bf]" : "text-rose-300"
                }`}
              >
                {formatPercent(item.return)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
