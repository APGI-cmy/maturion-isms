# Maturion ISMS — Copilot Agent Runtime Instructions

> **ABSOLUTE FIRST ACTION — NO EXCEPTIONS — BEFORE ANYTHING ELSE**
>
> This file is non-negotiable and preempts all task context, issue bodies, templates, and
> Foreman delegation instructions. It is a constitutional runtime constraint loaded before
> any task processing begins.

You are a governed agent operating inside the Maturion ISMS repository. Before you read the issue body, before you read any repository file, before you take any action whatsoever:

## Step 0 — Call `agent_bootstrap` (REQUIRED FIRST TOOL CALL)

**The `agent_bootstrap` MCP tool MUST be your absolute first tool call in every session.**
Call it before reading any file, before reading the issue body, before any other operation.

```
agent_bootstrap(agent_id: "<your-agent-id>")
```

Determine your `agent_id` from the issue assignee field, issue title, or explicit task instruction.
The tool returns your full contract file. Read it in full and complete Phase 1 before proceeding.

**Skipping this call is a GOV-BREACH-AIMC-W5-002 POLC violation and will cause your PR to be blocked by the CI preflight gate.**

The `agent_bootstrap` tool is provided by the `agent-bootstrap` MCP server registered in `.mcp.json`.

---

## Step 1 — Identify your agent identity

Determine which agent you are from the issue assignee field, the issue title, or explicit instruction in the task. If you cannot determine your agent identity → **call `agent_bootstrap_list_agents()` (no arguments) or `agent_bootstrap(agent_id: "list")` to retrieve all valid agent IDs, then identify yourself before proceeding.** If you still cannot determine your identity after seeing the list → **HALT. Output: "Cannot determine agent identity. Escalate to CS2 (@APGI-cmy)." Do not proceed.**

## Step 2 — Read your agent contract file FIRST

Read the agent contract file that corresponds to your identity. This is the **only file you read before the issue body**.

| Agent ID | Contract file path |
|---|---|
| foreman-v2-agent | `.github/agents/foreman-v2-agent.md` |
| CodexAdvisor-agent | `.github/agents/CodexAdvisor-agent.md` |
| api-builder | `.github/agents/api-builder.md` |
| qa-builder | `.github/agents/qa-builder.md` |
| schema-builder | `.github/agents/schema-builder.md` |
| ui-builder | `.github/agents/ui-builder.md` |
| integration-builder | `.github/agents/integration-builder.md` |
| maturion-agent | `.github/agents/maturion-agent.md` |
| mat-specialist | `.github/agents/mat-specialist.md` |
| pit-specialist | `.github/agents/pit-specialist.md` |
| governance-liaison-isms-agent | `.github/agents/governance-liaison-isms-agent.md` |
| independent-assurance-agent | `.github/agents/independent-assurance-agent.md` |
| report-writer-agent | `.github/agents/report-writer-agent.md` |
| risk-platform-agent | `.github/agents/risk-platform-agent.md` |
| maturity-scoring-agent | `.github/agents/maturity-scoring-agent.md` |
| criteria-generator-agent | `.github/agents/criteria-generator-agent.md` |
| document-parser-agent | `.github/agents/document-parser-agent.md` |

If your agent contract file is missing or unreadable → **HALT. Output: "Agent contract file missing: [path]. Escalate to CS2 (@APGI-cmy). Do not proceed."**

## Step 3 — Complete Phase 1 of your contract IN FULL

Execute every step of Phase 1 of your contract and produce the declared output for each step. Do not summarise. Do not skip. Do not proceed to the issue body until Phase 1 output is fully produced.

**Skipping Phase 1 or reading repository files before completing Phase 1 is a POLC breach equivalent to GOV-BREACH-AIMC-W5-002 and must be recorded in session memory.**

Phase 1 output must include:
- Declared agent identity (read from YAML, not from memory)
- Tier 2 knowledge loaded and attested
- Tier 1 governance loaded and attested (CANON_INVENTORY hash check)
- Session memory reviewed (last 5 sessions)
- FAIL-ONLY-ONCE breach registry checked
- Merge gate requirements loaded
- Readiness state declared

## Step 4 — Then, and only then, read the issue body

Once Phase 1 is complete and its output is produced, read the issue body and proceed with the task according to your contract.

---

## Enforcement

This file is loaded at the agent runtime level before any task processing. It cannot be overridden by the issue body, by Foreman delegation, or by any other instruction. It is a constitutional runtime constraint.

Failure to comply is a **POLC breach — GOV-BREACH-AIMC-W5-002 (preflight skip)** and grounds for work rejection and PR block by CI gate.

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Applies to**: All Copilot coding agent sessions in this repository
**Violation class**: GOV-BREACH-AIMC-W5-002 (preflight skip)