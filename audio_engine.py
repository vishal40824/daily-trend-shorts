import asyncio
import json
import os
import re
import sys
import edge_tts

# Default natural broadcast voice:
# en-US-ChristopherNeural: Deep, engaging documentary style
# en-US-GuyNeural: Fast-paced, punchy tech narrator style
DEFAULT_VOICE = "en-US-ChristopherNeural"

async def generate_speech_and_captions(
    text: str,
    output_mp3: str,
    output_json: str,
    voice: str = DEFAULT_VOICE,
    rate: str = "+4%"  # Slight speed boost for high-retention shorts
):
    """
    Synthesizes speech using Microsoft Edge Neural TTS (100% Free)
    and produces word-level timestamps in Remotion Caption JSON format.
    """
    communicate = edge_tts.Communicate(text, voice, rate=rate)

    sentences = []
    audio_chunks = []

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            sentences.append({
                "text": chunk["text"],
                "offset": chunk["offset"],       # in 100ns units
                "duration": chunk["duration"]    # in 100ns units
            })

    # Save audio file
    os.makedirs(os.path.dirname(os.path.abspath(output_mp3)), exist_ok=True)
    with open(output_mp3, "wb") as f:
        for chunk in audio_chunks:
            f.write(chunk)

    # Convert sentence boundaries into word-level timestamps
    captions = []
    global_word_idx = 0
    for s in sentences:
        start_ms = s["offset"] / 10000.0
        dur_ms = s["duration"] / 10000.0
        
        words = s["text"].strip().split()
        if not words:
            continue

        total_len = sum(len(w) for w in words)
        cursor_ms = start_ms

        for w in words:
            ratio = len(w) / total_len if total_len > 0 else (1.0 / len(words))
            word_dur = dur_ms * ratio

            clean_word = re.sub(r"[^\w\$\%\@\#\']", "", w)
            if not clean_word:
                clean_word = w

            # Remotion captions break pages on leading spaces
            token_text = clean_word if global_word_idx == 0 else f" {clean_word}"
            global_word_idx += 1

            captions.append({
                "text": token_text,
                "startMs": round(cursor_ms),
                "endMs": round(cursor_ms + word_dur),
                "timestampMs": round(cursor_ms),
                "confidence": 1.0
            })
            cursor_ms += word_dur

    # Save captions JSON
    os.makedirs(os.path.dirname(os.path.abspath(output_json)), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(captions, f, indent=2)

    total_duration_sec = (captions[-1]["endMs"] / 1000.0) if captions else 10.0
    print(f"[AudioEngine] Synthesized {len(captions)} words ({total_duration_sec:.2f}s) to {output_mp3}")
    return total_duration_sec, captions

def create_audio(text: str, output_mp3: str, output_json: str, voice: str = DEFAULT_VOICE):
    return asyncio.run(generate_speech_and_captions(text, output_mp3, output_json, voice))

if __name__ == "__main__":
    test_text = (
        "Did you know a hidden setting in Chrome is secretly draining your laptop battery? "
        "Engineers just discovered background tabs are consuming twice as much RAM as reported. "
        "Here is what you need to disable right now."
    )
    mp3_path = os.path.join(os.path.dirname(__file__), "shorts-animator", "public", "audio.mp3")
    json_path = os.path.join(os.path.dirname(__file__), "shorts-animator", "public", "audio.json")
    create_audio(test_text, mp3_path, json_path)
