import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TheBoldFont } from "../load-font";

const fontFamily = TheBoldFont;

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  top: undefined,
  bottom: 440,
  height: 240,
  width: "100%",
  padding: "0 40px",
  boxSizing: "border-box",
};

const DESIRED_FONT_SIZE = 110;
const HIGHLIGHT_COLOR = "#FFE600"; // High-visibility electric cyber yellow

export const Page: React.FC<{
  readonly page: TikTokPage;
  readonly isFirstPage?: boolean;
}> = ({ page, isFirstPage = false }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  // Precise absolute millisecond timing
  const absoluteTimeMs = isFirstPage
    ? (frame / fps) * 1000
    : page.startMs + (frame / fps) * 1000;

  // Memoize fitted text to prevent any frame-by-frame layout recalculation
  const fittedText = useMemo(() => {
    return fitText({
      fontFamily,
      text: page.text,
      withinWidth: width * 0.88,
      textTransform: "uppercase",
    });
  }, [page.text, width]);

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: "white",
          WebkitTextStroke: "16px black",
          paintOrder: "stroke fill",
          fontFamily,
          textTransform: "uppercase",
          letterSpacing: "2px",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {page.tokens.map((t, index) => {
          const active =
            absoluteTimeMs >= t.fromMs && absoluteTimeMs < t.toMs;

          return (
            <span
              key={`${t.fromMs}-${index}`}
              style={{
                display: "inline",
                whiteSpace: "pre",
                color: active ? HIGHLIGHT_COLOR : "#FFFFFF",
                textShadow: active
                  ? "0 0 35px rgba(255, 230, 0, 0.9), 0 0 15px rgba(255, 230, 0, 0.6)"
                  : "0 4px 15px rgba(0, 0, 0, 0.9)",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
