import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SAMPLE_IDEAS } from "@/lib/sample";
import { AiError, chatReply, generateIdeas, parseIdeas } from "@/lib/server/gemini";

const good = JSON.stringify({ ideas: SAMPLE_IDEAS });
const reply = (text: string) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }));

describe("parseIdeas", () => {
  it("accepts JSON, including fenced JSON", () => {
    expect(parseIdeas(good)).toHaveLength(5);
    expect(parseIdeas("```json\n" + good + "\n```")).toHaveLength(5);
  });
  it("returns null for bad output", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(parseIdeas("not json")).toBeNull();
    expect(parseIdeas('{"ideas":[]}')).toBeNull();
  });
});

describe("generateIdeas", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sends the key in a header and never in the URL", async () => {
    fetchMock.mockResolvedValueOnce(reply(good));
    await generateIdeas("p");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).not.toContain("test-key");
    expect(init.headers["x-goog-api-key"]).toBe("test-key");
  });
  it("uses GEMINI_MODEL when set", async () => {
    vi.stubEnv("GEMINI_MODEL", "custom-model");
    fetchMock.mockResolvedValueOnce(reply(good));
    await generateIdeas("p");
    expect(String(fetchMock.mock.calls[0]![0])).toContain("custom-model");
  });
  it("retries once after malformed output", async () => {
    fetchMock.mockResolvedValueOnce(reply("oops")).mockResolvedValueOnce(reply(good));
    await expect(generateIdeas("p")).resolves.toHaveLength(5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("gives up after a second malformed reply", async () => {
    fetchMock.mockImplementation(async () => reply("oops"));
    await expect(generateIdeas("p")).rejects.toMatchObject({ code: "bad_output" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("retries after an empty reply", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}")).mockResolvedValueOnce(reply(good));
    await expect(generateIdeas("p")).resolves.toHaveLength(5);
  });
  it("reports quota errors as busy, without retrying", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 429 }));
    await expect(generateIdeas("p")).rejects.toMatchObject({ code: "busy" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("reports network failures as busy", async () => {
    fetchMock.mockRejectedValue(new Error("down"));
    await expect(generateIdeas("p")).rejects.toMatchObject({ code: "busy" });
  });
  it("reports a rejected key as not configured", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 403 }));
    await expect(generateIdeas("p")).rejects.toMatchObject({ code: "not_configured" });
  });
  it("fails without a key and doesn't call Gemini", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    await expect(generateIdeas("p")).rejects.toBeInstanceOf(AiError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("returns chat text", async () => {
    fetchMock.mockResolvedValueOnce(reply("Hello"));
    await expect(chatReply("s", [{ role: "user", parts: [{ text: "hi" }] }])).resolves.toBe("Hello");
  });
});
