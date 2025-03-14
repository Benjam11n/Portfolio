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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}
