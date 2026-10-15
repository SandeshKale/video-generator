# Generates AgentReach_AVATAR.ipynb : your real clip drives a chosen avatar still (LivePortrait, InsightFace replaced by YuNet),
# your cloned voice (already generated) lip-syncs it (LatentSync), then cut-out (RVM). Run: python3 make_avatar_notebook.py
import json, textwrap
cells = []
def md(s): cells.append({"cell_type": "markdown", "metadata": {}, "source": textwrap.dedent(s).strip().splitlines(True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": textwrap.dedent(s).strip().splitlines(True)})

md("""
# Agent-Reach reel — AVATAR version (your expressions + your voice on your avatar)

1. **Your real clip is the performance reference**: head motion, eyebrows, blinks and eye direction are transferred onto your **avatar still** with **LivePortrait** (relative motion, so the avatar keeps looking at the camera; hands/body stay as in the still). InsightFace's non-commercial detector is replaced by OpenCV YuNet (MIT).
2. **Your cloned voice** (already made by the earlier run, taken from `agentreach-out.zip` in Drive) is used for all 21 lines; two weak lines (s15, s16) are re-generated and re-checked.
3. **LatentSync** re-draws the avatar's mouth to the voice. 4. **Robust Video Matting** makes transparent cut-outs. → `agentreach-avatar-out.zip`.

**Kaggle:** Accelerator **GPU P100** (or T4 x2), Internet **On**, Run All. About 1–1.5 h. Resumable (finished steps are skipped). Change `AVATAR` in step 1 to try another look: `black_hoodie` (default), `navy_hoodie`, `grey_zip`, `cozy_mic`.
Only your own voice/face/likeness are used, for your own reels.
""")

code('''
# 1. Setup + config
import os, sys, json, subprocess, shutil, glob, time, re, urllib.parse
BASE = '/kaggle/working' if os.path.isdir('/kaggle/working') else '/content'
os.makedirs(BASE, exist_ok=True); os.chdir(BASE)
print(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout)
mem = int(subprocess.run(['nvidia-smi','--query-gpu=memory.total','--format=csv,noheader,nounits'], capture_output=True, text=True).stdout.split()[0])
if mem >= 20000: MODEL_REPO, UNET_CFG = 'ByteDance/LatentSync-1.6', 'configs/unet/stage2_512.yaml'
else:            MODEL_REPO, UNET_CFG = 'ByteDance/LatentSync-1.5', 'configs/unet/stage2.yaml'
print('VRAM MiB', mem, '->', MODEL_REPO)
AVATAR = 'black_hoodie'          # black_hoodie | navy_hoodie | grey_zip | cozy_mic
GH = 'https://raw.githubusercontent.com/sandeshkale/video-generator/main/reel-agent-reach'
CFG = {
  "clip_id": "1qqsB1Je31FlJavhbMpSdTkFUzYlayiMa",          # your real clip (Drive, link-shared)
  "voice_zip_id": "1M2pE6YyhN1gLuuhdHSLjB5_sGhy5wOp-",      # agentreach-out.zip from the earlier run (vo/*.wav, timing.json)
  "drive_crop": "crop=1400:1400:1115:566,scale=512:512,fps=25",   # square around your face in the 4K clip
  "fps": 25, "gap": 0.2,
  "windows": [[0.0, 5.3], [5.6, 13.5]],                    # speaking stretches of your clip used as the performance reference
  "refs": {
    "A": {"start": 0.0,  "end": 5.3,  "text": "Okay, here's the thing, I don't need this perfect, I just need it to sound like me."},
    "B": {"start": 6.36, "end": 13.5, "text": "I speed up when I'm excited and I drop my voice when I'm sure, yeah, right, you know what I mean?"}
  },
  "fix_lines": {"s15": "Summarize a two hour YouTube talk.", "s16": "Track a competitor's tweets."},
  "host_ids": ["s01","s02","s03","s04","s05","s06","s07","s08","s09","s10","s11","s12","s13","s18","s19","s20","s21"]
}
for d in ['work','vo','groups','host','out','lp']: os.makedirs(f'{BASE}/{d}', exist_ok=True)
def sh(cmd, check=True):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if r.returncode and check: print(r.stdout[-2000:], r.stderr[-3000:]); raise RuntimeError(cmd)
    return r
def drive_get(fid, dest):
    import requests
    if os.path.exists(dest) and os.path.getsize(dest) > 100_000: return
    s = requests.Session(); r = s.get(f"https://drive.google.com/uc?export=download&id={fid}", stream=True)
    if 'text/html' in r.headers.get('content-type', ''):
        act = re.search(r'action="([^"]+)"', r.text).group(1)
        f = dict(re.findall(r'name="([^"]+)" value="([^"]*)"', r.text))
        r = s.get(act + '?' + urllib.parse.urlencode(f), stream=True)
    with open(dest, 'wb') as fh:
        for c in r.iter_content(1 << 20): fh.write(c)
    assert os.path.getsize(dest) > 100_000, f'download failed for {dest}: upload it by hand'
''')

code('''
# 2. Install: tools, LivePortrait (+weights, YuNet), LatentSync (own py3.10 venv, +weights), OmniVoice for the 2 line fixes
sh('which ffmpeg || (apt-get -qq update && apt-get -qq install -y ffmpeg libgl1)')
sh('pip -q install omnivoice "transformers>=5.3" faster-whisper jiwer librosa soundfile uv requests tyro rich pykalman imageio imageio-ffmpeg lmdb onnxruntime scikit-image albumentations pyyaml scipy tqdm opencv-python-headless')
if not os.path.exists(f'{BASE}/LivePortrait'):
    sh(f'git clone -q --depth 1 https://github.com/KwaiVGI/LivePortrait {BASE}/LivePortrait')
from huggingface_hub import hf_hub_download
for f in ['liveportrait/base_models/appearance_feature_extractor.pth','liveportrait/base_models/motion_extractor.pth','liveportrait/base_models/spade_generator.pth',
          'liveportrait/base_models/warping_module.pth','liveportrait/landmark.onnx','liveportrait/retargeting_models/stitching_retargeting_module.pth']:
    hf_hub_download('KlingTeam/LivePortrait', f, local_dir=f'{BASE}/LivePortrait/pretrained_weights')
sh(f'curl -sSL -o {BASE}/yunet.onnx https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx')
sh(f'curl -sSL -o {BASE}/lp_run.py {GH}/kaggle/lp_run.py'); sh(f'curl -sSL -o {BASE}/work/avatar.jpg {GH}/avatars/{AVATAR}.jpg')
if not os.path.exists(f'{BASE}/LatentSync'):
    sh(f'git clone -q https://github.com/bytedance/LatentSync {BASE}/LatentSync'); sh(f"sed -i '/^gradio/d' {BASE}/LatentSync/requirements.txt")
if not os.path.exists(f'{BASE}/ls-venv/bin/python'):
    sh(f'uv venv --python 3.10 {BASE}/ls-venv')
    sh(f'cd {BASE}/LatentSync && uv pip install --python {BASE}/ls-venv/bin/python -r requirements.txt --index-strategy unsafe-best-match')
code_dl = f\'\'\'
from huggingface_hub import hf_hub_download
for f in ["latentsync_unet.pt", "whisper/tiny.pt"]:
    print(hf_hub_download("{MODEL_REPO}", f, local_dir="{BASE}/LatentSync/checkpoints"))
\'\'\'
r = subprocess.run([f'{BASE}/ls-venv/bin/python','-c',code_dl], capture_output=True, text=True); print(r.stdout[-600:], r.stderr[-600:])
print('installed; avatar =', AVATAR, os.path.getsize(f'{BASE}/work/avatar.jpg'), 'bytes')
''')

code('''
# 3. Inputs: your clip (performance reference + voice references) and the earlier cloned-voice zip
drive_get(CFG['clip_id'], f'{BASE}/work/real.mp4'); drive_get(CFG['voice_zip_id'], f'{BASE}/work/voice.zip')
sh(f'cd {BASE}/work && unzip -o -q voice.zip -d voicezip')
for f in glob.glob(f'{BASE}/work/voicezip/out/vo/*.wav'):
    if not os.path.exists(f'{BASE}/vo/' + os.path.basename(f)): shutil.copy(f, f'{BASE}/vo/')   # never overwrite a fixed line on re-run
shutil.copy(f'{BASE}/work/voicezip/out/timing.json', f'{BASE}/out/timing.json')
for k, v in CFG['refs'].items():
    o = f'{BASE}/work/ref_{k}.wav'
    if not os.path.exists(o): sh(f"ffmpeg -v error -y -ss {v['start']} -to {v['end']} -i {BASE}/work/real.mp4 -vn -ac 1 -ar 24000 -af loudnorm=I=-20 {o}")
print(len(glob.glob(f'{BASE}/vo/*.wav')), 'voice lines')
''')

code('''
# 4. Re-make the two weak voice lines (s15, s16): 8 takes each, keep the one the speech recogniser reads back correctly
import torch, soundfile as sf, numpy as np, jiwer, librosa
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
def norm(s): return re.sub(r"[^a-z0-9' ]", ' ', s.lower().replace('-', ' ')).split()
try:
    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cuda:0", dtype=torch.float16)
    try: asr = WhisperModel('small.en', device='cuda', compute_type='float16')
    except Exception: asr = WhisperModel('small.en', device='cpu', compute_type='int8')
    for sid, text in CFG['fix_lines'].items():
        if os.path.exists(f'{BASE}/vo/{sid}.fixed'): continue
        best = None
        for rk in ['A', 'B']:
            for seed in range(4):
                torch.manual_seed(500 + seed)
                a = np.asarray(model.generate(text=text, ref_audio=f'{BASE}/work/ref_{rk}.wav', ref_text=CFG['refs'][rk]['text'], num_step=32)[0]).astype(np.float32)
                tmp = f'{BASE}/work/_t.wav'; sf.write(tmp, a, 24000)
                segs, _ = asr.transcribe(tmp, language='en', beam_size=1); hyp = ' '.join(s.text for s in segs)
                wer = jiwer.wer(' '.join(norm(text)), ' '.join(norm(hyp))) if norm(hyp) else 1.0
                sc = wer * 10 + (3 if abs(a).max() > 0.99 else 0)
                if best is None or sc < best[0]: best = (sc, a, hyp)
        sf.write(f'{BASE}/vo/{sid}.wav', best[1], 24000); open(f'{BASE}/vo/{sid}.fixed', 'w').write(best[2])
        print(sid, 'score', round(best[0], 2), '->', best[2])
    del model; torch.cuda.empty_cache()
except Exception as e:
    print('VOICE FIX FAILED (keeping earlier takes):', repr(e)[:600])
''')

code('''
# 5. Performance reference from your clip: square face crop, 25 fps, then LivePortrait's motion template (head pose, brows, blinks, gaze, mouth)
if not os.path.exists(f'{BASE}/work/drive_master.mp4'):
    sh(f"ffmpeg -v error -y -i {BASE}/work/real.mp4 -map 0:v:0 -vf \\"{CFG['drive_crop']}\\" -an -c:v libx264 -crf 12 -pix_fmt yuv420p {BASE}/work/drive_master.mp4")
ENV = f'LP_DIR={BASE}/LivePortrait YUNET_ONNX={BASE}/yunet.onnx'
if not os.path.exists(f'{BASE}/work/drive_master.pkl'):
    r = sh(f'{ENV} python {BASE}/lp_run.py -s {BASE}/work/avatar.jpg -d {BASE}/work/drive_master.mp4 -o {BASE}/lp/master', check=False)
    print(r.stdout[-800:], r.stderr[-1500:])
assert os.path.exists(f'{BASE}/work/drive_master.pkl'), 'LivePortrait did not produce the motion template'
print('template ok')
''')

code('''
# 6. Plan which stretch of your performance drives each spoken line (frame-exact), build one motion template, animate the avatar once
import pickle, math
sdur = {i: sf.info(f'{BASE}/vo/{i}.wav').duration for i in CFG['host_ids']}
tmpl = pickle.load(open(f'{BASE}/work/drive_master.pkl', 'rb')); N = tmpl['n_frames']; FPS, GAP = CFG['fps'], CFG['gap']
def pick(k, need):
    cands = [w for w in CFG['windows'] if w[1] - w[0] >= need] or [[0.0, N / FPS - 0.1]]
    w = cands[k % len(cands)]; frac = [0, .6, .3, .9, .15][k % 5]
    return w[0] + frac * max(0.0, (w[1] - w[0]) - need)
plan, idx = [], [0]          # frame 0 = neutral reference, dropped from the output
for k, sid in enumerate(CFG['host_ids']):
    n = int(math.ceil((sdur[sid] + GAP) * FPS)); st = int(round(pick(k, n / FPS) * FPS)); st = min(st, N - n)
    plan.append(dict(id=sid, frames=n, src_start=st, g0=len(idx) - 1)); idx += list(range(st, st + n))
sel = {'n_frames': len(idx), 'output_fps': FPS, 'motion': [tmpl['motion'][i] for i in idx], 'c_eyes_lst': [tmpl['c_eyes_lst'][i] for i in idx], 'c_lip_lst': [tmpl['c_lip_lst'][i] for i in idx]}
pickle.dump(sel, open(f'{BASE}/work/plan.pkl', 'wb')); json.dump(plan, open(f'{BASE}/out/plan.json', 'w'), indent=1)
ALL = f'{BASE}/lp/animated.mp4'
if not os.path.exists(ALL):
    r = sh(f'{ENV} python {BASE}/lp_run.py -s {BASE}/work/avatar.jpg -d {BASE}/work/plan.pkl -o {BASE}/lp/all', check=False)
    print(r.stdout[-600:], r.stderr[-1500:])
    cand = glob.glob(f'{BASE}/lp/all/*--plan.mp4'); assert cand, 'LivePortrait run failed'
    shutil.copy(cand[0], ALL)
print(sh(f'ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=width,height,nb_read_frames -of compact {ALL}').stdout, 'expected frames', len(idx))
''')

code('''
# 7. Groups of ~12 s: avatar frames (slice of the animated video) + cloned voice, frame-exact
import librosa
groups, cur, curdur = [], [], 0.0
for p in plan:
    d = sdur[p['id']]
    if cur and curdur + d > 12: groups.append(cur); cur, curdur = [], 0.0
    cur.append(p); curdur += d + GAP
if cur: groups.append(cur)
meta = []
for gi, g in enumerate(groups):
    gdir = f'{BASE}/groups/g{gi}'; os.makedirs(gdir, exist_ok=True)
    f0 = g[0]['g0'] + 1; nfr = sum(p['frames'] for p in g)      # +1: output frame 0 is the neutral reference
    sh(f"ffmpeg -v error -y -i {ALL} -vf \\"select='between(n,{f0},{f0+nfr-1})',setpts=N/{FPS}/TB\\" -an -c:v libx264 -crf 12 -pix_fmt yuv420p -r {FPS} {gdir}/video.mp4")
    auds, off, sents = [], 0, []
    for p in g:
        y, sr = sf.read(f"{BASE}/vo/{p['id']}.wav"); y = librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=16000)
        L = int(round(p['frames'] / FPS * 16000)); auds.append(np.pad(y, (0, max(0, L - len(y))))[:L])
        sents.append(dict(id=p['id'], frame0=off, frames=p['frames'])); off += p['frames']
    sf.write(f'{gdir}/audio.wav', np.concatenate(auds), 16000); meta.append(dict(group=gi, frames=off, sentences=sents))
json.dump(meta, open(f'{BASE}/out/groups.json', 'w'), indent=1); print([(m['group'], m['frames']) for m in meta])
''')

code('''
# 8. LatentSync: redraw the avatar's mouth to your voice (resumable)
for m in meta:
    gi = m['group']; gdir = f'{BASE}/groups/g{gi}'; out = f'{BASE}/out/lat_g{gi}.mp4'
    if os.path.exists(out) and os.path.getsize(out) > 10000: print(f'g{gi}: done'); continue
    t = time.time()
    r = subprocess.run([f'{BASE}/ls-venv/bin/python','-m','scripts.inference','--unet_config_path',UNET_CFG,'--inference_ckpt_path','checkpoints/latentsync_unet.pt',
        '--inference_steps','20','--guidance_scale','2.0','--enable_deepcache','--video_path',f'{gdir}/video.mp4','--audio_path',f'{gdir}/audio.wav',
        '--video_out_path',out,'--temp_dir',f'{BASE}/tmp_g{gi}'], cwd=f'{BASE}/LatentSync', capture_output=True, text=True)
    print(f'g{gi}: exit {r.returncode} in {time.time()-t:.0f}s')
    if r.returncode: print(r.stdout[-1500:], r.stderr[-3000:]); break
''')

code('''
# 9. Per-sentence host clips + the avatar-only (no lip-sync) fallback, copy voice, zip (core result saved before the cut-out step)
for m in meta:
    for s in m['sentences']:
        sh(f"ffmpeg -v error -y -i {BASE}/out/lat_g{m['group']}.mp4 -vf \\"select='between(n,{s['frame0']},{s['frame0']+s['frames']-1})',setpts=N/{FPS}/TB\\" -an -c:v libx264 -crf 18 -pix_fmt yuv420p -r {FPS} {BASE}/host/{s['id']}.mp4")
os.makedirs(f'{BASE}/out/vo', exist_ok=True)
for f in glob.glob(f'{BASE}/vo/*.wav'): shutil.copy(f, f'{BASE}/out/vo/')
shutil.copytree(f'{BASE}/host', f'{BASE}/out/host', dirs_exist_ok=True); shutil.copy(f'{BASE}/work/avatar.jpg', f'{BASE}/out/avatar.jpg')
sh(f'cd {BASE} && rm -f agentreach-avatar-out.zip && zip -qr agentreach-avatar-out.zip out -x "out/lat_g*"')
print(sh(f'ls -l {BASE}/agentreach-avatar-out.zip').stdout)
try:
    from IPython.display import Video; display(Video(f'{BASE}/out/lat_g0.mp4', embed=True, width=300))
except Exception as e: print(e)
''')

code('''
# 10. Transparent cut-outs (Robust Video Matting) for every host clip; zip again
import json as _json
def probe(p):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',p], capture_output=True, text=True)
    s = _json.loads(r.stdout)['streams'][0]; return s['width'], s['height']
def matte(model, dev, src, out_webm, ds=0.5, crf=30, fps=25):
    W, H = probe(src); alpha = out_webm.replace('.webm', '_alpha.mkv')
    rd = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'], stdout=subprocess.PIPE)
    wr = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','ffv1',alpha], stdin=subprocess.PIPE)
    rec, n = [None] * 4, 0
    with torch.no_grad():
        while True:
            buf = rd.stdout.read(W * H * 3)
            if len(buf) < W * H * 3: break
            x = torch.from_numpy(np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()).to(dev).permute(2, 0, 1)[None].float() / 255
            fgr, pha, *rec = model(x, *rec, ds); wr.stdin.write((pha[0, 0].clamp(0, 1) * 255).byte().cpu().numpy().tobytes()); n += 1
    wr.stdin.close(); wr.wait(); rd.wait()
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-i',alpha,'-filter_complex','[1:v]format=gray[a];[0:v][a]alphamerge','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-crf',str(crf),'-b:v','0','-auto-alt-ref','0',out_webm], check=True)
    os.remove(alpha); return n
try:
    if not os.path.exists(f'{BASE}/rvm'):
        sh(f'git clone -q --depth 1 https://github.com/PeterL1n/RobustVideoMatting {BASE}/rvm')
        sh(f'curl -sSL -o {BASE}/rvm_mobilenetv3.pth https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3.pth')
    sys.path.insert(0, f'{BASE}/rvm'); from model import MattingNetwork
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    rvm = MattingNetwork('mobilenetv3').eval().to(dev); rvm.load_state_dict(torch.load(f'{BASE}/rvm_mobilenetv3.pth', map_location=dev))
    os.makedirs(f'{BASE}/out/hostcut', exist_ok=True)
    for f in sorted(glob.glob(f'{BASE}/host/s*.mp4')):
        o = f'{BASE}/out/hostcut/{os.path.basename(f)[:-4]}.webm'
        if os.path.exists(o): continue
        n = matte(rvm, dev, f, o); print(os.path.basename(o), n, 'frames')
    sh(f'cd {BASE} && rm -f agentreach-avatar-out.zip && zip -qr agentreach-avatar-out.zip out -x "out/lat_g*"')
    print(sh(f'ls -l {BASE}/agentreach-avatar-out.zip').stdout)
except Exception as e:
    print('MATTING FAILED (the zip from step 9 is still valid):', repr(e)[:700])
''')

md("""
**Done.** Download `agentreach-avatar-out.zip` (right panel → Output) and put it in the Drive folder. It holds `host/sXX.mp4` (avatar + your expressions + lip-sync to your voice), `hostcut/sXX.webm` (transparent cut-outs), `vo/` (final voice lines, incl. the fixed s15/s16), `timing.json` (word timings of the earlier takes), `plan.json`, `groups.json`, `avatar.jpg`.

If a step fails: re-run it once; paste any error text back. If LivePortrait fails in step 5/6, paste the last lines of that cell.
""")
nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
json.dump(nb, open('AgentReach_AVATAR.ipynb', 'w'), indent=1); print('cells', len(cells))
