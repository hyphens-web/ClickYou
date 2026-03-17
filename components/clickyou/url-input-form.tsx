"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"

export function UrlInputForm() {
  const [url, setUrl] = useState("")
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const isValidYouTube = (value: string) => {
    return (
      value.includes("youtube.com/watch") ||
      value.includes("youtu.be/") ||
      value.includes("youtube.com/shorts/")
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Cole um link do YouTube aqui.")
      inputRef.current?.focus()
      return
    }

    if (!isValidYouTube(url)) {
      setError("Link inválido. Use um link do YouTube.")
      return
    }

    const encoded = encodeURIComponent(url.trim())
    router.push(`/download?url=${encoded}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" noValidate>
      <div
        className="relative rounded-2xl transition-all duration-300"
        style={{
          background: "oklch(0.13 0.008 265)",
          border: `1px solid ${focused ? "oklch(0.65 0.22 250 / 0.6)" : "oklch(0.22 0.015 265)"}`,
          boxShadow: focused
            ? "0 0 0 4px oklch(0.65 0.22 250 / 0.12), 0 0 30px oklch(0.65 0.22 250 / 0.15)"
            : "0 4px 24px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* YouTube icon inside input */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"
              fill="oklch(0.65 0.22 250 / 0.6)"
            />
            <path d="M9.75 15.02V8.98L15.5 12l-5.75 3.02z" fill="white" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError("")
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Cole o link do YouTube aqui..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base py-4 pl-11 pr-36 outline-none rounded-2xl"
          aria-label="Link do YouTube"
          autoComplete="off"
          spellCheck={false}
        />

        {/* Submit button inside the input */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground transition-all duration-200 active:scale-95 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, oklch(0.65 0.22 250), oklch(0.55 0.2 220))",
            boxShadow: "0 2px 12px oklch(0.65 0.22 250 / 0.35)",
          }}
        >
          Baixar
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive text-center animate-float-up" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
