import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing",
  description: "FYPMatch is free to use right now. No payment details needed.",
};

const FREE = ["5 ranked ideas per run", "Full idea breakdowns", "Refine with AI chat", "PDF export for your supervisor", "No signup needed"];
const PRO = ["Supervisor pitch decks", "Saved ideas across devices", "Deeper follow-up planning"];

export default function PricingPage() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <SiteHeader />
      <main className="wrap flex-1 pb-24 pt-16 sm:pt-20">
        <div className="text-center">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-[46px]">Free while we&apos;re getting started.</h1>
          <p className="mt-3 text-muted">Every current feature is free, and no payment details are needed.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-[860px] gap-6 md:grid-cols-2">
          <section className="flex flex-col rounded-2xl border-2 border-coal bg-white p-8">
            <h2 className="text-lg font-bold">Free</h2>
            <p className="mt-2 font-mono text-4xl font-medium">0 PKR</p>
            <p className="mt-1 text-sm text-muted">Available now</p>
            <ul className="mt-6 flex flex-col gap-2.5 text-sm">
              {FREE.map((f) => <li key={f} className="flex items-center gap-2"><span className="text-ok"><Check /></span> {f}</li>)}
            </ul>
            <Link href="/generate" className="btn-dark mt-8 h-[46px]">Generate my ideas <ArrowRight /></Link>
          </section>
          <section className="flex flex-col rounded-2xl border border-line bg-white p-8">
            <h2 className="text-lg font-bold">Student Pro</h2>
            <p className="mt-2 font-mono text-4xl font-medium text-muted">Soon</p>
            <p className="mt-1 text-sm text-muted">Coming soon. Not available to buy yet.</p>
            <ul className="mt-6 flex flex-col gap-2.5 text-sm text-muted">
              {PRO.map((f) => <li key={f} className="flex items-center gap-2"><Check /> {f}</li>)}
            </ul>
            <button type="button" disabled className="btn-light mt-8 h-[46px]">Coming soon</button>
          </section>
        </div>
        {email ? (
          <p className="mt-10 text-center text-sm text-muted">
            University or department? Email <a className="font-medium text-ink underline" href={`mailto:${email}`}>{email}</a>.
          </p>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
