# Artemis II "ten seconds" — fact + footage ledger (read 22 Nov 2026). Tier A = NASA page read first-hand, B = press (AP via search results), C = not voiced.

## Facts
| Claim (as voiced) | Tier | Source / note |
|---|---|---|
| Artemis II launched **1 April 2026**; splashdown **10 April 2026** | A | nasa.gov/mission/artemis-ii ("Launched April 1, 2026", "splashdown April 10, 2026") |
| Mission length **9 days, 1 hour, 32 minutes** | A | same page |
| Liftoff about **18:35 EDT (22:35 UTC)** | B+ (derived) | burned-in clock on NASA's Orion exterior-camera clip reads 04/01/26 22:37:22 about 30 s after liftoff; a NASA statement of the time was **not found** → say "shaam saade chhe baje (EDT)" only after a NASA/AP check |
| Four crew (names not shown or spoken) | A | nasa.gov/feature/our-artemis-crew. **NASA's media page says current astronauts' names/likenesses must not be used in commercial material** → the reel shows no crew faces or names |
| Farthest from Earth any humans have been: **about 252,750 miles (≈ 4.07 lakh km)**, beating Apollo 13 (1970) | B | AP reports (Inquirer/OPB/WTTW, 10 Apr 2026); two AP texts differ by 4 miles (252,752 vs 252,756) → voiced "kareeb 4 lakh 7 hazaar km"; **NASA's own number not found** |
| Lunar flyby 6 April 2026; a solar eclipse seen from Orion | B | AP; NASA clip titles "Solar Eclipse Captured by Orion During Artemis II Lunar Flyby" (6 Apr) |
| Splashdown **off San Diego, Pacific**, about 8:07 pm ET, Mach ~33 entry | B (AP); location A as plan | AP; NASA crew page says planned off San Diego |
| Orion did not land; it looped the Moon on a figure-eight | A | nasa.gov crew page (figure-eight, planned 230,000+ miles, 4,600 miles beyond the Moon at max distance) |
| **Artemis III: crewed, LAUNCH 2027, in low Earth orbit, rendezvous and docking tests with one or both landers, no Moon trip** | A | nasa.gov/mission/artemis-iii (page last updated 19 Oct 2026) |
| **Artemis IV: crewed surface landing, early 2028, two crew near the south pole for about a week** | A | nasa.gov/mission/artemis-iv (updated 16 Mar 2026) |
| Artemis III reported slipping to late 2027; lander readiness risk (NASA OIG) | B | IFLScience (May 2026), CSIS, The Register → voiced as "dates badal sakti hain" only |
| Technical glitches (water valve, toilet) | B | AP; **not used** (off-story) |
| "Pachaas saal se zyada" since the last crewed Moon trip | common knowledge (Apollo 17, Dec 1972) | verify wording before voicing |

## Footage (NASA Image and Video Library API: `images-api.nasa.gov/search`, assets at `images-assets.nasa.gov/video/<id>/<id>~{orig,large,medium,small,mobile}.mp4`, follow the http→https 301)
Reachable and downloadable from this sandbox (medium = 1080p h264; e.g. the balcony clip is 115 MB for 388 s). Real multi-camera footage of the **same launch**:
| Clip (NASA id prefix) | Length | Notes |
|---|---|---|
| KSC ART II Cause Way Launch low / high angle | 8:47 / 9:34, 4K 30p | **slow-motion** playback of liftoff (ignition at ≈ 30 s in the file); style needs real-speed → label "SLOW-MO" or skip |
| KSC-04012026-C4829 (OSB II balcony, "Slo Mo") | 6:28, 4K 60p | slow-motion; pad + plume |
| art002m1200912222_Liftoff_1 (Orion exterior camera) | 0:54, 4K 60p | **burned-in UTC clock**; pad falls away; no audio |
| …ISO_Flag_Shot / ISO_VAB_Roof / ISO_Drone (+ Crowd, Banana Creek reaction, ML PAO PTZ) | 0:44-4:01, 4K 60p | **isolated live feeds, real time**; the flag shot has a burned-in mission elapsed timer (+00:00:46 at the frame I sampled) → usable for sync, then crop/delogo |
| WB-57 aircraft (Visible / SEO / Raw downlink) | 8-11 min, 1080p | aerial tracking of the ascent |
| Artemis II Live Launch Coverage 4K / 1080p parts | long | **has NASA commentary audio with the countdown calls** (not yet checked); the ISO feeds above are "[no sound]" per their SRT |
| Splashdown: Orion camera chutes → splashdown (GP011149), MWIR and GSS views, "A2 chutes to splashdown" | 10 Apr | real splashdown footage |
| Solar eclipse from Orion (art002m1200970119 / art002m1010962338_A), Flight Day 6 highlights (flyby) | 6-7 Apr | the far-side flyby |
**Rights:** NASA says its content "generally" is not subject to copyright but it must be acknowledged as the source, must not convey NASA endorsement, the NASA insignia/logotype are not public domain (crop or avoid, never show), media with identifiable people may need permission, and imagery "can be generally used editorially within published works that are not promotional in nature" (nasa.gov/nasa-brand-center/images-and-media, read 22 Nov). Also: no "according to NASA" phrasing in AI-generated products per that page's SI section — **our voice is a clone of the creator and the facts are attributed to the page**, so phrase as "NASA ke page ke mutabik" only for tier-A items and decide with the creator.
