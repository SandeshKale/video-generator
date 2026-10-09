// Minimal zero-dependency static file server, used to serve a Vite `dist/`
// build over http://127.0.0.1 for rendering. Needed because Chromium
// enforces CORS on `type="module"` script loads even over file://, which
// breaks a plain file:// load of a Vite build (classic <script> reels don't
// hit this — only the React/Vite ES-module output does).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
};

export function serveDir(rootDir) {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        let reqPath = decodeURIComponent(req.url.split('?')[0]);
        if (reqPath === '/') reqPath = '/index.html';
        const filePath = normalize(join(rootDir, reqPath));
        if (!filePath.startsWith(normalize(rootDir))) {
          res.writeHead(403);
          res.end();
          return;
        }
        const st = await stat(filePath).catch(() => null);
        if (!st || !st.isFile()) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const body = await readFile(filePath);
        const type = MIME[extname(filePath)] || 'application/octet-stream';
        // <video> seeking over HTTP needs byte-range support; without it currentTime changes never show new frames.
        const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
        if (m && (m[1] || m[2])) {
          const start = m[1] ? Number(m[1]) : Math.max(0, body.length - Number(m[2]));
          const end = m[1] && m[2] ? Math.min(Number(m[2]), body.length - 1) : body.length - 1;
          if (start > end || start >= body.length) {
            res.writeHead(416, { 'Content-Range': `bytes */${body.length}` });
            res.end();
            return;
          }
          res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
          res.end(body.subarray(start, end + 1));
          return;
        }
        res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': body.length });
        res.end(body);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) });
    });
    server.on('error', reject);
  });
}
