import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import SubtitlePage from "../CaptionedVideo/SubtitlePage";

const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const DynamicCaptions: React.FC<{ captions: Caption[] }> = ({
  captions,
}) => {
  const { fps } = useVideoConfig();

  // Ensure tokens have leading spaces for proper word breaking in TikTok style
  const normalizedCaptions = useMemo(() => {
    if (!captions) return [];
    return captions.map((c, i) => ({
      ...c,
      text: i > 0 && !c.text.startsWith(" ") ? ` ${c.text}` : c.text,
    }));
  }, [captions]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: normalizedCaptions,
    });
  }, [normalizedCaptions]);

  if (!captions || captions.length === 0) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = Math.round((page.startMs / 1000) * fps);
        const subtitleEndFrame = Math.round(
          Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            subtitleStartFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps * 1.5,
          )
        );
        const durationInFrames = Math.max(1, subtitleEndFrame - subtitleStartFrame);

        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
