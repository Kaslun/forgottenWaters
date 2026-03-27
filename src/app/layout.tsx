import type { Metadata, Viewport } from 'next';
import { Newsreader, Noto_Serif, Space_Grotesk } from 'next/font/google';
import { ToastProvider } from '@/components/ui/ToastProvider';
import './globals.css';

const displayFont = Newsreader({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const bodyFont = Noto_Serif({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dataFont = Space_Grotesk({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-data',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Forgotten Waters Companion',
  description: 'Digital character sheet companion for the Forgotten Waters board game',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'FW Companion',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#111125',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${dataFont.variable}`}>
      <body className="font-body bg-navy-900 text-parchment-100 antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
