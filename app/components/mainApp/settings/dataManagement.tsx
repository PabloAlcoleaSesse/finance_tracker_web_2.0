export default function DataManagement() {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Data management</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Data Actions</h2>
      </header>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-[#334155] bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Export All Data
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#334155] bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Archive Old Transactions
        </button>
        <button
          type="button"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300"
        >
          Delete Portfolio
        </button>
      </div>
    </section>
  );
}
