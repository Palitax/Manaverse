import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { SlabsVideoBackground } from "@/components/background/slabs-video-background";
import { GlobalModals } from "@/components/modals/global-modals";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MANAFORGE • Community & Trading Platform",
  description: "Exklusive Plattform für die Community von Manaforge / Manacards. Karten verkaufen, tauschen, suchen und direkt per Discord vernetzen.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
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
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0 relative">{children}</main>
          <GlobalModals />
        </StoreProvider>
        {/* Luxury 3D Graded Slabs Video Background & Ambience Controls */}
        <SlabsVideoBackground />
      </body>
    </html>
  );
}
