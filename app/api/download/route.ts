import { NextRequest } from "next/server";
import { spawn } from "child_process";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) return new Response("URL necessária", { status: 400 });

  try {
    spawn("yt-dlp", [
      "--no-playlist",
      "-f", "best[ext=mp4]",
      "-o", "-",
      url
    ]);

    return new Response(process.stdout as any, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="video.mp4"',
      },
    });
  } catch (error: any) {
    console.error(error);
    return new Response("Erro ao baixar vídeo", { status: 500 });
  }
}