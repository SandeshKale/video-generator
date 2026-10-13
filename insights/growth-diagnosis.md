# Why @sandesh.explains reels aren't growing (diagnosis, 13 Oct 2026)

Data: `insights/ig-posts.json` (Graph API pull, 12 Oct 2026): 21 reels and 7 carousels, 6 followers. The analysis uses the 19 reels older than 2 days.
External sources are listed at the end. Instagram publishes almost no official benchmarks, so the outside numbers are marked with how solid they are.

## The numbers in one table

| Signal (all reels, 6 Sep – 12 Oct) | Value |
|---|---|
| Plays / accounts reached | 3,919 / 3,446 (about 96% non-followers) |
| **Shares** | **0, on every reel** |
| Saves | 11 in total (0–2 per reel) |
| Likes / comments | 41 / 2 (about 1 like per 85 people reached) |
| Followers gained | about 6 in 5 weeks |
| Skipped in the first 3 s | median **75%** (range 59–87%) |
| Average watch | median **4.5 s** |
| Reel length | 60–96 s, so viewers see about 5–8% of each reel |
| Plays per reel | almost all fall between 140 and 290; only one reached 610 |

## What is happening

Instagram shows each new reel to a small test group of non-followers. Here that is about 150–250 people. It then decides whether to widen the audience, using mainly three signals per person reached: watch time, sends (shares in DMs) and likes. Mosseri has said sends count most for reaching non-followers.

Your reels fail that test in the same way every time:
- 3 out of 4 people swipe away within 3 seconds.
- The rest leave around 4–5 seconds.
- Nobody shares, and almost nobody saves or likes.

So every reel stops at the test group. That is why plays sit at a flat ~200 with no breakouts. It is also why reach doesn't track the work put into a reel: the reel with the lowest skip rate didn't reliably get more plays, because no reel came near the level that triggers wider testing.

## Causes, ranked by how much they likely matter

1. **Nothing in the reels gives people a reason to send them (0 shares).** Most reels are AI-company news ("OpenAI just…", "Google just…"). Accounts with millions of followers cover the same story the same day. A viewer gains nothing by sending your version, and has no reason to follow a new account for it. Saves only appeared on how-to style posts. The two newest tutorial reels (Sheets, SynthID) are the right direction, but they don't have data yet.
2. **The hook loses most people before the first idea lands.** A median 75% skip rate is worse than the ~65% reported for small accounts (Socialinsider; vendor data). The first frame is usually a dense designed screen with a headline about a company. It doesn't show a person, or a problem the viewer has.
3. **The reels are far longer than people watch.** They run 60–96 s, while people watch 4.5 s. Industry average watch time is about 8 s (Hootsuite/Later, 2026). Long reels with very low completion send a weak watch-time signal.
4. **There's no face or human voice, and no recognizable series.** Every reel uses a synthetic or cloned voice and a brand-new visual identity, which this repo requires. That keeps quality high, but a viewer who sees three of your reels doesn't recognise them as the same creator. You appear in person only in the end CTA, which 95% of viewers never reach. People follow people and recognisable series.
5. **The profile doesn't turn reach into follows.** About 3,400 people reached produced about 6 followers. Because the account is under 100 followers, Instagram hides audience age, country and active hours. You are effectively posting blind.
6. **Some posts may have been held back.** `reel-ai-roast-me` (7 reached), `reel-openai-agents-escaped` (11) and a post with no caption on 6 Oct (52) got far less than the usual ~150-person test group. **Check Settings → Account Status → "recommendation eligibility"** for flags on those posts. I can't see this through the API.
7. **Smaller hygiene issues:**
   - 9 reels used 30 hashtags. Instagram now caps posts at 5, and hashtags don't widen reach anyway.
   - The 7 carousels reached only 5–9 people each.
   - Most posts went out at about 06:00 IST. Without audience data, we can't tell whether that time is good or bad.

