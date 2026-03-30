"use client";

import { useState } from "react";

type PortfolioSettingsProps = {
  name: string;
  currency: string;
  onSave?: (name: string, currency: string) => Promise<void>;
};

export default function PortfolioSettings({ name, currency, onSave }: PortfolioSettingsProps) {
  const [editName, setEditName] = useState(name);
  const [editCurrency, setEditCurrency] = useState(currency);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!onSave) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(editName, editCurrency);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Portfolio</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Settings</h2>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Portfolio Name
          <input
            className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-neutral-300">
          Base Currency
          <select
            className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
            value={editCurrency}
            onChange={(e) => setEditCurrency(e.target.value)}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !onSave}
        className="mt-4 rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf] disabled:opacity-50"
      >
        {saving ? "Saving…" : saved ? "Saved!" : "Save Portfolio Settings"}
      </button>
    </section>
  );
}
