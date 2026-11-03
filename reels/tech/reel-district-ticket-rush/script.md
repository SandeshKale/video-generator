# "12,569 log aapke aage the" — how a ticket sale for one lakh people works (Hinglish explainer, no length cap, draft v1, 3 Nov 2026)

Status: **facts + script + storyboard for approval (nothing built).** Method: `docs/STORYTELLING-GUIDE.md`, `docs/QUALITY-FLOOR.md` (NavIC v4 = floor), "expert sketcher" rule, 2-second rule off, length uncapped (creator, 3 Nov 2026). Sources and tiers: `research/sources.md`.

## 0. What the news is (and what it is not)
- **Samay Raina Live 2026-27**, tickets on **District** (Zomato/Eternal's app, built on Paytm Insider; **not BookMyShow**: BookMyShow only appears in the 2025 story where his Delhi "Unfiltered" shows were cancelled).
- Timeline (B): registration closes Sun 27 Sep 11 PM → **48-hour pre-sale** Mon 28 Sep 2 PM to Wed 30 Sep 2 PM, only for fans registered on the District app or Samay's site → general sale 30 Sep.
- Reported: **"over 1 lakh tickets in under an hour"** (several outlets, same wording, no official statement) · 8 shows added (Mumbai, Delhi, Bengaluru, Pune) · 11 shows reported sold out.
- Observed on screen: Samay's Instagram story of the Mumbai booking page: **"12,569 fans ahead, about 10 minutes"** ("Wild numbers on pre sale"); fans were told to check **WhatsApp for the booking link**. Also: Delhi prices Rs 1,299 to Rs 6,499; a **pay-50%-now** reserve option (Storyboard18).
- **Unverified, never used:** "2 lakh tickets / Rs 40 crore in a day" (unnamed social post). **Not public:** District's architecture, queue vendor, hold timer.
**Honesty frame for the whole reel:** *what we can see* (registration, WhatsApp link, queue screenshot, 50% option) vs *how such systems are commonly built* (vendor docs: Cloudflare Waiting Room, Redis lock, Stripe idempotency). The reel says so on screen and in the voice.

## 1. Why this reel (evidence block)
- `insights/report.md` (12 Oct) and `ig-posts.json` (21 Oct) are 13-22 days old, 6 followers: too thin to decide. Pick rests on: the creator's request (fresh news, a name the audience knows), the storytelling filter below, and a send-bait line ("send it to the friend who says the app crashed").
- Instagram does not penalise length (Mosseri via Social Media Today); sends and watch time widen reach. The ladder below keeps a new question open at every rung so a 3-minute runtime is earned.

## 2. Benchmark to beat (previous high = `reel-navic-clock-saga` v4)
NavIC v4: continuous 3D world, sketch-order explainer scenes, 3D labels, two lints at 0. This reel must beat it on:
1. **A through-line object that travels the whole pipeline**: one glowing *ticket token* follows registration → queue → gate → seat hold → payment → confirmed, camera tracking it (the trading reel's cable idea, now a 3D follow-cam; NavIC had separate sets).
2. **Crowd-scale, deterministic simulation**: 1,00,000 instanced dots stampeding vs flowing in a line, as a pure function of `t` (NavIC's objects were tens, not 100k).
3. **A live system dashboard as a world object** (in queue / admitted per second / seats held / sold) that updates through every step, so the viewer sees the mechanism's numbers move.
4. **A real-looking terminal pane** (rule 4 of the trading standard) with the actual Redis command and its two outcomes `OK` / `(nil)`, labelled ILLUSTRATIVE, typed in the world beside the seat map.
5. **Seat map as a state machine** (free → held → sold, contested flash, hold timer ring) with real seat geometry (an arena bowl, instanced).
6. A **purpose-built cover and caption finished before the render**, and lints `overlay-lint` + `label-lint` at 0.

## 3. Story line (guide §2.1)
- **Protagonist:** your tap on "Book" (the viewer's own phone with the queue number), followed as one ticket token.
- **Want:** a seat; the system's want: not to fall over and never sell one seat twice.
- **Obstacle:** one lakh people hit the same seats at the same moment.
- **Carried question (second ~10):** "Ek lakh log ek saath aaye, to app crash kyun nahi hui, aur ek seat do logon ko kyun nahi mili?"
- **Reversal:** the 12,569 queue is not the system failing; it **is** the system working. And 1 lakh/hour is only ~28 tickets a second: speed was never the problem, the stampede was.
- **Honest ending:** District has not published its design; here is what is visible and what is standard.
- **One-sentence story test:** *One lakh people wanted the same seats at once, but a server cannot serve a stampede, therefore the sale was spread out and the crowd turned into a line, but inside the gate two people still pick one seat, therefore a seat is held for one person with a timer, but money can fail and retry, therefore every payment carries a key, so when you see "12,569 ahead" the system is protecting your seat.*

## 4. Beat sheet (But / Therefore; every rung ends on the next problem)
| # | Beat | Voice ids | Connector | Fact (tier) | World picture (sketch order) | Loop |
|---|---|---|---|---|---|---|
| 1 | Hook | h1-h3 | – | 1 lakh in <1 h (B), 12,569 ahead (B) | frame 0: the viewer's phone, "Aapke aage 12,569 log", tick of the timer; camera pushes through the screen into the ticket token | opens L1 crash?, L2 same seat? |
| 2 | The number that surprises | n1-n3 | but | 1,00,000 / 3,600 = ~28 per second (derived) | a flat "28/s" line vs a spike; the dashboard appears; 1 lakh dots at the gate: the stampede | opens L3 promise ("5 steps; the third is the cleverest") |
| 3 | Step 1: spread the crowd | s1a-s1c | therefore | registration 27 Sep 11 PM, 48 h pre-sale, WhatsApp link (B); Ticketmaster "stagger the sales" (B) | the stampede splits into lanes on a 48-hour ruler; each fan gets an invite token (WhatsApp bubble) | – |
| 4 | but: still a spike at open | q1 | but | – | at 2 PM the invited crowd arrives together: the lane bunches at the gate | opens L4 |
| 5 | Step 2: the waiting room | q2-q5 | therefore | Cloudflare docs: FIFO by cookie timestamp, estimated wait (A); 12,569 / 600 s = ~21 per second (derived) | a serpentine line, numbers on people; a valve at the gate admitting ~21/s; the phone's "12,569 ahead" is the line's length; reversal said aloud | closes L1 (crash) |
| 6 | but: inside, two people, one seat | t1 | but | – | at the gate two tokens reach the same seat on the arena map | |
| 7 | Step 3: the seat hold | t2-t4 | therefore | Redis SET NX EX (A), "auto-released after the expire time" (A) | the terminal pane: first `SET seat:B14 you NX EX 300` returns OK, second returns (nil); the seat turns amber with a timer ring; on expiry it flips back to free | closes L2 (same seat); L5: "paisa?" |
| 8 | but: money fails and retries | p1 | but | – | the payment counter: the connection drops, the user taps twice; two receipts appear | |
| 9 | Step 4: one key, one charge | p2-p4 | therefore | Stripe idempotency: same key = same saved response, 255 chars, 24 h (A); 50% reserve (B) | each receipt carries a key stamp; the second lands on the same receipt; the seat turns green only after payment confirms; half-paid is a visible state | closes L5 |
| 10 | but: the edges | e1-e2 | but | Ticketmaster: "three times the bot traffic", bots hit the access-code servers (B) | red squares at the gate; the invite token = the only door; rate limits as a narrow gate | |
| 11 | Honest limit | r1 | – | District's design is not public; 2 lakh / Rs 40 crore unverified | a split card: "WE CAN SEE" vs "COMMONLY BUILT", the unverified claim struck off | |
| 12 | Reframe + CTA | r2 cta | – | – | back to the phone: "Aapke aage 12,569" now reads as a seat being protected; the token lands on a seat: green ticket; end card | closes L3 |

**Open-loop ledger:** L1 crash? (0-10 → ~100) · L2 same seat? (10 → ~150) · L3 "five steps, the third is cleverest" (25 → seat hold ~150) · L4 "still a spike" (60 → ~80) · L5 money (140 → ~175). After second 12 at least two loops are live throughout; none open > 45 s without a visible step.
**Light moment:** "BookMyShow nahi, District" and the friend who always says "app crash ho gayi". **Human detail:** the viewer's own queue number. **Honest moment:** "District ne apna design nahi bataya."

## 5. Voice-over (Roman Hinglish master; TTS text later in Devanagari with numbers spelled as spoken)
| id | Line | Beat |
|---|---|---|
| h1 | Samay Raina ke tickets ek ghante se kam mein ek lakh se zyada bik gaye, District app pe, BookMyShow pe nahi. | hook |
| h2 | Aur Samay ne screenshot dala: aapke aage baarah hazaar paanch sau unsath log. Intezaar, lagbhag das minute. | hook |
| h3 | Yeh crash nahi tha. Yeh system design tha. Toh ek lakh log ek saath aaye, app tooti kyun nahi? Aur ek seat do logon ko kaise nahi mili? | hook |
| n1 | Pehle ek chhota math. Ek lakh tickets, ek ghanta. Yaani lagbhag atthais tickets har second. | number |
| n2 | Atthais per second? Itna toh ek chhota server bhi sambhal le. To dikkat kahan thi? | number |
| n3 | Dikkat bechne mein nahi thi, dikkat thi sabka ek saath, ek hi pal, ek hi seat ke liye aana. Isko solve karne ke paanch tareeke hain. Teesra sabse hoshiyaar hai. | number |
| s1a | Pehla tareeka: bheed ko ek saath aane hi mat do. Registration pehle: 27 September raat gyarah baje tak. | step 1 |
| s1b | Phir pre-sale, poore achhatees ghante, aur woh bhi sirf registered logon ke liye. Booking ka link? WhatsApp pe. | step 1 |
| s1c | Taylor Swift ke tickets pe Ticketmaster ne khud maana tha: sale ko lambe time mein baantna chahiye tha. | step 1 |
| q1 | Par pre-sale khulte hi, jo aaye, woh ek saath aaye. To doosra tareeka: virtual waiting room. | but + step 2 |
| q2 | Aap booking page pe nahi, ek line mein ho. Aapko number mila: aapke aage baarah hazaar paanch sau unsath. | step 2 |
| q3 | Line pehle aao pehle paao ki hoti hai. Cloudflare ke docs kehte hain: aapke browser mein ek cookie, jisme likha hota hai aap line mein kab aaye. | step 2 |
| q4 | Aur woh das minute? Screenshot ka math: baarah hazaar paanch sau ko chhe sau second se baanto, to har second lagbhag ikkees log andar jaate hain. | step 2 |
| q5 | Yaani queue aapko rokne ke liye nahi, server ko bachane ke liye hai. Yeh bug nahi, system ka kaam hai. | reversal |
| t1 | Ab aap andar aaye. Seat chuni. Magar usi pal ek aur insaan ne bhi wahi seat chuni. Ab? | but |
| t2 | Dono ko confirmed bol diya, to jhagda. Isliye seat pe hold lagta hai. Redis mein ek hi command: SET seat NX EX. | step 3 |
| t3 | NX ka matlab: sirf tab set karo jab pehle se na ho. Pehle ko OK mila, doosre ko nil: seat abhi kisi aur ke paas hai. | step 3 |
| t4 | Hold ke saath timer bhi. Agar aap payment nahi kar paaye, seat apne aap chhoot jaati hai. Isliye seat map mein seats gayab hoti hain, aur wapas bhi aa jaati hain. | step 3 |
| p1 | Ab paisa. Aapne pay dabaya, network atka, aapne phir dabaya. Kya do baar paisa katega? | but |
| p2 | Nahi, kyunki har payment ke saath ek idempotency key jaati hai. Same key, same jawab, ek hi charge. Stripe ke docs yahi kehte hain. | step 4 |
| p3 | District ne pachaas percent abhi, baaki baad mein wala option bhi diya. Matlab system ko ek aur halat yaad rakhni padti hai: aadha paid. | step 4 |
| p4 | Aur seat tabhi pakki, jab payment confirm ho. Warna hold chhoot jaata hai. | step 4 |
| e1 | Ab bots. Ticketmaster ne kaha unhe pehle se teen guna bot traffic mila. Isliye link sirf registered logon ko, aur rate limits. | step 5 |
| r1 | Ek zaroori baat: District ne apna design public nahi kiya. Jo main dikha raha hoon, woh screenshot ne dikhaya aur woh jo industry mein aam hai. Do lakh tickets, chaalis crore wali baatein, abhi tak unverified hain. | honest |
| r2 | To agli baar line mein dikhe aapke aage baarah hazaar, gussa mat karna. Wahi line aapki seat bacha rahi hai. | reframe |
| cta | Yeh us dost ko bhejiye jo kehta hai app crash ho gayi. Like, share aur subscribe karein, Sandesh Explains. | CTA |


**Length:** the table is ~559 words, about 207 s (3 min 27 s) at 2.7 words/s. Every rung answers one question; trim candidates if you want it tighter (about 3 min): s1c (Ticketmaster), q3 (cookie detail), p3 (50% option), and the second half of r1. Storyboard times in section 10 are estimates for ~190-205 s.

## 6. Facts ledger (details in `research/sources.md`)
Tier A (vendor pages read today): Cloudflare Waiting Room FIFO + cookie timestamp + estimated wait; Redis SET NX/EX lock + token unlock + "discouraged in favour of Redlock"; Stripe idempotency (same key = same response, 255 chars, 24 h). Tier B (reported): 1 lakh in under an hour; 12,569 ahead / ~10 min; registration and pre-sale dates; WhatsApp link; 50% option; price ladder; Ticketmaster testimony quotes. Derived: 28/s, ~21/s, 48 h. **Never on screen:** 2 lakh tickets, Rs 40 crore, any claim about District's internals, any hold timer for District (we show "a few minutes, as in typical systems").

## 7. Visual identity (new)
Not NavIC's teal/amber/sky, not the Diwali plan's plum/marigold. **"Showtime"**: stage-black `#07080c` with a faint arena-light haze; meaning-coded neon: **magenta `#ff2d78` = demand/the crowd**, **cyan `#22e1ff` = the system (queue, gates, rails)**, **amber `#ffb800` = a hold in progress**, **lime `#9dff3a` = confirmed**, **red `#ff3b30` = rejected/bot**. Type: Bungee (ticket-stub headlines, stamps) + Inter + Cutive Mono (the terminal/receipts), all vendored; cover in Anton. Component language: ticket stubs with perforation notches and circular punch-outs (vs NavIC scopes and the Diwali plan's glass plates).

## 8. Asset families (≥ 8; per beat)
three.js world (all) · instanced crowd/seat simulation (2, 3, 4, 5, 6, 7) · Blender-rendered ticket token, turnstile gate and chrome rail posts (all, through-line) · 3D phone + queue UI as canvas textures (1, 12) · real-looking terminal pane (7) · bespoke data objects: 48-hour ruler, admission valve, seat map with timer ring, receipt with key stamp (3, 5, 7, 9) · real stage photos from `assets/photos` as arena-haze textures, dust and light-leak overlays (1, 12) · layered synth score that adds a voice per step + crowd-roar SFX + cloned voice (all). No cartoon people (rule), no brand logos (District and BookMyShow named as text only).

## 9. New technique (required by the benchmark rule)
**Token follow-cam through one continuous pipeline set** with a data dashboard that is part of the world, plus **100k-dot deterministic crowd** (hash-born positions, analytic motion, instanced) and **state-machine seats**.

## 10. Storyboard (expert-sketcher order)
| # | Time (est.) | Question | Build order (each step on its word) | Camera |
|---|---|---|---|---|
| 1 | 0-14 | What did I just see on my phone? | phone in the dark: "Aapke aage 12,569" + timer; tick; token glows | push through the screen |
| 2 | 14-38 | Is one lakh tickets hard? | "1,00,000 / 3,600 s = 28 per second" built as an equation line; a thin 28/s flow vs the spike of 1 lakh dots arriving in the same second | pull back to a wide gate view |
| 3 | 38-62 | How do you stop a stampede? | a 48-hour ruler appears; the crowd splits into lanes; each person gets a WhatsApp-style invite token; Ticketmaster line as a plaque | slide along the ruler |
| 4 | 62-95 | What if everyone still comes at 2 PM? | the lanes bunch; the waiting room: a serpentine line with numbers; the valve admits ~21/s; "12,569 ahead" on the phone is the line's length; cookie timestamp card; FIFO order shown | follow the line to the gate |
| 5 | 95-135 | Two people, one seat? | the arena bowl; two tokens reach seat B14; the terminal pane types the SET command; first OK, second (nil); the seat turns amber with a ring; expiry flips it free | drop into the bowl |
| 6 | 135-160 | What if the payment fails and I tap twice? | payment counter; the line drops; two taps; two receipts with the same key stamp collapse into one; half-paid state; green only after confirm | counter close-up |
| 7 | 160-173 | And bots? | red squares queue at the gate; only invite tokens pass; "3x bot traffic" plaque | gate side view |
| 8 | 173-190 | What is real here? | the split card WE CAN SEE / COMMONLY BUILT; the 2-lakh claim struck off | static hold |
| 9 | 190-205 | So what is that queue? | back to the phone: the same screen; the number is now a seat being protected; the token lands on a seat: lime ticket; end card (profile, @sandeshexplains, LIKE · SHARE · SUBSCRIBE) | pull to the phone |
Cuts: at most two dips (before 5 and before 8); everything else is a continuous move along the token's route.

## 11. Mockup plan (3 scenes, 3 families, stepwise stills)
(a) the 100k-dot stampede vs line + equation (instanced crowd + data object), (b) the seat map with the Redis terminal pane and the hold timer (state machine + terminal), (c) the phone + token at the start/end (3D UI + Blender token). Approved before any build.

## 12. Schedule (no deadline: the news is a month old; quality first)
Approve script/identity → write the full voice script + generate cloned-voice takes (CPU, long) → mockup stills in parallel → build + lints → render in 2 slices → frame review → cover + caption → send.
