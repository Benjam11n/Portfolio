import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ThemeProvider } from '@/components/ThemeProvider';

const comicCat = localFont({
  src: './fonts/Comic_CAT.otf',
  variable: '--font-cat',
  weight: '100 200 300 400 500 700 800 900',
});

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
  twitter: {
    card: 'summary_large_image',
    title: "Benjamin's Portfolio",
    description: 'Full Stack Developer & AI Enthusiast Portfolio',
    images: ['/assets/og-cover.png'],
    creator: '@benjaminwjy',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={comicCat.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
