import { Composition, staticFile } from "remotion";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import {
  TrendShort,
  calculateTrendShortMetadata,
  trendShortSchema,
} from "./TrendShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 Kinetic High-Retention Trend Short */}
      <Composition
        id="TrendShort"
        component={TrendShort}
        calculateMetadata={calculateTrendShortMetadata}
        schema={trendShortSchema}
        width={1080}
        height={1920}
        defaultProps={{
          audioFile: "audio.mp3",
          captionsFile: "audio.json",
          headline: "THE INTERNET CANNOT BELIEVE THIS JUST HAPPENED",
          category: "VIRAL TECH STORY",
          source: "TRENDING WORLDWIDE",
          stat: "🔥 Hot Topic",
          watermark: "SUBSCRIBE FOR DAILY TRENDS",
        }}
      />

      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
