import { getSupabaseClient } from '../lib/supabase-client.js';
import { isSupabaseConfigured } from '../config/supabase-config.js';
import { setAuthSession } from './auth-state.js';
import { setStorageUser } from '../storage.js';

/** @returns {Promise<{ ok: boolean, error?: string }>} */
export async function initAuth() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    setAuthSession(null);
    setStorageUser(null);
    return { ok: false, error: 'Supabase 未配置，请在 config 中填入 URL 与 anon key' };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    setAuthSession(null);
    setStorageUser(null);
    return { ok: false, error: error.message };
  }

  setAuthSession(data.session);
  setStorageUser(data.session?.user?.id ?? null);

  supabase.auth.onAuthStateChange((_event, session) => {
    setAuthSession(session);
    setStorageUser(session?.user?.id ?? null);
  });

  return { ok: true };
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: boolean, error?: string, needsConfirmation?: boolean }>}
 */
export async function signUpWithEmail(email, password) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase 未配置' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false, error: '无法连接 Supabase' };

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: error.message };

  if (data.session) {
    setAuthSession(data.session);
    setStorageUser(data.session.user?.id ?? null);
    return { ok: true };
  }

  return { ok: true, needsConfirmation: true };
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase 未配置' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { ok: false, error: '无法连接 Supabase' };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  setAuthSession(data.session);
  setStorageUser(data.session?.user?.id ?? null);
  return { ok: true };
}

/** @returns {Promise<{ ok: boolean, error?: string }>} */
export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    setAuthSession(null);
    setStorageUser(null);
    return { ok: true };
  }

  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: error.message };

  setAuthSession(null);
  setStorageUser(null);
  return { ok: true };
}
