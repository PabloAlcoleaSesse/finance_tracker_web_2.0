"use client";


export default function LandingSecondSection() {
    return (
        <section className="relative mb-20 flex w-full min-h-[65vh] items-center justify-center px-6 pt-20 sm:px-8" id="about">
            <p className="max-w-3xl text-center text-base leading-relaxed text-white/80 sm:text-lg">
               Mile is a personal investment portfolio platform built for investors who want a clear, real-time view of their wealth across every asset class — stocks, ETFs, index funds, crypto, bonds, gold, and cash.
                <br />
                <br />
                <span className="font-serif text-xl font-bold text-[#FFB95D] sm:text-2xl">Track everything in one place </span>
                Add your positions and record transactions as you trade. FinanceTracker automatically calculates your average cost, total gain or loss, and current value — keeping your portfolio always up to date without any manual spreadsheet work.
                <br />
                <br />
                <span className="font-serif text-xl font-bold text-[#FFB95D] sm:text-2xl">Multi-currency support </span>
                Invest globally without the headache. Positions in USD, EUR, GBP, or any other currency are automatically converted to your base currency using daily European Central Bank rates, so your portfolio summary is always in the currency that makes sense for you.                <br />
                <br />
                Experience the future of investment tracking with <a href="/auth/register" className="font-serif text-xl font-bold text-[#FFB95D] sm:text-2xl">Mile</a> and take control of your financial journey today.
            </p>
            
        </section>
            
    );
}