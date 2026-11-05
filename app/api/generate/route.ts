import { NextResponse } from "next/server";
import type { Idea } from "@/lib/schema";
import { generateRequestSchema } from "@/lib/schema";
import { SAMPLE_IDEAS } from "@/lib/sample";
import { cacheKey, TtlCache } from "@/lib/server/cache";
import { generateIdeas } from "@/lib/server/gemini";
import { fail, failFromError, isCrossOrigin, isMockMode, readJson } from "@/lib/server/http";
import { buildGeneratePrompt } from "@/lib/server/prompt";
import { clientIp, generateLimiter } from "@/lib/server/rate-limit";

export const maxDuration = 60;

const cache = new TtlCache<Idea[]>(24 * 60 * 60 * 1000, 300);

export async function POST(request: Request) {
  if (isCrossOrigin(request)) return fail("forbidden");

  const limit = generateLimiter.check(clientIp(request.headers));
  if (!limit.ok) return fail("rate_limited", limit.retryAfterSeconds);

  const read = await readJson(request, 16 * 1024);
  if (!read.ok) return fail(read.code);
  const parsed = generateRequestSchema.safeParse(read.body);
  if (!parsed.success) return fail("invalid_input");
  const { profile, avoidTitles } = parsed.data;

  if (isMockMode()) {
    return NextResponse.json({ ideas: SAMPLE_IDEAS, sample: true, generatedAt: new Date().toISOString() });
  }

  const key = cacheKey({ profile, avoidTitles });
  const cached = cache.get(key);
  if (cached) {
    return NextResponse.json({ ideas: cached, sample: false, generatedAt: new Date().toISOString() });
  }

  try {
    const ideas = await generateIdeas(buildGeneratePrompt(profile, avoidTitles));
    cache.set(key, ideas);
    return NextResponse.json({ ideas, sample: false, generatedAt: new Date().toISOString() });
  } catch (error) {
    return failFromError(error);
  }
}
