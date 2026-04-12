import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medcore V2",
  description: "Sistema Hospitalar Inteligente e Modular",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
