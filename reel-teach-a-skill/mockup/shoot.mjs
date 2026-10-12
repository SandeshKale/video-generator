// Screenshot the mockup scenes: bun reel-teach-a-skill/mockup/shoot.mjs [scene...]
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const root = new URL('../../', import.meta.url).pathname;
const srv = await serveDir(root);
const base = srv.url;
const scenes = process.argv.slice(2).length ? process.argv.slice(2) : ['2', '5', '7', '8'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const s of scenes) {
  await p.goto(`${base}/reel-teach-a-skill/mockup/mockup.html#${s}`);
  await p.reload();
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(700);
  await p.screenshot({ path: new URL(`./scene${s}.png`, import.meta.url).pathname });
  console.log('scene', s);
}
await b.close(); srv.close?.(); process.exit(0);
