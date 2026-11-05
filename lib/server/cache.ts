import { createHash } from "node:crypto";

/** Small in-memory TTL cache. Oldest entries are evicted first. */
export class TtlCache<T> {
  private items = new Map<string, { value: T; expiresAt: number }>();

  constructor(
    private readonly ttlMs: number,
    private readonly maxItems: number,
  ) {}

  get(key: string, now = Date.now()): T | undefined {
    const item = this.items.get(key);
    if (!item) return undefined;
    if (item.expiresAt <= now) {
      this.items.delete(key);
      return undefined;
    }
    return item.value;
  }

  set(key: string, value: T, now = Date.now()) {
    this.items.delete(key);
    if (this.items.size >= this.maxItems) {
      const oldest = this.items.keys().next().value;
      if (oldest !== undefined) this.items.delete(oldest);
    }
    this.items.set(key, { value, expiresAt: now + this.ttlMs });
  }
}

export function cacheKey(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
