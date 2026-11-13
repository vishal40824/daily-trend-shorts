import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TheBoldFont } from "../load-font";

interface HeadlineCardProps {
  headline: string;
  source?: string;
  stat?: string;
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({
  headline,
  source = "VIRAL ACROSS THE INTERNET",
  stat = "🔥 Trending #1",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth bouncy spring entrance
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 100,
    },
  });

  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const translateY = interpolate(entrance, [0, 1], [60, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle floating idle motion after entrance
  const floatY = Math.sin(frame / 35) * 8;

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 60,
        right: 60,
        zIndex: 40,
        transform: `translateY(${translateY + floatY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 30,
          border: "2px solid rgba(255, 255, 255, 0.18)",
          padding: "26px 36px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Source & Stat Pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#38BDF8",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {source}
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#FCD34D",
              backgroundColor: "rgba(252, 211, 77, 0.15)",
              padding: "5px 14px",
              borderRadius: 9999,
              border: "1px solid rgba(252, 211, 77, 0.3)",
            }}
          >
            {stat}
          </span>
        </div>

        {/* Headline Text */}
        <div
          style={{
            fontFamily: TheBoldFont,
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {headline}
        </div>
      </div>
    </div>
  );
};
