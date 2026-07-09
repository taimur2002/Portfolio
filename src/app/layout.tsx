import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { profile } from "@/data/portfolio";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/**
 * Inter is the whole type system: body copy and headings alike, separated by
 * weight and tracking rather than by a second typeface.
 *
 * Self-hosted and preloaded from our own origin. Loading it with a CSS @import
 * used to render-block for ~1s on a chain of three round trips.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · Portfolio`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  openGraph: {
    type: "website",
    title: `${profile.name} · Portfolio`,
    description: profile.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-canvas text-zinc-100">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
