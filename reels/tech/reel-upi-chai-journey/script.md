# Script: "Where did your ₹20 go?" (UPI chai journey) — 60 s, English avatar, FAST (R17)

Folder: `reels/tech/reel-upi-chai-journey/` · Drafted 20 Oct 2026 · Built to the "mom's photo" reference rules (`docs/REFERENCE-REEL-PACKET-JOURNEY.md`).
One sentence: *a ₹20 chai payment is followed from your tap to the green tick, and the ID it carries is what saves you when it gets stuck.* Goal: reach + saves (a "save this" reel for the stuck-payment rule).

## Why this reel
- **Trend hook (primary-source-backed numbers, secondary coverage):** NPCI's September 2026 data, reported by Medianama / Entrackr / StartupTalky: 24.07 billion UPI transactions, **average 802 million a day, first time above 800 million**, ₹29.37 lakh crore total (value −1.5 % m/m, volume +~23 % y/y). Everyone in the audience used UPI today.
- **Relatable:** the viewer owns the object (the ₹20 they just paid), the reference reel's "photo your mom just sent" device.
- **Evidence from our own data (`insights/report.md`, fetched 12 Oct, 8 days old):** only 21 reels, all <1,000 views, so no tag is statistically strong; the top two reels were tutorial/explainer-style (the 610-view agents-cheap-code post, the iPhone-app how-to). Treat as a hint, and fetch fresh Insights before the next reel.
- **Series fit:** `genre=explainer`, `host=avatar`, `voice=avatar`; add to `insights/reel-tags.json` when it ships.

## Benchmark to beat
Previous ceiling: `reel-04-shot-right-now` (particle engine, honest labels, live counters) and the Samantha reel (9 scenes, gavel, cut-out host). This reel must do 3 things neither did:
1. **One continuous diorama and a travelling camera** (the whole reel is one camera move; ≤3 hard cuts) instead of 9 scenes.
2. **A host composited into the world's light** (rim light and amber spill from the packet, CG tags behind and beside), appearing 5 times to signpost, not parked in a corner.
3. **A planted setup paid off late** (the transaction ID, planted at 12 s, saves the day at 52 s) and a **traced single example** (packet "#UPI-…" followed from tap to tick, and once into the failure branch).

## Script (spoken text = avatar prompts, 4 × ~44 words, 175 words, ≈ 59 s at 3 words/s)

