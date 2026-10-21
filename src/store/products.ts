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
  error: string | null;
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
      error: null,
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((item) => item.id === id ? product : item),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((item) => item.id !== id),
      })),
      loadFromSupabase: async () => {
        set({ error: null });
        try {
          const products = await fetchSupabaseProducts(createClient());
          set({ products, hydrated: true });
        } catch (loadError) {
          const message = loadError instanceof Error
            ? loadError.message
            : typeof loadError === 'object' && loadError !== null && 'message' in loadError
              ? String((loadError as { message: unknown }).message)
              : 'Unable to load products from Supabase.';
          set({ hydrated: true, error: message });
        }
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
