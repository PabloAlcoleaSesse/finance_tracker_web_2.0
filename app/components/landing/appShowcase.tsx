"use client";

import Image from "next/image";
import Link from "next/link";

type ShowcaseItem = {
  eyebrow: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  imageClassName: string;
  imageSrc: string;
  imageAlt: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    eyebrow: "Position intelligence",
    title: "Inspect each holding with full context",
    description:
      "This view is built for quick security checks: shares, average cost, current price, and gain/loss are visible at once.",
    metricLabel: "Core position metrics",
    metricValue: "8+",
    imageClassName: "max-h-[250px] sm:max-h-[290px]",
    imageSrc: "/images/Screenshot%202026-03-30%20at%2023.19.05.png",
    imageAlt: "Single position detail view",
  },
  {
    eyebrow: "Allocation clarity",
    title: "See where your money really sits",
    description:
      "The donut and side legend expose concentration risk immediately, so rebalancing decisions come from clear allocation data.",
    metricLabel: "Allocation snapshot",
    metricValue: "Live",
    imageClassName: "max-h-[300px] sm:max-h-[340px]",
    imageSrc: "/images/Screenshot%202026-03-30%20at%2023.19.26.png",
    imageAlt: "Asset allocation by type chart",
  },
  {
    eyebrow: "Cost vs value",
    title: "Compare cost basis against market value instantly",
    description:
      "A clean table compares cost, value, and gain by type, making top contributors and laggards easy to identify.",
    metricLabel: "Performance columns",
    metricValue: "5",
    imageClassName: "max-h-[240px] sm:max-h-[280px]",
    imageSrc: "/images/Screenshot%202026-03-30%20at%2023.19.49.png",
    imageAlt: "Allocation cost vs value breakdown table",
  },
];

export default function AppShowcase() {
  return (
    <section className="w-full px-6 py-20 pb-0 sm:px-8 lg:px-12" id="showcase">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFB95D]">Inside Mile</p>
          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">A cleaner look at how Mile works</h2>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            A quick product walkthrough with real screens and concise explanations.
          </p>
        </div>

        <div className="space-y-10">
          {showcaseItems.map((item, index) => {
            const reverse = index % 2 === 1;
            return (
              <article key={item.title} className="grid gap-4 lg:grid-cols-12 lg:items-center">
                <div className={reverse ? "order-2 lg:order-2 lg:col-span-5" : "order-2 lg:order-1 lg:col-span-5"}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFB95D]/90">{item.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/78 sm:text-base">{item.description}</p>

                  <div className="mt-4 inline-flex items-end gap-2 border-b border-[#FFB95D]/25 pb-1.5">
                    <span className="text-2xl font-black text-[#FFB95D] sm:text-3xl">{item.metricValue}</span>
                    <span className="pb-1 text-[10px] uppercase tracking-[0.14em] text-white/55 sm:text-xs">{item.metricLabel}</span>
                  </div>
                </div>

                <div className={reverse ? "order-1 lg:order-1 lg:col-span-7" : "order-1 lg:order-2 lg:col-span-7"}>
                  <div className="mx-auto w-full max-w-180 overflow-hidden">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={1600}
                      height={980}
                      className={`h-auto w-full rounded-2xl object-contain ${item.imageClassName}`}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/auth/register"
            className="rounded-full border border-[#FFB95D]/40 bg-[#FFB95D]/12 px-5 py-2.5 text-xs font-semibold text-[#FFB95D] transition hover:bg-[#FFB95D]/20"
          >
            Start building your portfolio workspace
          </Link>
        </div>
      </div>
    </section>
  );
}
