#!/bin/bash
# resumable: per shot renders missing frames (12 fps, 720x1280), encodes seg webm (1080x1920), concatenates to site/seg/film.webm
cd "$(dirname "$0")"; R=$(cd .. && pwd); WK=/tmp/pumice/film; mkdir -p $WK $R/site/seg
T=$(python3 - <<'PY'
import json
s=open('../site/timing.js').read(); j=json.loads(s[s.index('=')+1:].rstrip().rstrip(';')); S={x['id']:x['t0'] for x in j['sentences']}
c=[w['t0'] for w in j['cap'] if w['s']=='s2' and ''.join(ch for ch in w['w'].lower() if ch.isalnum()).startswith('aur')]
print(c[0] if c else S['s2']+3.5, S['s4'], S['s5'], S['s8'], S['s9'], j['end'])
PY
)
set -- $T; B1=$1; S4=$2; S5=$3; S8=$4; S9=$5; E=$6
for spec in "STONE 0 $B1" "CUT $B1 $S4" "SEA $S4 $S5" "PLATE $S5 $S8" "LEGEND $S8 $S9" "BUCKET $S9 $E"; do
  set -- $spec; N=$1; t0=$2; t1=$3; n=$(python3 -c "print(int(round(($t1-$t0)*12)))")
  [ -f $WK/$N.webm ] && continue
  have=$(ls $WK/$N 2>/dev/null | grep -c '^f')
  [ $have -lt $n ] && python3 film.py $N $t0 $t1 12 $WK/$N 720 1280 12 $have > $WK/$N.log 2>&1
  ffmpeg -y -loglevel error -framerate 12 -i $WK/$N/f%05d.png -vf "scale=1080:1920:flags=lanczos,unsharp=3:3:.4" -c:v libvpx-vp9 -crf 30 -b:v 0 -pix_fmt yuv420p $WK/$N.webm && rm -rf $WK/$N
done
printf "file '%s'\n" $WK/STONE.webm $WK/CUT.webm $WK/SEA.webm $WK/PLATE.webm $WK/LEGEND.webm $WK/BUCKET.webm > $WK/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i $WK/list.txt -c copy $R/site/seg/film.webm && echo FILM_DONE
