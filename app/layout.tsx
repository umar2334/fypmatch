import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const description =
  "Tell FYPMatch your major, interests and skills, and get 5 ranked final year project ideas for Pakistani universities, with tech stacks, timelines and a supervisor pitch.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "FYPMatch: Final Year Project Idea Generator", template: "%s | FYPMatch" },
  description,
  keywords: ["final year project ideas", "FYP ideas", "FYP Pakistan", "project idea generator", "computer science FYP"],
  openGraph: { title: "FYPMatch: Final Year Project Idea Generator", description, type: "website", siteName: "FYPMatch" },
  twitter: { card: "summary_large_image", title: "FYPMatch", description },
};

export const viewport: Viewport = { themeColor: "#FBFAF6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
