import Link from "next/link";
import { ArrowRight } from "./icons";
import { TopBar } from "./Logo";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/examples", label: "Examples" },
];

export function SiteHeader() {
  return (
    <TopBar
      center={
        <nav aria-label="Main" className="order-3 flex w-full justify-center gap-7 text-sm text-ink sm:order-none sm:w-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-muted">
              {n.label}
            </Link>
          ))}
        </nav>
      }
    >
      <Link href="/generate" className="btn-dark h-9 px-4 text-[13px]">
        Get my ideas <ArrowRight />
      </Link>
    </TopBar>
  );
}

export function SiteFooter() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <footer className="mt-auto bg-coal print:hidden">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-9 text-[13px] text-zinc-500">
        <div>FYPMatch &nbsp;·&nbsp; © {new Date().getFullYear()}</div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
          {email ? <a href={`mailto:${email}`} className="font-mono text-zinc-300 hover:text-white">{email}</a> : null}
        </div>
      </div>
    </footer>
  );
}
