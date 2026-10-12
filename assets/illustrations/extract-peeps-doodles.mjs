// One-off vendoring script: turns react-peeps / react-open-doodles JSX components into plain static SVG files
// (no npm dependency kept). Usage: bun extract-peeps-doodles.mjs <react-peeps checkout> <react-open-doodles checkout>
// Peeps parts keep {{stroke}} / {{bg}} placeholders; doodles keep {{ink}} / {{accent}}. Compose with compose.mjs (peeps) or fill().
import fs from 'node:fs'; import path from 'node:path';
const [peepsDir, doodlesDir] = process.argv.slice(2); const here = path.dirname(new URL(import.meta.url).pathname);
const camel = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
function jsxToSvg(src, map) {
  let b = src.slice(src.indexOf('return (') + 8); b = b.slice(0, b.lastIndexOf(');'));
  b = b.replace(/\{`?([^{}]*)`?\}/g, (m, e) => { for (const [k, v] of Object.entries(map)) if (e.includes(k)) return v; return m; });
  b = b.replace(/\s(strokeWidth|fillRule|clipRule|strokeLinecap|strokeLinejoin|strokeMiterlimit|fillOpacity|strokeOpacity)=/g, (m, a) => ' ' + camel(a) + '=');
  return b.replace(/\s+/g, ' ').trim();
}
let n = 0;
for (const kind of ['hair', 'face', 'facialHair', 'accessories']) {
  const d = path.join(peepsDir, 'src/peeps', kind); const out = path.join(here, 'open-peeps', kind); fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(d)) if (/^[A-Z].*\.tsx$/.test(f)) { fs.writeFileSync(path.join(out, f.replace('.tsx', '.svgfrag')), jsxToSvg(fs.readFileSync(path.join(d, f), 'utf8'), { 'strokeColor ||': '{{stroke}}', 'backgroundColor ||': '{{bg}}' })); n++; }
}
for (const kind of ['standing', 'sitting', 'bust']) {
  const d = path.join(peepsDir, 'src/peeps/pose', kind); const out = path.join(here, 'open-peeps/pose-' + kind); fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(d)) if (/^[A-Z].*\.tsx$/.test(f)) { fs.writeFileSync(path.join(out, f.replace('.tsx', '.svgfrag')), jsxToSvg(fs.readFileSync(path.join(d, f), 'utf8'), { 'strokeColor ||': '{{stroke}}', 'backgroundColor ||': '{{bg}}' })); n++; }
}
const dd = path.join(doodlesDir, 'src/components'); const od = path.join(here, 'open-doodles'); fs.mkdirSync(od, { recursive: true });
for (const f of fs.readdirSync(dd)) if (f.endsWith('Doodle.tsx')) { let s = jsxToSvg(fs.readFileSync(path.join(dd, f), 'utf8'), { 'accent': '{{accent}}', 'ink': '{{ink}}' }); fs.writeFileSync(path.join(od, f.replace('.tsx', '.svg')), s); n++; }
console.log(n, 'files');
