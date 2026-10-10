#!/usr/bin/env bash
# Re-download the CC0 Quaternius characters used by this reel into assets/quaternius/ (not committed).
set -e; D="$(dirname "$0")/../assets/quaternius"; mkdir -p "$D"; cd "$D"
curl -sSL -o human.zip "https://opengameart.org/sites/default/files/Animated%20Human%20by%20%40Quaternius_0.zip" && unzip -q -o human.zip -d human
B=https://quaternius.itch.io/lowpoly-robot; curl -sSL -c cj -o p.html $B
CS=$(grep -o 'csrf_token" value="[^"]*"' p.html | head -1 | sed 's/.*value="//;s/"$//')
U=$(curl -sS -b cj -c cj -X POST -d "csrf_token=$CS" $B/download_url | python3 -c "import sys,json;print(json.load(sys.stdin)['url'])")
curl -sSL -b cj -c cj -o dl.html "$U"; CS2=$(grep -o 'csrf_token" value="[^"]*"' dl.html | head -1 | sed 's/.*value="//;s/"$//')
UP=$(grep -o 'data-upload_id="[0-9]*"' dl.html | head -1 | grep -o '[0-9]*')
D2=$(curl -sS -b cj -c cj -X POST -d "csrf_token=$CS2" "$B/file/$UP?source=view_game&as_props=1&after_download_lightbox=true" | python3 -c "import sys,json;print(json.load(sys.stdin)['url'])")
curl -sSL -o robot.zip "$D2" && unzip -q -o robot.zip -d robot; rm -f cj p.html dl.html
echo done: $(ls)
