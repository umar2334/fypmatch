"use client";
import { useState } from "react";
import type { Idea } from "@/lib/schema";

export function ExportButton({ idea, rank }: { idea: Idea; rank: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn-light h-[46px] w-full font-medium"
        onClick={async () => {
          setFailed(false);
          try {
            const { downloadPdf } = await import("@/lib/pdf");
            downloadPdf([{ idea, rank }], "Sample output", `fypmatch-sample-${rank}.pdf`);
          } catch {
            setFailed(true);
          }
        }}
      >
        Export sample PDF
      </button>
      {failed ? <p role="alert" className="text-sm text-red-600">We couldn&apos;t create the PDF. Please try again.</p> : null}
    </>
  );
}
