import { createMetadata } from "@repo/seo";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DynamicClickSpark,
  DynamicDither,
  DynamicFooter,
  DynamicNavbar,
  DynamicSmoothScroll,
} from "@/components/layout/dynamic-layout-components";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_METADATA } from "@/constants/metadata";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
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
                <DynamicSmoothScroll>{children}</DynamicSmoothScroll>
                <DynamicNavbar />
              </div>
              <div className="relative z-10 mx-4 w-full max-w-2xl sm:mx-8">
                <DynamicFooter />
              </div>
            </DynamicClickSpark>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
