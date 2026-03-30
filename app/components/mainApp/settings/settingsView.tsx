"use client";

import { useState } from "react";
import PortfolioSettings from "@/app/components/mainApp/settings/portfolioSettings";
import NotificationSettings from "@/app/components/mainApp/settings/notificationSettings";
import DataManagement from "@/app/components/mainApp/settings/dataManagement";
import IntegrationSettings from "@/app/components/mainApp/settings/integrationSettings";
import TwoFactorSettings from "@/app/components/mainApp/settings/twoFactorSettings";
import { usePortfolio } from "@/app/components/mainApp/portfolioContext";
import { usePortfolios } from "@/app/hooks/api/usePortfolios";
import { useAuth } from "@/app/hooks/api/useAuth";

const defaultNotifications = {
  dailyPriceUpdate: false,
  weeklySummary: false,
  significantMoves: false,
  dividendPayments: false,
};

const staticIntegrations = [
  { name: "Interactive Brokers", status: "Connected" },
  { name: "TaxDown", status: "Planned" },
  { name: "Google Sheets", status: "Draft" },
];

export default function SettingsView() {
  const { selectedPortfolioId, portfolios } = usePortfolio();
  const { update } = usePortfolios();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState(defaultNotifications);

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId) ?? null;

  function handleToggle(key: "dailyPriceUpdate" | "weeklySummary" | "significantMoves" | "dividendPayments") {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSavePortfolio(name: string, currency: string) {
    if (!selectedPortfolioId) throw new Error("No portfolio selected.");
    await update(selectedPortfolioId, { name, base_currency: currency });
  }

  return (
    <div className="w-full flex-1 overflow-y-auto rounded-3xl border border-[#334155] bg-black p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="rounded-2xl border border-[#334155] bg-black p-4">
          <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Settings</p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Portfolio Configuration</h1>
        </header>

        {!selectedPortfolio && (
          <p className="text-sm text-neutral-500">Select a portfolio to configure settings.</p>
        )}

        {selectedPortfolio && (
          <PortfolioSettings
            name={selectedPortfolio.name}
            currency={selectedPortfolio.base_currency}
            onSave={handleSavePortfolio}
          />
        )}

        <section className="grid gap-4 xl:grid-cols-2">
          <NotificationSettings state={notifications} onToggle={handleToggle} />
          <IntegrationSettings rows={staticIntegrations} />
          <TwoFactorSettings token={token} />
        </section>

        <DataManagement />
      </div>
    </div>
  );
}
