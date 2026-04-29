import { ImageResponse } from "next/og";
import { createElement } from "react";

const brandBackground = "#0f766e";
const brandForeground = "#ffffff";
const brandAccent = "#ccfbf1";

export function createAppIcon(size: number, maskable = false) {
  const safeZone = maskable ? size * 0.14 : 0;
  const fontSize = Math.round(size * 0.54);
  const radius = Math.round(size * 0.22);

  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandBackground,
          padding: safeZone,
        },
      },
      createElement(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius,
            background: "linear-gradient(135deg, #0f766e 0%, #164e63 100%)",
            border: `${Math.max(2, Math.round(size * 0.025))}px solid ${brandAccent}`,
            color: brandForeground,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize,
            fontWeight: 800,
            letterSpacing: 0,
          },
        },
        createElement("span", { style: { lineHeight: 1, marginTop: -Math.round(size * 0.03) } }, "J"),
      ),
    ),
    {
      width: size,
      height: size,
    },
  );
}
