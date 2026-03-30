"use client";

import Link from "next/link";
import LandingHeroClient from "@/app/components/landing/landingHeroClient";
import { useEffect, useState } from "react";
import LandingSecondSection from "./components/landing/secondSection";
import Image from "next/image";
import Connections from "./components/landing/connections";
import Footer from "./components/landing/footer";
import AppShowcase from "./components/landing/appShowcase";

function Header({ visible }: { visible: boolean }) {
	return (
		<header
			className={`fixed left-0 right-0 top-0 z-50 flex w-full flex-row items-center justify-between px-4 py-4 text-white transition-all duration-500 md:px-10 md:py-5 ${
				visible
					? "pointer-events-auto translate-y-0 bg-black/55 opacity-100 backdrop-blur-md"
					: "pointer-events-none -translate-y-4 opacity-0"
			}`}
		>
			<Image
				src="/logo/Logo.svg"
				alt="Mile logo"
				width={1600}
				height={400}
				priority
				className="h-8 w-auto"
			/>
			<div className="hidden md:block">
				<ul className="flex flex-row gap-6 text-base font-semibold text-white/90">
					<li>
						<a href="#landing-hero" className="hover:text-[#FFB95D] transition-colors">
							Home
						</a>
					</li>
					<li>
						<a href="#showcase" className="hover:text-[#FFB95D] transition-colors">
							Features
						</a>
					</li>
					<li>
						<a href="#about" className="hover:text-[#FFB95D] transition-colors">
							About
						</a>
					</li>
					<li>
						<a href="#connections" className="hover:text-[#FFB95D] transition-colors">
							Integrations
						</a>
					</li>
					<li>
						<a href="#contact" className="hover:text-[#FFB95D] transition-colors">
							Contact
						</a>
					</li>
				</ul>
			</div>
			<div>
				<ul className="flex flex-row items-center gap-2 md:gap-3">
					<li>
						<Link
							href="/auth/login"
							className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
						>
							Log In
						</Link>
					</li>
					<li>
						<Link
							href="/auth/register"
							className="rounded-full border border-[#FFB95D]/45 bg-[#FFB95D]/12 px-4 py-2 text-sm font-semibold text-[#FFB95D] transition hover:bg-[#FFB95D]/20"
						>
							Sign Up
						</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default function Home() {
	const [showHeader, setShowHeader] = useState(false);

	useEffect(() => {
		const heroSection = document.getElementById("landing-hero");
		if (!heroSection) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowHeader(entry.intersectionRatio <= 0.5);
			},
			{
				threshold: 0.5,
			}
		);

		observer.observe(heroSection);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div className="flex h-screen w-screen flex-col items-center bg-black font-sans overflow-y-auto hide-scrollbar">
			<main className="relative flex w-screen flex-col items-center bg-black">
				<Header visible={showHeader} />
				<LandingHeroClient sectionId="landing-hero" />
				
				
				<AppShowcase />
				<Connections />
				<LandingSecondSection />
				<Footer />
				
			</main>
		</div>
	);
}