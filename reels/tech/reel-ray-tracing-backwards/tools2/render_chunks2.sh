#!/bin/bash
# resumable render: 12 time chunks, 2 at a time, each skipped if already a valid mp4; then concat + mux final.wav -> reel-v2.mp4
R="$(cd "$(dirname "$0")/.." && pwd)"; ROOT="$R/../../.."; W=/tmp/scr/rtchunks; mkdir -p $W; cd "$ROOT"
DUR=$(python3 -c "import json;print(json.load(open('$R/audio/words.json'))['end'])"); N=12
one() { n=$1; a=$(python3 -c "print(round($DUR*$n/$N,3))"); b=$(python3 -c "print(round($DUR*($n+1)/$N,3))"); f=$W/c$n.mp4
  if ffprobe -v error -show_entries format=duration -of csv=p=0 $f >/dev/null 2>&1; then echo "chunk $n ok"; return; fi
  rm -f $f; REEL_FPS=30 REEL_CRF=20 REEL_START=$a REEL_END=$b bun scripts/render.mjs reels/tech/reel-ray-tracing-backwards/site3d2 $f > $W/c$n.log 2>&1; echo "chunk $n done"; }
export -f one; export DUR N W R ROOT
seq 0 $((N-1)) | xargs -P2 -I{} bash -c 'one {}'
: > $W/list.txt; for n in $(seq 0 $((N-1))); do echo "file '$W/c$n.mp4'" >> $W/list.txt; done
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -i "$R/audio/final.wav" -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -shortest -movflags +faststart "$R/reel-v2.mp4" && ls -la "$R/reel-v2.mp4" && echo ALLDONE
