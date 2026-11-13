import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const NarratorAnchor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bouncy entrance physics
  const enter = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
    },
  });

  const scaleEntrance = interpolate(enter, [0, 1], [0.3, 1]);
  const opacityEntrance = interpolate(enter, [0, 1], [0, 1]);

  // Speaking animation: Bobbing up and down + subtle head tilt
  const bobY = Math.sin(frame / 3.5) * 5;
  const tiltDeg = Math.sin(frame / 7) * 3;
  const talkingPulse = interpolate(Math.sin(frame / 2.8), [-1, 1], [0.98, 1.02]);

  // Pulsing red live dot
  const liveBlink = interpolate(Math.sin(frame / 8), [-1, 1], [0.4, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 230,
        left: 50,
        zIndex: 45,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scaleEntrance})`,
        opacity: opacityEntrance,
      }}
    >
      {/* Anchor Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 240, 255, 0.4)",
          padding: "4px 14px",
          borderRadius: 9999,
          marginBottom: -14,
          zIndex: 50,
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#EF4444",
            opacity: liveBlink,
            boxShadow: `0 0 10px rgba(239, 68, 68, ${liveBlink})`,
          }}
        />
        <span
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "1.5px",
            color: "#38BDF8",
            textTransform: "uppercase",
          }}
        >
          ANCHOR
        </span>
      </div>

      {/* Circular Glowing PiP Frame */}
      <div
        style={{
          width: 230,
          height: 230,
          borderRadius: "50%",
          border: "4px solid #00F0FF",
          boxShadow: "0 0 30px rgba(0, 240, 255, 0.55), inset 0 0 20px rgba(0, 240, 255, 0.3)",
          overflow: "hidden",
          backgroundColor: "#070913",
          position: "relative",
        }}
      >
        {/* Animated News Anchor Image */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translateY(${bobY}px) rotate(${tiltDeg}deg) scale(${talkingPulse})`,
            transformOrigin: "bottom center",
          }}
        >
          <Img
            src={staticFile("anchor.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>
      </div>
    </div>
  );
};
