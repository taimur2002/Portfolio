/**
 * EDIT YOUR PORTFOLIO HERE
 *
 * This is the only file you normally need to touch. Update the
 * values below and the whole site updates. Everything is typed,
 * so your editor will warn you if a field is missing.
 */

export type Project = {
  title: string;
  description: string;
  /** Short tags shown as chips, e.g. ["Next.js", "FastAPI"]. */
  tags: string[];
  /** Optional external link (live site, repo, case study). Omit to hide the link. */
  href?: string;
  /**
   * Optional thumbnail. Drop the file in `public/projects/` and reference it as
   * "/projects/my-shot.jpg". If omitted, a branded gradient placeholder is shown.
   */
  image?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type Stat = {
  /** The number to count up to. */
  value: number;
  /** Optional suffix shown after the number, e.g. "+" or "%". */
  suffix?: string;
  label: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  /** e.g. "2024 to Present" (kept dash-free). */
  period: string;
  description: string;
};

export const profile = {
  /** Shown in the header, hero, and browser tab. */
  name: "Taimur Khalid",
  /** Your role / title, shown in the hero and header. */
  role: "AI Voice & Full-Stack Developer",
  /** One punchy line for the hero. */
  tagline: "I build AI voice agents and full-stack web apps.",
  /** A short paragraph or two for the About section. */
  about: [
    "Hi, I'm Taimur Khalid, a developer who enjoys taking ideas from a rough concept all the way to a polished, shipped product.",
    "I work across the full stack, from Python and FastAPI backends to Next.js frontends, with a focus on AI voice agents. I care most about clear thinking, clean execution, and software that actually helps people. When I'm not building, you'll find me exploring new tools and side projects.",
  ],
  /** Used for the \"Get in touch\" button and footer. */
  email: "taimurkhalid3@gmail.com",
  /** Optional: path to a CV/resume file placed in /public (e.g. \"/resume.pdf\"). Omit to hide the button. */
  resumeUrl: "",
  /** Footer location line (optional). */
  location: "Lahore, Pakistan",
  /** Your live site URL, used for SEO (sitemap, robots, social share links). */
  url: "https://yourdomain.com",
};

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/yourusername" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
  { label: "Twitter / X", href: "https://x.com/yourusername" },
];

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A short description of what this project is, the problem it solved, and your role in it. Keep it to a sentence or two.",
    tags: ["Next.js", "TypeScript", "FastAPI"],
    href: "https://example.com",
  },
  {
    title: "Project Two",
    description:
      "Another piece of work you're proud of. Mention the outcome or impact where you can. Numbers and results stand out.",
    tags: ["Python", "LiveKit", "AI Voice"],
    href: "https://example.com",
  },
  {
    title: "Project Three",
    description:
      "Replace these placeholders with your real projects. Add or remove cards freely. The grid adapts automatically.",
    tags: ["React", "WebSockets"],
  },
];

/**
 * Flat list of tools/technologies shown in the scrolling marquee under the hero.
 * Order doesn't matter; it loops infinitely. Add/remove freely.
 */
export const techStack: string[] = [
  // Your core stack
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "LiveKit",
  "Twilio",
  "LLM",
  "STT",
  "TTS",
  "Vercel",
  "Sentry",
  "JavaScript",
  "HTML",
  "CSS",
  // Common industry tools
  "React",
  "Node.js",
  "REST APIs",
  "WebSockets",
  "Tailwind CSS",
  "SQL",
  "PostgreSQL",
  "Docker",
  "Git",
  "GitHub",
  "Claude Code",
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    category: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Backend & APIs",
    items: ["FastAPI", "Node.js", "REST APIs", "WebSockets", "PostgreSQL"],
  },
  {
    category: "AI / Voice",
    items: [
      "LiveKit",
      "Twilio",
      "LLM Integration",
      "STT (Speech to Text)",
      "TTS (Text to Speech)",
    ],
  },
  {
    category: "DevOps & Tools",
    items: ["Vercel", "Docker", "Git", "GitHub", "Claude Code", "Sentry"],
  },
];

/**
 * Animated count-up figures. Set these to your real numbers.
 * `value` is the target the number animates to; `suffix` is appended after it.
 */
export const stats: Stat[] = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Projects Built" },
  { value: 20, suffix: "+", label: "Technologies" },
  { value: 100, suffix: "%", label: "Commitment" },
];

/**
 * Work history shown as a timeline. Newest first.
 * Copy a block to add another role.
 */
export const experience: ExperienceItem[] = [
  {
    role: "AI Voice & Full-Stack Developer",
    company: "Company Name",
    period: "2024 to Present",
    description:
      "Building production AI voice agents with LiveKit and Twilio SIP trunking, wiring LLMs to real-time STT/TTS, and shipping full-stack features across FastAPI backends and Next.js frontends.",
  },
];
