// "Every coupon rule lives in the database." — a coupon-validation platform (client case study, names omitted) as one live diagram,
// 1600×900, 12 s loop. One coupon's day: a label prints and is scanned in public (state only) → a dealer logs in with a PIN (the 7 steps light in order)
// → one-tap validate (RPC → row lock → state edge → event row) → HQ reads it live → an admin reverses it → cron expires, reconciles and backs up
// while CI gates deploy. Every motion is a real step of the system. window.__seek(t) is a pure function of t.
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12, OFF = 5.4;
var BG = '#0a0b1f', DOT = '#171a3c', PANEL = '#111331', PANEL2 = '#171a3d', LINE = '#2c3068', TXT = '#eef0ff', MUTE = '#a3a9d9', DIM = '#6f76b0', GREY = '#5a5f8f',
  SAF = '#ffb02e', SKY = '#3ec6ff', MINT = '#35e8b0', ROSE = '#ff5d8f', LIL = '#a78bfa';
var svg = document.getElementById('s'), FIT = [];
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function lerp(a, b, u) { return a + (b - a) * u; }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function seg(u, a, b) { return clamp((u - a) / (b - a), 0, 1); }
function bell(u, a, b) { var p = (u - a) / (b - a); return p <= 0 || p >= 1 ? 0 : Math.sin(Math.PI * p); }
var CURR = 1590;   // right bound for auto-fit of the text drawn next (set per card with B())
function B(r) { CURR = r; }
// text: size is a ceiling; anything that would cross CURR is shrunk to fit (never below 14.5, then it is logged so the copy can be shortened)
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { var e = E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 500, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); if ((anchor || 'start') === 'start') FIT.push([e, CURR - x, size]); return e; }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 10 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function PHI(par, name, x, y, size, col) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + (size / 256) + ')', fill: col }, par); g.innerHTML = window.PH[name]; return g; }
function SII(par, name, x, y, size, col) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + (size / 24) + ')', fill: col }, par); g.innerHTML = window.SI[name]; return g; }
function CARD(par, x, y, w, h, title, col, fill, stroke) { var g = E('g', {}, par); R(g, x, y, w, h, { fill: fill || PANEL, stroke: stroke || LINE, 'stroke-width': 2 }); E('circle', { cx: x + 15, cy: y + 19, r: 5, fill: col }, g); B(x + w - 30); T(g, x + 28, y + 25, title, 15.5, col, 'RM', 700, 'start', .3); B(x + w - 10); return g; }
function body(par, x, y, s, col) { return T(par, x, y, s, 16, col || TXT, 'IN', 500); }

// ---------- static frame ----------
var df = E('defs', {});
var dp = E('pattern', { id: 'd', width: 26, height: 26, patternUnits: 'userSpaceOnUse' }, df); E('circle', { cx: 13, cy: 13, r: 1.2, fill: DOT }, dp);
var gl = E('filter', { id: 'glow', x: '-1', y: '-1', width: '3', height: '3' }, df); E('feGaussianBlur', { stdDeviation: 3.5, result: 'b' }, gl); var fm = E('feMerge', {}, gl); E('feMergeNode', { in: 'b' }, fm); E('feMergeNode', { in: 'SourceGraphic' }, fm);
function CLIP(id, x, y, w, h) { var c = E('clipPath', { id: id }, df); E('rect', { x: x, y: y, width: w, height: h }, c); }
E('rect', { width: 1600, height: 900, fill: BG }); E('rect', { width: 1600, height: 900, fill: 'url(#d)' });

// header: title + tech-chip marquee
B(1060); var tl = T(svg, 28, 50, 'Every coupon rule lives in the ', 38, TXT, 'SO', 800, 'start', -.8); E('tspan', { fill: SAF }, tl, 'database.');
B(1060); T(svg, 30, 80, 'COUPON VALIDATION PLATFORM · QR → PIN → VALIDATE → HQ LIVE · PAYMENTS STAY ON PAPER', 15.5, MUTE, 'RM', 500, 'start', .2);
CLIP('chipclip', 1090, 12, 486, 66);
var CH = ['React 19', 'TypeScript strict', 'Vite', 'TanStack Query', 'PWA', 'Vercel', 'Supabase', 'PostgreSQL 17', 'PostgREST', 'GoTrue', 'Deno 2', 'pg_cron', 'pgTAP', 'Vitest', 'Playwright', 'k6'];
var chipsA = E('g', { 'clip-path': 'url(#chipclip)' }), rowA = E('g', {}, chipsA), rowB = E('g', {}, chipsA), CHW = [];
(function () { var xa = 0, xb = 0; CH.forEach(function (s, i) { var w = s.length * 9.4 + 24, row = i % 2 ? rowB : rowA, x = i % 2 ? xb : xa; R(row, x, i % 2 ? 46 : 14, w, 26, { fill: PANEL2, stroke: LINE, 'stroke-width': 1.5, rx: 13 }); E('text', { x: x + 12, y: i % 2 ? 65 : 33, fill: TXT, 'font-family': 'RM', 'font-weight': 500, 'font-size': 15.5 }, row, s); if (i % 2) xb += w + 10; else xa += w + 10; }); CHW = [xa, xb]; })();
var rowA2 = rowA.cloneNode(true), rowB2 = rowB.cloneNode(true); chipsA.appendChild(rowA2); chipsA.appendChild(rowB2);

