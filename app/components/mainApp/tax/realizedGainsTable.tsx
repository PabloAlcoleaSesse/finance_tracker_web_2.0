import { eur } from "@/app/components/mainApp/mock/format";

type Row = {
  ticker: string;
  quantity: number;
  cost_basis: number;
  sale_price: number;
  gain_loss: number;
  purchase_date: string;
  sale_date: string;
  holding_period: string;
  is_short_term: boolean;
};

type RealizedGainsTableProps = {
  rows: Row[];
};

export default function RealizedGainsTable({ rows }: RealizedGainsTableProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Realized gains</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Closed Positions</h3>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Ticker</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Cost Basis</th>
              <th className="px-4 py-3">Sale Price</th>
              <th className="px-4 py-3">Gain / Loss</th>
              <th className="px-4 py-3">Holding</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.ticker}-${row.sale_date}`} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3 font-semibold text-white">{row.ticker}</td>
                <td className="px-4 py-3">{row.quantity}</td>
                <td className="px-4 py-3">{eur.format(row.cost_basis)}</td>
                <td className="px-4 py-3">{eur.format(row.sale_price)}</td>
                <td className={`px-4 py-3 font-semibold ${row.gain_loss >= 0 ? "text-[#2dd4bf]" : "text-rose-300"}`}>
                  {eur.format(row.gain_loss)}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-400">{`${row.holding_period} (${row.is_short_term ? "Short" : "Long"})`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
