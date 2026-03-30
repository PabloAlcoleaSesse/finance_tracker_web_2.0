
"use client";

type FeatureItem = {
	title: string;
	description: string;
	icon: "overview" | "transactions" | "returns" | "risk" | "allocations" | "alerts" | "taxes" | "benchmarks";
};

const features: FeatureItem[] = [
	{
		title: "Portfolio Snapshot",
		description: "See total value, gain/loss, and daily move in one clean view. No spreadsheet cleanup required.",
		icon: "overview",
	},
	{
		title: "Transaction Tracking",
		description: "Log buys, sells, dividends, and fees in seconds. Cost basis and position size update automatically.",
		icon: "transactions",
	},
	{
		title: "Performance Timeline",
		description: "Follow returns across custom date ranges. Spot what improved and what dragged performance.",
		icon: "returns",
	},
	{
		title: "Risk Metrics",
		description: "Track volatility, drawdown, and concentration at a glance. Catch risk before it compounds.",
		icon: "risk",
	},
	{
		title: "Allocation Breakdown",
		description: "Understand exposure by asset type, sector, and currency. Rebalance with intent, not guesswork.",
		icon: "allocations",
	},
	{
		title: "Watchlist Alerts",
		description: "Get notified when key positions move beyond your limits. Stay informed without staring at charts.",
		icon: "alerts",
	},
	{
		title: "Benchmark Comparison",
		description: "Measure your portfolio against indexes that matter to you. Know if you are beating your baseline.",
		icon: "benchmarks",
	},
];

function FeatureIcon({ type }: { type: FeatureItem["icon"] }) {
	const common = "h-5 w-5 text-[#FFB95D]";

	if (type === "overview") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			</svg>
		);
	}

	if (type === "transactions") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M4 7h13M13 4l4 3-4 3M20 17H7m4-3-4 3 4 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		);
	}

	if (type === "returns") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M4 18L10 12l4 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		);
	}

	if (type === "risk") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M12 3l8 4v5c0 5-3.6 7.8-8 9-4.4-1.2-8-4-8-9V7l8-4Z" stroke="currentColor" strokeWidth="1.8" />
			</svg>
		);
	}

	if (type === "allocations") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M12 3v9h9A9 9 0 1 1 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			</svg>
		);
	}

	if (type === "alerts") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M18 9a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7M10 20h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			</svg>
		);
	}

	if (type === "taxes") {
		return (
			<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
				<path d="M7 3h10v18l-5-3-5 3V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
			<path d="M4 12h4m8 0h4M12 4v4m0 8v4M7.8 7.8l2.8 2.8m2.8 2.8 2.8 2.8M16.2 7.8l-2.8 2.8m-2.8 2.8-2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}

export default function Features() {
	return (
		<section className="w-full bg-black px-6 py-20 sm:px-8 lg:px-16" id="features">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-10 text-center">
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Features</p>
					<h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Everything you need to run your portfolio better</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<article
							key={feature.title}
							className="hero-gradient-card rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(255,185,93,0.22)]"
						>
							<div className="mb-3 inline-flex rounded-lg border border-white/10 bg-black/60 p-2">
								<FeatureIcon type={feature.icon} />
							</div>
							<h3 className="text-lg font-bold text-white">{feature.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}