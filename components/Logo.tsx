import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="FYPMatch home">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">F</span>
      <span className="text-lg font-bold tracking-tight text-coal">FYPMatch</span>
    </Link>
  );
}

export function TopBar({ children, center }: { children?: React.ReactNode; center?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-paper print:hidden">
      <div className="wrap flex min-h-[72px] flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <Logo />
        {center}
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
