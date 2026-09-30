import type { Metadata } from "next";
import { Pirata_One, Barlow_Condensed, Inter, Archivo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const hanson = localFont({
  src: "../../public/fonts/Hanson-Bold.otf",
  variable: "--font-hanson-stats",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
  variable: "--font-archivo-stats",
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
    <html
      lang="pt-BR"
      className={cn(
        "font-sans",
        inter.variable,
        archivo.variable,
        hanson.variable,
      )}
    >
      <body
        className={`${pirata.variable} ${barlow.variable} ${hanson.variable} min-h-screen bg-[#380404]`}
      >
        {children}
      </body>
    </html>
  );
}
