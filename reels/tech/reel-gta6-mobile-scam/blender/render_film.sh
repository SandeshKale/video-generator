#!/bin/bash
# resumable: renders each shot's missing frames, encodes to seg/<shot>.webm (12 fps, 1080x1920), concatenates to site/seg/film.webm
cd "$(dirname "$0")"; R=$(cd .. && pwd); WK=/tmp/moon/film; mkdir -p $WK $R/site/seg
T=$(python3 - <<'PY'
import json
s=open('../site/timing.js').read(); j=json.loads(s[s.index('=')+1:].rstrip().rstrip(';')); S={x['id']:x['t0'] for x in j['sentences']}
print(S['s2'],S['s5'],S['s8'],j['end'])
PY
)
set -- $T; A=$1; B=$2; C=$3; E=$4
for spec in "GHAT 0 $A" "ORBIT $A $B" "SKY $B $C" "GHAT2 $C $E"; do
  set -- $spec; N=$1; t0=$2; t1=$3; n=$(python3 -c "print(int(round(($t1-$t0)*12)))")
  [ -f $WK/$N.webm ] && continue
  have=$(ls $WK/$N 2>/dev/null | wc -l)
  [ $have -lt $n ] && python3 film.py $N $t0 $t1 12 $WK/$N 720 1280 12 $have > $WK/$N.log 2>&1
  ffmpeg -y -loglevel error -framerate 12 -i $WK/$N/f%05d.png -vf "scale=1080:1920:flags=lanczos,unsharp=3:3:.4" -c:v libvpx-vp9 -crf 30 -b:v 0 -pix_fmt yuv420p $WK/$N.webm && rm -rf $WK/$N
done
printf "file '%s'\n" $WK/GHAT.webm $WK/ORBIT.webm $WK/SKY.webm $WK/GHAT2.webm > $WK/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i $WK/list.txt -c copy $R/site/seg/film.webm && echo FILM_DONE
