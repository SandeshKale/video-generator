# Generates AgentReach_GPU.ipynb (Kaggle/Colab). Run: python3 make_notebook.py
import json, textwrap
cells = []
def md(s): cells.append({"cell_type": "markdown", "metadata": {}, "source": textwrap.dedent(s).strip().splitlines(True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": textwrap.dedent(s).strip().splitlines(True)})

md("""
# Agent-Reach reel — GPU stage (voice clone + lip-sync)

Runs everything that needs a GPU, end to end, from **your own real video** (public Drive link, downloaded inside the notebook):

1. **OmniVoice** clones *your* voice from two short slices of your own clip and speaks the reel script (4 takes per line, the best take is picked automatically by a speech-recognition check).
2. **faster-whisper** gives word-level timings (for captions).
3. **LatentSync** re-draws your mouth on your real footage to match the cloned voice (head, brows, blinks, skin come from your video).
4. Everything is zipped to `agentreach-out.zip`.

**Before you start (Kaggle):** Settings → Accelerator **GPU P100** (or T4 x2) → Internet **On** → Run All. Expect about 1–1.5 h. The notebook is resumable: if it stops, press Run All again; finished steps are skipped.
Only your own voice/face are used, for your own reels.
""")

code('''
# 1. Setup, GPU check, config
import os, sys, json, subprocess, shutil, glob, time
BASE = '/kaggle/working' if os.path.isdir('/kaggle/working') else '/content'
os.makedirs(BASE, exist_ok=True); os.chdir(BASE)
print(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout)
mem = int(subprocess.run(['nvidia-smi','--query-gpu=memory.total','--format=csv,noheader,nounits'], capture_output=True, text=True).stdout.split()[0])
# LatentSync 1.6 (512 px) wants ~18 GB; 1.5 runs in ~8 GB. P100/T4 -> 1.5.
if mem >= 20000: MODEL_REPO, UNET_CFG = 'ByteDance/LatentSync-1.6', 'configs/unet/stage2_512.yaml'
else:            MODEL_REPO, UNET_CFG = 'ByteDance/LatentSync-1.5', 'configs/unet/stage2.yaml'
print('VRAM MiB', mem, '->', MODEL_REPO)

CFG = {
  "drive_id": "1qqsB1Je31FlJavhbMpSdTkFUzYlayiMa",
  "crop": "crop=1620:2160:1005:0,scale=1080:1440",   # 4K landscape -> 3:4 portrait around the face, 25 fps
  "fps": 25,
  # slices of your clip used as voice references (3-10 s is the sweet spot) and as video windows
  "refs": {
    "A": {"start": 0.0,  "end": 5.3,  "text": "Okay, here's the thing, I don't need this perfect, I just need it to sound like me."},
    "B": {"start": 6.36, "end": 13.5, "text": "I speed up when I'm excited and I drop my voice when I'm sure, yeah, right, you know what I mean?"}
  },
  "video_windows": [[0.0, 5.3], [5.6, 13.5]],
  "takes_per_ref": 2,
  "gap": 0.2,
  # id, beat, text (captions) / say (what the TTS speaks), host (shown on camera?), speed
  "sentences": [
    ["s01", 1, "Your AI agent is basically blind.", "Your AI agent is basically blind.", True, 1.05],
    ["s02", 1, "This free tool gives it eyes on the whole internet.", "This free tool gives it eyes on the whole internet.", True, 1.05],
    ["s03", 2, "It's called Agent Reach.", "It's called Agent Reach.", True, None],
    ["s04", 2, "Ninety-four thousand GitHub stars, MIT licensed, zero API fees.", "Ninety-four thousand GitHub stars, M I T licensed, zero A P I fees.", True, None],
    ["s05", 3, "Setup is one line.", "Setup is one line.", True, None],
    ["s06", 3, "You paste the install link into your agent, and it sets itself up.", "You paste the install link into your agent, and it sets itself up.", True, None],
    ["s07", 4, "Out of the box it reads web pages, watches YouTube, searches GitHub, and follows RSS feeds.", "Out of the box it reads web pages, watches YouTube, searches GitHub, and follows R S S feeds.", True, None],
    ["s08", 5, "Twitter, Reddit and RedNote need your browser cookies.", "Twitter, Reddit and RedNote need your browser cookies.", True, None],
    ["s09", 6, "But use a burner account.", "But use a burner account.", True, 0.95],
    ["s10", 6, "Scripts on login sites can get you banned.", "Scripts on login sites can get you banned.", True, 0.95],
    ["s11", 7, "Here's the trick.", "Here's the trick.", True, 0.95],
    ["s12", 7, "It isn't a new scraper. It's a switchboard over tools like yt-dlp, Jina Reader, and the GitHub CLI.", "It isn't a new scraper. It's a switchboard over tools like Y T D L P, Jeena Reader, and the GitHub C L I.", True, None],
    ["s13", 7, "One breaks? It routes to the next.", "One breaks? It routes to the next.", True, None],
    ["s14", 8, "Ask it what Reddit really thinks of a tool.", "Ask it what Reddit really thinks of a tool.", False, None],
    ["s15", 8, "Summarize a two-hour YouTube talk.", "Summarize a two-hour YouTube talk.", False, None],
    ["s16", 8, "Track a competitor's tweets.", "Track a competitor's tweets.", False, None],
    ["s17", 8, "All from one prompt.", "All from one prompt.", False, None],
    ["s18", 9, "Run agent-reach doctor, and it tells you what's ready.", "Run agent reach doctor, and it tells you what's ready.", True, None],
    ["s19", 10, "Want the link?", "Want the link?", True, None],
    ["s20", 10, "Comment REACH below and I'll send it to you.", "Comment reach below and I'll send it to you.", True, None],
    ["s21", 10, "Follow for more free tools.", "Follow for more free tools.", True, None]
  ]
}
for d in ['work','takes','vo','groups','host','out']: os.makedirs(f'{BASE}/{d}', exist_ok=True)
json.dump(CFG, open(f'{BASE}/work/config.json','w'), indent=1)
''')

code('''
# 2. Install (about 8-12 min). OmniVoice + whisper in this env; LatentSync in its own py3.10 venv.
import subprocess
def sh(cmd, check=True):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode and check: print(r.stdout[-2000:], r.stderr[-3000:]); raise RuntimeError(cmd)
    return r
sh('which ffmpeg || (apt-get -qq update && apt-get -qq install -y ffmpeg libgl1)')
sh('pip -q install omnivoice "transformers>=5.3" faster-whisper jiwer librosa soundfile gdown uv')
if not os.path.exists(f'{BASE}/LatentSync'):
    sh(f'git clone -q https://github.com/bytedance/LatentSync {BASE}/LatentSync')
    sh(f"sed -i '/^gradio/d' {BASE}/LatentSync/requirements.txt")
if not os.path.exists(f'{BASE}/ls-venv/bin/python'):
    sh(f'uv venv --python 3.10 {BASE}/ls-venv')
    sh(f'cd {BASE}/LatentSync && uv pip install --python {BASE}/ls-venv/bin/python -r requirements.txt --index-strategy unsafe-best-match')
code_dl = f\'\'\'
from huggingface_hub import hf_hub_download
for f in ["latentsync_unet.pt", "whisper/tiny.pt"]:
    print(hf_hub_download("{MODEL_REPO}", f, local_dir="{BASE}/LatentSync/checkpoints"))
\'\'\'
r = subprocess.run([f'{BASE}/ls-venv/bin/python','-c',code_dl], capture_output=True, text=True); print(r.stdout[-800:], r.stderr[-800:])
print('installed')
''')

code('''
# 3. Download your clip from Drive and cut: portrait host source, two voice references
import re, urllib.parse, requests
SRC = f'{BASE}/work/real.mp4'
if not (os.path.exists(SRC) and os.path.getsize(SRC) > 10_000_000):
    s = requests.Session()
    u = f"https://drive.google.com/uc?export=download&id={CFG['drive_id']}"
    r = s.get(u, stream=True)
    if 'text/html' in r.headers.get('content-type',''):
        act = re.search(r'action="([^"]+)"', r.text).group(1)
        f = dict(re.findall(r'name="([^"]+)" value="([^"]*)"', r.text))
        r = s.get(act + '?' + urllib.parse.urlencode(f), stream=True)
    with open(SRC, 'wb') as fh:
        for chunk in r.iter_content(1 << 20): fh.write(chunk)
print('video MB', os.path.getsize(SRC) / 1e6)
assert os.path.getsize(SRC) > 10_000_000, "Drive download failed: upload the clip to /kaggle/working/work/real.mp4 manually and re-run"
HOST = f'{BASE}/work/host_src.mp4'
if not os.path.exists(HOST):
    sh(f"ffmpeg -v error -y -i {SRC} -map 0:v:0 -vf \\"{CFG['crop']},fps={CFG['fps']}\\" -an -c:v libx264 -crf 12 -pix_fmt yuv420p {HOST}")
for k, v in CFG['refs'].items():
    out = f'{BASE}/work/ref_{k}.wav'
    if not os.path.exists(out):
        sh(f"ffmpeg -v error -y -ss {v['start']} -to {v['end']} -i {SRC} -vn -ac 1 -ar 24000 -af loudnorm=I=-20 {out}")
print(sh(f'ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of compact {HOST}').stdout)
''')

code('''
# 4. OmniVoice: speak every line in YOUR voice. 2 refs x takes_per_ref takes per line; resumable.
import torch, soundfile as sf, numpy as np
from omnivoice import OmniVoice
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0" if torch.cuda.is_available() else "cpu",
                                  dtype=torch.float16 if torch.cuda.is_available() else torch.float32)
t0 = time.time()
for sid, beat, text, say, host, speed in CFG['sentences']:
    for rk, rv in CFG['refs'].items():
        for ti in range(CFG['takes_per_ref']):
            out = f'{BASE}/takes/{sid}_{rk}{ti}.wav'
            if os.path.exists(out): continue
            torch.manual_seed(1000 * beat + 10 * ti + ord(rk))
            kw = dict(text=say, ref_audio=f'{BASE}/work/ref_{rk}.wav', ref_text=rv['text'], num_step=32)
            if speed: kw['speed'] = speed
            audio = model.generate(**kw)
            sf.write(out, np.asarray(audio[0]).astype(np.float32), 24000)
    print(sid, f'{time.time()-t0:.0f}s')
del model; torch.cuda.empty_cache()
''')

code('''
# 5. Pick the best take per line: speech-recognition accuracy first, then closeness to your pitch (~101 Hz) and no clipping
import jiwer, re, librosa
from faster_whisper import WhisperModel
try: asr = WhisperModel('small.en', device='cuda', compute_type='float16')
except Exception as e: print('whisper on cpu:', e); asr = WhisperModel('small.en', device='cpu', compute_type='int8')
def norm(s): return re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('-', ' ')).split()
REAL_F0 = 101.0
chosen, report = {}, {}
for sid, beat, text, say, host, speed in CFG['sentences']:
    cands = sorted(glob.glob(f'{BASE}/takes/{sid}_*.wav'))
    best = None
    for c in cands:
        segs, _ = asr.transcribe(c, language='en', beam_size=1)
        hyp = ' '.join(s.text for s in segs)
        wer = jiwer.wer(' '.join(norm(say)), ' '.join(norm(hyp))) if norm(hyp) else 1.0
        y, sr = sf.read(c)
        f0, _, _ = librosa.pyin(y.astype(np.float32), fmin=70, fmax=300, sr=sr)
        f0 = f0[~np.isnan(f0)]
        med = float(np.median(f0)) if len(f0) else 0.0
        score = wer * 10 + abs(med - REAL_F0) / 20 + (3 if abs(y).max() > 0.99 else 0)
        report.setdefault(sid, []).append(dict(take=os.path.basename(c), wer=round(wer, 3), f0=round(med, 1), dur=round(len(y)/sr, 2), score=round(score, 3), heard=hyp.strip()))
        if best is None or score < best[0]: best = (score, c)
    chosen[sid] = best[1]
    shutil.copy(best[1], f'{BASE}/vo/{sid}.wav')
    print(sid, os.path.basename(best[1]), [ (r['take'][-6:-4], r['wer'], r['f0']) for r in report[sid] ])
json.dump(report, open(f'{BASE}/out/take_report.json', 'w'), indent=1)
''')

code('''
# 6. Word timings for captions, from the chosen takes
timing = {}
for sid, beat, text, say, host, speed in CFG['sentences']:
    segs, _ = asr.transcribe(f'{BASE}/vo/{sid}.wav', language='en', word_timestamps=True, beam_size=5)
    timing[sid] = [dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for sg in segs for w in sg.words]
    timing[sid + '_dur'] = round(sf.info(f'{BASE}/vo/{sid}.wav').duration, 3)
json.dump(timing, open(f'{BASE}/out/timing.json', 'w'), indent=1)
del asr
print('timings done')
''')

code('''
# 7. Assemble host groups: your footage windows + the cloned voice, frame-exact (25 fps), ~12 s per group
FPS, GAP = CFG['fps'], CFG['gap']
wins = CFG['video_windows']; clip_len = 15.6
def pick(k, need):
    cands = [w for w in wins if w[1] - w[0] >= need] or [[0.0, clip_len]]
    w = cands[k % len(cands)]
    frac = [0, .6, .3, .9, .15][k % 5]
    return w[0] + frac * max(0.0, (w[1] - w[0]) - need)
hosts = [s for s in CFG['sentences'] if s[4]]
groups, cur, curdur = [], [], 0.0
for s in hosts:
    d = sf.info(f'{BASE}/vo/{s[0]}.wav').duration
    if cur and curdur + d > 12: groups.append(cur); cur, curdur = [], 0.0
    cur.append((s[0], d)); curdur += d + GAP
if cur: groups.append(cur)
meta = []
for gi, g in enumerate(groups):
    gdir = f'{BASE}/groups/g{gi}'; os.makedirs(gdir, exist_ok=True)
    pieces, auds, frame0, sentences = [], [], 0, []
    for k, (sid, d) in enumerate(g):
        n = int(np.ceil((d + GAP) * FPS)); need = n / FPS
        st = pick(k + gi, need)
        pv = f'{gdir}/p{k}.mp4'
        sh(f"ffmpeg -v error -y -ss {st:.3f} -t {need:.3f} -i {HOST} -frames:v {n} -an -c:v libx264 -crf 12 -pix_fmt yuv420p -r {FPS} {pv}")
        y, sr = sf.read(f'{BASE}/vo/{sid}.wav'); y = librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=16000)
        y = np.pad(y, (0, int(round(need * 16000)) - len(y)))[: int(round(need * 16000))]
        auds.append(y); pieces.append(pv)
        sentences.append(dict(id=sid, frame0=frame0, frames=n, audio_dur=round(d, 3), src_start=round(st, 3)))
        frame0 += n
    open(f'{gdir}/list.txt', 'w').write(''.join(f"file '{p}'\\n" for p in pieces))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {gdir}/list.txt -c copy {gdir}/video.mp4")
    sf.write(f'{gdir}/audio.wav', np.concatenate(auds), 16000)
    meta.append(dict(group=gi, frames=frame0, sentences=sentences))
json.dump(meta, open(f'{BASE}/out/groups.json', 'w'), indent=1)
print([(m['group'], m['frames'], len(m['sentences'])) for m in meta])
''')

code('''
# 8. LatentSync on each group (resumable). 20 steps / guidance 2.0 as in the earlier run.
STEPS, GUIDANCE = 20, 2.0
for m in meta:
    gi = m['group']; gdir = f'{BASE}/groups/g{gi}'; out = f'{BASE}/out/lat_g{gi}.mp4'
    if os.path.exists(out) and os.path.getsize(out) > 10000: print(f'g{gi}: done'); continue
    t = time.time()
    r = subprocess.run([f'{BASE}/ls-venv/bin/python','-m','scripts.inference','--unet_config_path',UNET_CFG,
        '--inference_ckpt_path','checkpoints/latentsync_unet.pt','--inference_steps',str(STEPS),'--guidance_scale',str(GUIDANCE),
        '--enable_deepcache','--video_path',f'{gdir}/video.mp4','--audio_path',f'{gdir}/audio.wav','--video_out_path',out,
        '--temp_dir',f'{BASE}/tmp_g{gi}'], cwd=f'{BASE}/LatentSync', capture_output=True, text=True)
    print(f'g{gi}: exit {r.returncode} in {time.time()-t:.0f}s')
    if r.returncode: print(r.stdout[-1500:], r.stderr[-3000:]); break
''')

code('''
# 9. Slice per-sentence host clips (video only, 25 fps), copy the voice files, zip everything
for m in meta:
    src = f"{BASE}/out/lat_g{m['group']}.mp4"
    for s in m['sentences']:
        sh(f"ffmpeg -v error -y -i {src} -vf \\"select='between(n,{s['frame0']},{s['frame0']+s['frames']-1})',setpts=N/{FPS}/TB\\" -an -c:v libx264 -crf 18 -pix_fmt yuv420p -r {FPS} {BASE}/host/{s['id']}.mp4")
os.makedirs(f'{BASE}/out/vo', exist_ok=True)
for f in glob.glob(f'{BASE}/vo/*.wav'): shutil.copy(f, f'{BASE}/out/vo/')
shutil.copytree(f'{BASE}/host', f'{BASE}/out/host', dirs_exist_ok=True)
shutil.copy(f'{BASE}/work/config.json', f'{BASE}/out/config.json')
sh(f'cd {BASE} && rm -f agentreach-out.zip && zip -qr agentreach-out.zip out -x "out/lat_g*"')
print(sh(f'ls -l {BASE}/agentreach-out.zip').stdout)
try:
    from IPython.display import Video
    display(Video(f'{BASE}/out/lat_g0.mp4', embed=True, width=300))
except Exception as e: print(e)
''')

md("""
**Done.** Download `agentreach-out.zip` (Kaggle: right panel → Output → `agentreach-out.zip`) and put it in the Drive folder / send it back.

If something fails: re-run the failing cell once; for *Out of memory* in step 8 restart the session and Run All (finished steps are skipped); paste any error text back. If step 3 cannot download the clip, upload it by hand to `/kaggle/working/work/real.mp4`.
""")

nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
json.dump(nb, open('AgentReach_GPU.ipynb', 'w'), indent=1)
print('cells', len(cells))
