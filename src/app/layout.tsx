import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { HeroUIProvider } from "@heroui/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeeMed - Medical Education Platform",
  description: "Gamified medical learning platform with XP, achievements, and interactive content",
  keywords: "medical education, gamification, healthcare learning, medical students",
  authors: [{ name: "BeeMed Team" }],
  openGraph: {
    title: "BeeMed - Medical Education Platform",
    description: "Learn medicine through gamification",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
