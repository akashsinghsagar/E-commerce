'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '@/types';

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        if (items.some(i => i.productId === item.productId)) return;
        
        const id = `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set({
          items: [...items, { ...item, id, addedAt: new Date().toISOString() }],
        });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.productId !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId);
      },

      toggleItem: (item) => {
        if (get().isInWishlist(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'laddi-wishlist',
    }
  )
);
