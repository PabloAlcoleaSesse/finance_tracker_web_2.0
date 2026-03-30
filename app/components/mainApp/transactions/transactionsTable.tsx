import type { TransactionViewModel } from "@/app/components/mainApp/transactions/types";
import TransactionRow from "@/app/components/mainApp/transactions/transactionRow";

type TransactionsTableProps = {
  rows: TransactionViewModel[];
};

export default function TransactionsTable({ rows }: TransactionsTableProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Transactions</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Trade History</h2>
        </div>
        <p className="text-xs text-neutral-400">Mock pagination: page 1 of 1</p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Asset</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
