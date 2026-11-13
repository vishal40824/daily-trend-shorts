import os
import sys
import json
import time
import datetime
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
TOKEN_FILE = os.path.join(os.path.dirname(__file__), "token.json")
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), "client_secrets.json")

def get_authenticated_service():
    """
    Authenticates with YouTube Data API v3 using OAuth2.
    """
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRETS_FILE):
                raise FileNotFoundError(
                    f"'{CLIENT_SECRETS_FILE}' not found! "
                    "Please download your OAuth 2.0 Client Secret from Google Cloud Console "
                    "and place it at 'd:\\AI gen videos\\client_secrets.json'."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    return build("youtube", "v3", credentials=creds)

def upload_short(
    video_path: str,
    title: str,
    description: str,
    tags: list = None,
    privacy_status: str = "public",
    scheduled_time_iso: str = None  # e.g., '2026-11-13T19:00:00.000Z'
):
    """
    Uploads a video to YouTube as a Short with real-time progress chunking.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    youtube = get_authenticated_service()

    if tags is None:
        tags = ["Shorts", "Trending", "TechNews", "Viral", "ByteDispatch"]

    # Ensure title contains #Shorts for automatic indexing
    if "#Shorts" not in title and "#shorts" not in title:
        title = f"{title} #Shorts"

    body = {
        "snippet": {
            "title": title[:100],
            "description": description,
            "tags": tags,
            "categoryId": "28"  # Science & Technology
        },
        "status": {
            "privacyStatus": "private" if scheduled_time_iso else privacy_status.lower(),
            "selfDeclaredMadeForKids": False,
        }
    }

    if scheduled_time_iso:
        body["status"]["publishAt"] = scheduled_time_iso
        body["status"]["privacyStatus"] = "private"

    file_size = os.path.getsize(video_path)
    file_size_mb = file_size / (1024 * 1024)

    # 1MB chunk size (must be multiple of 256KB) for real-time progress updates
    chunk_size = 1024 * 1024
    media = MediaFileUpload(video_path, chunksize=chunk_size, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    print(f"\n[YouTubeUploader] 📡 Starting upload: '{os.path.basename(video_path)}' ({file_size_mb:.1f} MB)")
    print(f"[YouTubeUploader] 🔒 Privacy Mode: {privacy_status.upper()}")
    print(f"[YouTubeUploader] 📝 Title: {title}\n")

    start_time = time.time()
    response = None
    last_printed_pct = -1

    while response is None:
        status, response = request.next_chunk()
        if status:
            progress = status.progress()
            pct = int(progress * 100)
            bytes_sent = int(progress * file_size)
            mb_sent = bytes_sent / (1024 * 1024)
            elapsed = time.time() - start_time
            speed = mb_sent / elapsed if elapsed > 0 else 0
            bar_len = 25
            filled = int(bar_len * progress)
            bar = "=" * filled + (">" if filled < bar_len else "") + " " * (bar_len - filled - (1 if filled < bar_len else 0))
            sys.stdout.write(f"\r[YouTubeUploader] 🚀 [{bar}] {progress * 100:5.1f}% ({mb_sent:4.1f}/{file_size_mb:4.1f} MB) @ {speed:3.1f} MB/s ")
            sys.stdout.flush()

    sys.stdout.write(f"\r[YouTubeUploader] 🚀 [{'=' * 25}] 100.0% ({file_size_mb:4.1f}/{file_size_mb:4.1f} MB) — Finalizing upload!           \n\n")
    sys.stdout.flush()

    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    watch_url = f"https://www.youtube.com/watch?v={video_id}"
    studio_url = f"https://studio.youtube.com/video/{video_id}/edit"

    print("=" * 64)
    print(f"  🎉 UPLOAD SUCCESSFUL & PROCESSED BY YOUTUBE!")
    print("=" * 64)
    print(f"🎬 Video ID:      {video_id}")
    print(f"🔗 Direct Shorts: {video_url}")
    print(f"📺 Watch URL:     {watch_url}")
    print(f"⚙️ Studio Editor: {studio_url}")
    print("=" * 64)
    if privacy_status.lower() == "unlisted":
        print("💡 NOTE ON UNLISTED VIDEOS:")
        print("   • Unlisted videos do NOT show on your public channel page.")
        print("   • Anyone with the link above can view it.")
        print("   • You can also change it to 'Public' anytime from YouTube Studio.")
    elif privacy_status.lower() == "public":
        print("🌟 NOTE ON PUBLIC VIDEOS:")
        print("   • Video is live! YouTube algorithm will index it into the Shorts feed.")
    print("=" * 64 + "\n")

    return video_url

if __name__ == "__main__":
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"[Notice] '{CLIENT_SECRETS_FILE}' is required for automated YouTube uploads.")
    else:
        print("[YouTubeUploader] Client secrets detected and ready.")
        try:
            service = get_authenticated_service()
            print("[YouTubeUploader] ✅ Authentication SUCCESSFUL! token.json active.")
        except Exception as e:
            print(f"[YouTubeUploader] ❌ Auth error: {e}")
