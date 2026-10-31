// Generic quick-commerce app UI screens (own work, CC0; no real brand names or marks).
//   bun assets/ui-kit/build.mjs          -> screens/<theme>/<screen>.svg + .png (1170x2532, an iPhone-15-Pro-sized screen @3x)
// Screens are 390x844 pt. Themes are plain colour objects — add one per reel so the UI matches that reel's palette.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));

export const THEMES = {
  daylight: { bg: '#f6f7f9', card: '#ffffff', ink: '#14171f', muted: '#707887', line: '#e4e7ec', accent: '#ffcf1f', accentInk: '#14171f', good: '#17a561', route: '#2f6bff', map: '#e9edf2', road: '#ffffff', park: '#d7ecd9', water: '#cfe3f6' },
  midnight: { bg: '#0d1020', card: '#171b30', ink: '#eef0fa', muted: '#8d94b3', line: '#262b47', accent: '#39e6c4', accentInk: '#06201b', good: '#4be28a', route: '#7ea1ff', map: '#141a30', road: '#222a47', park: '#143a3a', water: '#14305a' },
};
const FONT = `font-family="Inter, 'Helvetica Neue', Arial, sans-serif"`;
const W = 390, H = 844;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (x, y, s, size, fill, w = 500, anchor = 'start', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" ${FONT} ${extra}>${esc(s)}</text>`;
const rr = (x, y, w, h, r, fill, stroke = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke ? `stroke="${stroke}"` : ''}/>`;
const svg = (t, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${rr(0, 0, W, H, 0, t.bg)}${body}</svg>`;
const statusPad = 58;   // clear of the Dynamic Island / status bar

function tracking_map(t) {
  const roads = [[0, 150, W, 150, 18], [0, 290, W, 290, 14], [60, 0, 60, 560, 14], [210, 0, 210, 560, 18], [330, 0, 330, 560, 12], [0, 430, W, 430, 14]];
  let m = rr(0, 0, W, 560, 0, t.map) + rr(70, 300, 130, 120, 10, t.park) + rr(230, 440, 90, 90, 10, t.park) + `<path d="M0 500 C 80 470, 140 540, 200 520 S 330 490, 390 520 V 560 H 0Z" fill="${t.water}"/>`;
  for (const [x1, y1, x2, y2, w] of roads) m += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${t.road}" stroke-width="${w}"/>`;
  const route = 'M 60 430 L 60 290 L 210 290 L 210 150 L 330 150';
  m += `<path d="${route}" fill="none" stroke="${t.route}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 0"/>`;
  m += `<path d="M 60 430 L 60 290 L 210 290" fill="none" stroke="${t.good}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;   // travelled part
  const pin = (x, y, c, label) => `<g><ellipse cx="${x}" cy="${y + 2}" rx="12" ry="4" fill="#000" opacity=".18"/><path d="M${x} ${y} c-18 -22 -18 -44 0 -44 s18 22 0 44z" fill="${c}"/><circle cx="${x}" cy="${y - 30}" r="6" fill="#fff"/></g>${txt(x, y + 22, label, 11, t.ink, 700, 'middle')}`;
  m += pin(60, 430, t.accent, 'STORE') + pin(330, 150, t.route, 'YOU');
  m += `<g><circle cx="210" cy="290" r="20" fill="${t.good}" opacity=".25"/><circle cx="210" cy="290" r="11" fill="${t.good}" stroke="#fff" stroke-width="3"/></g>`;
  const card = rr(14, 540, 362, 290, 26, t.card) + rr(168, 552, 54, 5, 3, t.line) +
    txt(30, 600, 'Arriving in 9 min', 24, t.ink, 800) + txt(30, 626, 'Your order is on the way · 1.8 km', 14, t.muted, 500) +
    rr(30, 646, 330, 6, 3, t.line) + rr(30, 646, 214, 6, 3, t.good) +
    [['Packed', 30], ['On the way', 128], ['Arriving', 255]].map(([s, x], i) => `<circle cx="${x + 5}" cy="${675}" r="5" fill="${i < 2 ? t.good : t.line}"/>` + txt(x + 16, 679, s, 12, i < 2 ? t.ink : t.muted, 600)).join('') +
    rr(30, 706, 330, 82, 18, t.bg) + `<circle cx="68" cy="747" r="22" fill="${t.accent}"/>` + txt(68, 753, 'R', 18, t.accentInk, 800, 'middle') +
    txt(104, 741, 'Ravi is bringing your order', 15, t.ink, 700) + txt(104, 762, 'Delivery partner · 4.9 ★', 13, t.muted, 500) +
    `<circle cx="326" cy="747" r="18" fill="${t.accent}"/><path d="M319 741 l7 6 7 -6 M319 753 h14" stroke="${t.accentInk}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return svg(t, m + card + txt(20, statusPad + 30, '', 1, t.ink));
}

function product_grid(t) {
  const items = [['Milk 500 ml', '₹28', '#e8f1ff'], ['Bread', '₹45', '#fff1d6'], ['Eggs ×6', '₹60', '#fde9e1'], ['Tomato 1 kg', '₹38', '#fde1e1'], ['Bananas', '₹49', '#fff7c7'], ['Curd 400 g', '₹35', '#eef2f7']];
  let b = txt(20, statusPad + 18, 'Deliver to', 12, t.muted, 600) + txt(20, statusPad + 40, 'Home · Sector 21 ▾', 17, t.ink, 800) +
    rr(290, statusPad + 4, 80, 34, 17, t.accent) + txt(330, statusPad + 26, '10 min', 14, t.accentInk, 800, 'middle') +
    rr(20, statusPad + 62, 350, 46, 14, t.card, t.line) + `<circle cx="44" cy="${statusPad + 85}" r="7" fill="none" stroke="${t.muted}" stroke-width="2"/><path d="M49 ${statusPad + 90} l6 6" stroke="${t.muted}" stroke-width="2"/>` + txt(64, statusPad + 91, 'Search "milk"', 15, t.muted, 500);
  b += txt(20, statusPad + 148, 'Fresh & daily', 20, t.ink, 800) + txt(370, statusPad + 148, 'See all', 13, t.route, 700, 'end');
  items.forEach(([n, p, c], i) => {
    const x = 20 + (i % 2) * 180, y = statusPad + 166 + Math.floor(i / 2) * 200;
    b += rr(x, y, 170, 188, 18, t.card, t.line) + rr(x + 10, y + 10, 150, 98, 12, t.bg === '#0d1020' ? '#1f2540' : c) + `<circle cx="${x + 85}" cy="${y + 59}" r="30" fill="${t.accent}" opacity=".55"/>` +
      txt(x + 12, y + 130, n, 14, t.ink, 700) + txt(x + 12, y + 154, p, 15, t.ink, 800) + rr(x + 100, y + 138, 58, 30, 9, t.card, t.good) + txt(x + 129, y + 158, 'ADD', 12, t.good, 800, 'middle');
  });
  b += rr(20, 760, 350, 56, 18, t.accent) + txt(40, 786, '2 items', 12, t.accentInk, 600) + txt(40, 804, '₹88', 15, t.accentInk, 800) + txt(350, 794, 'View cart ›', 16, t.accentInk, 800, 'end');
  return svg(t, b);
}

function cart_checkout(t) {
  const rows = [['Milk 500 ml', 'x2', '₹56'], ['Bread', 'x1', '₹45'], ['Eggs x6', 'x1', '₹60']];
  let b = txt(20, statusPad + 26, 'Your cart', 26, t.ink, 800) + txt(370, statusPad + 26, '3 items', 13, t.muted, 600, 'end');
  b += rr(20, statusPad + 50, 350, 54, 16, t.card, t.line) + `<circle cx="46" cy="${statusPad + 77}" r="12" fill="${t.accent}"/>` + txt(68, statusPad + 73, 'Arriving in 10 minutes', 15, t.ink, 700) + txt(68, statusPad + 92, 'Shipment of 3 items', 12, t.muted, 500);
  rows.forEach(([n, q, p], i) => { const y = statusPad + 126 + i * 76; b += rr(20, y, 350, 66, 16, t.card, t.line) + rr(32, y + 11, 44, 44, 10, t.bg) + txt(88, y + 31, n, 15, t.ink, 700) + txt(88, y + 51, 'Qty ' + q.slice(1), 12, t.muted, 500) + txt(358, y + 40, p, 16, t.ink, 800, 'end'); });
  const y0 = statusPad + 126 + 3 * 76 + 8;
  b += rr(20, y0, 350, 188, 18, t.card, t.line) + txt(36, y0 + 30, 'Bill details', 16, t.ink, 800);
  [['Item total', '₹161'], ['Delivery fee', '₹0'], ['Handling', '₹4'], ['Total', '₹165']].forEach(([k, v], i) => {
    const y = y0 + 62 + i * 30, last = i === 3; b += txt(36, y, k, last ? 16 : 14, last ? t.ink : t.muted, last ? 800 : 500) + txt(354, y, v, last ? 17 : 14, t.ink, last ? 800 : 600, 'end');
  });
  b += rr(20, 750, 350, 66, 20, t.accent) + txt(40, 777, 'Pay using UPI', 12, t.accentInk, 600) + txt(40, 799, '₹165', 17, t.accentInk, 800) + txt(350, 793, 'Place order ›', 17, t.accentInk, 800, 'end');
  return svg(t, b);
}

function otp_entry(t, filled = 4) {
  let b = `<path d="M30 ${statusPad + 22} l-10 10 l10 10" stroke="${t.ink}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += txt(20, statusPad + 110, 'Verify your number', 28, t.ink, 800) + txt(20, statusPad + 142, 'We sent a 6-digit code to', 15, t.muted, 500) + txt(20, statusPad + 164, '+91 98••• ••210', 15, t.ink, 700);
  const digits = '482917';
  for (let i = 0; i < 6; i++) { const x = 20 + i * 59, y = statusPad + 200; b += rr(x, y, 52, 62, 14, t.card, i === filled ? t.accent : t.line) + (i < filled ? txt(x + 26, y + 41, digits[i], 26, t.ink, 800, 'middle') : i === filled ? rr(x + 25, y + 18, 2, 26, 1, t.accent) : ''); }
  b += txt(20, statusPad + 300, 'Resend code in 0:24', 14, t.muted, 600) + rr(20, statusPad + 330, 350, 54, 16, t.accent) + txt(195, statusPad + 363, 'Verify', 17, t.accentInk, 800, 'middle');
  b += rr(20, statusPad + 410, 350, 74, 16, t.card, t.line) + `<path d="M40 ${statusPad + 440} l10 -6 l10 6 v12 c0 8 -6 12 -10 14 c-4 -2 -10 -6 -10 -14z" fill="none" stroke="${t.good}" stroke-width="2.2"/>` + txt(76, statusPad + 442, 'Never share this code', 14, t.ink, 800) + txt(76, statusPad + 462, 'No bank or app will ask for it.', 12, t.muted, 500);
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].forEach((k, i) => { if (k) b += txt(65 + (i % 3) * 130, 640 + Math.floor(i / 3) * 52, k, 26, t.ink, 600, 'middle'); });
  return svg(t, b);
}

function order_confirmed(t) {
  let b = `<circle cx="195" cy="250" r="86" fill="${t.good}" opacity=".16"/><circle cx="195" cy="250" r="62" fill="${t.good}"/><path d="M165 252 l22 22 l42 -46" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  b += txt(195, 392, 'Order confirmed', 28, t.ink, 800, 'middle') + txt(195, 424, 'Arriving in about 10 minutes', 16, t.muted, 500, 'middle');
  b += rr(20, 470, 350, 150, 20, t.card, t.line) + txt(36, 504, 'Order #20481', 14, t.muted, 600) + txt(36, 534, 'Milk, Bread, Eggs', 17, t.ink, 700) + txt(36, 560, '3 items · ₹165 paid by UPI', 14, t.muted, 500) +
    rr(36, 580, 318, 6, 3, t.line) + rr(36, 580, 70, 6, 3, t.good) + txt(36, 606, 'Packing your order', 12, t.muted, 600);
  b += rr(20, 750, 350, 58, 18, t.accent) + txt(195, 786, 'Track order', 17, t.accentInk, 800, 'middle');
  return svg(t, b);
}

const SCREENS = { tracking_map, product_grid, cart_checkout, otp_entry, order_confirmed };
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { chromium } = await import('playwright');
  const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 3 });
  for (const [tn, t] of Object.entries(THEMES)) {
    mkdirSync(join(HERE, 'screens', tn), { recursive: true });
    for (const [sn, fn] of Object.entries(SCREENS)) {
      const s = fn(t), p = join(HERE, 'screens', tn, sn);
      writeFileSync(p + '.svg', s);
      await pg.setContent(`<style>html,body{margin:0}</style>${s}`); await pg.screenshot({ path: p + '.png' });
    }
  }
  await br.close(); console.log('built', Object.keys(THEMES).length * Object.keys(SCREENS).length, 'screens');
}
