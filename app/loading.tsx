export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center py-32" aria-busy="true" aria-label="Loading">
      <div className="h-1 w-48 overflow-hidden rounded bg-line">
        <div className="h-full w-1/3 animate-slide rounded bg-ink" />
      </div>
    </main>
  );
}
