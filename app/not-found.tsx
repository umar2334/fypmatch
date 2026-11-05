import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="wrap flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">This page doesn&apos;t exist.</h1>
        <p className="mt-3 text-muted">The link may be old or mistyped.</p>
        <Link href="/" className="btn-dark mt-7 h-[46px] px-7">Back to home</Link>
      </main>
      <SiteFooter />
    </>
  );
}
