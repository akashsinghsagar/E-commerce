'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import ProductDetails from '@/components/product/ProductDetails';
import { useProductStore } from '@/store/products';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useProductStore((state) => state.products.find((item) => item.slug === slug));
  const hydrated = useProductStore((state) => state.hydrated);
  const loadFromSupabase = useProductStore((state) => state.loadFromSupabase);

  useEffect(() => {
    if (isSupabaseConfigured()) void loadFromSupabase();
  }, [loadFromSupabase]);

  if (!hydrated) {
    return <main className="min-h-screen bg-ivory"><div className="container-narrow py-24 text-center text-sm text-muted">Loading product…</div></main>;
  }

  if (!product || !product.isActive) {
    return (
      <main className="min-h-screen bg-ivory">
        <div className="container-narrow py-24 text-center">
          <h1 className="font-serif text-3xl">Product not found</h1>
          <p className="mt-3 text-sm text-muted">This piece may have been removed or is no longer available.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-ivory">
      <div className="container-narrow py-10 lg:py-16">
        <ProductDetails product={product} />
      </div>
    </main>
  );
}
