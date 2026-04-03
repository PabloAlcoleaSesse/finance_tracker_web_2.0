"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingHeader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutFinished = false;

    const timer = setTimeout(() => {
      timeoutFinished = true;
      setVisible(true);
    }, 5000);

    const heroSection = document.getElementById("landing-hero");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!timeoutFinished) {
          setVisible(entry.intersectionRatio <= 0.5);
        }
      },
      { threshold: 0.5 },
    );

    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 flex w-full flex-row items-center justify-between px-4 py-4 text-white transition-all duration-500 md:px-10 md:py-5 ${
        visible
          ? "pointer-events-auto translate-y-0 bg-black/55 opacity-100 backdrop-blur-md"
          : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <Image
        src="/logo/LogoHeader.svg"
        alt="Mile logo"
        width={1600}
        height={400}
        priority
        className="h-8 w-auto"
      />
      <div className="hidden md:block">
        <ul className="flex flex-row gap-6 text-base font-semibold text-white/90">
          <li>
            <a
              href="#landing-hero"
              className="hover:text-[#FFB95D] transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#showcase"
              className="hover:text-[#FFB95D] transition-colors"
            >
              Features
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-[#FFB95D] transition-colors">
              About
            </a>
          </li>
          <li>
            <a
              href="#connections"
              className="hover:text-[#FFB95D] transition-colors"
            >
              Integrations
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:text-[#FFB95D] transition-colors"
            >
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
