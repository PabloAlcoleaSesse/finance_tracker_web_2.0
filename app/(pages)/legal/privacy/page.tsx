import Link from "next/link";

const retentionRows = [
  { type: "Account data", period: "While account is active + 180 days" },
  { type: "Financial transactions", period: "7 years (regulatory requirement)" },
  { type: "Access logs", period: "90 days" },
  { type: "Aggregated analytics", period: "Indefinite (anonymized)" },
  { type: "Session data", period: "30 inactive days" },
  { type: "Backups", period: "30 days after deletion" },
];

const cookieRows = [
  { cookie: "session_id", purpose: "Keep authenticated session", duration: "Session", consent: "Required" },
  { cookie: "csrf_token", purpose: "CSRF protection", duration: "Session", consent: "Required" },
  { cookie: "preferences", purpose: "Store user preferences", duration: "1 year", consent: "Required" },
  { cookie: "analytics", purpose: "Anonymous usage analytics", duration: "1 year", consent: "Optional" },
];

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="hero-gradient-bg opacity-45" />
      <section className="relative mx-auto w-full max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Legal</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Privacy Policy - FinanceTracker</h1>
            <p className="mt-2 text-sm text-white/70">Last updated: March 30, 2026</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/register"
              className="rounded-full border border-[#FFB95D]/40 bg-[#FFB95D]/10 px-4 py-2 text-sm font-semibold text-[#FFB95D] transition hover:bg-[#FFB95D]/20"
            >
              Back to Register
            </Link>
            <Link href="/" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white">
              Go to Home
            </Link>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-white/88 sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">1. Data Controller</h2>
            <p className="mt-2 text-white/80">Company: FinanceTracker</p>
            <p className="mt-1 text-white/80">Contact email: support@mileapp.com</p>
            <p className="mt-1 text-white/80">Legal location: to be completed</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">2. Information We Collect</h2>
            <p className="mt-2 font-semibold">Information you provide directly</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Account information: name, email, password, profile photo.</li>
              <li>Financial information: broker data, portfolios, positions, transactions.</li>
              <li>Optional contact information: phone number and address.</li>
              <li>Preferences: notifications, language, and theme settings.</li>
            </ul>
            <p className="mt-3 font-semibold">Information collected automatically</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Usage data: IP, browser, device, OS, pages viewed, and session duration.</li>
              <li>Cookies and similar technologies for sessions, preferences, and analytics.</li>
              <li>Server data: access logs, error logs, and performance diagnostics.</li>
              <li>Approximate location derived from IP (not GPS-based).</li>
            </ul>
            <p className="mt-3 font-semibold">Third-party information</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Broker-integrated data (IBKR, Trade Republic) and market prices.</li>
              <li>Third-party authentication or connection tokens.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">3. Legal Bases for Processing</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Consent for marketing and optional analytics.</li>
              <li>Contractual necessity to provide portfolio services.</li>
              <li>Legitimate interests (security, fraud prevention, product improvement).</li>
              <li>Legal obligations in applicable jurisdictions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">4. How We Use Data</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Provide and operate services (portfolio tracking and sync).</li>
              <li>Improve product functionality and user experience.</li>
              <li>Protect accounts and detect suspicious behavior.</li>
              <li>Send account notifications, alerts, and support messages.</li>
              <li>Comply with legal and regulatory obligations.</li>
              <li>Send marketing communications where consented.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">5. Data Sharing</h2>
            <p className="mt-2 text-white/80">We only share data in the following cases:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Service providers: hosting, analytics, infrastructure, and broker connectivity.</li>
              <li>Legal requests: court orders or lawful authority requirements.</li>
              <li>Rights protection: legal defense and fraud investigations.</li>
            </ul>
            <p className="mt-3 font-semibold text-[#FFB95D]">We do not share:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Broker passwords in plaintext.</li>
              <li>Sensitive financial data without user authorization.</li>
              <li>Personal data for sale or marketing without consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">6. Data Retention</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Data type</th>
                    <th className="px-4 py-3 font-semibold">Retention period</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionRows.map((row) => (
                    <tr key={row.type} className="border-t border-white/10 text-white/85">
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">{row.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-white/80">Data is securely deleted after retention periods using cryptographic deletion standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">7. Your Rights</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Access your personal data.</li>
              <li>Correct inaccurate records.</li>
              <li>Request deletion under applicable law.</li>
              <li>Restrict or object to specific processing.</li>
              <li>Request data portability.</li>
              <li>Withdraw consent where processing is consent-based.</li>
            </ul>
            <p className="mt-2 text-white/80">To exercise rights, contact support@mileapp.com with valid identity verification.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">8. Data Security</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>TLS 1.3 in transit and AES-256 at rest.</li>
              <li>JWT authentication, optional 2FA, bcrypt password hashing.</li>
              <li>Role-based access controls and audit logging.</li>
              <li>Encrypted backups and continuous monitoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">9. Cookies and Tracking Technologies</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Cookie</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                    <th className="px-4 py-3 font-semibold">Duration</th>
                    <th className="px-4 py-3 font-semibold">Consent</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieRows.map((row) => (
                    <tr key={row.cookie} className="border-t border-white/10 text-white/85">
                      <td className="px-4 py-3 font-semibold">{row.cookie}</td>
                      <td className="px-4 py-3">{row.purpose}</td>
                      <td className="px-4 py-3">{row.duration}</td>
                      <td className="px-4 py-3">{row.consent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">10. International Data Transfers</h2>
            <p className="mt-2 text-white/80">When data is transferred cross-border, we use appropriate safeguards such as SCCs and equivalent contractual protections.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">11. Policy Updates</h2>
            <p className="mt-2 text-white/80">We may update this policy and will notify users of material changes by email and/or in-app notice with reasonable advance notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">12. Children&apos;s Data</h2>
            <p className="mt-2 text-white/80">FinanceTracker is not intended for users under 18. If such data is detected, it will be removed promptly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">13. Supervisory Authorities</h2>
            <p className="mt-2 text-white/80">Users may contact applicable data protection authorities in their jurisdiction (e.g., GDPR, CCPA, LGPD authorities).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">14. Contact</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Privacy email: support@mileapp.com</li>
              <li>DPO email: dpo@mileapp.com</li>
              <li>Contact form: to be added</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#FFB95D]/30 bg-[#FFB95D]/10 p-5 text-[#ffe8c7]">
            <p className="text-base font-bold">Acceptance</p>
            <p className="mt-2 text-sm sm:text-base">By using FinanceTracker, you acknowledge and accept this Privacy Policy.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
