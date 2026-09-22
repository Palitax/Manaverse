import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "MANAVERSE • Whatnot Community & Trading Platform",
  description: "Exklusive Plattform für die Whatnot-Community von Manaverse / Manacards. Karten verkaufen, tauschen, suchen und direkt per Discord vernetzen.",
  icons: {
    icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090b10] text-[#f3f4f6]">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
