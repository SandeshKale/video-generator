# Character bible — Dollhouse Cutaway cast

Used two ways: (1) as the spec for the in-repo **paper-puppet** characters (`site/puppet.js` — layered, clothed, shaded parts driven by CMU mocap; this is what renders), and (2) as **super-detailed prompts** for text/image-to-character tools (Make-A-Character, CharacterGen, LHM, AI Game Spritesheets/Gorest) if you run them on a GPU machine.

**Global style prompt (prepend to every character):** "flat vector paper-cut character, soft rounded shapes, gentle drop shadow, no outlines, warm cream background, limited palette terracotta #e2674a, teal #1f8a8a, butter #ffd166, sage #9bc5a5, aubergine ink #2a2438, big expressive head (about 1/4 of body height), small simple hands, rounded sneakers, friendly editorial-illustration look, front/side/back turnaround sheet, neutral A-pose, plain flat colour backdrop, even lighting, full body in frame, consistent proportions, production-ready for 2D rigging".

## Pip — the host (narrator)
Late-20s friendly nerd-next-door, light peach skin (#ffd9b5), short dark aubergine hair with a soft rounded fringe, round black-rimmed glasses (3.5 px frame), rosy cheeks, expressive thick eyebrows, wide smile, teal (#1f8a8a) crew-neck sweater with a subtle lighter ribbing highlight, dark slate trousers (#3a3550), clean off-white sneakers. Rig notes: needs 9 mouth shapes (Rhubarb A–H, X), blink, eyebrow raise, shoulders for a frontal bust, relaxed gesturing arms.

## Maya — the housemate
Early-30s, warm brown skin (#c98a62), dark brown hair in a high bun, terracotta (#e2674a) zip hoodie with a kangaroo pocket and drawstring, denim-blue slim jeans (#5b6d8a), white sneakers, small stud earrings, relaxed confident posture. Walks, sits on the sofa, dances.

## Sam — the second housemate / viewfinder subject
Teen, fair skin with freckles (#f0c39a), tousled sandy-brown hair, butter-yellow (#ffd166) tee over teal chinos (#2f5d62), terracotta high-top sneakers, slightly slouched.

## The burglar (comedic, non-threatening)
Cartoon "bandit": black beanie with a pompom, black domino eye-mask, black-and-white striped long-sleeve shirt, dark trousers, black soft shoes, exaggerated tiptoe; wide eyes visible through the mask. Never menacing; no weapons, no sack of "SWAG" text.

## The officer (deadpan)
Mid-40s, deep tan skin (#a8704c), navy cap with a butter badge, navy uniform shirt with two butter buttons and a chest stripe, navy trousers, black shoes, clipboard; signature move: the slow shrug.

## The camera "J450" (prop-character)
Matte aluminium cylinder, like an oversized lip-balm tube (about 52×120 units), a single round black lens with a terracotta status light that blinks, soft grey cap band, no logo (do not copy any real Apple design); spits sticky notes from a thin slot.

## What runs where
- In this repo: layered puppets (`site/puppet.js`) — runs on CPU, deterministic, ready now.
- Your GPU tools: **not runnable in this sandbox** (no GPU, 4 CPUs, ~6 GB free disk, multi-GB model weights, some need hosted image models). Their licences: CharacterGen Apache-2.0, LHM Apache-2.0, Gorest MIT, AI Game Spritesheets MIT (checked); Make-A-Character and AniGS licences not checked — read before use. Also: their outputs are 3D meshes or raster sprite sheets; getting them into this pure-function-of-`t` renderer needs an extra conversion step (a 3D viewer pass or sprite-sheet playback), so the paper-puppet route is the practical one for the reels.
