#!/bin/bash
# 2 slices in parallel (3+ Chromiums died in earlier reels), then concat + mux the mix. usage: render-slices.sh
cd "$(dirname "$0")/../../.."; R=reels/tech/reel-otp-journey; W=/tmp/otp_render; mkdir -p $W
REEL_START=0 REEL_END=33 bun scripts/render.mjs $R/site $W/s1.mp4 > $W/s1.log 2>&1 &
P1=$!
REEL_START=33 REEL_END=66 bun scripts/render.mjs $R/site $W/s2.mp4 > $W/s2.log 2>&1 &
P2=$!
wait $P1 $P2
printf "file '%s/s1.mp4'\nfile '%s/s2.mp4'\n" $W $W > $W/list.txt
ffmpeg -y -v error -f concat -safe 0 -i $W/list.txt -i $R/audio/mix_hi.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest $R/reel-hi.mp4
ls -la $R/reel-hi.mp4; echo RENDER_DONE
