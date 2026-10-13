# Choosing the top 5 hashtags (research + method, 13 Oct 2026)

## What is actually known
| Claim | Source | How solid |
|---|---|---|
| Instagram caps captions at **5 hashtags** (reel or post), replacing a 3-tag test; rolling out gradually since Dec 2025. | [Social Media Today, 18 Dec 2025](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/) (cites a Threads post from @creators) | Solid (reported from Instagram's own post) |
| Instagram's guidance: "fewer (up to 5) more targeted hashtags, rather than many generic ones, can improve both your content's performance." | same | Solid |
| Mosseri (Feb/May 2026): hashtags **don't increase reach**; they are "a great way to let people know what a post is about and connect posts." | same | Solid (quoted) |
| Hashtags are a **classification** signal; hooks, watch time and sends drive distribution. | Several SEO blogs, e.g. [Creatorlane](https://creatorlanehq.com/blog/instagram-5-hashtag-limit-2026), [Foxy](https://foxy.ai/academy/optimal-number-of-hashtags-how-many-should-i-use-on-instagram) | Consistent but unsourced |
| A niche tag with ~50K posts beats a 50M-post generic tag. | [Creatorlane](https://creatorlanehq.com/blog/instagram-5-hashtag-limit-2026) | Blog advice, no data |
| Controlled data on tag size vs reach: **none found**. | search, 13 Oct | Gap |
| Our own history: 30-hashtag reels got 88–287 plays; the best reel (610) had 5 tags; reach did not follow tag count. | `insights/ig-posts.json` | Own data, small sample |

**Conclusion:** hashtags will not rescue a weak hook. Their job is to tell Instagram what the reel is about so the right small test audience gets it. So pick tags that describe the reel precisely, and test them.

## The 5-slot method (one tag per role, no duplicates)
1. **Topic tag:** the subject in the viewer's words (`#ChatGPT`, `#ResumeTips`, `#ScamAlert`). Mid-size, high relevance.
2. **Task/intent tag:** what the viewer will do or learn (`#AIPrompts`, `#AITips`, `#CyberSafety`).
3. **Audience tag:** who it is for (`#JobSearch`, `#Students`, `#Parents`, `#IndianCreators`).
4. **Niche keyword tag:** the most specific phrase in the reel (`#AIWriting`, `#VoiceCloneScam`). This is the one to rotate every reel.
5. **Series tag:** `#UseItToday`, the same on every reel, so Instagram groups the series and viewers can follow it. (Create it by using it; it will be tiny at first, which is fine.)

## Picking each tag (checklist, 10 minutes)
1. Write the reel's one-sentence topic and the 3 words a viewer would type into search for it. Those are your candidates.
2. In the Instagram app, search each candidate with the "#" and look at the post count. Prefer tags in roughly the 20K–2M range for slots 1–4. Avoid tags under ~1K (no audience) or over ~20M (reel is lost). **I cannot see counts from here; this step is done on your phone.**
3. Open the top 9 posts of the tag. If they are unrelated, spammy, or in another language, drop the tag. If they are the same kind of reel as yours, keep it.
4. Drop any tag that is banned, repeated spam, or only loosely related (`#viral`, `#fyp`, `#explore`, `#instagood`). Instagram says generic tags do worse.
5. Make sure the tag's words also appear in your first caption line and on screen. This helps both search and the "Your Algorithm" topic match.
6. Case: use CamelCase (`#AIWriting`) so screen readers read it correctly.

## Test it (so the choice improves)
- Keep a column in `insights/reel-tags.json`: `hashtags: [...]`.
- After 48 h, compare reach per post. Because reach also depends on the hook, only trust a pattern after ≥3 reels share a tag.
- Change one slot (the niche keyword) per reel; keep the series tag fixed.
- Trial Reels (when available) is the best test: same reel, two niche tags.

## Tags for the two reels in progress (to confirm on your phone)
| Reel | Topic | Intent | Audience | Niche | Series |
|---|---|---|---|---|---|
| AI-tells ("These words give your AI writing away") | `#ChatGPT` | `#AIWriting` | `#Writing` | `#WritingTips` | `#UseItToday` |
| Safe word vs voice-clone scams | `#AIScams` | `#CyberSafety` | `#Parents` | `#VoiceCloning` | `#UseItToday` |
Final picks are in each reel's `caption.md`. If a candidate's post count falls outside 20K–2M or its top posts are off-topic, swap it using the checklist above.
