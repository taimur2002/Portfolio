/**
 * EDIT YOUR PORTFOLIO HERE
 *
 * This is the only file you normally need to touch. Update the
 * values below and the whole site updates. Everything is typed,
 * so your editor will warn you if a field is missing.
 */

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
  /** Optional company logo path in /public (e.g. "/companies/acme.svg"). Falls back to a monogram. */
  logo?: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  /** Optional school logo path in /public (e.g. "/schools/itu.png"). Falls back to a monogram. */
  logo?: string;
};

export type Project = {
  title: string;
  /** Short context tag, e.g. "Convoi AI" or "Personal project". */
  tag?: string;
  description: string;
  tech: string[];
  /** Optional public link (live site / repo). Omit for internal tools with no public URL. */
  link?: string;
  /** Link button label, e.g. "Live site" or "GitHub". Defaults to "Visit". */
  linkLabel?: string;
  /** Optional screenshot in /public (e.g. "/projects/convoi-cms.png"). Use dummy/blurred data only. */
  image?: string;
};

export const profile = {
  /** Shown in the header, hero, and browser tab. */
  name: "Taimur Khalid",
  /** Your role / title, shown in the hero and header. */
  role: "Full-Stack Software Engineer",
  /** One punchy line for the hero. */
  tagline: "I build reliable software, from idea to production.",
  /** A short paragraph or two for the About section. */
  about: [
    "I'm a Full-Stack Software Engineer at Convoi AI, where I build voice AI agents that hold real conversations. My work spans the full pipeline: training and tuning LLM-based conversational agents, integrating Speech-to-Text and Text-to-Speech systems, and building real-time voice infrastructure with LiveKit.",
    "On the product side I build backend services with Python and FastAPI and frontends with Next.js, working directly with clients to turn their requirements into production-ready deployments. I care about what actually makes voice AI work in production: low latency, grounding so the agent never invents a price or fact, natural dialect handling, and tool calling that holds up in front of real customers.",
    "Right now I'm exploring multi-agent orchestration, evaluation frameworks for voice AI, and techniques for building more reliable, scalable conversational systems.",
  ],
  /** Used for the \"Get in touch\" button and footer. */
  email: "taimurkhalid3@gmail.com",
  /** Phone number shown in the contact section as a tel: link. Leave "" to hide. */
  phone: "+923054658619",
  /** Optional: path to a CV/resume file placed in /public (e.g. \"/resume.pdf\"). Omit to hide the button. */
  resumeUrl: "/Taimur-Khalid-CV.pdf",
  /** Footer location line (optional). */
  location: "Lahore, Pakistan",
  /**
   * Your live site URL, used for SEO + social share previews.
   * Set this to your real domain (e.g. "https://taimur.vercel.app"). While it's
   * left as the placeholder, the site auto-detects your Vercel domain on deploy.
   */
  url: "https://portfolio-taimur.vercel.app",
};

/** Roles that cycle in the hero eyebrow (animated flip). */
export const roles: string[] = [
  "Full-Stack Engineer",
  "Voice AI Engineer",
  "Next.js Developer",
  "Python Developer",
];

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/taimur2002" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/taimur-khalid",
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
  "Speech to Text",
  "Text to Speech",
  "Vercel",
  "Sentry",
  "JavaScript",
  "HTML",
  "CSS",
  // Common industry tools
  "React",
  "Node.js",
  "Express.js",
  "REST APIs",
  "WebSockets",
  "Tailwind CSS",
  "SQL",
  "PostgreSQL",
  "Git",
  "GitHub",
  "Claude Code",
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C/C++", "SQL"],
  },
  {
    category: "Frontend",
    items: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "HTML",
      "CSS",
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST APIs",
      "WebSockets",
      "Stripe",
      "PostgreSQL",
    ],
  },
  {
    category: "AI / Voice",
    items: [
      "LiveKit",
      "Twilio",
      "LLM Integration",
      "Speech to Text",
      "Text to Speech",
      "Prompt Engineering",
      "Conversational AI",
    ],
  },
  {
    category: "DevOps & Tools",
    items: ["GitHub", "Git", "Sentry", "Cursor", "Claude Code", "Vercel"],
  },
];

