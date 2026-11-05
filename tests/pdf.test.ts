import { describe, expect, it } from "vitest";
import { buildPdf, pdfText } from "@/lib/pdf";
import { SAMPLE_IDEAS } from "@/lib/sample";

describe("pdf", () => {
  it("makes typographic text safe for the built-in font", () => {
    expect(pdfText("A → B — “C” · اردو")).toBe('A -> B - "C" -');
  });
  it("builds a valid multi-page PDF with one idea per page or more", () => {
    const ideas = SAMPLE_IDEAS.map((idea, i) => ({ idea, rank: i + 1 }));
    const doc = buildPdf(ideas, "test");
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(5);
    const out = doc.output();
    expect(out.startsWith("%PDF-")).toBe(true);
    expect(out).toContain(SAMPLE_IDEAS[0]!.title.slice(0, 20));
  });
});
