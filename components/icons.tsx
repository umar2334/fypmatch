type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", "aria-hidden": true } as const;

export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
export const Check = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg {...base} className={className}><path d="M5 13l4 4L19 7" /></svg>
);
export const Close = ({ className = "h-3 w-3" }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Clock = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></svg>
);
export const Download = ({ className = "h-4 w-4" }: P) => (
  <svg {...base} className={className}><path d="M12 3v12M7 11l5 5 5-5M4 20h16" /></svg>
);
