#!/usr/bin/env python3
"""Add the natural pauses a cloned take lacks, without regenerating it and without changing a single word or its pitch.
For every breath-group take: align the script's punctuation to the take's Whisper words, and at each boundary whose measured gap is shorter than the
target (scripts/pause_rules.py) cut at the lowest-energy sample of the existing gap and insert band-limited room tone (matched to that take's own noise floor)
with 15 ms equal-power fades, so there is no digital silence and no click. Word times are shifted so timing.js / captions / SFX stay in sync.
Raw takes are kept in audio/takes_raw (+ qc3_raw.json); the pause-designed takes overwrite audio/takes and audio/qc3.json. Idempotent: always starts from the raw takes.
usage: python3 scripts/pause_inject.py reels/tech/<reel>   then  python3 <reel>/voice/build_voice.py  (assembles from the cached takes)  and  python3 <reel>/voice/make_timing.py"""
import sys, os, re, json, shutil, difflib, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import pause_rules as PR
R = os.path.abspath(sys.argv[1]); A = R + '/audio'; TK = A + '/takes'; RAW = A + '/takes_raw'; SR = 24000
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','आ':'अ'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!:;\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
if not os.path.exists(RAW):
    shutil.copytree(TK, RAW); shutil.copy(A + '/qc3.json', A + '/qc3_raw.json')
qc = json.load(open(A + '/qc3_raw.json')); SL = json.load(open(R + '/script.json')); S = SL['sentences']; OV = SL.get('pause_after', {})
groups = {}
for s in S: groups.setdefault(s['g'], []).append(s)
rng_seed = 0; report = []; NEWQ = json.loads(json.dumps(qc))
def noise_like(n, floor, seed):
    rng = np.random.default_rng(seed); x = rng.standard_normal(n).astype('float32'); sos = butter(2, [120 / (SR / 2), 3500 / (SR / 2)], btype='band', output='sos'); x = sosfilt(sos, x).astype('float32')
    return x / (np.sqrt((x ** 2).mean()) + 1e-9) * floor
for gid, ids in groups.items():
    if gid not in qc: continue
    a, _ = sf.read(f'{RAW}/{gid}.wav'); a = a.astype('float32'); W = [[w[0], w[1], w[2]] for w in qc[gid]['words']]
    if not W: continue
    # script tokens with the sentence they belong to
    toks = []; 
    for si, s in enumerate(ids):
        for t in s['B'].split(): toks.append((t, si))
    sk_s = [skel(t[0]) for t in toks]; sk_w = [skel(w[0]) for w in W]; sm = difflib.SequenceMatcher(None, sk_s, sk_w, autojunk=False); mapw = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): mapw[blk.b + k] = blk.a + k
    # boundary list: (word index j, kind, target seconds)
    bnd = []
    for j in range(len(W) - 1):
        kind = None; stext = ''; ov = None
        if j in mapw:
            t, si = toks[mapw[j]]; kind = PR.mark_kind(t); stext = ids[si]['B']
            last_tok_of_sentence = (mapw[j] + 1 >= len(toks)) or (toks[mapw[j] + 1][1] != si)
            if last_tok_of_sentence and ids[si]['id'] in OV: ov = OV[ids[si]['id']]
        else:
            kind = PR.mark_kind(W[j][0])
        if kind: bnd.append((j, kind, PR.target(kind, stext, ov)))
    # shift bookkeeping: process from the end so earlier indices stay valid
    out = a.copy(); shifts = []   # (cut_time_in_raw, added)
    fr = int(.01 * SR); env = np.sqrt(np.convolve(a ** 2, np.ones(fr) / fr, 'same')); floor = float(np.percentile(env[env > 0], 5)) if (env > 0).any() else 1e-4; floor = max(floor, 8e-5)
    for j, kind, tgt in sorted(bnd, key=lambda b: -b[0]):
        w0, w1 = W[j], W[j + 1]; gap = max(0.0, w1[1] - w0[2]); tgt = PR.jitter(hash((gid, j)) & 0xffff, tgt); add = tgt - gap
        if add < .06: report.append((gid, j, kind, round(gap, 2), 0, 'ok')); continue
        lo = int(max(0, (w0[2] - .09)) * SR); hi = int(min(len(a), (w1[1] + .05) * SR)); hi = max(hi, lo + int(.06 * SR))
        seg = env[lo:hi]; cut = lo + int(np.argmin(seg)); 
        if env[cut] > 60 * floor: report.append((gid, j, kind, round(gap, 2), 0, 'skip(no valley)')); continue
        n = int(add * SR); N = noise_like(n, floor * .9, hash((gid, j)) & 0xffff); f = int(.02 * SR)
        N[:f] *= np.sin(np.linspace(0, np.pi / 2, f)) ** 2; N[-f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
        A1 = out[:cut + int(round(0))].copy(); B1 = out[cut:].copy(); 
        # in `out` earlier cuts (later in time) were already applied; cut is in raw coordinates and later regions are untouched before this point
        A1[-f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 1; B1[:f] *= np.sin(np.linspace(0, np.pi / 2, f)) ** 1
        out = np.concatenate([A1, N, B1]); shifts.append((cut / SR, add)); report.append((gid, j, kind, round(gap, 2), round(add, 2), 'inserted'))
    # shift word times: every word whose start >= cut moves by the sum of insertions at cuts before it
    shifts.sort(); NW = []
    for w in W:
        d = sum(add for ct, add in shifts if w[1] >= ct - 1e-6); d_end = sum(add for ct, add in shifts if w[2] > ct + 1e-6 and w[1] >= ct - 1e-6 or (w[1] >= ct - 1e-6))
        NW.append([w[0], round(w[1] + d, 3), round(w[2] + d_end, 3)])
    sf.write(f'{TK}/{gid}.wav', out, SR); NEWQ[gid]['words'] = NW; NEWQ[gid]['dur'] = round(len(out) / SR, 2)
json.dump(NEWQ, open(A + '/qc3.json', 'w'), ensure_ascii=False, indent=1)
ins = [r for r in report if r[5] == 'inserted']; tot = sum(r[4] for r in ins)
print(f'{len(ins)} pauses inserted, {tot:.1f} s of silence added; skipped {sum(1 for r in report if r[5].startswith("skip"))} (no valley)')
from collections import Counter; print('by mark:', dict(Counter(r[2] for r in ins)))
json.dump(report, open(A + '/pause_report.json', 'w'))
