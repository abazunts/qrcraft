import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* QR corners */}
        <div style={{ position: "relative", width: 20, height: 20, display: "flex" }}>
          {/* top-left */}
          <div style={{ position: "absolute", top: 0, left: 0, width: 8, height: 8, background: "white", borderRadius: 2 }} />
          {/* top-right */}
          <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "white", borderRadius: 2 }} />
          {/* bottom-left */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: 8, height: 8, background: "white", borderRadius: 2 }} />
          {/* bottom-right dots */}
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 4, height: 4, background: "white", borderRadius: 1 }} />
          <div style={{ position: "absolute", bottom: 0, right: 5, width: 2, height: 2, background: "white", borderRadius: 1 }} />
          <div style={{ position: "absolute", bottom: 5, right: 0, width: 2, height: 2, background: "white", borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
