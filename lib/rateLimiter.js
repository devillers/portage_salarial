const store = globalThis.__memoryRateLimiters || new Map();
globalThis.__memoryRateLimiters = store;

function resolveClientIdentifier(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'anonymous';
}

class MemoryRateLimiter {
  constructor(options) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.keyPrefix = options.keyPrefix ?? 'rate-limit';
    this.storage = new Map();
  }

  getKey(request, key) {
    const identifier = key ?? resolveClientIdentifier(request);
    return `${this.keyPrefix}:${identifier}`;
  }

  async check(request, key) {
    const now = Date.now();
    const storageKey = this.getKey(request, key);
    let entry = this.storage.get(storageKey);

    if (!entry || entry.expires <= now) {
      entry = {
        count: 0,
        expires: now + this.windowMs
      };
    }

    if (entry.count >= this.max) {
      const retryAfterSeconds = Math.ceil((entry.expires - now) / 1000);
      return {
        success: false,
        remaining: 0,
        limit: this.max,
        reset: entry.expires,
        retryAfter: retryAfterSeconds,
        headers: {
          'RateLimit-Limit': String(this.max),
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': String(Math.ceil(entry.expires / 1000)),
          'Retry-After': String(retryAfterSeconds)
        }
      };
    }

    entry.count += 1;
    this.storage.set(storageKey, entry);

    const remaining = Math.max(this.max - entry.count, 0);

    return {
      success: true,
      remaining,
      limit: this.max,
      reset: entry.expires,
      headers: {
        'RateLimit-Limit': String(this.max),
        'RateLimit-Remaining': String(remaining),
        'RateLimit-Reset': String(Math.ceil(entry.expires / 1000))
      }
    };
  }
}

export function createRateLimiter(options) {
  const key = `${options.keyPrefix ?? 'rate-limit'}:${options.windowMs}:${options.max}`;
  if (store.has(key)) {
    return store.get(key);
  }

  const limiter = new MemoryRateLimiter(options);
  store.set(key, limiter);
  return limiter;
}

export function applyRateLimitHeaders(response, rateLimitResult) {
  if (!response || !rateLimitResult?.headers) {
    return response;
  }

  Object.entries(rateLimitResult.headers).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  return response;
}
