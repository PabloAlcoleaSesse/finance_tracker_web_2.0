"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/api/useAuth";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";

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

export default function RegisterView() {
  const router = useRouter();
  const { register, registerWithGoogle, authError, clearAuthError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const passwordMismatch = useMemo(
    () => confirmPassword.length > 0 && password !== confirmPassword,
    [password, confirmPassword],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!acceptedTerms) {
      setLocalError("You must accept terms and privacy policy.");
      return;
    }
    if (passwordMismatch) {
      setLocalError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email, password, name });
      router.push("/mainApp?view=dashboard");
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
              Build your portfolio
              <br />
              command center.
            </h1>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80">
            Start with email or Google and unlock one clean workspace for
            tracking positions, returns, and risk.
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
                Sign Up
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Join with email/password or create your account with Google.
              </p>
            </div>

            <div className="flex w-full justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      await registerWithGoogle(credentialResponse.credential);
                      router.push("/mainApp?view=dashboard");
                    } catch (error) {
                      console.error("Google sign-in failed:", error);
                    }
                  }
                }}
                onError={() => {
                  console.error("Google Login Failed");
                }}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
              />
            </div>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/15" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                or use email
              </span>
              <span className="h-px flex-1 bg-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {localError || authError ? (
                <p className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {localError ?? authError}
                </p>
              ) : null}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-white/90"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                />
              </div>

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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create password"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-white/90"
                  >
                    Confirm
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                    className="h-12 w-full rounded-xl border border-white/15 bg-black/55 px-4 text-white placeholder-white/45 outline-none ring-0 transition focus:border-[#FFB95D]/70 focus:shadow-[0_0_0_4px_rgba(255,185,93,0.18)]"
                  />
                </div>
              </div>

              {passwordMismatch ? (
                <p className="text-xs font-semibold text-rose-300">
                  Passwords do not match.
                </p>
              ) : null}

              <label className="inline-flex items-center gap-2 pt-1 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="h-4 w-4 rounded border-white/25 bg-transparent text-[#FFB95D] focus:ring-[#FFB95D]"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    className="font-semibold text-[#FFB95D] hover:text-[#ffd39a]"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-xl bg-[#FFB95D] text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd39a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,185,93,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>

              <p className="pt-2 text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[#FFB95D] transition hover:text-[#ffd39a]"
                >
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
