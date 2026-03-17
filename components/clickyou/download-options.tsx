"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export interface VideoInfo {
  title: string
  thumbnail: string
  channel: string
  duration: string
}

interface DownloadOptionsProps {
  videoInfo: VideoInfo
  url: string
}

const formats = [
  {
    id: "mp4-1080",
    label: "MP4",
    quality: "1080p",
    badge: "Full HD",
    size: "~180 MB",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "oklch(0.65 0.22 250)",
    accentDim: "oklch(0.65 0.22 250 / 0.12)",
  },
  {
    id: "mp4-720",
    label: "MP4",
    quality: "720p",
    badge: "HD",
    size: "~90 MB",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "oklch(0.62 0.18 200)",
    accentDim: "oklch(0.62 0.18 200 / 0.12)",
  },
  {
    id: "mp3",
    label: "MP3",
    quality: "Áudio",
    badge: "320 kbps",
    size: "~8 MB",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: "oklch(0.72 0.18 30)",
    accentDim: "oklch(0.72 0.18 30 / 0.12)",
  },
]

function FormatCard({
  fmt,
  videoTitle,
  videoUrl,
}: {
  fmt: (typeof formats)[0]
  videoTitle: string
  videoUrl: string
}) {
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const handleDownload = () => {
    setDownloading(true);
    setDone(false);
  
    // Define qual rota usar: se o formato for 'mp3', usa a nova rota de áudio
    const apiRoute = fmt.id === "mp3" ? "/api/download-audio" : "/api/download";
    const apiURL = `${apiRoute}?url=${encodeURIComponent(videoUrl)}`;
  
    // Cria o link invisível para forçar o "Salvar Como"
    const a = document.createElement("a");
    a.href = apiURL;
    
    // Define a extensão correta para o arquivo
    const extension = fmt.id === "mp3" ? "mp3" : "mp4";
    const cleanTitle = videoTitle.replace(/[\\/:"*?<>|]/g, "");
    a.setAttribute("download", `${cleanTitle}.${extension}`);
  
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    // Feedback visual
    setTimeout(() => {
      setDone(true);
      setDownloading(false);
    }, 2000);
  };

  // ... restante do seu componente de UI (o return do FormatCard)

  return (
    <div
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 group hover:scale-[1.02]"
      style={
        {
          "--card-accent": fmt.accent,
          "--card-accent-dim": fmt.accentDim,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: fmt.accentDim, color: fmt.accent }}
          >
            {fmt.icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {fmt.label}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: fmt.accentDim,
                  color: fmt.accent,
                }}
              >
                {fmt.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fmt.quality} • {fmt.size}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className={cn(
          "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-white",
          "active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        )}
        style={{
          background: done
            ? "oklch(0.62 0.17 150)" // Verde se concluído
            : downloading
            ? "oklch(0.35 0.01 250)" // Cinza se baixando
            : fmt.accent,            // Cor do formato
        }}
      >
        {downloading ? "Baixando..." : done ? "Pronto!" : `Download ${fmt.label}`}
      </button>
    </div>
  )
}

export function DownloadOptions({ videoInfo, url }: DownloadOptionsProps) {
  return (
    <div className="flex flex-col gap-6 animate-float-up">
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5 bg-white/5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-0">
          <div className="relative sm:w-56 h-36 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-full object-cover"
            />
            <span
              className="absolute bottom-2 right-2 text-xs text-white px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.7)" }}
            >
              {videoInfo.duration}
            </span>
          </div>

          <div className="p-5 flex flex-col justify-center gap-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Vídeo detectado
            </p>
            <h2 className="text-base font-semibold text-foreground line-clamp-2 leading-tight">
              {videoInfo.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {videoInfo.channel}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">
          Escolha o formato
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formats.map((fmt) => (
            <FormatCard
              key={fmt.id}
              fmt={fmt}
              videoTitle={videoInfo.title}
              videoUrl={url}
            />
          ))}
        </div>
      </div>
    </div>
  )
}