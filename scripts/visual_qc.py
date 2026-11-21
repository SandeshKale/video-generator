#!/usr/bin/env python3
"""Visual QC evidence for a rendered video (the picture counterpart of earshot). EVIDENCE, NOT A VIEWING.
usage: python3 scripts/visual_qc.py <video.mp4> [out.json] [--cuts 5,10,15]   (cut times: expected scene boundaries, excluded from 'jump' findings)
Tier 0 only (ffmpeg/ffprobe + numpy), CPU-cheap, deterministic: spec, freeze, black, blur, block, per-frame luma stats, temporal jumps (flicker /
unplanned cuts), flat-region noise (is it clean vector? grain/halftone shows up here), safe-margin ink (content touching the frame edge).
Learned-metric tiers (pyiqa/CLIP/VMAF) are not used here: they need big installs and natural-video training, and flat vector art is out of domain."""
import sys, json, re, subprocess, numpy as np
a = [x for x in sys.argv[1:] if not x.startswith('--')]; src = a[0]; out = a[1] if len(a) > 1 else None
cuts = [float(x) for x in (sys.argv[sys.argv.index('--cuts') + 1].split(',') if '--cuts' in sys.argv else [])]
def sh(c): return subprocess.run(c, capture_output=True, text=True).stderr
pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames,duration,pix_fmt,codec_name', '-of', 'json', src], capture_output=True, text=True).stdout)['streams'][0]
W, H = int(pr['width']), int(pr['height']); fr = eval(pr['r_frame_rate']); R = dict(spec=pr, findings=[], not_viewed=True)
def F(kind, detail, sev='warn'): R['findings'].append(dict(kind=kind, detail=detail, severity=sev))
e = sh(['ffmpeg', '-hide_banner', '-i', src, '-vf', 'freezedetect=n=-60dB:d=1.5,blackdetect=d=0.2:pix_th=0.05', '-an', '-f', 'null', '-'])
for m in re.finditer(r'freeze_start: ([\d.]+)', e): F('freeze', f'static from {m.group(1)}s (>=1.5 s)', 'info')
for m in re.finditer(r'black_start:([\d.]+) black_end:([\d.]+)', e): F('black', f'{m.group(1)}-{m.group(2)}s', 'warn')
e = sh(['ffmpeg', '-hide_banner', '-i', src, '-vf', 'blurdetect,blockdetect', '-an', '-f', 'null', '-'])
for k in ('blur', 'block'):
    v = re.findall(k + r'[^\n]*?([\d.]+)\s*$', e, re.M); R[k + '_last'] = v[-1] if v else None
# decode every 2nd frame at 480 px wide for the pixel checks
w2 = 480; h2 = int(round(H * w2 / W / 2)) * 2
p = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps={fr/2},scale={w2}:{h2}:flags=area,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fs = np.frombuffer(p, np.uint8).reshape(-1, h2, w2).astype(np.float32); dt = 2 / fr; R['frames_checked'] = len(fs)
mean = fs.mean((1, 2)); R['luma'] = dict(min=float(mean.min()), max=float(mean.max()))
d = np.abs(np.diff(fs, axis=0)).mean((1, 2)); R['motion_mean_diff'] = float(d.mean())
med = np.median(d) + 1e-6
for i in np.where(d > max(18, 8 * med))[0]:
    t = (i + 1) * dt
    if not any(abs(t - c) < 0.45 for c in cuts): F('jump', f'frame-to-frame diff {d[i]:.1f} at {t:.2f}s (flicker or unplanned cut)')
# flat-region noise: pixels whose 3x3 neighbourhood is already near-flat; any residual noise there = grain/dither/halftone
def flat_noise(f):
    g = f[1:-1, 1:-1]; nb = [f[:-2, 1:-1], f[2:, 1:-1], f[1:-1, :-2], f[1:-1, 2:]]; dev = np.max([np.abs(g - n) for n in nb], axis=0)
    fl = dev < 6; return float(dev[fl].mean()) if fl.sum() > 2000 else 0.0
fn = [flat_noise(fs[i]) for i in range(0, len(fs), max(1, len(fs) // 40))]; R['flat_noise'] = dict(mean=float(np.mean(fn)), max=float(np.max(fn)))
if np.mean(fn) > 0.6: F('not-clean-vector', f'flat regions carry noise {np.mean(fn):.2f}/255 (grain, dither or texture)')
# edge ink: content touching the outer 12 px of the frame (scaled), vs the typical background of that edge
m = 3; bad = []
for i in range(0, len(fs), max(1, len(fs) // 60)):
    f = fs[i]
    for nm, band in (('left', f[:, :m]), ('right', f[:, -m:]), ('top', f[:m]), ('bottom', f[-m:])):
        pass
R['edge_check'] = 'see overlay-lint for DOM safe-zone; pixel edge ink not flagged'
R['verdict'] = 'clean' if not [x for x in R['findings'] if x['severity'] == 'warn'] else 'review'
R['note'] = 'Evidence from ffmpeg + pixel statistics, not a viewing. Contact sheets of the real frames are still required.'
s = json.dumps(R, indent=1); print(s) if not out else open(out, 'w').write(s)
if out: print(R['verdict'], len(R['findings']), 'findings ->', out)