// ---------- column A · clients ----------
var CL = [['Public', 'scan QR · no login', 'qr-code', SAF], ['Dealer', 'PIN · validates', 'storefront', SKY], ['Distributor', 'onboards dealers', 'truck', LIL], ['HQ staff', 'MFA · live board', 'chart-bar', MINT], ['Label printer', 'lot → 50×25 mm QR', 'printer', MUTE]];
var clientG = [], CY = [];
E('text', { x: 24, y: 97, fill: DIM, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'letter-spacing': 2 }, svg, 'CLIENTS');
CL.forEach(function (c, i) { var y = 104 + i * 96, g = E('g', {}); CY.push(y + 43);
  R(g, 24, y, 232, 86, { fill: PANEL, stroke: LINE, 'stroke-width': 2 }); R(g, 24, y, 6, 86, { fill: c[3], rx: 3 });
  PHI(g, c[2], 40, y + 14, 34, c[3]); B(250); T(g, 84, y + 37, c[0], 19, TXT, 'SO', 700); body(g, 84, y + 64, c[1], MUTE);
  var ring = E('circle', { cx: 240, cy: y + 68, r: 6, fill: c[3], opacity: .5 }, g); clientG.push({ ring: ring }); });
var bus1 = E('path', { d: 'M262 116 V555', stroke: LINE, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '4 8' });
CY.forEach(function (y) { E('path', { d: 'M256 ' + y + ' H262', stroke: LINE, 'stroke-width': 3 }); });

// ---------- column B1 · Vercel ----------
var vg = CARD(svg, 268, 96, 244, 488, 'VERCEL · CDN', SKY); SII(vg, 'vercel', 478, 99, 22, SKY);
B(500); body(vg, 282, 140, 'static · immutable · SPA rewrite', MUTE);
var pwa = E('g', {}); R(pwa, 280, 152, 220, 140, { fill: PANEL2, stroke: SKY, 'stroke-width': 1.6 }); SII(pwa, 'react', 290, 160, 22, SKY); SII(pwa, 'typescript', 318, 160, 22, SKY);
B(440); T(pwa, 348, 178, 'PWA', 18, TXT, 'SO', 800); B(492); body(pwa, 290, 212, 'react-router 7 · valibot'); body(pwa, 290, 234, 'TanStack Query · i18n'); body(pwa, 290, 256, 'EN · HI · KN · QR scanner', MUTE); body(pwa, 290, 278, 'session: 183-day login', MUTE);
var swDot = E('circle', { cx: 484, cy: 170, r: 5.5, fill: MINT }, pwa); PHI(pwa, 'wifi-slash', 448, 160, 20, SKY);
var rt = E('g', {}); R(rt, 280, 302, 220, 112, { fill: PANEL2, stroke: LINE, 'stroke-width': 1.6 });
var ROUTES = [['/c/:code', 'public'], ['/scan', 'dealer'], ['/d/*', 'distributor'], ['/m/*', 'HQ · MFA']], rtHi = R(rt, 284, 308, 212, 24, { fill: SAF, opacity: 0, rx: 6 });
ROUTES.forEach(function (r, i) { var y = 326 + i * 26; B(400); T(rt, 292, y, r[0], 16, TXT, 'RM', 700); E('text', { x: 492, y: y, fill: MUTE, 'font-family': 'IN', 'font-weight': 500, 'font-size': 15.5, 'text-anchor': 'end' }, rt, r[1]); });
var bb = E('g', {}); R(bb, 280, 424, 220, 152, { fill: PANEL2, stroke: LINE, 'stroke-width': 1.6 }); B(496); T(bb, 292, 446, 'BUDGET · CI GATE', 14.5, MINT, 'RM', 700, 'start', .2);
var BUD = [['dealer entry', 96.3, 100, '96.3 / 100 KB gz'], ['back office', 190, 250, 'lazy ≤ 250 KB'], ['scanner', 120, 150, 'lazy ≤ 150 KB'], ['auth', 31, 40, 'lazy ≤ 40 KB']], budF = [];
BUD.forEach(function (b, i) { var y = 460 + i * 28; B(392); T(bb, 292, y + 11, b[0], 15, MUTE, 'IN', 500); R(bb, 396, y + 1, 98, 11, { fill: '#0b0d28', stroke: LINE, 'stroke-width': 1, rx: 5.5 }); budF.push(R(bb, 396, y + 1, 98 * b[1] / b[2], 11, { fill: i ? MINT : SAF, rx: 5.5 })); E('text', { x: 494, y: y + 25, fill: DIM, 'font-family': 'IN', 'font-weight': 500, 'font-size': 14.5, 'text-anchor': 'end' }, bb, b[3]); });
E('path', { d: 'M517 200 V520', stroke: LINE, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '4 8' });

