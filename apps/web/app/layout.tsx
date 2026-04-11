import { createMetadata } from "@repo/seo";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import {
  DynamicClickSpark,
  DynamicDither,
  DynamicFooter,
  DynamicNavbar,
  DynamicSmoothScroll,
} from "@/components/layout/dynamic-layout-components";
import { RootProviders } from "@/components/providers/root-providers";
import { SITE_METADATA } from "@/lib/constants/metadata";

import "./globals.css";

const satoshi = localFont({
  display: "swap",
  src: [
    {
      path: "../public/assets/fonts/satoshi/satoshi-400.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../public/assets/fonts/satoshi/satoshi-500.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../public/assets/fonts/satoshi/satoshi-700.woff2",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = createMetadata({
  description: SITE_METADATA.description,
  title: SITE_METADATA.title,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} ${jetbrainsMono.variable} relative flex min-h-screen flex-col items-center bg-background py-24 font-sans text-foreground antialiased`}
      >
        <a
          className="absolute top-[-4] left-4 z-100 -translate-y-[150%] rounded bg-background px-4 py-2 font-medium text-primary shadow-lg transition-transform focus:translate-y-4"
          href="#main-content"
        >
          Skip to main content
        </a>
        <RootProviders>
          <DynamicClickSpark
            className="z-50 flex flex-col items-center justify-center"
            duration={400}
            sparkCount={8}
            sparkRadius={20}
            sparkSize={10}
          >
            <div className="fixed inset-0 z-0 h-full w-full opacity-70">
              <DynamicDither
                colorNum={3}
                disableAnimation={false}
                enableMouseInteraction
                mouseRadius={0.6}
                pixelSize={2}
                waveAmplitude={0.2}
                waveColor={undefined}
                waveFrequency={2}
                waveSpeed={0.04}
              />
            </div>

            <div className="relative z-50 mx-4 w-full max-w-2xl overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl sm:mx-8">
              <DynamicSmoothScroll>
                <main className="w-full" id="main-content">
                  {children}
                </main>
              </DynamicSmoothScroll>
              <DynamicNavbar />
            </div>
            <div className="relative z-10 mx-4 w-full max-w-2xl sm:mx-8">
              <DynamicFooter />
            </div>
          </DynamicClickSpark>
        </RootProviders>
      </body>
    </html>
  );
}
