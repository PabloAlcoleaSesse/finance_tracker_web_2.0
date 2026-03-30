"use client";

import NavBar from "@/app/components/navBar";
import { PortfolioProvider } from "@/app/components/mainApp/portfolioContext";
import { useAuth } from "@/app/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainAppLayout({
    children}
  : {
    children: React.ReactNode;
  }) {
    const { isHydrated, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isHydrated && !isAuthenticated) {
        router.replace("/");
      }
    }, [isHydrated, isAuthenticated, router]);

    if (!isHydrated || !isAuthenticated) {
      return (
        <main className="mainapp-shell-black flex h-screen w-full items-center justify-center bg-black p-4 text-neutral-300">
          Loading secure workspace...
        </main>
      );
    }

    return (
        <PortfolioProvider>
          <main className="mainapp-card-soft mainapp-shell-black flex h-screen w-full gap-4 bg-black p-4 sm:p-6">
            <NavBar />
            {children}
          </main>
        </PortfolioProvider>
    )
  }