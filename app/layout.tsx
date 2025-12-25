import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Benjamin's Portfolio",
  icons: {
    icon: '/assets/logo.png',
  },
  description: 'Full Stack Developer & AI Enthusiast Portfolio',
  keywords: [
    'Benjamin Wang',
    'Portfolio',
    'Full Stack Developer',
    'Frontend',
    'Backend',
    'TypeScript',
    'React',
    'Next.js',
    'Three.js',
    'Framer Motion',
    'Tailwind CSS',
    'AI',
    'Machine Learning',
  ],
  category: 'technology',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Benjamin's Portfolio",
    description: 'Full Stack Developer & AI Enthusiast Portfolio',
    url: '/',
    siteName: "Benjamin's Portfolio",
    images: [
      {
        url: '/assets/og-cover.png',
        width: 1200,
        height: 630,
        alt: "Benjamin's Portfolio Cover",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
