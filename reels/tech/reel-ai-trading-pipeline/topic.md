# Topic — "Claude + TradingView: a trading pipeline that can't panic" — research log, 11 Oct 2026

**Brief (creator):** how to use Claude to set up an automated trading pipeline using TradingView and Claude Cowork / Claude Code. Deep research first, then a compelling script.
**News peg:** TradingView launched an **official MCP server** (public beta, announced 16 Sep 2026): Claude can now read TradingView data and manage alerts directly. Most "Claude trading bot" content online predates it or misdescribes what it can do.
**Our angle:** a *disciplined* pipeline in four blocks, where Claude does the thinking, the code and the supervision. Orders only fire from rules you wrote, through your own server, inside hard risk limits. It's honest about what Claude can't do, what SEBI now requires, and the loss statistics. This is a tutorial (standing rule), so every command and number below was read first-hand from vendor or regulator pages the same day.

## Verified facts (tier A = primary source or ≥ 2 independent outlets; B = single outlet; C = do not say)
| # | Fact (as used) | Tier | Source |
|---|---|---|---|
| 1 | TradingView MCP server, `https://mcp.tradingview.com/mcp`, **public beta**; Essential plan or higher (not trials); OAuth 2.1 sign-in, no API keys; ~**100 tool requests/min**; delayed market data | A | tradingview.com/mcp/docs; TradingView blog "Bring TradingView to Claude with the new MCP Server" (16 Sep 2026) |
| 2 | Claude Code command: `claude mcp add --transport http mcp-tradingview https://mcp.tradingview.com/mcp`, then `/mcp` to authorise in the browser. Claude app: Settings → Connectors → Add custom connector → paste URL | A | tradingview.com/mcp/docs |
| 3 | **35 tools, 25 read-only + 10 write**: watchlists, OHLCV bars, screener, technicals rating, news, fundamentals, filings and transcripts, calendars, and alerts (create/update/delete/pause, alert log) | A | same |
| 4 | **No order-placement tools.** **Webhook alerts can't be created or edited through MCP** (they need verified 2FA, which MCP can't do yet). MCP alerts are simple price alerts only (no indicator/strategy alerts) | A | same |
| 5 | TradingView webhooks: **2FA required**; only **ports 80/443**; **no IPv6**; request **cancelled after 3 s**; sent from 52.89.214.238, 34.212.75.30, 54.218.53.128, 52.32.178.7; a JSON message is sent as `application/json` | A | TradingView Help: "About webhooks" |
| 6 | Webhooks need a **paid plan** (free plan: no webhook notifications) | A | TradersPost, PickMyTrade, Fyers guide (≥ 2 outlets) + TradingView pricing pages |
| 7 | Alert placeholders: `{{ticker}}`, `{{close}}`, `{{time}}`, `{{strategy.order.action}}` ("buy"/"sell"), `{{strategy.order.contracts}}`, `{{strategy.order.price}}`, `{{strategy.market_position}}`, `{{strategy.order.alert_message}}` | A | TradingView Help: "How to use a variable value in alert" |
| 8 | Claude Cowork **scheduled tasks**: all paid plans; hourly/daily/weekly/weekdays; **run remotely even when your computer is asleep or the app is closed** (tasks that need local files/apps run locally); can use your connectors, skills and plugins | A | support.claude.com "Schedule recurring tasks in Claude Cowork" (updated Oct 2026) |
| 9 | India: **from 1 Apr 2026 a static IP is mandatory for API-based order placement** (market data and read APIs are exempt); up to 2 IPs; one IP change per calendar week; family sharing only | A | Zerodha Support "static IP"; Zerodha "In The Money" (Apr 2026); Fyers/Sahi/HDFC Sky guides |
| 10 | SEBI retail algo framework (Feb 2025 circular, mandatory 1 Apr 2026): **≤ 10 orders/sec** needs no strategy registration; above that, the strategy must be registered and audited; API orders are tagged as a separate category | A | Zerodha In The Money; Sahi, Tradejini, Fyers, AlgoBulls |
| 11 | Plain **market orders via API are no longer allowed** as before; they need a non-zero **market protection** % | B | Zerodha In The Money (Apr 2026). On screen as "check your broker's order rules" |
| 12 | Static IP cost "starting around ₹1,500/year" | B | Zerodha In The Money (draft figure). Say "a small yearly cost", not the number |
| 13 | Kite Connect **Personal plan is free and can place orders** (no live or historical data); Connect plan ₹500/month per API key | A | Zerodha Support "How to sign up for Kite Connect" |
| 14 | SEBI study (Jul 2025): **91 % of individual equity F&O traders lost money in FY25**; net losses ₹1,05,603 crore (+41 % vs FY24) | A | Business Standard, Moneylife, Value Research, Angel One (multi-outlet) |
| 15 | Anthropic usage policy: consumer-facing financial *advice* is a high-risk use needing human review and disclosure | B | anthropic.com/aup (summaries). We frame Claude as builder and supervisor, never adviser; "not financial advice" on screen |
| 16 | "Claude predicts the market / X% returns / a guaranteed edge" | C | **Never say.** No backtest result is shown as a promise; any P&L on screen is labelled ILLUSTRATIVE |
| 17 | Third-party community MCPs that drive TradingView Desktop over Chrome DevTools | C | Unofficial, with security risk; not used or recommended |

**What Claude can and can't do here (the reel's core truth):**
- **Claude (official connector):** reads and screens, writes code, manages simple price alerts, reviews alert logs and trade logs.
- **You:** create the webhook alert (2FA).
- **Your own server:** places the order through your broker's API.
- **You:** approve every rule change.
