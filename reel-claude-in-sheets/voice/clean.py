# Remove unintentional sounds from the finished voice lines (creator feedback, 12 Oct: "some sound made by my voice
# before I utter Claude"). Runs after pick.py, in place on ../vo/lNN.wav, and logs every change to ../vo/clean_report.json.
#  - voiced segments = runs of 10 ms frames above (peak - 38 dB), merged across gaps < 70 ms
#  - a leading/trailing segment shorter than 0.35 s that is separated from the speech by >= 0.12 s is cut (pre-word
#    clicks, lip smacks, "uh"-like onsets); the line then starts 30 ms before the first real segment
#  - an inner segment isolated by >= 0.12 s gaps on both sides that is a click (< 80 ms) or breath-like (spectral
#    flatness > 0.25 and < 0.4 s) is faded down to the room floor
# Usage: python clean.py [ids...]   (default: every lNN.wav in ../vo)
import os, sys, glob, json, numpy as np, soundfile as sf, librosa
VO = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'vo')
HOP = .01

def segments(y, sr):
    hop = int(HOP * sr); db = 20 * np.log10(librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0] + 1e-9)
    on = db > db.max() - 38
    segs, i = [], 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]: j += 1
            segs.append([i * HOP, j * HOP]); i = j
        else: i += 1
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < .07: merged[-1][1] = s[1]
        else: merged.append(s)
    return merged

def flat(y, sr, a, b):
    seg = y[int(a * sr):int(b * sr)]
    return float(np.mean(librosa.feature.spectral_flatness(y=seg, n_fft=512, hop_length=128))) if len(seg) > 600 else 1.0

def fade_out_region(y, sr, a, b, gain=0.03, ramp=.015):
    g = np.ones(len(y)); ia, ib, r = int(a * sr), int(b * sr), int(ramp * sr)
    g[max(0, ia - r):ia] = np.linspace(1, gain, ia - max(0, ia - r)); g[ia:ib] = gain; g[ib:min(len(y), ib + r)] = np.linspace(gain, 1, min(len(y), ib + r) - ib)
    return y * g

def clean(path):
    y, sr = sf.read(path); mono = y if y.ndim == 1 else y.mean(1); log = []
    S = segments(mono, sr)
    if not S: return []
    while len(S) > 1 and S[0][1] - S[0][0] < .35 and S[1][0] - S[0][1] >= .12:
        log.append(['cut-lead', round(S[0][0], 2), round(S[0][1], 2)]); S.pop(0)
    while len(S) > 1 and S[-1][1] - S[-1][0] < .35 and S[-1][0] - S[-2][1] >= .12:
        log.append(['cut-tail', round(S[-1][0], 2), round(S[-1][1], 2)]); S.pop()
    for k in range(1, len(S) - 1):
        a, b = S[k]; d = b - a; gap = min(a - S[k - 1][1], S[k + 1][0] - b)
        if gap >= .12 and (d < .08 or (d < .4 and flat(mono, sr, a, b) > .25)):
            y = fade_out_region(y, sr, a - .01, b + .01); log.append(['soften', round(a, 2), round(b, 2)])
    a, b = max(0, S[0][0] - .03), min(len(mono) / sr, S[-1][1] + .12)
    y = y[int(a * sr):int(b * sr)]; n = int(.008 * sr)
    y[:n] *= np.linspace(0, 1, n)[:, None] if y.ndim > 1 else np.linspace(0, 1, n)
    y[-n:] *= np.linspace(1, 0, n)[:, None] if y.ndim > 1 else np.linspace(1, 0, n)
    sf.write(path, y, sr); log.append(['trim', round(a, 2), round(b, 2)]); return log

if __name__ == '__main__':
    ids = sys.argv[1:] or sorted(os.path.basename(f)[:-4] for f in glob.glob(os.path.join(VO, 'l[0-9][0-9].wav')))
    rp = os.path.join(VO, 'clean_report.json'); rep = json.load(open(rp)) if os.path.exists(rp) else {}
    for i in ids:
        rep[i] = clean(os.path.join(VO, i + '.wav')); print(i, rep[i])
    json.dump(rep, open(rp, 'w'), indent=1)
