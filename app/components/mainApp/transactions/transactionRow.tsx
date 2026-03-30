import type { TransactionViewModel } from "@/app/components/mainApp/transactions/types";
import { eur } from "@/app/components/mainApp/mock/format";

type TransactionRowProps = {
  transaction: TransactionViewModel;
};

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const buy = transaction.trade_type === "BUY";

  return (
    <tr className="border-t border-[#334155] text-neutral-200">
      <td className="px-4 py-3 text-sm text-neutral-300">{transaction.trade_date}</td>
      <td className="px-4 py-3">
        <p className="font-semibold text-white">{transaction.ticker}</p>
        <p className="text-xs text-neutral-400">{transaction.name}</p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full border px-2 py-1 text-xs font-semibold ${
            buy ? "border-[#14b8a6]/30 bg-[#14b8a6]/10 text-[#2dd4bf]" : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {transaction.trade_type}
        </span>
      </td>
      <td className="px-4 py-3">{transaction.quantity}</td>
      <td className="px-4 py-3">{eur.format(transaction.price)}</td>
      <td className="px-4 py-3">{eur.format(transaction.commission)}</td>
      <td className="px-4 py-3 font-semibold text-white">{eur.format(transaction.total)}</td>
      <td className="px-4 py-3 text-xs text-neutral-400">{transaction.notes ?? "-"}</td>
    </tr>
  );
}
