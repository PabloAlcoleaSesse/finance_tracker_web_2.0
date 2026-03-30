"use client";

import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/app/hooks/api/useAuth";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";

export default function CreatePortfolioPage() {
  const { token } = useAuth();
  const { refreshPortfolios, setSelectedPortfolioId } = usePortfolio();
  const [name, setName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Authentication required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await apiClient.createPortfolio({ name, base_currency: baseCurrency }, token);
      await refreshPortfolios();
      setSelectedPortfolioId(created.id);
      setSuccess(`Portfolio ${created.name} created.`);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Investments</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Create Portfolio</h1>
        </header>

        <section className="rounded-2xl border border-[#334155] bg-black p-5">
          {error ? <p className="mb-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="mb-3 rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-3 py-2 text-sm text-[#2dd4bf]">{success}</p> : null}
          <form onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Portfolio Name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
                placeholder="Income + Growth"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-300">
              Base Currency
              <select
                className="rounded-xl border border-[#334155] bg-black px-3 py-2 text-white"
                value={baseCurrency}
                onChange={(event) => setBaseCurrency(event.target.value)}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-xl border border-[#14b8a6]/30 bg-[#14b8a6]/10 px-4 py-2 text-sm font-semibold text-[#2dd4bf]"
          >
            {isSubmitting ? "Creating..." : "Create Portfolio"}
          </button>
          </form>
        </section>
      </div>
    </div>
  );
}
