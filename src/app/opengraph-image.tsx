import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

// Route segment config
export const alt = `${profile.name} · Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Match the site theme (globals.css): light mint background, teal→cyan accents.
const ACCENT = "#10b981";
const ACCENT_3 = "#06b6d4";
const INK = "#0a0a0a";

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
            "linear-gradient(135deg, #f2faf6 0%, #e8f7f0 55%, #e2f4f6 100%)",
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
              color: "#52525b",
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
          <div style={{ fontSize: 24, color: "#52525b" }}>{profile.email}</div>
        </div>
      </div>
    ),
    size,
  );
}
