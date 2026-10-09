#!/usr/bin/env python3
"""Stitch per-chunk host clips (c0..c6 or l0..l6) into site/host.webm on the 25 fps grid.
usage: python3 tools/stitch_host.py <dir> <prefix> [out.webm]    e.g. tools/stitch_host.py ~/lipsync-out l
Chunk cuts are the pause-aligned voice-over split used for the MoDA/LatentSync clips (seconds)."""
import subprocess, sys, os, tempfile
CUTS = [0, 9.98, 20.17, 31.27, 40.75, 50.12, 60.62, 68.707]
d, prefix = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(__file__), '..', 'site', 'host.webm')
fr = [round(c * 25) for c in CUTS]
tmp = tempfile.mkdtemp()
lst = []
for i in range(len(CUTS) - 1):
    n = fr[i + 1] - fr[i]
    e = os.path.join(tmp, f'e{i}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, f'{prefix}{i}.mp4'), '-an', '-vf',
                    f'fps=25,scale=512:512:flags=lanczos,tpad=stop_mode=clone:stop_duration=0.5,trim=end_frame={n},setpts=PTS-STARTPTS',
                    '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', e], check=True)
    lst.append(f"file '{e}'\n")
open(os.path.join(tmp, 'list.txt'), 'w').write(''.join(lst))
# VP9: headless Chromium cannot decode H.264. -g 25 keeps seeks cheap.
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(tmp, 'list.txt'), '-an',
                '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-pix_fmt', 'yuv420p', '-g', '25', '-r', '25', out], check=True)
n = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out],
                   capture_output=True, text=True).stdout.strip()
print('wrote', out, 'frames', n, '(expected', fr[-1], ')')
