"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadDraft, loadResult } from "@/lib/storage";

/** Offers a way back to saved progress. Reads storage after mount to avoid a hydration mismatch. */
export function ResumeBanner() {
  const [target, setTarget] = useState<{ href: string; label: string } | null>(null);

  useEffect(() => {
    if (loadDraft()) setTarget({ href: "/generate", label: "Continue your saved answers" });
    else if (loadResult()) setTarget({ href: "/results", label: "View your last 5 ideas" });
  }, []);

  if (!target) return null;
  return (
    <Link href={target.href} className="mb-6 rounded-full border border-ok-line bg-ok-bg px-4 py-1.5 text-[13px] font-medium text-ok hover:underline">
      {target.label} →
    </Link>
  );
}
