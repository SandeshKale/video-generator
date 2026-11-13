#!/bin/sh
# concatenate the page sources into site/world.js (one IIFE: a_engine opens it, d_main closes it)
cd "$(dirname "$0")/../site/src" && cat a_engine.js c_scenes.js d_main.js > ../world.js && echo built
