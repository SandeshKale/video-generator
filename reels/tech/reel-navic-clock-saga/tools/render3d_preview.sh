#!/bin/bash
# renders three windows of the 3D film (30 fps preview) in parallel, cuts the matching audio and joins them -> /tmp/scr/p3/preview3d.mp4
R="$(cd "$(dirname "$0")/.." && pwd)"; ROOT="$R/../../.."; W=/tmp/scr/p3; mkdir -p $W; cd "$ROOT"
i=0; for win in "0 8" "35.2 42.7" "87.7 94"; do set -- $win; REEL_FPS=30 REEL_CRF=21 REEL_PRESET=veryfast REEL_START=$1 REEL_END=$2 bun scripts/render.mjs reels/tech/reel-navic-clock-saga/site3d $W/w$i.mp4 > $W/w$i.log 2>&1 & echo $! > $W/w$i.pid; i=$((i+1)); [ $i -eq 2 ] && wait $(cat $W/w0.pid $W/w1.pid); done
wait $(cat $W/w2.pid)
i=0; : > $W/list.txt; for win in "0 8" "35.2 42.7" "87.7 94"; do set -- $win; d=$(python3 -c "print($2-$1)"); ffmpeg -y -v error -i $W/w$i.mp4 -ss $1 -t $d -i "$R/audio/final.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest $W/m$i.mp4; echo "file '$W/m$i.mp4'" >> $W/list.txt; i=$((i+1)); done
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -c copy $W/preview3d.mp4; ls -la $W/preview3d.mp4
