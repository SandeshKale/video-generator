# LinkedIn copy: "Your AI agent just paid twice." (vertical 4:5 GIF `idempotency.gif`, 1080×1350, 12 s loop, 120 frames, 1.6 MB)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post. Links go in the first comment, not the body.

## Post (recommended)

Your AI agent just paid twice.
Nothing crashed. The payment went through, the reply got lost, and the agent did what it was built to do: it retried.

That's the whole bug, and agents make it more likely, because they retry on their own. Follow the GIF:

1. The charge went through. Only the reply was lost (a timeout on the way back).
2. A retry without a key is, to the payment API, a brand-new charge. Customer pays $98 for a $49 order.
3. The fix: an idempotency key. One key per payment, sent again, unchanged, on every retry.
4. The server sees the key a second time and returns the saved result instead of charging again.
5. Same key with different details? Stripe rejects it rather than guessing.

Stripe's API docs put it plainly: when you create or update something, use an idempotency key, and "if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice." The first response is saved and returned for every repeat. Keys can be up to 255 characters and are kept for at least 24 hours.

If you're giving an agent tools that move money, send emails or create orders, every one of those tools needs this. The key should come from the operation (this order, this payment), never from the attempt.

Which of your agent's tools would do damage if it ran twice?

#AIAgents #SoftwareArchitecture #APIs #Payments #AIEngineering #SystemDesign

## Shorter version

Your AI agent just paid twice. The charge went through, the reply timed out, and the agent retried.

The fix (see the GIF): an idempotency key.
1. One key per payment, sent unchanged on every retry.
2. The server saves the first response and returns it for repeats.
3. Same key, different details: rejected, not charged.

Every agent tool that moves money, sends or creates something needs one.

Which of your agent's tools would hurt if it ran twice?

#AIAgents #SoftwareArchitecture #APIs #SystemDesign

## Hashtags
#AIAgents #SoftwareArchitecture #APIs #Payments #AIEngineering #SystemDesign

## First comment (source, how to read the GIF, caveats)

Source (read 18 Oct 2026): Stripe API reference, "Idempotent requests": https://docs.stripe.com/api/idempotent_requests
• "if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice."
• For API v1, Stripe saves the status code and body of the first request with a given key (after the endpoint starts executing) and returns that saved response for retries, including 500 errors.
• Keys are up to 255 characters; keys can be pruned once they are at least 24 hours old; a reused key with different parameters returns an error.
• Stripe suggests V4 UUIDs or other high-entropy random strings, and no sensitive data in keys.

How to read the GIF: brass canisters are requests, green ones are replies. The top switch flips between the two runs (no key / with a key). "Charges made" counts what the payment API actually executed; the card shows what the customer sees.

Caveats: the tubes, order number and timings are a schematic. Idempotency keys stop duplicate charges from retries of the same request; they don't make every workflow exactly-once on their own. Other APIs implement keys differently, so check each provider's docs.

## Alt text (847 characters)

Animated diagram titled "Your AI agent just paid twice." styled as a pneumatic-tube bank. An AI agent sends a brass request canister up a glass tube to a payments API. The charge succeeds, but the green reply canister stops at a gate marked TIMEOUT, so the agent retries. In the first run, with the switch on NO KEY, the API charges again: the counter shows 2 charges and the customer's card lists two $49.00 lines stamped DUPLICATE, total $98.00. In the second run, the switch is on WITH AN IDEMPOTENCY KEY: each canister carries a blue tag, ord-1043. A key-check valve saves the key and the response in a key store. When the retry arrives with the same key, a stamp reads ALREADY DONE, the saved reply is sent back and the card shows one $49.00 charge: "Charged once. Retry was safe." A panel lists five rules, and a box cites Stripe's API docs.
