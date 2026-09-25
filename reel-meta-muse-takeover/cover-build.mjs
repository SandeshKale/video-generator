#!/usr/bin/env node
// Purpose-built cover/thumbnail for "Amazon Blocked It. Five Other Giants
// Didn't." — not a frame grab. Same "Signal Wave" visual system (Plus
// Jakarta Sans/Inter/JetBrains Mono, espresso-charcoal/amber/violet,
// ripple+waveform texture, chat-bubble language) but its own composition:
// a radial burst from the Muse mark — five connected lines reaching
// partners on one side, one broken/blocked line reaching Amazon on the
// other — a shape that appears nowhere in the reel's actual scenes.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
async function read(p) { return readFile(p, 'utf8'); }

async function simpleIcon(name) {
  const src = await read(A(`icons/simple-icons/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="currentColor">${paths}</svg>`;
}
async function tablerIcon(name) {
  const src = await read(A(`icons/tabler/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

const meta = await simpleIcon('meta');
const [check, lock] = await Promise.all(['check', 'lock'].map(tablerIcon));
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// Radial burst: Muse/Meta mark at the hub. Five "joined" nodes fan out to
// the right in an arc (amber, checkmarks); one "blocked" node sits alone
// to the left (violet, lock, its line broken with a gap) — visualizing
// the 5:1 split at a glance.
const hub = { x: 420, y: 520 };
const joinedLabels = ['PAYPAL', 'WALMART', 'SHOPIFY', 'GITHUB', 'BOX'];
const joinedNodes = joinedLabels.map((label, i) => {
  const angle = -55 + i * 27.5; // fan from -55deg to +55deg
  const rad = (angle * Math.PI) / 180;
  const dist = 300;
  const x = hub.x + dist * Math.cos(rad);
  const y = hub.y + dist * Math.sin(rad);
  return { label, x, y, angle };
});
const blockedNode = { x: hub.x - 300, y: hub.y + 40 };

const joinedLines = joinedNodes.map((n) => `<line x1="${hub.x}" y1="${hub.y}" x2="${n.x}" y2="${n.y}" stroke="var(--amber)" stroke-width="4" opacity="0.7"/>`).join('');
// Blocked line: two short dashes with a gap in the middle (broken connection).
const bx = (hub.x + blockedNode.x) / 2, by = (hub.y + blockedNode.y) / 2;
const blockedLine1 = `<line x1="${hub.x}" y1="${hub.y}" x2="${bx - 18}" y2="${by - 4}" stroke="var(--violet)" stroke-width="4" opacity="0.55"/>`;
const blockedLine2 = `<line x1="${bx + 18}" y1="${by + 4}" x2="${blockedNode.x}" y2="${blockedNode.y}" stroke="var(--violet)" stroke-width="4" opacity="0.55"/>`;

const joinedNodesHtml = joinedNodes.map((n) => `
  <div class="node joined" style="left:${n.x}px;top:${n.y}px;">${check}</div>
  <div class="node-label joined" style="left:${n.x}px;top:${n.y + 56}px;">${n.label}</div>
`).join('');

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'PlusJakarta';font-weight:700;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'PlusJakarta';font-weight:800;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{ --bg:#171310; --amber:#ffb84d; --violet:#8b7bff; --ink:#f6efe6; --ink-dim:#c2b6a8; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 75% 20%, rgba(255,184,77,0.10), transparent 60%),
  radial-gradient(ellipse 900px 800px at 15% 30%, rgba(139,123,255,0.12), transparent 60%),
  var(--bg);}
.grid{position:absolute;inset:0;opacity:0.4;background-image:
  repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 96px),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 96px);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 32%, transparent 40%, rgba(0,0,0,0.6) 100%);}

.eyebrow{position:absolute;top:118px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.16em;color:var(--amber);}

.burst{position:absolute;top:80px;left:0;width:1080px;height:900px;}
.burst svg{width:100%;height:100%;overflow:visible;}
.hub{position:absolute;width:140px;height:140px;margin:-70px 0 0 -70px;border-radius:50%;background:rgba(139,123,255,0.12);border:2.5px solid var(--violet);box-shadow:0 0 40px rgba(139,123,255,0.5);display:flex;align-items:center;justify-content:center;}
.hub svg{width:72px;height:72px;color:var(--ink);}
.node{position:absolute;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.node.joined{background:rgba(255,184,77,0.14);border:2px solid var(--amber);}
.node.joined svg{width:36px;height:36px;color:var(--amber);}
.node.blocked{background:rgba(139,123,255,0.1);border:2px solid var(--violet);opacity:0.75;}
.node.blocked svg{width:36px;height:36px;color:var(--violet);}
.node-label{position:absolute;transform:translate(-50%,0);font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:0.03em;white-space:nowrap;}
.node-label.joined{color:var(--amber);}
.node-label.blocked{color:var(--violet);}

.title{position:absolute;top:1040px;left:0;right:0;text-align:center;font-family:'PlusJakarta',sans-serif;font-weight:800;color:var(--ink);font-size:92px;line-height:1.05;letter-spacing:-0.02em;text-shadow:0 6px 20px rgba(0,0,0,.7);padding:0 60px;box-sizing:border-box;}
.title .hi{color:var(--violet);}
.subtitle{position:absolute;top:1330px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:42px;color:var(--ink-dim);line-height:1.35;}
.structure{position:absolute;top:1470px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.05em;color:var(--amber);}

.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--amber);box-shadow:0 0 24px rgba(255,184,77,0.5);}
.brand .handle{font-family:'PlusJakarta',sans-serif;font-weight:700;font-size:40px;color:var(--ink);}
</style></head>
<body>
<div class="frame">
  <div class="grid"></div>
  <div class="eyebrow">// AI HARDWARE WATCH <span style="color:var(--violet);">·</span> MUSE TAKEOVER</div>

  <div class="burst">
    <svg viewBox="0 0 1080 900">
      ${joinedLines}
      ${blockedLine1}
      ${blockedLine2}
    </svg>
    <div class="hub" style="left:${hub.x}px;top:${hub.y}px;">${meta}</div>
    ${joinedNodesHtml}
    <div class="node blocked" style="left:${blockedNode.x}px;top:${blockedNode.y}px;">${lock}</div>
    <div class="node-label blocked" style="left:${blockedNode.x}px;top:${blockedNode.y + 56}px;">AMAZON</div>
  </div>

  <div class="vignette"></div>
  <div class="title">AMAZON BLOCKED IT. <span class="hi">FIVE OTHERS DIDN'T.</span></div>
  <div class="subtitle">Meta's Muse just got real hardware — and a partner rush.</div>
  <div class="structure">5 JOINED · 1 BLOCKED</div>
  <div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
</div>
</body></html>`;

await writeFile(join(__dirname, 'cover.html'), html, 'utf8');
console.log('wrote cover.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'cover.html')}`);
await page.waitForTimeout(300);
await page.screenshot({ path: join(__dirname, 'cover.png') });
await browser.close();
console.log('wrote cover.png');
