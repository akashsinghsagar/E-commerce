'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';

const navigation = [
  { name: 'New Arrivals', href: '/shop?collection=new-arrivals' },
  { name: 'Kurtis', href: '/shop?category=kurtis' },
  { name: 'Co-ord Sets', href: '/shop?category=co-ord-sets' },
  { name: 'Dresses', href: '/shop?category=dresses' },
  { name: 'Festive Wear', href: '/shop?category=festive-wear' },
  { name: 'Collections', href: '/shop' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-taupe)]'
            : 'bg-ivory'
        }`}
        id="site-header"
      >
        {/* Main header */}
        <div className="container-narrow">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-charcoal p-1"
              aria-label="Open menu"
              id="mobile-menu-toggle"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0" id="site-logo">
              <h1 className="font-serif text-2xl lg:text-3xl tracking-[0.15em] text-charcoal font-medium m-0">
                LADDI
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs tracking-[0.1em] uppercase text-charcoal-800 hover:text-espresso transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-3 lg:gap-4" id="header-actions">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-charcoal hover:text-espresso transition-colors p-1"
                aria-label="Search"
                id="search-toggle"
              >
                <Search size={20} />
              </button>
              <Link
                href="/wishlist"
                className="text-charcoal hover:text-espresso transition-colors p-1 relative"
                aria-label="Wishlist"
                id="wishlist-link"
              >
                <Heart size={20} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-espresso text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                href={user ? '/account' : '/login'}
                className="hidden sm:block text-charcoal hover:text-espresso transition-colors p-1"
                aria-label={user ? 'Account' : 'Sign in'}
                id="account-link"
              >
                <User size={20} />
              </Link>
              <Link
                href="/cart"
                className="text-charcoal hover:text-espresso transition-colors p-1 relative"
                aria-label="Shopping cart"
                id="cart-link"
              >
                <ShoppingBag size={20} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-espresso text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        {isSearchOpen && (
          <div className="border-t border-taupe bg-ivory animate-slide-down" id="search-bar">
            <div className="container-narrow py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search size={18} className="text-muted flex-shrink-0" />
                <input
                  type="search"
                  placeholder="Search for kurtis, dresses, co-ord sets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none bg-transparent text-sm focus:outline-none placeholder:text-muted"
                  autoFocus
                  id="search-input"
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="text-muted hover:text-charcoal transition-colors"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile side menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-charcoal/40 z-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            id="mobile-overlay"
          />
          <div
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-ivory z-50 lg:hidden animate-slide-right overflow-y-auto"
            id="mobile-menu"
          >
            <div className="flex items-center justify-between p-6 border-b border-taupe">
              <span className="font-serif text-xl tracking-[0.15em] font-medium">LADDI</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-charcoal p-1"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="p-6 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm tracking-[0.05em] uppercase text-charcoal-800 hover:text-espresso transition-colors py-3 border-b border-taupe/40 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t border-taupe flex flex-col gap-1">
                <Link href={user ? '/account' : '/login'} onClick={() => setIsMenuOpen(false)} className="text-sm tracking-[0.05em] uppercase text-charcoal-800 hover:text-espresso py-3 font-medium">
                  {user ? 'My Account' : 'Sign in'}
                </Link>
                {user && (
                  <button type="button" onClick={() => { useAuthStore.getState().logout(); setIsMenuOpen(false); }} className="py-3 text-left text-sm font-medium uppercase tracking-[0.05em] text-charcoal-800 hover:text-espresso">
                    Log out
                  </button>
                )}
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-[0.05em] uppercase text-charcoal-800 hover:text-espresso py-3 font-medium">
                  Wishlist
                </Link>
                <Link href="/account/orders" onClick={() => setIsMenuOpen(false)} className="text-sm tracking-[0.05em] uppercase text-charcoal-800 hover:text-espresso py-3 font-medium">
                  Track Order
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-right {
          animation: slideRight 0.3s ease forwards;
        }
      `}</style>
    </>
  );
}
