import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

// Route segment config
export const alt = `${profile.name} · Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0a0a0a",
          padding: 80,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #2563eb, #06b6d4)",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 600 }}>{profile.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#71717a",
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
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 120, height: 6, borderRadius: 999, background: "linear-gradient(90deg, #2563eb, #06b6d4)" }} />
          <div style={{ fontSize: 24, color: "#a1a1aa" }}>{profile.email}</div>
        </div>
      </div>
    ),
    size
  );
}
