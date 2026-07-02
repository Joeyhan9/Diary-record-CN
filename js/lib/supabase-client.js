import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getSupabaseConfig, isSupabaseConfigured } from '../config/supabase-config.js';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let client = null;

/** @returns {import('@supabase/supabase-js').SupabaseClient | null} */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    const { url, anonKey } = getSupabaseConfig();
    client = createClient(url, anonKey);
  }
  return client;
}
