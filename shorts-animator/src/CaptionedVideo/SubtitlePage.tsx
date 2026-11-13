import { TikTokPage } from "@remotion/captions";
import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Page } from "./Page";

const SubtitlePage: React.FC<{ readonly page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth, non-twitchy spring entrance
  const enter = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 140,
    },
  });

  return (
    <AbsoluteFill>
      <Page enterProgress={enter} page={page} />
    </AbsoluteFill>
  );
};

export default SubtitlePage;
