import type { TransactionViewModel } from "@/app/components/mainApp/transactions/types";
import { eur } from "@/app/components/mainApp/mock/format";

type TransactionStatsProps = {
  rows: TransactionViewModel[];
};

export default function TransactionStats({ rows }: TransactionStatsProps) {
  const buys = rows.filter((item) => item.trade_type === "BUY");
  const sells = rows.filter((item) => item.trade_type === "SELL");

  const totalBuyAmount = buys.reduce((acc, item) => acc + item.total, 0);
  const totalSellAmount = sells.reduce((acc, item) => acc + item.total, 0);

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <article className="rounded-2xl border border-[#334155] bg-black p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total Buys</p>
        <p className="mt-2 text-xl font-semibold text-white">{buys.length}</p>
        <p className="text-sm text-[#2dd4bf]">{eur.format(totalBuyAmount)}</p>
      </article>
      <article className="rounded-2xl border border-[#334155] bg-black p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total Sells</p>
        <p className="mt-2 text-xl font-semibold text-white">{sells.length}</p>
        <p className="text-sm text-rose-300">{eur.format(totalSellAmount)}</p>
      </article>
      <article className="rounded-2xl border border-[#334155] bg-black p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Net Invested</p>
        <p className="mt-2 text-xl font-semibold text-white">{eur.format(totalBuyAmount - totalSellAmount)}</p>
      </article>
      <article className="rounded-2xl border border-[#334155] bg-black p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Trades</p>
        <p className="mt-2 text-xl font-semibold text-white">{rows.length}</p>
      </article>
    </section>
  );
}
