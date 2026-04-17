import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientHeaderWrapper from "@/components/ClientHeaderWrapper";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IAAM",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Fixed Header */}
          <ClientHeaderWrapper />

          {/* Content with padding for fixed header */}
          <main className="pt-[90px] md:pt-[140px] lg:pt-[235px]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}