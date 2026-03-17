import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return new Response("URL necessária", { status: 400 });

  const binPath = path.join(process.cwd(), "bin");
  const ytDlpPath = path.join(binPath, "yt-dlp.exe");
  const ffmpegPath = path.join(binPath, "ffmpeg.exe");

  const ls = spawn(
    ytDlpPath,
// ... dentro do spawn do Áudio
[
    "--no-playlist", // ADICIONE ISSO AQUI
    url,
    "-o", "-", 
    "-x", 
    "--audio-format", "mp3", 
    "--audio-quality", "0", 
    "--ffmpeg-location", ffmpegPath,
  ],
    { shell: true, windowsHide: true }
  );

  const stream = new ReadableStream({
    start(controller) {
      ls.stdout.on("data", (chunk) => controller.enqueue(new Uint8Array(chunk)));
      ls.on("close", (code) => {
        if (code === 0) controller.close();
        else controller.error(new Error(`Erro: ${code}`));
      });
      ls.on("error", (err) => controller.error(err));
    },
    cancel() { ls.kill(); },
  });

  return new Response(stream as any, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="audio_clickyou.mp3"',
      "Cache-Control": "no-cache",
    },
  });
}