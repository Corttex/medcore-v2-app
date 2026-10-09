import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { GlobalBackground } from "@/components/ui/GlobalBackground";
import { PreventZoom } from "@/components/ui/PreventZoom";

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
    <html lang="pt-BR">
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
