import { describe, expect, it } from "vitest";
import { cacheKey, TtlCache } from "@/lib/server/cache";
import { clientIp, RateLimiter } from "@/lib/server/rate-limit";

describe("RateLimiter", () => {
  it("blocks past the limit and reports when to retry", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.check("a", 0).ok).toBe(true);
    expect(limiter.check("a", 1).ok).toBe(true);
    expect(limiter.check("a", 400)).toEqual({ ok: false, retryAfterSeconds: 1 });
  });
  it("tracks each key separately", () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.check("a", 0).ok).toBe(true);
    expect(limiter.check("b", 0).ok).toBe(true);
  });
  it("resets after the window", () => {
    const limiter = new RateLimiter(1, 1000);
    limiter.check("a", 0);
    expect(limiter.check("a", 999).ok).toBe(false);
    expect(limiter.check("a", 1000).ok).toBe(true);
  });
  it("stays usable at the key limit", () => {
    const limiter = new RateLimiter(1, 1000, 2);
    limiter.check("a", 0);
    limiter.check("b", 0);
    expect(limiter.check("c", 0).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("uses the first forwarded address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2" }))).toBe("1.1.1.1");
    expect(clientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("TtlCache", () => {
  it("expires entries and evicts the oldest", () => {
    const cache = new TtlCache<number>(100, 2);
    cache.set("a", 1, 0);
    expect(cache.get("a", 99)).toBe(1);
    expect(cache.get("a", 100)).toBeUndefined();
    cache.set("a", 1, 0);
    cache.set("b", 2, 0);
    cache.set("c", 3, 0);
    expect(cache.get("a", 1)).toBeUndefined();
    expect(cache.get("c", 1)).toBe(3);
  });
  it("hashes equal values to equal keys", () => {
    expect(cacheKey({ a: 1 })).toBe(cacheKey({ a: 1 }));
    expect(cacheKey({ a: 1 })).not.toBe(cacheKey({ a: 2 }));
  });
});
