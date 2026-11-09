#!/bin/bash
# renders the 3D film (30 fps) in two parallel slices, joins them and muxes audio/final.wav -> reel3d.mp4 (CRF 24)
set -e
R="$(cd "$(dirname "$0")/.." && pwd)"; ROOT="$R/../../.."; W=/tmp/scr/rtrace; mkdir -p $W; cd "$ROOT"
DUR=$(python3 -c "import json;print(json.load(open('$R/audio/words.json'))['end'])"); MID=$(python3 -c "print(round($DUR/2,2))")
rm -f $W/s1.mp4 $W/s2.mp4
REEL_FPS=30 REEL_CRF=20 REEL_START=0 REEL_END=$MID bun scripts/render.mjs reels/tech/reel-spam-call-roast/site3d $W/s1.mp4 > $W/s1.log 2>&1 & echo $! > $W/s1.pid
REEL_FPS=30 REEL_CRF=20 REEL_START=$MID REEL_END=$DUR bun scripts/render.mjs reels/tech/reel-spam-call-roast/site3d $W/s2.mp4 > $W/s2.log 2>&1 & echo $! > $W/s2.pid
wait $(cat $W/s1.pid) $(cat $W/s2.pid)
printf "file '$W/s1.mp4'\nfile '$W/s2.mp4'\n" > $W/list.txt
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -i "$R/audio/final.wav" -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -shortest -movflags +faststart "$R/reel3d.mp4"
ls -la "$R/reel3d.mp4"
