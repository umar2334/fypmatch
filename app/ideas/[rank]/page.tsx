import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaPage } from "@/components/IdeaPage";

export const metadata: Metadata = { title: "Idea breakdown", robots: { index: false } };

// Only ranks 1-5 exist. Anything else is a real 404 at the routing level.
export const dynamicParams = false;
export function generateStaticParams() {
  return ["1", "2", "3", "4", "5"].map((rank) => ({ rank }));
}

export default async function Page({ params }: { params: Promise<{ rank: string }> }) {
  const { rank } = await params;
  if (!/^[1-5]$/.test(rank)) notFound();
  return <IdeaPage rank={Number(rank)} />;
}
