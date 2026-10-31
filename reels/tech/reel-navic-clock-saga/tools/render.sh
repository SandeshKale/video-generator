#!/bin/bash
# renders the page in two parallel slices (2 Chromiums at a time), joins them, muxes audio/final.wav and writes reel.mp4 (CRF 24 share encode)
# usage: tools/render.sh   (run from anywhere; needs audio/final.wav, site/ ready)
set -e
R="$(cd "$(dirname "$0")/.." && pwd)"; ROOT="$R/../../.."; W=/tmp/scr/navic_r; mkdir -p $W
DUR=$(python3 -c "import json;print(json.load(open('$R/audio/words.json'))['end'])"); MID=$(python3 -c "print(round($DUR/2,2))")
cd "$ROOT"
rm -f $W/s1.mp4 $W/s2.mp4
REEL_START=0 REEL_END=$MID bun scripts/render.mjs reels/tech/reel-navic-clock-saga/site $W/s1.mp4 > $W/s1.log 2>&1 & echo $! > $W/s1.pid
REEL_START=$MID REEL_END=$DUR bun scripts/render.mjs reels/tech/reel-navic-clock-saga/site $W/s2.mp4 > $W/s2.log 2>&1 & echo $! > $W/s2.pid
wait $(cat $W/s1.pid) $(cat $W/s2.pid)
printf "file '$W/s1.mp4'\nfile '$W/s2.mp4'\n" > $W/list.txt
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -i "$R/audio/final.wav" -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$R/reel.mp4"
ls -la "$R/reel.mp4"
