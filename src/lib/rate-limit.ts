// Simple in-memory rate limiter for server functions
// In production, replace with a Redis-based solution (e.g., upstash)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

export type RateLimitConfig = {
  /** Max requests allowed within the window */
  max: number;
  /** Time window in milliseconds */
  windowMs: number;
};

const DEFAULTS: RateLimitConfig = {
  max: 30,
  windowMs: 60_000, // 1 minute
};

/**
 * Check rate limit for a given key (IP, user ID, etc).
 * Returns { allowed, remaining, resetAt }.
 * If not allowed, the caller should return a 429 response.
 */
export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {},
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const { max, windowMs } = { ...DEFAULTS, ...config };
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

/**
 * Get a rate limit key from request headers (IP forwarding aware).
 * Falls back to a shared key for server-side calls.
 */
export function getRateLimitKey(request?: Request): string {
  if (request) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    return `rl:${ip}`;
  }
  return "rl:server";
}

