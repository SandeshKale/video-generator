// Resolves timing.json into site/data.js (scene windows, display words, caption chunks) and events.json (SFX cues tied to word times).
import { readFileSync, writeFileSync } from 'node:fs';
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url), 'utf8'));
const LIM = 34; // chars per caption line (English subtitles, 42px Fredoka in a 768px pill)
function capChunks(sc) {
  const out = [];
  for (const b of sc.beats) {
    const units = b.sents.map((x) => x.words.map((w) => ({ ...w })));
    const len = (u) => u.map((w) => w.w).join(' ').length;
    const split = (u) => { if (len(u) <= LIM || u.length < 2) return [u]; let best = Math.ceil(u.length / 2), bd = 1e9; for (let i = 1; i <= u.length - 1; i++) { const d = Math.abs(len(u.slice(0, i)) - len(u.slice(i))) - (/[,]$/.test(u[i - 1].w) ? 8 : 0); if (d < bd) { bd = d; best = i; } } return [...split(u.slice(0, best)), ...split(u.slice(best))]; };
    const parts = units.flatMap(split); const merged = [];
    for (const p of parts) { const last = merged[merged.length - 1]; if (last && len(last.concat(p)) <= LIM) merged[merged.length - 1] = last.concat(p); else merged.push(p); }
    for (const p of merged) out.push({ start: p[0].s, end: p[p.length - 1].e, words: p });
  }
  return out;
}
const scenes = T.scenes.map((sc) => ({ id: sc.id, start: sc.start, end: sc.end, beats: sc.beats.map((b) => ({ start: b.start, end: b.end, words: b.words })), caps: capChunks(sc) }));
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify({ total: T.total, scenes }) + ';\n');
console.log('data.js', scenes.length, 'scenes', T.total.toFixed(1), 's', scenes.reduce((n, s) => n + s.caps.length, 0), 'caption chunks');

// word lookup shared by site/app.js (same rule): first display word (in the scene, all beats) that contains `key`; nth picks later matches
export function wordAt(si, key, nth = 0) {
  const ws = scenes[si].beats.flatMap((b) => b.words); let n = 0;
  for (const w of ws) if (w.w.toLowerCase().includes(key.toLowerCase())) { if (n === nth) return w.s; n++; }
  throw new Error(`word "${key}" #${nth} not in scene ${si}`);
}
const W = wordAt, ev = []; const E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
const st = (i) => scenes[i].start;
// s01 hook
E('thump', 0.02); E('tap', W(0, 'अब')); E('rip', W(0, 'नहीं') - 0.05); E('pop', W(0, 'रहा'));
for (let i = 1; i < scenes.length; i++) E('whoosh', st(i) - 0.12);
// s02 wing
E('pop', st(1) + 0.3); E('draw', W(1, 'पंख') - 0.1); E('rip', W(1, 'पैराग्राफ़') + 0.05); E('tap', W(1, 'डायग्राम') + 0.1); E('pop', W(1, 'डायग्राम') + 0.25); E('slide', W(1, 'छू') - 0.1, { dur: 1.2 }); E('tap', W(1, 'छू') - 0.2);
// s03 intelligent ui
E('stamp', W(2, 'Intelligent')); E('tap', W(2, 'बुधवार')); E('stamp', W(2, 'बुधवार') + 0.05); E('pop', W(2, 'GPT-6'));
// s04 builds while it types
E('type', W(3, 'लिखते') - 0.3, { dur: 2.2 }); E('snap', W(3, 'बटन')); E('snap', W(3, 'फ़ॉर्म')); E('snap', W(3, 'चार्ट')); E('snap', W(3, 'कैलकुलेटर')); E('ding', W(3, 'कैलकुलेटर') + 0.5);
// s05 three widgets
E('pop', st(4) + 0.25); E('tap', W(4, 'मेहमान')); E('count', W(4, 'बदलिए') - 0.1); E('pop', W(4, 'बिल')); E('tap', W(4, 'स्प्लिटर')); E('tap', W(4, 'स्प्लिटर') + 0.35); E('draw', W(4, 'नक्शा') - 0.2); E('pop', W(4, 'नक्शा') + 0.3);
// s06 parts bin
E('belt', st(5) + 0.2, { dur: 5 }); E('snap', W(5, 'पुर्ज़ों')); E('clunk', W(5, 'कंपाइलर')); E('snap', W(5, 'जोड़ता')); E('ding', W(5, 'जोड़ता') + 0.5);
// s07 who gets it first
E('stamp', W(6, 'पेड') + 0.1); E('flip', W(6, 'बुधवार') - 0.1); E('pop', W(6, 'बुधवार') + 0.3); E('flip', W(6, 'गुरुवार') - 0.25); E('pop', W(6, 'गुरुवार') + 0.2);
// s08 the catch
E('pop', st(7) + 0.3); E('warn', W(7, 'चार्ट') + 0.3); E('scan', W(7, 'जाँचा') - 0.2, { dur: 1.1 }); E('stamp', W(7, 'आलोचक') + 0.2); E('slide', W(7, 'कम') - 0.2, { dur: 1.0 }); E('tap', W(7, 'कम') + 0.7);
// s09 read -> use, CTA
E('rip', W(8, 'पढ़ने') + 0.05); E('pop', W(8, 'इस्तेमाल')); E('ding', W(8, 'इस्तेमाल') + 0.3); E('pop', W(8, 'चुनेंगे') + 0.1); E('tap', W(8, 'पढ़ना')); E('tap', W(8, 'छूना')); E('chime', W(8, 'अगली') - 0.2); E('tap', W(8, 'फ़ॉलो') + 0.1);
writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: scenes.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
console.log('events', ev.length);
