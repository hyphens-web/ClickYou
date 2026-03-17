#!/usr/bin/env node
/**
 * Simple yt-dlp HTTP server wrapper
 * Allows Next.js API routes to call yt-dlp downloads
 * Run with: node scripts/yt-dlp-server.js
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.YTDLP_PORT || 8081;
const DOWNLOAD_DIR = path.join(__dirname, '..', '.downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/download') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const params = JSON.parse(body);
      const { url: videoUrl, format, quality } = params;

      if (!videoUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'URL is required' }));
        return;
      }

      console.log(`[yt-dlp-server] Download request: format=${format}, quality=${quality}, url=${videoUrl}`);

      const downloadUrl = await downloadVideo(videoUrl, format, quality);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url: downloadUrl, success: true }));
    } catch (error) {
      console.error('[yt-dlp-server] Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

async function downloadVideo(videoUrl, format, quality) {
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}_video.${format === 'mp3' ? 'mp3' : 'mp4'}`;
    const outputPath = path.join(DOWNLOAD_DIR, filename);

    let args = [];

    if (format === 'mp3') {
      args = [
        videoUrl,
        '-x',
        '--audio-format',
        'mp3',
        '--audio-quality',
        '320K',
        '-o',
        outputPath,
        '--quiet',
        '--no-warnings',
      ];
    } else {
      const qualityMap = {
        '1080': 'bestvideo[height=1080]+bestaudio',
        '720': 'bestvideo[height=720]+bestaudio',
        '480': 'bestvideo[height=480]+bestaudio',
      };

      const formatStr = qualityMap[quality] || 'bestvideo+bestaudio';

      args = [
        '-f',
        formatStr,
        '--merge-output-format',
        'mp4',
        videoUrl,
        '-o',
        outputPath,
        '--quiet',
        '--no-warnings',
      ];
    }

    const ytdlp = spawn('yt-dlp', args);

    let stderr = '';

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`[yt-dlp-server] Download complete: ${filename}`);
        // Return a URL that can be served
        resolve(`http://localhost:${PORT}/downloads/${filename}`);
      } else {
        reject(new Error(`yt-dlp failed with code ${code}: ${stderr}`));
      }
    });

    ytdlp.on('error', (error) => {
      reject(new Error(`Failed to spawn yt-dlp: ${error.message}`));
    });
  });
}

// Serve downloaded files
server.on('request', (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith('/downloads/')) {
    const filename = path.basename(parsedUrl.pathname);
    const filePath = path.join(DOWNLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      const ext = path.extname(filename).toLowerCase();
      const contentType =
        ext === '.mp3' ? 'audio/mpeg' : ext === '.mp4' ? 'video/mp4' : 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });

      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }
});

server.listen(PORT, () => {
  console.log(`[yt-dlp-server] Server running on http://localhost:${PORT}`);
  console.log(`[yt-dlp-server] Download directory: ${DOWNLOAD_DIR}`);
  console.log('[yt-dlp-server] Make sure yt-dlp is installed: pip install yt-dlp');
});

process.on('SIGINT', () => {
  console.log('[yt-dlp-server] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
