"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/lib/schema";
import { describeProfile } from "@/lib/schema";
import { loadResult, saveResult, type StoredResult } from "@/lib/storage";
import { ChatPanel } from "./ChatPanel";
import { ArrowLeft, ArrowRight, Check } from "./icons";
import { IdeaBody, IdeaGlance, IdeaHero, IdeaMarket } from "./IdeaDetail";
import { TopBar } from "./Logo";
import { NoResults, SampleNotice } from "./ResultsView";

export function IdeaPage({ rank }: { rank: number }) {
  const [result, setResult] = useState<StoredResult | null | undefined>(undefined);
  const [chatOpen, setChatOpen] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setResult(loadResult()), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (result === undefined) return <main className="flex-1" aria-busy="true" />;
  const index = rank - 1;
  const idea = result?.ideas[index];
  if (!result || !idea) {
    return (
      <>
        <TopBar />
        <NoResults />
      </>
    );
  }

  const update = (next: StoredResult) => {
    saveResult(next);
    setResult(next);
  };
  const chosen = result.chosenIndex === index;
  const messages: ChatMessage[] = result.chats[String(index)] ?? [];

  const exportPdf = async () => {
    setPdfError(false);
    try {
      const { downloadPdf } = await import("@/lib/pdf");
      downloadPdf([{ idea, rank }], describeProfile(result.profile), `fypmatch-idea-${rank}.pdf`);
    } catch {
      setPdfError(true);
    }
  };

  const copyPitch = async () => {
    try {
      await navigator.clipboard.writeText(idea.supervisorPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <TopBar>
        <Link href="/results" className="btn-light h-9 px-4 text-[13px] font-medium"><ArrowLeft /> Back to all ideas</Link>
      </TopBar>
      <main className="wrap flex-1 pb-20 pt-14">
        {result.sample ? <SampleNotice /> : null}
        <IdeaHero idea={idea} rank={rank} />
        <div className="mt-14 grid gap-6 lg:grid-cols-[800px_1fr] lg:gap-8">
          <IdeaBody idea={idea} />
          <aside className="flex flex-col gap-4 lg:order-none">
            <IdeaGlance idea={idea} />
            <IdeaMarket idea={idea} />
            <button
              type="button"
              aria-pressed={chosen}
              onClick={() => update({ ...result, chosenIndex: chosen ? null : index })}
              className={`${chosen ? "btn border border-ok bg-ok-bg text-ok" : "btn-dark"} h-[46px] w-full`}
            >
              {chosen ? <><Check /> This is your idea</> : <>Use this idea <ArrowRight /></>}
            </button>
            {chosen ? (
              <div className="card p-5 text-sm" role="status">
                <h2 className="font-semibold">Your next steps</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-[13.5px] text-muted">
                  <li>Share the PDF with your supervisor.</li>
                  <li>Agree the scope and any changes.</li>
                  <li>Start with MVP feature 1.</li>
                </ol>
                <button type="button" onClick={copyPitch} className="mt-3 text-[13px] font-semibold underline">
                  {copied ? "Copied" : "Copy supervisor pitch"}
                </button>
              </div>
            ) : null}
            <button type="button" onClick={() => setChatOpen(true)} className="btn-light h-[46px] w-full font-medium">Refine with AI chat</button>
            <button type="button" onClick={exportPdf} className="btn-light h-[46px] w-full font-medium">Export PDF for supervisor</button>
            {pdfError ? <p role="alert" className="text-sm text-red-600">We couldn&apos;t create the PDF. Please try again.</p> : null}
          </aside>
        </div>
      </main>
      {chatOpen ? (
        <ChatPanel
          idea={idea}
          messages={messages}
          onClose={closeChat}
          onMessages={(next) => {
            // Reads the latest saved copy, because a reply can arrive after other updates.
            const latest = loadResult() ?? result;
            update({ ...latest, chats: { ...latest.chats, [String(index)]: next } });
          }}
        />
      ) : null}
    </>
  );
}
