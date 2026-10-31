// dumps window.EV (sound events defined by the page itself, so SFX land on the same words as the picture) and the scene boundaries
import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url'; import { writeFileSync } from 'node:fs';
const H = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(join(H, '..', 'site', 'index.html')).href); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
const d = await p.evaluate(() => ({ ev: window.EV, dur: window.__reelDurationSec, B: window.__B }));
writeFileSync(join(H, '..', 'audio', 'events.json'), JSON.stringify(d, null, 1)); console.log(d.ev.length, 'events', d.dur); await b.close();
