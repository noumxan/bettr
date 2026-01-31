import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BettrProvider } from "@/context/BettrContext";
import ConditionalAdminLayout from "@/components/ConditionalAdminLayout";
import AuthGate from "@/components/AuthGate";
import NavigateChatbot from "@/components/NavigateChatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Bettr — Your Feed",
  description: "Bettr: your feed, algorithms, verification, rewards. Admin at /admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <AuthGate>
            <BettrProvider>
              <ConditionalAdminLayout>{children}</ConditionalAdminLayout>
              <NavigateChatbot />
            </BettrProvider>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
