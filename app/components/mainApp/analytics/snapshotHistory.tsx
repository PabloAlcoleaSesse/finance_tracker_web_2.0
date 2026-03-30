import { eur, formatPercent } from "@/app/components/mainApp/mock/format";

type SnapshotHistoryProps = {
  snapshots: Array<{
    date: string;
    total_value: number;
    total_cost: number;
    total_gain: number;
    gain_percent: number;
  }>;
};

export default function SnapshotHistory({ snapshots }: SnapshotHistoryProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Snapshots</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Snapshot History</h3>
      </header>
      <div className="overflow-x-auto rounded-2xl border border-[#334155]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black text-xs uppercase tracking-[0.12em] text-neutral-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Gain</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snapshot) => (
              <tr key={snapshot.date} className="border-t border-[#334155] text-neutral-200">
                <td className="px-4 py-3">{snapshot.date}</td>
                <td className="px-4 py-3 font-semibold text-white">{eur.format(snapshot.total_value)}</td>
                <td className="px-4 py-3">{eur.format(snapshot.total_cost)}</td>
                <td className="px-4 py-3 text-[#2dd4bf]">{`${eur.format(snapshot.total_gain)} (${formatPercent(snapshot.gain_percent)})`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
