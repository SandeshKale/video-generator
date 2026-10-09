#!/usr/bin/env python3
"""Hindi male voice-over (Kokoro hm_*), sentence/clause-level takes with per-clause speed, word timings from
Kokoro's own phoneme durations (pred_dur / sum * audio length) -> audio/voice.wav + timing.json.
Script tokens are 'spoken=shown'; hyphenated spoken tokens are split for the TTS and merged back for display.
usage: python tts.py [--voice hm_omega] [--base 1.05]"""
import argparse, hashlib, json, os, pickle, re, numpy as np, soundfile as sf
from kokoro import KPipeline
ap = argparse.ArgumentParser(); ap.add_argument('--voice', default='hm_omega'); ap.add_argument('--base', type=float, default=1.05)
a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000
GAP_SCENE, TAIL = 0.22, 3.4
script = json.load(open(os.path.join(HERE, 'script.json')))
pipe = KPipeline(lang_code='h'); vocab = pipe.model.vocab
os.makedirs(os.path.join(HERE, 'audio', 'cache'), exist_ok=True)
END = re.compile(r'[.?!।]$')
def clauses(text):
    """-> list of (clause_text, pause_after, is_question). Split at sentence ends and commas."""
    out = []; si = 0
    for sent in re.findall(r'[^.?!।]+[.?!।]?', text.strip()):
        sent = sent.strip()
        if not sent: continue
        q = sent.endswith('?')
        parts = [p.strip() for p in re.split(r'(?<=,)\s+', sent) if p.strip()]
        for i, p in enumerate(parts):
            last = i == len(parts) - 1
            out.append((p, (0.30 if q else 0.24) if last else 0.11, q, si))
        si += 1
    return out
def spd(words, q):
    n = len(words); sp = a.base
    if n <= 2: sp *= 0.94
    elif n >= 9: sp *= 1.03
    if q: sp *= 0.97
    return round(sp, 3)
def synth(spoken, speed):
    """spoken: list of tts words (no punctuation needed). -> (audio, [(s,e) per word])"""
    text = ' '.join(spoken)
    key = hashlib.sha1(f'h1|{a.voice}|{speed}|{text}'.encode()).hexdigest()[:16]
    path = os.path.join(HERE, 'audio', 'cache', key + '.pkl')
    if os.path.exists(path): return pickle.load(open(path, 'rb'))
    chunks, spans, off = [], [], 0.0
    for r in pipe(text, voice=a.voice, speed=speed):
        au = np.asarray(r.audio, dtype='float32'); dur = r.output.pred_dur.numpy().astype(float); L = len(au) / SR
        ps = r.phonemes; ids = [c for c in ps if c in vocab]
        # per-char durations: dur[0] = BOS, dur[1..n] = chars (in vocab), dur[n+1] = EOS
        cd = dur[1:1 + len(ids)]; scale = L / dur.sum(); k = 0; t = dur[0] * scale; cur = []; ws = []
        for c in ps:
            if c == ' ':
                if cur: ws.append((cur[0], cur[1])); cur = []
                continue
            if c not in vocab: continue
            d = cd[k] * scale; k += 1
            if not cur: cur = [t, t + d]
            else: cur[1] = t + d
            t += d
        if cur: ws.append((cur[0], cur[1]))
        spans += [(off + s, off + e) for s, e in ws]; chunks.append(au); off += L
    au = np.concatenate(chunks)
    thr = max(.012, .03 * float(np.abs(au).max())); idx = np.where(np.abs(au) > thr)[0]
    if len(idx):
        i0 = max(0, int(idx[0]) - int(.025 * SR)); i1 = min(len(au), int(idx[-1]) + int(.05 * SR)); au = au[i0:i1]; sh = i0 / SR
        spans = [(max(0, s - sh), max(0, e - sh)) for s, e in spans]
    f = int(.012 * SR); au[:f] *= np.linspace(0, 1, f); au[-f:] *= np.linspace(1, 0, f)
    if len(spans) != len(spoken):   # fall back: spread proportionally to word length
        tot = sum(len(w) for w in spoken); t = 0.0; L = len(au) / SR; spans = []
        for w in spoken: d = L * len(w) / tot; spans.append((t, t + d)); t += d
        print('  ! timing fallback for:', text[:40], flush=True)
    res = (au, spans); pickle.dump(res, open(path, 'wb')); return res
def parse(token):
    """'spoken=shown' -> (spoken parts [..], shown). Hyphenated spoken -> several tts words, one shown word."""
    sp, _, sh = token.partition('=')
    parts = [p for p in re.split(r'-', sp.strip('.?!।,')) if p]
    shown = (sh if '=' in token else sp)
    return parts, shown
buf = []; cur = 0.0; scenes = []
for si, sc in enumerate(script['scenes']):
    s0 = cur; beats = []
    for bi, text in enumerate(sc['beats']):
        b0 = cur; allw = []; sspan = {}
        for ci, (cl, pause, q, sidx) in enumerate(clauses(text)):
            toks = cl.split(); parsed = [parse(t) for t in toks]
            spoken = [p for ps, _ in parsed for p in ps]
            au, spans = synth(spoken, spd(spoken, q)); d = len(au) / SR; k = 0
            for (ps, shown), tok in zip(parsed, toks):
                s = spans[k][0]; e = spans[k + len(ps) - 1][1]; k += len(ps)
                allw.append({'w': shown, 's': round(cur + s, 3), 'e': round(cur + e, 3), 'end': bool(re.search(r'[.?!।]$', tok))})
            sspan.setdefault(sidx, [cur, cur]); buf.append(au); cur += d; sspan[sidx][1] = cur
            buf.append(np.zeros(int(pause * SR), dtype='float32')); cur += pause
        en = sc.get('en', [[]])[bi]; assert len(en) == len(sspan), (sc['id'], bi, len(en), len(sspan))
        sents = []
        for k in sorted(sspan):
            q0, q1 = sspan[k]; ws = en[k].split(); wt = [max(2, len(w)) for w in ws]; tot = float(sum(wt)); t = q0; sw = []
            for w, x in zip(ws, wt): d = (q1 - q0) * x / tot; sw.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3)}); t += d
            sents.append({"en": en[k], "s": round(q0, 3), "e": round(q1, 3), "words": sw})
        beats.append({'i': bi, 'text': text, 'start': round(b0, 3), 'end': round(cur, 3), 'words': allw, 'sents': sents})
        if si == len(script['scenes']) - 1 and bi == len(sc['beats']) - 1:
            buf.append(np.zeros(int(TAIL * SR), dtype='float32')); cur += TAIL
    scenes.append({'id': sc['id'], 'start': round(s0, 3), 'end': round(cur, 3), 'beats': beats}); print(sc['id'], round(cur, 1), flush=True)
sf.write(os.path.join(HERE, 'audio', 'voice.wav'), np.concatenate(buf), SR)
json.dump({'voice': a.voice, 'base': a.base, 'total': round(cur, 3), 'scenes': scenes}, open(os.path.join(HERE, 'timing.json'), 'w'), ensure_ascii=False, indent=1)
print('TOTAL', round(cur, 1), 's'); print('DONE')
