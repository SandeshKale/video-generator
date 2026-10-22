# OTP journey v2: visual rebuild (look-dev stills in `lookdev/`, nothing re-rendered yet)

## What was wrong with v1 (creator feedback: "confusing, no coherence, cheap quality, story doesn't translate visually")
1. **No spatial logic.** One sprawling city of identical dark boxes. Bank, gateway, core, tower and home all looked alike, so a swing from one to the next told the viewer nothing.
2. **No hero object.** The OTP was digits on a wall, then a small white dot, then absent. The viewer never had one thing to follow.
3. **Visuals didn't carry the facts.** "1 in a million", "gateway > core > tower", "weak network", "used once" were mostly captions over generic buildings.
4. **Cheap finish.** Untextured boxes, 540x960 upscaled, 12 fps interpolated, heavy grain + denoise crushed by compression.

## v2 rules (coherence)
- **One route, always going up the screen (+Y).** A glowing cyan line connects five landmarks in story order: BANK, SMS GATEWAY, TELECOM CORE, RADIO TOWER, YOUR PHONE. The red line from the FAKE CALLER booth joins at the end. The viewer always knows where we are and where we're heading.
- **Five unmistakable landmarks, each with a lit in-world sign:** a columned bank with a vault door; a sorting hall with a conveyor, scanner ring and envelopes; a server hall with glowing racks; a lattice radio tower that emits rings; a giant phone monument on a rooftop. The distant skyline is only soft background.
- **One hero token:** an amber orb with a halo and its six digits, always the brightest thing in frame, always followed by the camera (chase cam with a lag, roll into the turns = the spider-swing feel). A shrinking ring around the token is the "expires in minutes" meter (replaces the tiny corner bar).
- **Colour meaning:** amber = the OTP, cyan = the network, red = the fake caller, green = approved. Nothing else is bright.
- **Less on screen:** location tag + big step counter + captions + stamps; the lifetime bar, the "illustration" strip and the hop text go (the signs and the route already say it).

## Shot plan (voice and timing unchanged)
| Time | Line | Picture |
|---|---|---|
| 0-2.3 | OTP just hit your phone | Macro on the giant phone monument, code on the screen, rain. |
| 2.3-4.7 | six digits, one in a million | The camera flies **backwards down the whole route** (map reveal, ~2 s), landing at the bank. |
| 4.7-8.1 | bank makes it for this payment | Token forms at the vault door; digits spin and lock; sign BANK. |
| 8.5-13.2 | works on no other payment, expires | Slow orbit of the bank; the token's ring shrinks. |
| 13.7-23.3 | gateway, core, tower | Token swings along the route on web lines; the camera chases. Gateway: token wraps into an envelope on the conveyor. Core: flies between rack rows. Tower: climbs to the top. |
| 23.6-29.7 | few seconds, weak network | Rings leave the tower; the token reaches the phone; a dim second token stalls and fades. |
| 30.2-33.3 | type, match, pass | Macro on the phone: digits typed, green tick. |
| 33.6-38.6 | used once, wrong tries block | Token bursts into sparks; USED / BLOCKED stamps. |
| 38.9-41.6 | guessing is pointless | **A field of one million dots with a single lit cell**, camera pulling out to show the scale. |
| 41.9-45 | the weak link is you | Camera glides to the red FAKE CALLER booth; the red line reaches toward the phone. |
| 45.5-53.2 | his own payment | Red line hooks the token and drags it to the booth; "YOUR PAYMENT" flips to "THEIR PAYMENT". |
| 53.6-56 | real bank never asks | The red line snaps at the bank gate; sign "NO BANK ASKS". |
| 56.3-59.8 | call 1930 | Pull back to the full lit route; 1930 beacon on the tower. |
| 60-66 | CTA | Back to the phone monument; end card. |

## Finish
- Render 720x1280 (v1 was 540x960), 16 samples, 15 fps, interpolated to 60; fewer objects per frame, so the cost per frame is about the same.
- Grain and rain much lighter; encode at CRF 24-26 without the extra denoise, target <= 30 MiB.
- Reuse: voice, timing, audio, caption copy, cover.

## Cost and choice
About 990 frames at about 15 s each is roughly 4 hours. A cheaper alternative is 540x960 at 12 fps (about 2 hours) with the same design. Recommended: 720x1280.

## Look-dev status (stills in `lookdev/v2_*.png`)
Bank, core and tower are recognisable. To fix before the full render: token reads cream instead of amber (tone-map clipping), tower pulse rings blow out, sign text too large on two landmarks, the establishing shot needs to be closer.
