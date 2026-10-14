# Task brief for Grok: pull @sandesh_explains performance data for the next-reel decision

You are helping Sandesh (Instagram **@sandesh_explains**, an AI/tech explainer channel) collect the data that decides which reel gets made next. Another assistant (Claude, working in the GitHub repo `sandeshkale/video-generator`) will analyse what you produce with `scripts/ig_insights.py`. Your job is **collection only**: gather accurate numbers, in the exact formats below, and return three files.

Work carefully. A wrong number is worse than a missing one: if you cannot read a value, leave it `null` and say so in the notes. Do not estimate, round up, or fill gaps with typical values.

---

## 0. Ground rules (read first, they override everything else)

1. **Read-only.** Never post, like, comment, follow, unfollow, DM, edit captions, boost, or change any setting on the account.
2. **Credentials.** Never ask Sandesh for his Instagram password, and never put a password, session file, cookie, or token into any output file or message. If a step needs login, Sandesh does it himself on his own device; you only read what he shows or exports.
3. **No other accounts' private data.** Section D reads public X/Instagram posts only, for topic trends. Do not scrape follower lists or anything behind a login.
4. **Rate limits.** If Instagram answers `429 Too Many Requests` or asks to log in, **stop** that method and move to the next one. Do not retry in a loop.
5. **Timezone.** Store all timestamps in **UTC ISO 8601** (`2026-10-12T03:00:00+00:00`). Sandesh posts at 11:00 and 20:30 Singapore time (UTC+8).

---

## A. Per-post public stats (required) → `ig-posts.json`

Collect **every post from the last 90 days** (or the last 80 posts, whichever is more), newest first. Reels are what matter most, but include carousels and photos too and mark them with `is_video: false`.

### Method 1 (preferred): instaloader on Sandesh's own computer
Sandesh runs this in a terminal; the password is typed into instaloader locally and never shared:
```bash
pip install instaloader
instaloader --login sandesh.explains
# clone the repo or download scripts/ig_insights.py from github.com/sandeshkale/video-generator, then:
python3 scripts/ig_insights.py fetch --login sandesh.explains --limit 120
```
This writes `insights/ig-posts.json` in the right format automatically. If it works, go straight to section B and **add** the Insights fields to that file.

### Method 2: Instagram Professional Dashboard (no code)
If Method 1 fails: in the Instagram app → Professional dashboard → Content you shared → filter **Reels**, last 90 days. For each reel, open **View insights** and copy the values into the schema below. Copy the caption's first 2–3 lines exactly (they are used to match the post to its folder in the repo).

### Method 3: Meta Graph API
Only if Sandesh has a Facebook-linked Business/Creator account and a token he generated himself. Endpoint: `GET /{ig-user-id}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink` and `GET /{media-id}/insights?metric=reach,saved,shares,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time,views,follows`. Do not write the token anywhere.

### Exact schema (must match; the analysis script reads these keys)
```json
{
  "fetched_utc": "2026-10-13T02:00:00+00:00",
  "followers": 1234,
  "posts_total": 61,
  "source": "instaloader | dashboard | graph-api",
  "posts": [
    {
      "shortcode": "DAbc123XyZ",
      "permalink": "https://www.instagram.com/reel/DAbc123XyZ/",
      "date_utc": "2026-10-12T03:00:00+00:00",
      "is_video": true,
      "typename": "GraphVideo",
      "likes": 210,
      "comments": 14,
      "views": null,
      "plays": 8450,
      "duration_s": 73.0,
      "caption": "Full caption text exactly as posted (at least the first 300 characters)",
      "hashtags": ["ClaudeAI", "AITips"],
      "insights": {
        "reach": 6900,
        "views_followers_pct": 0.18,
        "saves": 41,
        "shares": 23,
        "follows": 9,
        "profile_visits": 37,
        "avg_watch_s": 14.2,
        "watch_time_total_s": 99800,
        "skip_rate": 0.52,
        "replays": 610,
        "top_source": "Reels tab"
      }
    }
  ]
}
```
Field notes:
- `plays` = the **Views** number Instagram shows on the reel (since 2025 Instagram calls plays "Views"). Put it in `plays`; leave `views` `null` unless the source gives a separate value.
- `skip_rate` = the reel's **Skip rate** in Insights (share of viewers who scrolled past within the first 3 seconds), as a fraction 0–1 (52% → `0.52`). If Insights shows only a retention graph, read the % still watching at 3 s and store `skip_rate = 1 − that`.
- `views_followers_pct` = share of views from followers (Insights shows "Followers / Non-followers"), as a fraction.
- `top_source` = where most views came from (Reels tab, Explore, Profile, Feed, Stories, Other).
- Omit the whole `insights` object for a post if you have none of its values; never invent them.

