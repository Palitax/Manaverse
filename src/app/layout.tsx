import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import "./blue-hour.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MANAFORGE • Community & Trading Platform",
  description: "Exklusive Plattform für die Community von Manaforge / Manacards. Karten verkaufen, tauschen, suchen und direkt per Discord vernetzen.",
  icons: {
    icon: "/manaforge-logo.png",
    shortcut: "/manaforge-logo.png",
    apple: "/manaforge-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`dark h-full antialiased ${orbitron.variable}`}>
      <body className="min-h-full flex flex-col text-[#f3f4f6] relative">
        {/* Blue Hour CSS Background */}
        <div className="fixed inset-0 -z-50 gradient-blue-hour pointer-events-none" />
        <div className="fixed inset-0 -z-40 bg-gradient-to-b from-black/25 via-transparent to-black/45 pointer-events-none" />
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0 relative z-10">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
