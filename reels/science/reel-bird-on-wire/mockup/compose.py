# Mockup composer: Cycles clips (12 fps) + voltage-field data objects drawn per frame -> silent preview mp4 (30 fps).
# families: (1) Cycles animated plate (wide dusk), (2) Cycles rack-focus clip + field/meter overlay, (3) procedural colour-step diagram.
import sys, os, math, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
CL, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1920
F = '/home/user/video-generator/assets/fonts/'
def font(name, size): return ImageFont.truetype(F + name, size)
try:
    INTER = lambda s: font('inter/inter-latin-800-normal.woff2', s)
    ImageFont.truetype(F + 'inter/inter-latin-800-normal.woff2', 20)
except Exception: INTER = lambda s: ImageFont.load_default()
def clip(prefix, n): return [Image.open(f'{CL}/{prefix}_{i:03d}.png').convert('RGB').resize((W, H), Image.LANCZOS) for i in range(1, n + 1)]
wide, rack = clip('wide', 24), clip('rack', 24)
def glow(img, strength=.55):
    a = np.asarray(img).astype(np.float32) / 255; lum = a.max(2); m = np.clip((lum - .72) * 4, 0, 1)[..., None] * a
    g = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)); b = np.asarray(g).astype(np.float32) / 255
    return Image.fromarray(np.clip((a + strength * b) * 255, 0, 255).astype(np.uint8))
def grain(img, k, amt=.03):
    rng = np.random.default_rng(k); a = np.asarray(img).astype(np.float32) / 255; n = rng.normal(0, amt, a.shape[:2])[..., None]
    return Image.fromarray(np.clip((a + n) * 255, 0, 255).astype(np.uint8))
def vign(img):
    y, x = np.mgrid[0:H, 0:W]; d = np.sqrt(((x - W / 2) / (W * .75)) ** 2 + ((y - H / 2) / (H * .7)) ** 2); v = np.clip(1 - .35 * d ** 2, .55, 1)[..., None]
    return Image.fromarray(np.clip(np.asarray(img).astype(np.float32) * v, 0, 255).astype(np.uint8))
def text(d, xy, s, size, fill, anchor='la'): d.text(xy, s, font=INTER(size), fill=fill, anchor=anchor)
def lerp(a, b, u): return a + (b - a) * u
def ramp(t, a, b): return max(0, min(1, (t - a) / (b - a)))
def eo(u): return 1 - (1 - u) ** 3
frames = []
# ---- scene A: wide dusk plate with travelling pulses (2.0 s of the 24-frame loop x2) + headline, 4 s ----
for k in range(120):
    t = k / 30; f = wide[int(t * 12) % 24]; f = f.copy(); z = 1 + .06 * eo(ramp(t, 0, 4)); f = f.resize((int(W * z), int(H * z)), Image.BICUBIC).crop((int((W * z - W) / 2), int((H * z - H) / 2) + int(-40 * eo(ramp(t, 0, 4))), int((W * z - W) / 2) + W, int((H * z - H) / 2) + H - int(40 * eo(ramp(t, 0, 4))) + 0)).resize((W, H))
    f = vign(glow(f)); d = ImageDraw.Draw(f); a = eo(ramp(t, .1, .6))
    text(d, (162, 262), '11,000 V line.', 92, (238, 246, 251)); text(d, (162, 372), 'One sparrow.', 92, (255, 168, 90))
    text(d, (162, 1292), 'MOCKUP - ILLUSTRATIVE - CURRENT PULSES RUN ALONG THE WIRE', 15, (200, 215, 228))
    frames.append(grain(f, k))
# ---- scene B: rack focus clip (wire pulses -> bird) + meter across the feet, 4 s ----
for k in range(120):
    t = k / 30; f = rack[min(23, int(t * 12))]; f = vign(glow(f)); d = ImageDraw.Draw(f)
    u = eo(ramp(t, 1.4, 2.4)); x0, y0 = 162, 1010
    d.rounded_rectangle((x0, y0, x0 + 540, y0 + 190), 12, fill=(6, 12, 20), outline=(255, 150, 70), width=3)
    text(d, (x0 + 22, y0 + 14), 'VOLTAGE ACROSS THE FEET', 18, (190, 205, 218)); mv = 1.35 * u
    text(d, (x0 + 22, y0 + 52), f'{mv:0.2f} mV', 84, (255, 168, 90)); text(d, (x0 + 22, y0 + 148), 'ILLUSTRATIVE: 100 A, 5 cm, aluminium wire', 16, (190, 205, 218))
    text(d, (162, 262), 'Same wire.', 92, (238, 246, 251)); text(d, (162, 372), 'Same voltage.', 92, (255, 168, 90))
    frames.append(grain(f, 1000 + k))
# ---- scene C: procedural colour-step diagram (two wires, a body between them), 4 s ----
def field(c, t):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    # potential: wire A (y=760) at 1.0, wire B (y=1010) at 0.0; body bridges them. Colour = potential
    p = np.clip((y - 760) / 250, 0, 1); p = np.where(t < 1.6, np.where(y < 885, 1.0, 0.0) * 0 + 1.0, 1 - p)
    return p
for k in range(120):
    t = k / 30; img = Image.new('RGB', (W, H), (8, 12, 20)); a = np.asarray(img).astype(np.float32)
    y, x = np.mgrid[0:H, 0:W].astype(np.float32); u = eo(ramp(t, .4, 2.4))
    # a soft potential field: between the two wires a gradient (the "colour step"), outside constant
    p = np.clip((y - 640) / 330, 0, 1); p = 1 - p * u  # u=0: everything at line voltage; u=1: wire B pulled to earth
    hot = np.array([255, 120, 40], np.float32); cold = np.array([60, 130, 255], np.float32)
    col = (hot[None, None, :] * p[..., None] + cold[None, None, :] * (1 - p[..., None])) * .38
    a = a + col; img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img)
    for yy, lab in ((640, 'WIRE A  11,000 V'), (970, 'WIRE B  0 V (earth side)')):
        d.rounded_rectangle((120, yy - 10, 960, yy + 10), 10, fill=(190, 195, 200)); text(d, (162, yy - 54), lab, 28, (238, 246, 251))
    # current pulses through the body (only when the colour step exists)
    for j in range(7):
        ph = ((t * .8 + j / 7) % 1); yy = lerp(650, 960, ph)
        d.ellipse((540 - 12, yy - 12, 540 + 12, yy + 12), fill=(255, 235, 200)) if u > .6 else None
    d.rounded_rectangle((480, 700, 600, 920), 40, outline=(238, 246, 251), width=5)
    text(d, (162, 262), 'Difference = danger.', 82, (238, 246, 251)); text(d, (162, 1130), 'colour step across the body', 40, (255, 168, 90))
    text(d, (162, 1292), 'MOCKUP - ILLUSTRATIVE DIAGRAM', 15, (200, 215, 228)); frames.append(grain(img, 2000 + k))
for i, fr in enumerate(frames): fr.save(f'{OUT}/f_{i:04d}.png')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '30', '-i', f'{OUT}/f_%04d.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', f'{OUT}/../mockup.mp4'])
print('frames', len(frames))
