import type { Metadata } from "next";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { profile } from "@/data/portfolio";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-[#f4f7fc] text-zinc-900">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
