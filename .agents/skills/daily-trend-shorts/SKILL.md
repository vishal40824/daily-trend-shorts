---
name: daily-trend-shorts
description: Generates high-retention, studio-grade animated YouTube Shorts from daily trending internet stories using Remotion, edge-tts, and automated YouTube Data API upload.
---

# Daily Trend Shorts Pipeline

This skill automates the creation of 9:16 vertical animated videos for YouTube Shorts from daily trending internet topics.

## Pipeline Architecture
1. **Trend Scraper (`trend_scraper.py`)**: Fetches hot stories from Reddit (`r/technology`, `r/todayilearned`, `r/InternetIsBeautiful`, `r/Futurology`) or Google Trends.
2. **Audio & Timestamps (`audio_engine.py`)**: Converts the script into natural neural speech via `edge-tts` (100% free) and generates exact millisecond word timestamps.
3. **Motion Graphics Engine (`shorts-animator/`)**: Remotion React engine that renders:
   - Dynamic dark studio animated mesh gradient & grid.
   - Glassmorphic headline card with spring entry physics.
   - Kinetic bouncy typography with active word highlighted in neon yellow/green.
   - Top progress bar and category badge.
4. **YouTube Uploader (`youtube_uploader.py`)**: Automated upload and scheduled publishing via YouTube Data API v3.

## Commands

### 1. Generate & Render a Short (Auto-Trend)
```powershell
python "d:\AI gen videos\generate_daily_short.py"
```

### 2. Generate with a Custom Topic
```powershell
python -c "from generate_daily_short import run_pipeline; run_pipeline(custom_topic='Google just announced quantum breakthrough', upload=False)"
```

### 3. YouTube Upload Configuration
To enable automatic YouTube uploads:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **YouTube Data API v3**.
3. Create an **OAuth 2.0 Client ID** (Desktop Application).
4. Download the JSON credentials and save as `d:\AI gen videos\client_secrets.json`.
5. Run:
```powershell
python "d:\AI gen videos\youtube_uploader.py"
```
Follow the one-time browser login to authorize your YouTube channel.
