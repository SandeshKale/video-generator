// Screenshot the mockup scenes: bun reel-morning-brief/mockup/shoot.mjs [scene...]
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const srv = await serveDir(new URL('../../', import.meta.url).pathname);
const scenes = process.argv.slice(2).length ? process.argv.slice(2) : ['1', '3', '5', '7'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
for (const s of scenes) {
  await p.goto(`${srv.url}/reel-morning-brief/mockup/mockup.html#${s}`); await p.reload();
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  await p.screenshot({ path: new URL(`./scene${s}.png`, import.meta.url).pathname }); console.log('scene', s);
}
await b.close(); await srv.close(); process.exit(0);
