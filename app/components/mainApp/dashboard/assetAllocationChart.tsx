import type { PositionWithMetrics } from "@/lib/api/types";

type Props = {
  positions?: PositionWithMetrics[];
  loading?: boolean;
};

const palette = [
  "#7c3aed",
  "#14b8a6",
  "#f59e0b",
  "#a78bfa",
  "#2dd4bf",
  "#fb7185",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function AssetAllocationChart({ positions = [], loading }: Props) {
  // Derive by asset type from positions
  const byType = positions.reduce(
    (acc, p, index) => {
      if (!acc[p.asset_type]) acc[p.asset_type] = { value: 0, colorIndex: Object.keys(acc).length };
      acc[p.asset_type].value += p.total_value;
      return acc;
    },
    {} as Record<string, { value: number; colorIndex: number }>,
  );

  const entries = Object.entries(byType)
    .map(([name, data], index) => ({
      name,
      value: data.value,
      color: palette[index % palette.length],
    }))
    .filter((item) => item.value > 0);

  const total = entries.reduce((acc, item) => acc + item.value, 0);
  const slices = entries.map((item) => ({
    ...item,
    percent: total === 0 ? 0 : item.value / total,
  }));

  const donutStops: string[] = [];
  let start = 0;
  for (const slice of slices) {
    const end = start + slice.percent * 100;
    donutStops.push(`${slice.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
    start = end;
  }

  const donutBackground =
    donutStops.length > 0
      ? `conic-gradient(${donutStops.join(", ")})`
      : "conic-gradient(#1e1e35 0% 100%)";

  return (
    <section className="w-full rounded-2xl border border-[#334155] bg-black p-5">
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Asset allocation</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">By Asset Type</h2>
          <p className="text-sm text-neutral-300">Distribution of your portfolio value across asset classes.</p>
        </header>

        {loading && slices.length === 0 && <p className="text-sm text-neutral-400">Loading&hellip;</p>}
        {!loading && slices.length === 0 && <p className="text-sm text-neutral-500">No positions yet.</p>}

        {slices.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
            <div className="mx-auto">
              <div
                className="grid h-52 w-52 place-items-center rounded-full border border-[#334155]"
                style={{ backgroundImage: donutBackground }}
              >
                <div className="grid h-28 w-28 place-items-center rounded-full bg-black ring-1 ring-[#334155]">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Total</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {slices.map((slice) => (
                <li
                  key={slice.name}
                  className="flex items-center justify-between rounded-2xl border border-[#334155] bg-black px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: slice.color }}
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold text-white">{slice.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(slice.value)}</p>
                    <p className="text-xs text-neutral-400">{(slice.percent * 100).toFixed(1)}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
