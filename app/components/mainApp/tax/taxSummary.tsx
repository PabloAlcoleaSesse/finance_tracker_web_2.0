import { eur } from "@/app/components/mainApp/mock/format";

type TaxSummaryProps = {
  summary: {
    total_realized_gain: number;
    total_realized_loss: number;
    net_realized_gain: number;
    short_term_gains: number;
    long_term_gains: number;
    total_dividend_income: number;
  };
};

export default function TaxSummary({ summary }: TaxSummaryProps) {
  const cards = [
    { label: "Realized Gain", value: summary.total_realized_gain },
    { label: "Realized Loss", value: summary.total_realized_loss },
    { label: "Net Realized", value: summary.net_realized_gain },
    { label: "Short-Term", value: summary.short_term_gains },
    { label: "Long-Term", value: summary.long_term_gains },
    { label: "Dividend Income", value: summary.total_dividend_income },
  ];

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Tax summary</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Annual Fiscal Overview</h2>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const positive = card.value >= 0;
          return (
            <article key={card.label} className="rounded-2xl border border-[#334155] bg-black p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">{card.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${positive ? "text-[#2dd4bf]" : "text-rose-300"}`}>
                {eur.format(card.value)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
