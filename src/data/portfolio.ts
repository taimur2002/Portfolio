/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT YOUR PORTFOLIO HERE
 * ─────────────────────────────────────────────────────────────
 *  This is the only file you normally need to touch. Update the
 *  values below and the whole site updates. Everything is typed,
 *  so your editor will warn you if a field is missing.
 */

export type Project = {
  title: string;
  description: string;
  /** Short tags shown as chips, e.g. ["Next.js", "Design"]. */
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

export const profile = {
  /** Shown in the header, hero, and browser tab. */
  name: "Taimur Khalid",
  /** Your role(s). Multi-disciplinary? List them, e.g. "Developer · Designer". */
  role: "Designer · Developer · Maker",
  /** One punchy line for the hero. */
  tagline: "I build thoughtful products at the intersection of design and code.",
  /** A short paragraph or two for the About section. */
  about: [
    "Hi, I'm Taimur Khalid — a multi-disciplinary creator who enjoys taking ideas from a rough sketch all the way to a polished, shipped product.",
    "I move comfortably between design and engineering, and I care most about clear thinking, clean execution, and work that actually helps people. When I'm not building, you'll find me exploring new tools and side projects.",
  ],
  /** Used for the \"Get in touch\" button and footer. */
  email: "taimurkhalid3@gmail.com",
  /** Optional: path to a CV/resume file placed in /public (e.g. \"/resume.pdf\"). Omit to hide the button. */
  resumeUrl: "",
  /** Footer location line (optional). */
  location: "Earth",
  /** Your live site URL — used for SEO (sitemap, robots, social share links). */
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
    tags: ["Next.js", "TypeScript", "UI Design"],
    href: "https://example.com",
  },
  {
    title: "Project Two",
    description:
      "Another piece of work you're proud of. Mention the outcome or impact where you can — numbers and results stand out.",
    tags: ["Branding", "Illustration"],
    href: "https://example.com",
  },
  {
    title: "Project Three",
    description:
      "Replace these placeholders with your real projects. Add or remove cards freely — the grid adapts automatically.",
    tags: ["Product", "Research"],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Design",
    items: ["UI/UX", "Figma", "Branding", "Prototyping"],
  },
  {
    category: "Engineering",
    items: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    category: "Tools & Other",
    items: ["Git", "Adobe Suite", "Notion", "Public speaking"],
  },
];
