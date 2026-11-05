import { ImageResponse } from "next/og";

export const alt = "FYPMatch: get 5 ranked final year project ideas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#FBFAF6", color: "#09090B" }}>
        <div style={{ fontSize: 34, fontWeight: 700 }}>FYPMatch</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 28, lineHeight: 1.1 }}>Stop staring at a blank page.</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#71717A" }}>5 ranked final year project ideas for Pakistani students.</div>
      </div>
    ),
    size,
  );
}
