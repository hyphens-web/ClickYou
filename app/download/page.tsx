"use client"

import { Suspense } from "react"
import { DownloadPageClient } from "@/components/clickyou/download-page-client"
// Importe seu componente de Loader se quiser um visual bonito durante o carregamento
import { Loader } from "@/components/clickyou/loader" 

export default function DownloadPage() {
  return (
    // O Suspense é o que "cura" o erro de build da Vercel
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader label="Carregando ferramentas de download..." />
      </div>
    }>
      <DownloadPageClient />
    </Suspense>
  )
}