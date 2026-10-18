import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
        <AnnouncementBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
