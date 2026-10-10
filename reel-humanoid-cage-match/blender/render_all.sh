#!/usr/bin/env bash
# Renders all riso character clips (PNG RGBA) then encodes them to VP9 alpha WebM in ../site/clips/.
set -e; cd "$(dirname "$0")"; R=${RES:-560}; OUT=/tmp/w/riso; mkdir -p "$OUT" ../site/clips
rc(){ # name char action variant yaw cam [frames]
  local n=$1; shift; local char=$1 act=$2 var=$3 yaw=$4 cam=$5 fr=${6:-}
  rm -rf "$OUT/$n"; python3 riso_render.py $char $act "$OUT/$n" --variant $var --yaw $yaw --cam="$cam" --res $R ${fr:+--frames $fr} 2>&1 | grep -E "RENDERED|rror"
  ffmpeg -v error -y -framerate 24 -i "$OUT/$n/f%04d.png" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 -auto-alt-ref 0 -g 1 ../site/clips/$n.webm; rm -rf "$OUT/$n"
}
RB="-0.2,2.45,6.0"; RD="1.0,2.0,8.0"; HM="-0.3,2.6,6.3"; HD="-1.9,2.0,8.6"
rc robot_idle   robot Robot_Idle    coral  -35 "$RB"
rc robot_punch  robot Robot_Punch   coral  -35 "$RB"
rc robot_death  robot Robot_Death   coral  -35 "$RD"
rc robot_dance  robot Robot_Dance   yellow -20 "$RB"
rc robot_thumbs robot Robot_ThumbsUp yellow -20 "$RB"
rc robotb_idle  robot Robot_Idle    yellow  35 "$RB"
rc robotb_punch robot Robot_Punch   yellow  35 "$RB"
rc human_idle   human Idle          x       40 "$HM" 1-80
rc human_punch  human Punch         x       40 "$HM"
rc human_death  human Death         x       40 "$HD"
rc human_work   human Working       x      -30 "-0.3,2.1,5.2" 1-80
echo ALLDONE
