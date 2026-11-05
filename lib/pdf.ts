import { jsPDF } from "jspdf";
import type { Idea } from "./schema";

/** The built-in PDF font is Latin-only, so typographic characters are mapped and anything else dropped. */
export function pdfText(value: string): string {
  return value
    .replace(/[→➜]/g, "->")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/·/g, "-")
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/ {2,}/g, " ")
    .trim();
}

const MARGIN = 48;

class Writer {
  y = MARGIN;
  readonly doc = new jsPDF({ unit: "pt", format: "a4" });
  private readonly width = this.doc.internal.pageSize.getWidth() - MARGIN * 2;
  private readonly bottom = this.doc.internal.pageSize.getHeight() - MARGIN;

  private ensure(height: number) {
    if (this.y + height > this.bottom) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  text(value: string, size = 10.5, style: "normal" | "bold" = "normal", gray = 30, indent = 0) {
    this.doc.setFont("helvetica", style).setFontSize(size).setTextColor(gray);
    const lineHeight = size * 1.42;
    for (const line of this.doc.splitTextToSize(pdfText(value), this.width - indent) as string[]) {
      this.ensure(lineHeight);
      this.doc.text(line, MARGIN + indent, this.y + size);
      this.y += lineHeight;
    }
    this.y += 3;
  }

  heading(value: string) {
    this.ensure(44);
    this.y += 11;
    this.text(value.toUpperCase(), 8.5, "bold", 110);
  }

  bullets(items: string[]) {
    items.forEach((item, i) => this.text(`${i + 1}. ${item}`, 10.5, "normal", 30, 6));
  }

  newPage() {
    this.doc.addPage();
    this.y = MARGIN;
  }
}

function writeIdea(w: Writer, idea: Idea, rank: number) {
  w.text(`#${rank} - ${idea.label}`, 9, "bold", 110);
  w.text(idea.title, 18, "bold", 10);
  w.text(idea.tagline, 11, "normal", 90);
  w.heading("At a glance");
  w.text(`Difficulty ${idea.difficulty}/10   |   Career relevance ${idea.careerRelevance}/10   |   Originality ${idea.originality}/10`);
  w.text(`Estimated time ${idea.estimatedMonths} months   |   Team ${idea.glance.teamValue} (${idea.glance.teamNote})   |   Budget ${idea.glance.budgetValue}`);
  w.heading("Supervisor pitch");
  w.text(idea.supervisorPitch);
  w.heading("Why this is a good FYP");
  w.text(idea.whyGoodLong);
  w.heading("MVP features");
  w.bullets(idea.mvpFeatures);
  w.heading("Tech stack");
  const stack: [string, string[]][] = [
    ["Frontend", idea.techStack.frontend],
    ["Backend", idea.techStack.backend],
    ["Database", idea.techStack.database],
    ["AI / ML", idea.techStack.aiMl],
    ["Deployment", idea.techStack.deployment],
  ];
  for (const [name, items] of stack) if (items.length) w.text(`${name}: ${items.join(", ")}`);
  w.heading("Potential challenges");
  for (const c of idea.challenges) w.text(`${c.title}: ${c.mitigation}`);
  if (idea.similarProducts.length) {
    w.heading("Similar products (AI-suggested, verify before citing)");
    for (const p of idea.similarProducts) w.text(`${p.name}: ${p.note}`);
  }
  w.heading("Post-graduation potential (rough estimate)");
  w.text(`${idea.potential.headline}. ${idea.potential.details}`);
}

export function buildPdf(ideas: { idea: Idea; rank: number }[], subtitle: string): jsPDF {
  const w = new Writer();
  w.text("FYPMatch", 12, "bold", 10);
  w.text(subtitle, 9, "normal", 110);
  w.text("AI-generated suggestions. Check all facts and scope with your supervisor.", 9, "normal", 110);
  w.y += 10;
  ideas.forEach(({ idea, rank }, i) => {
    if (i > 0) w.newPage();
    writeIdea(w, idea, rank);
  });
  return w.doc;
}

export function downloadPdf(ideas: { idea: Idea; rank: number }[], subtitle: string, filename: string) {
  buildPdf(ideas, subtitle).save(filename);
}
