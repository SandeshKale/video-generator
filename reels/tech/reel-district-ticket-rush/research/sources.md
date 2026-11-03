# Sources read on 3 Nov 2026 (tier A = primary/vendor page fetched; B = reputable secondary; C = unverified, never on screen)

## The news (Samay Raina Live 2026-27)
- eventfaqs 30 Sep 2026: pre-sale exclusive to fans registered via the District app or Samay's website; "sold over 1 lakh tickets in under an hour"; eight shows added (Mumbai, Delhi, Bengaluru, Pune); the added Pune show sold out shortly after going live; "11 sold-out shows". No quotes, venues or prices. (B, unnamed reports)
- Hans India 4 Oct 2026: same figures, 48-hour exclusive pre-sale 28-30 Sep, no named source. (B)
- Siasat (queue): Samay's Instagram story showed the Mumbai booking page with **12,569 fans ahead, estimated wait ~10 minutes**, caption "Wild numbers on pre sale"; he told registered fans to check **WhatsApp for the booking link**. The article says the count is people waiting, not confirmed sales; no crash or glitch is mentioned. (B)
- Siasat (earnings): "about two lakh tickets" and "Rs 40 crore" in a day come from an unnamed social post and are **independently unverified**; nothing confirmed by organisers or the platform. (C: not used)
- Curly Tales 23 Sep 2026: pre-sale registration closes Sun 27 Sep 11 PM; pre-sale Mon 28 Sep 2 PM to Wed 30 Sep 2 PM; general sale 30 Sep 2:30 PM (NewsX/eventfaqs list 7:30 PM, so the time changed or is reported inconsistently: say "30 September", not a clock time). (B)
- NewsX: shows (Delhi Yashobhoomi 28-29 Nov 2026 ... Mumbai Dome SVP 2-11 Apr 2027); prices "around Rs 999" up; District is the "exclusive ticketing platform". (B)
- Storyboard18 1 Oct 2026: Delhi price ladder Rs 1,299 (balcony) to Rs 6,499 (Crystal); buyers can reserve certain tickets by paying **50% upfront and the balance later**; commercial terms not public; no tech details. (B)
- District = Zomato's (now Eternal's) app built on the Paytm Insider/TicketNew business bought for Rs 2,048 crore, completed 28 Aug 2024 (Business Standard / Outlook Business / Free Press Journal, 2024). (B)
- BookMyShow listed Samay's 2025 Delhi "Unfiltered" shows and cancelled them (Republic, Daily Jagran): **not this tour**. The tour is on District.

## Design mechanics (vendor docs)
- Cloudflare Waiting Room (developers.cloudflare.com, fetched): when traffic reaches thresholds ("Total active users", "New users per minute") visitors are held in a queue; FIFO "orders visitors according to when they entered the waiting room"; each user gets a cookie with "a timestamp of when their request first hit an actively queueing waiting room", used "to order visitors and provide the estimated wait time". (A)
- Redis SET (redis.io, fetched): `NX` "only set the key if it does not already exist"; `EX` sets expiry; "`SET resource-name anystring NX EX max-lock-time` is a simple way to implement a locking system"; "the lock will be auto-released after the expire time"; unlock with a script that deletes only if the stored random token matches; the page says this simple pattern is **discouraged in favour of Redlock** for fault tolerance. (A)
- Stripe idempotent requests (docs.stripe.com, fetched): same Idempotency-Key => same saved response, "including 500 errors"; keys up to 255 characters; pruned after at least 24 hours. (A)
- Ticketmaster / Taylor Swift Eras Tour presale (Senate Judiciary, 24 Jan 2023; Berchtold's written testimony as reported by Guardian/Fox Business/Gizmodo): "three times the amount of bot traffic than we had ever experienced"; bots attacked the access-code servers for the first time in 400 Verified Fan sales; "in hindsight ... staggering the sales over a longer period of time". (B). The "14 million users / 3.5 million" figures were NOT confirmed: not used.
- Generic ticketing design write-ups (hold 5-10 minutes, Redis hot path, SQL source of truth, virtual waiting room as shock absorber): third-party, **no BookMyShow/District disclosure**: used only as "how such systems are commonly built". (C/B)

## Arithmetic (derived, labelled as such on screen)
- 1,00,000 tickets / 3,600 s = 27.8 tickets per second on average (reported figure, upper bound on time).
- 12,569 people / ~600 s = ~21 people admitted per second (rough, from one screenshot's own estimate).
- Pre-sale window 28 Sep 2 PM to 30 Sep 2 PM = 48 hours.
