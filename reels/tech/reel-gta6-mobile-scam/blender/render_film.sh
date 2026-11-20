#!/bin/bash
# resumable: renders frames in blocks of 96, encodes each block to a VP9 segment (1080x1920, 12 fps) and deletes the PNGs, then joins to site/seg/film.webm
cd "$(dirname "$0")"; R=$(cd .. && pwd); WK=/tmp/mscam/film; mkdir -p $WK $R/site/seg
N=$(python3 -c "
import json
s=open('../site/timing.js').read(); j=json.loads(s[s.index('=')+1:].rstrip().rstrip(';')); print(int(round(j['end']*12)))")
B=96; nb=$(( (N + B - 1) / B ))
for b in $(seq 0 $((nb-1))); do
  seg=$WK/seg$(printf %02d $b).webm; [ -f $seg ] && continue
  a=$((b*B)); e=$((a+B)); [ $e -gt $N ] && e=$N
  python3 film.py $WK/png $a $e 720 1280 12 >> $WK/render.log 2>&1
  ffmpeg -y -loglevel error -framerate 12 -start_number $a -i $WK/png/f%04d.png -frames:v $((e-a)) -c:v libvpx-vp9 -crf 28 -b:v 0 -pix_fmt yuv420p $seg && rm -f $WK/png/f*.png && echo "seg $b done" >> $WK/progress.log
done
ls $WK/seg*.webm | sed "s#.*#file '&'#" > $WK/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i $WK/list.txt -c copy $R/site/seg/film.webm && echo FILM_DONE >> $WK/progress.log
