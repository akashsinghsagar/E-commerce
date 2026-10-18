'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleItems = mounted ? items : [];

  return (
    <main className="min-h-screen bg-ivory">
      <div className="container-narrow py-12 lg:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Saved pieces</p>
        <h1 className="mt-2 font-serif text-4xl">Wishlist</h1>
        {visibleItems.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <Heart size={24} className="text-espresso" />
            <h2 className="mt-4 font-serif text-2xl">Nothing saved yet</h2>
            <p className="mt-2 text-sm text-muted">Save pieces you love while exploring the collection.</p>
            <Link href="/shop" className="btn btn-primary btn-small mt-6">Explore the collection</Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleItems.map((item) => (
              <article key={item.id} className="border border-taupe bg-white p-3">
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="aspect-[3/4] bg-beige-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <h2 className="mt-3 text-sm font-medium">{item.name}</h2>
                  <p className="mt-1 text-sm font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                </Link>
                <button type="button" onClick={() => removeItem(item.productId)} className="mt-3 flex items-center gap-1 text-xs text-muted hover:text-espresso" aria-label={`Remove ${item.name} from wishlist`}>
                  <X size={13} /> Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
