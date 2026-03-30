"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unable to reset password right now.";
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.resetPassword({
        token,
        new_password: newPassword,
      });

      setSuccessMessage(response.message ?? response.status ?? "Password reset successful. Redirecting to login...");
      window.setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="hero-gradient-bg opacity-60" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-2 h-72 w-72 rounded-full bg-[#FFB95D]/25 blur-3xl" />
        <div className="absolute -right-16 bottom-4 h-80 w-80 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <section className="relative grid h-full w-full overflow-hidden bg-black/50 backdrop-blur-sm lg:grid-cols-2">
        <aside className="hero-gradient-card hidden h-full flex-col justify-between p-12 text-white lg:flex">
          <div className="space-y-4">
            <Image src="/logo/Logo.svg" alt="Mile logo" width={1600} height={400} className="h-10 w-auto" priority />
            <p className="w-fit rounded-full border border-[#FFB95D]/45 bg-[#FFB95D]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#FFB95D]">
              SECURITY CHECKPOINT
            </p>
            <h1 className="text-4xl font-black leading-tight">
              Choose a new password
              <br />
              for your account.
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
            Use a strong password with at least 8 characters, including letters, numbers, and symbols when possible.
          </p>
        </aside>

        <div className="flex items-center justify-center bg-black/65 p-8 text-white sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Image src="/logo/Logo.svg" alt="Mile logo" width={1600} height={400} className="mb-4 h-8 w-auto lg:hidden" priority />
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Reset password</p>
              <h2 className="mt-3 text-3xl font-black text-white">Set your new password</h2>
              <p className="mt-2 text-sm text-white/70">This reset link works once and expires in 30 minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>
              ) : null}

              {successMessage ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{successMessage}</p>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-semibold text-white/90">
                  New password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter a strong password"
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-white/90">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                />
              </div>

              {passwordMismatch ? <p className="text-xs font-semibold text-rose-300">Passwords do not match.</p> : null}

              <button
                type="submit"
                disabled={isSubmitting || passwordMismatch}
                className="mt-2 h-12 w-full rounded-xl bg-[#FFB95D] text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd39a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,185,93,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Resetting..." : "Reset password"}
              </button>

              <p className="pt-2 text-center text-sm text-white/70">
                Back to{" "}
                <Link href="/auth/login" className="font-semibold text-[#FFB95D] transition hover:text-[#ffd39a]">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
