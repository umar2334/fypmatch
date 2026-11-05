import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { IdeaCard } from "@/components/IdeaCard";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { describeProfile } from "@/lib/schema";
import { SAMPLE_IDEAS, SAMPLE_PROFILE } from "@/lib/sample";

export const metadata: Metadata = {
  title: "Example FYP ideas",
  description: "See a sample of what FYPMatch produces: 5 ranked final year project ideas with scores, tech stacks and supervisor pitches.",
};

export default function ExamplesPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap flex-1 pb-20 pt-14">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="rounded-full bg-warn-bg px-2.5 py-1 font-semibold text-warn-text">Sample output</span>
          <span>{describeProfile(SAMPLE_PROFILE)}</span>
        </div>
        <h1 className="mt-4 text-[32px] font-extrabold tracking-tight sm:text-[38px]">What 5 matched ideas look like.</h1>
        <p className="mt-3 max-w-[720px] text-muted">This is a written example for a made-up student, to show the format. Your own results depend on your answers.</p>
        <div className="mt-10 flex flex-col gap-4">
          {SAMPLE_IDEAS.map((idea, i) => (
            <IdeaCard key={idea.title} idea={idea} rank={i + 1} href={`/examples/${i + 1}`} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready for yours?</h2>
          <Link href="/generate" className="btn-dark mt-6 h-[50px] px-8">Generate my ideas, free <ArrowRight /></Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
