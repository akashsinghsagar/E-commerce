'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { catalogProducts } from '@/data/products';
import type { Product } from '@/types';
import { fetchSupabaseProducts } from '@/lib/supabase/catalogue';
import { createClient } from '@/lib/supabase/client';

interface ProductStore {
  products: Product[];
  hydrated: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  loadFromSupabase: () => Promise<void>;
}

const withoutBlobImages = (product: Product): Product => ({
  ...product,
  images: product.images.map((image) => ({
    ...image,
    url: image.url.startsWith('blob:') ? '' : image.url,
  })),
});

function markProductStoreHydrated() {
  useProductStore.setState({ hydrated: true });
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: catalogProducts,
      hydrated: false,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((item) => item.id === id ? product : item),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((item) => item.id !== id),
      })),
      loadFromSupabase: async () => {
        const products = await fetchSupabaseProducts(createClient());
        set({ products, hydrated: true });
      },
    }),
    {
      name: 'laddi-demo-products',
      onRehydrateStorage: () => () => markProductStoreHydrated(),
      partialize: (state) => ({
        products: state.products.map(withoutBlobImages),
      }),
    },
  ),
);
