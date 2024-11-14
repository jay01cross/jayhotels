import type { Metadata } from "next";

import localFont from "next/font/local";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/components/layout/Navbar";

import { ThemeProvider } from "@/components/theme-provider";

import Container from "@/components/Container";

import { Toaster } from "@/components/ui/toaster";

import LocationFilter from "@/components/LocationFilter";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JayHotels",
  description: "Book a hotel of your choice.",
  icons: { icon: "/icon.jpg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="flex flex-col min-h-screen bg-secondary">
              <Navbar />
              <LocationFilter />
              <section className="flex-grow">
                <Container>{children}</Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
