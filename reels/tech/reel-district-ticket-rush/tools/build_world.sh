#!/bin/bash
# world.js = a_engine + b1..b3 scenes + c_main (all inside one IIFE; edit the parts in site3d/src, never world.js)
cd "$(dirname "$0")/../site3d" && cat src/a_engine.js src/b1_scenes.js src/b2_scenes.js src/b3_scenes.js src/c_main.js > world.js && node -e "require('fs').readFileSync('world.js','utf8')" && (bun build world.js --target=browser >/dev/null 2>&1 && echo built world.js: syntax ok || (bun build world.js --target=browser 2>&1 | head -20))
