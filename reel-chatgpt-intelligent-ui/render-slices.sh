#!/bin/bash
cd "$(dirname "$0")"
seq 0 4 | xargs -P4 -I{} bash -c 's=$(( {} * 18 )); e=$(( s + 18 )); f=out/slices/s{}.mp4; [ -f $f ] || REEL_START=$s REEL_END=$e REEL_CRF=17 REEL_PRESET=veryfast bun ../scripts/render.mjs site $f > out/slices/log{}.txt 2>&1'
for i in 0 1 2 3 4; do echo "file 's$i.mp4'"; done > out/slices/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/slices/list.txt -c copy out/video-silent.mp4
ffmpeg -y -loglevel error -i out/video-silent.mp4 -i audio/final.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/master.mp4
echo ALLDONE
