import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Command Center AI — We Build AI Command Centers for Businesses";
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
          background:
            "linear-gradient(135deg, #05070d 0%, #070b15 45%, #0a0f1c 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "4px solid #c9d1dd",
            marginBottom: 36,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              border: "3px dashed #5eb3ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 35%, #bfe2ff, #2f8bff 60%, #1a6ef0)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 2,
            }}
          >
            COMMAND CENTER AI
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 28,
              color: "#5eb3ff",
              fontWeight: 500,
            }}
          >
            We Build AI Command Centers for Businesses
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 20,
              color: "#9aa6b8",
              letterSpacing: 3,
            }}
          >
            OPERATE SMARTER. SCALE FASTER.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
