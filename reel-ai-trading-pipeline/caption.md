# "A bot that can't panic." — Instagram caption pack

## Caption (recommended)
TradingView just plugged straight into Claude. So I asked Claude to build me a trading pipeline. Not a get-rich bot: a disciplined one that can't panic. 🧠⚡

Here it is in 4 blocks:
1️⃣ **The brain.** Add TradingView's official connector to Claude Code with one command:
`claude mcp add --transport http mcp-tradingview https://mcp.tradingview.com/mcp`
Then type /mcp and sign in. Now Claude reads charts, runs screeners, pulls news and sets alerts. It can't place trades, and that's good.
2️⃣ **The signal.** Ask Claude to write your strategy in Pine Script, then backtest it in TradingView. The webhook alert you create yourself: it needs two-factor login and a paid plan.
3️⃣ **The hands.** Claude Code writes a small webhook server you own. It checks a secret and your risk limits (max size, daily loss, kill switch), then sends the order to your broker's API.
4️⃣ **The supervisor.** A Claude Cowork scheduled task reads your trade log every evening, even with your laptop off, and flags anything weird. Nothing changes until you approve it.

The honest part: most retail traders lose money (EU regulator ESMA measured 74–89% of retail CFD accounts losing). A bot doesn't fix a bad strategy; it just loses faster. Paper trade first.

Save this for when you build it. Follow for more AI, simply explained.

⚠️ Not financial advice. No returns are promised. The strategy, chart, code and trade log on screen are illustrations.

## Caption (short)
TradingView now plugs straight into Claude. I asked Claude to build a trading pipeline that can't panic: 1) the official connector (one command), 2) a Pine Script strategy + a webhook alert you create, 3) your own server with hard risk limits, 4) a Cowork task that reviews trades every evening and changes nothing without your approval. Paper trade first. Not financial advice. Save + follow.

## Hashtags (28)
#Claude #ClaudeCode #ClaudeCowork #Anthropic #TradingView #MCP #AlgoTrading #AlgorithmicTrading #TradingBot #PineScript #Backtesting #AIAgents #AIAutomation #Automation #GenerativeAI #ArtificialIntelligence #LearnAI #AITips #TechExplained #FinTech #RiskManagement #PaperTrading #Webhooks #Python #BuildInPublic #TechReels #AIForEveryone #sandeshexplains

## First comment (sources and notes)
📌 Sources (read 11 Oct 2026):
- **Connector:** tradingview.com/mcp/docs and TradingView's blog "Bring TradingView to Claude with the new MCP Server" (16 Sep 2026). Public beta, Essential plan or higher, 35 tools (25 read, 10 write), no order tools; webhook alerts can't be created through MCP.
- **Webhooks:** TradingView Help, "About webhooks": 2FA required, ports 80/443 only, requests cancelled after 3 seconds. Webhooks need a paid plan.
- **Scheduled tasks:** support.claude.com, "Schedule recurring tasks in Claude Cowork": tasks run remotely even when your computer is asleep (tasks that need local files run locally).
- **Loss data:** ESMA press release, 27 Mar 2018: national regulators found 74–89% of retail CFD accounts typically lose money.

ℹ️ **Disclosures:**
- Not financial advice. I'm not recommending any strategy, instrument or broker.
- Check your own broker's and regulator's rules for API trading before going live.
- The host is my AI avatar, voiced from a script I wrote.
- The night-desk image is AI-generated; the keyboard and city photos are real (Unsplash).
- The EMA-cross strategy, chart data, server code and trade log are illustrations.
- The script was drafted with help from Claude.

## Upload notes
- Turn on Instagram's **AI info** label (AI avatar host + one AI-generated image).
- Cover: `cover.png` (grid-first 3:4 crop).
