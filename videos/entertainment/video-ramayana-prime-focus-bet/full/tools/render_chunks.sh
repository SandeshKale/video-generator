#!/bin/bash
# resumable render: 16 time chunks (1920x1080@30), 2 at a time, each skipped if already a valid mp4; then concat + mux final.wav -> video.mp4. Keep the session active while it runs.
R="$(cd "$(dirname "$0")/.." && pwd)"; ROOT="/home/user/video-generator"; W=/tmp/rpf/chunks; mkdir -p $W; cd "$ROOT"
DUR=$(python3 -c "import json;t=open('$R/site/timing.js').read();print(json.loads(t[t.index('=')+1:].rstrip().rstrip(';'))['end'])"); N=16
one() { n=$1; a=$(python3 -c "print(round($DUR*$n/$N,3))"); b=$(python3 -c "print(round($DUR*($n+1)/$N,3))"); f=$W/c$n.mp4
  if ffprobe -v error -show_entries format=duration -of csv=p=0 $f >/dev/null 2>&1; then echo "chunk $n ok"; return; fi
  rm -f $f; REEL_W=1920 REEL_H=1080 REEL_FPS=30 REEL_CRF=20 REEL_START=$a REEL_END=$b bun scripts/render.mjs videos/entertainment/video-ramayana-prime-focus-bet/full/site $f > $W/c$n.log 2>&1; echo "chunk $n done"; }
export -f one; export DUR N W R ROOT
seq 0 $((N-1)) | xargs -P2 -I{} bash -c 'one {}'
: > $W/list.txt; for n in $(seq 0 $((N-1))); do echo "file '$W/c$n.mp4'" >> $W/list.txt; done
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -i "$R/audio/final.wav" -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -shortest -movflags +faststart "$R/video.mp4" && ls -la "$R/video.mp4"
