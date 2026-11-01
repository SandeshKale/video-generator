#!/bin/bash
# world.js = head.js + tail_a.js (engine, v3 scenes) + scenes4.js (v4 explainer scenes) + tail_b.js (SCN list, __seek)
cd "$(dirname "$0")/../site3d" && cat head.js tail_a.js scenes4.js tail_b.js > world.js && git rm -q --cached tail.js 2>/dev/null; rm -f tail.js; echo built world.js
