/** Small uppercase eyebrow used above each section heading. */
export function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
      <span className="h-px w-6 bg-linear-to-r from-accent to-accent-2" />
      <span className="text-zinc-400">
        {children}
      </span>
    </p>
  );
}
