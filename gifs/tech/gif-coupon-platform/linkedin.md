# LinkedIn copy: "Every coupon rule lives in the database" (horizontal GIF `coupon-platform.gif`, 1600×900, 12 s loop, 120 frames, 4.6 MB)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post. Client and brand names are left out on purpose (the source one-pager omits them too).

## Post (recommended)

We put every rule of a coupon platform in the database, and kept the app thin on purpose.

The client prints physical coupons with a QR code. Four groups touch them: anyone can scan one to check it's genuine, dealers log in with a 4-digit PIN to validate it, distributors onboard dealers, and HQ watches and controls it all live. Payments and credit notes stay on paper. That boundary kept the system small enough to get right.

Follow one coupon through the GIF:

1. A label is printed and scanned in public. The browser calls one database function and gets back a state only: ACTIVE, validated, expired or unknown. No dealer or distributor identity leaks.
2. The dealer logs in with a PIN. An edge function rate-limits by IP, the database checks the PIN against a peppered HMAC and bcrypt, and any failure returns the same 401, so nobody can find out which numbers exist. Five wrong tries lock the account for 15 minutes, and the lock grows to a maximum of 24 hours.
3. Validate is one RPC. The database locks the row, moves the coupon from ACTIVE to REDEEMED, and writes a transition and an event. A second validate returns the same result.
4. HQ sees it on the dashboard, and an admin can reverse it with a reason. Every edge of the lifecycle is a trigger-enforced state machine, so the app can't skip one.
5. Around it: daily expiry, a daily reconciliation that should find zero issues, weekly and monthly encrypted backups, and a CI pipeline that fails the build if the dealer bundle goes past its 100 KB budget.

The numbers behind it: 33 tables with row-level security on all of them, 134 database functions, 27 policies, 10 edge functions, 17 migrations. The dealer entry bundle is 96.3 KB gzipped, and the nightly e2e suite runs on 2G and flaky-network profiles, because that's where dealers actually are.

Two things we chose not to build: messaging (the code is there, switched off, so no OTP and no outbound messages) and payments.

The lesson I keep coming back to: when the database owns the rules, the front end can be replaced, and nobody can bypass a rule by writing a cleverer client.

Where do you draw the line between app logic and database logic?

#SoftwareArchitecture #PostgreSQL #Supabase #SystemDesign #PWA #Security #Serverless #CaseStudy

## Shorter version

We put every rule of a coupon platform in the database and kept the app thin.

Physical coupons with a QR code. The public checks authenticity. Dealers validate with a PIN. Distributors onboard dealers. HQ sees everything live. Payments stay on paper.

How it works: one RPC per action, 33 tables with RLS on all of them, 134 security-definer functions, trigger-enforced state machines, and one identical 401 for every failed login. The dealer entry bundle is 96.3 KB gzipped, tested on 2G.

Where do you draw the line between app logic and database logic?

#SoftwareArchitecture #PostgreSQL #Supabase #SystemDesign #PWA

## Hashtags
#SoftwareArchitecture #PostgreSQL #Supabase #SystemDesign #PWA #Security #Serverless #CaseStudy

## First comment (how to read the GIF, sources, caveats)
📌 How to read the GIF (12-second loop):
- Left: the five clients. Centre: Vercel (the PWA, routes, bundle budgets) and the Supabase project (edge functions, PostgREST, GoTrue, PostgreSQL 17). Right: GitHub Actions, backup store, monitoring, a dormant messaging API and DNS.
- A saffron dot is one request. Watch the "PIN login" list: each of its 7 steps lights up as the request passes it. The "Security controls" list lights each control at the moment it is used.
- Bottom left, the coupon lifecycle: the amber token moves ACTIVE → REDEEMED on validate and back on an admin reverse. Smaller dots walk the other edges (activate, cron expiry, block, hold) for other coupons.
- The clock in the database is pg_cron: 19:30 expiry, 20:30 reconciliation ("0 issues"), Sunday cleanup.

📎 Source: the platform's own technical architecture one-pager. All numbers come from it: 1000 coupons loaded so far, 33 tables, 134 functions, 27 policies, 10 edge functions, 17 migrations, 183-day device login, 96.3 KB dealer entry against a 100 KB gate.

Caveats: this is a design write-up, not a benchmark. The platform is early (1000 coupons loaded), the animation is schematic, and the coupon code and flows are illustrative.

## Alt text (LinkedIn limit 1000 characters)
Architecture diagram of a coupon validation platform, animated. On the left, five clients: public scanner, dealer, distributor, HQ staff and label printer. In the centre, a PWA on Vercel and a Supabase project with edge functions, PostgREST, GoTrue auth and a PostgreSQL 17 database whose 33 tables all have row-level security. On the right, GitHub Actions, backups, monitoring, a dormant messaging API and DNS. Glowing dots show one coupon's day: a public scan, a dealer's seven-step PIN login, a validate call that moves the coupon from ACTIVE to REDEEMED, an HQ dashboard read and an admin reversal. Panels along the bottom show the coupon lifecycle, the login steps, security controls and key numbers.
