import os
import sys
import subprocess
import datetime
import json
import requests
from audio_engine import create_audio
from trend_scraper import get_hottest_topic

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REMOTION_DIR = os.path.join(BASE_DIR, "shorts-animator")
OUT_DIR = os.path.join(BASE_DIR, "out")
os.makedirs(OUT_DIR, exist_ok=True)

def fetch_wikipedia_image(query: str, target_path: str) -> bool:
    """Fetches high-res public domain image from Wikipedia for the topic subject."""
    headers = {"User-Agent": "ByteDispatchShorts/1.0 (contact: bytedispatch.media@gmail.com)"}
    try:
        search_url = "https://en.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "format": "json"
        }
        res = requests.get(search_url, params=search_params, headers=headers, timeout=5)
        if res.status_code == 200:
            hits = res.json().get("query", {}).get("search", [])
            if hits:
                title = hits[0]["title"]
                img_params = {
                    "action": "query",
                    "titles": title,
                    "prop": "pageimages",
                    "format": "json",
                    "pithumbsize": 1080
                }
                res2 = requests.get(search_url, params=img_params, headers=headers, timeout=5)
                if res2.status_code == 200:
                    pages = res2.json().get("query", {}).get("pages", {})
                    for _, pdata in pages.items():
                        if "thumbnail" in pdata and "source" in pdata["thumbnail"]:
                            img_url = pdata["thumbnail"]["source"]
                            img_bytes = requests.get(img_url, headers=headers, timeout=10).content
                            with open(target_path, "wb") as f:
                                f.write(img_bytes)
                            print(f"[TopicVisual] Downloaded high-res image for '{title}' from Wikipedia.")
                            return True
    except Exception as e:
        print(f"[TopicVisual] Notice: Image fetch skipped ({e}). Using existing topic visual.")
    return False

def craft_script_from_topic(topic: dict):
    raw_title = topic.get("title", "")
    source = topic.get("source", "r/technology")

    # Clean headline for the visual card (all caps, concise)
    headline_words = raw_title.split()[:8]
    headline = " ".join(headline_words).upper()

    # Formulate conversational, high-hook script (under 40s)
    script = (
        f"The internet is exploding over this today. "
        f"{raw_title}. "
        f"This development is creating intense debate across Silicon Valley and the tech world. "
        f"Analysts are calling this a defining moment for the entire industry. "
        f"Do you think this is a major misstep or the right move? "
        f"Drop your vote below and subscribe to ByteDispatch for daily tech updates."
    )

    return {
        "headline": headline,
        "category": "TECH DISPATCH",
        "source": source.upper(),
        "stat": f"🔥 {topic.get('score', 'Top')} Upvotes",
        "script": script,
        "topicTitle": headline,
        "topicSubtitle": "TECH BREAKING DISPATCH",
        "statChange": "🔥 VIRAL",
        "statLabel": "TECH COMMUNITY REACTION",
        "communityQuote": f"This changes the game for tech. Nobody saw this coming so quickly.",
        "communityAuthor": "@TechInsider",
        "pollQuestion": "IS THIS THE RIGHT MOVE?",
        "pollOptionA": "NO — TERRIBLE DECISION",
        "pollOptionB": "YES — NEEDED CHANGE",
        "pollPercentA": 68,
        "pollPercentB": 32,
        "youtube_title": f"{raw_title[:80]} #Shorts",
        "description": (
            f"{raw_title}\n\n"
            f"Daily trending internet and tech stories by ByteDispatch.\n\n"
            f"🔔 Subscribe to @ByteDispatch for your daily internet briefing.\n\n"
            f"#Shorts #TechNews #InternetTrends #ByteDispatch"
        )
    }

