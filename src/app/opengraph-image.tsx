import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 60%)",
          color: "#064e3b",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600, color: "#047857" }}>{site.name}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginTop: 24, maxWidth: 900 }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 30, marginTop: 32, color: "#065f46", maxWidth: 900 }}>
          Communities, categories and downloads. Files stay in your own Google Drive.
        </div>
      </div>
    ),
    size,
  );
}
