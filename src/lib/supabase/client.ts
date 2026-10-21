'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

let client: SupabaseClient | undefined;

export function createClient() {
  if (client) return client;

  const { url, publishableKey } = getSupabaseEnv();
  client = createBrowserClient(url, publishableKey);
  return client;
}
