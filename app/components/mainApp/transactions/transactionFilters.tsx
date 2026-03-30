import type { TransactionFiltersState } from "@/app/components/mainApp/transactions/types";

type TransactionFiltersProps = {
  filters: TransactionFiltersState;
  years: string[];
  onChange: (next: TransactionFiltersState) => void;
};

export default function TransactionFilters({ filters, years, onChange }: TransactionFiltersProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-4">
      <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Filters</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <select
          className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-white"
          value={filters.tradeType}
          onChange={(event) => onChange({ ...filters, tradeType: event.target.value as TransactionFiltersState["tradeType"] })}
        >
          <option>All</option>
          <option>BUY</option>
          <option>SELL</option>
        </select>
        <select
          className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-white"
          value={filters.assetType}
          onChange={(event) => onChange({ ...filters, assetType: event.target.value as TransactionFiltersState["assetType"] })}
        >
          <option>All</option>
          <option>Stocks</option>
          <option>Index Fund</option>
          <option>Crypto</option>
          <option>Fixed Income</option>
          <option>Gold</option>
          <option>Cash</option>
        </select>
        <select
          className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-sm text-white"
          value={filters.year}
          onChange={(event) => onChange({ ...filters, year: event.target.value })}
        >
          <option>All</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
