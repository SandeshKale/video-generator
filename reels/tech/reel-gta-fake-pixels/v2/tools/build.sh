#!/bin/bash
# concatenate the source parts into site/world.js
cd "$(dirname "$0")/../site" && cat src/a_engine.js src/b_world.js src/b2_props.js src/c_game.js src/d_scenes.js src/e_main.js > world.js
