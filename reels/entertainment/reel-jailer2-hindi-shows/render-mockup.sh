#!/bin/bash
# Renders 4 mockup windows (scale 1) with the page's own timeline, then muxes the matching voice slices. Output: out/mockup.mp4
cd "$(dirname "$0")/../../.." || exit 1
R=reels/entertainment/reel-jailer2-hindi-shows; mkdir -p $R/out/mw
i=0
for w in "0 10.5" "28 34" "43 54" "54.05 57.4"; do
  set -- $w; i=$((i+1))
  REEL_START=$1 REEL_END=$2 bun scripts/render.mjs $R/site $R/out/mw/w$i.mp4 > /tmp/jmw$i.log 2>&1
  ffmpeg -v error -y -ss $1 -to $2 -i $R/audio/voice.wav -c:a aac -b:a 160k $R/out/mw/a$i.m4a
  ffmpeg -v error -y -i $R/out/mw/w$i.mp4 -i $R/out/mw/a$i.m4a -c:v copy -c:a aac -shortest $R/out/mw/m$i.mp4
  echo "window $i done" >> /tmp/jmw_progress.log
done
for i in 1 2 3 4; do echo "file 'mw/m$i.mp4'" ; done > $R/out/mw/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $R/out/mw/list.txt -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -movflags +faststart $R/out/mockup.mp4
echo ALLDONE >> /tmp/jmw_progress.log
