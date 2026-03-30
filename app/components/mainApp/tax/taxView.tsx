"use client";

import { useEffect, useMemo, useState } from "react";
import TaxYearSelector from "@/app/components/mainApp/tax/taxYearSelector";
import TaxSummary from "@/app/components/mainApp/tax/taxSummary";
import RealizedGainsTable from "@/app/components/mainApp/tax/realizedGainsTable";
import UnrealizedGainsTable from "@/app/components/mainApp/tax/unrealizedGainsTable";
import TaxHarvestingOpportunities from "@/app/components/mainApp/tax/taxHarvestingOpportunities";
import DividendIncome from "@/app/components/mainApp/tax/dividendIncome";
import ExportTaxReport from "@/app/components/mainApp/tax/exportTaxReport";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { useTax } from "@/app/hooks/api/useTax";

function asNumber(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export default function TaxView() {
  const { selectedPortfolioId } = usePortfolio();
  const { report, unrealizedGains, opportunities, loading, error, load } = useTax();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!selectedPortfolioId) {
      return;
    }
    void load(selectedPortfolioId, selectedYear);
  }, [selectedPortfolioId, selectedYear, load]);

  const availableYears = useMemo(() => {
    const now = new Date().getFullYear();
    const reportYear = report?.year;
    return Array.from(new Set([reportYear, now, now - 1, now - 2].filter((value): value is number => Boolean(value))));
  }, [report]);

  const summary = useMemo(
    () => ({
      total_realized_gain: asNumber(report?.totals?.total_realized_gain),
      total_realized_loss: asNumber(report?.totals?.total_realized_loss),
      net_realized_gain: asNumber(report?.totals?.net_realized_gain),
      short_term_gains: asNumber(report?.totals?.short_term_gains),
      long_term_gains: asNumber(report?.totals?.long_term_gains),
      total_dividend_income: asNumber(report?.totals?.total_dividend_income),
    }),
    [report],
  );

  const realizedRows = useMemo(
    () =>
      (report?.realized_gains ?? []).map((row) => ({
        ticker: asString(row.ticker),
        quantity: asNumber(row.quantity),
        cost_basis: asNumber(row.cost_basis),
        sale_price: asNumber(row.sale_price),
        gain_loss: asNumber(row.gain_loss),
        purchase_date: asString(row.purchase_date),
        sale_date: asString(row.sale_date),
        holding_period: asString(row.holding_period),
        is_short_term: Boolean(row.is_short_term),
      })),
    [report],
  );

  const unrealizedRows = useMemo(
    () =>
      unrealizedGains.map((row) => ({
        ticker: row.ticker,
        shares: row.shares,
        average_cost: row.average_cost,
        current_price: row.current_price,
        unrealized_gain: row.unrealized_gain,
        gain_percent: row.gain_percent,
        holding_period: row.holding_period ?? "-",
      })),
    [unrealizedGains],
  );

  const opportunitiesRows = useMemo(
    () =>
      opportunities.map((row) => ({
        ticker: row.ticker,
        unrealized_loss: row.unrealized_loss,
        recommendation: row.recommendation,
      })),
    [opportunities],
  );

  const dividendRows = useMemo(
    () =>
      (report?.dividends ?? []).map((row) => ({
        ticker: asString(row.ticker),
        amount: asNumber(row.amount),
        payment_date: asString(row.payment_date),
        is_qualified: Boolean(row.is_qualified),
      })),
    [report],
  );

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Taxes</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Fiscality and Tax Reporting</h1>
        </header>

        {loading ? <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">Loading tax data...</p> : null}
        {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}

        <TaxYearSelector years={availableYears} selected={selectedYear} onSelect={setSelectedYear} />
        <TaxSummary summary={summary} />

        <section className="grid gap-4 xl:grid-cols-2">
          <RealizedGainsTable rows={realizedRows} />
          <UnrealizedGainsTable rows={unrealizedRows} />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <TaxHarvestingOpportunities rows={opportunitiesRows} />
          <DividendIncome rows={dividendRows} />
        </section>

        <ExportTaxReport />
      </div>
    </div>
  );
}
