# Reference film study 2: "System Design · 018" (Few Shot Studio) — what the VISUALS do (31 Oct 2026)

Source: the 160 s, 720x1280, 30 fps Hinglish quick-commerce explainer the creator supplied (first used for voice only; its frames were never studied until the NavIC v2 feedback: *"check its visuals, animation quality and strategy; it elevates the storytelling to another level"*). Study only; nothing is copied. 80 frames (every 2 s) were reviewed.

## What it actually is
**A continuous real-time 3D film, not a deck of animated panels.** Every shot is a lit 3D set seen by a travelling camera: a kitchen stove with a boiling milk pot, a fridge, a phone with a real app UI, a night city seen top-down and at street level with a scooter rider, a dark store with shelves, a rack of servers, a shop aisle with a planogram, a close-up shelf with milk packets. Perspective, depth, materials and light change every second.

## The strategy (ranked by how much it lifts the story)
1. **The film starts and ends inside the viewer's own life.** 0 s: 7:00 AM, milk boiling on the stove, a fridge with no milk. 150 s: the same stove, "Ab store tumhara hai", the milk packet on the counter. The abstract system (stores, shards, stock) is wrapped in one personal morning.
2. **One question carried by one object.** "Why was your milk there at all?" becomes: milk in the phone app -> a pin on a map -> a rider -> a store -> shelves -> stock bars -> back to the pot.
3. **The data is built INTO the set.** Stock is 30 white bars standing in the shop aisle (one per morning), the stock line is a yellow plane through them, the short days are red bars, "+10 extra" slides in. Shards are physical server racks and milk/bread/eggs are glowing dots that hop between racks (a "distributed transaction" you can see). The geofence is a glowing polygon laid on the city.
4. **Algorithms are shown running, not summarised.** Point-in-polygon: a horizontal ray, crossing counters ("1 - IN", "2 - OUT", "0 - OUT") appear on each polygon, the winner turns green. Spatial index: a yellow grid cell of "your cell" selects only the touching polygons.
5. **A teaching device that repeats**: a small bottom-centre card "THIS IS CALLED / Geofence / the boundary of a store's area" at the moment each term is first spoken (Dark store, Geofence, Spatial index, Point-in-polygon, Distributed transaction, Shard key, Planogram, Safety stock). Names are earned and remembered.
6. **Few cuts, many camera moves.** Top-down city -> descend behind the rider -> street level -> store shutter -> top-down map -> polygon. Scenes hand over by match moves (pot -> phone -> map).
7. **Restrained identity.** Navy world, ONE yellow accent for the thing being followed, white mono micro-labels, a tiny constant header ("SYSTEM DESIGN · 018" + handle). No ambient sweeps, no decoration: all motion is camera travel or a data event.
8. **On-screen text = the question being asked** ("Tumhara doodh wahan tha hi kyun?", "Bike start hone se pehle") in one rounded callout, plus short data labels in the 3D space. Not a subtitle of every word.
9. **Characters are 3D and tiny** (a rider on a scooter, seen from behind or far away), never 2D cartoon people.
10. **Pace**: a new picture every 3-6 s, a new *place* every ~10 s, a new *concept name* every ~8 s. Density comes from what changes in the world, not from how many boxes are on a flat screen.

## Why NavIC v1/v2 fell short (honest)
Flat DOM panels over a few sprites. A "density layer" added more panels, but panels do not make a world: no persistent space, no camera, no personal anchor, no data embedded in a place, no named-term cards, no algorithm shown running. The metric I used (occupancy of 90 px cells) rewarded clutter, not storytelling.

## What it means for NavIC (the rebuild, `site3d/`)
- One three.js world: **phone on a desk (the viewer's blue dot) -> camera climbs out through the sky -> Earth at night with India's lights -> satellites -> the four-ray solve in space -> inside a satellite (three real dials) -> rocket pad -> launch tracked from the pad to orbit -> back to the phone, dot collapsing to a point.**
- Through-line object = **the blue dot with its error circle**; it exists on the phone, as a disc on the real Earth, as a street-map dot, and is closed in the last shot.
- Data in the world: 3D error disc on the ground; rays that carry travelling pulses; the empty 4th slot drawn as a dashed orbit marker; clocks as physical dials that stop.
- "THIS IS CALLED" cards for: NavIC, atomic clock, timestamp, nanosecond, transfer orbit.
- Only a few cuts; transitions are camera travel (through-sky climb, descent, launch tracking).
