type NotificationSettingsProps = {
  state: {
    dailyPriceUpdate: boolean;
    weeklySummary: boolean;
    significantMoves: boolean;
    dividendPayments: boolean;
  };
  onToggle: (key: "dailyPriceUpdate" | "weeklySummary" | "significantMoves" | "dividendPayments") => void;
};

function ToggleRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-[#334155] bg-black px-4 py-3 text-left"
    >
      <span className="text-sm text-neutral-300">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${checked ? "bg-[#14b8a6]/10 text-[#2dd4bf]" : "bg-[#1e1e35] text-neutral-300"}`}>
        {checked ? "On" : "Off"}
      </span>
    </button>
  );
}

export default function NotificationSettings({ state, onToggle }: NotificationSettingsProps) {
  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Notifications</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Alert Preferences</h2>
      </header>
      <div className="space-y-2">
        <ToggleRow label="Daily price update emails" checked={state.dailyPriceUpdate} onClick={() => onToggle("dailyPriceUpdate")} />
        <ToggleRow label="Weekly summary emails" checked={state.weeklySummary} onClick={() => onToggle("weeklySummary")} />
        <ToggleRow label="Significant gain/loss alerts" checked={state.significantMoves} onClick={() => onToggle("significantMoves")} />
        <ToggleRow label="Dividend payment notifications" checked={state.dividendPayments} onClick={() => onToggle("dividendPayments")} />
      </div>
    </section>
  );
}
