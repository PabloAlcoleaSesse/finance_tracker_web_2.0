import { formatPercent } from "@/app/components/mainApp/mock/format";
import TradingViewChart from "@/app/components/mainApp/charts/tradingViewChart";

type Row = {
  period: string;
  value: number;
};

type DrawdownChartProps = {
  rows: Row[];
};

export default function DrawdownChart({ rows }: DrawdownChartProps) {
  const maxDrawdown = Math.min(...rows.map((row) => row.value), 0);

  const series = [
    {
      id: "drawdown",
      type: "histogram" as const,
      color: "#fb7185",
      data: rows.map((row) => ({
        time: row.period,
        value: row.value,
      })),
    },
  ];

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Drawdowns</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Peak-to-Trough Declines</h3>
      </header>

      <div className="rounded-2xl border border-[#334155] bg-black p-2 h-64">
        <TradingViewChart series={series} height={240} />
      </div>

      <div className="mt-3 text-sm text-neutral-300">
        <span className="text-neutral-400">Max drawdown: </span>
        <span className="font-semibold text-rose-300">{formatPercent(maxDrawdown)}</span>
      </div>
    </section>
  );
}
