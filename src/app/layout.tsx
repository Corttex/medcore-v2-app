import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "MEDCORE – Tecnologia e Gestão de Saúde",
  description: "Tecnologia e Cuidado na Saúde. Plataforma executiva para gestão hospitalar, Bio Flow e cuidado preventivo.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MEDCORE",
  },
  openGraph: {
    title: "MEDCORE",
    description: "Tecnologia e Cuidado na Saúde",
    url: "https://medcore.app.br",
    siteName: "MEDCORE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0A1A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

import { AuthProvider } from "@/contexts/AuthContext";
import { ModuleProvider } from "@/contexts/ModuleContext";
import SwRegister from "@/components/pwa/SwRegister";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <SwRegister />
        <AuthProvider>
          <ModuleProvider>
            <div className="app">
              {children}
            </div>
          </ModuleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
