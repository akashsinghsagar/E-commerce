'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { demoCategories, demoCollections } from '@/data/demo';
import { catalogProducts, getCatalogPrice } from '@/data/products';
import { useProductStore } from '@/store/products';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export default function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const productsData = useProductStore((state) => state.products);
  const hydrated = useProductStore((state) => state.hydrated);
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const collection = params.get('collection') || '';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const products = useMemo(() => {
    const query = search.trim().toLowerCase();
    const minimum = Number(minPrice) || 0;
    const maximum = Number(maxPrice) || Infinity;
    const filtered = productsData.filter((product) => {
      const matchesSearch = !query
        || [product.name, product.categoryName, product.description, ...product.tags]
          .join(' ').toLowerCase().includes(query);
      const matchesCategory = !category || product.categoryId === demoCategories.find((item) => item.slug === category)?.id;
      const matchesCollection = !collection || product.collectionIds.includes(
        demoCollections.find((item) => item.slug === collection)?.id || '',
      );
      const price = getCatalogPrice(product);
      return product.isActive && matchesSearch && matchesCategory && matchesCollection
        && price >= minimum && price <= maximum;
    });

    return filtered.sort((a, b) => {
      if (sort === 'price_low') return getCatalogPrice(a) - getCatalogPrice(b);
      if (sort === 'price_high') return getCatalogPrice(b) - getCatalogPrice(a);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, collection, maxPrice, minPrice, productsData, search, sort]);

  const title = search
    ? `Search results for “${search}”`
    : demoCategories.find((item) => item.slug === category)?.name
      || demoCollections.find((item) => item.slug === collection)?.name
      || 'All pieces';

  return (
    <div className="min-h-screen bg-ivory">
      <section className="border-b border-taupe bg-beige-100">
        <div className="container-narrow py-12 text-center lg:py-16">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">The LADDI edit</p>
          <h1 className="font-serif text-4xl text-charcoal lg:text-5xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Considered silhouettes, Indian craft traditions, and everyday pieces designed to be lived in.
          </p>
        </div>
      </section>

      <div className="container-narrow py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="btn btn-secondary btn-small flex items-center gap-2"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:block">{products.length} pieces</span>
            <label className="relative">
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value })}
                className="appearance-none border border-taupe bg-transparent px-3 py-2 pr-8 text-xs"
              >
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />
            </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="mb-8 grid gap-5 border-y border-taupe py-6 sm:grid-cols-3">
            <label>
              <span>Search</span>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => updateParams({ search: event.target.value })}
                  placeholder="Search pieces"
                  className="pl-9"
                />
              </div>
            </label>
            <label>
              <span>Minimum price</span>
              <input type="number" min="0" value={minPrice} onChange={(event) => updateParams({ min: event.target.value })} placeholder="₹0" />
            </label>
            <label>
              <span>Maximum price</span>
              <input type="number" min="0" value={maxPrice} onChange={(event) => updateParams({ max: event.target.value })} placeholder="No limit" />
            </label>
            {(search || minPrice || maxPrice) && (
              <button type="button" onClick={() => updateParams({ search: '', min: '', max: '' })} className="btn btn-ghost justify-self-start text-xs">
                <X size={13} /> Clear filters
              </button>
            )}
          </div>
        )}

        {!hydrated ? (
          <div className="border border-taupe bg-white px-6 py-20 text-center text-sm text-muted" role="status">
            Loading the collection…
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="border border-dashed border-taupe px-6 py-20 text-center">
            <h2 className="font-serif text-2xl">No pieces found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">Try a broader search or clear your price filters.</p>
            <button type="button" onClick={() => updateParams({ search: '', min: '', max: '', category: '', collection: '' })} className="btn btn-primary btn-small mt-6">
              View all pieces
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
