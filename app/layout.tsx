import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import localFont from 'next/font/local';

const nohemi = localFont({
  variable: '--font-nohemi',
  src: [
    {
      path: './fonts/Nohemi-Black-BF6438cc565e67b.woff',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-Bold-BF6438cc577b524.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-ExtraBold-BF6438cc5761ae2.woff',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-ExtraLight-BF6438cc581502c.woff',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-Light-BF6438cc5702321.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-Medium-BF6438cc57ddecd.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-Regular-BF6438cc579d934.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-SemiBold-BF6438cc57db2ff.woff',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Nohemi-Thin-BF6438cc57e2011.woff',
      weight: '100',
      style: 'normal',
    },
  ],
});

const comicCat = localFont({
  src: './fonts/Comic_CAT.otf',
  variable: '--font-cat',
  weight: '100 200 300 400 500 700 800 900',
});

export const metadata: Metadata = {
  title: "Benjamin's Portfolio",
  description: 'Full Stack Developer & 3D Enthusiast Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nohemi.variable} ${comicCat.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
