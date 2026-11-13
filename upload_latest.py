import os
import sys
import glob
from youtube_uploader import upload_short

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE_DIR, "out")

def upload_latest_video(privacy_status="public"):
    # Find all mp4 files in out/
    mp4_files = glob.glob(os.path.join(OUT_DIR, "*.mp4"))
    if not mp4_files:
        print(f"[Error] No rendered MP4 videos found in '{OUT_DIR}'.")
        print("Run 'python generate_daily_short.py' first to render a video.")
        return None

    # Pick the most recently modified video
    latest_video = max(mp4_files, key=os.path.getmtime)
    filename = os.path.basename(latest_video)
    print(f"🎬 Found latest video: {filename}")

    # Generate a punchy default title from filename or story
    title = "The Internet is Losing Its Mind Over This"
    if "Jensen" in filename or "Short_" in filename:
        title = "Jensen Huang Resigns - What Actually Happened?"

    description = (
        f"{title}\n\n"
        "Daily trending internet and tech stories by ByteDispatch.\n\n"
        "🔔 Subscribe to @ByteDispatch for your daily internet briefing.\n\n"
        "#Shorts #TechNews #InternetTrends #ByteDispatch #Trending"
    )

    tags = ["Shorts", "TechNews", "InternetTrends", "ByteDispatch", "Trending", "BreakingNews"]

    print(f"🚀 Uploading '{filename}' to YouTube as '{privacy_status}'...")
    url = upload_short(
        video_path=latest_video,
        title=title,
        description=description,
        tags=tags,
        privacy_status=privacy_status
    )
    print(f"\n🎉 DONE! View your Short live at:\n{url}")
    return url

if __name__ == "__main__":
    privacy = "unlisted" if "--unlisted" in sys.argv else "public"
    upload_latest_video(privacy_status=privacy)
