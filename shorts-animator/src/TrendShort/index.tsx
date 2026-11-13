import { Caption } from "@remotion/captions";
import { getAudioData } from "@remotion/media-utils";
import React, { useCallback, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  cancelRender,
  getStaticFiles,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { loadFont } from "../load-font";
import { Background } from "./Background";
import { DynamicCaptions } from "./DynamicCaptions";
import { Header } from "./Header";
import { HeadlineCard } from "./HeadlineCard";
import { NarratorAnchor } from "./NarratorAnchor";
import { ProgressBar } from "./ProgressBar";
import { TopicVisualStage } from "./TopicVisualStage";

export const trendShortSchema = z.object({
  audioFile: z.string().default("audio.mp3"),
  captionsFile: z.string().default("audio.json"),
  captions: z.array(z.any()).optional(),
  headline: z.string().default("THE INTERNET CANNOT BELIEVE THIS JUST HAPPENED"),
  category: z.string().default("VIRAL TECH STORY"),
  source: z.string().default("TRENDING WORLDWIDE"),
  stat: z.string().default("🔥 Hot Topic"),
  watermark: z.string().default("SUBSCRIBE TO @BYTEDISPATCH"),
  topicImage: z.string().default("topic_image.jpg"),
  topicTitle: z.string().default("JENSEN HUANG"),
  topicSubtitle: z.string().default("NVIDIA FOUNDER & CEO"),
  statChange: z.string().default("-8.4%"),
  statLabel: z.string().default("NVIDIA (NVDA) STOCK REACTION"),
  communityQuote: z.string().default("If Jensen leaves, Nvidia loses its entire AI moat. Nobody else commands Silicon Valley like this."),
  communityAuthor: z.string().default("@SiliconValleyDigest"),
  pollQuestion: z.string().default("CAN NVIDIA SURVIVE WITHOUT JENSEN?"),
  pollOptionA: z.string().default("NO — HE IS IRREPLACEABLE"),
  pollOptionB: z.string().default("YES — TOO BIG TO FAIL"),
  pollPercentA: z.number().default(74),
  pollPercentB: z.number().default(26),
  showAnchor: z.boolean().default(false),
});

export type TrendShortProps = z.infer<typeof trendShortSchema>;

export const calculateTrendShortMetadata: CalculateMetadataFunction<
  TrendShortProps
> = async ({ props }) => {
  const fps = 30;
  try {
    const audioPath = staticFile(props.audioFile);
    const audioData = await getAudioData(audioPath);
    const durationInFrames = Math.ceil(audioData.durationInSeconds * fps) + 30; // +1s outro buffer
    return {
      fps,
      durationInFrames: Math.max(90, durationInFrames),
    };
  } catch {
    return {
      fps,
      durationInFrames: 300, // 10s fallback
    };
  }
};

export const TrendShort: React.FC<TrendShortProps> = ({
  audioFile = "audio.mp3",
  captionsFile = "audio.json",
  captions: initialCaptions,
  headline = "THE INTERNET CANNOT BELIEVE THIS JUST HAPPENED",
  category = "VIRAL TECH STORY",
  source = "TRENDING WORLDWIDE",
  stat = "🔥 Hot Topic",
  watermark = "SUBSCRIBE TO @BYTEDISPATCH",
  topicImage = "topic_image.jpg",
  topicTitle = "JENSEN HUANG",
  topicSubtitle = "NVIDIA FOUNDER & CEO",
  statChange = "-8.4%",
  statLabel = "NVIDIA (NVDA) STOCK REACTION",
  communityQuote = "If Jensen leaves, Nvidia loses its entire AI moat. Nobody else commands Silicon Valley like this.",
  communityAuthor = "@SiliconValleyDigest",
  pollQuestion = "CAN NVIDIA SURVIVE WITHOUT JENSEN?",
  pollOptionA = "NO — HE IS IRREPLACEABLE",
  pollOptionB = "YES — TOO BIG TO FAIL",
  pollPercentA = 74,
  pollPercentB = 26,
  showAnchor = false,
}) => {
  const [captions, setCaptions] = useState<Caption[]>(initialCaptions ?? []);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loadData = useCallback(async () => {
    try {
      await loadFont();

      if (!initialCaptions || initialCaptions.length === 0) {
        const res = await fetch(staticFile(captionsFile));
        if (res.ok) {
          const data = (await res.json()) as Caption[];
          setCaptions(data);
        }
      }
      continueRender(handle);
    } catch (e) {
      console.warn("Failed loading captions/font:", e);
      continueRender(handle);
    }
  }, [captionsFile, continueRender, handle, initialCaptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pulseWatermark = interpolate(Math.sin(frame / 20), [-1, 1], [0.65, 0.95]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#070913" }}>
      {/* 1. Cinematic Animated Background */}
      <Background />

      {/* 2. Top Progress Bar */}
      <ProgressBar />

      {/* 3. Category Header */}
      <Header category={category} />

      {/* 4. Glassmorphism Headline Card */}
      <HeadlineCard headline={headline} source={source} stat={stat} />

      {/* 5. Center Topic Visual Infographic Stage */}
      <TopicVisualStage
        topicImage={topicImage}
        topicTitle={topicTitle}
        topicSubtitle={topicSubtitle}
        statChange={statChange}
        statLabel={statLabel}
        communityQuote={communityQuote}
        communityAuthor={communityAuthor}
        pollQuestion={pollQuestion}
        pollOptionA={pollOptionA}
        pollOptionB={pollOptionB}
        pollPercentA={pollPercentA}
        pollPercentB={pollPercentB}
      />

      {/* 6. Dynamic Kinetic Subtitles */}
      <DynamicCaptions captions={captions} />

      {/* 7. Optional Cartoon News Anchor */}
      {showAnchor && <NarratorAnchor />}

      {/* 8. Footer Channel Branding / Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
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
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "12px 32px",
            borderRadius: 9999,
            opacity: pulseWatermark,
          }}
        >
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#94A3B8",
              textTransform: "uppercase",
            }}
          >
            {watermark}
          </span>
        </div>
      </div>

      {/* 9. Voiceover Audio */}
      <Audio src={staticFile(audioFile)} />
    </AbsoluteFill>
  );
};
