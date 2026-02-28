# Universal 'We Only Fail Once' Policy

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2 (Johan Ras)  
**Seeded**: 2026-02-24  
**Approved By**: CS2 — issue APGI-cmy/maturion-foreman-governance#1196  
**Layer-Down Status**: PUBLIC_API — Mandatory ripple to all consumer repositories  
**Applies To**: ALL Agents, ALL Agent Classes, ALL Repositories, ALL Sessions

---

## 1. Purpose

This policy expands the **'We Only Fail Once'** breach registry and preflight attestation requirement—previously mandated only for the Foreman agent—to **every agent class** in the Living Agent System.

If only the Foreman learns from failure, repeated systemic breach is inevitable. **Institutional memory and fail-once doctrine must apply to ALL agents, not just orchestration.**

This policy operationalises the constitutional principle established in `WE_ONLY_FAIL_ONCE_DOCTRINE.md` at the per-agent level by mandating:

1. **Per-agent Tier 2 knowledge artifact** — each agent maintains a `FAIL-ONLY-ONCE.md` breach registry in its `.agent-workspace/<agent>/knowledge/` directory.
2. **Mandatory preflight attestation** — every agent reads and self-attests against its `FAIL-ONLY-ONCE.md` registry before any session work begins.
3. **Mandatory RCA append** — after any governance breach, the agent (or its authorized updater) MUST append a new rule and breach log entry to the registry. This step is non-optional.
4. **Enforcement by CodexAdvisor and governance-liaison** — structural correctness of each agent's FAIL-ONLY-ONCE registry is a required validation in all agent-file creation, ripple, and layer-down PR reviews.

---

## 2. Scope and Applicability

| Agent Class | Registry Location | Preflight Required | RCA Append Required |
|-------------|------------------|--------------------|---------------------|
| supervisor (Foreman) | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| overseer (CodexAdvisor) | `.agent-workspace/CodexAdvisor-agent/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| administrator (governance-repo-administrator) | `.agent-workspace/governance-repo-administrator/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| builder | `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| reviewer | `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| auditor | `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| specialist | `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |
| governance-liaison | `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` | YES | YES |

**Cross-cutting failures** (failures whose root cause affects multiple agent classes) MUST be recorded in BOTH the triggering agent's registry AND escalated to the governance canon `FAIL-ONLY-ONCE.md` for system-wide learning promotion per `FAILURE_PROMOTION_RULE.md`.

---

## 3. Registry Format (Per-Agent FAIL-ONLY-ONCE.md)

Each agent's `FAIL-ONLY-ONCE.md` MUST follow this canonical structure:

```markdown
# FAIL-ONLY-ONCE Registry — <Agent Name>
Version: 1.0.0
Seeded: YYYY-MM-DD
Authority: <Agent Contract Version> | LIVING_AGENT_SYSTEM.md v6.2.0
Update Protocol: After every breach RCA, agent appends new rule + breach log entry. Never remove. Never skip.
Preflight: Agent reads this file in full and self-attests against every Universal Rule (Section A) and every
           matching Conditional Rule (Section B) at every session start before any work begins.

---

## Section A — Universal Rules (Always Check)

| ID | Category | Rule |
|----|----------|------|
| A-01 | [Category] | [Rule statement in first-person] |
...

---

## Section B — Conditional Rules (Check When Trigger Matches)

| ID | Trigger | Rule |
|----|---------|------|
| B-01 | [Trigger condition] | [Rule statement in first-person] |
...

---

## Section C — Breach Log

| Rule ID | Date Added | Incident Reference | One-line Summary |
|---------|------------|--------------------|------------------|
```

**Minimum seed requirements**: At creation, a new agent's registry MUST include at minimum:

| ID | Category | Rule |
|----|----------|------|
| A-01 | Escalation | I do NOT proceed with work that falls outside my defined authority scope. I HALT and escalate. |
| A-02 | Evidence | I do NOT hand over work without completing my required evidence artifacts. |
| A-03 | Memory | I MUST append a new rule to this file as part of every RCA commit. This is non-optional. |
| A-04 | Governance | I do NOT self-interpret governance ambiguity. When in doubt, I escalate to my defined authority. |

