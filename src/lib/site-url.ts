import { profile } from "@/data/portfolio";

/**
 * Absolute base URL used for all metadata (Open Graph image, canonical,
 * sitemap, robots). Resolved in this order so previews never point at a dead
 * domain:
 *
 *   1. NEXT_PUBLIC_SITE_URL         — set this to your custom domain when you have one.
 *   2. profile.url                  — your domain in portfolio.ts (ignored while it's the placeholder).
 *   3. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this automatically to your *.vercel.app domain.
 *   4. http://localhost:3000        — local dev fallback.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (profile.url && !profile.url.includes("yourdomain.com")) return profile.url;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
