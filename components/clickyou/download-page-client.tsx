"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader } from "./loader"
import { DownloadOptions } from "./download-options"
import { NavBar } from "./navbar"
import { Logo } from "./logo"

interface VideoInfo {
  title: string
  thumbnail: string
  channel: string
  duration: string
}

// Fetch real video info from YouTube via API
async function getVideoInfo(url: string): Promise<VideoInfo> {
  const response = await fetch(`/api/youtube-info?url=${encodeURIComponent(url)}`)
  if (!response.ok) {
    throw new Error("Failed to fetch video info")
  }
  const data = await response.json()
  
  // Construct full thumbnail URL if needed
  const videoId = extractVideoId(url)
  return {
    title: data.title || "Unknown Title",
    thumbnail: data.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""),
    channel: data.channel || "Unknown Channel",
    duration: data.duration || "00:00",
  }
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1)
    return u.searchParams.get("v")
  } catch {
    return null
  }
}

export function DownloadPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawUrl = searchParams.get("url") || ""
  const url = decodeURIComponent(rawUrl)

  const [loading, setLoading] = useState(true)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!url) {
      router.replace("/")
      return
    }

    // Fetch video metadata from API
    const fetchVideoInfo = async () => {
      try {
        const info = await getVideoInfo(url)
        setVideoInfo(info)
      } catch (err) {
        console.error("[v0] Error fetching video info:", err)
        setError("Não foi possível obter informações do vídeo. Verifique se a URL está correta.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideoInfo()
  }, [url, router])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at top, oklch(0.65 0.22 250 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <NavBar />

      <main className="relative z-10 flex flex-col items-center min-h-screen pt-28 px-6 pb-16">
        {/* Back link */}
        <div className="w-full max-w-2xl mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </Link>
        </div>

        {/* Content */}
        <div className="w-full max-w-2xl">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 animate-float-up">
              <Loader label="Obtendo informações do vídeo..." />
            </div>
          )}

          {!loading && error && (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "oklch(0.13 0.008 265)",
                border: "1px solid oklch(0.577 0.245 27.325 / 0.3)",
              }}
            >
              <p className="text-destructive text-sm mb-4">{error}</p>
              <Link
                href="/"
                className="text-sm text-primary hover:underline"
              >
                Tente novamente
              </Link>
            </div>
          )}

          {!loading && videoInfo && (
            <DownloadOptions videoInfo={videoInfo} url={url} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6 text-xs text-muted-foreground">
        <p>
          ClickYou &copy; {new Date().getFullYear()} &mdash; Apenas para uso pessoal e conteúdo livre de direitos.
        </p>
      </footer>
    </div>
  )
}
