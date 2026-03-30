"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AssetTypeFilter from "@/app/components/mainApp/positions/assetTypeFilter";
import PositionsList from "@/app/components/mainApp/positions/positionsList";
import PositionsSummary from "@/app/components/mainApp/positions/positionsSummary";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import type { AssetType, PositionViewModel } from "@/app/components/mainApp/positions/types";
import { usePositions } from "@/app/hooks/api/usePositions";

const OPTIONS = ["All", "Stocks", "Index Fund", "Crypto", "Fixed Income", "Gold", "Cash", "Other"] as const;
const ASSET_TYPES = ["Stocks", "Index Fund", "Crypto", "Fixed Income", "Gold", "Cash", "Other"] as const;

type AddPositionForm = {
  name: string;
  ticker: string;
  asset_type: string;
  shares: string;
  average_cost: string;
  current_price: string;
  currency: string;
};

const EMPTY_FORM: AddPositionForm = {
  name: "",
  ticker: "",
  asset_type: "Stocks",
  shares: "",
  average_cost: "",
  current_price: "",
  currency: "USD",
};

function toAssetTypeLabel(input: string): AssetType {
  const value = input.trim().toLowerCase();
  if (value.includes("stock") || value.includes("equity")) return "Stocks";
  if (value.includes("index") || value.includes("etf") || value.includes("fund")) return "Index Fund";
  if (value.includes("crypto")) return "Crypto";
  if (value.includes("fixed") || value.includes("bond")) return "Fixed Income";
  if (value.includes("gold")) return "Gold";
  if (value.includes("cash")) return "Cash";
  return "Other";
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AddPositionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (form: AddPositionForm) => Promise<void>;
}) {
  const [form, setForm] = useState<AddPositionForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function setField(field: keyof AddPositionForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.name || !form.ticker || !form.shares || !form.average_cost || !form.current_price || !form.currency) {
      setFormError("All fields are required.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create position.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#334155] bg-black p-6">
        <h2 className="mb-5 text-lg font-semibold text-white">Add Position</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            { label: "Name", field: "name" as const, placeholder: "Apple Inc." },
            { label: "Ticker", field: "ticker" as const, placeholder: "AAPL" },
            { label: "Shares", field: "shares" as const, placeholder: "10", type: "number" },
            { label: "Average Cost", field: "average_cost" as const, placeholder: "150.00", type: "number" },
            { label: "Current Price", field: "current_price" as const, placeholder: "170.00", type: "number" },
            { label: "Currency", field: "currency" as const, placeholder: "USD" },
          ].map(({ label, field, placeholder, type }) => (
            <label key={field} className="flex flex-col gap-1 text-xs text-neutral-400">
              {label}
              <input
                type={type ?? "text"}
                value={form[field]}
                onChange={(e) => setField(field, e.target.value)}
                placeholder={placeholder}
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "any" : undefined}
                className="rounded-lg border border-[#334155] bg-black px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
              />
            </label>
          ))}

          <label className="flex flex-col gap-1 text-xs text-neutral-400">
            Asset Type
            <select
              value={form.asset_type}
              onChange={(e) => setField("asset_type", e.target.value)}
              className="rounded-lg border border-[#334155] bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#14b8a6]"
            >
              {ASSET_TYPES.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
          </label>

          {formError && <p className="text-xs text-rose-400">{formError}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[#334155] px-4 py-2 text-sm text-neutral-400 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#14b8a6] px-4 py-2 text-sm font-semibold text-black hover:bg-[#2dd4bf] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Position"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PositionsView() {
  const { selectedPortfolioId } = usePortfolio();
  const { items, loading, error, load, create } = usePositions();
  const [selectedAssetType, setSelectedAssetType] = useState<"All" | AssetType>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddPosition = useCallback(
    async (form: AddPositionForm) => {
      if (!selectedPortfolioId) return;

      await create(selectedPortfolioId, {
        name: form.name,
        ticker: form.ticker,
        asset_type: form.asset_type,
        shares: parseFloat(form.shares),
        average_cost: parseFloat(form.average_cost),
        current_price: parseFloat(form.current_price),
        currency: form.currency.toUpperCase(),
      });
    },
    [selectedPortfolioId, create],
  );

  useEffect(() => {
    if (!selectedPortfolioId) return;
    void load(selectedPortfolioId);
  }, [selectedPortfolioId, load]);

  const positions = useMemo<PositionViewModel[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        ticker: item.ticker,
        shares: item.shares,
        average_cost: item.average_cost,
        current_price: item.current_price,
        currency: item.currency,
        total_cost: item.total_cost,
        total_value: item.total_value,
        gain: item.gain,
        gain_percent: item.gain_percent,
        asset_type: toAssetTypeLabel(item.asset_type),
        last_price_update: formatDate(item.last_price_update),
        daily_change_percent: item.daily_change_percent,
        daily_change_amount: item.daily_change,
      })),
    [items],
  );

  const summary = useMemo(() => {
    const totals = positions.reduce(
      (acc, item) => {
        acc.total_cost += item.total_cost;
        acc.total_value += item.total_value;
        acc.total_gain += item.gain;
        return acc;
      },
      { total_cost: 0, total_value: 0, total_gain: 0 },
    );

    return {
      ...totals,
      total_gain_percent: totals.total_cost > 0 ? totals.total_gain / totals.total_cost : 0,
    };
  }, [positions]);

  const filteredPositions = useMemo(() => {
    if (selectedAssetType === "All") return positions;
    return positions.filter((position) => position.asset_type === selectedAssetType);
  }, [positions, selectedAssetType]);

  return (
    <>
      <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <header className="flex flex-col gap-3 rounded-2xl border border-[#334155] bg-black p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Investments</p>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">Positions</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf] hover:bg-[#14b8a6]/20"
            >
              Add Position
            </button>
          </header>

          {loading ? <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">Loading positions...</p> : null}
          {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</p> : null}

          <PositionsSummary summary={summary} />

          <AssetTypeFilter options={[...OPTIONS]} selected={selectedAssetType} onSelect={setSelectedAssetType} />

          {!loading && !error && filteredPositions.length === 0 ? (
            <p className="rounded-2xl border border-[#334155] bg-black p-4 text-sm text-neutral-300">No positions found for this portfolio.</p>
          ) : null}

          <PositionsList positions={filteredPositions} />
        </div>
      </div>

      {showAddModal && <AddPositionModal onClose={() => setShowAddModal(false)} onSave={handleAddPosition} />}
    </>
  );
}
