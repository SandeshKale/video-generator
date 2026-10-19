# Colour grade for the notebook flat-lays: a warm late-afternoon "film" look, applied identically to every page so the
# carousel reads as one roll. renders/raw_pN.png (16-bit) -> out/togaf-notes-0N.jpg (1080x1350) + a full-res PNG.
#  1 white balance  : nudge the paper from the cool studio HDRI towards warm cream
#  2 tone curve     : gentle S-curve with lifted blacks (matte fade) and a soft highlight roll-off
#  3 split toning   : teal-green into the shadows, amber into the highlights, mids left neutral
#  4 saturation     : pull overall saturation down 10%, keep warm hues (inks, highlighter, wood) a touch richer
#  5 halation       : a faint red-orange bloom around the brightest areas (paper edges, mug rim)
#  6 vignette       : 22% elliptical falloff
#  7 lens           : 0.06% lateral chromatic aberration towards the corners
#  8 grain          : luminance-weighted film grain (two scales), strongest in the mids
# Run: python3 grade.py [pages...]
import numpy as np, sys, os
from PIL import Image, ImageFilter
H = os.path.dirname(os.path.abspath(__file__)); os.makedirs(os.path.join(H, 'out'), exist_ok=True)
pages = [int(a) for a in sys.argv[1:]] or list(range(1, 9))
def lum(x): return x[..., 0] * .2126 + x[..., 1] * .7152 + x[..., 2] * .0722
def smooth(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def blur(x, r):
    out = np.stack([np.asarray(Image.fromarray((np.clip(x[..., c], 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), np.float32) / 255 for c in range(x.shape[2])], -1)
    return out
for p in pages:
    src = os.path.join(H, f'renders/raw_p{p}.png')
    if not os.path.exists(src): print('missing', src); continue
    x = np.asarray(Image.open(src).convert('RGB'), np.float32) / 255
    h, w, _ = x.shape; rng = np.random.default_rng(100 + p)
    # 1 white balance
    x = x * np.array([1.035, 1.0, .945])
    # 2 tone curve (S + matte fade + highlight roll-off)
    x = np.clip(x, 0, 1.2); s = x + .10 * np.sin((x - .5) * np.pi) * (1 - np.abs(x - .5) * 1.2)
    s = .035 + s * (.955 - .035); s = np.where(s > .86, .86 + (s - .86) * .62, s); x = s
    # 3 split toning
    L = lum(x)[..., None]; sh = (1 - smooth(.05, .5, L)); hi = smooth(.55, .95, L)
    x = x + sh * np.array([-.018, .006, .014]) + hi * np.array([.022, .008, -.022])
    # 4 saturation (keep warm hues a little richer)
    L = lum(x)[..., None]; warm = np.clip((x[..., 0:1] - x[..., 2:3]) * 3, 0, 1)
    x = L + (x - L) * (.88 + .12 * warm)
    # 5 halation
    hl = np.clip(lum(x) - .80, 0, 1)[..., None] * np.array([1., .45, .2]); x = x + blur(hl, 14) * .35
    # 6 vignette
    yy, xx = np.mgrid[0:h, 0:w]; r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h * .48) / (h / 2)) ** 2)
    x = x * (1 - .22 * smooth(.55, 1.45, r))[..., None]
    # 7 lateral chromatic aberration (scale R up, B down about the centre)
    def scale(c, k):
        im = Image.fromarray((np.clip(c, 0, 1) * 255).astype(np.uint8)); W2, H2 = int(w * k), int(h * k)
        im = im.resize((W2, H2), Image.BICUBIC); l, t = (W2 - w) // 2, (H2 - h) // 2
        return np.asarray(im.crop((l, t, l + w, t + h)), np.float32) / 255 if k > 1 else np.asarray(im.resize((w, h), Image.BICUBIC), np.float32) / 255
    x[..., 0] = scale(x[..., 0], 1.0006); x[..., 2] = scale(x[..., 2], 1.0)
    # 8 grain
    g1 = rng.normal(0, 1, (h, w)); g2 = np.asarray(Image.fromarray(((rng.normal(0, 1, (h, w)) * 40 + 128).clip(0, 255)).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)), np.float32) / 40 - 3.2
    L = lum(x); amt = (.016 + .02 * (1 - np.abs(L - .45) * 1.6).clip(0, 1))[..., None]
    x = x + (g1 * .55 + g2 * .45)[..., None] * amt
    out = (np.clip(x, 0, 1) * 255 + .5).astype(np.uint8); im = Image.fromarray(out)
    im.save(os.path.join(H, f'renders/graded_p{p}.png'))
    im.resize((1080, 1350), Image.LANCZOS).save(os.path.join(H, f'out/togaf-notes-{p:02d}.jpg'), quality=93, subsampling=0)
    print('graded', p)
