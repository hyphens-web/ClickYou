import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) return new Response("URL necessária", { status: 400 });

    const binPath = path.join(process.cwd(), "bin");
    const ytDlpPath = path.join(binPath, "yt-dlp.exe");
    const ffmpegPath = path.join(binPath, "ffmpeg.exe");

    // 1) pega o título do vídeo
    const title = await new Promise<string>((resolve) => {
      const titleProcess = spawn(ytDlpPath, ["--get-title", url], { shell: false, windowsHide: true });
      let data = "";
      titleProcess.stdout.on("data", (chunk) => data += chunk.toString("utf-8"));
      titleProcess.on("close", () => {
        const safeTitle = data.trim().replace(/[/\\?%*:|"<>]/g, "_");
        resolve(safeTitle || "audio_clickyou");
      });
      titleProcess.on("error", () => resolve("audio_clickyou"));
    });

    // 2) spawn para download direto em stream
    const ytProcess = spawn(
      ytDlpPath,
      [
        "--no-playlist",
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "--ffmpeg-location",
        ffmpegPath,
        "-o",
        "-", // envia para stdout
        url,
      ],
      { shell: false, windowsHide: true }
    );

    ytProcess.stderr.on("data", (d) => console.error(d.toString()));

    const stream = new ReadableStream({
      start(controller) {
        ytProcess.stdout.on("data", (chunk: Buffer) => {
          // envia bytes puros para o stream Web
          controller.enqueue(new Uint8Array(chunk));
        });
        ytProcess.on("close", (code) => {
          if (code === 0) controller.close();
          else controller.error(new Error(`Erro ao baixar áudio: ${code}`));
        });
        ytProcess.on("error", (err) => controller.error(err));
      },
      cancel() {
        ytProcess.kill();
      },
    });

    return new Response(stream as any, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${title}.mp3"`,
      },
    });

  } catch (err) {
    console.error(err);
    return new Response("Erro interno", { status: 500 });
  }
}