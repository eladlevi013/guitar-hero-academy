import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#04020f",
          gap: "20px",
        }}
      >
        <span style={{ fontSize: "80px", lineHeight: 1 }}>🎸</span>
        <span
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#f0e8d8",
            letterSpacing: "-1px",
          }}
        >
          Guitar Hero Academy
        </span>
        <span
          style={{
            fontSize: "22px",
            color: "rgba(240,232,216,0.6)",
            marginTop: "4px",
          }}
        >
          Real-time pitch detection · Learn guitar
        </span>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          <div
            style={{
              background: "#f5a623",
              borderRadius: "9999px",
              padding: "10px 28px",
              color: "#04020f",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Beginner
          </div>
          <div
            style={{
              background: "#3a7a6b",
              borderRadius: "9999px",
              padding: "10px 28px",
              color: "#f0e8d8",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Intermediate
          </div>
          <div
            style={{
              background: "#c8553d",
              borderRadius: "9999px",
              padding: "10px 28px",
              color: "#f0e8d8",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Advanced
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
