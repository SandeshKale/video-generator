#!/bin/bash
# frames (12 fps, 540x960) -> motion-interpolated 60 fps VP9 world.webm for the page (video seeking; Chromium headless can't decode H.264)
set -e; D=${1:-/tmp/otpw_full}; O=${2:-$(dirname "$0")/../site/world.webm}
ffmpeg -y -v error -framerate 12 -i $D/f%04d.png -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=1080:1920:flags=lanczos" -c:v libvpx-vp9 -crf 28 -b:v 0 -g 30 -pix_fmt yuv420p -an $O
echo done $O
