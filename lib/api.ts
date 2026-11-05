import type { ChatMessage, Idea, Profile } from "./schema";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
  }
}

async function post<T>(url: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("We couldn't reach the server. Check your connection and try again.", "network");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.error?.message ?? "Something went wrong. Please try again.", data?.error?.code ?? "unknown");
  }
  return data as T;
}

export const requestIdeas = (profile: Profile, avoidTitles: string[], signal?: AbortSignal) =>
  post<{ ideas: Idea[]; sample: boolean; generatedAt: string }>("/api/generate", { profile, avoidTitles }, signal);

/** Fits saved history to the API limits: the last 20 messages, starting with the student, each under 2,000 characters. */
export function chatHistory(messages: ChatMessage[]): ChatMessage[] {
  const recent = messages.slice(-20).map((m) => ({ ...m, text: m.text.slice(0, 2000) }));
  return recent[0]?.role === "model" ? recent.slice(1) : recent;
}

export const requestChat = (idea: Idea, messages: ChatMessage[]) => post<{ reply: string }>("/api/chat", { idea, messages });
