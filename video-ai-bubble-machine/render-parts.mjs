#!/usr/bin/env node
// Renders every chapter (parts/partNN.html) to out/partNN.mp4 at 1920x1080 / 30fps with its
// voiceover muxed in, N chapters in parallel, then stitches final.mp4 (stream copy).
// Usage: bun render-parts.mjs [--jobs 3] [--force] [--only 4,5] [--no-stitch]
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const JOBS = Number(val('--jobs', 3));
const only = val('--only', '') ? val('--only', '').split(',').map(Number) : null;
const script = JSON.parse(readFileSync(join(__dirname, 'script.json'), 'utf8'));
const timing = JSON.parse(readFileSync(join(__dirname, 'timing.json'), 'utf8'));
const pad = (n) => String(n).padStart(2, '0');

function run(cmd, argv, env = {}, logFile) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, argv, { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const sink = (d) => { out += d; if (logFile) { try { writeFileSync(logFile, out); } catch {} } };
    p.stdout.on('data', sink); p.stderr.on('data', sink);
    p.on('exit', (c) => (c === 0 ? resolve(out) : reject(new Error(`${cmd} exited ${c}\n${out.slice(-1500)}`))));
  });
}

async function renderPart(id) {
  const out = join(__dirname, 'out', `part${pad(id)}.mp4`);
  if (existsSync(out) && !flag('--force')) { console.log(`part ${pad(id)}: cached`); return; }
  const raw = join(__dirname, 'out', `part${pad(id)}-video.mp4`);
  const t0 = Date.now();
  console.log(`part ${pad(id)}: rendering…`);
  await run('bun', [join(ROOT, 'scripts/render.mjs'), join(__dirname, 'parts', `part${pad(id)}.html`), raw, '1'],
    { REEL_W: '1920', REEL_H: '1080', REEL_FPS: '30' }, `/tmp/bubble-part${pad(id)}.log`);
  const dur = timing.parts.find((p) => p.id === id).duration;
  await run('ffmpeg', ['-y', '-i', raw, '-i', join(__dirname, 'audio', `part-${pad(id)}.wav`), '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(dur), '-movflags', '+faststart', out]);
  console.log(`part ${pad(id)}: done in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
}

const ids = script.parts.map((p) => p.id).filter((i) => !only || only.includes(i))
  .sort((a, b) => timing.parts.find((p) => p.id === b).duration - timing.parts.find((p) => p.id === a).duration); // longest first
const queue = [...ids]; let failed = 0;
await Promise.all(Array.from({ length: JOBS }, async () => {
  while (queue.length) { const id = queue.shift(); try { await renderPart(id); } catch (e) { failed++; console.error(`part ${pad(id)} FAILED`, e.message); } }
}));
if (failed) { console.error(`${failed} part(s) failed`); process.exit(1); }

if (!flag('--no-stitch')) {
  const list = script.parts.map((p) => `file '${join(__dirname, 'out', `part${pad(p.id)}.mp4`)}'`).join('\n');
  writeFileSync(join(__dirname, 'out', 'concat.txt'), list + '\n');
  await run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', join(__dirname, 'out', 'concat.txt'), '-c', 'copy', '-movflags', '+faststart', join(__dirname, 'out', 'final.mp4')]);
  console.log('ALL DONE: ' + join(__dirname, 'out', 'final.mp4'));
}
