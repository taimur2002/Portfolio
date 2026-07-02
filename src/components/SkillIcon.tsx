import Image from "next/image";
import {
  siPython,
  siTypescript,
  siJavascript,
  siCplusplus,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siHtml5,
  siCss,
  siFastapi,
  siNodedotjs,
  siExpress,
  siPostgresql,
  siVercel,
  siGit,
  siGithub,
  siClaude,
  siSentry,
  siCursor,
  type SimpleIcon,
} from "simple-icons";
import {
  Database,
  Webhook,
  Radio,
  BrainCircuit,
  Mic,
  Volume2,
  Sparkles,
  Bot,
  type LucideIcon,
} from "lucide-react";

/** Official brand logos (simple-icons), rendered in each brand's color. */
const BRAND_ICONS: Record<string, SimpleIcon> = {
  Python: siPython,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "C/C++": siCplusplus,
  "Next.js": siNextdotjs,
  React: siReact,
  "Tailwind CSS": siTailwindcss,
  HTML: siHtml5,
  CSS: siCss,
  FastAPI: siFastapi,
  "Node.js": siNodedotjs,
  "Express.js": siExpress,
  PostgreSQL: siPostgresql,
  Vercel: siVercel,
  Git: siGit,
  GitHub: siGithub,
  "Claude Code": siClaude,
  Sentry: siSentry,
  Cursor: siCursor,
};

/**
 * Meaningful icons for concepts / brands without a logo in simple-icons.
 * Each gets its own distinct color so the grid reads as varied, not one-note.
 */
const CONCEPT_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  SQL: { icon: Database, color: "#2563eb" }, // blue
  "REST APIs": { icon: Webhook, color: "#7c3aed" }, // violet
  WebSockets: { icon: Radio, color: "#f97316" }, // orange
  "LLM Integration": { icon: BrainCircuit, color: "#c026d3" }, // fuchsia
  "Speech to Text": { icon: Mic, color: "#16a34a" }, // green
  "Text to Speech": { icon: Volume2, color: "#ca8a04" }, // gold
  "Prompt Engineering": { icon: Sparkles, color: "#0d9488" }, // teal
  "Conversational AI": { icon: Bot, color: "#4f46e5" }, // indigo
};

/** Skills rendered from a real image asset in /public (official app icons). */
const IMAGE_ICONS: Record<string, string> = {
  LiveKit: "/companies/livekit.png",
  Twilio: "/companies/twilio.jpg",
};

export function SkillIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const image = IMAGE_ICONS[name];
  if (image) {
    return (
      <Image
        src={image}
        alt={`${name} logo`}
        width={32}
        height={32}
        unoptimized
        className={`${className} rounded-md object-cover`}
      />
    );
  }

  const brand = BRAND_ICONS[name];
  if (brand) {
    // Some brand colors are near-white (e.g. LiveKit = #FFFFFF) and vanish on a
    // light background — render those in near-black so the mark stays visible.
    const r = parseInt(brand.hex.slice(0, 2), 16);
    const g = parseInt(brand.hex.slice(2, 4), 16);
    const b = parseInt(brand.hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const fill = luminance > 0.9 ? "#18181b" : `#${brand.hex}`;
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        className={className}
        fill={fill}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const concept = CONCEPT_ICONS[name];
  if (concept) {
    const Icon = concept.icon;
    return (
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={className}
        style={{ color: concept.color }}
      />
    );
  }

  // Last-resort fallback for any unmapped skill.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${className} text-zinc-400`}
    >
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3" />
    </svg>
  );
}
