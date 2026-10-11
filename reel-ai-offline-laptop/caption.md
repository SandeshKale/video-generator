# Instagram caption — "Wi-Fi off. AI on."

**On-reel title:** WI-FI OFF. AI ON.

## Caption (recommended)
Here's an AI that still answers when the Wi-Fi is off. No subscription, no cloud: it runs on your laptop. Three steps 👇

**1) Install Ollama.** Mac or Linux: paste `curl -fsSL https://ollama.com/install.sh | sh` into the terminal. Windows: `irm https://ollama.com/install.ps1 | iex` in PowerShell. Or just download the app from ollama.com. It's free.

**2) Pick a model that fits your memory.** 16 GB of RAM? Run `ollama run gpt-oss:20b` (OpenAI's open model, about 14 GB, Apache-2.0). Less memory? Try `ollama run gemma4:e4b` (about 6.6–9.5 GB).

**3) Turn the Wi-Fi off and ask it anything.** It still answers, because the model lives on your machine. (The first download needs internet; after that it doesn't.)

**Bonus:** it also runs a local API at `http://localhost:11434/v1`, so your own apps can talk to it.

**Two catches:** local models are usually slower than the biggest cloud models, and any model tagged `-cloud` isn't local — it runs on Ollama's servers.

Save this for later 🔖, tell me which model you try first, and follow @sandesh.explains for the next hack.

*Terminal output and visuals in the video are illustrative (not a recorded run). Sizes and commands read from ollama.com on 11 Oct 2026 — check the library page for the latest tags. Presenter is an AI avatar of me.*

## Shorter version
An AI that still answers with the Wi-Fi off: 1) install Ollama, 2) `ollama run gpt-oss:20b` if you have 16 GB RAM (or `gemma4:e4b` for less), 3) turn Wi-Fi off and ask away. Bonus: local API at localhost:11434. Catch: usually slower than big cloud models, and `-cloud` tags aren't local. Save this 🔖

## Hashtags
#Ollama #LocalAI #OfflineAI #PrivateAI #gptoss #Gemma #OpenSourceAI #AItools #AIhack #AItricks #techhacks #techreels #howto #tutorial #productivityhacks #learnAI #aiexplained #techexplained #selfhosted #privacy #developers #coding #macOS #windows #linux #opensource #artificialintelligence #savethis #sandeshexplains #reels

## First comment (sources / caveats)
- Commands and sizes read first-hand on 11 Oct 2026: ollama.com/download (install), ollama.com/library/gpt-oss (gpt-oss:20b: 14 GB, 16 GB memory minimum, Apache-2.0, 128K context), ollama.com/library/gemma4 (E4B 6.6–9.5 GB), docs.ollama.com/api/openai-compatibility (local API at http://localhost:11434/v1).
- Tags ending `-cloud` have no local size on the library pages and run on Ollama's cloud.
- "Usually slower / less capable than the biggest cloud models" is a general caution, not a benchmark. No speeds are claimed.
- gpt-oss is OpenAI's open-weight model family; Gemma is Google DeepMind's. Logos/names are used only to identify them.
