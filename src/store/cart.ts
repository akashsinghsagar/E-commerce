'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryCharge: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        // Check if same variant already exists in cart
        const existing = items.find(
          i => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existing) {
          // Update quantity, capped at maxQuantity
          const newQty = Math.min(existing.quantity + item.quantity, item.maxQuantity);
          set({
            items: items.map(i =>
              i.id === existing.id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          set({ items: [...items, { ...item, id }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.maxQuantity) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        // Free delivery over ₹999
        return subtotal >= 999 ? 0 : 99;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryCharge();
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'laddi-cart',
    }
  )
);
