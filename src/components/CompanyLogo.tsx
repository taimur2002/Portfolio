"use client";

import Image from "next/image";
import { useState } from "react";

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
  // If the image path is set but the file is missing/misnamed, fall back to the
  // monogram instead of showing a broken image.
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logo) && !failed;

  // Deliberately a white tile: most company marks are dark and would be
  // unreadable directly on the dark canvas.
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white shadow-sm">
      {showImage ? (
        <Image
          src={logo as string}
          alt={`${name} logo`}
          width={30}
          height={30}
          unoptimized
          onError={() => setFailed(true)}
          className="h-8 w-8 object-contain"
        />
      ) : (
        <span className="font-display text-sm font-bold text-accent">
          {monogram(name)}
        </span>
      )}
    </span>
  );
}
