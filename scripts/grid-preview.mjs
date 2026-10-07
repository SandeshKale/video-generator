#!/usr/bin/env bun
// Mock of the Instagram profile grid for cover QA: crops each 1080x1920 cover to the 3:4 grid window (y 240-1680),
// scales to a 308x410 tile, draws the play icon (top-right) and view-count badge (bottom-left), 3 tiles per row.
// Usage: bun scripts/grid-preview.mjs out.png cover1.png [cover2.png ...]   (also writes out-small.png at 110x146 tiles)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [out, ...covers] = process.argv.slice(2);
if (!out || !covers.length) { console.error('usage: grid-preview.mjs out.png cover.png ...'); process.exit(1); }
const b = await chromium.launch();
async function render(tw, th, file) {
  const s = tw / 1080;
  const tiles = covers.map((c, i) => `<div class="t"><img src="data:image/png;base64,${readFileSync(resolve(c)).toString('base64')}" style="width:${1080 * s}px;margin-top:${-240 * s}px">
    <i class="p"></i><b class="v">👁 ${[85, 134, 197, 55, 151][i % 5]}</b></div>`).join('');
  const rows = Math.ceil(covers.length / 3);
  const html = `<style>body{margin:0;background:#101010;width:${tw * 3 + 8}px}.g{display:grid;grid-template-columns:repeat(3,${tw}px);gap:2px}
  .t{position:relative;width:${tw}px;height:${th}px;overflow:hidden}.t img{display:block}
  .p{position:absolute;right:${tw * .04}px;top:${tw * .04}px;width:${tw * .075}px;height:${tw * .075}px;background:#eef1ff;border-radius:${tw * .015}px;opacity:.95}
  .v{position:absolute;left:${tw * .05}px;bottom:${tw * .04}px;font:700 ${Math.max(9, tw * .075)}px sans-serif;color:#eef1ff;text-shadow:0 1px 3px #000}</style><div class="g">${tiles}</div>`;
  const p = await b.newPage({ viewport: { width: tw * 3 + 8, height: (th + 2) * rows } });
  await p.setContent(html); await p.waitForTimeout(300); await p.screenshot({ path: file }); await p.close();
}
await render(308, 410, out);
await render(110, 146, out.replace(/\.png$/, '-small.png'));
await b.close();
console.log('wrote', out);
