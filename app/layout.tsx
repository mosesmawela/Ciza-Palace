import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIZA | Official Artist Website",
  description: "Official fan portal for South African amapiano artist CIZA. Signed to LVRN. Stay updated on upcoming tours, exclusive album listenings, and merchandise drops.",
  keywords: ["CIZA", "Amapiano", "LVRN", "Love Renaissance", "South African Music", "Sony Music"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen selection:bg-[#e3ff30] selection:text-black antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
