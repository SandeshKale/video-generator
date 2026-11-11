# LinkedIn copy: "One fibre cut. 25+ products hit." (vertical 4:5 GIF `blast-radius.gif`, 1080×1350, 20 s loop, 200 frames, 2.6 MB)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post. Links go in the first comment, not the body.
Facts read 11 Nov 2026 from Google Cloud's status incident report and the Google SRE book (tier A). Re-check the incident page before posting if it matters to you: Google says its remediation items are "actively being finalized".

## Post (recommended)

One planned fibre job. 25+ Google Cloud products hit.
No attack. On 20 Aug 2026 scheduled maintenance cut network capacity between two data centres in us-west1, and the failure did not stay where it started.

Follow the GIF, step by step:

1. Maintenance. One fibre path goes down, so capacity between campuses drops.
2. Reroute fails. In Google's words, "automated rerouting mechanisms failed to properly redistribute traffic to alternate capacity".
3. Congestion. Traffic exceeds the bandwidth that is left: packet loss, throttling, latency.
4. Timeouts become retries. Latency spikes in core infrastructure "cascaded into timeouts and elevated error rates", and the report names "cascading retries". Every layer that retries multiplies the load (the SRE book's example: 3 layers × 4 attempts = 64 attempts on one database).
5. Mitigate. Google drained traffic, restored the fibre, then brought traffic back "through controlled validation stages".
6. Split the tower. Cells and bulkheads are the general design lesson here (my framing, not Google's words): a failure in one cell should not climb into the next.

The rules I'd screenshot:
- Redundant circuit before any maintenance (Google's stated fix)
- Failover that survives sudden capacity loss (Google's stated fix)
- Bring traffic back in validated stages (what they did)
- Cap retries: one retrying layer, a budget, jitter (SRE book)

Other regions were unaffected, so the isolation between regions held. The blast radius that mattered was inside the region.

Which of your dependencies would turn a small capacity loss into a retry storm?

#SystemDesign #SoftwareArchitecture #SRE #CloudComputing #Resilience #GoogleCloud

## Shorter version

One planned fibre job. 25+ Google Cloud products hit.

On 20 Aug 2026 maintenance cut capacity between data centres in us-west1. Rerouting failed, congestion became timeouts, timeouts became retries, and every retrying layer multiplied the load. Other regions were fine; the blast radius was inside the region.

Four rules to steal: redundant circuit before maintenance, failover that survives capacity loss, return traffic in validated stages, cap retries (one layer, a budget, jitter).

Which of your dependencies turns a small capacity loss into a retry storm?

#SystemDesign #SoftwareArchitecture #SRE #Resilience

## First comment (sources, how to read, caveats)

Sources:
- Google Cloud status, incident report for 20 Aug 2026 (us-west1): https://status.cloud.google.com/incidents/utF3FMFdQfwBzJcGG6vf (quotes in the GIF are from this page; it is the preliminary report of 24 Aug and the full report of 27 Aug)
- Google SRE book, "Addressing Cascading Failures" (retry amplification, 3 layers × 4 attempts = 64, randomized exponential backoff, retry budgets): https://sre.google/sre-book/addressing-cascading-failures/
- Related, same month: GitHub's "The August 17 outage, and the work ahead" (7 h 47 m; a client-side retry loop increased traffic during recovery): https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/

How to read it:
- Cyan = healthy, orange = stressed or retrying, red = failing, mint = recovered or fixed. The tiles are products named in the report (I count 27; "25+" is the safe round number).
- The capacity bar, the latency curve and the clock are illustrative. The report gives no percentages, and its time window differs between the page header (08:40–12:20 PDT) and the report text (08:00–10:22 PDT). The GIF uses the report text, compressed.
- ×64 is the SRE book's worked example, not a Google measurement of this incident.
- Rules 1, 2 are Google's stated remediation (still being finalised); rule 3 is what the report says they did; rule 4 is SRE-book advice, not something Google said about this incident.

## Alt text (Google/LinkedIn limit 1000 characters; this is 775)

Vertical animated architecture diagram titled 'One fibre cut. 25+ products hit.' Two three-floor towers, Campus A and Campus B, stand on a rose-pink grid, joined at the bottom by a fibre bridge with two cables. Step by step: one cable is cut for maintenance and an inter-campus capacity bar drops; arrows try to reroute to an 'ALT CAPACITY' box and bounce off; packets pile up and turn orange then red as latency climbs; tiles floor by floor turn red while orange retry dots split and multiply, and an 'attempts per click' counter climbs to x64; other regions stay green. Traffic is then drained and the cable restored. Finally the towers split apart with bulkhead walls and a checklist of four rules lights up. Quotes come from Google Cloud's incident report of 20 Aug 2026.
