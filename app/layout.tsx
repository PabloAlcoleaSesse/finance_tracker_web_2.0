import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const alpino = localFont({
  src: [
    {
      path: "../public/fonts/alpino/Alpino-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/alpino/Alpino-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/alpino/Alpino-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/alpino/Alpino-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-alpino",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system"],
});

const sentient = localFont({
  src: [
    {
      path: "../public/fonts/sentient/Sentient-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-sentient",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Shiru";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Track and manage your investment portfolios with advanced analytics and performance metrics.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = {
  title: `${siteName} - Investment Portfolio Tracker`,
  description: siteDescription,
  keywords: [
    "portfolio tracker",
    "investment analytics",
    "financial tracking",
    "stock portfolio",
    "wealth management",
    "investment performance",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google-site-verification-code",
  },
  openGraph: {
    title: `${siteName} - Investment Portfolio Tracker`,
    description: siteDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} - Investment Portfolio Tracker`,
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Investment Portfolio Tracker`,
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@ShiruApp",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: "/logo/LogoMileWhite.svg",
    shortcut: "/logo/LogoMileWhite.svg",
    apple: "/logo/LogoMileWhite.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script 
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body
        className={`${alpino.variable} ${sentient.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