| Time | Spoken line | What the viewer sees (event, not drift) | Capture / asset |
|---|---|---|---|
| 0–3 | "You just paid twenty rupees for chai." | Frame 0 is composed: night chai stall, a steaming glass, a phone in a hand with the green "Paid ₹20" tick; top headline **"WHERE DID YOUR ₹20 GO?"** in amber; HUD clock `0.00 s` already running. | Photoreal still of a chai stall (generated or Unsplash) + Blender glass/phone |
| 3–12 | "In the next few seconds that payment crosses four systems, and over eight hundred million UPI payments do the same every day. Let's slow it down and follow yours." | Camera pulls back from the tick into a night-city diorama of four glowing "buildings" (YOUR APP, YOUR BANK, THE SWITCH, SHOP'S BANK); an **800 M / day** counter ticks; a label **"SLOWED 1,000×"**; host appears inside the world, chest-up, gesturing at the four buildings. | Blender diorama, host composite (window 1) |
| 12–15 | "Remember its ID number, because you'll need it at the end." | The ₹20 becomes a small amber **packet** with a tag `ID #…7F3A` (the planted setup); the tag zooms to lens and pins to the HUD corner for the rest of the reel. | Packet sprite + HUD tag |
| 15–30 | "You tap Pay. Your app sends one request: twenty rupees, from you, to the chai wala's QR. It goes to a bank, then to the middle of everything, the NPCI switch. It doesn't hold your money. It only passes messages between banks." | Finger taps; packet leaves the phone along a cyan lane to YOUR BANK building, then to a big roundabout "THE SWITCH" where lanes fan out to many banks; money icons stay parked at banks (the switch has none); each hop prints a short mono line. Host signposts ("middle of everything"). | Blender lanes (cyan), tabler bank icons, window 2 |
| 30–45 | "Message one goes to your bank: take twenty rupees. It checks your balance and your PIN, and says yes. Message two goes to the chai wala's bank: add twenty rupees. Another yes. Both come back the same road, and your phone shows the green tick." | Two packets: a red-edged **DEBIT −₹20** drops into YOUR BANK (balance ticks 150 → 130), a green **CREDIT +₹20** rises into SHOP'S BANK (balance 0 → 20); two "YES" stamps; both fly back along the lane, the stall's phone flips to the green tick; clock stops at ~3 s. | Blender, ledger components, stamps, SFX |
| 45–60 | "But sometimes your bank says yes and the other side never answers. Money gone, nothing paid. That's when you need that ID. Under RBI's rules it must be reversed within five days, or the bank owes you a hundred rupees a day. Save this. Follow Sandesh Explains." | Replay at the credit step: the credit packet stops dead at SHOP'S BANK, a red **"NO REPLY"** stamp, balance stays 130 while shop stays 0; the pinned **ID #…7F3A** flies to the switch and the debit packet **reverses** back to YOUR BANK (130 → 150). Calendar chip **"5 DAYS"**, rule card **"₹100 / DAY"** (labelled "RBI TAT rule, as read 20 Oct"); recap strip lights the four buildings in order; end card: profile photo, **@sandeshexplains**, SAVE + FOLLOW. | Reversal animation, recap bar, end card |

## Fact ledger (tier A = vendor/regulator read first-hand; B = reported secondary; C = not used)

| # | Claim as worded | Tier | Source | Note |
|---|---|---|---|---|
| F1 | UPI averaged ~802 M transactions a day in Sept 2026; 24.07 B for the month | B | Medianama, Entrackr, StartupTalky (NPCI monthly release) | Say "over eight hundred million a day". Re-check on npci.org.in the day of posting. |
| F2 | A payment goes app → bank → NPCI switch → remitter bank debit → beneficiary bank credit → confirmation back | B | m2pfintech / d91labs explainers + NPCI circulars (search 20 Oct) | Simplified to "four systems"; **verify against NPCI's UPI procedural guidelines** before locking the visual labels. |
| F3 | The switch passes messages between banks and doesn't hold customer money | B | same | Wording kept at "doesn't hold your money". Verify. |
| F4 | "A few seconds" end to end | B | Explainers give 2–5 s (not NPCI) | Spoken as "a few seconds"; **do not put an exact on-screen clock** other than labelled "SLOWED 1,000×, illustrative". |
| F5 | Debited but merchant confirmation not received: auto-reversal within T+5 days, ₹100/day compensation after | A | RBI circular on harmonised TAT, Annex sl. no. 4b (read 20 Oct, rbi.org.in `NotificationUser.aspx?Id=11693`) | Also 4a (transfer, beneficiary not credited): T+1, ₹100/day after. **RBI revised this framework in 2021 (Medianama); confirm the current numbers before posting.** If they changed, fix the line and the "5 DAYS" chip. |
| F6 | The ID in the story = UTR / transaction ID | A-ish | Standard UPI receipt field | Show it as "UPI Ref ID / UTR" on screen, not claimed as a secret code. |

Pronunciation and honesty: all labels "ILLUSTRATION · not a real bank screen"; no bank/PSP logos implied as partners (use text chips for NPCI, no brand marks).

## Chain check (explainer rules)
Problem → answer: *how does ₹20 get from me to the stall in seconds?* → request (needs a route) → switch (needs a go-between) → debit + credit (needs both banks to agree) → *what if the second yes never comes?* → reversal rule + the ID. Recap strip visits app, bank, switch, shop's bank, ID and lands on the chai in the opening frame. Plant at 12 s (ID), pay-off at 52 s.

## Asset families (≥ 6; requirement says 5–6)
1. Blender 3D diorama (night city of four buildings, lanes, stall glass) · 2. Photoreal still/Unsplash chai stall (frame 0 and end) · 3. Packet particle system (Canvas2D, pure of `t`) · 4. Ledger/stamp/HUD SVG components (balance tickers, stamps, calendar chip, rule card) · 5. tabler icons (bank, shield, clock) + text chips · 6. Avatar host composite (cut-out, rim/spill graded to the scene) · 7. Real-footage overlay (dust-particles.webm, low) · 8. Kinetic captions (condensed, accent word amber, no pill) · 9. Synth score + CC0 UI SFX peak-aligned. **Families used: 9.** No scene is photo+panel+text only; the camera is continuous.

## Look (own identity, decide before mockup; do not reuse prior palettes)
Night-bazaar indigo `#0b1030` ground (not navy-cyan of reel-04) with **chai amber `#ffb03a` = the packet/money**, **UPI-lane teal-mint `#2de2c0` = infrastructure/lanes**, **stamp red `#ff3b4e` = loss/no reply**, paper cream `#f3ead6` for receipts. Display: **Rubik Mono One** or **Bowlby One** (new vendor needed; not Bebas/Anton/Bricolage) + **Inter** + **IBM Plex Mono**; cover in Anton on amber. Component language: round-cornered receipt slips with perforated edges and chai-glass circles (not clip-corner panels, tiles or tickets). Texture: slow steam wisps and city bokeh; HUD clock top right with a location tag top left ("YOUR PHONE → YOUR BANK → …").

## Host performance track (rules R6/R7/R10/R18)
Hook 0–3 s bright, dead-on camera; brow lift on "four systems"; nod on "remember its ID"; steady and explanatory 15–30; faint smile on "green tick"; **serious, no smile at 45 s "money gone"**; faint smile only on the CTA. Host windows (chest-up, inside the scene light): 3–12, 14–17, 22–28, 45–50, 56–60 (~20 % of runtime). Room above the head in the avatar crop for the world to sit behind.

## Voice
Avatar clips (creator's AI avatar) in FAST mode R17 per standing request; words timed from Whisper (`avatar/words.json`). The reference reel runs ~2.7 w/s; this one targets ~3.0 w/s. If the avatar tool cuts a sentence, shorten the line (don't speed up). Not auditioned by ear.

## QA plan
`check.mjs` + `scripts/change-cadence.mjs` (0 stretches over 2 s) + mute test with a fresh agent + contact sheets at entrance +0.7 s / mid / end + frames inside every cut + host-crop frame diff on the MP4 + mix report (voice over music ≥ 19 dB median, ≥ 13 dB min).

## Caption draft (to finalise after build)
Line 1: "Comment UPI and I'll send the 5-step 'stuck payment' checklist." · Body: the journey in prose with the figures (F1, F5 with "check the RBI circular for the current numbers") · Avatar disclosure line · sources · 5 hashtags: `#UPI #DidYouKnow #TechExplained #DigitalPayments #SandeshExplains`.

## Open decisions for the creator
1. India-only audience is assumed (UPI). If much of the audience is outside India, swap to a neutral "tap to pay" story, but UPI is the trend.
2. Runtime: this is a 60 s cut as asked; the reference rule favours a 90–120 s continuous-camera version. A 60 s build is feasible by keeping one camera path and 3 host windows.
3. Confirm the RBI turnaround figures are still current (flag F5) before I record or lock the on-screen chip.
