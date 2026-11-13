import os
import sys
import subprocess
import datetime
import json
from audio_engine import create_audio
from trend_scraper import get_hottest_topic

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REMOTION_DIR = os.path.join(BASE_DIR, "shorts-animator")
OUT_DIR = os.path.join(BASE_DIR, "out")
os.makedirs(OUT_DIR, exist_ok=True)

def craft_script_from_topic(topic: dict):
    raw_title = topic.get("title", "")
    source = topic.get("source", "r/technology")

    # Clean headline for the visual card (all caps, concise)
    headline_words = raw_title.split()[:9]
    headline = " ".join(headline_words).upper()

    # Formulate conversational, high-hook script (under 40s)
    script = (
        f"The internet is talking about this today. "
        f"{raw_title}. "
        f"This development is creating serious debate across the tech community. "
        f"Do you think this is a good change or a major mistake? "
        f"Drop your thoughts below and subscribe to ByteDispatch for daily internet updates."
    )

    return {
        "headline": headline,
        "category": "TRENDING REPORT",
        "source": source.upper(),
        "stat": f"🔥 {topic.get('score', 'Top')} Upvotes",
        "script": script,
        "youtube_title": f"{raw_title[:80]} #Shorts",
        "description": (
            f"{raw_title}\n\n"
            f"Daily trending internet and tech stories by ByteDispatch.\n\n"
            f"🔔 Subscribe to @ByteDispatch for your daily internet briefing.\n\n"
            f"#Shorts #TechNews #InternetTrends #ByteDispatch"
        )
    }

def run_pipeline(custom_topic: str = None, upload: bool = False):
    print("=" * 60)
    print("  🚀 GENERATING DAILY INTERNET SHORT")
    print("=" * 60)

    # 1. Fetch Topic
    if custom_topic:
        topic_data = {"title": custom_topic, "source": "CUSTOM", "score": 9999}
    else:
        topic_data = get_hottest_topic()

    meta = craft_script_from_topic(topic_data)
    print(f"\n[1/4] Selected Topic: {meta['headline']}")
    print(f"[Script]: {meta['script']}\n")

    # 2. Generate Audio & Word Captions
    mp3_path = os.path.join(REMOTION_DIR, "public", "audio.mp3")
    json_path = os.path.join(REMOTION_DIR, "public", "audio.json")

    print("[2/4] Generating Neural Audio & Word Captions...")
    duration_sec, captions = create_audio(meta["script"], mp3_path, json_path)
    print(f"Generated {duration_sec:.1f}s of audio with {len(captions)} words.")

    # 3. Save Props JSON for Remotion
    props_data = {
        "headline": meta["headline"],
        "category": meta["category"],
        "source": meta["source"],
        "stat": meta["stat"],
        "audioFile": "audio.mp3",
        "captionsFile": "audio.json",
        "captions": captions,
        "watermark": "SUBSCRIBE TO @BYTEDISPATCH"
    }
    props_path = os.path.join(REMOTION_DIR, "props.json")
    with open(props_path, "w", encoding="utf-8") as f:
        json.dump(props_data, f, indent=2)

    # 4. Render Remotion Video
    date_str = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
    out_video = os.path.join(OUT_DIR, f"Short_{date_str}.mp4")

    print(f"\n[3/4] Rendering 1080x1920 Video via Remotion...")
    cmd_str = f'npx.cmd remotion render TrendShort "{out_video}" --props="{props_path}" --concurrency=4'

    env = os.environ.copy()
    env["Path"] = r"C:\Program Files\nodejs;" + env.get("Path", "")

    result = subprocess.run(cmd_str, cwd=REMOTION_DIR, shell=True, env=env)
    if result.returncode != 0:
        print("[Error] Remotion render failed!")
        return None

    print(f"\n✨ Video successfully rendered to:\n{out_video}")

    # 5. YouTube Upload
    if upload:
        try:
            from youtube_uploader import upload_short
            print("\n[4/4] Uploading to YouTube...")
            url = upload_short(
                out_video,
                title=meta["youtube_title"],
                description=meta["description"]
            )
            print(f"🎉 Live on YouTube: {url}")
        except Exception as e:
            print(f"[YouTube Upload Notice]: {e}")
    else:
        print("\n[4/4] Render complete! Video ready for review in 'd:\\AI gen videos\\out\\'.")

    return out_video

if __name__ == "__main__":
    should_upload = "--upload" in sys.argv
    run_pipeline(upload=should_upload)
