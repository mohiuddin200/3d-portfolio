import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: "22%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 110,
            fontWeight: 900,
            color: "#FFD700",
            fontFamily: "sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size }
  );
}
