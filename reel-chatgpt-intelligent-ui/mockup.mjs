import {chromium} from '/home/user/video-generator/node_modules/playwright/index.mjs';
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const s of [1,2,5]){await pg.goto(`file://${process.cwd()}/mockup.html?s=${s}`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);await pg.screenshot({path:`mock-s${s}.png`});}
await b.close();