---

## 4. Preflight Attestation Requirement

**Every agent MUST** include a FAIL-ONLY-ONCE Attestation step in its Phase 1 (Preflight) section, following this pattern:

```markdown
### 1.X FAIL-ONLY-ONCE Attestation (mandatory, every session)

Before any session work begins, <Agent Name> reads `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md`
in full and self-attests against every Universal Rule (Section A) and every matching
Conditional Rule (Section B). If any rule is being violated, <Agent Name> STOPS immediately
and resolves the violation before continuing.

After any governance breach, <Agent Name> MUST append a new entry to `FAIL-ONLY-ONCE.md` as
part of the RCA commit. This step is non-negotiable and cannot be skipped.
```

This step MUST appear in Phase 1 of the agent's Four-Phase Canonical Contract, after the Identity & Authority section and the Sandbox & Constitutional Constraints section, and before the Canonical Governance Bindings section.

---

## 5. Enforcement by CodexAdvisor and Governance-Liaison

When validating, creating, or reviewing agent contract files or ripple/layer-down PRs, **CodexAdvisor** and **governance-liaison** agents MUST check:

1. **Registry existence**: `.agent-workspace/<agent>/knowledge/FAIL-ONLY-ONCE.md` exists and is non-empty.
2. **Structural correctness**: Registry contains Sections A, B, and C headers.
3. **Minimum seed rules**: Registry contains at minimum the 4 universal seed rules (A-01 through A-04).
4. **Preflight section**: Agent contract contains a `FAIL-ONLY-ONCE Attestation` step in Phase 1.
5. **Knowledge index**: `.agent-workspace/<agent>/knowledge/index.md` references `FAIL-ONLY-ONCE.md`.

Missing or structurally incomplete registries MUST be flagged as **blocking** during agent-file validation and MUST prevent merge of any PR that introduces a new agent without them.

---

## 6. Shared vs Per-Agent Registry

| Scenario | Registry Pattern | Rationale |
|----------|-----------------|-----------|
| Agent whose failures are self-contained (builder, reviewer) | Per-agent only | Failures apply to agent's specific execution domain |
| Agent whose failures are cross-cutting (Foreman, CodexAdvisor, governance admin) | Per-agent registry PLUS escalation to `governance/canon/FAIL-ONLY-ONCE.md` | Cross-cutting failures require system-wide structural change |
| New agent with no prior breach history | Per-agent registry seeded with 4 universal minimum rules | Establishes institutional memory from first session |

**Promotion rule**: When a per-agent breach is identified as cross-cutting, it MUST be promoted to `governance/canon/FAIL-ONLY-ONCE.md` and `WE_ONLY_FAIL_ONCE_DOCTRINE.md` per `FAILURE_PROMOTION_RULE.md`. The per-agent registry retains the entry; promotion adds the cross-cutting rule to the shared canon.

---

## 7. Template for New Agents

All new agent workspaces MUST be created from the canonical template at `.agent-workspace-template/`, which includes a `knowledge/FAIL-ONLY-ONCE.md` stub. The `AGENT_CONTRACT.template.md` includes the mandatory preflight attestation section.

Agents created without the required knowledge artifact structure are **INCOMPLETE** per `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` and MUST NOT be approved for merge.

---

## 8. Related Canon

- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md` — Constitutional doctrine (Tier-0 authority)
- `governance/canon/FAIL-ONLY-ONCE.md` — System-wide canonical breach registry
- `governance/canon/FAILURE_PROMOTION_RULE.md` — When and how failures are promoted
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Tier 2 knowledge structure
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 — Living Agent framework
- `governance/canon/agent-contracts-guidance/AGENT_CONTRACT.template.md` — Agent contract template
- `governance/canon/ZERO_TOLERANCE_FINDING_PROTOCOL.md` — Zero-tolerance principle for all AI/agent findings (every finding is blocking unless CS2 exempts it)

---

**Authority**: CS2 (Johan Ras) | **Issue**: APGI-cmy/maturion-foreman-governance#1196 | **Effective**: 2026-02-24
