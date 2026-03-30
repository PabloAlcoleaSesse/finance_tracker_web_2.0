"use client";

import { usePortfolio } from "@/app/components/mainApp/portfolioContext";

export default function PortfolioSelector() {
  const { selectedPortfolioId, setSelectedPortfolioId, portfolios, loading } = usePortfolio();

  return (
    <section className="inline-flex w-full items-center gap-2 sm:w-auto">
      <label htmlFor="portfolio" className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400">
        Portfolio
      </label>
      <div className="rounded-xl border border-[#334155] bg-black px-1 py-1">
        <select
          id="portfolio"
          className="h-9 w-full min-w-55 rounded-lg bg-transparent px-3 text-sm font-medium text-white outline-none focus:ring-0 sm:w-auto"
          value={selectedPortfolioId ?? ""}
          disabled={loading || portfolios.length === 0}
          onChange={(event) => setSelectedPortfolioId(Number(event.target.value))}
        >
          {!portfolios.length ? <option value="">No portfolios</option> : null}
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name} ({portfolio.base_currency})
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
