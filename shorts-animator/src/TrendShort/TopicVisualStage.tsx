import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";

export interface TopicVisualStageProps {
  topicImage?: string;
  topicTitle?: string;
  topicSubtitle?: string;
  statChange?: string;
  statLabel?: string;
  communityQuote?: string;
  communityAuthor?: string;
  pollQuestion?: string;
  pollOptionA?: string;
  pollOptionB?: string;
  pollPercentA?: number;
  pollPercentB?: number;
}

export const TopicVisualStage: React.FC<TopicVisualStageProps> = ({
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
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Divide short into 4 dynamic scenes
  const totalFrames = durationInFrames;
  const sceneDuration = Math.floor(totalFrames / 4);

  const sceneIndex = Math.min(3, Math.floor(frame / sceneDuration));
  const sceneLocalFrame = frame - sceneIndex * sceneDuration;

  // Scene transition animation (smooth entrance)
  const sceneEnter = spring({
    frame: sceneLocalFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  const sceneScale = interpolate(sceneEnter, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOpacity = interpolate(sceneEnter, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating breathing motion
  const floatY = Math.sin(frame / 25) * 4;

  return (
    <div
      style={{
        position: "absolute",
        top: 540,
        left: 60,
        right: 60,
        height: 560,
        zIndex: 35,
        transform: `translateY(${floatY}px) scale(${sceneScale})`,
        opacity: sceneOpacity,
      }}
    >
      {/* Outer Glassmorphic Card Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 32,
          background:
            "linear-gradient(145deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.65))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid rgba(0, 240, 255, 0.35)",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 240, 255, 0.15)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HUD Corner Tech Brackets */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 14,
            width: 18,
            height: 18,
            borderTop: "3px solid #00F0FF",
            borderLeft: "3px solid #00F0FF",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            width: 18,
            height: 18,
            borderTop: "3px solid #00F0FF",
            borderRight: "3px solid #00F0FF",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            width: 18,
            height: 18,
            borderBottom: "3px solid #00F0FF",
            borderLeft: "3px solid #00F0FF",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 14,
            width: 18,
            height: 18,
            borderBottom: "3px solid #00F0FF",
            borderRight: "3px solid #00F0FF",
            zIndex: 10,
          }}
        />

        {/* SCENE 1: Topic Hero Image */}
        {sceneIndex === 0 && (
          <SceneHeroImage
            image={topicImage}
            title={topicTitle}
            subtitle={topicSubtitle}
            frame={sceneLocalFrame}
          />
        )}

        {/* SCENE 2: Infographic Market / Stat Card */}
        {sceneIndex === 1 && (
          <SceneInfographic
            statChange={statChange}
            statLabel={statLabel}
            frame={sceneLocalFrame}
            fps={fps}
          />
        )}

        {/* SCENE 3: Community Reaction Card */}
        {sceneIndex === 2 && (
          <SceneCommunityReaction
            quote={communityQuote}
            author={communityAuthor}
            frame={sceneLocalFrame}
          />
        )}

        {/* SCENE 4: Audience Poll & CTA */}
        {sceneIndex === 3 && (
          <SceneAudiencePoll
            question={pollQuestion}
            optionA={pollOptionA}
            optionB={pollOptionB}
            percentA={pollPercentA}
            percentB={pollPercentB}
            frame={sceneLocalFrame}
            fps={fps}
          />
        )}
      </div>
    </div>
  );
};

// ==========================================
// SCENE 1: Hero Image Spotlight
// ==========================================
const SceneHeroImage: React.FC<{
  image: string;
  title: string;
  subtitle: string;
  frame: number;
}> = ({ image, title, subtitle, frame }) => {
  // Smooth Ken Burns Zoom
  const zoom = interpolate(frame, [0, 300], [1.0, 1.09], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Top Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 24,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "6px 18px",
          borderRadius: 9999,
          border: "1px solid rgba(0, 240, 255, 0.4)",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "#00F0FF",
            boxShadow: "0 0 10px #00F0FF",
          }}
        />
        <span
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "2px",
            color: "#FFFFFF",
            textTransform: "uppercase",
          }}
        >
          TOPIC SPOTLIGHT
        </span>
      </div>

      {/* Hero Image */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
          }}
        />
      </div>

      {/* Gradient Dark Vignette Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(7, 9, 19, 0.95) 0%, rgba(7, 9, 19, 0.4) 40%, transparent 70%)",
        }}
      />

      {/* Bottom Name & Role Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 28,
          right: 28,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: TheBoldFont,
            fontSize: 44,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "1px",
            textTransform: "uppercase",
            textShadow: "0 3px 15px rgba(0, 0, 0, 0.9)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#38BDF8",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 2: Shocking Infographic Stat & Stock Drop
// ==========================================
const SceneInfographic: React.FC<{
  statChange: string;
  statLabel: string;
  frame: number;
  fps: number;
}> = ({ statChange, statLabel, frame, fps }) => {
  // Animated Stock Line Progress
  const lineProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 90 },
  });

  return (
    <div
      style={{
        padding: "36px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
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
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "2.5px",
            color: "#94A3B8",
            textTransform: "uppercase",
          }}
        >
          MARKET SHOCKWAVE
        </span>
        <div
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #EF4444",
            padding: "6px 16px",
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
              boxShadow: "0 0 8px #EF4444",
            }}
          />
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "#EF4444",
              letterSpacing: "1.5px",
            }}
          >
            VOLATILITY ALERT
          </span>
        </div>
      </div>

      {/* Main Metric Stat */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          margin: "12px 0",
        }}
      >
        <span
          style={{
            fontFamily: TheBoldFont,
            fontSize: 84,
            fontWeight: 900,
            color: "#FF3366",
            textShadow: "0 0 40px rgba(255, 51, 102, 0.6)",
            lineHeight: 1,
          }}
        >
          {statChange}
        </span>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: TheBoldFont,
              fontSize: 26,
              color: "#FFFFFF",
              letterSpacing: "1px",
            }}
          >
            PRE-MARKET PLUNGE
          </span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 18,
              color: "#94A3B8",
              fontWeight: 600,
            }}
          >
            {statLabel}
          </span>
        </div>
      </div>

      {/* Animated SVG Sparkline / Crash Chart */}
      <div
        style={{
          width: "100%",
          height: 130,
          position: "relative",
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          borderRadius: 18,
          padding: "12px 18px",
          boxSizing: "border-box",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <svg
          viewBox="0 0 400 100"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          {/* Subtle Grid Lines */}
          <line
            x1="0"
            y1="25"
            x2="400"
            y2="25"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1="0"
            y1="60"
            x2="400"
            y2="60"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />

          {/* Crash Chart Line */}
          <path
            d="M 10 30 Q 80 20 140 38 T 240 45 T 320 85 T 390 92"
            fill="none"
            stroke="#FF3366"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="450"
            strokeDashoffset={interpolate(lineProgress, [0, 1], [450, 0])}
            style={{
              filter: "drop-shadow(0 0 10px rgba(255, 51, 102, 0.8))",
            }}
          />

          {/* Impact Point */}
          {lineProgress > 0.8 && (
            <circle
              cx="390"
              cy="92"
              r="6"
              fill="#FF3366"
              style={{ filter: "drop-shadow(0 0 12px #FF3366)" }}
            />
          )}
        </svg>
      </div>

      {/* Bottom Metric Badges */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              color: "#94A3B8",
              fontWeight: 700,
            }}
          >
            MARKET CAP
          </div>
          <div
            style={{
              fontFamily: TheBoldFont,
              fontSize: 22,
              color: "#FFFFFF",
              marginTop: 2,
            }}
          >
            -$280 BILLION
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              color: "#94A3B8",
              fontWeight: 700,
            }}
          >
            CONFIRMATION
          </div>
          <div
            style={{
              fontFamily: TheBoldFont,
              fontSize: 22,
              color: "#FBBF24",
              marginTop: 2,
            }}
          >
            UNOFFICIAL REPORT
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 3: Community & Silicon Valley Reaction
// ==========================================
const SceneCommunityReaction: React.FC<{
  quote: string;
  author: string;
  frame: number;
}> = ({ quote, author }) => {
  return (
    <div
      style={{
        padding: "36px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00F0FF, #7000FF)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 24,
            }}
          >
            ⚡
          </div>
          <div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {author}
              <span style={{ color: "#38BDF8", fontSize: 18 }}>✓</span>
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 15,
                color: "#64748B",
              }}
            >
              Top Silicon Valley Analyst
            </div>
          </div>
        </div>

        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#FCD34D",
            backgroundColor: "rgba(252, 211, 77, 0.15)",
            padding: "6px 14px",
            borderRadius: 9999,
          }}
        >
          🔥 VIRAL TAKE
        </span>
      </div>

      {/* Quote Body */}
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.35,
          color: "#E2E8F0",
          fontStyle: "italic",
          borderLeft: "4px solid #00F0FF",
          paddingLeft: 20,
          margin: "16px 0",
        }}
      >
        "{quote}"
      </div>

      {/* Reaction Engagement Metrics */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: 16,
          color: "#94A3B8",
          fontFamily: "system-ui, sans-serif",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        <span>💬 12.8K Comments</span>
        <span>🔁 34.2K Reposts</span>
        <span style={{ color: "#F43F5E" }}>❤️ 182.4K Likes</span>
      </div>
    </div>
  );
};

