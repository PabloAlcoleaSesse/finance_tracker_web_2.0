import { eur } from "@/app/components/mainApp/mock/format";

type Contribution = {
  period: string;
  value: number;
};

type ContributionsTrackerProps = {
  rows: Contribution[];
};

export default function ContributionsTracker({ rows }: ContributionsTrackerProps) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Contributions</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Invested Capital by Period</h3>
      </header>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.period}>
            <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
              <span>{row.period}</span>
              <span>{eur.format(row.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-[#1e1e35]">
              <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
