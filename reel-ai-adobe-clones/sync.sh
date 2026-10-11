#!/bin/bash
# copy generated stills/depth into site/; missing stills fall back to a stand-in so the build can be previewed
cd "$(dirname "$0")"; mkdir -p site/shots site/depth
for f in shots/*.jpg; do cp -u "$f" site/shots/; done; for f in depth/*.png; do cp -u "$f" site/depth/; done
alias_() { [ -f site/shots/$1.jpg ] || { cp site/shots/$2.jpg site/shots/$1.jpg; cp site/depth/$2.png site/depth/$1.png; echo "stand-in $1 <- $2"; }; }
alias_ living_dusk aisle_dawn; alias_ doorstep store_exit; alias_ storm_lot store_exit; alias_ checkout_lane store_exit
