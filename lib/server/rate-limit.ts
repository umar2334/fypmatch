/**
 * Fixed-window limiter held in memory. On serverless platforms each instance
 * keeps its own counts, so this is abuse protection rather than an exact quota.
 */
export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxKeys = 5000,
  ) {}

  check(key: string, now = Date.now()): { ok: boolean; retryAfterSeconds: number } {
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      if (this.hits.size >= this.maxKeys) this.prune(now);
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return { ok: true, retryAfterSeconds: 0 };
    }
    if (entry.count >= this.limit) {
      return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
    }
    entry.count += 1;
    return { ok: true, retryAfterSeconds: 0 };
  }

  private prune(now: number) {
    for (const [key, entry] of this.hits) if (entry.resetAt <= now) this.hits.delete(key);
    // Everything is still live: drop the oldest key so memory stays bounded.
    if (this.hits.size >= this.maxKeys) {
      const oldest = this.hits.keys().next().value;
      if (oldest !== undefined) this.hits.delete(oldest);
    }
  }
}

/** Vercel sets x-forwarded-for itself, so the first entry is the client. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
}

// Campus networks can share one IP, so these are deliberately generous.
export const generateLimiter = new RateLimiter(12, 10 * 60 * 1000);
export const chatLimiter = new RateLimiter(40, 10 * 60 * 1000);
