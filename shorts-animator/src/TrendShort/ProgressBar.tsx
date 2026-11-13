import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, Math.max(0, frame / durationInFrames));

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 100,
        height: 12,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #06B6D4, #3B82F6, #8B5CF6, #EC4899)",
          boxShadow: "0 0 16px rgba(139, 92, 246, 0.8)",
          borderRadius: "0 6px 6px 0",
        }}
      />
    </AbsoluteFill>
  );
};
