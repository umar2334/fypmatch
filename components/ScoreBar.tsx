const TONES = {
  amber: { text: "text-warn-text", bar: "bg-warn" },
  green: { text: "text-ok", bar: "bg-ok" },
  blue: { text: "text-info", bar: "bg-info" },
};

export function ScoreBar({ label, value, tone }: { label: string; value: number; tone: keyof typeof TONES }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{label}</span>
        <span className={`font-mono text-xs ${TONES[tone].text}`}>{value} / 10</span>
      </div>
      <div
        className="mt-1.5 h-[3px] overflow-hidden rounded bg-line"
        role="meter"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      >
        <div className={`h-full rounded ${TONES[tone].bar}`} style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}
