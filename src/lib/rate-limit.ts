import { config } from './config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

function getKey(ip: string, identifier: string): string {
  return `${ip}:${identifier}`;
}

function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  ip: string,
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): RateLimitResult {
  if (!config.enableRateLimiting) {
    return { allowed: true, remaining: maxRequests, resetTime: Date.now() };
  }

  cleanupExpiredEntries(Date.now());

  const key = getKey(ip, identifier);
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = store.get(key);

  if (!entry || entry.resetTime <= now) {
    const resetTime = now + windowMs;
    store.set(key, { count: 1, resetTime });

    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function checkLoginRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(
    ip,
    'login',
    config.loginRateLimitMaxRequests,
    config.rateLimitWindowSeconds
  );
}

export function checkApiRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(
    ip,
    'api',
    config.rateLimitMaxRequests,
    config.rateLimitWindowSeconds
  );
}
