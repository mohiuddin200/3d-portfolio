# Agentic Engineering section

Decisions from the design grilling session (2026-09-30 / 10-01) for showing that I build software agent-first.

## Goal

Make recruiters, hiring managers and founders who want an AI-agent-savvy engineer notice it within seconds — without a wall of text.

## Positioning

- **Engineer first, agent-orchestrator by default.** Agents multiply real engineering skill; they don't replace it.
- Lead with **speed + reliability** (works for founders and hiring managers alike).
- First person ("I") everywhere. No KI Quadrat / team claims.
- Minimal copy. Visuals carry the story.

## Where it shows up

| Place | Change |
| --- | --- |
| Hero | Rotating title "UI/UX Enthusiast" → **"Agentic Engineer"** |
| About | Stat "4 Languages Spoken" → **"2+ Years Agent-First"**; removed "AI Agent Orchestration" from *currently learning* (contradicted 2 years of experience) |
| New section | **Agentic Engineering** (`#agentic`, nav label "How I Build"), between Experience and Projects |
| Projects | Liftuno card badge **"Built agent-first · 10 days"**. myLearnio gets no badge (still in progress) |
| Skills | Unchanged — tools live in the new section only |

## The section

Story on the left, black-and-gold terminal on the right that replays each step. Desktop: sticky scroll, 3 steps over ~3 screens (`h-[300vh]` track). Mobile and `prefers-reduced-motion`: stacked, static, no typing.

1. **2024 · The hard way — Four attempts.**
   01 Prompted blindly in Cursor → 1,000-line components → scrapped ·
   02 New stack, same mistakes → scrapped ·
   03 Specs + structure → fast & clean → pivoted (client requirements changed) ·
   04 Solid.
   Takeaway: *"Two scrapped projects taught me what agents actually need."*
2. **Now · How I build — Structure first. Then speed.**
   Spec first · Context & guardrails · Automatic checks · Agent review.
   (No cross-model review claim — review is usually done with the same agent.)
3. **Proof — Liftuno: 10 days.** From idea to a real business, in production. Stats: 10 days to MVP, 3 platforms / 1 codebase. Links to the case study. No gym count.

Tools strip: **Claude Code + Codex** — heavy lifting · **Z.AI** — side jobs. Antigravity dropped. Z.AI uses a simple custom "Z" mark (`src/components/icons/ZaiLogo.tsx`) since react-icons has no logo.

## Background story (source for the copy)

In 2024 I started building with Cursor, relying almost fully on the agent. No instructions, skills, docs or folder structure to keep it on track, so the code grew out of control — thousand-line components nobody understood. Time went into cleaning up AI-written code instead of shipping, so the project was dropped. The restart (a RAG document-Q&A app, new stack) repeated the mistakes and was dropped too. The third attempt was fast and clean but was dropped for new client requirements. The fourth, with stronger models plus the lessons learned, is solid.

## Files

- `src/data/agentic.ts` — all copy and terminal scripts
- `src/components/sections/AgenticSection.tsx` — section
- `src/lib/constants.ts`, `src/app/page.tsx` — nav + placement
