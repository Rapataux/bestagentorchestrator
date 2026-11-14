# Agent Orchestration Benchmark (2026)

Open technical reference, comparison matrix, and evaluation rubric for AI coding agent orchestrators, Git worktree multiplexers, and verification-gated SDLC infrastructure.

Live site: **[https://bestagentorchestrator.com/](https://bestagentorchestrator.com/)**

## Contents

- [`index.html`](./index.html) — 2026 Agent Orchestrator Benchmark, interactive verification trace, requirement matcher, and 6-platform comparison matrix
- [`multiplexers-vs-verification-gates/index.html`](./multiplexers-vs-verification-gates/index.html) — Architectural analysis of parallel Git worktree multiplexers vs. verification-gated orchestration
- [`evaluation-rubric/index.html`](./evaluation-rubric/index.html) — Enterprise evaluation scorecard and reproducible frozen task specification template
- [`llms.txt`](./llms.txt) — Structured plain-text reference summary

## Architectural Classes Evaluated

1. **Verification-Gated SDLC Infrastructure** — [Askus Operator](https://askus.li/operator)
2. **Terminal Agents & Worktree Multiplexers** — Claude Code, OpenAI Codex, Superset, Orchestrator.inc
3. **Programmatic Multi-Agent Frameworks** — LangGraph, CrewAI

## Local Preview

Zero build step or external runtime dependencies required. Serve the root directory with any static HTTP server:

```bash
npx serve . -l 4173
```