// ---------- column B2 · Supabase ----------
var sg = CARD(svg, 522, 96, 800, 488, 'SUPABASE PROJECT · MANAGED', MINT); SII(sg, 'supabase', 1284, 99, 22, MINT);
var ef = CARD(svg, 534, 130, 256, 188, 'EDGE FUNCTIONS · DENO', LIL, PANEL2);
var EFN = ['pin-login', 'admin-create-user', 'admin-user-status', 'bulk-upload (CSV)', 'export-print-file', 'health · login-link'], efHi = R(ef, 540, 156, 244, 22, { fill: LIL, opacity: 0, rx: 5 });
EFN.forEach(function (s, i) { B(780); T(ef, 548, 174 + i * 21, s, 15, TXT, 'RM', 500); });
R(ef, 548, 290, 150, 9, { fill: '#0b0d28', stroke: LINE, 'stroke-width': 1, rx: 4.5 }); var rl = R(ef, 548, 290, 0, 9, { fill: ROSE, rx: 4.5 }); B(780); T(ef, 706, 299, '40/10 min', 14.5, DIM, 'IN', 500);
var pr = CARD(svg, 534, 326, 256, 112, 'POSTGREST · /rpc/*', SKY, PANEL2); B(780); body(pr, 548, 372, 'RPC-only · no table writes'); body(pr, 548, 394, 'JWT → auth.uid() → app_user'); body(pr, 548, 416, 'errors PT401 · 403 · 409', MUTE);
var prHi = R(pr, 540, 356, 244, 76, { fill: 'none', stroke: SKY, 'stroke-width': 2, opacity: 0, rx: 8 });
var gt = CARD(svg, 534, 446, 256, 130, 'GOTRUE · AUTH', LIL, PANEL2); B(780); body(gt, 548, 492, 'PIN users: internal email'); body(gt, 548, 514, 'server-side magic link'); body(gt, 548, 536, 'JWT 1 h · refresh rotation'); body(gt, 548, 558, 'HQ staff: TOTP MFA', MUTE);
var gtHi = R(gt, 540, 474, 244, 96, { fill: 'none', stroke: LIL, 'stroke-width': 2, opacity: 0, rx: 8 });
E('path', { d: 'M797 224 V520', stroke: LINE, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '4 8' });

var pg = CARD(svg, 802, 130, 510, 446, 'POSTGRESQL 17 · EVERY BUSINESS RULE LIVES HERE', MINT, PANEL2); SII(pg, 'postgresql', 1274, 133, 22, MINT);
var tb = E('g', {}); R(tb, 814, 164, 240, 130, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); B(1050); T(tb, 826, 187, 'TABLES · 33 · RLS ON ALL', 14.5, MINT, 'RM', 700, 'start', .2);
var tiles = []; for (var ti = 0; ti < 33; ti++) { var tx = 826 + (ti % 11) * 19.2, ty = 198 + Math.floor(ti / 11) * 19; tiles.push(R(tb, tx, ty, 16, 16, { fill: '#26306a', rx: 4 })); }
B(1050); T(tb, 826, 272, 'coupon · coupon_event · …', 14.5, MUTE, 'IN', 500); T(tb, 826, 288, 'app_user · pin_attempt · …', 14.5, MUTE, 'IN', 500);
var fn = E('g', {}); R(fn, 1064, 164, 236, 130, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); B(1296); T(fn, 1076, 187, 'FUNCTIONS · 134 DEFINER', 14.5, MINT, 'RM', 700, 'start', .1);
CLIP('fnclip', 1068, 196, 228, 96); var fnList = E('g', { 'clip-path': 'url(#fnclip)' }, fn), fnIn = E('g', {}, fnList);
var FNS = ['public_lookup', 'pin_login_check', 'set_user_pin', 'validate_coupon', 'activate_range', 'block_range', 'dashboard_stats', 'reverse_redemption', 'expire_coupons', 'reconcile_all', 'assert_role', 'register_app_user'], fnHi = R(fnIn, 1070, 0, 224, 22, { fill: SAF, opacity: 0, rx: 5 });
FNS.forEach(function (s, i) { B(1294); T(fnIn, 1080, 214 + i * 24, s, 15, TXT, 'RM', 500); });
var ig = E('g', {}); R(ig, 814, 302, 240, 130, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); B(1050); T(ig, 826, 325, 'INTEGRITY LAYER', 14.5, MINT, 'RM', 700, 'start', .2);
B(1050); body(ig, 826, 348, 'triggers = state machines'); body(ig, 826, 368, 'row lock · FOR UPDATE'); body(ig, 826, 388, 'idempotency keys · 7 days'); var lockIc = PHI(ig, 'lock-key', 1022, 306, 24, ROSE);
T(ig, 826, 411, 'counters ↔ rows ↔ events', 14.5, MUTE, 'IN', 500); var recB = [0, 1, 2].map(function (i) { R(ig, 826 + i * 74, 418, 66, 8, { fill: '#0b0d28', rx: 4 }); return R(ig, 826 + i * 74, 418, 66, 8, { fill: MINT, rx: 4 }); });
var cr = E('g', {}); R(cr, 1064, 302, 236, 130, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); B(1296); T(cr, 1076, 325, 'PG_CRON + PG_NET · UTC', 14.5, MINT, 'RM', 700, 'start', .2);
var CX = 1104, CYY = 382; E('circle', { cx: CX, cy: CYY, r: 36, fill: '#0b0d28', stroke: LINE, 'stroke-width': 2 }, cr);
[[19.5, MINT], [20.5, SAF], [21, MUTE], [18.58, LIL]].forEach(function (m) { var a = (m[0] / 24 * 2 * Math.PI) - Math.PI / 2; E('circle', { cx: CX + 36 * Math.cos(a), cy: CYY + 36 * Math.sin(a), r: 4.5, fill: m[1] }, cr); });
var hand = E('line', { x1: CX, y1: CYY, x2: CX, y2: CYY - 28, stroke: TXT, 'stroke-width': 3, 'stroke-linecap': 'round' }, cr); E('circle', { cx: CX, cy: CYY, r: 4, fill: TXT }, cr);
B(1296); T(cr, 1150, 356, '19:30 expire', 15.5, MINT, 'IN', 700); T(cr, 1150, 378, '20:30 reconcile', 15.5, SAF, 'IN', 700); T(cr, 1150, 400, 'Sun 21:00 cleanup', 15, MUTE, 'IN', 500); T(cr, 1150, 422, '1 / min retries', 14.5, GREY, 'IN', 500);
var ex = E('g', {}); R(ex, 814, 440, 486, 128, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); B(1250); T(ex, 826, 463, 'EXTENSIONS · SECRETS · QUALITY', 14.5, MINT, 'RM', 700, 'start', .2);
B(1292); body(ex, 826, 488, 'pgcrypto: HMAC-SHA256 + bcrypt (cost 10)'); body(ex, 826, 510, 'private.secret = PIN pepper, never in the API'); body(ex, 826, 532, '27 RLS policies · 17 migrations (expand → contract)', MUTE);
var tapT = T(ex, 826, 556, '', 15, MINT, 'RM', 700); PHI(ex, 'seal-check', 1264, 446, 26, MINT);

