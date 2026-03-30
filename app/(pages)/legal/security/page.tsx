import Link from "next/link";

const trustMetrics = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "0", label: "Known security breaches" },
  { value: "< 1h", label: "Critical incident response" },
  { value: "4", label: "Security audits per year" },
];

export default function SecurityPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="hero-gradient-bg opacity-45" />
      <section className="relative mx-auto w-full max-w-5xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Security</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Security at FinanceTracker</h1>
            <p className="mt-2 text-sm text-white/70">Enterprise-grade controls to protect your financial data.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/legal/privacy"
              className="rounded-full border border-[#FFB95D]/40 bg-[#FFB95D]/10 px-4 py-2 text-sm font-semibold text-[#FFB95D] transition hover:bg-[#FFB95D]/20"
            >
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white">
              Terms
            </Link>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-white/88 sm:text-base">
          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">1. Data Encryption</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>TLS 1.3 protects all data in transit.</li>
              <li>AES-256 protects sensitive data at rest.</li>
              <li>SSL/TLS certificates validate server identity.</li>
              <li>Key management follows strict rotation and access controls.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">2. Authentication and Access Control</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Passwords are hashed with bcrypt and never stored in plaintext.</li>
              <li>Optional 2FA support for stronger account security.</li>
              <li>JWT-based session authentication with expiration.</li>
              <li>Account lockout after repeated failed login attempts.</li>
              <li>Rate limiting and CORS controls on critical endpoints.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">3. Broker Credential Protection</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Broker tokens and credentials are encrypted in storage.</li>
              <li>Only authenticated backend processes can access credentials.</li>
              <li>Credentials are never shared with third parties.</li>
              <li>Broker integrations are read-only where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">4. Infrastructure Security</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Containerized services with isolated runtime environments.</li>
              <li>Encrypted PostgreSQL backups and secure replication practices.</li>
              <li>Centralized logging for auditability and forensics.</li>
              <li>Redis configured for short-lived cache/session data with TTL.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">5. Monitoring and Threat Detection</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>24/7 alerting for suspicious behavior and access anomalies.</li>
              <li>Automated vulnerability scans and dependency checks.</li>
              <li>Periodic penetration testing and remediation tracking.</li>
              <li>Incident response workflow for detect, contain, investigate, and recover.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">6. Compliance and Standards</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Privacy and security controls aligned with GDPR, CCPA, and LGPD principles.</li>
              <li>SOC 2 and ISO 27001 roadmap in progress.</li>
              <li>Regular internal security reviews and policy updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">7. Trust Metrics</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/12 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-black text-[#FFB95D]">{metric.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/65">{metric.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">8. Responsible Disclosure</h2>
            <p className="mt-2 text-white/80">If you discover a vulnerability, please email security@mileapp.com with reproduction details. We will acknowledge receipt and coordinate remediation responsibly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#FFB95D]">9. Contact</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-white/80">
              <li>Security team: security@mileapp.com</li>
              <li>Legal requests: legal@mileapp.com</li>
              <li>General support: support@mileapp.com</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
