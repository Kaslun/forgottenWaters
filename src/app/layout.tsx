import type { Metadata, Viewport } from 'next';
import { Pirata_One, Crimson_Text } from 'next/font/google';
import { ToastProvider } from '@/components/ui/ToastProvider';
import './globals.css';

const pirata = Pirata_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pirata',
  display: 'swap',
});

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
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
  themeColor: '#1a2744',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pirata.variable} ${crimson.variable}`}>
      <body className="font-body bg-navy-900 text-parchment-200">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
