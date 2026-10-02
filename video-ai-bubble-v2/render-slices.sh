#!/bin/bash
# usage: render-slices.sh  -> out/slices/sNN.mp4 (54 s each, 4 in parallel), then stitch + mux
cd "$(dirname "$0")"
seq 0 7 | xargs -P4 -I{} bash -c 's=$(( {} * 54 )); e=$(( s + 54 )); f=out/slices/s$(printf %02d {}).mp4; [ -f $f ] || REEL_W=1920 REEL_H=1080 REEL_START=$s REEL_END=$e REEL_CRF=17 REEL_PRESET=veryfast node ../scripts/render.mjs site $f > out/slices/log{}.txt 2>&1'
ls out/slices/s*.mp4 | sed "s/^/file '/;s/$/'/" | sed "s#file 'out/slices/#file '#" > out/slices/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i out/slices/list.txt -c copy out/video-silent.mp4
ffmpeg -y -loglevel error -i out/video-silent.mp4 -i audio/final.wav -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart out/master.mp4
echo ALLDONE
