"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requestIdeas } from "@/lib/api";
import { describeProfile } from "@/lib/schema";
import { loadResult, saveResult, type StoredResult } from "@/lib/storage";
import { Download } from "./icons";
import { IdeaCard } from "./IdeaCard";
import { TopBar } from "./Logo";

export function NoResults({ message = "Your ideas are saved in this browser, and none were found here." }: { message?: string }) {
  return (
    <main className="wrap flex flex-1 flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight">No ideas here yet.</h1>
      <p className="mt-3 text-muted">{message}</p>
      <Link href="/generate" className="btn-dark mt-7 h-[46px] px-7">Generate my ideas</Link>
    </main>
  );
}

export function SampleNotice() {
  return (
    <p role="status" className="mb-6 rounded-lg border border-warn bg-warn-bg px-4 py-2.5 text-[13px] text-ink">
      <strong>Test mode:</strong> these are sample ideas, not generated for your profile.
    </p>
  );
}

export function ResultsView() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null | undefined>(undefined);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => setResult(loadResult()), []);

  if (result === undefined) return <main className="flex-1" aria-busy="true" />;
  if (result === null) {
    return (
      <>
        <TopBar />
        <NoResults />
      </>
    );
  }

  const generateAgain = async () => {
    setRegenerating(true);
    setError(null);
    try {
      const next = await requestIdeas(result.profile, result.ideas.map((i) => i.title));
      const stored: StoredResult = { ...result, ideas: next.ideas, sample: next.sample, generatedAt: next.generatedAt, chosenIndex: null, chats: {} };
      saveResult(stored);
      setResult(stored);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const exportAll = async () => {
    setPdfError(false);
    try {
      const { downloadPdf } = await import("@/lib/pdf");
      downloadPdf(result.ideas.map((idea, i) => ({ idea, rank: i + 1 })), describeProfile(result.profile), "fypmatch-ideas.pdf");
    } catch {
      setPdfError(true);
    }
  };

  return (
    <>
      <TopBar>
        <button type="button" onClick={exportAll} className="btn-light h-9 px-4 text-[13px] font-medium"><Download /> Download PDF</button>
        <button type="button" onClick={() => router.push("/generate")} className="btn-dark h-9 px-4 text-[13px]">New search</button>
      </TopBar>
      <main className="wrap flex-1 pb-20 pt-14">
        {result.sample ? <SampleNotice /> : null}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="rounded-full bg-ok-bg px-2.5 py-1 font-semibold text-ok">● Generated</span>
          <span>{describeProfile(result.profile)}</span>
        </div>
        <h1 className="mt-4 text-[32px] font-extrabold tracking-tight sm:text-[38px]">5 FYP ideas matched to your profile.</h1>
        <p className="mt-3 text-muted">Ranked by fit. Tap any card to see full details, tech stack, MVP features, and supervisor pitch.</p>
        {pdfError ? <p role="alert" className="mt-3 text-sm text-red-600">We couldn&apos;t create the PDF. Please try again.</p> : null}
        <div className="mt-10 flex flex-col gap-4">
          {result.ideas.map((idea, i) => (
            <IdeaCard key={idea.title} idea={idea} rank={i + 1} href={`/ideas/${i + 1}`} chosen={result.chosenIndex === i} />
          ))}
        </div>
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Want more refined ideas?</h2>
          <p className="mt-3 text-muted">Generate a fresh set, or open any idea and refine it with AI chat.</p>
          {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={generateAgain} disabled={regenerating} className="btn-dark h-[46px] px-7">
              {regenerating ? "Generating..." : "Generate again"}
            </button>
            <Link href="/pricing" className="btn-light h-[46px] px-7 font-medium">Student Pro: coming soon</Link>
          </div>
        </section>
      </main>
    </>
  );
}
