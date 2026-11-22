#!/bin/bash
# resumable Blender film render: frames at 12 fps (skips existing PNGs), then VP9 webm for the page. usage: blender/render_film.sh   (needs audio/words.json + site/timing.js from voice/make_timing.py)
R="$(cd "$(dirname "$0")/.." && pwd)"; W=/tmp/art/film; mkdir -p $W
DUR=$(python3 -c "import json;print(json.load(open('$R/audio/words.json'))['end'])"); N=$(python3 -c "print(int(round($DUR*24)))")
cd "$R/blender"; q=$((N/2)); T=$(python3 -c "print(round($q/24,4))")
/usr/bin/python3 film.py 0 $T 24 $W 4 > /tmp/art/film_a.log 2>&1 &
/usr/bin/python3 film.py $T $DUR 24 $W 4 > /tmp/art/film_b.log 2>&1 &
wait
n=$(ls $W/f*.png | wc -l); echo "frames $n of $N"
ffmpeg -y -v error -framerate 24 -i $W/f%05d.png -c:v libvpx-vp9 -crf 22 -b:v 0 -pix_fmt yuv420p -row-mt 1 "$R/site/seg/film.webm" && ls -la "$R/site/seg/film.webm" && echo FILMDONE
