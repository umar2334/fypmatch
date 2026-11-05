import { z } from "zod";

export const DEPARTMENTS = ["CS", "SE", "AI", "Data Science", "Cybersecurity", "Business", "Pharmacy", "Media"] as const;
export const INTERESTS = ["AI/ML", "Web", "Mobile", "EdTech", "FinTech", "HealthTech", "IoT", "Blockchain", "GameDev", "AR/VR"] as const;
export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const TEAM_SIZES = [1, 2, 3, 4] as const;
export const DURATIONS = [4, 6, 8, 12] as const;
export const CAREER_GOALS = ["Job in Pakistan", "Job abroad", "Startup", "Apply for Masters", "Freelance"] as const;
export const UNIVERSITIES = ["Indus", "NUST", "FAST", "LUMS", "COMSATS", "IBA", "UET", "GIKI", "Other"] as const;
export const SEMESTERS = ["6th", "7th", "8th", "Other"] as const;
export const SUPERVISOR_STYLES = ["Research-focused", "Industry-focused", "Not sure yet"] as const;

const trimmed = (max: number) => z.string().trim().max(max);

export const profileSchema = z.object({
  university: z.enum(UNIVERSITIES),
  semester: z.enum(SEMESTERS),
  supervisorStyle: z.enum(SUPERVISOR_STYLES),
  department: z.enum(DEPARTMENTS),
  interests: z.array(z.enum(INTERESTS)).min(1).max(INTERESTS.length),
  skillLevel: z.enum(SKILL_LEVELS),
  tech: z.array(trimmed(30).min(1)).max(15),
  teamSize: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  durationMonths: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(12)]),
  careerGoal: z.enum(CAREER_GOALS),
  notes: trimmed(500),
});
export type Profile = z.infer<typeof profileSchema>;

const text = (max: number) => trimmed(max).min(1);
const score = z.number().int().min(1).max(10);
const list = (max: number, min = 1) => z.array(text(60)).min(min).max(max);

export const ideaSchema = z.object({
  label: text(40),
  categories: list(3),
  title: text(120),
  tagline: text(220),
  summary: text(500),
  difficulty: score,
  careerRelevance: score,
  originality: score,
  estimatedMonths: z.number().int().min(1).max(24),
  stackPreview: list(5),
  whyGood: text(260),
  whyGoodLong: text(900),
  mvpFeatures: z.array(text(180)).min(3).max(7),
  techStack: z.object({
    frontend: list(5, 0),
    backend: list(5, 0),
    database: list(5, 0),
    aiMl: list(5, 0),
    deployment: list(5, 0),
  }),
  skills: list(8),
  challenges: z.array(z.object({ title: text(80), mitigation: text(240) })).min(1).max(5),
  similarProducts: z.array(z.object({ name: text(60), note: text(140) })).max(4),
  glance: z.object({
    difficultyNote: text(50),
    careerNote: text(50),
    originalityNote: text(50),
    teamValue: text(20),
    teamNote: text(50),
    budgetValue: text(20),
    budgetNote: text(50),
  }),
  potential: z.object({ headline: text(90), details: text(320) }),
  supervisorPitch: text(1100),
});
export type Idea = z.infer<typeof ideaSchema>;

export const ideasSchema = z.object({ ideas: z.array(ideaSchema).length(5) });

export const generateRequestSchema = z.object({
  profile: profileSchema,
  avoidTitles: z.array(trimmed(120)).max(20).default([]),
});

export const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: trimmed(2000).min(1),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  idea: ideaSchema,
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(20)
    .refine((m) => m[m.length - 1]?.role === "user", "The last message must be from the user."),
});

export const defaultProfile: Profile = {
  university: "Other",
  semester: "7th",
  supervisorStyle: "Not sure yet",
  department: "SE",
  interests: [],
  skillLevel: "Intermediate",
  tech: [],
  teamSize: 2,
  durationMonths: 6,
  careerGoal: "Job in Pakistan",
  notes: "",
};

/** One-line profile summary, e.g. "for SE student · AI/ML + EdTech · 6 months · team of 2". */
export function describeProfile(p: Profile): string {
  const team = p.teamSize === 1 ? "solo" : `team of ${p.teamSize}`;
  return `for ${p.department} student · ${p.interests.join(" + ")} · ${p.durationMonths} months · ${team}`;
}
