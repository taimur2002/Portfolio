/** Accent gradient-clipped text. Uses Tailwind utilities so it works reliably in dev + prod. */
export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-linear-to-r from-accent via-accent-2 to-accent-3 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
