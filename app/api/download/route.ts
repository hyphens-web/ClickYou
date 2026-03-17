import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { Readable } from "stream";
import fs from "fs";

console.log(fs.existsSync("./cookies.txt"));

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("URL necessária", { status: 400 });
  }

  try {
    const process = spawn("yt-dlp", [
      "--no-playlist",
      "-f", "18",
      "--cookies", "./cookies.txt",
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "-o", "-",
      url
    ]);

    const stream = Readable.toWeb(process.stdout as any);

    process.stderr.on("data", (data) => {
      console.error("yt-dlp:", data.toString());
    });

    return new Response(stream as any, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'attachment; filename="video.mp4"',
      },
    });

  } catch (error) {
    console.error(error);
    return new Response("Erro ao baixar vídeo", { status: 500 });
  }
}