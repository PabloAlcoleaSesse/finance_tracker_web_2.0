type Integration = {
  name: string;
  status: string;
};

type IntegrationSettingsProps = {
  rows: Integration[];
};

export default function IntegrationSettings({ rows }: IntegrationSettingsProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Integrations</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Connected Apps</h2>
      </header>
      <div className="space-y-2">
        {rows.map((row) => (
          <article key={row.name} className="flex items-center justify-between rounded-xl border border-[#334155] bg-black px-4 py-3">
            <span className="text-sm font-semibold text-white">{row.name}</span>
            <span className="rounded-full bg-[#1e1e35] px-3 py-1 text-xs text-neutral-300">{row.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
