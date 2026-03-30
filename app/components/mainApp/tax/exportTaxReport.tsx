export default function ExportTaxReport() {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-3">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Export</p>
        <h3 className="text-xl font-semibold text-white sm:text-2xl">Tax Report Export</h3>
      </header>
      <p className="mb-4 text-sm text-neutral-300">Download yearly report in PDF or CSV format for your accountant.</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf]"
        >
          Export PDF
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#334155] bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Export CSV
        </button>
      </div>
    </section>
  );
}
