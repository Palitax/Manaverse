import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "MANAFORGE • Community & Trading Platform",
  description: "Exklusive Plattform für die Community von Manaforge / Manacards. Karten verkaufen, tauschen, suchen und direkt per Discord vernetzen.",
  icons: {
    icon: "/manaforge-icon.png",
    shortcut: "/manaforge-icon.png",
    apple: "/manaforge-icon.png",
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
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
