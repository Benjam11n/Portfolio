import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <span
          style={{
            color: "#fafafa",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          Benjamin Wang
        </span>
        <span
          style={{
            color: "#a1a1aa",
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          Full Stack Software Engineer & AI Enthusiast
        </span>
        <div
          style={{
            color: "#71717a",
            display: "flex",
            fontSize: 20,
            gap: "24px",
            marginTop: "16px",
          }}
        >
          <span>Singapore</span>
          <span>·</span>
          <span>codedbyben.com</span>
        </div>
      </div>
    </div>,
    {
      height: 630,
      width: 1200,
    }
  );
