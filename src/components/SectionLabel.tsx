/** Small uppercase eyebrow used above each section heading. */
export function SectionLabel({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
      <span className="h-px w-6 bg-linear-to-r from-accent to-accent-2" />
      <span className={dark ? "text-zinc-500" : "text-zinc-400"}>
        {children}
      </span>
    </p>
  );
}