---

## B. Per-reel Insights (required for reels; this is the most valuable data)

For **every reel** from section A, open View insights and fill the `insights` object above. Priority order if time is short:
1. `saves`, `shares`, `reach`: the strongest signal of a topic people value.
2. `skip_rate` and `avg_watch_s`: whether the first 3 seconds and the pacing work.
3. `follows`: whether the reel converts viewers into followers.
4. Everything else.

Also record, for each reel, anything the Insights screen shows that is not in the schema, under `"insights": {"extra": {...}}` (for example `"retention_curve_pct": [100, 61, 48, ...]` read at 0/3/6/9… seconds if visible).

---

## C. Audience and timing (required) → `audience.json`

From Professional dashboard → Total followers / Audience (last 30 days):
```json
{
  "captured_utc": "2026-10-13T02:00:00+00:00",
  "followers": 1234,
  "follower_growth_30d": 87,
  "top_countries": [["India", 0.61], ["United States", 0.09]],
  "top_cities": [["Mumbai", 0.12], ["Pune", 0.08]],
  "age_ranges": {"18-24": 0.31, "25-34": 0.44, "35-44": 0.15, "45-54": 0.06, "55+": 0.04},
  "gender": {"men": 0.78, "women": 0.21},
  "most_active_times_local": {"Mon": ["12:00", "21:00"], "Tue": ["12:00", "21:00"]},
  "most_active_times_timezone": "the timezone the app shows these in",
  "accounts_reached_30d": 54000,
  "non_follower_reach_pct_30d": 0.83
}
```
Use fractions (61% → 0.61). Copy the timezone label exactly as the app shows it.

---

## D. Topic trend scan on X (you have native X access; please use it) → `trends.md`

Goal: candidate topics for the next reel that an **AI/tech explainer for a mostly Indian, 18–34 audience** could cover well in 60–75 seconds.

1. Search X for posts from the **last 7 days** about AI products, models, agents, AI tools for work, AI news from OpenAI, Anthropic/Claude, Google/Gemini, Meta, xAI/Grok, Apple, Microsoft, Nvidia, robotics, and AI policy, especially India-relevant AI news.
2. List **10–15 candidate topics**. For each give:
   - one-line topic and the **date** it broke;
   - **2–3 links to primary sources** (company blog, official docs, filings, the original X post from the company or researcher), not aggregator threads;
   - the hard numbers available (prices, dates, percentages, benchmarks), each with the link it came from;
   - an engagement signal from X (views/likes/reposts of the top post you found, with its link);
   - type: `news`, `tutorial / how-to`, or `explainer`;
   - why it would work as a reel (one sentence) and any risk (rumour, single source, sensitive).
3. Mark anything that is a rumour or comes from a single unverified source as **UNVERIFIED**. Do not present claims as facts that the sources do not state.
4. Also list **5 high-performing AI reels/shorts from other creators this month** (public posts only): link, view count shown, topic, hook line (first sentence), length. This is for hook patterns, not for copying.

---

## E. What to return

Return three files with exactly these names (or paste their contents in one message, each in its own code block):
1. `ig-posts.json` (sections A + B)
2. `audience.json` (section C)
3. `trends.md` (section D)

Then add a short **notes** section in your reply:
- which method you used for A (1, 2 or 3) and the capture time;
- any post you could not match, read, or open, and why;
- any number you were unsure of (and left `null`).

### Self-check before returning (please actually do these)
- [ ] Every post has `shortcode`, `date_utc` (UTC, ISO 8601), `likes`, `comments`, and for reels `plays`.
- [ ] Percentages are fractions between 0 and 1, not 52 or "52%".
- [ ] `skip_rate`, `views_followers_pct`, `age_ranges` and `top_countries` values are fractions.
- [ ] No password, cookie, session ID or token appears anywhere.
- [ ] Captions are copied exactly, not paraphrased.
- [ ] `ig-posts.json` is valid JSON (paste it into any JSON validator, or run `python3 -m json.tool ig-posts.json`).
- [ ] Every trend in `trends.md` has at least one primary-source link and a date.

---

## F. For Sandesh: after Grok returns the files

Put `ig-posts.json` and `audience.json` into `insights/` and `trends.md` into `insights/` (or just paste them to Claude). Claude then runs:
```bash
python3 scripts/ig_insights.py report     # → insights/report.md
```
and picks the next reel using the standing rule in `CLAUDE.md`: proven tags first (≥3 reels, ≥1.2× median views, strong saves+shares per reach, low skip rate), then the freshest well-sourced topic from `trends.md` that fits them, with a "Why this reel" block in its `script.md`.
