import { createMetadata } from "@repo/seo";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/shared/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

import { SITE_METADATA } from "@/constants/metadata";

export const metadata: Metadata = createMetadata({
  title: `${SITE_METADATA.title} | Portfolio`,
  description: SITE_METADATA.description,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} flex min-h-screen justify-center bg-background py-24 font-sans text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <div className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl sm:mx-8">
            <SmoothScroll>{children}</SmoothScroll>
            <Navbar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
