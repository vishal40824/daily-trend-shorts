import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const Header: React.FC<{ category?: string }> = ({
  category = "TRENDING STORY",
}) => {
  const frame = useCurrentFrame();
  const blink = interpolate(Math.sin(frame / 10), [-1, 1], [0.3, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "16px 36px",
          borderRadius: 9999,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Pulsing Red Dot */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "#EF4444",
            opacity: blink,
            boxShadow: `0 0 16px rgba(239, 68, 68, ${blink})`,
          }}
        />
        <span
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "3px",
            color: "#F8FAFC",
            textTransform: "uppercase",
          }}
        >
          {category}
        </span>
      </div>
    </div>
  );
};
