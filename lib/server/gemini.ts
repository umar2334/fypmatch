import type { Idea } from "@/lib/schema";
import { ideasSchema } from "@/lib/schema";
import { REPAIR_NOTE } from "./prompt";

export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const ATTEMPT_TIMEOUT_MS = 25_000;

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
}

async function callGemini(options: CallOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiError("not_configured", "GEMINI_API_KEY is not set.");
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  let response: Response;
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      // Header rather than query string, so the key can't end up in request logs.
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
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
    throw new AiError("busy", "Gemini request failed or timed out.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new AiError("not_configured", `Gemini rejected the API key (${response.status}).`);
  }
  if (!response.ok) {
    // 404 means a retired model name; that's a deployment problem worth logging clearly.
    console.error(`Gemini returned ${response.status} for model ${model}`);
    throw new AiError("busy", `Gemini returned ${response.status}.`);
  }

  const data = (await response.json().catch(() => null)) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  } | null;
  const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  if (!reply) throw new AiError("bad_output", "Gemini returned an empty reply.");
  return reply;
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

/** Generates ideas, retrying once if the reply is malformed. Outages are not retried. */
export async function generateIdeas(prompt: string): Promise<Idea[]> {
  const contents: GeminiContent[] = [{ role: "user", parts: [{ text: prompt }] }];
  const options = { json: true, maxOutputTokens: 20_000, temperature: 0.8 };

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
  return callGemini({ system, contents, maxOutputTokens: 4_000, temperature: 0.6 });
}
