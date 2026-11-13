import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentle floating animation for glow orbs
  const orb1X = Math.sin(frame / 45) * 60;
  const orb1Y = Math.cos(frame / 60) * 80;

  const orb2X = Math.cos(frame / 50) * 70;
  const orb2Y = Math.sin(frame / 65) * 90;

  const pulse = interpolate(Math.sin(frame / 30), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070913",
        overflow: "hidden",
      }}
    >
      {/* Ambient Radial Glowing Orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: `calc(15% + ${orb1X}px)`,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(124, 58, 237, 0) 70%)",
          filter: "blur(80px)",
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          right: `calc(10% + ${orb2X}px)`,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(6, 182, 212, 0) 70%)",
          filter: "blur(90px)",
          transform: `scale(${pulse})`,
        }}
      />

      {/* Cyber Grid Lines Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.2) 90%)",
        }}
      />

      {/* Subtle Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
