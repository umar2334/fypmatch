import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/schema";
import { chatReply } from "@/lib/server/gemini";
import { fail, failFromError, isCrossOrigin, isMockMode, readJson } from "@/lib/server/http";
import { buildChatSystem, toGeminiContents } from "@/lib/server/prompt";
import { chatLimiter, clientIp } from "@/lib/server/rate-limit";

export const maxDuration = 30;

export async function POST(request: Request) {
  if (isCrossOrigin(request)) return fail("forbidden");

  const limit = chatLimiter.check(clientIp(request.headers));
  if (!limit.ok) return fail("rate_limited", limit.retryAfterSeconds);

  const read = await readJson(request, 128 * 1024);
  if (!read.ok) return fail(read.code);
  const parsed = chatRequestSchema.safeParse(read.body);
  if (!parsed.success) return fail("invalid_input");
  const { idea, messages } = parsed.data;

  if (isMockMode()) {
    return NextResponse.json({ reply: `Test mode reply about "${idea.title}". Real answers appear once the AI is connected.` });
  }

  try {
    const reply = await chatReply(buildChatSystem(idea), toGeminiContents(messages));
    return NextResponse.json({ reply });
  } catch (error) {
    return failFromError(error);
  }
}
