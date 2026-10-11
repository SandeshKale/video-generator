# Topic — "Wi-Fi off. AI on." (run a private AI on your own laptop in three steps)

Chosen 11 Oct 2026 for the "teach a trick / give steps" slot. Evergreen-but-current (Ollama's library was updated "yesterday" for gemma4 and gpt-oss), saveable (a real checklist), visual (terminal, Wi-Fi meter, a laptop, memory bins) and verifiable: **every command and number below was read first-hand from ollama.com / docs.ollama.com on 11 Oct 2026**. No fabricated benchmarks, no invented speeds.

## Fact table (tier A = read first-hand from the vendor page today; B = third-party guides; C = don't state)
| Fact | Tier | Source |
|---|---|---|
| Install: macOS/Linux `curl -fsSL https://ollama.com/install.sh \| sh`; Windows PowerShell `irm https://ollama.com/install.ps1 \| iex`; or download the app (`Ollama.dmg` / `OllamaSetup.exe`) | A | ollama.com/download |
| `ollama run <model>` chats; `ollama pull <model>` downloads first | A/B | ollama.com, guides |
| **gpt-oss:20b**: 14 GB download, 128K context, Apache-2.0, runs on "as little as 16 GB memory"; `ollama run gpt-oss:20b`. (gpt-oss:120b = 65 GB, needs an 80 GB-class GPU) | A | ollama.com/library/gpt-oss |
| gpt-oss = OpenAI's open-weight model family | A (common knowledge, stated on the page title) | ollama.com |
| **gemma4** (Google DeepMind, open, text+image input): E2B 4.6–7.5 GB, **E4B 6.6–9.5 GB**, 12B 7.7–8.0 GB, 26B (MoE) 16–19 GB, 31B 19–20 GB; 128K/256K context; E2B/E4B also take audio; `ollama run gemma4:e4b` | A | ollama.com/library/gemma4 |
| Tags ending **`-cloud`** (e.g. `gpt-oss:20b-cloud`, `gemma4:31b-cloud`) run on **Ollama's cloud**, have no local size, and need sign-in — **not local** | A | library pages + docs.ollama.com |
| Local server exposes an **OpenAI-compatible API** at `http://localhost:11434/v1/` (client needs an API key value but the local server ignores it); endpoints: chat completions, completions, models, embeddings, responses (stateless) | A | docs.ollama.com/api/openai-compatibility |
| Model downloads need an internet connection once; after that inference is on your machine | A (logic) | — |
| Library popularity (pulls): llama3.1 120M, deepseek-r1 94M, gemma3 41M, gemma4 26.7M, gpt-oss 13.7M | A | ollama.com/library (11 Oct) — optional chip, don't lean on it |
| Local models are usually slower / less capable than the biggest cloud models | B (qualitative, widely stated) | say "usually" |
| Speeds in tokens/s, "as good as GPT-x", benchmark scores | C | **do not state** |
| Qwen3.8 / Llama 4 tag details | C | conflicting sources — leave out |

## Cautions baked into the script
- First download *needs* internet and is 14 GB for gpt-oss:20b — the hook is "still answers when the Wi-Fi is off" (after the model is downloaded), never "no internet ever".
- All terminal output on screen is **illustrative** (we did not run it): labelled "ILLUSTRATIVE OUTPUT". No fake speed numbers.
- 16 GB is the vendor's *minimum* for gpt-oss:20b; smaller machines get gemma4:e4b / e2b.
- The `-cloud` trap is a real, checkable gotcha.

## Sources
- https://ollama.com/download · https://ollama.com/library · https://ollama.com/library/gpt-oss · https://ollama.com/library/gemma4 · https://docs.ollama.com/api/openai-compatibility (all read 11 Oct 2026)
