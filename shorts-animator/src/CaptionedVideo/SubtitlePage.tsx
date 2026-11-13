import { TikTokPage } from "@remotion/captions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Page } from "./Page";

const SubtitlePage: React.FC<{
  readonly page: TikTokPage;
  readonly isFirstPage?: boolean;
}> = ({ page, isFirstPage = false }) => {
  return (
    <AbsoluteFill>
      <Page isFirstPage={isFirstPage} page={page} />
    </AbsoluteFill>
  );
};

export default SubtitlePage;