def run_pipeline(custom_topic: str = None, custom_headline: str = None, custom_script: str = None, upload: bool = False):
    print("=" * 60)
    print("  🚀 GENERATING DAILY INTERNET SHORT (BYTEDISPATCH)")
    print("=" * 60)

    # 1. Fetch or Formulate Topic
    if custom_script:
        meta = {
            "headline": custom_headline or (custom_topic.upper() if custom_topic else "BREAKING TECH NEWS"),
            "category": "TECH DISPATCH",
            "source": "VIRAL BREAKING",
            "stat": "🔥 Viral #1",
            "script": custom_script,
            "topicTitle": "JENSEN HUANG",
            "topicSubtitle": "NVIDIA FOUNDER & CEO",
            "statChange": "-8.4%",
            "statLabel": "NVIDIA (NVDA) STOCK REACTION",
            "communityQuote": "If Jensen leaves, Nvidia loses its entire AI moat. Nobody else commands Silicon Valley like this.",
            "communityAuthor": "@SiliconValleyDigest",
            "pollQuestion": "CAN NVIDIA SURVIVE WITHOUT JENSEN?",
            "pollOptionA": "NO — HE IS IRREPLACEABLE",
            "pollOptionB": "YES — TOO BIG TO FAIL",
            "pollPercentA": 74,
            "pollPercentB": 26,
            "youtube_title": f"{(custom_headline or custom_topic or 'Jensen Huang Out at Nvidia?')[:80]} #Shorts",
            "description": (
                f"{custom_script}\n\n"
                "Daily trending internet and tech stories by ByteDispatch.\n\n"
                "🔔 Subscribe to @ByteDispatch for your daily internet briefing.\n\n"
                "#Shorts #TechNews #Nvidia #JensenHuang #ByteDispatch"
            )
        }
    elif custom_topic:
        topic_data = {"title": custom_topic, "source": "VIRAL NEWS", "score": 9999}
        meta = craft_script_from_topic(topic_data)
        if custom_headline:
            meta["headline"] = custom_headline
    else:
        topic_data = get_hottest_topic()
        meta = craft_script_from_topic(topic_data)

    print(f"\n[1/4] Headline: {meta['headline']}")
    print(f"[Script]: {meta['script']}\n")

    # 2. Check / Fetch Topic Image
    topic_img_path = os.path.join(REMOTION_DIR, "public", "topic_image.jpg")
    query_target = custom_topic or meta["headline"]
    if not os.path.exists(topic_img_path):
        fetch_wikipedia_image(query_target, topic_img_path)

    # 3. Generate Audio & Word Captions
    mp3_path = os.path.join(REMOTION_DIR, "public", "audio.mp3")
    json_path = os.path.join(REMOTION_DIR, "public", "audio.json")

    print("[2/4] Generating Neural Audio & Word Captions...")
    duration_sec, captions = create_audio(meta["script"], mp3_path, json_path)
    print(f"Generated {duration_sec:.1f}s of audio with {len(captions)} words.")

    # 4. Save Props JSON for Remotion
    props_data = {
        "headline": meta["headline"],
        "category": meta["category"],
        "source": meta["source"],
        "stat": meta["stat"],
        "audioFile": "audio.mp3",
        "captionsFile": "audio.json",
        "captions": captions,
        "watermark": "SUBSCRIBE TO @BYTEDISPATCH",
        "topicImage": "topic_image.jpg",
        "topicTitle": meta.get("topicTitle", "JENSEN HUANG"),
        "topicSubtitle": meta.get("topicSubtitle", "NVIDIA FOUNDER & CEO"),
        "statChange": meta.get("statChange", "-8.4%"),
        "statLabel": meta.get("statLabel", "NVIDIA (NVDA) STOCK REACTION"),
        "communityQuote": meta.get("communityQuote", "If Jensen leaves, Nvidia loses its entire AI moat. Nobody else commands Silicon Valley like this."),
        "communityAuthor": meta.get("communityAuthor", "@SiliconValleyDigest"),
        "pollQuestion": meta.get("pollQuestion", "CAN NVIDIA SURVIVE WITHOUT JENSEN?"),
        "pollOptionA": meta.get("pollOptionA", "NO — HE IS IRREPLACEABLE"),
        "pollOptionB": meta.get("pollOptionB", "YES — TOO BIG TO FAIL"),
        "pollPercentA": meta.get("pollPercentA", 74),
        "pollPercentB": meta.get("pollPercentB", 26),
    }
    props_path = os.path.join(REMOTION_DIR, "props.json")
    with open(props_path, "w", encoding="utf-8") as f:
        json.dump(props_data, f, indent=2)

    # 5. Render Remotion Video
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

    # 6. YouTube Upload
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
    import argparse
    parser = argparse.ArgumentParser(description="ByteDispatch Daily Shorts Generator")
    parser.add_argument("--topic", type=str, default=None, help="Custom topic topic text")
    parser.add_argument("--headline", type=str, default=None, help="Custom visual headline (all caps)")
    parser.add_argument("--script", type=str, default=None, help="Full custom spoken script")
    parser.add_argument("--upload", action="store_true", help="Automatically upload to YouTube after render")

    args = parser.parse_args()
    run_pipeline(
        custom_topic=args.topic,
        custom_headline=args.headline,
        custom_script=args.script,
        upload=args.upload
    )
