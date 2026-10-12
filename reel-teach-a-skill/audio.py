# Score + SFX + mix/master for "Teach your AI once." -> audio/final.wav and audio/mix-report.json
# Score: a synthesized library-lofi groove that brightens per step (upright bass + brushes -> Rhodes -> typewriter-key hats ->
#        celesta), a lighter hook cue, a low drone for the catch and a warm resolve for the recap + CTA. Beat-locked: the bar
#        restarts at every cut with a soft downbeat accent. SFX: one per on-screen event (events.json, dumped from the page),
#        aligned by MEASURED PEAK. Mix: voice cleaned (HPF, gentle comp) at -16 LUFS; music EQ-carved in the voice presence band
#        (1.5-4 kHz) and ducked by a voice-activity envelope; SFX ducked under speech; master = limiter + 2-pass loudnorm to
#        -14 LUFS / -1 dBTP. The report measures voice-over-(music+SFX) dB on every spoken word.
import json, re, subprocess, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR = 48000
ev = json.load(open('events.json')); SC = ev['SC']; TOTAL = ev['total']
tim = open('site/timing.js').read(); WD = json.loads(re.search(r'WD=(\[.*?\]);', tim).group(1))
def wt(k, n=0):
    c = 0
    for w in WD:
        if w['k'] == k:
            if c == n: return w['s']
            c += 1
N = int((TOTAL + 0.3) * SR); rng = np.random.default_rng(7)
def bq(kind, f, order=2):
    return butter(order, f if np.isscalar(f) else [x for x in f], kind, fs=SR, output='sos')
def lp(x, f): return sosfilt(bq('low', min(f, SR / 2 - 100)), x)
def hp(x, f): return sosfilt(bq('high', f), x)
def bp(x, a, b): return sosfilt(bq('band', (a, b)), x)
def tt(d): return np.arange(int(d * SR)) / SR
fr = lambda m: 440 * 2 ** ((m - 69) / 12)
def put(buf, x, t, g=1.0, peak_align=False):
    if peak_align: t -= np.argmax(np.abs(x)) / SR
    i = int(round(t * SR))
    if i < 0: x = x[-i:]; i = 0
    if i >= len(buf) or len(x) == 0: return
    x = x[: len(buf) - i]; buf[i:i + len(x)] += x * g
def env(n, a=.005, d=.2, s=.4, r=.1):
    e = np.ones(n); na, nd, nr = max(1, int(a * SR)), int(d * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na); nd2 = max(0, min(nd, n - na)); e[na:na + nd2] = np.linspace(1, s, nd2) if nd2 else e[na:na + nd2]; e[na + nd2:] = s
    if 0 < nr < n: e[-nr:] *= np.linspace(1, 0, nr)
    return e
# ---------- instruments ----------
def pluck(m, d=.5, g=.2, bright=1.0):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .45 * bright * np.sin(4 * np.pi * f * x) * np.exp(-x * 10) + .2 * bright * np.sin(6 * np.pi * f * x) * np.exp(-x * 18)
    return y * np.exp(-x * 7) * g
def pizz(m, d=.35, g=.25):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .5 * np.sin(4 * np.pi * f * x) * np.exp(-x * 25); return lp(y * np.exp(-x * 14), 2400) * g
def marimba(m, d=.45, g=.22):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 30); return y * np.exp(-x * 9) * g
def bell(m, d=1.6, g=.1):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * 2.76 * f * x) * np.exp(-x * 3) + .25 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 6); return y * np.exp(-x * 2.4) * g
def pad(ms, d, g=.05, cut=1800, a=.6):
    x = tt(d); y = np.zeros(len(x))
    for m in ms: f = fr(m); y += np.sin(2 * np.pi * f * x + .3 * np.sin(2 * np.pi * .3 * x)) + .5 * np.sin(2 * np.pi * f * 1.003 * x) + .3 * (2 * ((f * 2 * x) % 1) - 1)
    return lp(y * env(len(x), a=a, d=.4, s=.8, r=min(.8, d * .4)), cut) * g
