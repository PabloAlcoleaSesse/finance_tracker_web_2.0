"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";
import Image from "next/image";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M23.5 12.27c0-.82-.07-1.61-.22-2.36H12v4.48h6.44a5.5 5.5 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.58-5.16 3.58-8.74z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.96-1.08 7.95-2.92l-3.87-3c-1.08.72-2.46 1.14-4.08 1.14-3.14 0-5.8-2.12-6.75-4.96H1.25v3.1A12 12 0 0 0 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.25 14.26A7.2 7.2 0 0 1 4.88 12c0-.78.14-1.53.37-2.26v-3.1H1.25A12 12 0 0 0 0 12c0 1.94.46 3.77 1.25 5.36l4-3.1z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.77c1.76 0 3.34.6 4.59 1.76l3.44-3.44C17.95 1.12 15.23 0 12 0A12 12 0 0 0 1.25 6.64l4 3.1c.95-2.84 3.61-4.97 6.75-4.97z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginView() {
  const router = useRouter();
  const { login, loginWithGoogle, authError, clearAuthError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);

  function normalizeCodeInput(value: string): string {
    return value.replace(/\D/g, "").slice(0, 6);
  }

  function getErrorMessage(error: unknown): string {
    if (typeof error === "object" && error && "message" in error) {
      return String((error as { message: string }).message).toLowerCase();
    }
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearAuthError();
    setIsSubmitting(true);
    try {
      await login({
        email,
        password,
        two_factor_code: needsTwoFactor ? twoFactorCode.trim() : undefined,
      });
      setNeedsTwoFactor(false);
      setTwoFactorCode("");
      router.push("/mainApp?view=dashboard");
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.includes("two-factor code required")) {
        setNeedsTwoFactor(true);
      }
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
            <Image
              src="/logo/LogoHeader.svg"
              alt="Shiru logo"
              width={1600}
              height={400}
              className="h-10 w-auto"
              priority
            />
            <p className="w-fit rounded-full border border-[#FFB95D]/45 bg-[#FFB95D]/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-[#FFB95D]">
              SHIRU PORTFOLIO
            </p>
            <h1 className="text-4xl font-black leading-tight">
              Welcome back
              <br />
              to your money cockpit.
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
            Track positions, net worth, and performance with the same clear
            visual language as your landing workspace.
          </p>
        </aside>

        <div className="flex items-center justify-center bg-black/65 p-8 text-white sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Image
              src="/logo/Logo.svg"
              alt="Shiru logo"
              width={1600}
              height={400}
              className="mb-4 h-8 w-auto lg:hidden"
              priority
            />
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">
                Sign In
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Access your account
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {needsTwoFactor
                  ? "Enter your 6-digit authenticator code to finish login."
                  : "Use email/password or continue instantly with Google."}
              </p>
            </div>

            {!needsTwoFactor ? (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (error) {
                      console.error("Google sign-in failed:", error);
                    }
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/6 text-sm font-semibold text-white transition hover:border-[#FFB95D]/50 hover:bg-[#FFB95D]/10"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                    or use email
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                </div>
              </>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authError ? (
                <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {authError}
                </p>
              ) : null}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-white/90"
                >
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

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-white/90"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                />
              </div>

              {needsTwoFactor ? (
                <div className="space-y-2">
                  <label
                    htmlFor="twoFactorCode"
                    className="text-sm font-semibold text-white/90"
                  >
                    2FA code
                  </label>
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(event) =>
                      setTwoFactorCode(normalizeCodeInput(event.target.value))
                    }
                    placeholder="123456"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                  />
                  <p className="text-xs text-neutral-400">
                    Code refreshes every 30s.
                  </p>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/25 bg-transparent text-[#FFB95D] focus:ring-[#FFB95D]"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-white/70 transition hover:text-[#FFB95D]"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting || (needsTwoFactor && twoFactorCode.length !== 6)
                }
                className="mt-3 h-12 w-full rounded-xl bg-[#FFB95D] text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd39a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,185,93,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Signing in..."
                  : needsTwoFactor
                    ? "Verify and Log In"
                    : "Log In"}
              </button>

              <p className="pt-2 text-center text-sm text-white/70">
                New here?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-[#FFB95D] transition hover:text-[#ffd39a]"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
