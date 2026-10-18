'use client';

import ProductCard from '@/components/product/ProductCard';
import { useProductStore } from '@/store/products';

export default function HomeProductSections() {
  const products = useProductStore((state) => state.products);
  const hydrated = useProductStore((state) => state.hydrated);
  if (!hydrated) return null;
  const activeProducts = products.filter((product) => product.isActive);
  const newArrivals = activeProducts
    .filter((product) => product.collectionIds.includes('col-001'))
    .slice(0, 4);
  const bestsellers = activeProducts
    .filter((product) => product.isBestseller || product.isFeatured)
    .slice(0, 4);

  return (
    <>
      <section className="section-padding bg-ivory" id="new-arrivals">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-muted font-medium mb-2">Just Landed</p>
              <h2 className="font-serif text-2xl lg:text-3xl text-charcoal">New Arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-beige-100" id="bestsellers">
        <div className="container-narrow">
          <div className="mb-10">
            <p className="text-xs tracking-[0.15em] uppercase text-muted font-medium mb-2">Most Loved</p>
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal">Bestsellers</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestsellers.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </>
  );
}
