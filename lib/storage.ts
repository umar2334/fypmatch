"use client";
import { ideaSchema, profileSchema, type Profile } from "./schema";
import { z } from "zod";

const DRAFT_KEY = "fypmatch.draft.v1";
const RESULT_KEY = "fypmatch.result.v1";

export interface Draft {
  step: 1 | 2;
  profile: Profile;
}

export const resultSchema = z.object({
  profile: profileSchema,
  ideas: z.array(ideaSchema).length(5),
  sample: z.boolean(),
  generatedAt: z.string(),
  chosenIndex: z.number().int().min(0).max(4).nullable().default(null),
  chats: z.record(z.string(), z.array(z.object({ role: z.enum(["user", "model"]), text: z.string() }))).default({}),
});
export type StoredResult = z.infer<typeof resultSchema>;

const draftSchema = z.object({ step: z.union([z.literal(1), z.literal(2)]), profile: profileSchema });

function read<T>(key: string, schema: z.ZodType<T, z.ZodTypeDef, unknown>): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private windows can block storage. The app still works for the current page.
  }
}

// A draft may not have any interests chosen yet, which the strict schema rejects.
const looseDraftSchema = z.object({
  step: draftSchema.shape.step,
  profile: profileSchema.extend({ interests: z.array(profileSchema.shape.interests.element) }),
});

export const loadDraft = (): Draft | null => read(DRAFT_KEY, looseDraftSchema);
export const saveDraft = (draft: Draft) => write(DRAFT_KEY, draft);
export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};

export const loadResult = (): StoredResult | null => read(RESULT_KEY, resultSchema);
export const saveResult = (result: StoredResult) => write(RESULT_KEY, result);
