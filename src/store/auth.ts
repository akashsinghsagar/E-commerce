'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryAddress, UserProfile } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  user: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  login: (email: string, fullName?: string, phone?: string) => void;
  syncSupabaseUser: (user: User) => Promise<UserProfile>;
  initialize: () => Promise<void>;
  logout: () => void;
  clearSession: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'fullName' | 'phone'>>) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      status: 'loading',
      error: null,
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
      syncSupabaseUser: async (supabaseUser) => {
        let role: UserProfile['role'] = 'customer';
        const { data, error } = await createClient().rpc('is_admin');
        if (!error && data === true) role = 'admin';
        const profile: UserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          fullName: String(supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'LADDI customer'),
          phone: supabaseUser.user_metadata?.phone ? String(supabaseUser.user_metadata.phone) : undefined,
          role,
          addresses: [],
          createdAt: supabaseUser.created_at,
        };
        set({ user: profile, status: 'authenticated', error: null });
        return profile;
      },
      initialize: async () => {
        if (!isSupabaseConfigured()) {
          set((state) => ({ status: state.user ? 'authenticated' : 'unauthenticated', error: null }));
          return;
        }
        const { data, error } = await createClient().auth.getSession();
        if (error) {
          set({ user: null, status: 'unauthenticated', error: error.message });
          return;
        }
        if (data.session?.user) {
          await useAuthStore.getState().syncSupabaseUser(data.session.user);
        } else {
          set({ user: null, status: 'unauthenticated', error: null });
        }
      },
      clearSession: () => set({ user: null, status: 'unauthenticated', error: null }),
      logout: () => {
        if (isSupabaseConfigured()) void createClient().auth.signOut();
        useAuthStore.getState().clearSession();
      },
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
