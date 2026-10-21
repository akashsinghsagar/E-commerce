'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { useAuthStore } from '@/store/auth';

export default function AuthSessionProvider() {
  const initialize = useAuthStore((state) => state.initialize);
  const syncSupabaseUser = useAuthStore((state) => state.syncSupabaseUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    void initialize();
    if (!isSupabaseConfigured()) return;

    const { data: subscription } = createClient().auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        window.setTimeout(() => void syncSupabaseUser(session.user), 0);
      } else if (event === 'SIGNED_OUT') {
        clearSession();
      }
    });
    return () => subscription.subscription.unsubscribe();
  }, [clearSession, initialize, syncSupabaseUser]);

  return null;
}
