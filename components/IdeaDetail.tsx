import type { Idea } from "@/lib/schema";
import { Check } from "./icons";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="eyebrow">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const STACK_ROWS = [
  ["Frontend", "frontend"],
  ["Backend", "backend"],
  ["Database", "database"],
  ["AI / ML", "aiMl"],
  ["Deployment", "deployment"],
] as const;

export function IdeaHero({ idea, rank }: { idea: Idea; rank: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-mono text-sm font-bold text-white">#{rank}</span>
        <span className="rounded-full bg-warn-bg px-2.5 py-1 text-xs font-medium text-warn-text">{idea.label}</span>
        <span className="tag">{idea.categories.join(" · ")}</span>
      </div>
      <h1 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-[46px]">{idea.title}</h1>
      <p className="mt-4 max-w-[900px] text-lg leading-relaxed text-muted">
        {idea.tagline.replace(/\.$/, "")}. {idea.summary}
      </p>
    </div>
  );
}

export function IdeaBody({ idea }: { idea: Idea }) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Section title="Why this is a good FYP">
        <p className="text-[15px] leading-relaxed text-ink">{idea.whyGoodLong}</p>
      </Section>
      <Section title="MVP features">
        <ol className="flex flex-col gap-3">
          {idea.mvpFeatures.map((f, i) => (
            <li key={f} className="flex items-start gap-3 text-[15px] text-ink">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-soft font-mono text-xs">{i + 1}</span>
              {f}
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Tech stack">
        <dl className="flex flex-col gap-3.5">
          {STACK_ROWS.filter(([, key]) => idea.techStack[key].length > 0).map(([name, key]) => (
            <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <dt className="w-[126px] shrink-0 font-mono text-[13px] text-muted">{name}</dt>
              <dd className="flex flex-wrap gap-2">
                {idea.techStack[key].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section title="Skills you'll gain">
        <ul className="flex flex-wrap gap-2">
          {idea.skills.map((s) => (
            <li key={s} className="inline-flex items-center gap-1.5 rounded-full bg-ok-bg px-3.5 py-2 text-[13px] font-medium text-ok">
              <Check /> {s}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Potential challenges">
        <ul className="flex flex-col gap-4">
          {idea.challenges.map((c) => (
            <li key={c.title} className="flex gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warn-bg font-bold text-warn-text" aria-hidden>!</span>
              <div>
                <h3 className="text-[15px] font-semibold">{c.title}</h3>
                <p className="mt-0.5 text-[13.5px] text-muted">{c.mitigation}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Supervisor pitch (ready to use)">
        <p className="text-[15px] leading-relaxed text-ink">&ldquo;{idea.supervisorPitch}&rdquo;</p>
      </Section>
    </div>
  );
}

export function IdeaGlance({ idea }: { idea: Idea }) {
  const rows: [string, string, string][] = [
    ["Difficulty", idea.glance.difficultyNote, `${idea.difficulty} / 10`],
    ["Estimated time", "to a working MVP", `${idea.estimatedMonths} mo`],
    ["Career relevance", idea.glance.careerNote, `${idea.careerRelevance} / 10`],
    ["Originality", idea.glance.originalityNote, `${idea.originality} / 10`],
    ["Team fit", idea.glance.teamNote, idea.glance.teamValue],
    ["Budget", idea.glance.budgetNote, idea.glance.budgetValue],
  ];
  return (
    <section className="rounded-2xl bg-ink p-6 text-white">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">At a glance</h2>
      <dl className="mt-4 flex flex-col gap-3.5">
        {rows.map(([name, note, value]) => (
          <div key={name} className="flex items-center justify-between gap-4">
            <dt>
              <div className="text-[13px]">{name}</div>
              <div className="text-[11px] text-zinc-500">{note}</div>
            </dt>
            <dd className="whitespace-nowrap font-mono text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function IdeaMarket({ idea }: { idea: Idea }) {
  return (
    <>
      {idea.similarProducts.length > 0 ? (
        <section className="card p-6">
          <h2 className="eyebrow">Similar products</h2>
          <p className="mt-1 text-[11.5px] text-muted">AI-suggested. Verify before citing.</p>
          <ul className="mt-4 flex flex-col gap-4">
            {idea.similarProducts.map((p) => (
              <li key={p.name}>
                <h3 className="text-[15px] font-semibold">{p.name}</h3>
                <p className="mt-0.5 text-xs text-muted">{p.note}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="rounded-2xl border border-ok-line bg-ok-bg p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ok">Post-graduation potential</h2>
        <p className="mt-2.5 text-xl font-bold leading-snug text-ok">{idea.potential.headline}</p>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">{idea.potential.details}</p>
      </section>
    </>
  );
}