def bass(m, d=.3, g=.3):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .25 * np.sin(4 * np.pi * f * x); return lp(y * env(len(x), a=.004, d=.12, s=.6, r=.06), 900) * g
def kick(g=.5): x = tt(.32); return np.sin(2 * np.pi * (44 + 95 * np.exp(-x * 30)) * x) * np.exp(-x * 10) * g
def snare(g=.2): x = tt(.22); return (hp(rng.standard_normal(len(x)), 1800) * .8 + np.sin(2 * np.pi * 190 * x) * .35) * np.exp(-x * 18) * g
def brush(g=.08): x = tt(.25); return bp(rng.standard_normal(len(x)), 2000, 9000) * np.exp(-x * 9) * g
def hat(g=.06, d=.05): x = tt(d); return hp(rng.standard_normal(len(x)), 7000) * np.exp(-x * 80) * g
def shaker(g=.05): x = tt(.09); return bp(rng.standard_normal(len(x)), 4000, 11000) * np.sin(np.linspace(0, np.pi, len(x))) ** 2 * g
def clap(g=.18): x = tt(.2); return hp(rng.standard_normal(len(x)), 1200) * (np.exp(-x * 26) + .5 * np.exp(-((x - .015) ** 2) * 8e4)) * g
def keyclick(g=.08): x = tt(.03); return hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 260) * g
def crash(g=.07): x = tt(1.6); return hp(rng.standard_normal(len(x)), 5000) * np.exp(-x * 2.6) * g
# ---------- cues: library lofi (brushed kit, upright bass, Rhodes chords, typewriter keys as percussion) ----------
# L1..L4: the same 84 bpm groove in D major that brightens per step (1 bass + brushes, 2 + Rhodes, 3 + typewriter hats, 4 + celesta
# melody). H: hook, a lighter cue with paste ticks. X: the catch, a low drone + one bell. E: a warm resolve under the recap + CTA.
CUES = {0: 'H', 1: 'L1', 2: 'L1', 3: 'L2', 4: 'L2', 5: 'L3', 6: 'L3', 7: 'L4', 8: 'X', 9: 'E'}
BPM = {'H': 92, 'L1': 84, 'L2': 84, 'L3': 84, 'L4': 84, 'X': 60, 'E': 84}
def rhodes(ms, d, g=.05):
    x = tt(d); y = np.zeros(len(x))
    for m in ms: f = fr(m); y += (np.sin(2 * np.pi * f * x + .8 * np.sin(2 * np.pi * f * x) * np.exp(-x * 6)) + .15 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 4))
    return lp(y * env(len(x), a=.006, d=.6, s=.35, r=min(.5, d * .4)) * (1 + .1 * np.sin(2 * np.pi * 4.5 * x)), 3200) * g
def upright(m, d=.5, g=.3):
    x = tt(d); f = fr(m); y = np.sin(2 * np.pi * f * x) + .35 * np.sin(4 * np.pi * f * x) * np.exp(-x * 9) + .1 * np.sin(6 * np.pi * f * x) * np.exp(-x * 14)
    return lp(y * env(len(x), a=.01, d=.25, s=.45, r=.12), 1100) * g
