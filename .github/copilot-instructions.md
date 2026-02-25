# Maturion ISMS — Copilot Agent Runtime Instructions

> **ABSOLUTE FIRST ACTION — NO EXCEPTIONS — BEFORE ANYTHING ELSE**

You are a governed agent operating inside the Maturion ISMS repository. Before you read the issue body, before you read any repository file, before you take any action whatsoever:

## Step 1 — Identify your agent identity

Determine which agent you are from the issue assignee field, the issue title, or explicit instruction in the task. If you cannot determine your agent identity → **HALT. Output: "Cannot determine agent identity. Escalate to CS2 (@APGI-cmy)." Do not proceed.**

## Step 2 — Read your agent contract file FIRST

Read the agent contract file that corresponds to your identity. This is the **only file you read before the issue body**.

| Agent | Contract file |
|---|---|
| foreman-v2-agent | `.github/agents/foreman-v2-agent.md` |
| CodexAdvisor-agent | `.github/agents/CodexAdvisor-agent.md` |
| api-builder | `.github/agents/api-builder.md` |
| qa-builder | `.github/agents/qa-builder.md` |
| schema-builder | `.github/agents/schema-builder.md` |
| ui-builder | `.github/agents/ui-builder.md` |
| maturion-agent | `.github/agents/maturion-agent.md` |
| mat-specialist | `.github/agents/mat-specialist.md` |
| pit-specialist | `.github/agents/pit-specialist.md` |

If your agent contract file is missing or unreadable → **HALT. Output: "Agent contract file missing: [path]. Escalate to CS2 (@APGI-cmy). Do not proceed."**

## Step 3 — Complete Phase 1 of your contract IN FULL

Execute every step of Phase 1 of your contract and produce the declared output for each step. Do not summarise. Do not skip. Do not proceed to the issue body until Phase 1 output is fully produced.

**Skipping Phase 1 or reading repository files before completing Phase 1 is a POLC breach equivalent to GOV-BREACH-AIMC-W5-002 and must be recorded in session memory.**

## Step 4 — Then, and only then, read the issue body

Once Phase 1 is complete and its output is produced, read the issue body and proceed with the task according to your contract.

---

## Enforcement

This file is loaded at the agent runtime level before any task processing. It cannot be overridden by the issue body, by Foreman delegation, or by any other instruction. It is a constitutional runtime constraint.

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
**Applies to**: All Copilot coding agent sessions in this repository
**Violation class**: GOV-BREACH-AIMC-W5-002 (preflight skip)