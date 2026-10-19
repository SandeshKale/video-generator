// The eight pages of TOGAF 10 prep notes (Level 1 Foundation + Level 2 Practitioner).
// Facts checked 19 Oct 2026 against The Open Group's exam pages (Part 1: 40 Qs / 60 min / 60% / closed book;
// Part 2: 8 scenario Qs / 90 min / 5-3-1-0 gradient scoring / 24 of 40 / open book, e-copy built in).
var X = 205;
var PAGES = {
 // 1 — exam facts + plan
 1: function () {
  W(0, X, '{k:TOGAF® 10  —  exam prep notes}', { size: 80, w: 700 });
  R.line(X, L(0) + 14, X + 760, L(0) + 10, { stroke: '#c22630', strokeWidth: 4 }); R.line(X + 10, L(0) + 24, X + 740, L(0) + 22, { stroke: '#c22630', strokeWidth: 3 });
  W(1, X, 'Level 1 = {hy:Foundation} (Part 1)   ·   Level 2 = {hg:Practitioner} (Part 2)', { size: 50 });
  R.box(X - 10, L(2) + 14, 620, 470, { stroke: '#1d2f86', strokeWidth: 3.2 });
  R.box(X + 650, L(2) + 14, 660, 470, { stroke: '#17734a', strokeWidth: 3.2 });
  W(3, X + 20, '{u:LEVEL 1 — Foundation}', { size: 54, w: 700, ink: 'k' });
  W(4, X + 20, '• 40 multiple choice Qs');
  W(5, X + 20, '• 60 minutes');
  W(6, X + 20, '• pass = 60% → {o:24 / 40}');
  W(7, X + 20, '• {r:CLOSED book} ✗');
  W(8, X + 20, '• tests: terms + concepts');
  W(3, X + 670, '{u:LEVEL 2 — Practitioner}', { size: 54, w: 700, ink: 'g' });
  W(4, X + 670, '• 8 scenario Qs (4 options)');
  W(5, X + 670, '• 90 min  (≈ 11 min each)');
  W(6, X + 670, '• pass = 24 / 40 points');
  W(7, X + 670, '• {g:OPEN book} — e-copy built in');
  W(8, X + 670, '• scored {hy:5 / 3 / 1 / 0}');
  W(10, X, 'Need L1 first (or pass Part 1 same day, same test centre).');
  W(11, X, 'Combined exam OGEA-103 = both parts, {u:150 min} total.', { ink: 'k' });
  W(13, X, '{uu:My 4-week plan}', { size: 60, w: 700, ink: 'k' });
  var plan = [[1, 'wk 1 — ADM phases + objectives of each'], [1, 'wk 2 — concepts: continuum, repository, building blocks'], [1, 'wk 3 — outputs per phase + governance'], [0, 'wk 4 — scenario practice  ({r:time every one!})'], [0, '3 full mock exams → aim for 70%+'], [0, 'last 2 days: revise my own notes ONLY']];
  plan.forEach(function (p, i) { R.cbox(X, L(15 + i * 1.5) - 4, p[0]); W(0, X + 60, p[1], { y: L(15 + i * 1.5) }) });
  W(24, X + 40, '“Learn {hy:WHY} each phase exists.”', { size: 56, ink: 'k' });
  R.star(X + 10, L(24) - 18, 22, { stroke: '#c22630', strokeWidth: 3 });
  W(25, X + 300, '— me, after mock #1', { size: 44, ink: 'p' });
  R.stain(1380, 2130, 130);
 },
 // 2 — basics + the four domains
 2: function () {
  W(0, X, '{k:1. Basics — what TOGAF actually is}', { size: 70, w: 700 });
  R.line(X, L(0) + 14, X + 900, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  W(1, X, 'TOGAF = The Open Group Architecture Framework');
  W(2, X, '10th Edition = {hy:Fundamental Content} + {hy:Series Guides}');
  W(3, X, '→ a {u:method} (ADM) + content + capability guidance');
  W(5, X, '{k:Architecture} = structure of components, their');
  W(6, X + 40, 'relationships, + {r:principles} that govern design & change');
  W(7, X, '{k:Enterprise} = can span many orgs (whole company,');
  W(8, X + 40, 'one division, or a partner network)');
  W(10, X, '{uu:4 architecture domains  (BDAT)}', { size: 58, w: 700, ink: 'k' });
  var dm = [['BUSINESS', 'strategy, governance, org, key processes', '#c22630'], ['DATA', 'logical + physical data assets', '#1d2f86'], ['APPLICATION', 'apps, how they interact, map to processes', '#1d2f86'], ['TECHNOLOGY', 'software + hardware: infra, network, middleware', '#17734a']];
  dm.forEach(function (d, i) { var y = L(11) + 20 + i * 132; R.box(X + 10, y, 1000, 112, { stroke: d[2], strokeWidth: 3 }); W(0, X + 40, d[0], { y: y + 72, font: 'a', size: 40, ink: i ? (i === 3 ? 'g' : 'b') : 'r' }); W(0, X + 360, d[1], { y: y + 72, size: 46 }) });
  R.path('M ' + (X + 1040) + ' ' + (L(11) + 162) + ' q 34 6 34 60 q 0 50 30 58 q -30 8 -30 58 q 0 54 -34 60', { stroke: '#c22630', strokeWidth: 3.2 });
  W(0, X + 1110, '{r:Information}', { y: L(11) + 260, size: 46 }); W(0, X + 1110, '{r:Systems Archs}', { y: L(11) + 306, size: 46 }); W(0, X + 1110, '{hp:= Phase C}', { y: L(11) + 356, size: 46 });
  W(20, X, '{k:Why bother with EA?}', { size: 56, w: 700 });
  W(21, X, '✓ business + IT pull the same way');
  W(22, X, '✓ less duplication, cheaper change, lower risk');
  W(23, X, '✓ decisions traceable to {hy:principles}');
  W(25, X, 'Exam tip: TOGAF is {u:tailored} to the org — not used "as is"', { ink: 'k' });
  W(26, X, '{x:mandatory checklist} → it\'s a {o:framework}, adapt it', { size: 50 });
 },
 // 3 — the ADM crop circle
 3: function () {
  W(0, X, '{k:2. The ADM cycle  (the heart of it!)}', { size: 70, w: 700 });
  R.line(X, L(0) + 14, X + 880, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  var cx = 860, cy = 1080, Rr = 560, ph = [['A', 'Architecture', 'Vision'], ['B', 'Business', 'Architecture'], ['C', 'Information Sys.', 'Architectures'], ['D', 'Technology', 'Architecture'], ['E', 'Opportunities', '& Solutions'], ['F', 'Migration', 'Planning'], ['G', 'Implementation', 'Governance'], ['H', 'Arch. Change', 'Management']];
  R.ell(cx, cy - Rr - 200, 260, 140, { stroke: '#17171c', strokeWidth: 3 });
  W(0, cx, '{k:Preliminary}', { y: cy - Rr - 190, font: 'a', size: 36, center: 260 });
  R.arrow(cx, cy - Rr - 128, cx, cy - Rr - 100, { stroke: '#17171c', head: 18 });
  ph.forEach(function (p, i) {
   var a = -Math.PI / 2 + i * Math.PI / 4, x = cx + Rr * Math.cos(a), y = cy + Rr * Math.sin(a);
   R.ell(x, y, 300, 196, { stroke: i < 4 ? '#1d2f86' : (i < 6 ? '#17734a' : '#c22630'), strokeWidth: 3.2 });
   W(0, x, '{k:' + p[0] + '}', { y: y - 34, font: 'a', size: 44, center: 290 });
   W(0, x, p[1], { y: y + 16, font: 'a', size: 30, center: 290 }); W(0, x, p[2], { y: y + 56, font: 'a', size: 30, center: 290 });
   var a2 = a + Math.PI / 4, m = .62;
   R.arrow(cx + Rr * Math.cos(a + .3), cy + Rr * Math.sin(a + .3), cx + Rr * Math.cos(a2 - .3), cy + Rr * Math.sin(a2 - .3), { curve: -40, stroke: '#5a5f66', strokeWidth: 2.6, head: 18 });
   R.arrow(cx + (Rr - 152) * Math.cos(a), cy + (Rr - 120) * Math.sin(a), cx + 200 * Math.cos(a), cy + 124 * Math.sin(a), { both: 1, stroke: '#5a5f66', strokeWidth: 2.2, head: 14 });
  });
  R.ell(cx, cy, 360, 220, { stroke: '#c22630', strokeWidth: 3.6 });
  W(0, cx, '{r:Requirements}', { y: cy - 8, font: 'a', size: 32, center: 300 }); W(0, cx, '{r:Management}', { y: cy + 34, font: 'a', size: 32, center: 300 });
  W(25, X, 'Mnemonic: {hy:P}lease {hy:A}lways {hy:B}ring {hy:C}offee {hy:D}uring', { size: 52 });
  W(26, X + 210, '{hy:E}very {hy:F}riday {hy:G}roup {hy:H}uddle', { size: 52 });
  W(27, X, '{k:ADM = iterative} → loop back between phases when needed!', { size: 50 });
  W(28, X, 'centre talks to {u:every} phase — reqs change all the time', { size: 48, ink: 'p' });
 },
 // 4 — phase cheat-sheet table
 4: function () {
  W(0, X, '{k:3. Phase cheat-sheet  (why + key output)}', { size: 66, w: 700 });
  R.line(X, L(0) + 14, X + 1000, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  var rows = [['Prelim', 'get ready: who, how, principles', 'Org model for EA, tailored framework, principles'],
   ['A', 'scope + stakeholder buy-in', '{hy:Statement of Arch. Work}, Arch. Vision'],
   ['B', 'business baseline → target', 'Arch. Definition Doc (draft), Arch. Req. Spec'],
   ['C', 'data + application archs', 'ADD + ARS updated'],
   ['D', 'technology arch', 'ADD + ARS updated'],
   ['E', 'first cut: what to build, when', '{hy:Transition Architectures}, Roadmap'],
   ['F', 'prioritise + cost + plan', 'final Implementation & Migration Plan'],
   ['G', 'oversee the build', '{hy:Architecture Contract}, compliance checks'],
   ['H', 'keep the arch current', 'change requests, new Req. for Arch. Work'],
   ['Req. Mgmt', 'always on, every phase', 'Requirements Impact Assessment']];
  var y0 = L(1) + 26, rh = 132, c1 = X - 10, c2 = X + 190, c3 = X + 690, c4 = 1530;
  R.line(c1, y0, c4, y0, { stroke: '#17171c', strokeWidth: 2.6 });
  W(0, c1 + 14, '{k:Phase}', { y: y0 + 50, size: 46, w: 700 }); W(0, c2 + 14, '{k:Why it exists}', { y: y0 + 50, size: 46, w: 700 }); W(0, c3 + 14, '{k:Key output(s)}', { y: y0 + 50, size: 46, w: 700 });
  rows.forEach(function (r, i) {
   var y = y0 + 70 + i * rh; R.line(c1, y, c4, y + (i % 2 ? 3 : -2), { stroke: '#17171c', strokeWidth: 2.2 });
   W(0, c1 + 14, '{k:' + r[0] + '}', { y: y + 80, size: r[0].length > 3 ? 40 : 54, w: 700, ink: 'k' });
   W(0, c2 + 14, r[1], { y: y + 80, size: 42 });
   var t = r[2].split(', '); W(0, c3 + 14, t.slice(0, Math.ceil(t.length / 2)).join(', ') + (t.length > 1 ? ',' : ''), { y: y + 56, size: 40 }); if (t.length > 1) W(0, c3 + 14, t.slice(Math.ceil(t.length / 2)).join(', '), { y: y + 104, size: 40 });
  });
  var yb = y0 + 70 + rows.length * rh; R.line(c1, yb, c4, yb, { stroke: '#17171c', strokeWidth: 2.6 });
  [c1, c2, c3, c4].forEach(function (c) { R.line(c, y0, c + 2, yb, { stroke: '#17171c', strokeWidth: 2.2 }) });
  W(0, X, '{r:B, C, D all do:} baseline → target → {hy:gap analysis} → roadmap bits', { y: yb + 80, size: 50 });
  W(0, X, 'Req. for Arch. Work {u:triggers} A · E + F = migration planning', { y: yb + 146, size: 48, ink: 'p' });
 },
 // 5 — key concepts
 5: function () {
  W(0, X, '{k:4. Key concepts  (Level 1 loves these)}', { size: 66, w: 700 });
  R.line(X, L(0) + 14, X + 960, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  var bx = [['DELIVERABLE', 'formally reviewed,', 'agreed + signed off'], ['ARTIFACT', 'catalog, matrix', 'or diagram'], ['BUILDING BLOCK', 'reusable piece', '(potentially)']];
  bx.forEach(function (b, i) { var x = X - 10 + i * 440; R.box(x, L(1) + 20, 410, 210, { stroke: '#1d2f86', strokeWidth: 3 }); W(0, x + 205, '{k:' + b[0] + '}', { y: L(1) + 84, font: 'a', size: 30, center: 400 }); W(0, x + 205, b[1], { y: L(1) + 142, size: 44, center: 400 }); W(0, x + 205, b[2], { y: L(1) + 190, size: 44, center: 400 }) });
  W(6, X, '{uu:ABB vs SBB}', { size: 58, w: 700, ink: 'k' });
  W(7, X, '{hb:ABB} = Architecture Building Block → {u:WHAT} (capability,');
  W(8, X + 60, 'vendor-neutral)');
  W(9, X, '{hp:SBB} = Solution Building Block → {u:HOW} (real products)');
  R.arrow(1330, L(7) - 10, 1330, L(9) - 40, { stroke: '#c22630', strokeWidth: 3, curve: 40 }); W(0, 1370, '{r:realised by}', { y: L(8) - 6, size: 42 });
  W(11, X, '{uu:Enterprise Continuum}  (generic → specific)', { size: 58, w: 700, ink: 'k' });
  var st = ['Foundation', 'Common Systems', 'Industry', 'Organization-specific'], sx = [X, X + 300, X + 690, X + 960];
  R.arrow(X, L(13) + 40, 1520, L(13) + 40, { stroke: '#17171c', strokeWidth: 3.4, head: 26 });
  st.forEach(function (s, i) { W(0, sx[i], s, { y: L(13), font: 'a', size: 30, ink: i === 3 ? 'r' : 'b' }); R.line(sx[i] + 40, L(13) + 30, sx[i] + 40, L(13) + 52, { stroke: '#17171c', strokeWidth: 3 }) });
  W(15, X, 'Architecture Continuum  ⇄  Solutions Continuum');
  W(16, X + 60, '{p:(arch guides solutions · solutions support arch)}', { size: 46 });
  W(18, X, '{uu:Architecture Repository holds:}', { size: 58, w: 700, ink: 'k' });
  var rep = ['Architecture Metamodel', 'Architecture Capability', 'Architecture Landscape', 'Standards Library', 'Reference Library', 'Governance Log'];
  rep.forEach(function (r, i) { W(19 + Math.floor(i / 2) * 1.2, X + (i % 2) * 640, '• ' + r, { y: L(19) + Math.floor(i / 2) * 76 }) });
  W(23, X, '+ Architecture Requirements Repository, Solutions Landscape', { size: 48, ink: 'p' });
  W(25, X, 'Landscape levels: {hy:Strategic} → {hy:Segment} → {hy:Capability}');
  W(26, X + 60, '{p:(big picture → one area → one capability)}', { size: 46 });
 },
 // 6 — stakeholders, principles, gap analysis
 6: function () {
  W(0, X, '{k:5. Stakeholders, principles, gaps}', { size: 66, w: 700 });
  R.line(X, L(0) + 14, X + 880, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  W(1, X, 'stakeholder → has {hy:concerns} → {u:viewpoint} picks how to look');
  W(2, X, '→ a {u:view} is what you actually show them');
  var gx = X + 120, gy = L(3) + 30, gw = 560, gh = 460;
  R.arrow(gx, gy + gh, gx, gy - 20, { stroke: '#17171c', strokeWidth: 3 }); R.arrow(gx, gy + gh, gx + gw + 40, gy + gh, { stroke: '#17171c', strokeWidth: 3 });
  R.line(gx + gw / 2, gy, gx + gw / 2, gy + gh, { stroke: '#5a5f66', strokeWidth: 2.4 }); R.line(gx, gy + gh / 2, gx + gw, gy + gh / 2, { stroke: '#5a5f66', strokeWidth: 2.4 });
  var q = [['Keep', 'Satisfied', 'k', 0, 0], ['KEY', 'PLAYERS', 'r', 1, 0], ['Minimal', 'Effort', 'p', 0, 1], ['Keep', 'Informed', 'b', 1, 1]];
  q.forEach(function (c) { var x = gx + gw / 4 + c[3] * gw / 2, y = gy + gh / 4 + c[4] * gh / 2; W(0, x, '{' + c[2] + ':' + c[0] + '}', { y: y - 4, font: 'a', size: 30, center: 260 }); W(0, x, '{' + c[2] + ':' + c[1] + '}', { y: y + 36, font: 'a', size: 30, center: 260 }) });
  W(0, gx - 90, 'power', { y: gy + 40, font: 'a', size: 26, rot: -90 }); W(0, gx + gw - 60, 'interest', { y: gy + gh + 50, font: 'a', size: 26 });
  W(0, gx + gw + 110, '{k:Power/interest grid}', { y: gy + 70, size: 50, w: 700 });
  W(0, gx + gw + 110, 'map them in Phase A,', { y: gy + 136, size: 46 }); W(0, gx + gw + 110, 'keep it updated', { y: gy + 196, size: 46 });
  R.ell(gx + gw * .75, gy + gh * .25, 270, 150, { stroke: '#c22630', strokeWidth: 3 });
  W(13, X, '{uu:Principle template}  (4 parts — always!)', { size: 58, w: 700, ink: 'k' });
  W(14, X, '{hy:Name} · {hy:Statement} · {hy:Rationale} · {hy:Implications}');
  W(15, X + 40, 'e.g. "Data is an asset" → why → what changes because of it', { size: 46, ink: 'p' });
  W(17, X, '{uu:Gap analysis}  baseline vs target', { size: 58, w: 700, ink: 'k' });
  var mx = X + 20, my = L(18) + 10, cw = 300, ch = 92, hd = ['', 'Target: X', 'Target: Y', 'Eliminated'], rw = [['Base: X', '{g:keep ✓}', '', ''], ['Base: Z', '', '', '{r:gap!}'], ['New', '', '{r:gap!}', '']];
  for (var i = 0; i <= 4; i++) R.line(mx + i * cw, my, mx + i * cw + 2, my + 4 * ch, { stroke: '#17171c', strokeWidth: 2.2 });
  for (var j = 0; j <= 4; j++) R.line(mx, my + j * ch, mx + 4 * cw, my + j * ch + 2, { stroke: '#17171c', strokeWidth: 2.2 });
  hd.forEach(function (h, i) { if (h) W(0, mx + i * cw + 20, '{k:' + h + '}', { y: my + 62, size: 42 }) });
  rw.forEach(function (r, j) { r.forEach(function (c, i) { if (c) W(0, mx + i * cw + 20, c, { y: my + (j + 1) * ch + 62, size: 42 }) }) });
  W(26, X, 'Business scenarios → objectives must be {hy:SMART}', { size: 50 });
  W(27, X + 40, '{p:Specific · Measurable · Actionable · Realistic · Time-bound}', { size: 44 });
 },
 // 7 — Level 2 scenario strategy
 7: function () {
  W(0, X, '{g:LEVEL 2 — how to attack the scenarios}', { size: 66, w: 700 });
  R.line(X, L(0) + 14, X + 1000, L(0) + 12, { stroke: '#17734a', strokeWidth: 3.5 });
  W(1, X, '8 Qs × 4 answers →  best {hy:5} · 2nd {hy:3} · 3rd {hy:1} · distractor {r:0}');
  W(2, X, 'need {o:24 / 40}.  Wait — {u:all 2nd-best} = 8 × 3 = 24 = PASS!', { ink: 'k' });
  R.star(1500, L(2) - 20, 24, { stroke: '#c22630' });
  W(4, X, '{uu:My 5-step method}', { size: 58, w: 700, ink: 'k' });
  var st = ['Read the {hy:QUESTION} first, then the scenario', 'Where are we in the ADM? (phase = context)', 'Whose {u:concern} is it? what do they really need?', 'Kill the distractor (usually skips a step)', 'Pick the most "TOGAF" answer: iterate, involve'];
  st.forEach(function (s, i) { var y = L(5 + i * 1.3); R.ell(X + 22, y - 18, 52, 52, { stroke: '#17734a', strokeWidth: 2.8 }); W(0, X + 10, '{g:' + (i + 1) + '}', { y: y, size: 46, w: 700 }); W(0, X + 72, s, { y: y }) });
  W(0, X + 72, '   stakeholders, follow principles, use governance', { y: L(5 + 4 * 1.3) + 62, size: 48 });
  W(13, X, '{uu:Traps I keep falling into}', { size: 58, w: 700, ink: 'k' });
  W(14, X, '✗ jumping to a tech product in Phase A');
  W(15, X, '✗ skipping stakeholder buy-in / sign-off');
  W(16, X, '✗ ignoring the Architecture Board + contracts');
  W(17, X, '✗ "big bang" instead of {hy:Transition Architectures}');
  W(19, X, '{uu:Timing}', { size: 58, w: 700, ink: 'k' });
  R.ell(X + 140, L(22) - 40, 200, 200, { stroke: '#17171c', strokeWidth: 3 }); R.line(X + 140, L(22) - 40, X + 140, L(22) - 120, { stroke: '#17171c', strokeWidth: 3.4 }); R.line(X + 140, L(22) - 40, X + 200, L(22) - 10, { stroke: '#c22630', strokeWidth: 3.4 });
  W(20, X + 300, '90 min ÷ 8 ≈ {hy:11 min / question}');
  W(21, X + 300, 'stuck > 13 min? pick best guess, flag, move on');
  W(22, X + 300, 'open book ≠ time to read it — know {u:where} things are');
  W(25, X, 'Practise with a timer. Review {r:why} the 5-pt answer wins,', { ink: 'k' });
  W(26, X, 'not just which letter it was.', { ink: 'k' });
  R.stain(330, 2080, 120);
 },
 // 8 — governance + iterations + risk
 8: function () {
  W(0, X, '{k:6. Governance (G + H)  &  the last bits}', { size: 66, w: 700 });
  R.line(X, L(0) + 14, X + 1000, L(0) + 12, { stroke: '#c22630', strokeWidth: 3.5 });
  W(1, X, '{hy:Architecture Board} → approves, enforces compliance,');
  W(2, X + 60, 'settles disputes');
  W(3, X, '{hy:Architecture Contract} → architects ⇄ implementers (Phase G)');
  W(5, X, '{uu:Compliance levels}', { size: 58, w: 700, ink: 'k' });
  var lv = ['Irrelevant', 'Consistent', 'Compliant', 'Conformant', 'Fully Conformant', 'Non-conformant'];
  lv.forEach(function (l, i) { var x = X + 10 + i * 210, y = L(9) - i * 36; if (i < 5) { R.line(x, y, x + 200, y, { stroke: '#1d2f86', strokeWidth: 3 }); R.line(x + 200, y, x + 200, y - 34, { stroke: '#1d2f86', strokeWidth: 3 }) } W(0, x + (i === 5 ? -40 : 0), i === 5 ? '{r:' + l + ' ✗}' : l, { y: y - 14, font: 'a', size: i === 4 ? 26 : 30 }) });
  W(10, X, '{uu:4 iteration cycles}', { size: 58, w: 700, ink: 'k' });
  W(11, X, '• Arch. {hb:Capability} → Prelim + A');
  W(12, X, '• Arch. {hb:Development} → B, C, D');
  W(13, X, '• {hb:Transition Planning} → E, F');
  W(14, X, '• Arch. {hb:Governance} → G, H');
  R.path('M 1090 ' + (L(11) - 30) + ' q 40 0 40 60 l 0 70 q 0 30 30 40 q -30 10 -30 40 l 0 70 q 0 60 -40 60', { stroke: '#c22630', strokeWidth: 3 }); W(0, 1180, '{r:iterate within}', { y: L(12) + 40, size: 44 }); W(0, 1180, '{r:+ across cycles}', { y: L(13) + 30, size: 44 });
  W(16, X, '{uu:Risk}', { size: 58, w: 700, ink: 'k' });
  W(17, X, '{hp:initial} risk (before mitigation) → {hp:residual} risk (after)');
  W(18, X, 'Business Transformation Readiness Assessment → Phase A');
  W(20, X, '{uu:Night before}', { size: 58, w: 700, ink: 'k' });
  var nb = [[1, 'flip through this notebook once'], [1, 'phase → output table (p.3) one last time'], [0, 'sleep > cramming!!']];
  nb.forEach(function (n, i) { R.cbox(X, L(21 + i) - 4, n[0]); W(0, X + 60, n[1], { y: L(21 + i) }) });
  W(25, X + 160, '{o:You\'ve got this.}', { size: 80, w: 700, ink: 'r', rot: -3 });
  R.star(X + 70, L(25) - 30, 30, { stroke: '#c22630', strokeWidth: 3 }); R.star(X + 820, L(25) - 50, 22, { stroke: '#c22630', strokeWidth: 3 });
  W(28, X + 700, '{p:TOGAF® is a registered trademark of The Open Group}', { size: 34 });
 }
};
