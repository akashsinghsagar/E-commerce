'use client';

import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { getCatalogColors, getCatalogOriginalPrice, getCatalogPrice, getCatalogSizes } from '@/data/products';
import { getAvailableQuantity, getVariant } from '@/data/demo';
import { useCartStore } from '@/store/cart';
import ProductImage from './ProductImage';

export default function ProductDetails({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(getCatalogSizes(product)[0] || '');
  const [selectedColor, setSelectedColor] = useState(getCatalogColors(product)[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((store) => store.addItem);
  const variant = getVariant(product, selectedSize, selectedColor);
  const available = variant ? getAvailableQuantity(variant) : 0;
  const price = variant?.price || getCatalogPrice(product);
  const originalPrice = variant?.compareAtPrice || getCatalogOriginalPrice(product);

  const addToCart = () => {
    if (!variant || available < 1) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      size: selectedSize,
      color: selectedColor,
      price,
      quantity,
      maxQuantity: available,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
          {product.images.map((image, index) => (
            <button key={image.id} type="button" onClick={() => setActiveImage(index)} className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border ${activeImage === index ? 'border-espresso' : 'border-transparent'}`} aria-label={`View image ${index + 1}`}>
              <ProductImage src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-[3/4] overflow-hidden bg-beige-100 sm:order-2">
          <ProductImage src={product.images[activeImage]?.url || ''} alt={product.images[activeImage]?.alt || product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" fallbackText={product.name} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">{product.categoryName}</p>
        <h1 className="mt-3 font-serif text-3xl text-charcoal lg:text-4xl">{product.name}</h1>
        <div className="mt-5 flex items-center gap-3">
          <span className="text-lg font-semibold">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && originalPrice > price && <span className="text-sm text-muted line-through">₹{originalPrice.toLocaleString('en-IN')}</span>}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">{product.description}</p>

        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider">Colour: <span className="font-normal normal-case">{selectedColor}</span></p>
          <div className="flex flex-wrap gap-3">
            {getCatalogColors(product).map((color) => <button key={color.name} type="button" onClick={() => setSelectedColor(color.name)} className={`h-8 w-8 rounded-full border-2 ${selectedColor === color.name ? 'border-espresso p-1' : 'border-taupe'}`} aria-label={`Select ${color.name}`}><span className="block h-full w-full rounded-full" style={{ backgroundColor: color.hex }} /></button>)}
          </div>
        </div>

        <div className="mt-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider">Size</p>
          <div className="flex flex-wrap gap-2">
            {getCatalogSizes(product).map((size) => {
              const sizeVariant = getVariant(product, size, selectedColor);
              const inStock = sizeVariant && getAvailableQuantity(sizeVariant) > 0;
              return <button key={size} type="button" disabled={!inStock} onClick={() => setSelectedSize(size)} className={`min-w-12 border px-3 py-2 text-xs ${selectedSize === size ? 'border-espresso bg-espresso text-white' : 'border-taupe'} disabled:cursor-not-allowed disabled:opacity-35`}>{size}</button>;
            })}
          </div>
        </div>

        <div className="mt-7 flex items-end gap-4">
          <div>
            <label htmlFor="quantity">Quantity</label>
            <div className="flex h-11 items-center border border-taupe">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-3" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm" id="quantity">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(available, value + 1))} className="px-3" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
          </div>
          <button type="button" onClick={addToCart} disabled={!variant || available < 1} className="btn btn-primary btn-large flex-1 disabled:cursor-not-allowed disabled:opacity-50">
            {added ? <><Check size={16} /> Added to cart</> : <><ShoppingBag size={16} /> Add to cart</>}
          </button>
        </div>
        {available > 0 && available <= 3 && <p className="mt-3 text-xs text-espresso">Only {available} left in this size and colour.</p>}
        {!variant || available < 1 ? <p className="mt-3 text-xs text-red-700">This selection is currently unavailable.</p> : null}

        <div className="mt-10 border-t border-taupe pt-6 text-sm text-muted">
          <p><strong className="text-charcoal">Fabric:</strong> {product.fabric}</p>
          <p className="mt-2"><strong className="text-charcoal">Care:</strong> {product.careInstructions}</p>
        </div>
      </div>
    </div>
  );
}
