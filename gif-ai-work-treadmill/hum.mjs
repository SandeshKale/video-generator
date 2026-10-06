import { readFileSync } from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
function darkenHex(hex, amt) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = 1 - amt; r = Math.round(r * f); g = Math.round(g * f); b = Math.round(b * f); return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export function humaaansFull(kind, name, overrides = {}) {
  const compName = name.split('-').map((p, i) => (i === 0 ? p[0].toUpperCase() + p.slice(1) : p)).join('');
  const src = readFileSync(`${ROOT}assets/illustrations/humaaans-react/${kind}/${name}/${compName}.js`, 'utf8');
  const defaults = {}; const m0 = src.match(/\.defaultProps\s*=\s*\{([\s\S]*?)\};/);
  if (m0) for (const m of m0[1].matchAll(/(\w+):\s*'([^']*)'/g)) defaults[m[1]] = m[2];
  const colors = { ...defaults, ...overrides };
  let body = src.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
  body = body.replace(/\{darken\((\w+)\)\}/g, (_, k) => darkenHex(colors[k], 0.1));
  body = body.replace(/\{(\w+)\}/g, (_, k) => (k in colors ? colors[k] : '#000000'));
  body = body.replace(/(\w+)=\{([^}]*)\}/g, (_, a, v) => `${a.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${v.replace(/['"]/g, '')}"`);
  return `<svg viewBox="0 0 380 480" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
