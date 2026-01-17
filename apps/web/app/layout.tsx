import { createMetadata } from "@repo/seo";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DynamicAnimationSkipProvider,
  DynamicClickSpark,
  DynamicDither,
  DynamicFooter,
  DynamicNavbar,
  DynamicPerformanceMonitor,
  DynamicSmoothScroll,
} from "@/components/layout/dynamic-layout-components";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_METADATA } from "@/lib/constants/metadata";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
        className={`${inter.variable} relative flex min-h-screen flex-col items-center justify-center bg-background py-24 font-sans text-foreground antialiased`}
      >
        <a
          className="absolute top-4 left-4 z-[100] -translate-y-[150%] rounded bg-background px-4 py-2 font-medium text-primary shadow-lg transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <DynamicAnimationSkipProvider>
            <div className="fixed inset-0 z-10 h-full w-full opacity-60">
              <DynamicDither
                colorNum={3}
                disableAnimation={false}
                enableMouseInteraction
                mouseRadius={0.6}
                pixelSize={2}
                waveAmplitude={0.2}
                waveColor={[
                  0.419_607_843_137_254_9, 0.419_607_843_137_254_9,
                  0.419_607_843_137_254_9,
                ]}
                waveFrequency={2}
                waveSpeed={0.04}
              />
            </div>

            <TooltipProvider>
              <DynamicClickSpark
                className="z-50 flex flex-col items-center justify-center"
                duration={400}
                sparkCount={8}
                sparkRadius={15}
                sparkSize={10}
              >
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
            </TooltipProvider>
          </DynamicAnimationSkipProvider>
        </ThemeProvider>
        <Analytics />
        <DynamicPerformanceMonitor />
      </body>
    </html>
  );
}
