"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { requestIdeas } from "@/lib/api";
import {
  CAREER_GOALS,
  defaultProfile,
  DEPARTMENTS,
  describeProfile,
  DURATIONS,
  INTERESTS,
  SEMESTERS,
  SKILL_LEVELS,
  SUPERVISOR_STYLES,
  TEAM_SIZES,
  UNIVERSITIES,
  type Profile,
} from "@/lib/schema";
import { clearDraft, loadDraft, saveDraft, saveResult } from "@/lib/storage";
import { Boxes, Label, MultiPills, Segmented, SinglePills } from "./Choices";
import { ArrowLeft, ArrowRight, Close } from "./icons";
import { TopBar } from "./Logo";

type Step = 1 | 2 | 3;

function Heading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 text-[32px] font-extrabold leading-tight tracking-tight sm:text-[46px]">{title}</h1>
      <p className="mt-3 text-muted">{sub}</p>
    </div>
  );
}

function StepOne({ profile, patch, onNext }: { profile: Profile; patch: (p: Partial<Profile>) => void; onNext: () => void }) {
  return (
    <>
      <Heading eyebrow="Your university" title="Where is your FYP happening?" sub="This helps us match ideas to how your project will be judged." />
      <div className="card mt-10 flex flex-col gap-8 p-6 sm:p-12">
        <div>
          <Label>University</Label>
          <SinglePills label="University" options={UNIVERSITIES} value={profile.university} onChange={(university) => patch({ university })} />
        </div>
        <div>
          <Label>Current semester</Label>
          <Segmented label="Current semester" options={SEMESTERS} value={profile.semester} onChange={(semester) => patch({ semester })} />
        </div>
        <div>
          <Label>Your supervisor prefers</Label>
          <SinglePills label="Your supervisor prefers" options={SUPERVISOR_STYLES} value={profile.supervisorStyle} onChange={(supervisorStyle) => patch({ supervisorStyle })} />
        </div>
        <div className="mt-2 flex justify-end">
          <button type="button" onClick={onNext} className="btn-dark h-[46px] w-full px-7 sm:w-auto">
            Continue <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

function StepTwo({ profile, patch, onBack, onNext }: { profile: Profile; patch: (p: Partial<Profile>) => void; onBack: () => void; onNext: () => void }) {
  const [techInput, setTechInput] = useState("");
  const [showError, setShowError] = useState(false);

  const addTech = () => {
    const value = techInput.trim().slice(0, 30);
    if (value && profile.tech.length < 15 && !profile.tech.some((t) => t.toLowerCase() === value.toLowerCase())) {
      patch({ tech: [...profile.tech, value] });
    }
    setTechInput("");
  };

  const submit = () => {
    if (profile.interests.length === 0) {
      setShowError(true);
      document.getElementById("interests")?.scrollIntoView({ block: "center" });
      return;
    }
    onNext();
  };

  return (
    <>
      <Heading eyebrow="Your profile" title="Tell us about your project context." sub="More details = better-matched ideas. Takes ~60 seconds." />
      <div className="card mt-10 flex flex-col gap-8 p-6 sm:p-12">
        <div>
          <Label>Department</Label>
          <SinglePills label="Department" options={DEPARTMENTS} value={profile.department} onChange={(department) => patch({ department })} />
        </div>
        <div>
          <Label id="interests">Interests &nbsp;(select all that apply)</Label>
          <MultiPills
            label="Interests"
            options={INTERESTS}
            value={profile.interests}
            onChange={(interests) => {
              setShowError(false);
              patch({ interests });
            }}
          />
          {showError ? <p role="alert" className="mt-2 text-[13px] font-medium text-red-600">Choose at least one interest so we can match ideas to you.</p> : null}
        </div>
        <div>
          <Label>Skill level</Label>
          <Segmented label="Skill level" options={SKILL_LEVELS} value={profile.skillLevel} onChange={(skillLevel) => patch({ skillLevel })} />
        </div>
        <div>
          <label htmlFor="tech"><Label>Tech you already know</Label></label>
          <input
            id="tech"
            className="input"
            placeholder="Type a technology and press enter..."
            value={techInput}
            maxLength={30}
            onChange={(e) => setTechInput(e.target.value)}
            onBlur={addTech}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTech();
              }
            }}
          />
          {profile.tech.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.tech.map((t) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3 pr-2 font-mono text-xs text-white">
                  {t}
                  <button type="button" aria-label={`Remove ${t}`} onClick={() => patch({ tech: profile.tech.filter((x) => x !== t) })} className="text-zinc-400 hover:text-white">
                    <Close />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-8">
          <div>
            <Label>Team size</Label>
            <Boxes label="Team size" options={TEAM_SIZES} value={profile.teamSize} onChange={(teamSize) => patch({ teamSize })} />
          </div>
          <div>
            <Label>Duration</Label>
            <Boxes label="Duration" mono options={DURATIONS} value={profile.durationMonths} onChange={(durationMonths) => patch({ durationMonths })} format={(v) => `${v} mo`} />
          </div>
        </div>
        <div>
          <Label>Career goal after graduation</Label>
          <SinglePills label="Career goal after graduation" tone="blue" options={CAREER_GOALS} value={profile.careerGoal} onChange={(careerGoal) => patch({ careerGoal })} />
        </div>
        <div>
          <label htmlFor="notes"><Label>Anything else we should know?</Label></label>
          <textarea
            id="notes"
            className="input min-h-[100px] resize-y"
            maxLength={500}
            placeholder="e.g. Want something that helps us get hired abroad. Open to learning a new framework. Avoid blockchain."
            value={profile.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
          <p className="mt-2 text-[11.5px] text-muted">Optional · Helps the AI understand your context. Please don&apos;t include personal details.</p>
        </div>
        <div className="mt-2 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button type="button" onClick={onBack} className="btn-light h-[46px] px-6 font-medium">
            <ArrowLeft /> Back
          </button>
          <button type="button" onClick={submit} className="btn-dark h-[46px] px-7">
            Generate 5 ideas <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

const STATUS_LINES = ["Reading your profile", "Matching ideas to your skills", "Checking scope against your timeline", "Ranking your 5 ideas"];

function StepThree({ profile, error, onRetry, onBack }: { profile: Profile; error: string | null; onRetry: () => void; onBack: () => void }) {
  const [line, setLine] = useState(0);
  useEffect(() => {
    if (error) return;
    const timer = setInterval(() => setLine((n) => Math.min(n + 1, STATUS_LINES.length - 1)), 5000);
    return () => clearInterval(timer);
  }, [error]);

  return (
    <div className="mx-auto max-w-[620px]" aria-live="polite">
      {error ? (
        <>
          <Heading eyebrow="We hit a problem" title="No ideas generated." sub={error} />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={onRetry} className="btn-dark h-[46px] px-7">Try again</button>
            <button type="button" onClick={onBack} className="btn-light h-[46px] px-6 font-medium"><ArrowLeft /> Edit my answers</button>
          </div>
        </>
      ) : (
        <>
          <Heading eyebrow="Generating" title="Finding your best-fit ideas." sub={`${STATUS_LINES[line]}...`} />
          <div className="mx-auto mt-8 h-1 max-w-[320px] overflow-hidden rounded bg-line" role="progressbar" aria-label="Generating ideas">
            <div className="h-full w-1/3 animate-slide rounded bg-ink" />
          </div>
          <p className="mt-6 text-center font-mono text-xs text-muted">{describeProfile(profile)}</p>
        </>
      )}
    </div>
  );
}

export function Wizard() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setProfile(draft.profile);
      setStep(draft.step);
    }
    setLoaded(true);
    return () => controller.current?.abort();
  }, []);

  useEffect(() => {
    if (loaded) saveDraft({ step: step === 3 ? 2 : step, profile });
  }, [loaded, step, profile]);

  const patch = useCallback((p: Partial<Profile>) => setProfile((current) => ({ ...current, ...p })), []);

  const go = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0 });
  };

  const generate = async () => {
    go(3);
    setError(null);
    controller.current?.abort();
    controller.current = new AbortController();
    try {
      const result = await requestIdeas(profile, [], controller.current.signal);
      saveResult({ profile, ideas: result.ideas, sample: result.sample, generatedAt: result.generatedAt, chosenIndex: null, chats: {} });
      clearDraft();
      router.push("/results");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const progress = (step / 3) * 100;

  return (
    <>
      <TopBar
        center={
          <div className="order-3 flex w-full items-center justify-center gap-3 sm:order-none sm:w-auto">
            <span className="font-mono text-xs text-muted">Step {step} of 3</span>
            <div className="h-[3px] w-[200px] overflow-hidden rounded bg-line">
              <div className="h-full rounded bg-ink transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        }
      >
        <button type="button" onClick={() => router.push("/")} className="text-sm text-muted hover:text-ink">
          Save &amp; exit
        </button>
      </TopBar>
      <main className="mx-auto w-full max-w-[800px] flex-1 px-5 pb-20 pt-14 sm:pt-20">
        {!loaded ? (
          <div className="h-96" aria-busy="true" />
        ) : step === 1 ? (
          <StepOne profile={profile} patch={patch} onNext={() => go(2)} />
        ) : step === 2 ? (
          <StepTwo profile={profile} patch={patch} onBack={() => go(1)} onNext={generate} />
        ) : (
          <StepThree profile={profile} error={error} onRetry={generate} onBack={() => go(2)} />
        )}
      </main>
    </>
  );
}
