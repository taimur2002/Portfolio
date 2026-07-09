import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

// Route segment config
export const alt = `${profile.name} · Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Match the site theme (globals.css): dark canvas, teal→cyan accents.
const ACCENT = "#10b981";
const ACCENT_3 = "#06b6d4";
const INK = "#e4e4e7";
const MUTED = "#a1a1aa";

/** Branded social share image used for link previews (Open Graph + Twitter). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #070b0a 0%, #0b1512 55%, #08161a 100%)",
          padding: 80,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_3})`,
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>
            {profile.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {profile.role}
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 940,
              color: INK,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 120,
              height: 6,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_3})`,
            }}
          />
          <div style={{ fontSize: 24, color: MUTED }}>{profile.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
