import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import fs from "fs/promises";
import path from "path";
import { initialPortfolioData } from "@/data/defaultData";
import { PortfolioData } from "@/types/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonugg | Web3 Content Creator & Developer",
  description: "Official portfolio of Sonugg — Web3 content creator and developer. Building decentralized apps, smart contracts, and Web3 educational content.",
  icons: {
    icon: "/images/sonugg-avatar.png",
  },
};

async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const filePath = path.join(process.cwd(), "data", "portfolio.json");
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content);
    if (parsed && parsed.profile) {
      return parsed;
    }
    return initialPortfolioData;
  } catch (error) {
    console.warn("Could not read server portfolio.json in layout:", error);
    return initialPortfolioData;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getPortfolioData();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#07050b] text-[#f4f4f5] selection:bg-pink-500 selection:text-white"
      >
        <Providers initialData={initialData}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
