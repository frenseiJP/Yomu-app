import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Frensei — AI Japanese Learning Coach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e1b4b 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #2a5caa, #5eb3d6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            文
          </div>
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.02em" }}>Frensei</span>
        </div>
        <p
          style={{
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.25,
            maxWidth: 900,
            margin: 0,
          }}
        >
          Stop sounding like a textbook.
          <br />
          Start sounding natural.
        </p>
        <p style={{ fontSize: 26, color: "#cbd5e1", marginTop: 28, maxWidth: 820 }}>
          AI Japanese coach for nuance, politeness, and real conversation.
        </p>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
          }}
        >
          <span
            style={{
              background: "rgba(236,72,153,0.2)",
              border: "1px solid rgba(236,72,153,0.45)",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 20,
            }}
          >
            Try 3 free messages
          </span>
          <span
            style={{
              background: "rgba(42,92,170,0.25)",
              border: "1px solid rgba(94,179,214,0.45)",
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 20,
            }}
          >
            frensei.jp
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
