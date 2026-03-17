"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Logo({ size = "md", className }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  }
  const s = sizes[size]

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Icon mark */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-primary shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        {/* Play triangle */}
        <svg
          width={s.icon * 0.45}
          height={s.icon * 0.45}
          viewBox="0 0 12 14"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1L11 7L1 13V1Z" fill="white" />
        </svg>
        {/* Glow ring */}
        <span
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: "0 0 12px oklch(0.65 0.22 250 / 0.6)" }}
        />
      </div>

      {/* Wordmark */}
      <span className={cn("font-bold tracking-tight leading-none", s.text)}>
        <span className="text-foreground">Click</span>
        <span className="text-primary">You</span>
      </span>
    </div>
  )
}
