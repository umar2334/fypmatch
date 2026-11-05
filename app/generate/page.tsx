import type { Metadata } from "next";
import { Wizard } from "@/components/Wizard";

export const metadata: Metadata = {
  title: "Generate FYP ideas",
  description: "Answer a few questions and get 5 ranked final year project ideas matched to your skills and timeline.",
};

export default function GeneratePage() {
  return <Wizard />;
}