def tkey(g=.05): x = tt(.05); return (hp(rng.standard_normal(len(x)), 2200) * np.exp(-x * 140) * .7 + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 120) * .3) * g
def celesta(m, d=.7, g=.05): x = tt(d); f = fr(m); return (np.sin(2 * np.pi * f * x) + .3 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x * 8)) * np.exp(-x * 4.5) * g
PROG = [[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 49, 52, 55]]   # Dmaj7, Bm7, Gmaj7, A7 (voicings, MIDI)
def cueseg(buf, cue, t0, t1, si):
    b = 60 / BPM[cue]; n8 = int((t1 - t0) / (b / 2)) + 1
    if cue == 'H':
        for k in range(n8):
            t = t0 + k * b / 2; ch = PROG[(k // 8) % 4]
            if k % 8 == 0: put(buf, rhodes([m + 12 for m in ch[1:]], b * 3.6, .035), t)
            if k % 4 == 0: put(buf, upright(ch[0] - 12, b * .9, .22), t)
            if k % 2 == 1: put(buf, tkey(.035), t)
            if k % 4 == 2: put(buf, brush(.07), t)
    elif cue[0] == 'L':
        lvl = int(cue[1]); mel = [74, 78, 81, 78, 76, 73, 74, 69]
        for k in range(n8):
            t = t0 + k * b / 2; ch = PROG[(k // 8) % 4]; sw = (b / 2) * .16 if k % 2 else 0   # swing
            if k % 2 == 0: put(buf, upright(ch[0] - 12 + (7 if k % 8 == 6 else 0), b * .9, .26), t)
            if k % 4 == 2: put(buf, brush(.09), t + sw); put(buf, snare(.05), t + sw)
            if k % 8 == 0: put(buf, kick(.22), t)
            if lvl >= 2 and k % 8 == 0: put(buf, rhodes(ch[1:] + [ch[0] + 12], b * 3.8, .04), t)
            if lvl >= 3: put(buf, tkey(.04 if k % 2 else .028), t + sw)
            if lvl >= 4 and k % 2 == 0: put(buf, celesta(mel[(k // 2) % 8], .6, .035), t)
    elif cue == 'X':
        x = tt(t1 - t0 + .4); y = (np.sin(2 * np.pi * fr(38) * x) + .4 * np.sin(2 * np.pi * fr(45) * x) + .2 * np.sin(2 * np.pi * fr(50) * x * 1.002)) * np.minimum(1, x / .4)
        put(buf, lp(y, 600) * .2, t0); put(buf, bell(74, 2.5, .035), t0 + .1)
        for k in range(int((t1 - t0) / b)): put(buf, brush(.04), t0 + k * b)
    elif cue == 'E':
        mel = [78, 81, 85, 81, 83, 81, 78, 76]
        for k in range(n8):
            t = t0 + k * b / 2; ch = PROG[(k // 8) % 4]
            if t > TOTAL - 1.8: break
            if k % 2 == 0: put(buf, celesta(mel[(k // 2) % 8], .6, .045), t)
            if k % 8 == 0: put(buf, rhodes(ch[1:] + [ch[0] + 12], b * 3.8, .045), t)
            if k % 4 == 0: put(buf, upright(ch[0] - 12, b * .9, .24), t)
            if k % 4 == 2: put(buf, brush(.08), t)
    if si > 0: put(buf, brush(.06), t0); put(buf, kick(.12), t0)   # soft downbeat on every cut
music = np.zeros(N)
for si in range(len(SC)):
    t0 = SC[si]; t1 = SC[si + 1] if si + 1 < len(SC) else TOTAL
    seg = np.zeros(N); cueseg(seg, CUES[si], t0, t1, si)
    w = np.zeros(N); a0, a1 = int(t0 * SR), int(min(TOTAL + .3, t1 + .35) * SR)
    w[a0:a1] = 1; fo = int(.35 * SR)
    if si + 1 < len(SC): w[a1 - fo:a1] = np.linspace(1, 0, fo)
    music += seg * w
# final chord on the tonic under the CTA hold
put(music, rhodes([50, 54, 57, 61, 66], 2.8, .06), TOTAL - 2.9); put(music, bell(86, 2.4, .04), TOTAL - 2.9); put(music, upright(38, 2.4, .26), TOTAL - 2.9)
music *= np.minimum(1, np.arange(N) / (.04 * SR)); music *= np.minimum(1, (N - np.arange(N)) / (1.0 * SR))
# ---------- SFX (peak-aligned) ----------
sfx = np.zeros(N); acc = np.zeros(N)   # acc = accents that are NOT ducked under the voice
def S(x, t, g=1.0, accent=False): put(acc if accent else sfx, x, t, g, peak_align=True)
def clackfx(): x = tt(.09); return (hp(rng.standard_normal(len(x)), 1500) * np.exp(-x * 90) * .6 + np.sin(2 * np.pi * 1350 * x) * np.exp(-x * 70) * .5 + np.sin(2 * np.pi * 420 * x) * np.exp(-x * 45) * .4)
def thunkfx(): x = tt(.35); return np.sin(2 * np.pi * (70 + 60 * np.exp(-x * 25)) * x) * np.exp(-x * 12) + lp(rng.standard_normal(len(x)), 900) * np.exp(-x * 30) * .4
def tickfx(): x = tt(.05); return np.sin(2 * np.pi * 2900 * x) * np.exp(-x * 150)
def popfx(): x = tt(.12); return np.sin(2 * np.pi * (520 + 900 * x * 8) * x) * np.exp(-x * 40)
def stampfx(): x = tt(.5); return np.sin(2 * np.pi * (52 + 90 * np.exp(-x * 28)) * x) * np.exp(-x * 9) + hp(rng.standard_normal(len(x)), 1200) * np.exp(-x * 45) * .55
def dingfx(): return bell(91, 1.0, 1.0)
def buzzfx(): x = tt(.35); return lp(2 * ((110 * x) % 1) - 1, 2500) * np.exp(-x * 6)
def hopfx(): x = tt(.05); return lp(rng.standard_normal(len(x)), 1400) * np.exp(-x * 70)
def typefx(): x = tt(.035); return hp(rng.standard_normal(len(x)), 2500) * np.exp(-x * 200)
def whoosh(d=.36):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n)
    for k in range(8):
        a, b3 = int(k * n / 8), int((k + 1) * n / 8); f = 600 + 4000 * (k / 7) ** 1.4
        out[a:b3] = sosfilt(bq('band', (f * .6, min(f * 1.4, SR / 2 - 100))), x[a:b3])
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2
def jackfx(): x = tt(.12); return np.sin(2 * np.pi * 1900 * x) * np.exp(-x * 120) * .7 + lp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 160) * .6 + np.sin(2 * np.pi * 180 * x) * np.exp(-x * 40) * .5
def sparkfx(): x = tt(.25); return hp(rng.standard_normal(len(x)), 4000) * np.exp(-x * 22) * (.6 + .4 * np.sin(2 * np.pi * 60 * x))
def lockfx(): j = jackfx(); return j * .8 + np.pad(tickfx(), (int(.04 * SR), len(j)))[:len(j)]
def flipfx(): x = tt(.18); return bp(rng.standard_normal(len(x)), 1500, 6000) * np.sin(np.linspace(0, np.pi, len(x))) ** 3
def lidfx(): x = tt(.3); return lp(rng.standard_normal(len(x)), 500) * np.exp(-x * 25) + np.sin(2 * np.pi * 95 * x) * np.exp(-x * 20) * .6
def drawerfx(d=.55):   # wooden drawer on runners: filtered noise rumble + a soft end knock
    x = tt(d); y = bp(rng.standard_normal(len(x)), 180, 1400) * (np.sin(np.linspace(0, np.pi, len(x))) ** 1.5) * (.7 + .3 * np.sin(2 * np.pi * 23 * x))
    k = thunkfx() * .35; out = np.zeros(len(x) + len(k)); out[:len(x)] += y; o = len(x) - int(.05 * SR); out[o:o + len(k)] += k; return out
def cardfx(): x = tt(.12); return bp(rng.standard_normal(len(x)), 1200, 7000) * np.exp(-x * 35) * .8
def bellfx(): return bell(96, .9, 1.0)
def pourfx(): x = tt(1.2); return bp(rng.standard_normal(len(x)), 2500, 8000) * (.4 + .6 * (np.sin(2 * np.pi * 9 * x) > .7)) * np.sin(np.linspace(0, np.pi, len(x))) * .5
def clipfx(): x = tt(.08); return np.sin(2 * np.pi * 2400 * x) * np.exp(-x * 90) * .6 + hp(rng.standard_normal(len(x)), 3000) * np.exp(-x * 150) * .5
def togglefx(): return np.concatenate([tickfx(), np.zeros(int(.04 * SR)), tickfx() * .7])
def stepfx(): x = tt(.12); return lp(rng.standard_normal(len(x)), 700) * np.exp(-x * 40) + np.sin(2 * np.pi * 300 * x) * np.exp(-x * 50) * .4
for e in ev['sfx']:
    k, t, g = e['k'], e['t'], e.get('g', 1)
    if k == 'flick': S(cardfx(), t, .2)
    elif k == 'paste': S(clackfx(), t, .22); S(popfx(), t + .03, .1)
    elif k == 'clink': S(bell(88, .6, 1.0), t, .08)
    elif k == 'drawer': put(sfx, drawerfx(.8), t, .24 * g)   # starts with the slide, knock lands at the end (not peak-aligned)
    elif k == 'lower': S(cardfx(), t, .14)
    elif k == 'lift': S(cardfx(), t, .16)
    elif k == 'tick': S(tickfx(), t, .13 * g)
    elif k == 'card': S(cardfx(), t, .16 * g)
    elif k == 'stamp': S(stampfx(), t, .22 * g, True)
    elif k == 'type': S(tkey(1.0), t, .16 * g)
    elif k == 'clip': S(clipfx(), t, .2)
    elif k == 'send': S(popfx(), t, .16)
    elif k == 'bell': S(bellfx(), t, .1)
    elif k == 'hl': S(bp(rng.standard_normal(int(.25 * SR)), 2000, 6000) * np.hanning(int(.25 * SR)), t, .08)
    elif k == 'thunk': S(thunkfx(), t, .2)
    elif k == 'toggle': S(togglefx(), t, .12)
    elif k == 'step': S(stepfx(), t, .2 * g)
    elif k == 'ding': S(dingfx(), t, .06)
    elif k == 'pour': put(sfx, pourfx(), t, .12)
    elif k == 'pop': S(popfx(), t, .16)
    elif k == 'thud': S(thunkfx(), t, .3, True); S(cardfx(), t, .12)
    elif k == 'chime': [S(bell(m, 1.0, 1.0), t + i * .09, .07) for i, m in enumerate([78, 81, 86])]
# ---------- voice ----------
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voice.wav', '-af', 'highpass=f=80,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-16:TP=-2:LRA=7', '-ar', str(SR), '-ac', '1', 'audio/voice_proc.wav'])
_, v = wavfile.read('audio/voice_proc.wav'); v = v.astype('float64') / 32768.0
vo = np.zeros(N); vo[:min(N, len(v))] = v[:N]
# voice-activity envelope from word times (plus 80 ms pad) and smoothed (attack 40 ms, release 300 ms)
act = np.zeros(N)
for w in WD: act[int(max(0, w['s'] - .08) * SR):int(min(N, (w['e'] + .08) * SR))] = 1
def smooth(x, att, rel):
    y = np.zeros_like(x); a1, r1 = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR)); s = 0.0
    xs = x[::48]; ys = np.zeros_like(xs)        # 1 kHz control rate
    a1, r1 = np.exp(-1 / (att * 1000)), np.exp(-1 / (rel * 1000))
    for i, xi in enumerate(xs): c = a1 if xi > s else r1; s = c * s + (1 - c) * xi; ys[i] = s
    return np.repeat(ys, 48)[:len(x)]
duck = smooth(act, .04, .30)
def db(x): return 20 * np.log10(np.maximum(x, 1e-9))
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-20)
# carve the voice presence band out of the music, then set levels relative to the voice
music_c = music - .5 * bp(music, 1500, 4000)
vr = rms(vo[act > 0]); TARGET_GAP = -11.0; DUCK = -9.0   # music sits 11 dB under the voice in gaps, 19 dB under while speaking
mg = 10 ** (TARGET_GAP / 20) * vr / max(rms(music_c), 1e-9)
music_m = music_c * mg * 10 ** (DUCK * duck / 20)
sfx_c = sfx - .6 * bp(sfx, 1500, 4000); acc_c = acc - .45 * bp(acc, 1500, 4000)
sfx_m = sfx_c * 10 ** (-6 * duck / 20) * (vr / .2) + acc_c * 10 ** (-6 * duck / 20) * (vr / .2)
mix = vo + music_m + sfx_m
# ---------- measure (before master; master is a uniform gain + limiter, so ratios hold) ----------
seps = []
for w in WD:
    a, b4 = int(w['s'] * SR), int(w['e'] * SR)
    if b4 - a < int(.08 * SR): continue
    seps.append(db(rms(vo[a:b4])) - db(rms(music_m[a:b4] + sfx_m[a:b4])))
seps = np.array(seps)
wavfile.write('audio/premaster.wav', SR, (np.clip(mix / max(1, np.abs(mix).max() / .9), -1, 1) * 32767).astype('int16'))
wavfile.write('audio/music_stem.wav', SR, (np.clip(music_m / max(1e-9, np.abs(mix).max() / .9), -1, 1) * 32767).astype('int16'))
# ---------- master: limiter + two-pass loudnorm to -14 LUFS / -1 dBTP ----------
m1 = subprocess.run(['ffmpeg', '-hide_banner', '-i', 'audio/premaster.wav', '-af', 'acompressor=threshold=-20dB:ratio=2:attack=10:release=150:makeup=1,alimiter=limit=0.7:attack=5:release=60,loudnorm=I=-14:TP=-1:LRA=9:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
J = json.loads(m1[m1.rindex('{'):m1.rindex('}') + 1])
af = ('acompressor=threshold=-20dB:ratio=2:attack=10:release=150:makeup=1,alimiter=limit=0.7:attack=5:release=60,loudnorm=I=-14:TP=-1:LRA=9:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (J['input_i'], J['input_tp'], J['input_lra'], J['input_thresh'], J['target_offset']))
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/premaster.wav', '-af', af, '-ar', '48000', '-ac', '1', 'audio/final_ln.wav'])
I0 = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-i', 'audio/final_ln.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr)[-1])
# linear loudnorm stops short when the true-peak ceiling binds: make up the rest with gain into an oversampled peak limiter
subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/final_ln.wav', '-af', 'aresample=192000,volume=%.2fdB,alimiter=limit=0.84:attack=2:release=50:level=false,aresample=48000' % (-14.0 - I0), '-ac', '1', 'audio/final.wav'])
def ebur(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]); TP = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', o)[-1]); return I, TP
I, TP = ebur('audio/final.wav'); Im, _ = ebur('audio/music_stem.wav')
rep = {'integrated_LUFS': I, 'true_peak_dBTP': TP, 'voice_over_music+sfx_dB_per_word': {'median': round(float(np.median(seps)), 1), 'p10': round(float(np.percentile(seps, 10)), 1), 'min': round(float(seps.min()), 1), 'words': int(len(seps))},
       'music_gap_level_vs_voice_dB': TARGET_GAP, 'music_duck_during_speech_dB': DUCK, 'music_eq': '-6 dB band carve 1.5-4 kHz', 'sfx': 'peak-aligned, -8 dB carve 1.5-4 kHz, ducked 6 dB (accents 6 dB) under speech', 'cue_per_scene': [CUES[i] for i in range(len(SC))], 'bpm': BPM, 'scene_cuts_on_downbeat': True}
json.dump(rep, open('audio/mix-report.json', 'w'), indent=1); print(json.dumps(rep, indent=1))
if __import__('os').environ.get('DIAG'):
    for w in WD:
        a, b4 = int(w['s'] * SR), int(w['e'] * SR)
        if b4 - a < int(.08 * SR): continue
        dv = db(rms(vo[a:b4])); dm = dv - db(rms(music_m[a:b4])); ds = dv - db(rms(sfx_m[a:b4]))
        if min(dm, ds) < 15: print('%-14s %6.2f  vs music %5.1f  vs sfx %5.1f  voice %5.1f' % (w['w'], w['s'], dm, ds, dv))
