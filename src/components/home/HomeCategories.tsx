'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { demoCategories } from '@/data/demo';
import { fetchSupabaseCategories } from '@/lib/supabase/catalogue';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import coOrdImage from '@/data/Screenshot 2026-10-22 000601.png';
import dressImage from '@/data/Screenshot 2026-10-22 000610.png';
import everydayImage from '@/data/Screenshot 2026-10-22 000618.png';
import kurtiImage from '@/data/Screenshot 2026-10-22 000632.png';
import festiveImage from '@/data/Screenshot 2026-10-22 000625.png';

const categoryImages: Record<string, string> = {
  kurtis: kurtiImage.src,
  'co-ord-sets': coOrdImage.src,
  dresses: dressImage.src,
  'festive-wear': festiveImage.src,
  'everyday-wear': everydayImage.src,
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
