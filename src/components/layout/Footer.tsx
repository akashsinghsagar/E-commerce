import Link from 'next/link';
import { Camera, Mail, Phone } from 'lucide-react';

const shopLinks = [
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals' },
  { name: 'Kurtis', href: '/shop?category=kurtis' },
  { name: 'Co-ord Sets', href: '/shop?category=co-ord-sets' },
  { name: 'Dresses', href: '/shop?category=dresses' },
  { name: 'Festive Wear', href: '/shop?category=festive-wear' },
  { name: 'Everyday Wear', href: '/shop?category=everyday-wear' },
];

const companyLinks = [
  { name: 'About LADDI', href: '/shop' },
  { name: 'Fashion Journal', href: '/shop' },
  { name: 'Lookbook', href: '/shop' },
  { name: 'Contact Us', href: 'mailto:hello@laddi.in' },
];

const helpLinks = [
  { name: 'Track Your Order', href: '/account/orders' },
  { name: 'Shipping Policy', href: '/shop' },
  { name: 'Returns & Refunds', href: '/shop' },
  { name: 'Privacy Policy', href: '/shop' },
  { name: 'Terms & Conditions', href: '/shop' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white" id="site-footer">
      {/* Main footer */}
      <div className="container-narrow py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span className="font-serif text-2xl tracking-[0.15em] text-white font-medium">
                LADDI
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white mb-6 max-w-xs">
              Contemporary Indian ethnic wear that celebrates the artistry of traditional
              craftsmanship through a modern, minimalist lens.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
              <a
                href="mailto:hello@laddi.in"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+919876543210"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Phone"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-sans font-semibold mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-sans font-semibold mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-white font-sans font-semibold mb-5">
              Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-narrow py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} LADDI. All rights reserved.
          </p>
          <p className="text-xs text-white">
            Handcrafted in India with ♥
          </p>
        </div>
      </div>
    </footer>
  );
}
