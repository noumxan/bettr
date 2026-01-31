import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BettrProvider } from "@/context/BettrContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Bettr — Social, But Better",
  description: "User-controlled feed, algorithm marketplace, and wellbeing-first social.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BettrProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </BettrProvider>
      </body>
    </html>
  );
}
