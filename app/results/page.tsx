import type { Metadata } from "next";
import { ResultsView } from "@/components/ResultsView";

export const metadata: Metadata = { title: "Your FYP ideas", robots: { index: false } };

export default function ResultsPage() {
  return <ResultsView />;
}
