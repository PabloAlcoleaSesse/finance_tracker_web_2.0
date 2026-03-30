import { eur } from "@/app/components/mainApp/mock/format";

type Dividend = {
  ticker: string;
  amount: number;
  payment_date: string;
  is_qualified: boolean;
};

type DividendIncomeProps = {
  rows: Dividend[];
};

export default function DividendIncome({ rows }: DividendIncomeProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Dividends</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Dividend Income</h3>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment Date</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.ticker}-${row.payment_date}`} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3 font-semibold text-white">{row.ticker}</td>
                <td className="px-4 py-3 text-[#2dd4bf]">{eur.format(row.amount)}</td>
                <td className="px-4 py-3">{row.payment_date}</td>
                <td className="px-4 py-3 text-xs text-neutral-400">{row.is_qualified ? "Qualified" : "Non-qualified"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
