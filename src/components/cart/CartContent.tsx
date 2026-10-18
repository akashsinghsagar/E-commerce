'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function CartContent() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shipping = useCartStore((state) => state.getDeliveryCharge());
  const discount = subtotal >= 5000 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="container-narrow flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Your bag</p>
        <h1 className="mt-3 font-serif text-4xl">Your cart is empty</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">Beautiful, considered pieces are waiting for you.</p>
        <Link href="/shop" className="btn btn-primary btn-large mt-8">Explore the collection</Link>
      </div>
    );
  }

  return (
    <div className="container-narrow py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Your bag</p>
        <h1 className="mt-2 font-serif text-4xl">Shopping cart</h1>
      </div>
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-taupe border-y border-taupe">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-5 sm:gap-6">
              <div className="relative h-36 w-28 flex-shrink-0 overflow-hidden bg-beige-100 sm:h-44 sm:w-36">
                {item.image ? <Image src={item.image} alt={item.name} fill sizes="144px" className="object-cover" /> : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{item.color} · {item.size}</p>
                    <h2 className="mt-1 text-sm font-semibold">{item.name}</h2>
                  </div>
                  <p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <div className="flex h-9 items-center border border-taupe">
                    <button type="button" className="px-2.5" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity for ${item.name}`}><Minus size={13} /></button>
                    <span className="w-7 text-center text-xs">{item.quantity}</span>
                    <button type="button" className="px-2.5" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.maxQuantity} aria-label={`Increase quantity for ${item.name}`}><Plus size={13} /></button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-xs text-muted hover:text-espresso" aria-label={`Remove ${item.name}`}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit border border-taupe bg-beige-100 p-6">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping ? formatINR(shipping) : 'Free'}</span></div>
            {discount > 0 && <div className="flex justify-between text-espresso"><span>Demo discount</span><span>-{formatINR(discount)}</span></div>}
            <div className="flex justify-between border-t border-taupe pt-4 text-base font-semibold"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">Free shipping on orders over ₹999. A 10% demo discount applies automatically over ₹5,000.</p>
          <Link href="/checkout" className="btn btn-primary mt-7 w-full">Proceed to demo checkout</Link>
        </aside>
      </div>
    </div>
  );
}