**Probably not the cause:**
- The topic's company: every company tag averages about 1× the median.
- The amount of visual polish.
- Instagram's originality rules: these reels are original work, and the April 2026 update targets reposting accounts.

## What to change (each change is a test with a target)

1. **Hook (target: skip under 55%).** Make the first frame a person or one object, plus 3–5 words about the viewer ("Your boss can't tell this was AI"), with no logo-led headline. Start speaking at 0.0 s. Deliver the first real piece of information by 1.5 s.
2. **Length (target: average watch over 40% of runtime).** Keep reels to 20–35 s, with one idea each. Cut anything after the payoff.
3. **Make it worth sending (target: at least 1 share per 100 reached).** Use tutorials, hacks and "send this to the friend who…" ideas, and drop pure company news. Each reel should leave the viewer with something they can use or forward.
4. **Show yourself and make it a series.** Test 3 reels with your real face and voice talking to the camera for the first 2 seconds, against the motion-graphics format. Keep one fixed opening template and a series name (for example "AI hack #7"), so reels are recognisable. This conflicts with the repo's "new identity every reel" rule, so it's your call: keep variety inside a fixed frame.
5. **Use Trial Reels once eligible.** Post two hook versions of the same reel to non-followers and keep the winner. Third-party sources disagree on the follower minimum, so check in the app.
6. **Hygiene.**
   - Use at most 5 hashtags.
   - Pause carousels.
   - Check Account Status.
   - Fix the bio so it promises one thing (for example "AI hacks you can use today").
   - Get the first 100 followers from outside Instagram (LinkedIn, friends, comments on bigger AI creators' posts) to unlock audience data.
7. **Measure every reel the same way:** skip rate, average watch as a % of length, shares per reach, saves per reach, and follows. Re-run `scripts/ig_insights.py report` 48 h after each post, and change one variable at a time.

## Limits of this analysis

- There are only 19 reels with data, from one snapshot.
- Follows, profile visits and traffic source (Reels tab vs Explore) were missing from the pull.
- Outside benchmarks come mostly from vendors and blogs; only the originality policy and the hashtag cap have primary or near-primary sources.

## Sources
- Mosseri's ranking signals (watch time, sends per reach, likes per reach), via secondary reporting: [Kompozy](https://kompozy.io/news/instagram-mosseri-ranking-signals-guidance), [CreatorFlow](https://creatorflow.so/blog/instagram-algorithm-2026/), [Gyre](https://gyre.pro/blog/instagram-algorithm-updates-and-tips-to-boost-your-visibility)
- Skip rate definition and benchmarks: [Socialinsider](https://www.socialinsider.io/blog/instagram-reels-statistics/), [Retensis](https://retensis.com/blog/instagram-reels-skip-rate-benchmarks-2026), [BabbleBoxx](https://www.babbleboxx.com/post/instagram-adds-reels-retention-skip-rate-what-influencer-marketers-should-do-next)
- Average watch time and engagement: [Influencer Marketing Hub](https://influencermarketinghub.com/Instagram-reels-stats), [Colorlib](https://colorlib.com/wp/instagram-engagement-rate/)
- Reel length: [Klap](https://klap.app/blog/how-long-should-reels-be), [go-viral](https://www.go-viral.app/blog/instagram-reels-length/)
- Originality policy (primary source, 30 Apr 2026): [Instagram Creators blog](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram), [Engadget](https://engadget.com/2160560/instagrams-recommendation-algorithm-will-penalize-unoriginal-photo-and-carousel-posts)
- 5-hashtag cap: [Social Media Today](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/), [Hipertextual](https://hipertextual.com/internet/instagram-limite-cinco-hashtags-publicacion/)
- Trial Reels: [Social Samosa](https://www.socialsamosa.com/news-2/instagram-introduces-wider-access-trial-reels-9493132), [Inro](https://www.inro.social/blog/what-is-a-reel-trial)
- AI content and reach: [Getix Group](https://getixgroup.com/blog/does-ai-content-hurt-social-reach-2026)