// ---------- column C · external ----------
E('text', { x: 1332, y: 97, fill: DIM, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'letter-spacing': 2 }, svg, 'EXTERNAL / OPS');
var gh = CARD(svg, 1332, 104, 244, 144, 'GITHUB ACTIONS', TXT); SII(gh, 'github', 1544, 107, 22, TXT);
B(1546); ['ci · every PR', 'nightly · e2e + mutation', 'security · gitleaks', 'release · tag → deploy', 'backup · weekly + drill'].forEach(function (s, i) { body(gh, 1346, 150 + i * 20, s); });
var ghDots = []; for (var gi = 0; gi < 5; gi++) ghDots.push(E('circle', { cx: 1562, cy: 145 + gi * 20, r: 4.5, fill: MINT, opacity: .3 }, gh));
var bk = CARD(svg, 1332, 256, 244, 94, 'BACKUP STORE · R2', SAF); SII(bk, 'cloudflare', 1544, 259, 22, SAF); B(1570); body(bk, 1346, 300, 'encrypted dumps (GPG)'); body(bk, 1346, 320, 'weekly + monthly'); body(bk, 1346, 340, 'passphrase held offline', MUTE);
var se = CARD(svg, 1332, 358, 244, 82, 'SENTRY · UPTIME', ROSE); SII(se, 'sentry', 1544, 361, 22, ROSE); var ecg = E('polyline', { fill: 'none', stroke: ROSE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, se); B(1570); body(se, 1346, 432, 'errors · releases · probe', MUTE);
var ms = E('g', {}); R(ms, 1332, 448, 244, 60, { fill: PANEL, stroke: GREY, 'stroke-width': 2, 'stroke-dasharray': '6 5' }); B(1566); T(ms, 1346, 472, 'MESSAGING · DORMANT', 14.5, GREY, 'RM', 700, 'start', .2); T(ms, 1346, 496, 'sender kept · off', 15, GREY, 'IN', 500);
R(ms, 1520, 480, 44, 20, { fill: '#0b0d28', stroke: GREY, 'stroke-width': 2, rx: 10 }); E('circle', { cx: 1531, cy: 490, r: 7, fill: GREY }, ms);
var dn = CARD(svg, 1332, 516, 244, 68, 'DNS · DOMAIN', SKY); B(1570); T(dn, 1346, 561, 'QR URLs carry the host', 14.5, MUTE, 'IN', 500); T(dn, 1346, 577, 'new domain = reprint labels', 14.5, MUTE, 'IN', 500);

// ---------- ticker (CI gates) ----------
R(svg, 24, 592, 1552, 30, { fill: '#0d0f2a', stroke: LINE, 'stroke-width': 1.5, rx: 8 }); CLIP('tkclip', 30, 594, 1540, 26);
var tk = E('g', { 'clip-path': 'url(#tkclip)' }), tkIn = E('g', {}, tk), TKS = 'CI GATES ▸ ESLINT 0 WARNINGS · TSC STRICT · VITEST shared 100% · web lib ≥ 95% · PGTAP on a fresh DB · SQLFLUFF · KNIP · AXE · PLAYWRIGHT on 2G + flaky profiles · STRYKER nightly · k6 load vs staging · MANUAL APPROVAL · SMOKE · ROLLBACK = VERCEL INSTANT PROMOTE ▸ ';
var tkT1 = E('text', { x: 30, y: 613, fill: MUTE, 'font-family': 'RM', 'font-weight': 500, 'font-size': 15.5 }, tkIn, TKS), tkT2 = E('text', { x: 30, y: 613, fill: MUTE, 'font-family': 'RM', 'font-weight': 500, 'font-size': 15.5 }, tkIn, TKS);

// ---------- bottom panels ----------
var lc = CARD(svg, 24, 632, 476, 260, 'COUPON LIFECYCLE', SAF);
var N = { GEN: [90, 722, 'GENERATED', GREY], ACT: [262, 722, 'ACTIVE', MINT], RED: [434, 722, 'REDEEMED*', SAF], BLK: [90, 822, 'BLOCKED', ROSE], EXP: [262, 822, 'EXPIRED', ROSE], HLD: [434, 822, 'HELD', LIL] }, nodeG = {}, NW = 112;
function lbl(x, y, s, col, anchor) { return E('text', { x: x, y: y, fill: col, 'font-family': 'IN', 'font-weight': 700, 'font-size': 14.5, 'text-anchor': anchor || 'middle' }, svg, s); }
function pth(d, col) { return E('path', { d: d, stroke: col, 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '5 6', opacity: .85 }); }
pth('M' + (90 + NW / 2) + ' 722 H' + (262 - NW / 2), GREY); lbl(176, 696, 'activate', GREY);
pth('M' + (262 + NW / 2) + ' 722 H' + (434 - NW / 2), SAF); lbl(348, 696, 'validate', SAF);
pth('M' + (434 - 30) + ' 701 C' + (434 - 40) + ' 652 ' + (262 + 40) + ' 652 ' + (262 + 30) + ' 701', LIL); lbl(352, 650, 'reverse · admin + reason', LIL);
pth('M90 743 V801', ROSE); lbl(100, 778, 'block', ROSE, 'start'); pth('M262 743 V801', MINT); lbl(272, 778, 'cron 19:30', MINT, 'start'); pth('M434 743 V801', LIL); lbl(444, 778, 'hold', LIL, 'start');
for (var k in N) { var n = N[k], g = E('g', {}); R(g, n[0] - NW / 2, n[1] - 21, NW, 42, { fill: PANEL2, stroke: n[3], 'stroke-width': 2.5, rx: 21 }); E('text', { x: n[0] - 28, y: n[1] + 6, fill: TXT, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'text-anchor': 'start' }, g, n[2]); nodeG[k] = g.firstChild; }
B(494); T(svg, 36, 868, '*stored REDEEMED, shown "Validated" · DB-enforced', 14.5, MUTE, 'IN', 500); T(svg, 36, 886, 're-validate = same result · every edge is logged', 14.5, DIM, 'IN', 500);
var pn = CARD(svg, 510, 632, 392, 260, 'PIN LOGIN · 7 STEPS', SKY);
var PIN = ['pin-login · body ≤ 1 KB · E.164', 'edge check · per-IP 40 / 10 min', 'HMAC(pin, pepper) → bcrypt', 'fail → one 401 · lock 15 min ×4', 'GoTrue generate_link → verify', 'tokens · device login 183 days', 'every call: RPC + JWT → assert_role'], pinHi = R(pn, 518, 0, 376, 28, { fill: SKY, opacity: 0, rx: 8 }), pinN = [];
PIN.forEach(function (s, i) { var y = 664 + i * 31.5; E('circle', { cx: 536, cy: y + 14, r: 11, fill: PANEL2, stroke: SKY, 'stroke-width': 2 }, pn); E('text', { x: 536, y: y + 19.5, fill: SKY, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'text-anchor': 'middle' }, pn, String(i + 1)); B(894); pinN.push(T(pn, 556, y + 20, s, 16, TXT, 'IN', 500)); });
var sc = CARD(svg, 912, 632, 322, 260, 'SECURITY CONTROLS', ROSE);
var SEC = ['RLS on all 33 tables', 'SECURITY DEFINER · pinned path', 'peppered HMAC + bcrypt PINs', 'rate limits: login · lookup · scan', 'CORS: one origin · strict schemas', 'add-only audit · weekly review', 'gitleaks + dependency audit'], secI = [];
SEC.forEach(function (s, i) { var y = 664 + i * 31.5; secI.push(PHI(sc, 'shield-check', 926, y + 3, 22, GREY)); B(1228); T(sc, 954, y + 20, s, 16, TXT, 'IN', 500); });
var ag = CARD(svg, 1244, 632, 332, 260, 'AT A GLANCE', MINT);
var GL = [['1000', 'coupons loaded', SAF], ['33', 'tables · RLS', MINT], ['134', 'DB functions', SKY], ['27', 'RLS policies', ROSE], ['10', 'edge functions', LIL], ['17', 'migrations', MUTE], ['183 d', 'device login', MINT], ['96 KB', 'dealer JS gz', SAF]], glN = [];
GL.forEach(function (c, i) { var x = 1260 + (i % 2) * 158, y = 664 + Math.floor(i / 2) * 44; B(x + 150); glN.push(T(ag, x, y + 19, c[0], 23, c[2], 'SO', 800)); T(ag, x, y + 39, c[1], 14.5, MUTE, 'IN', 500); });
B(1570); T(ag, 1260, 852, 'code = 12 symbols + 1 Luhn mod-32 check', 14.5, MUTE, 'IN', 500);
var cells = []; for (var ci = 0; ci < 13; ci++) cells.push(R(ag, 1260 + ci * 23.5, 860, 20, 20, { fill: ci === 12 ? SAF : '#26306a', rx: 4 }));

// auto-fit pass (after fonts are in): shrink anything that would cross its card, log what had to go below 14.5
function fitAll() { var bad = []; FIT.forEach(function (f) { var e = f[0], mw = f[1]; if (mw <= 0) return; var L = e.getComputedTextLength(); if (L > mw) { var s = f[2] * mw / L; if (s < 14.5) bad.push(e.textContent + ' (' + Math.round(s * 10) / 10 + ')'); e.setAttribute('font-size', Math.max(12, s)); } }); window.__fitBad = bad; }

// ---------- moving parts ----------
var legs = [];
function PK(col, r, pts, a, b, label, lblcol) { r = (r || 7) + 1.5; var g = E('g', { opacity: 0 }); E('circle', { r: r + 8, fill: col, opacity: .25, filter: 'url(#glow)' }, g); E('circle', { r: r, fill: col }, g); E('circle', { r: r * .45, fill: '#ffffff', opacity: .85 }, g); var lab = label ? E('text', { class: 'pk', x: 0, y: -13, fill: lblcol || col, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'text-anchor': 'middle', stroke: BG, 'stroke-width': 4, 'paint-order': 'stroke', 'stroke-linejoin': 'round' }, g, label) : null; legs.push({ g: g, pts: pts, a: a, b: b }); return g; }
function pathLen(pts) { var L = 0; for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
function place(leg, p) { if (p <= 0 || p >= 1) { leg.g.setAttribute('opacity', 0); return; } var pts = leg.pts, d = sm(p) * pathLen(pts), i = 1, sl;
  while (i < pts.length - 1 && d > (sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))) { d -= sl; i++; }
  var a = pts[i - 1], b = pts[i], s = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, q = clamp(d / s, 0, 1); leg.g.setAttribute('transform', 'translate(' + lerp(a[0], b[0], q) + ',' + lerp(a[1], b[1], q) + ')'); leg.g.setAttribute('opacity', Math.min(1, p * 8, (1 - p) * 8)); }
var DBY = 224, FNX = 1064;
function toPWA(i, y) { return [[250, CY[i]], [262, CY[i]], [262, y], [284, y]]; }
function pwaToRest(y) { return [[500, y], [517, y], [517, 380], [534, 380]]; }
function restToDb() { return [[790, 380], [797, 380], [797, DBY], [FNX, DBY]]; }
function dbToClient(i, y) { return [[FNX, DBY], [797, DBY], [797, 380], [790, 380], [534, 380], [517, 380], [517, y], [500, y], [284, y], [262, y], [262, CY[i]], [250, CY[i]]]; }
// 1 label printed → public scan → lookup (state only) → state returns
PK(MUTE, 7, [[256, CY[4]], [262, CY[4]], [262, CY[0]], [256, CY[0]]], 0, .8, 'label');
PK(SAF, 7, toPWA(0, 200), .5, 1.0, 'scan'); PK(SAF, 6, pwaToRest(200), 1.0, 1.35); PK(SAF, 6, restToDb(), 1.35, 1.8, 'lookup');
PK(MINT, 6, dbToClient(0, 200), 1.9, 2.6, 'ACTIVE');
// 2 dealer login: PIN → PWA → edge → DB (HMAC) → fail bounce → GoTrue → JWT back
PK(SKY, 7, toPWA(1, 226), 2.2, 2.75, 'PIN'); PK(SKY, 6, [[500, 226], [517, 226], [517, 232], [534, 232]], 2.75, 3.1);
PK(SKY, 6, [[790, 232], [797, 232], [797, DBY], [FNX, DBY]], 3.4, 3.95, 'HMAC');
PK(ROSE, 6, [[534, 252], [640, 252], [534, 252]], 3.9, 4.4);
PK(LIL, 6, [[534, 290], [517, 290], [517, 510], [534, 510]], 4.3, 4.85, 'link');
PK(LIL, 7, [[534, 530], [517, 530], [517, 226], [284, 226], [262, 226], [262, CY[1]], [250, CY[1]]], 4.9, 5.6, 'JWT');
// 3 validate: dealer → PWA → RPC → DB → state edge; response back
PK(SAF, 7, toPWA(1, 252), 5.35, 5.8, 'validate'); PK(SAF, 6, pwaToRest(252), 5.8, 6.05); PK(SAF, 6, restToDb(), 6.05, 6.5);
PK(MINT, 7, dbToClient(1, 252), 6.85, 7.65, 'Validated');
// 4 replay (idempotent) → same result
PK(SAF, 6, toPWA(1, 252).concat([[500, 252], [517, 252], [517, 380], [790, 380], [797, 380], [797, DBY], [FNX, DBY]]), 7.9, 8.8, 'again');
// 5 HQ board reads it live, later reverses
PK(MINT, 6, toPWA(3, 278).concat([[500, 278], [517, 278], [517, 380], [790, 380], [797, 380], [797, DBY], [FNX, DBY]]), 7.1, 8.0, 'board');
PK(LIL, 6, toPWA(3, 278).concat([[500, 278], [517, 278], [517, 380], [790, 380], [797, 380], [797, DBY], [FNX, DBY]]), 8.9, 9.8, 'reverse');
// 6 backup dump + CI deploy
PK(SAF, 6, [[1300, 520], [1318, 520], [1318, 330], [1332, 330]], 10.9, 11.7, 'dump');
PK(MINT, 6, [[1500, 607], [1200, 607], [700, 607], [392, 607], [392, 584]], 10.0, 11.2, 'deploy');
var chipsN = []; function CHIP(w, col, s) { var g = E('g', { opacity: 0, class: 'pk' }); R(g, -w / 2, -17, w, 25, { fill: PANEL2, stroke: col, 'stroke-width': 2, rx: 12.5 }); E('text', { x: 0, y: 1, fill: col, 'font-family': 'RM', 'font-weight': 700, 'font-size': 14.5, 'text-anchor': 'middle' }, g, s); return g; }
var chActive = CHIP(86, MINT, 'ACTIVE'), chValid = CHIP(98, SAF, 'Validated'), chFail = CHIP(160, ROSE, '401 LOGIN_FAILED'), chSame = CHIP(98, LIL, 'same result'), chRec = CHIP(116, MINT, '0 issues ✓'), chBoard = CHIP(102, MINT, 'valid: 1');
var tokMain = E('g', {}); E('circle', { r: 11, fill: SAF, opacity: .3, filter: 'url(#glow)' }, tokMain); E('circle', { r: 6.5, fill: SAF }, tokMain);
var tokG = [MINT, ROSE, ROSE, LIL].map(function (c) { var g = E('g', { opacity: 0 }); E('circle', { r: 5.5, fill: c }, g); return g; });

window.__seek = function (t) {
  var u = (t + OFF) % DUR;
  var cx1 = -((t * 22) % (CHW[0] || 1)), cx2 = -((t * 17) % (CHW[1] || 1));
  rowA.setAttribute('transform', 'translate(' + (1090 + cx1) + ',0)'); rowA2.setAttribute('transform', 'translate(' + (1090 + cx1 + CHW[0]) + ',0)'); rowB.setAttribute('transform', 'translate(' + (1090 + cx2) + ',0)'); rowB2.setAttribute('transform', 'translate(' + (1090 + cx2 + CHW[1]) + ',0)');
  var tkw = tkT1.getComputedTextLength() || 1; tkIn.setAttribute('transform', 'translate(' + (-((t * 60) % tkw)) + ',0)'); tkT2.setAttribute('x', 30 + tkw);
  bus1.setAttribute('stroke-dashoffset', -u * 40);
  clientG.forEach(function (c, i) { var a = i === 0 ? bell(u, .3, 2.7) : i === 1 ? bell(u, 2.1, 8.9) : i === 3 ? bell(u, 7.0, 10.0) : i === 4 ? bell(u, 0, .9) : 0; c.ring.setAttribute('opacity', .35 + .65 * a); c.ring.setAttribute('r', 6 + 3 * a); });
  swDot.setAttribute('opacity', .6 + .4 * Math.sin(u * 5));
  var rIdx = u < 2.1 ? 0 : u < 6.9 ? 1 : u < 10.2 ? 3 : 0; rtHi.setAttribute('y', 308 + rIdx * 26); rtHi.setAttribute('opacity', .2 + .12 * Math.sin(u * 6));
  budF.forEach(function (b, i) { b.setAttribute('opacity', .72 + .28 * Math.sin(u * 3 + i)); });
  // tables: shimmer + the ones touched by the current step glow
  tiles.forEach(function (tl_, i) { var v = Math.max(0, Math.sin(u * 2.2 + hash(i) * 12)), hot = (i === 0 && u > 6.2 && u < 7.6) || (i === 1 && u > 6.5 && u < 7.8) || (i === 4 && u > 3.5 && u < 4.4) || (i === 12 && u > 9.3 && u < 10.2) || (i === 20 && u > 10.8 && u < 11.8);
    tl_.setAttribute('fill', hot ? SAF : '#26306a'); tl_.setAttribute('opacity', hot ? 1 : .5 + .5 * v); });
  var hrs = 19.5 + (u - 10.4) * 2, ha = (hrs / 24) * 2 * Math.PI - Math.PI / 2; hand.setAttribute('x2', CX + 28 * Math.cos(ha)); hand.setAttribute('y2', CYY + 28 * Math.sin(ha));
  var pts = []; for (var xi = 0; xi < 48; xi++) { var xx = 1346 + xi * 4.6, p2 = ((xi + t * 20) % 24) / 24, yy = 404 + (p2 > .45 && p2 < .5 ? -18 : p2 > .5 && p2 < .55 ? 12 : 0); pts.push(xx + ',' + yy); } ecg.setAttribute('points', pts.join(' '));
  ghDots.forEach(function (d, i) { d.setAttribute('opacity', .25 + .75 * Math.max(0, Math.sin(u * 2.4 - i * .8))); });
  // security rows light up exactly when their control is exercised
  var secT = [[6.0, 7.3], [5.9, 7.0], [3.4, 4.2], [2.7, 3.3], [2.2, 2.8], [6.3, 7.2], [10.0, 11.4]];
  secT.forEach(function (s, i) { var a = bell(u, s[0] - .25, s[1] + .35); secI[i].setAttribute('fill', a > .05 ? MINT : GREY); secI[i].setAttribute('opacity', .5 + .5 * a); });
  // PIN steps, one every .5 s while the dealer logs in
  var step = u >= 2.4 && u < 5.9 ? Math.min(6, Math.floor((u - 2.4) / .5)) : -1; pinHi.setAttribute('y', 664 + Math.max(0, step) * 31.5 + 1); pinHi.setAttribute('opacity', step < 0 ? 0 : .22);
  pinN.forEach(function (n, i) { n.setAttribute('fill', i === step ? '#ffffff' : TXT); });
  // lifecycle: token on its edges; ghost tokens (other coupons) walk the remaining edges
  var inRed = u >= 6.55 && u < 9.1; nodeG.ACT.setAttribute('fill', inRed ? PANEL2 : 'rgba(53,232,176,.16)'); nodeG.RED.setAttribute('fill', inRed ? 'rgba(255,176,46,.22)' : PANEL2); nodeG.EXP.setAttribute('fill', bell(u, 10.2, 12) > .1 ? 'rgba(255,93,143,.2)' : PANEL2); nodeG.BLK.setAttribute('fill', bell(u, 11.0, 12.6) > .1 ? 'rgba(255,93,143,.2)' : PANEL2);
  var TOK = -42, tx = N.ACT[0] + TOK, ty = N.ACT[1];
  if (u >= 6.1 && u < 6.7) { tx = lerp(N.ACT[0], N.RED[0], sm(seg(u, 6.1, 6.7))) + TOK; } else if (u >= 6.7 && u < 9.1) { tx = N.RED[0] + TOK; } else if (u >= 9.1 && u < 9.8) { var q2 = sm(seg(u, 9.1, 9.8)); tx = lerp(N.RED[0], N.ACT[0], q2) + TOK; ty = N.ACT[1] - 52 * Math.sin(Math.PI * q2); }
  tokMain.setAttribute('transform', 'translate(' + tx + ',' + ty + ')');
  function ghost(el, a, b, p0, p1) { var q = seg(u, p0, p1); if (q <= 0 || q >= 1) { el.setAttribute('opacity', 0); return; } var e = sm(q); el.setAttribute('opacity', Math.min(1, q * 8, (1 - q) * 8)); el.setAttribute('transform', 'translate(' + (lerp(N[a][0], N[b][0], e) - 42) + ',' + lerp(N[a][1], N[b][1], e) + ')'); }
  ghost(tokG[0], 'GEN', 'ACT', .3, 1.3); ghost(tokG[1], 'ACT', 'EXP', 10.2, 11.0); ghost(tokG[2], 'GEN', 'BLK', 11.0, 11.8); ghost(tokG[3], 'RED', 'HLD', 3.4, 4.4);
  // packets
  legs.forEach(function (l) { place(l, seg(u, l.a, l.b)); });
  // edge function / postgrest / gotrue / db function highlights
  efHi.setAttribute('opacity', seg(u, 2.8, 3.1) * (1 - seg(u, 4.8, 5.0)) * .28); rl.setAttribute('width', 150 * bell(u, 2.7, 4.0) * .85);
  prHi.setAttribute('opacity', Math.min(1, bell(u, 1.0, 1.5) + bell(u, 5.8, 6.1) + bell(u, 7.1, 7.5) + bell(u, 7.9, 8.4) + bell(u, 9.0, 9.4)));
  gtHi.setAttribute('opacity', bell(u, 4.3, 5.0));
  var fIdx = [[1.5, 2.2, 0], [3.4, 4.1, 1], [6.1, 7.0, 3], [7.9, 8.8, 3], [8.1, 8.9, 6], [9.4, 10.1, 7], [10.2, 10.8, 8], [10.9, 11.6, 9]].filter(function (a) { return u >= a[0] && u < a[1]; }), fi = fIdx.length ? fIdx[fIdx.length - 1][2] : -1, lastFi = fi >= 0 ? fi : (u < 1.5 ? 0 : 3);
  fnIn.setAttribute('transform', 'translate(0,' + (-clamp(lastFi - 1, 0, 8) * 24) + ')'); fnHi.setAttribute('y', 196 + lastFi * 24 + 0); fnHi.setAttribute('opacity', fi >= 0 ? .25 + .1 * Math.sin(u * 8) : 0);
  lockIc.setAttribute('opacity', .35 + .65 * bell(u, 6.0, 6.8)); recB.forEach(function (b, i) { b.setAttribute('width', 66 * (1 - .09 * Math.abs(Math.sin(u * 2.6 + i)))); });
  tapT.textContent = 'pgTAP · ok ' + (1000 + Math.floor(u * 40)) + ' assertions';
  // result chips
  function chip(g, x, y, a, b) { var o = seg(u, a, a + .25) * (1 - seg(u, b - .25, b)); g.setAttribute('opacity', o); g.setAttribute('transform', 'translate(' + x + ',' + y + ')'); }
  chip(chActive, 202, 104 + 30, 2.3, 3.4); chip(chFail, 636, 248, 3.95, 5.0); chip(chValid, 202, 200 + 30, 7.4, 8.4); chip(chSame, 202, 200 + 30, 8.8, 9.7); chip(chBoard, 202, 392 + 30, 8.1, 9.0); chip(chRec, 1190, 340, 10.9, 12.0);
};
window.__reelDurationSec = DUR; window.__ready = false;
Promise.all(['800 20px SO', '700 20px SO', '500 20px RM', '700 20px RM', '500 20px IN', '700 20px IN'].map(function (f) { return document.fonts.load(f).catch(function () {}); })).then(function () { fitAll(); window.__seek(0); window.__ready = true; });
})();
