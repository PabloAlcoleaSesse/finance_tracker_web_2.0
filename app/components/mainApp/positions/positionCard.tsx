import type { PositionViewModel } from "@/app/components/mainApp/positions/types";
import { eur, formatPercent } from "@/app/components/mainApp/mock/format";

type PositionCardProps = {
  position: PositionViewModel;
};

export default function PositionCard({ position }: PositionCardProps) {
  const isPositive = position.gain >= 0;
  const isDailyPositive = position.daily_change_amount >= 0;

  return (
    <article className="rounded-2xl border border-[#334155] bg-black p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{position.asset_type}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{position.name}</h3>
          <p className="text-sm text-neutral-400">{position.ticker}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            isDailyPositive ? "border-[#14b8a6]/30 bg-[#14b8a6]/10 text-[#2dd4bf]" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {formatPercent(position.daily_change_percent)}
        </span>
      </header>

      <div className="mt-4 grid gap-2 text-sm text-neutral-300 sm:grid-cols-2">
        <p>
          Shares: <span className="font-semibold text-white">{position.shares.toFixed(4)}</span>
        </p>
        <p>
          Avg Cost: <span className="font-semibold text-white">{eur.format(position.average_cost)}</span>
        </p>
        <p>
          Current: <span className="font-semibold text-white">{eur.format(position.current_price)}</span>
        </p>
        <p>
          Last Update: <span className="font-semibold text-white">{position.last_price_update ?? "-"}</span>
        </p>
      </div>

      <div className="mt-4 grid gap-2 rounded-xl border border-[#334155] bg-black p-3 text-sm">
        <p className="flex justify-between text-neutral-300">
          <span>Total Cost</span>
          <span className="font-semibold text-white">{eur.format(position.total_cost)}</span>
        </p>
        <p className="flex justify-between text-neutral-300">
          <span>Current Value</span>
          <span className="font-semibold text-white">{eur.format(position.total_value)}</span>
        </p>
        <p className={`flex justify-between font-semibold ${isPositive ? "text-[#2dd4bf]" : "text-rose-300"}`}>
          <span>Gain / Loss</span>
          <span>{`${eur.format(position.gain)} (${formatPercent(position.gain_percent)})`}</span>
        </p>
      </div>
    </article>
  );
}
