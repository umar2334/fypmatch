import { describe, expect, it } from "vitest";
import { chatRequestSchema, defaultProfile, generateRequestSchema, ideasSchema, profileSchema } from "@/lib/schema";
import { SAMPLE_IDEAS, SAMPLE_PROFILE } from "@/lib/sample";

describe("ideasSchema", () => {
  it("accepts the sample output", () => {
    expect(ideasSchema.safeParse({ ideas: SAMPLE_IDEAS }).success).toBe(true);
  });
  it("needs exactly 5 ideas", () => {
    expect(ideasSchema.safeParse({ ideas: SAMPLE_IDEAS.slice(0, 4) }).success).toBe(false);
  });
  it("rejects scores outside 1-10", () => {
    const bad = SAMPLE_IDEAS.map((idea) => ({ ...idea, difficulty: 11 }));
    expect(ideasSchema.safeParse({ ideas: bad }).success).toBe(false);
  });
  it("rejects a missing field", () => {
    const incomplete: Partial<(typeof SAMPLE_IDEAS)[number]> = { ...SAMPLE_IDEAS[0]! };
    delete incomplete.supervisorPitch;
    expect(ideasSchema.safeParse({ ideas: [incomplete, ...SAMPLE_IDEAS.slice(1)] }).success).toBe(false);
  });
});

describe("request schemas", () => {
  it("requires at least one interest", () => {
    expect(profileSchema.safeParse(defaultProfile).success).toBe(false);
    expect(profileSchema.safeParse(SAMPLE_PROFILE).success).toBe(true);
  });
  it("rejects unknown options and over-long notes", () => {
    expect(profileSchema.safeParse({ ...SAMPLE_PROFILE, department: "Magic" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...SAMPLE_PROFILE, notes: "x".repeat(501) }).success).toBe(false);
  });
  it("defaults avoidTitles", () => {
    expect(generateRequestSchema.parse({ profile: SAMPLE_PROFILE }).avoidTitles).toEqual([]);
  });
  it("requires chat to end on a user message", () => {
    const idea = SAMPLE_IDEAS[0];
    expect(chatRequestSchema.safeParse({ idea, messages: [{ role: "user", text: "hi" }] }).success).toBe(true);
    expect(chatRequestSchema.safeParse({ idea, messages: [{ role: "model", text: "hi" }] }).success).toBe(false);
  });
});

describe("sample honesty", () => {
  it("contains no invented figures carried over from the mockups", () => {
    const text = JSON.stringify(SAMPLE_IDEAS);
    for (const claim of ["$50k", "$40M", "80%", "1M+", "10+ Pakistani", "FAANG", "Patentable"]) {
      expect(text).not.toContain(claim);
    }
  });
});
