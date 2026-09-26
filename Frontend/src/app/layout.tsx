import type { Metadata } from "next";
import { Pirata_One, Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const pirata = Pirata_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "ARAPUCA - Bilheteria",
  description: "Ingressos para a apresentação ao vivo da Arapuca.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <body className={`${pirata.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
