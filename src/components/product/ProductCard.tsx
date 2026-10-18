'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { getAvailableColors, getAvailableQuantity, getMinPrice } from '@/data/demo';
import { useWishlistStore } from '@/store/wishlist';
import { useCartStore } from '@/store/cart';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const minPrice = getMinPrice(product);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const comparePrice = product.variants[0]?.compareAtPrice;
  const colors = getAvailableColors(product);
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted && isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: minPrice,
      compareAtPrice: comparePrice,
      slug: product.slug,
    });
  };

  const handleQuickAdd = () => {
    const variant = product.variants.find((item) => getAvailableQuantity(item) > 0);
    if (!variant) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      size: variant.size,
      color: variant.color,
      price: variant.price,
      quantity: 1,
      maxQuantity: getAvailableQuantity(variant),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="product-card group" id={`product-${product.id}`}>
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image container */}
        <div className="product-image relative aspect-[3/4] bg-beige-100 mb-4 overflow-hidden">
          <ProductImage
            src={product.images[0]?.url || ''}
            alt={product.images[0]?.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={priority}
          />

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              wishlisted
                ? 'bg-espresso text-white'
                : 'bg-white/80 text-charcoal hover:bg-white'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {comparePrice && comparePrice > minPrice && (
              <span className="badge text-[10px]">Sale</span>
            )}
            {product.collectionIds.includes('col-001') && (
              <span className="badge bg-charcoal text-[10px]">New</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 px-0.5">
          <p className="text-xs text-muted tracking-[0.05em] uppercase font-medium">
            {product.categoryName}
          </p>
          <h3 className="text-sm font-sans font-medium text-charcoal leading-snug group-hover:text-espresso transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">
              ₹{minPrice.toLocaleString('en-IN')}
            </span>
            {comparePrice && comparePrice > minPrice && (
              <span className="text-xs text-muted line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {colors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colors.map((color) => (
                <span
                  key={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-taupe"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={!product.variants.some((variant) => getAvailableQuantity(variant) > 0)}
        className="btn btn-secondary btn-small mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Add ${product.name} to cart`}
      >
        {added ? <><Check size={13} /> Added</> : <><ShoppingBag size={13} /> Quick add</>}
      </button>
    </article>
  );
}
