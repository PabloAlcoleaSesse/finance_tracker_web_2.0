"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api/client";
import type { TwoFactorSetupResponse } from "@/lib/api/types";

type TwoFactorSettingsProps = {
  token: string | null;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return fallback;
}

function normalizeCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function TwoFactorSettings({ token }: TwoFactorSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [enableCode, setEnableCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const qrImageUrl = useMemo(() => {
    if (!setupData?.otpauth_url) {
      return "";
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(setupData.otpauth_url)}`;
  }, [setupData]);

  const refreshStatus = useCallback(async () => {
    if (!token) {
      setEnabled(false);
      setSetupData(null);
      return;
    }

    setLoadingStatus(true);
    setError(null);
    try {
      const response = await apiClient.getTwoFactorStatus(token);
      setEnabled(response.enabled);
      if (response.enabled) {
        setSetupData(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load 2FA status."));
    } finally {
      setLoadingStatus(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const left = 30 - (nowInSeconds % 30);
      setSecondsLeft(left === 30 ? 0 : left);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  async function handleSetup() {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await apiClient.setupTwoFactor(token);
      setSetupData(response);
      setMessage("2FA setup generated. Scan the QR and confirm with a 6-digit code.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to start 2FA setup."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnable() {
    if (!token) return;
    const code = normalizeCodeInput(enableCode.trim());
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await apiClient.enableTwoFactor({ code }, token);
      setEnableCode("");
      setSetupData(null);
      setMessage("Two-factor authentication is now enabled.");
      await refreshStatus();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to enable 2FA."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisable() {
    if (!token) return;
    const code = normalizeCodeInput(disableCode.trim());
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await apiClient.disableTwoFactor({ code }, token);
      setDisableCode("");
      setMessage("Two-factor authentication is now disabled.");
      await refreshStatus();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to disable 2FA."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopySecret() {
    if (!setupData?.secret) return;

    try {
      await navigator.clipboard.writeText(setupData.secret);
      setMessage("Secret copied to clipboard.");
    } catch {
      setError("Unable to copy secret. Please copy it manually.");
    }
  }

  return (
    <section className="rounded-2xl border border-[#334155] bg-black p-5">
      <header className="mb-4">
        <p className="text-xs font-medium tracking-[0.08em] text-neutral-400">Security</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Two-Factor Authentication</h2>
      </header>

      <p className="mb-3 text-sm text-neutral-300">
        Protect your account with app-based TOTP (Google Authenticator, Authy, 1Password).
      </p>

      <p className="mb-3 text-xs uppercase tracking-[0.12em] text-neutral-500">
        Status: {loadingStatus ? "Loading..." : enabled ? "Enabled" : "Disabled"}
      </p>

      {error ? (
        <p className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      ) : null}

      {!enabled ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSetup}
            disabled={!token || submitting}
            className="rounded-xl border border-[#334155] bg-black px-4 py-2 text-sm font-semibold text-white transition hover:border-[#FFB95D]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Preparing..." : "Enable 2FA"}
          </button>

          {setupData ? (
            <div className="space-y-3 rounded-xl border border-[#334155] bg-black p-4">
              <p className="text-sm text-neutral-300">1) Scan this QR code with your authenticator app.</p>
              <img src={qrImageUrl} alt="2FA setup QR" className="h-55 w-55 rounded-lg border border-[#334155] bg-black" />

              <div>
                <p className="text-sm text-neutral-300">2) If QR is unavailable, enter this secret manually:</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <code className="rounded-md border border-[#334155] bg-black px-2 py-1 text-xs text-[#FFB95D]">{setupData.secret}</code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="rounded-md border border-[#334155] px-2 py-1 text-xs font-semibold text-white hover:border-[#FFB95D]/50"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="enable-2fa-code" className="text-sm text-neutral-300">
                  3) Enter the 6-digit code to confirm setup
                </label>
                <input
                  id="enable-2fa-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={enableCode}
                  onChange={(event) => setEnableCode(normalizeCodeInput(event.target.value))}
                  placeholder="123456"
                  className="h-11 w-full max-w-xs rounded-xl border border-[#334155] bg-black px-4 text-white outline-none transition focus:border-[#FFB95D]/60"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleEnable}
                  disabled={submitting || enableCode.length !== 6}
                  className="rounded-xl border border-[#FFB95D]/40 bg-[#FFB95D]/10 px-4 py-2 text-sm font-semibold text-[#FFB95D] hover:bg-[#FFB95D]/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Confirming..." : "Confirm and Enable"}
                </button>
                <p className="text-xs text-neutral-500">Code refreshes every {secondsLeft}s</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-[#334155] bg-black p-4">
          <p className="text-sm text-neutral-300">Enter your current 6-digit authenticator code to disable 2FA.</p>
          <input
            id="disable-2fa-code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={disableCode}
            onChange={(event) => setDisableCode(normalizeCodeInput(event.target.value))}
            placeholder="123456"
            className="h-11 w-full max-w-xs rounded-xl border border-[#334155] bg-black px-4 text-white outline-none transition focus:border-[#FFB95D]/60"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDisable}
              disabled={submitting || disableCode.length !== 6}
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Disabling..." : "Disable 2FA"}
            </button>
            <p className="text-xs text-neutral-500">Code refreshes every {secondsLeft}s</p>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">If you lose your authenticator app, contact support. Backup codes are not available yet.</p>
    </section>
  );
}
