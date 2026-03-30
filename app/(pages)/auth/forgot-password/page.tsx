"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiClient } from "@/lib/api/client";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Unable to process your request right now.";
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await apiClient.forgotPassword({ email: email.trim() });
      setSuccessMessage(
        response.message ??
          "If an account exists for this email, a password reset link has been sent.",
      );
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
              ACCOUNT RECOVERY
            </p>
            <h1 className="text-4xl font-black leading-tight">
              Reset your password
              <br />
              and get back in.
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
            Enter your account email and we will send a secure password reset link.
          </p>
        </aside>

        <div className="flex items-center justify-center bg-black/65 p-8 text-white sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Image src="/logo/Logo.svg" alt="Mile logo" width={1600} height={400} className="mb-4 h-8 w-auto lg:hidden" priority />
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Forgot password</p>
              <h2 className="mt-3 text-3xl font-black text-white">Recover access</h2>
              <p className="mt-2 text-sm text-white/70">We will send a one-time reset link to your email.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>
              ) : null}

              {successMessage ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{successMessage}</p>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white/90">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-xl bg-[#FFB95D] text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd39a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,185,93,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending link..." : "Send reset link"}
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
