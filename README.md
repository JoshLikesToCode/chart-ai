# AI Diagram Agent

An agentic diagram design tool: an Excalidraw canvas driven by an AI agent that reads natural-language requests and turns them into diagrams through structured tool calls.

## What it does (or will do)

- Reads natural language requests ("draw a sequence diagram of an OAuth login")
- Controls an Excalidraw canvas via structured tool calls (add/update/remove elements)
- Reads the live canvas state on demand
- Searches the web for fresh information when it needs to
- Searches a private knowledge corpus via RAG when it needs precise reference material
- Streams responses, shows tool status, and handles approvals for risky actions

This is a work in progress, built incrementally. The canvas and chat shell exist; the agent, evals, and everything else get built on top of them.

## Setup

### 1. Install

```bash
git clone <this repo url>
cd ai-diagram-agent
npm install
```

### 2. Configure environment variables

Copy `.dev.vars.example` to `.dev.vars` and fill in your OpenAI API key:

```bash
cp .dev.vars.example .dev.vars
```

```
OPENAI_API_KEY=sk-...
```

The Worker reads this file via `wrangler dev` automatically.

### 3. Run it

```bash
npm run dev
```

Starts the app at http://localhost:5173 (or 5174/5175 if that port's taken).

## Roadmap

- [x] Excalidraw canvas + chat UI shell
- [ ] Cloudflare Workers agent (Agents SDK) with structured tool calls
- [ ] Streaming chat experience with tool status
- [ ] Eval harness with a golden dataset and automated scorers
- [ ] Context engineering: system prompt design, canvas state as context, compaction
- [ ] Advanced tool use: tool search, sandboxed code execution, few-shot tool examples
- [ ] RAG over a private knowledge corpus
- [ ] Generative UI for tool results
- [ ] Human-in-the-loop approval flows for destructive actions
- [ ] Agent architecture beyond the basic loop (planning, multi-agent handoffs)
- [ ] Data flywheel: turn corrections into eval data

## Tech stack

- **Runtime**: Node + Cloudflare Workers (local via `wrangler dev`, no deployment needed)
- **Frontend**: Vite + React + Excalidraw
- **Agent**: AI SDK + Cloudflare Agents SDK (Durable Objects)
- **Vector store**: Upstash Vector (planned)
- **Evals**: Braintrust (planned)
- **Web search**: Tavily (planned)

Everything runs locally. No deployment, no production cloud infrastructure required.
