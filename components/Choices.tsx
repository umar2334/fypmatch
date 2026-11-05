import { Check } from "./icons";

export function Label({ children, id }: { children: React.ReactNode; id?: string }) {
  return <div id={id} className="mb-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-ink">{children}</div>;
}

interface PillsProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  tone?: "dark" | "blue";
}

export function SinglePills<T extends string>({ label, options, value, onChange, tone = "dark" }: PillsProps<T>) {
  const active = tone === "dark" ? "border-ink bg-ink text-white hover:border-ink" : "border-info-line bg-info-bg text-info hover:border-info-line";
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(o)} className={`pill h-9 px-4 ${o === value ? active : ""}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function MultiPills<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
            className={`pill inline-flex h-8 items-center gap-1.5 px-3.5 text-[13px] ${on ? "border-ok bg-ok-bg text-ok hover:border-ok" : ""}`}
          >
            {on ? <Check className="h-3 w-3" /> : null}
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full rounded-xl bg-soft p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={`h-10 rounded-lg px-4 text-sm sm:px-8 ${o === value ? "bg-white font-semibold text-ink" : "text-muted hover:text-ink"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Boxes<T extends number>({ label, options, value, onChange, format, mono }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void; format?: (v: T) => string; mono?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={`rounded-lg border font-mono transition-colors ${mono ? "h-[41px] px-4 text-[13px]" : "h-12 w-[60px] text-base"} ${o === value ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-zinc-400"}`}
        >
          {format ? format(o) : o}
        </button>
      ))}
    </div>
  );
}
