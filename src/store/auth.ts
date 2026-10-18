'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryAddress, UserProfile } from '@/types';

interface AuthStore {
  user: UserProfile | null;
  login: (email: string, fullName?: string, phone?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'fullName' | 'phone'>>) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (email, fullName, phone) => set({
        user: {
          id: `demo-user-${email.toLowerCase()}`,
          email,
          fullName: fullName || email.split('@')[0],
          phone,
          role: 'customer',
          addresses: [],
          createdAt: new Date().toISOString(),
        },
      }),
      logout: () => set({ user: null }),
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
      addAddress: (address) => set((state) => {
        if (!state.user) return state;
        const nextAddress = { ...address, id: `addr-${Date.now()}` };
        return {
          user: {
            ...state.user,
            addresses: address.isDefault
              ? [nextAddress, ...state.user.addresses.map((item) => ({ ...item, isDefault: false }))]
              : [...state.user.addresses, nextAddress],
          },
        };
      }),
      removeAddress: (id) => set((state) => ({
        user: state.user
          ? { ...state.user, addresses: state.user.addresses.filter((address) => address.id !== id) }
          : null,
      })),
      setDefaultAddress: (id) => set((state) => ({
        user: state.user
          ? {
              ...state.user,
              addresses: state.user.addresses.map((address) => ({
                ...address,
                isDefault: address.id === id,
              })),
            }
          : null,
      })),
    }),
    { name: 'laddi-demo-session', partialize: (state) => ({ user: state.user }) },
  ),
);
