import type { Metadata } from "next";
import { Red_Hat_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import { PreventZoom } from "@/components/ui/PreventZoom";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-heading-next",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-next",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MedCore - Sistema Integrado de Gestão Hospitalar",
  description: "Inteligência Executiva para Gestão Hospitalar de Alta Performance",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${redHatDisplay.variable} ${dmSans.variable}`}>
      <body className="antialiased font-body bg-background text-on-surface transition-colors duration-300">
        <PreventZoom />
        <ThemeProvider>
          <UserProvider>
            <GlobalBackground />
            {children}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
