import { NextResponse } from "next/server";
import { AiError } from "./gemini";

export type ErrorCode = "invalid_input" | "forbidden" | "too_large" | "rate_limited" | "not_configured" | "busy" | "bad_output";

export const MESSAGES: Record<ErrorCode, string> = {
  invalid_input: "Some of your answers look invalid. Please check them and try again.",
  forbidden: "This request isn't allowed.",
  too_large: "That request is too long. Please shorten it and try again.",
  rate_limited: "You've made a lot of requests. Please wait a few minutes and try again.",
  not_configured: "The AI service isn't configured on this site yet, so no ideas can be generated right now.",
  busy: "The AI service is busy right now. Please try again in a minute.",
  bad_output: "The AI returned an incomplete answer. Please try again.",
};

const STATUS: Record<ErrorCode, number> = {
  invalid_input: 400,
  forbidden: 403,
  too_large: 413,
  rate_limited: 429,
  not_configured: 503,
  busy: 503,
  bad_output: 502,
};

export function fail(code: ErrorCode, retryAfterSeconds?: number) {
  return NextResponse.json(
    { error: { code, message: MESSAGES[code] } },
    {
      status: STATUS[code],
      headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
    },
  );
}

export function failFromError(error: unknown) {
  if (error instanceof AiError) {
    if (error.code === "not_configured") console.error(error.message);
    return fail(error.code);
  }
  console.error("Unexpected AI route error:", error instanceof Error ? error.message : "unknown");
  return fail("busy");
}

/** Browsers send Origin on cross-site POSTs; reject those so other sites can't spend the quota. */
export function isCrossOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** Reads and parses a JSON body, enforcing the size limit on the bytes actually received. */
export async function readJson(request: Request, maxBytes: number): Promise<{ ok: true; body: unknown } | { ok: false; code: ErrorCode }> {
  const raw = await request.text().catch(() => null);
  if (raw === null) return { ok: false, code: "invalid_input" };
  if (new TextEncoder().encode(raw).length > maxBytes) return { ok: false, code: "too_large" };
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, code: "invalid_input" };
  }
}

/** Mock replies exist for tests and can never switch on in a Vercel production deployment. */
export function isMockMode(): boolean {
  return process.env.MOCK_AI === "1" && process.env.VERCEL_ENV !== "production";
}
