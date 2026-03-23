import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#fafafa",
            letterSpacing: "-2px",
          }}
        >
          Benjamin Wang
        </span>
        <span
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            fontWeight: 500,
          }}
        >
          Full Stack Software Engineer & AI Enthusiast
        </span>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "16px",
            color: "#71717a",
            fontSize: 20,
          }}
        >
          <span>Singapore</span>
          <span>·</span>
          <span>codedbyben.com</span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
