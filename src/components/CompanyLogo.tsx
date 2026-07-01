import Image from "next/image";

/** "ETL Online" -> "ETL", "Convoi AI" -> "CA". Used when no logo image is set. */
function monogram(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0] ?? "";
  if (first.length <= 4 && first === first.toUpperCase()) return first;
  return words
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export function CompanyLogo({
  name,
  logo,
}: {
  name: string;
  logo?: string;
}) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          width={30}
          height={30}
          unoptimized
          className="h-7 w-auto object-contain"
        />
      ) : (
        <span className="font-display text-sm font-bold text-accent">
          {monogram(name)}
        </span>
      )}
    </span>
  );
}
