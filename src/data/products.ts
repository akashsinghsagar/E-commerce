import type { Product } from '@/types';
import { demoProducts } from './demo';

const editorialImages = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1610189012906-7c7a3b1f6a1b?auto=format&fit=crop&w=900&q=85',
];

export const catalogProducts: Product[] = demoProducts.map((product, productIndex) => ({
  ...product,
  images: product.images.map((image, imageIndex) => ({
    ...image,
    url: editorialImages[(productIndex + imageIndex) % editorialImages.length],
  })),
}));

export function getCatalogProductBySlug(slug: string): Product | undefined {
  return catalogProducts.find((product) => product.slug === slug && product.isActive);
}

export function getCatalogPrice(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.price));
}

export function getCatalogOriginalPrice(product: Product): number | undefined {
  const originalPrice = Math.max(
    ...product.variants.map((variant) => variant.compareAtPrice || variant.price),
  );
  return originalPrice > getCatalogPrice(product) ? originalPrice : undefined;
}

export function getCatalogSizes(product: Product): string[] {
  return [...new Set(product.variants.map((variant) => variant.size))];
}

export function getCatalogColors(product: Product): { name: string; hex: string }[] {
  return [...new Map(
    product.variants.map((variant) => [variant.color, {
      name: variant.color,
      hex: variant.colorHex || '#D4C8BE',
    }]),
  ).values()];
}
