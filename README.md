# 🎬 Automated Daily YouTube Shorts Generator

This workspace contains an automated pipeline that generates studio-quality, high-retention animated YouTube Shorts from daily trending internet stories.

## ✨ Features
- **100% Free**: Uses Microsoft Edge Neural TTS (`edge-tts`) with natural broadcast voices and built-in timestamp alignment.
- **Non-Janky, Non-AI Aesthetic**: Built on [Remotion](https://www.remotion.dev/) (React & TypeScript) for 60fps/30fps vector motion graphics, glassmorphism UI, and kinetic typography—no morphing diffusion slop.
- **Trend Discovery**: Automatically scrapes hot viral stories from Reddit (`r/technology`, `r/todayilearned`, `r/InternetIsBeautiful`) or Google Trends.
- **Automated YouTube Uploads**: Integrated with YouTube Data API v3 for direct uploads and scheduled publishing.

---

## 🚀 How to Run

### 1. Generate Today's Short (One-Click)
Run this command from your terminal:
```powershell
python "d:\AI gen videos\generate_daily_short.py"
```
This will:
1. Fetch the #1 viral story of the day.
2. Synthesize high-quality neural voiceover with word timestamps.
3. Render a vertical 1080×1920 video to `d:\AI gen videos\out\Short_YYYY-MM-DD.mp4`.

### 2. Preview the Remotion Studio in Browser
You can visually edit animations and test templates in the Remotion interactive preview:
```powershell
cd "d:\AI gen videos\shorts-animator"
npm run dev
```

---

## 📺 YouTube Auto-Upload Setup
To let the script upload directly to your channel:
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable **YouTube Data API v3**.
3. Under **Credentials**, create an **OAuth 2.0 Client ID** (Application type: *Desktop App*).
4. Download the JSON and save it as:
   `d:\AI gen videos\client_secrets.json`
5. Run:
   ```powershell
   python "d:\AI gen videos\youtube_uploader.py"
   ```
   A browser window will open once to authorize your YouTube account. All future uploads will be automatic.

---

## ⏰ Daily Scheduled Automation
You can schedule Antigravity to run this every day at your preferred time (e.g. 5:00 PM IST or 12:00 PM EST) using `/automation`.
