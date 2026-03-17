import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  const format = searchParams.get("format") || "mp3"

  if (!url) return new Response("URL necessária", { status: 400 })

  // Link de API externa que processa YouTube para download
  let targetUrl = ""
  if (format === "mp3") {
    targetUrl = `https://api.vega-downloader.com/youtube/audio?url=${encodeURIComponent(url)}`
  } else {
    targetUrl = `https://api.vega-downloader.com/youtube/video?url=${encodeURIComponent(url)}`
  }

  // redireciona para o download direto no navegador
  return NextResponse.redirect(targetUrl)
}