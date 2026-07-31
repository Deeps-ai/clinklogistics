// Graceful Supabase client — if env vars are missing, returns a no-op proxy
// so the site never crashes. Features show "Implementing Soon" instead.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }
    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function isSupabaseConfigured(): boolean {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  return !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.warn('[Supabase] Not configured. Using no-op client. Tracking, contact form and admin will show "Coming Soon".');
    return null;
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function createNoopProxy(): any {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        // Return a no-op function for callable props like .from(), .auth.signInWithPassword(), etc.
        if (prop === 'then' || prop === 'catch' || prop === 'finally') return undefined;
        return (...args: any[]) => {
          // Return empty result objects
          return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
        };
      },
    },
  );
}

let _supabase: any = undefined;

export const supabase = new Proxy({} as any, {
  get(_, prop, receiver) {
    if (!_supabase) {
      _supabase = isSupabaseConfigured() ? createSupabaseClient() : null;
    }
    if (!_supabase) {
      const noop = createNoopProxy();
      return Reflect.get(noop, prop, receiver);
    }
    return Reflect.get(_supabase, prop, receiver);
  },
});

export { isSupabaseConfigured };

