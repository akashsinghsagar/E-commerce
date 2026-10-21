'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { demoCategories } from '@/data/demo';
import { fetchSupabaseCategories } from '@/lib/supabase/catalogue';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';

const categoryImages: Record<string, string> = {
  kurtis: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85',
  'co-ord-sets': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85',
  dresses: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=85',
  'festive-wear': 'https://images.unsplash.com/photo-1610189012906-7c7a3b1f6a1b?auto=format&fit=crop&w=700&q=85',
  'everyday-wear': 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85',
};

export default function HomeCategories() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; isActive: boolean }>>(
    demoCategories.filter((category) => category.isActive),
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    fetchSupabaseCategories(createClient())
      .then((remoteCategories) => {
        const remote = remoteCategories
          .filter((category) => category.is_visible)
          .map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            isActive: true,
          }));
        const remoteSlugs = new Set(remote.map((category) => category.slug));
        setCategories([
          ...remote,
          ...demoCategories
            .filter((category) => category.isActive && !remoteSlugs.has(category.slug))
            .map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              isActive: true,
            })),
        ]);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="section-padding bg-beige-100" id="shop-by-category">
      <div className="container-narrow">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">Browse</p>
          <h2 className="font-serif text-2xl text-charcoal lg:text-3xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block" id={`category-${category.slug}`}>
              <div className="relative mb-3 flex aspect-[3/4] items-end justify-center overflow-hidden bg-beige-300">
                <img
                  src={categoryImages[category.slug] || categoryImages.kurtis}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
                <p className="relative z-10 mb-5 px-3 text-center font-serif text-xl italic text-white">{category.name}</p>
                <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-300 group-hover:bg-charcoal/10" />
              </div>
              <p className="text-center text-xs leading-relaxed text-muted">
                {demoCategories.find((item) => item.slug === category.slug)?.description || 'Explore the latest LADDI edit.'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
