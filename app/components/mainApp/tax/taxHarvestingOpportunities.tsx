import { eur } from "@/app/components/mainApp/mock/format";

type Opportunity = {
  ticker: string;
  unrealized_loss: number;
  recommendation: string;
};

type TaxHarvestingOpportunitiesProps = {
  rows: Opportunity[];
};

export default function TaxHarvestingOpportunities({ rows }: TaxHarvestingOpportunitiesProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Tax harvesting</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Opportunities</h3>
      </header>
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.ticker} className="rounded-2xl border border-[#334155] bg-black p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-lg font-semibold text-white">{row.ticker}</p>
              <p className="text-sm font-semibold text-rose-300">{eur.format(row.unrealized_loss)}</p>
            </div>
            <p className="mt-2 text-sm text-neutral-300">{row.recommendation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
