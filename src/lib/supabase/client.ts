import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const supabaseUrl = env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

function validateEnv(): string | null {
  if (!supabaseUrl || !supabaseAnonKey)
    return 'Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set at build time.';
  try {
    const u = new URL(supabaseUrl);
    if (u.protocol !== 'https:') return 'VITE_SUPABASE_URL must use https.';
  } catch {
    return 'Invalid VITE_SUPABASE_URL: must be a valid https URL.';
  }
  if (supabaseAnonKey.length < 40 || !supabaseAnonKey.includes('.'))
    return 'Invalid VITE_SUPABASE_ANON_KEY: copy the full anon (public) key from Supabase → Project Settings → API.';
  return null;
}

export const supabaseEnvError: string | null = validateEnv();

/**
 * Default browser auth uses `navigator.locks`, which conflicts with React Strict Mode
 * (effects run twice; orphaned locks → timeouts, stolen-lock errors, console noise).
 * In-process lock matches the non-browser fallback and is fine for a single-tab SPA.
 */
const authLock = async <R,>(_name: string, _acquireTimeout: number, fn: () => Promise<R>) => fn();

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  if (supabaseEnvError) throw new Error(supabaseEnvError);
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      lock: authLock,
    },
  });
  return _client;
}

/**
 * Lazily initialised — first access after a bad env will throw inside a React
 * lifecycle (caught by ErrorBoundary) instead of at module-import time.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
