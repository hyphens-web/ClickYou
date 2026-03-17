#!/usr/bin/env python3
"""
YouTube downloader service using yt-dlp
Extracts video info and prepares for download
"""

import json
import sys
import subprocess
from pathlib import Path

def get_video_info(url: str) -> dict:
    """Extract video information from YouTube URL"""
    try:
        result = subprocess.run(
            [
                "yt-dlp",
                "--dump-json",
                "--no-warnings",
                url
            ],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            return {"error": "Failed to fetch video info"}
        
        data = json.loads(result.stdout)
        
        return {
            "title": data.get("title", "Unknown"),
            "duration": data.get("duration", 0),
            "thumbnail": data.get("thumbnail", ""),
            "channel": data.get("uploader", "Unknown"),
            "formats": data.get("formats", [])
        }
    except Exception as e:
        return {"error": str(e)}

def download_video(url: str, format_id: str, quality: str) -> str:
    """Download video in specified format and quality"""
    try:
        output_template = "/tmp/%(title).100s.%(ext)s"
        
        # Build yt-dlp command based on format
        if format_id == "mp3":
            cmd = [
                "yt-dlp",
                "-f", "bestaudio/best",
                "-x", "--audio-format", "mp3",
                "-o", output_template,
                url
            ]
        else:
            # Map quality to format string
            quality_map = {
                "1080": "bestvideo[height=1080]+bestaudio",
                "720": "bestvideo[height=720]+bestaudio",
                "480": "bestvideo[height=480]+bestaudio",
            }
            format_str = quality_map.get(quality, "bestvideo+bestaudio")
            
            cmd = [
                "yt-dlp",
                "-f", format_str,
                "-o", output_template,
                url
            ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            return json.dumps({"error": result.stderr})
        
        # Find the downloaded file
        files = list(Path("/tmp").glob("*.mp*")) + list(Path("/tmp").glob("*.webm")) + list(Path("/tmp").glob("*.mkv"))
        if files:
            latest = max(files, key=lambda p: p.stat().st_mtime)
            return json.dumps({"path": str(latest)})
        
        return json.dumps({"error": "Download completed but file not found"})
        
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python youtube_downloader.py [info|download] ..."}))
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "info" and len(sys.argv) > 2:
        result = get_video_info(sys.argv[2])
        print(json.dumps(result))
    elif command == "download" and len(sys.argv) > 4:
        result = download_video(sys.argv[2], sys.argv[3], sys.argv[4])
        print(result)
    else:
        print(json.dumps({"error": "Invalid arguments"}))
        sys.exit(1)
