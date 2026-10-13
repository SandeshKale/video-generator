import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./mockup.html', import.meta.url).href); await p.waitForTimeout(800);
for (const id of ['f1', 'f2', 'f3']) await (await p.$('#' + id)).screenshot({ path: new URL(`./${id}.png`, import.meta.url).pathname });
await b.close();
