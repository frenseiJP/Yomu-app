type RateBucket = {
  count: number;
  resetAt: number;
};

type RateStore = Map<string, RateBucket>;

function getStore(): RateStore {
  const g = globalThis as typeof globalThis & {
    __frensei_rate_store__?: RateStore;
  };
  if (!g.__frensei_rate_store__) {
    g.__frensei_rate_store__ = new Map<string, RateBucket>();
  }
  return g.__frensei_rate_store__;
}

function nowMs(): number {
  return Date.now();
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.trim();
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

function consumeRateLimitInMemory(params: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; retryAfterSec: number } {
  const store = getStore();
  const now = nowMs();
  const existing = store.get(params.key);

  if (!existing || existing.resetAt <= now) {
    store.set(params.key, { count: 1, resetAt: now + params.windowMs });
    return {
      ok: true,
      remaining: Math.max(0, params.limit - 1),
      retryAfterSec: Math.ceil(params.windowMs / 1000),
    };
  }

  if (existing.count >= params.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  store.set(params.key, existing);
  return {
    ok: true,
    remaining: Math.max(0, params.limit - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

function canUseUpstash(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

const upstashLimiterByPolicy = new Map<string, Promise<{
  limit: (id: string) => Promise<{ success: boolean; reset: number; remaining?: number }>;
}>>();

async function getUpstashLimiter(limit: number, windowMs: number) {
  const policyKey = `${limit}:${windowMs}`;
  const existing = upstashLimiterByPolicy.get(policyKey);
  if (existing) return existing;
  const created = (async () => {
      const [{ Ratelimit }, { Redis }] = await Promise.all([
        import("@upstash/ratelimit"),
        import("@upstash/redis"),
      ]);
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      const limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
        analytics: false,
      });
      return {
        limit: async (id: string) => {
          const r = await limiter.limit(id);
          return { success: r.success, reset: r.reset, remaining: r.remaining };
        },
      };
    })();
  upstashLimiterByPolicy.set(policyKey, created);
  return created;
}

export async function consumeRateLimit(params: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ ok: boolean; remaining: number; retryAfterSec: number }> {
  if (!canUseUpstash()) {
    return consumeRateLimitInMemory(params);
  }

  try {
    const limiter = await getUpstashLimiter(params.limit, params.windowMs);
    const result = await limiter.limit(params.key);
    const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return {
      ok: result.success,
      remaining: Math.max(0, result.remaining ?? 0),
      retryAfterSec,
    };
  } catch {
    // Fail-open to in-memory limiter to avoid breaking app flows.
    return consumeRateLimitInMemory(params);
  }
}
