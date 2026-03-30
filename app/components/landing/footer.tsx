"use client";

import Image from "next/image";
import Link from "next/link";

type FooterLink = {
	label: string;
	href: string;
};

const footerLinks = {
	product: [
		{ label: "Dashboard", href: "/mainApp?view=dashboard" },
		{ label: "Analytics", href: "/mainApp/analytics/performance" },
		{ label: "Transactions", href: "/mainApp/transactions" },
	],
	company: [
		{ label: "About", href: "/#about" },
		{ label: "Security", href: "/legal/security" },
		{ label: "Careers", href: "mailto:support@mileapp.com?subject=Careers%20at%20Mile" },
		{ label: "Contact", href: "mailto:support@mileapp.com" },
	],
	resources: [
		{ label: "Help Center", href: "mailto:support@mileapp.com?subject=Help%20Center%20Request" },
		{ label: "API Docs", href: "/openapi/backend-api.yaml" },
		{ label: "Status", href: "mailto:support@mileapp.com?subject=Platform%20Status" },
		{ label: "Privacy", href: "/legal/privacy" },
	],
};

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="w-full bg-black pb-10 pt-8" id="contact">
			<div className="mx-auto w-[calc(100vw-4rem)] md:w-[calc(100vw-3rem)]">
				<div className="hero-gradient-card rounded-3xl border border-white/15 p-6 sm:p-8">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-[1.35fr_1fr_1fr_1fr] md:gap-6">
						<div>
							<Image
								src="/logo/Logo.svg"
								alt="Mile logo"
								width={1600}
								height={400}
								className="h-10 w-auto"
							/>
							<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
								A modern portfolio workspace to track holdings, performance, and risk with clarity.
							</p>
							<p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#FFB95D]">
								Support: support@mileapp.com
							</p>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Product</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.product.map((item: FooterLink) => (
									<li key={item.label}>
										<Link href={item.href} className="transition-colors hover:text-white">
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Company</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.company.map((item: FooterLink) => (
									<li key={item.label}>
										<Link href={item.href} className="transition-colors hover:text-white">
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Resources</h3>
							<ul className="mt-3 space-y-2 text-sm text-white/70">
								{footerLinks.resources.map((item: FooterLink) => (
									<li key={item.label}>
										<Link href={item.href} className="transition-colors hover:text-white">
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
						<p>© {year} Mile. All rights reserved.</p>
						<p>Built for long-term investors and active portfolio tracking.</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
