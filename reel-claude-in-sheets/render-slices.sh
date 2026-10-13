#!/bin/bash
# 4 time slices of 12 s, 2 Chromiums at a time (3+ at once crashed renders before); ffmpeg concat + mux the mastered audio.
cd "$(dirname "$0")"; mkdir -p out/slices
seq 0 3 | xargs -P2 -I{} bash -c 's=$(( {} * 12 )); e=$(( s + 12 )); f=out/slices/s{}.mp4; [ -f $f.ok ] || { REEL_START=$s REEL_END=$e REEL_CRF=17 REEL_PRESET=veryfast bun ../scripts/render.mjs site $f > out/slices/log{}.txt 2>&1 && touch $f.ok; }'
for i in 0 1 2 3; do [ -f out/slices/s$i.mp4.ok ] || { echo "slice $i missing"; exit 1; }; echo "file 's$i.mp4'"; done > out/slices/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/slices/list.txt -c copy out/video-silent.mp4
ffmpeg -y -loglevel error -i out/video-silent.mp4 -i audio/final.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/master.mp4
echo ALLDONE
