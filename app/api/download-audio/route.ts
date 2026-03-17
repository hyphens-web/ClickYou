import { NextRequest } from "next/server";
import ytdl from "@distube/ytdl-core";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return new Response("URL necessária", { status: 400 });

  try {
    const audioStream = ytdl(url, {
      filter: "audioonly", // Aqui dizemos para pegar só o áudio
      quality: "highestaudio", // Melhor qualidade de som disponível
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    });

    return new Response(audioStream as any, {
      headers: {
        "Content-Type": "audio/mpeg", // Formato MP3
        "Content-Disposition": 'attachment; filename="musica_clickyou.mp3"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Erro no MP3:", error.message);
    return new Response(`Erro ao processar áudio: ${error.message}`, { status: 500 });
  }
}