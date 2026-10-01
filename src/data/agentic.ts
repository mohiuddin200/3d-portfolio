export type TerminalTone = "cmd" | "edit" | "ok" | "warn" | "fail" | "muted" | "gold";

export interface TerminalLine {
  tone: TerminalTone;
  text: string;
}

export interface AgenticStep {
  id: "hard-way" | "method" | "proof";
  label: string;
  terminalTitle: string;
  terminal: TerminalLine[];
}

export const AGENTIC = {
  heading: "Agentic Engineering",
  headline: "I don't just use AI agents. I know where they break.",
  attempts: [
    { n: "01", text: "Prompted blindly in Cursor → 1,000-line components", status: "Scrapped", tone: "fail" },
    { n: "02", text: "New stack, same mistakes", status: "Scrapped", tone: "fail" },
    { n: "03", text: "Specs + structure → fast & clean", status: "Pivoted", tone: "partial" },
    { n: "04", text: "Solid.", status: "Shipped", tone: "ok" },
  ],
  attemptsTakeaway: "Two scrapped projects taught me what agents actually need.",
  method: [
    { title: "Spec first", text: "Requirements pinned down before any code." },
    { title: "Context & guardrails", text: "CLAUDE.md, skills and hooks keep agents on track." },
    { title: "Automatic checks", text: "Types, lint and tests on every change." },
    { title: "Agent review", text: "Every diff reviewed before it ships." },
  ],
  proof: {
    project: "Liftuno",
    slug: "liftuno",
    headline: "10 days.",
    subline: "From idea to a real business, in production.",
    stats: [
      { value: "10", label: "days to MVP" },
      { value: "3", label: "platforms, 1 codebase" },
    ],
  },
  tools: [
    { name: "Claude Code", role: "Heavy lifting" },
    { name: "Codex", role: "Heavy lifting" },
    { name: "Z.AI", role: "Side jobs" },
  ],
} as const;

export const AGENTIC_STEPS: AgenticStep[] = [
  {
    id: "hard-way",
    label: "The hard way",
    terminalTitle: "agent — 2024",
    terminal: [
      { tone: "cmd", text: "build the whole dashboard, make it work" },
      { tone: "edit", text: "✎ Dashboard.tsx        +1,247 lines" },
      { tone: "edit", text: "✎ utils.ts             +893 lines" },
      { tone: "fail", text: "✗ type errors everywhere" },
      { tone: "warn", text: "⚠ nobody can follow this code anymore" },
      { tone: "muted", text: "→ project scrapped" },
    ],
  },
  {
    id: "method",
    label: "How I build",
    terminalTitle: "agent — now",
    terminal: [
      { tone: "cmd", text: "/spec memberships" },
      { tone: "ok", text: "✓ spec.md locked" },
      { tone: "cmd", text: "implement slice 1: member registration" },
      { tone: "muted", text: "  loading CLAUDE.md · skills · guardrails" },
      { tone: "edit", text: "✎ members/register.tsx  +142 lines" },
      { tone: "ok", text: "✓ typecheck   ✓ lint   ✓ tests" },
      { tone: "cmd", text: "review the diff" },
      { tone: "ok", text: "✓ review passed — ready to merge" },
    ],
  },
  {
    id: "proof",
    label: "Proof",
    terminalTitle: "liftuno — day 10",
    terminal: [
      { tone: "cmd", text: "ship liftuno" },
      { tone: "ok", text: "✓ web   ✓ android   ✓ windows" },
      { tone: "gold", text: "▶ deployed to production" },
      { tone: "ok", text: "● in use by a real business" },
    ],
  },
];
