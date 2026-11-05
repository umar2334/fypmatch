import Link from "next/link";
import type { Idea } from "@/lib/schema";
import { ArrowRight, Check, Clock } from "./icons";
import { ScoreBar } from "./ScoreBar";

interface Props {
  idea: Idea;
  rank: number;
  href: string;
  chosen?: boolean;
}

export function IdeaCard({ idea, rank, href, chosen }: Props) {
  const top = rank === 1;
  return (
    <article className={`animate-rise rounded-2xl border bg-white p-6 sm:p-7 ${top ? "border-2 border-coal" : "border-line"}`}>
      <div className="grid gap-7 lg:grid-cols-[1fr_416px] lg:gap-12">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-sm font-bold ${top ? "bg-ink text-white" : "bg-soft text-ink"}`}>
              #{rank}
            </span>
            <span className="rounded-full bg-warn-bg px-2.5 py-1 text-xs font-medium text-warn-text">{idea.label}</span>
            {chosen ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ok-bg px-2.5 py-1 text-xs font-medium text-ok">
                <Check /> Your pick
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight">
            <Link href={href} className="hover:underline">{idea.title}</Link>
          </h2>
          <p className="mt-3 text-[15px] text-muted">{idea.tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {idea.stackPreview.map((t) => (
              <li key={t} className="tag py-1 text-[11.5px]">{t}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-lg bg-paper px-4 py-3">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">Why this is a good FYP</div>
            <p className="mt-1 text-[13.5px] text-ink">{idea.whyGood}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <ScoreBar label="Difficulty" value={idea.difficulty} tone="amber" />
          <ScoreBar label="Career relevance" value={idea.careerRelevance} tone="green" />
          <ScoreBar label="Originality" value={idea.originality} tone="blue" />
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
            <Clock /> Estimated {idea.estimatedMonths} mo to MVP
          </div>
          <Link href={href} className={`${top ? "btn-dark" : "btn-light"} h-11 w-full`}>
            {top ? "View full breakdown" : "View details"} <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
