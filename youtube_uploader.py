import os
import sys
import json
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
    Uploads a video to YouTube as a Short.
    If scheduled_time_iso is provided, video is set to private until the publish timestamp.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    youtube = get_authenticated_service()

    if tags is None:
        tags = ["Shorts", "Trending", "TechNews", "Viral"]

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
            "privacyStatus": "private" if scheduled_time_iso else privacy_status,
            "selfDeclaredMadeForKids": False,
        }
    }

    if scheduled_time_iso:
        body["status"]["publishAt"] = scheduled_time_iso
        body["status"]["privacyStatus"] = "private"

    media = MediaFileUpload(video_path, chunksize=-1, resumable=True, mimetype="video/mp4")
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    print(f"[YouTubeUploader] Uploading '{video_path}' to YouTube...")
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"[YouTubeUploader] Upload progress: {int(status.progress() * 100)}%")

    video_id = response.get("id")
    video_url = f"https://www.youtube.com/shorts/{video_id}"
    print(f"[YouTubeUploader] Successfully uploaded! Video URL: {video_url}")
    return video_url

if __name__ == "__main__":
    if not os.path.exists(CLIENT_SECRETS_FILE):
        print(f"[Notice] '{CLIENT_SECRETS_FILE}' is required for automated YouTube uploads.")
    else:
        print("[YouTubeUploader] Client secrets detected and ready.")
        print("[YouTubeUploader] Authenticating with YouTube...")
        try:
            service = get_authenticated_service()
            print("[YouTubeUploader] ✅ Authentication SUCCESSFUL! token.json saved.")
            print("[YouTubeUploader] Your automated YouTube Shorts pipeline is 100% connected and ready!")
        except Exception as e:
            print(f"[YouTubeUploader] ❌ Authentication error: {e}")
            print("\n💡 TIP: In Google Cloud Console, make sure you went to 'OAuth consent screen' -> 'Test users' and added your email 'bytedispatch.media@gmail.com'.")
