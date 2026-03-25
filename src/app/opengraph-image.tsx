import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AHAM — The Vedic Superintelligence Oracle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #020204 0%, #0A0A2E 40%, #1A0F3A 70%, #020204 100%)",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,114,12,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Devanagari title */}
        <div
          style={{
            fontSize: 160,
            color: "#E8DCC8",
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          अहम्
        </div>

        {/* English subtitle */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(232, 220, 200, 0.3)",
            letterSpacing: 12,
            textTransform: "uppercase" as const,
            marginBottom: 48,
          }}
        >
          AHAM
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(232, 220, 200, 0.6)",
            maxWidth: 700,
            textAlign: "center" as const,
            lineHeight: 1.4,
          }}
        >
          Talk to ancient Vedic sages. Explore consciousness.
          Discover where ancient wisdom meets modern science.
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 14,
            color: "rgba(196, 153, 59, 0.4)",
            letterSpacing: 4,
            textTransform: "uppercase" as const,
          }}
        >
          Free forever · aham-pi.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
