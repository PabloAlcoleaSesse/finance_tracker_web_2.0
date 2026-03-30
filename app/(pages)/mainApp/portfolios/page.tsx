"use client";

import { usePortfolio } from "@/app/components/mainApp/portfolioContext";

export default function PortfoliosPage() {
  const { selectedPortfolioId, setSelectedPortfolioId, portfolios, loading, error } = usePortfolio();

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Investments</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Portfolios</h1>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {loading ? (
            <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">Loading portfolios...</p>
          ) : null}
          {error ? (
            <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p>
          ) : null}
          {!loading && !error && portfolios.length === 0 ? (
            <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">No portfolios found. Create one first.</p>
          ) : null}

          {portfolios.map((portfolio) => {
            const active = portfolio.id === selectedPortfolioId;
            return (
              <article key={portfolio.id} className="rounded-2xl border border-[#334155] bg-black p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">{portfolio.base_currency}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{portfolio.name}</h2>
                <p className="mt-1 text-sm text-neutral-400">ID: {portfolio.id}</p>
                <button
                  type="button"
                  onClick={() => setSelectedPortfolioId(Number(portfolio.id))}
                  className={`mt-4 rounded-xl border px-4 py-2 text-sm font-semibold ${
                    active
                      ? "border-[#14b8a6]/30 bg-[#14b8a6]/10 text-[#2dd4bf]"
                      : "border-[#334155] bg-black text-white"
                  }`}
                >
                  {active ? "Selected" : "Select Portfolio"}
                </button>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