/**
 * Animated count-up figures. Set these to your real numbers.
 * `value` is the target the number animates to; `suffix` is appended after it.
 */
export const stats: Stat[] = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Technologies" },
  { value: 50, suffix: "k+", label: "Conversations Handled" },
  { value: 10, suffix: "k+", label: "Users Served" },
];

/**
 * Work history shown as a timeline. Newest first.
 * Copy a block to add another role.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Software Engineer",
    company: "Convoi AI",
    logo: "/companies/convoi.svg",
    period: "Aug 2025 to Present",
    description:
      "Building full-stack voice AI systems with Next.js frontends and Python/FastAPI backends. I develop LLM-based conversational agents with real-time Speech-to-Text and Text-to-Speech pipelines, and live voice infrastructure on LiveKit for streaming, turn-taking, and orchestration. Shipped a production voice agent for Invygo, a UAE car rental platform, with multilingual Arabic and English booking and payment flows, and built agents for enterprise clients across KSA, UAE, and Germany, including Pepsi (Aquafina) and Dubai healthcare providers.",
  },
  {
    role: "Software Engineer Intern",
    company: "ETL Online",
    logo: "/companies/etl.png",
    period: "Apr 2025 to Jun 2025",
    description:
      "Built and maintained Next.js frontend pages for ETL Online's community platform, Pakistan's largest non-profit tech community, and developed Node.js and Express REST APIs powering its features. Contributed to a live product used by 2,300+ members across Pakistan.",
  },
];

/**
 * Selected projects shown as cards. Newest / most important first.
 *
 * Showing employer or client work? Keep it safe:
 *  - Never put real customer data in a screenshot (blur it, or use dummy data).
 *  - For internal tools, omit `link` (they sit behind auth anyway).
 *  - To add a screenshot: drop the image in /public/projects/ and set `image`.
 *
 * Copy a block to add another project (Convoi website, dashboard, HRM, ...).
 */
export const projects: Project[] = [
  {
    title: "Convoi AI Voice Platform",
    tag: "Convoi AI",
    description:
      "Convoi AI is a production platform where teams build, launch, and monitor AI phone agents that make and take real calls. I build the Next.js dashboard and the Python/FastAPI services behind it: campaign orchestration, live transcription over LiveKit, call analytics, knowledge bases, phone number provisioning, and Stripe billing, on PostgreSQL.",
    tech: [
      "Next.js",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Python",
      "FastAPI",
      "LiveKit",
      "Stripe",
      "PostgreSQL",
    ],
    link: "https://go.convoi.ai",
    linkLabel: "Live site",
    image: "/projects/convoi-dashboard.png",
  },
  {
    title: "Convoi AI Admin CMS",
    tag: "Convoi AI",
    description:
      "The internal admin platform behind Convoi AI. I built it to manage client accounts and subscriptions, billing and credits, voice providers, API keys, and model configuration, with role-based access control (users, roles, and permissions), call analytics with failed-call handling, number requests, and system logs.",
    tech: [
      "Next.js",
      "TypeScript",
      "Zustand",
      "TanStack Query",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    // Internal tool, so no public link.
    image: "/projects/convoi-cms.png",
  },
  {
    title: "Convoi AI Website & Developer Docs",
    tag: "Convoi AI",
    description:
      "The marketing site and developer documentation for Convoi AI. I built it around a demo call that runs in the browser: rather than describing what the agent sounds like, the homepage lets you press a button and talk to it over WebRTC through LiveKit. The rest is content-driven, with one set of route templates rendering every doc page, case study, solution, and knowledge-base article from typed config, so adding content never means adding a component. The developer docs render an interactive API reference straight from the OpenAPI spec.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "LiveKit",
      "Scalar",
      "Framer Motion",
      "Lenis",
      "Zod",
    ],
    link: "https://convoi.ai/",
    linkLabel: "Live site",
    image: "/projects/convoi-website.png",
  },
];

/** Education, newest first. */
export const education: EducationItem[] = [
  {
    school: "Information Technology University",
    degree: "BS in Computer Science",
    period: "2020 to 2024",
    logo: "/schools/itu.png",
  },
];
