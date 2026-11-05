"use client";
import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="wrap flex flex-1 flex-col items-center justify-center py-28 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Something went wrong.</h1>
      <p className="mt-3 text-muted">Your saved answers are still in this browser.</p>
      <div className="mt-7 flex gap-3">
        <button type="button" onClick={reset} className="btn-dark h-[46px] px-7">Try again</button>
        <Link href="/" className="btn-light h-[46px] px-7 font-medium">Home</Link>
      </div>
    </main>
  );
}
