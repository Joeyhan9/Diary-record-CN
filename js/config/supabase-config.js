/**
 * Supabase 项目配置。
 * 复制 supabase-config.example.js 并填入你的项目 URL 与 anon key，
 * 或在 index.html 中通过 window.__SUPABASE_CONFIG__ 注入。
 *
 * @typedef {{ url: string, anonKey: string }} SupabaseConfig
 */

/** @type {SupabaseConfig} */
const DEFAULT_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
};

/** @returns {SupabaseConfig} */
export function getSupabaseConfig() {
  const injected =
    typeof window !== 'undefined' ? window.__SUPABASE_CONFIG__ : null;

  if (injected?.url && injected?.anonKey) {
    return { url: injected.url, anonKey: injected.anonKey };
  }

  return DEFAULT_CONFIG;
}

/** @returns {boolean} */
export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();
  return (
    url !== 'https://your-project.supabase.co' &&
    anonKey !== 'your-anon-key' &&
    Boolean(url) &&
    Boolean(anonKey)
  );
}
