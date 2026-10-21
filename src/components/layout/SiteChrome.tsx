'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) return <main id="main-content">{children}</main>;

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
