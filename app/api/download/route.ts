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
    const ytDlpPath = path.join(binPath, "yt-dlp");
    const ffmpegPath = path.join(binPath, "ffmpeg");

    // 1) Pega o título do vídeo
    const title = await new Promise<string>((resolve) => {
      const titleProcess = spawn(ytDlpPath, ["--get-title", url], { shell: false, windowsHide: true });
      let data = "";
      titleProcess.stdout.on("data", (chunk) => data += chunk.toString("utf-8"));
      titleProcess.on("close", () => {
        const safeTitle = data.trim().replace(/[/\\?%*:|"<>]/g, "_");
        resolve(safeTitle || "video_clickyou");
      });
      titleProcess.on("error", () => resolve("video_clickyou"));
    });

    // 2) Baixa o vídeo direto com qualidade moderada
    const ytProcess = spawn(
      "yt-dlp",
      [
        "--no-playlist",
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "--ffmpeg-location",
        "ffmpeg",
        "-o",
        "-",
        url,
      ],
      { shell: false }
    );

    ytProcess.stderr.on("data", (d) => console.error(d.toString()));

    const stream = new ReadableStream({
      start(controller) {
        ytProcess.stdout.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
        ytProcess.on("close", (code) => {
          if (code === 0) controller.close();
          else controller.error(new Error(`Erro ao baixar vídeo: ${code}`));
        });
        ytProcess.on("error", (err) => controller.error(err));
      },
      cancel() {
        ytProcess.kill();
      },
    });

    return new Response(stream as any, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${title}.mp4"`,
      },
    });

  } catch (err) {
    console.error(err);
    return new Response("Erro interno", { status: 500 });
  }
}