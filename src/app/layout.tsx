import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import AuthSessionProvider from '@/components/auth/AuthSessionProvider';
import SiteChrome from '@/components/layout/SiteChrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'LADDI — Contemporary Indian Fashion',
    template: '%s | LADDI',
  },
  description:
    'LADDI is a premium contemporary Indian ethnic wear brand for women. Discover handcrafted kurtis, co-ord sets, dresses, and festive wear designed with a minimalist, modern sensibility.',
  keywords: [
    'Indian fashion',
    'ethnic wear',
    'kurtis',
    'co-ord sets',
    'contemporary Indian clothing',
    'women fashion India',
    'handcrafted clothing',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'LADDI',
    title: 'LADDI — Contemporary Indian Fashion',
    description:
      'Premium contemporary Indian ethnic wear for women. Handcrafted kurtis, co-ord sets, dresses, and festive wear.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-ivory text-charcoal antialiased">
        <AuthSessionProvider />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
