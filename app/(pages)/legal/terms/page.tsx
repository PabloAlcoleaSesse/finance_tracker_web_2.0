import Link from "next/link";

const plans = [
  { plan: "Free", price: "$0", features: "1 portfolio, manual sync" },
  { plan: "Pro", price: "$99/year", features: "10 portfolios, automatic sync, analytics" },
  { plan: "Ultra", price: "$299/year", features: "Unlimited portfolios, API access, priority support" },
];

const effectiveDates = [
  { item: "Last update", date: "March 30, 2026" },
  { item: "Effective date", date: "March 30, 2026" },
  { item: "Previous versions", date: "Links to earlier versions" },
];

const definitions = [
  { term: "Service", meaning: "The FinanceTracker platform, including website, API, and applications." },
  { term: "User", meaning: "Any person or entity that uses FinanceTracker." },
  { term: "Content", meaning: "Data, text, and images uploaded by users." },
  { term: "API", meaning: "Application Programming Interface used for integrations." },
  { term: "Broker", meaning: "Financial institution (IBKR, Trade Republic, etc.)." },
  { term: "Portfolio", meaning: "A set of financial positions or assets." },
  { term: "Synchronization", meaning: "Retrieval of updated data from a broker." },
];

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="hero-gradient-bg opacity-45" />
      <section className="relative mx-auto w-full max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Legal</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Terms and Conditions - FinanceTracker</h1>
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
            <h2 className="text-xl font-bold text-[#FFB95D]">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing and using FinanceTracker (the "Service"), you agree to be bound by these Terms and Conditions (the "Terms"). If you do not agree with any part, you may not use the platform.
            </p>
            <p className="mt-2">Effective date: March 30, 2026.</p>
            <p className="mt-1">User since: your registration date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">2. Service Description</h2>
            <p className="mt-2 font-semibold">What FinanceTracker is</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Portfolio management: aggregation and visualization of portfolios.</li>
              <li>Broker integrations: automatic synchronization of financial data.</li>
              <li>Analytics: performance analysis, risk factors, and benchmarking.</li>
              <li>Alerts: notifications for portfolio or market changes.</li>
              <li>Multi-platform access: web, API, and mobile (coming soon).</li>
            </ul>
            <p className="mt-3 font-semibold">What we do not do</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>We do not provide financial advice.</li>
              <li>We do not execute trades or transactions on your behalf.</li>
              <li>We do not custody funds.</li>
              <li>We do not guarantee investment performance.</li>
              <li>We are not a broker or regulated financial institution.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">3. Eligibility</h2>
            <p className="mt-2">You may use FinanceTracker if you:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Are at least 18 years old (or legal age of majority in your jurisdiction).</li>
              <li>Have legal authority to enter into contracts.</li>
              <li>Are not prohibited by the laws of your country.</li>
              <li>Are not a citizen or resident of sanctioned countries.</li>
              <li>Agree to comply with these Terms.</li>
            </ul>
            <p className="mt-2">We reserve the right to reject or terminate service to any user.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">4. User Account</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>You must provide accurate and complete information.</li>
              <li>You must keep passwords and tokens secure and confidential.</li>
              <li>You may not share your account with others.</li>
              <li>You are responsible for all activity in your account.</li>
              <li>You must promptly notify us of suspected unauthorized access.</li>
            </ul>
            <p className="mt-3 font-semibold">Account deletion and data retention</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>You may delete your account at any time from Settings &gt; Account.</li>
              <li>New synchronizations stop after account deletion.</li>
              <li>Operational data is retained for 180 days, then deleted.</li>
              <li>Audit backups may be retained for up to 7 years for legal compliance.</li>
              <li>After 180 days, data recovery may not be possible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">5. Broker Integrations</h2>
            <p className="mt-2">You may only connect broker accounts that you legitimately own, and you authorize automatic data synchronization.</p>
            <p className="mt-2 text-white/80">FinanceTracker encrypts credentials, uses TLS 1.3, and does not execute transactions.</p>
            <p className="mt-2 text-white/80">We do not guarantee 100% availability, real-time accuracy, or liability for trading decisions.</p>
            <p className="mt-3 font-semibold">IBKR-specific terms</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Automatic sync every 5 minutes (configurable).</li>
              <li>Token is encrypted and revocable.</li>
              <li>IBKR password changes may require reconnection.</li>
              <li>Read-only connection: no trading access.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">6. License of Use</h2>
            <p className="mt-2 font-semibold">Allowed</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Access and analyze your own data.</li>
              <li>Export data in standard formats.</li>
              <li>Share reports with your advisor or CPA.</li>
            </ul>
            <p className="mt-3 font-semibold">Prohibited</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Selling, sublicensing, or transferring access.</li>
              <li>Scraping or automated downloads without permission.</li>
              <li>Reverse engineering or unlawful use.</li>
              <li>Commercial use without explicit license.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">7. Intellectual Property</h2>
            <p className="mt-2 text-white/80">
              FinanceTracker code, design, and documentation are owned by FinanceTracker and protected by applicable intellectual property laws.
            </p>
            <p className="mt-2 text-white/80">
              Your financial data and notes belong to you; you authorize us to process them solely to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">8. Limitation of Liability</h2>
            <p className="mt-2 text-white/80">The service is provided "as is" without warranties of total accuracy, uninterrupted availability, or error-free operation.</p>
            <p className="mt-2 text-white/80">We are not liable for direct or indirect losses arising from investment decisions based on the service.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Free users: maximum liability limit of $0.</li>
              <li>Paid users: up to 50% of fees paid in the prior 12 months.</li>
              <li>Absolute cap: USD $50,000.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">9. Limited Warranty</h2>
            <p className="mt-2 text-white/80">
              FinanceTracker will operate substantially as described and will address significant defects within reasonable response times (24-48h for normal severity).
            </p>
            <p className="mt-2 text-white/80">Exclusions include misuse, third-party failures, external API changes, and force majeure events.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">10. Availability and Maintenance</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Target availability: 99.9% SLA.</li>
              <li>Scheduled maintenance: Sundays 02:00-06:00 UTC.</li>
              <li>Maintenance notice: 72 hours when possible.</li>
              <li>No compensation for downtime except as expressly agreed in contract terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">11. Changes to the Service</h2>
            <p className="mt-2 text-white/80">We may add features, update UI, and adjust plans for new users.</p>
            <p className="mt-2 text-white/80">We will not increase current-user pricing for at least one year, and we will not delete data without consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">12. Subscription and Payment</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Features</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((row) => (
                    <tr key={row.plan} className="border-t border-white/10 text-white/85">
                      <td className="px-4 py-3 font-semibold">{row.plan}</td>
                      <td className="px-4 py-3">{row.price}</td>
                      <td className="px-4 py-3">{row.features}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-white/80">Auto-renewal applies, cancellation has no penalty, and there is a 30-day trial period with full refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">13. Taxes</h2>
            <p className="mt-2 text-white/80">You are responsible for applicable taxes in your jurisdiction. We provide electronic invoices and billing records.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">14. Prohibited Uses</h2>
            <p className="mt-2 text-white/80">You may not use FinanceTracker for fraud, money laundering, technical abuse, mass scraping, malware, impersonation, or IP violations.</p>
            <p className="mt-2 text-white/80">Violations may result in immediate suspension or termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">15. Indemnification</h2>
            <p className="mt-2 text-white/80">You agree to indemnify FinanceTracker against claims arising from breaches of these Terms or unlawful activities associated with your use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">16. Dispute Resolution</h2>
            <p className="mt-2 text-white/80">Disputes follow this sequence: support contact (30 days), mediation, then binding arbitration. Class actions are not permitted.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">17. Governing Law and Jurisdiction</h2>
            <p className="mt-2 text-white/80">Applicable law is the legal jurisdiction of FinanceTracker. Disputes are resolved in courts or arbitration under that jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">18. Geographic Restrictions</h2>
            <p className="mt-2 text-white/80">Service is not available in sanctioned countries (including Cuba, Iran, North Korea, and Syria) or where local law prohibits access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">19. Notices and Communications</h2>
            <p className="mt-2 text-white/80">Notices may be sent by email, in-app messages, and push notifications (if enabled), and are considered received according to the delivery policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">20. Changes to These Terms</h2>
            <p className="mt-2 text-white/80">We may modify these Terms with 30 days advance notice for material changes. Minor changes may apply immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">21. Severability</h2>
            <p className="mt-2 text-white/80">If any clause is invalid or unenforceable, the remaining clauses remain in full force.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">22. Entire Agreement</h2>
            <p className="mt-2 text-white/80">These Terms constitute the complete agreement between FinanceTracker and the User.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">23. Contact</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Legal email: legal@mileapp.com</li>
              <li>Support email: support@mileapp.com</li>
              <li>Legal address: pending completion</li>
              <li>Phone number: pending completion</li>
              <li>Estimated response time: 48 business hours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">24. Effective Dates</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {effectiveDates.map((row) => (
                    <tr key={row.item} className="border-t border-white/10 text-white/85">
                      <td className="px-4 py-3">{row.item}</td>
                      <td className="px-4 py-3">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">Appendix A: Definitions</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Term</th>
                    <th className="px-4 py-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {definitions.map((row) => (
                    <tr key={row.term} className="border-t border-white/10 text-white/85">
                      <td className="px-4 py-3 font-semibold">{row.term}</td>
                      <td className="px-4 py-3">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">Appendix B: Change Log</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/8 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Version</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Main changes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10 text-white/85">
                    <td className="px-4 py-3 font-semibold">1.0</td>
                    <td className="px-4 py-3">30-Mar-2026</td>
                    <td className="px-4 py-3">Initial version</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[#FFB95D]/30 bg-[#FFB95D]/10 p-5 text-[#ffe8c7]">
            <p className="text-base font-bold">Acceptance</p>
            <p className="mt-2 text-sm sm:text-base">
              By clicking "Sign up" or using FinanceTracker, you agree to be bound by these Terms and Conditions.
            </p>
            <p className="mt-3 text-xs text-[#ffe8c7]/80">Last legal review: March 30, 2026. Next review: June 30, 2026.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
