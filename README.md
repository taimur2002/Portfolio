# Portfolio

A clean, minimal personal portfolio built with [Next.js](https://nextjs.org) (App Router) and [Tailwind CSS](https://tailwindcss.com).

## Getting started

```bash
npm install   # first time only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Editing your content

**You only need to edit one file:** [`src/data/portfolio.ts`](src/data/portfolio.ts).

It controls everything on the site:

- `profile` — your name, role, tagline, about text, email, phone, location, and an optional résumé link
- `socials` — your GitHub / LinkedIn links (rendered as icons in the footer)
- `techStack` — the tools shown in the scrolling marquee under the hero
- `stats` — the animated count-up figures
- `experience` — your work-history timeline (supports an optional company `logo`)
- `education` — your education entries
- `skillGroups` — the grouped skill chips in the Skills section

Save the file and the page updates instantly while `npm run dev` is running.

### Adding a résumé

Drop a PDF into the `public/` folder (e.g. `public/resume.pdf`) and set
`resumeUrl: "/resume.pdf"` in `src/data/portfolio.ts`. A download button appears
automatically in the Skills section.

### Company logos

Drop a company logo in `public/companies/` (e.g. `public/companies/acme.svg`) and
set `logo: "/companies/acme.svg"` on an `experience` entry. Entries without a
`logo` fall back to a clean monogram of the company name.

### SEO

Set `url` in `profile` to your real domain (e.g. `https://janedoe.dev`). It powers
the sitemap, robots.txt, the favicon, and the auto-generated social share image
(`src/app/opengraph-image.tsx`).

## Project structure

```
src/
  app/
    layout.tsx      Root layout + page metadata
    page.tsx        Assembles the sections
    globals.css     Theme tokens + base styles
  components/       Header, Hero, TechMarquee, About, Stats,
                    Experience, Education, Skills, Footer
  lib/
    site-url.ts     Resolves the site URL for SEO/metadata
  data/
    portfolio.ts    ← your content lives here
```

## Useful commands

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Production build                   |
| `npm run start`     | Serve the production build         |
| `npm run lint`      | Lint the code                      |
| `npm run typecheck` | Check types without building       |

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com/new) — it
detects Next.js automatically and deploys with zero config.
