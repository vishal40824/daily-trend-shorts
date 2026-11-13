import { makeTransform, scale } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
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
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * 0.88,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  // Rock-solid smooth micro-scale (zero Y-twitch)
  const scaleValue = interpolate(enterProgress, [0, 1], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          transform: makeTransform([scale(scaleValue)]),
          transformOrigin: "center center",
          opacity: interpolate(enterProgress, [0, 0.4, 1], [0, 1, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {page.tokens.map((t, index) => {
          const startRelativeToSequence = t.fromMs - page.startMs;
          const endRelativeToSequence = t.toMs - page.startMs;

          const active =
            startRelativeToSequence <= timeInMs &&
            endRelativeToSequence > timeInMs;

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
