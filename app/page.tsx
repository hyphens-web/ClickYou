"use client"

import { NavBar } from "@/components/clickyou/navbar"
import { Logo } from "@/components/clickyou/logo"
import { UrlInputForm } from "@/components/clickyou/url-input-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Radial glow center */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.22 250 / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <NavBar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Hero section */}
        <section className="flex flex-col items-center gap-8 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-primary tracking-widest uppercase"
            style={{
              background: "oklch(0.65 0.22 250 / 0.1)",
              border: "1px solid oklch(0.65 0.22 250 / 0.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
              aria-hidden="true"
            />
            YouTube Downloader
          </div>

          {/* Logo */}
          <Logo size="lg" />

          {/* Tagline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-balance">
              Baixe qualquer vídeo{" "}
              <span className="text-gradient">instantaneamente</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl mx-auto">
              Cole o link, escolha o formato e faça o download em segundos.
              MP4 em alta definição ou apenas o áudio em MP3.
            </p>
          </div>

          {/* Input form */}
          <div className="w-full animate-float-up">
            <UrlInputForm />
          </div>

          {/* Supported formats */}
          <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
            {["MP4 1080p", "MP4 720p", "MP4 480p", "MP3"].map((fmt) => (
              <span
                key={fmt}
                className="text-xs px-3 py-1 rounded-full text-muted-foreground"
                style={{
                  background: "oklch(0.16 0.01 265)",
                  border: "1px solid oklch(0.22 0.015 265)",
                }}
              >
                {fmt}
              </span>
            ))}
          </div>
        </section>

        {/* Feature hints */}
        <section
          className="mt-24 mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto"
          aria-label="Recursos"
        >
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Rápido",
              desc: "Download em segundos, sem espera.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Seguro",
              desc: "Sem cadastro, sem rastreamento.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Multi-formato",
              desc: "MP4 em 4 qualidades + MP3 de áudio.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="glass-card flex flex-col items-center gap-3 p-5 rounded-2xl text-center group transition-all duration-300 cursor-default"
              style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "oklch(0.65 0.22 250 / 0.4)"
                el.style.boxShadow = "0 0 20px oklch(0.65 0.22 250 / 0.1)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "oklch(0.22 0.015 265)"
                el.style.boxShadow = "none"
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-primary"
                style={{ background: "oklch(0.65 0.22 250 / 0.12)" }}
              >
                {icon}
              </div>
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>
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
