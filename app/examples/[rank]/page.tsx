import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExportButton } from "@/components/ExportButton";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { IdeaBody, IdeaGlance, IdeaHero, IdeaMarket } from "@/components/IdeaDetail";
import { TopBar } from "@/components/Logo";
import { SAMPLE_IDEAS } from "@/lib/sample";

export const dynamicParams = false;
export function generateStaticParams() {
  return SAMPLE_IDEAS.map((_, i) => ({ rank: String(i + 1) }));
}

type Props = { params: Promise<{ rank: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rank } = await params;
  const idea = SAMPLE_IDEAS[Number(rank) - 1];
  return idea ? { title: `Sample: ${idea.title}`, description: idea.tagline } : {};
}

export default async function Page({ params }: Props) {
  const { rank } = await params;
  const idea = /^[1-5]$/.test(rank) ? SAMPLE_IDEAS[Number(rank) - 1] : undefined;
  if (!idea) notFound();
  return (
    <>
      <TopBar>
        <Link href="/examples" className="btn-light h-9 px-4 text-[13px] font-medium"><ArrowLeft /> Back to examples</Link>
      </TopBar>
      <main className="wrap flex-1 pb-20 pt-14">
        <p className="mb-5 inline-block rounded-full bg-warn-bg px-2.5 py-1 font-mono text-xs font-semibold text-warn-text">Sample output</p>
        <IdeaHero idea={idea} rank={Number(rank)} />
        <div className="mt-14 grid gap-6 lg:grid-cols-[800px_1fr] lg:gap-8">
          <IdeaBody idea={idea} />
          <aside className="flex flex-col gap-4">
            <IdeaGlance idea={idea} />
            <IdeaMarket idea={idea} />
            <Link href="/generate" className="btn-dark h-[46px] w-full">Generate ideas for me <ArrowRight /></Link>
            <ExportButton idea={idea} rank={Number(rank)} />
          </aside>
        </div>
      </main>
    </>
  );
}
