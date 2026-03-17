"use client"

import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  label?: string
}

export function Loader({ className, label = "Processando vídeo..." }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      {/* Spinning ring */}
      <div className="relative w-16 h-16">
        {/* Static track */}
        <span className="absolute inset-0 rounded-full border-2 border-border opacity-30" />
        {/* Spinning arc */}
        <span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin-ring"
          style={{ filter: "drop-shadow(0 0 6px oklch(0.65 0.22 250 / 0.7))" }}
        />
        {/* Center dot */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </span>
      </div>
      {/* Label */}
      {label && (
        <p className="text-sm text-muted-foreground tracking-wide animate-pulse">
          {label}
        </p>
      )}
    </div>
  )
}
