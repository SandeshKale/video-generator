# Composes AgentReach_GPU_ALL.ipynb = voice clone + lip-sync + host matting + generated stills/cut-outs/depth + AI video inserts.
import json, textwrap
nb1 = json.load(open('AgentReach_GPU.ipynb'))['cells']
nb2 = json.load(open('AgentReach_GPU_extras.ipynb'))['cells']
cells = []
def md(s): cells.append({"cell_type": "markdown", "metadata": {}, "source": textwrap.dedent(s).strip().splitlines(True)})
def code(s): cells.append({"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [], "source": textwrap.dedent(s).strip().splitlines(True)})

md("""
# Agent-Reach reel — ALL GPU tasks in one notebook

Run order (each part is saved before the next starts, so an early result is never lost):
- **Part 1 — voice + lip-sync (core):** OmniVoice clones *your* voice from your own clip, speaks the 21 script lines, faster-whisper gives word timings, LatentSync re-draws your mouth on your real footage. → `agentreach-out.zip` (written as soon as this part finishes).
- **Part 2 — host cut-out:** Robust Video Matting turns every lip-synced host clip into a transparent-background WebM (so graphics can sit behind you). Added to `agentreach-out.zip`.
- **Part 3 — generated visuals:** 7 object photos (RealVisXL Lightning), cut-outs (rembg isnet), depth maps (Depth-Anything-V2-Small), 3 short AI video inserts (CogVideoX-2b, 8→24 fps). → `agentreach-extras.zip`.

**Kaggle:** Settings → Accelerator **GPU P100** (or T4 x2), Internet **On** → Run All. About 2–2.5 h in total. Resumable: if it stops, press Run All again; finished steps are skipped. Parts 2 and 3 are wrapped so a failure there prints a `FAILED` line and never touches Part 1's results.
Only your own voice/face are used, for your own reels. Generated images/videos are labelled "AI IMAGE"/"AI VIDEO" in the reel.
""")
# part 1: reuse nb1 cells 1..9 (skip its intro markdown at 0 and outro at -1)
for c in nb1[1:-1]: cells.append(c)

code('''
# PART 1 DONE -> core zip exists. PART 2: host cut-out (Robust Video Matting, GPL-3 code / outputs are yours). Transparent VP9 WebM per sentence.
import torch, numpy as np, json as _json
def probe(p):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',p], capture_output=True, text=True)
    s = _json.loads(r.stdout)['streams'][0]; return s['width'], s['height']
def matte(model, dev, src, out_webm, ds=0.5, scale='900:1200', crf=30, fps=25):
    W, H = probe(src); alpha = out_webm.replace('.webm', '_alpha.mkv')
    rd = subprocess.Popen(['ffmpeg','-v','error','-i',src,'-f','rawvideo','-pix_fmt','rgb24','-'], stdout=subprocess.PIPE)
    wr = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s',f'{W}x{H}','-r',str(fps),'-i','-','-c:v','ffv1',alpha], stdin=subprocess.PIPE)
    rec, n = [None] * 4, 0
    with torch.no_grad():
        while True:
            buf = rd.stdout.read(W * H * 3)
            if len(buf) < W * H * 3: break
            x = torch.from_numpy(np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()).to(dev).permute(2, 0, 1)[None].float() / 255
            fgr, pha, *rec = model(x, *rec, ds)
            wr.stdin.write((pha[0, 0].clamp(0, 1) * 255).byte().cpu().numpy().tobytes()); n += 1
    wr.stdin.close(); wr.wait(); rd.wait()
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-i',alpha,'-filter_complex',f'[1:v]format=gray[a];[0:v][a]alphamerge,scale={scale}','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-crf',str(crf),'-b:v','0','-auto-alt-ref','0',out_webm], check=True)
    os.remove(alpha); return n
try:
    if not os.path.exists(f'{BASE}/rvm'):
        sh(f'git clone -q --depth 1 https://github.com/PeterL1n/RobustVideoMatting {BASE}/rvm')
        sh(f'curl -sSL -o {BASE}/rvm_mobilenetv3.pth https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3.pth')
    sys.path.insert(0, f'{BASE}/rvm')
    from model import MattingNetwork
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    rvm = MattingNetwork('mobilenetv3').eval().to(dev); rvm.load_state_dict(torch.load(f'{BASE}/rvm_mobilenetv3.pth', map_location=dev))
    os.makedirs(f'{BASE}/out/hostcut', exist_ok=True)
    for f in sorted(glob.glob(f'{BASE}/host/s*.mp4')):
        o = f'{BASE}/out/hostcut/{os.path.basename(f)[:-4]}.webm'
        if os.path.exists(o): continue
        t = time.time(); n = matte(rvm, dev, f, o); print(os.path.basename(o), n, 'frames', f'{time.time()-t:.0f}s')
    sh(f'cd {BASE} && rm -f agentreach-out.zip && zip -qr agentreach-out.zip out -x "out/lat_g*"')
    print(sh(f'ls -l {BASE}/agentreach-out.zip').stdout)
except Exception as e:
    print('MATTING FAILED:', repr(e)[:800])
''')

# part 3: from the extras notebook
setup = ''.join(nb2[1]['source'])
# drop the duplicated imports/helpers that part 1 already defined; keep the pip install + STILLS/VIDEOS lists
keep = []
skip = True
for line in setup.splitlines(True):
    if line.startswith("sh('pip -q install -U diffusers"): skip = False
    if not skip: keep.append(line)
code("# PART 3: generated visuals. Install diffusers stack + the prompt lists\nos.makedirs(f'{BASE}/stills', exist_ok=True); os.makedirs(f'{BASE}/video', exist_ok=True); os.makedirs(f'{BASE}/cutouts', exist_ok=True); os.makedirs(f'{BASE}/depth', exist_ok=True)\n" + ''.join(keep))
cells.append(nb2[2])   # stills
code('''
# 3b. Cut-outs (rembg isnet-general-use) and depth maps (Depth-Anything-V2-Small, Apache-2.0) for the stills
from PIL import Image
try:
    sh('pip -q install rembg onnxruntime')
    from rembg import remove, new_session
    sess = new_session('isnet-general-use')
    for sid, _, _ in STILLS:
        for k in range(2):
            p, o = f'{BASE}/stills/{sid}_{k}.png', f'{BASE}/cutouts/{sid}_{k}.png'
            if os.path.exists(p) and not os.path.exists(o): remove(Image.open(p).convert('RGB'), session=sess).save(o)
    print('cutouts done')
except Exception as e:
    print('CUTOUTS FAILED:', repr(e)[:800])
try:
    from transformers import pipeline
    dp = pipeline('depth-estimation', model='depth-anything/Depth-Anything-V2-Small-hf', device=0 if torch.cuda.is_available() else -1)
    for sid, _, _ in STILLS:
        for k in range(2):
            p, o = f'{BASE}/stills/{sid}_{k}.png', f'{BASE}/depth/{sid}_{k}.png'
            if os.path.exists(p) and not os.path.exists(o): dp(Image.open(p).convert('RGB'))['depth'].save(o)
    print('depth done')
except Exception as e:
    print('DEPTH FAILED:', repr(e)[:800])
''')
cells.append(nb2[3])   # video
code('''
# 3c. Extras zip
sh(f'cd {BASE} && rm -f agentreach-extras.zip && zip -qr agentreach-extras.zip stills cutouts depth video -x "video/*_raw.mp4"')
print(sh(f'ls -l {BASE}/agentreach-out.zip {BASE}/agentreach-extras.zip').stdout)
''')
md("""
**Done.** Download from the right panel → Output: `agentreach-out.zip` (voice, host clips, cut-out host clips, timings) and `agentreach-extras.zip` (stills, cut-outs, depth maps, AI video inserts). Put both in the Drive folder and tell me.

If a part printed `FAILED`, paste that line back; the rest of the results are still in the zips. For *Out of memory* in the LatentSync cell: Restart session and Run All (finished steps are skipped). If the clip download in step 3 fails, upload the clip as `/kaggle/working/work/real.mp4` and re-run that cell.
""")
nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
json.dump(nb, open('AgentReach_GPU_ALL.ipynb', 'w'), indent=1); print('cells', len(cells))
