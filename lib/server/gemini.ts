import type { Idea } from "@/lib/schema";
import { ideasSchema } from "@/lib/schema";
import { REPAIR_NOTE } from "./prompt";

export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-2.5-flash-lite"];
const ATTEMPT_TIMEOUT_MS = 25_000;
// Stay inside the route limits: 60 seconds for generate and 30 seconds for chat.
const GENERATE_BUDGET_MS = 55_000;
const CHAT_BUDGET_MS = 27_000;

export type AiErrorCode = "not_configured" | "busy" | "bad_output";

export class AiError extends Error {
  constructor(
    public readonly code: AiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export interface GeminiContent {
  role: string;
  parts: { text: string }[];
}

interface CallOptions {
  contents: GeminiContent[];
  system?: string;
  json?: boolean;
  maxOutputTokens: number;
  temperature: number;
  deadline: number;
}

/** Models to try in order. A single model can be overloaded while others are fine. */
export function modelChain(): string[] {
  const primary = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  return [...new Set([primary, ...FALLBACK_MODELS])];
}

async function callGemini(options: CallOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiError("not_configured", "GEMINI_API_KEY is not set.");

  let lastFailure = "no model attempted";

  for (const model of modelChain()) {
    const remaining = options.deadline - Date.now();
    if (remaining <= 0) break;

    let response: Response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        // Header rather than query string, so the key can't end up in request logs.
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        signal: AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
        body: JSON.stringify({
          contents: options.contents,
          ...(options.system ? { systemInstruction: { parts: [{ text: options.system }] } } : {}),
          generationConfig: {
            temperature: options.temperature,
            maxOutputTokens: options.maxOutputTokens,
            ...(options.json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      });
    } catch {
      lastFailure = `${model} failed or timed out`;
      console.error(`Gemini request failed or timed out for model ${model}`);
      continue;
    }

    if (response.status === 401 || response.status === 403) {
      throw new AiError("not_configured", `Gemini rejected the API key (${response.status}).`);
    }
    if (!response.ok) {
      // Overload, quota and retired-model errors are all specific to one model, so try the next.
      lastFailure = `${model} returned ${response.status}`;
      console.error(`Gemini returned ${response.status} for model ${model}`);
      continue;
    }

    const data = (await response.json().catch(() => null)) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    } | null;
    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    if (!reply) throw new AiError("bad_output", "Gemini returned an empty reply.");
    return reply;
  }

  throw new AiError("busy", `All Gemini models are unavailable: ${lastFailure}.`);
}

export function parseIdeas(raw: string): Idea[] | null {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch {
    return null;
  }
  const result = ideasSchema.safeParse(json);
  if (!result.success) {
    console.error("Gemini output failed validation:", result.error.issues.slice(0, 5).map((i) => i.path.join(".")));
    return null;
  }
  return result.data.ideas;
}

/** Generates ideas, retrying once if the reply is malformed. Outages fall back to other models. */
export async function generateIdeas(prompt: string): Promise<Idea[]> {
  const contents: GeminiContent[] = [{ role: "user", parts: [{ text: prompt }] }];
  const options = { json: true, maxOutputTokens: 20_000, temperature: 0.8, deadline: Date.now() + GENERATE_BUDGET_MS };

  const first = await callGemini({ ...options, contents }).catch((error: unknown) => {
    if (error instanceof AiError && error.code === "bad_output") return "";
    throw error;
  });
  const parsed = parseIdeas(first);
  if (parsed) return parsed;

  const second = await callGemini({
    ...options,
    contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${REPAIR_NOTE}` }] }],
  });
  const repaired = parseIdeas(second);
  if (repaired) return repaired;
  throw new AiError("bad_output", "Gemini output failed validation twice.");
}

export function chatReply(system: string, contents: GeminiContent[]): Promise<string> {
  return callGemini({ system, contents, maxOutputTokens: 4_000, temperature: 0.6, deadline: Date.now() + CHAT_BUDGET_MS });
}
