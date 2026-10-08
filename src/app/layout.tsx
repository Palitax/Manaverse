import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { SlabsVideoBackground } from "@/components/background/slabs-video-background";
import { AuthModal } from "@/components/forms/auth-modal";
import { DiscordWelcomeModal } from "@/components/forms/discord-welcome-modal";
import { BoosterRipModal } from "@/components/booster/booster-rip-modal";

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
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0 relative">{children}</main>
          <AuthModal />
          <DiscordWelcomeModal />
          <BoosterRipModal />
        </StoreProvider>
        {/* Luxury 3D Graded Slabs Video Background & Ambience Controls */}
        <SlabsVideoBackground />
      </body>
    </html>
  );
}
