import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { ResumeBanner } from "@/components/ResumeBanner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

const FACTS = [
  ["5", "Ranked ideas per run"],
  ["3", "Quick steps"],
  ["0 PKR", "Free to try"],
];

const STEPS = [
  ["01", "Tell us about you", "Major, interests, skills, team size, and timeline. Less than a minute."],
  ["02", "AI matches your profile", "Gemini weighs each idea against your skills, timeline, team and career goal."],
  ["03", "Get 5 ranked ideas", "Each with tech stack, MVP features, supervisor pitch, and post-graduation potential."],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap flex flex-col items-center pb-24 pt-16 text-center sm:pt-[110px]">
          <ResumeBanner />
          <p className="inline-flex items-center gap-2 rounded-full bg-soft/70 px-3 py-1 text-xs font-semibold tracking-wide text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" /> For final year students at Pakistani universities.
          </p>
          <h1 className="mt-8 text-[40px] font-extrabold leading-[1.2] tracking-[-0.025em] sm:text-6xl lg:text-[72px] lg:leading-[1.42]">
            Stop staring at a blank page.
            <br />
            Get 5 FYP ideas in{" "}
            <span className="my-1 inline-block rounded-xl bg-ink px-4 py-0.5 align-middle font-mono text-[0.86em] font-semibold tracking-normal text-white lg:leading-[1.3]">
              30 seconds.
            </span>
          </h1>
          <p className="mt-7 max-w-[760px] text-lg leading-[1.65] text-muted sm:text-xl">
            Tell us your major, interests, skills. We&apos;ll generate 5 ranked, supervisor-ready FYP ideas tailored for Pakistani
            universities, with full tech stack, timelines, and career relevance scores.
          </p>
          <div className="mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <Link href="/generate" className="btn-dark h-[55px] px-8 text-base">
              Generate my ideas, free <ArrowRight />
            </Link>
            <Link href="/examples" className="btn-light h-[55px] px-8 text-base font-medium">
              See example output
            </Link>
          </div>
          <p className="mt-8 text-[13px] text-muted">No signup needed &nbsp;·&nbsp; Free to try &nbsp;·&nbsp; All departments welcome</p>
          <dl className="mt-11 flex flex-wrap justify-center gap-x-14 gap-y-6">
            {FACTS.map(([value, label]) => (
              <div key={label}>
                <dd className="font-mono text-[28px] font-medium">{value}</dd>
                <dt className="mt-1 text-xs text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </section>
        <section id="how-it-works" className="scroll-mt-4 bg-white py-20">
          <div className="wrap text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-9 text-4xl font-extrabold tracking-tight sm:text-[44px]">3 inputs. 30 seconds. Done.</h2>
            <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
              {STEPS.map(([number, title, text]) => (
                <div key={number} className="rounded-2xl border border-line bg-paper p-8">
                  <div className="font-mono text-2xl font-medium text-muted">{number}</div>
                  <h3 className="mt-3 text-[22px] font-bold tracking-tight">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
