// usage: bun shots.mjs <t1> <t2> ... -> /tmp/rc/f_<t>.png ; contact sheet via sheet.py
import {chromium} from '/home/user/video-generator/node_modules/playwright/index.mjs';
import {mkdirSync} from 'node:fs';
mkdirSync('/tmp/rc',{recursive:true});
const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
pg.on('pageerror',e=>console.log('PAGEERROR',e.message));pg.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});
await pg.goto('file://'+process.cwd()+'/site/index.html');await pg.waitForFunction(()=>window.__ready||document.title.startsWith('ERR'),null,{timeout:60000});
console.log('title',await pg.title());
for(const t of process.argv.slice(2).map(Number)){await pg.evaluate(x=>window.__seek(x),t);await pg.screenshot({path:`/tmp/rc/f_${t}.png`});}
await b.close();
