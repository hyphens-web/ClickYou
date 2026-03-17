import { NextRequest, NextResponse } from "next/server"

// Using a free YouTube data extraction service
// In production, you'd want to use yt-dlp or similar
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url")
    
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      )
    }

    // Extract video ID from YouTube URL
    let videoId = ""
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        videoId = match[1]
        break
      }
    }

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      )
    }

    // Use YouTube OEmbed API (no auth required) for basic info
    const embedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    
    if (!embedResponse.ok) {
      throw new Error("Failed to fetch video info")
    }

    const embedData = await embedResponse.json()
    
    // Mock data for demonstration - in production integrate with yt-dlp or similar
    const videoInfo = {
      id: videoId,
      title: embedData.title || "Unknown Title",
      channel: embedData.author_name || "Unknown Channel",
      thumbnail: embedData.thumbnail_url || "",
      duration: "3:45", // This would come from actual video info
    }

    return NextResponse.json(videoInfo)
  } catch (error) {
    console.error("[v0] YouTube info error:", error)
    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    )
  }
}
