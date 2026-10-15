#!/bin/bash
# copies generated stills/depth into site/ (cheap); until road_car exists, road_dawn stands in so the build can be previewed
cd "$(dirname "$0")"; mkdir -p site/shots site/depth
for f in shots/*.jpg; do cp -u "$f" site/shots/; done; for f in depth/*.png; do cp -u "$f" site/depth/; done
[ -f site/shots/road_car.jpg ] || { cp site/shots/road_dawn.jpg site/shots/road_car.jpg; cp site/depth/road_dawn.png site/depth/road_car.png; }