// ==========================================
// SCENE 4: Audience Poll & Decision CTA
// ==========================================
const SceneAudiencePoll: React.FC<{
  question: string;
  optionA: string;
  optionB: string;
  percentA: number;
  percentB: number;
  frame: number;
  fps: number;
}> = ({ question, optionA, optionB, percentA, percentB, frame, fps }) => {
  // Bar Fill Animation
  const fillProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  // CTA Pulse
  const ctaBounce = Math.sin(frame / 6) * 6;

  return (
    <div
      style={{
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Poll Header */}
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
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "2px",
            color: "#00F0FF",
            textTransform: "uppercase",
          }}
        >
          📊 AUDIENCE POLL
        </span>
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#94A3B8",
          }}
        >
          348,200 VOTES
        </span>
      </div>

      {/* Poll Question */}
      <div
        style={{
          fontFamily: TheBoldFont,
          fontSize: 32,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.2,
          textTransform: "uppercase",
        }}
      >
        {question}
      </div>

      {/* Poll Option A */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          <span>{optionA}</span>
          <span style={{ color: "#EF4444" }}>{percentA}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 18,
            borderRadius: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentA * fillProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #FF3366, #EF4444)",
              borderRadius: 9999,
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.8)",
            }}
          />
        </div>
      </div>

      {/* Poll Option B */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          <span>{optionB}</span>
          <span style={{ color: "#39E508" }}>{percentB}%</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 18,
            borderRadius: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentB * fillProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10B981, #39E508)",
              borderRadius: 9999,
              boxShadow: "0 0 15px rgba(57, 229, 8, 0.8)",
            }}
          />
        </div>
      </div>

      {/* Pulsing CTA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${ctaBounce}px)`,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 230, 0, 0.15)",
            border: "2px solid #FFE600",
            padding: "8px 24px",
            borderRadius: 9999,
            boxShadow: "0 0 20px rgba(255, 230, 0, 0.4)",
          }}
        >
          <span
            style={{
              fontFamily: TheBoldFont,
              fontSize: 22,
              fontWeight: 900,
              color: "#FFE600",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            👇 DROP YOUR VOTE IN COMMENTS 👇
          </span>
        </div>
      </div>
    </div>
  );
};
