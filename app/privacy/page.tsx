import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Privacy", description: "How FYPMatch handles your answers." };

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy</h1>
        <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-ink">
          <section>
            <h2 className="mb-1 font-bold">No account needed</h2>
            <p>FYPMatch doesn&apos;t ask for your name, email or password.</p>
          </section>
          <section>
            <h2 className="mb-1 font-bold">Where your data is stored</h2>
            <p>Your answers, ideas and chats are saved in your own browser. Clearing your browser data removes them. The server may briefly keep a generated result in memory, so identical requests can be answered faster.</p>
          </section>
          <section>
            <h2 className="mb-1 font-bold">The AI provider</h2>
            <p>To generate ideas and chat replies, your answers and messages are sent to Google&apos;s Gemini API. Depending on the plan in use, Google may use this data to improve its products. Please don&apos;t enter personal or confidential information.</p>
          </section>
          <section>
            <h2 className="mb-1 font-bold">AI-generated content</h2>
            <p>Ideas, scores and estimates are AI suggestions and can be wrong. Check facts and scope with your supervisor before relying on them.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
