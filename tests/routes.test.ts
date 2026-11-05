import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as chat } from "@/app/api/chat/route";
import { POST as generate } from "@/app/api/generate/route";
import { chatHistory } from "@/lib/api";
import type { ChatMessage } from "@/lib/schema";
import { SAMPLE_IDEAS, SAMPLE_PROFILE } from "@/lib/sample";

let ip = 0;
const request = (path: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost", "x-forwarded-for": `10.0.0.${++ip}`, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

describe("API routes", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("MOCK_AI", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("gives an honest error with no key, and never fake ideas", async () => {
    const res = await generate(request("/api/generate", { profile: SAMPLE_PROFILE }));
    const body = await res.json();
    expect(res.status).toBe(503);
    expect(body.error.code).toBe("not_configured");
    expect(body.ideas).toBeUndefined();
  });
  it("serves labelled samples in mock mode", async () => {
    vi.stubEnv("MOCK_AI", "1");
    const body = await (await generate(request("/api/generate", { profile: SAMPLE_PROFILE }))).json();
    expect(body.sample).toBe(true);
    expect(body.ideas).toHaveLength(5);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("ignores mock mode on Vercel production", async () => {
    vi.stubEnv("MOCK_AI", "1");
    vi.stubEnv("VERCEL_ENV", "production");
    const res = await generate(request("/api/generate", { profile: SAMPLE_PROFILE }));
    expect(res.status).toBe(503);
  });
  it("rejects invalid input, bad JSON, oversized bodies and other sites", async () => {
    expect((await generate(request("/api/generate", { profile: { department: "x" } }))).status).toBe(400);
    expect((await generate(request("/api/generate", "{nope"))).status).toBe(400);
    expect((await generate(request("/api/generate", "x".repeat(17 * 1024)))).status).toBe(413);
    expect((await generate(request("/api/generate", { profile: SAMPLE_PROFILE }, { origin: "https://evil.example" }))).status).toBe(403);
  });
  it("caches identical generations", async () => {
    vi.stubEnv("GEMINI_API_KEY", "k");
    const text = JSON.stringify({ ideas: SAMPLE_IDEAS });
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] })));
    const profile = { ...SAMPLE_PROFILE, notes: "cache test" };
    expect((await generate(request("/api/generate", { profile }))).status).toBe(200);
    expect((await generate(request("/api/generate", { profile }))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("rate limits one IP", async () => {
    const headers = { "x-forwarded-for": "10.9.9.9" };
    let last = 0;
    for (let i = 0; i < 13; i += 1) last = (await generate(request("/api/generate", { profile: SAMPLE_PROFILE }, headers))).status;
    expect(last).toBe(429);
  });
  it("accepts the largest chat history the client can send, in Urdu", async () => {
    vi.stubEnv("MOCK_AI", "1");
    const long = Array.from({ length: 21 }, (_, i) => ({ role: i % 2 ? "model" : "user", text: "اردو".repeat(800) })) as ChatMessage[];
    const res = await chat(request("/api/chat", { idea: SAMPLE_IDEAS[0], messages: chatHistory(long) }));
    expect(res.status).toBe(200);
  });
  it("answers chat, and reports busy on outage", async () => {
    vi.stubEnv("GEMINI_API_KEY", "k");
    const messages = [{ role: "user", text: "hi" }];
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "Hello" }] } }] })));
    const ok = await chat(request("/api/chat", { idea: SAMPLE_IDEAS[0], messages }));
    expect((await ok.json()).reply).toBe("Hello");
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    expect((await chat(request("/api/chat", { idea: SAMPLE_IDEAS[0], messages }))).status).toBe(503);
  });
});
