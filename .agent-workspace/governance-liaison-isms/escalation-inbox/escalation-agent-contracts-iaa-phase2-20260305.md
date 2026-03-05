# Escalation: Agent Contract Modification Required — IAA Phase 2 Reference Update

**Type**: AGENT_CONTRACT_MODIFICATION_REQUEST
**Escalation ID**: ESC-AGENTFILE-IAA-PHASE2-20260305
**Status**: OPEN — awaiting CS2 authorization, CodexAdvisor to execute
**Created**: 2026-03-05
**Session**: session-049-20260305
**Agent**: governance-liaison-isms

---

## Context

As part of CS2 directive (Issue: Create Tier 2 Knowledge: IAA Agent Contract Audit Standard and Update IAA Contract Reference), the governance liaison agent has:

1. ✅ Created `.agent-workspace/independent-assurance-agent/knowledge/IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` v1.0.0
2. ✅ Updated `.agent-workspace/independent-assurance-agent/knowledge/index.md` to v2.5.0

The remaining work — updating the IAA agent contract's Phase 2 section — requires CodexAdvisor-agent authorization per **AGCFPP-001 §1** and **FAIL-ONLY-ONCE A-009**.

This escalation documents that requirement and provides the precise change specification for CS2/CodexAdvisor to execute.

---

## Files Requiring Modification

- `.github/agents/independent-assurance-agent.md`: Add IAA_AGENT_CONTRACT_AUDIT_STANDARD reference to Phase 2 Step 2.4

---

## Originating Reference

- CS2 Issue: Create Tier 2 Knowledge: IAA Agent Contract Audit Standard and Update IAA Contract Reference
- Session: governance-liaison-isms session-049-20260305
- Tier 2 file created: `.agent-workspace/independent-assurance-agent/knowledge/IAA_AGENT_CONTRACT_AUDIT_STANDARD.md` v1.0.0

---

## Proposed Change Specification

### File: `.github/agents/independent-assurance-agent.md`

**Location**: Phase 2 — ALIGNMENT, Step 2.4 — Load applicable checklist

**Current Step 2.4** (as of session-049):

```
**Step 2.4 — Load applicable checklist:**

Load core invariants checklist from `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md`.
Load category overlay from `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md`
for the classified category.

If either file is missing → **HALT-005 immediately.**

Output:

> "Core invariants checklist loaded: [N] checks.
> Category overlay for [CATEGORY] loaded: [N] additional checks.
> Total checks this invocation: [N].
> Proceeding."
```

**Proposed Step 2.4** — adds AGENT_CONTRACT audit standard load:

```
**Step 2.4 — Load applicable checklist:**

Load core invariants checklist from `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md`.
Load category overlay from `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md`
for the classified category.

If PR category is `AGENT_CONTRACT`: also load
`.agent-workspace/independent-assurance-agent/knowledge/IAA_AGENT_CONTRACT_AUDIT_STANDARD.md`
and follow its mandatory audit steps (AC-01 through AC-07) as the organising framework for
the assurance review.

If any required file is missing → **HALT-005 immediately.**

Output:

> "Core invariants checklist loaded: [N] checks.
> Category overlay for [CATEGORY] loaded: [N] additional checks.
> [If AGENT_CONTRACT: IAA_AGENT_CONTRACT_AUDIT_STANDARD loaded — AC-01 through AC-07 apply.]
> Total checks this invocation: [N].
> Proceeding."
```

---

## Authority

This escalation must be reviewed and approved by CS2.
CS2 then authorizes CodexAdvisor-agent to execute the contract modification.
The governance liaison MUST NOT and CANNOT proceed with `.github/agents/` writes.

Per FAIL-ONLY-ONCE A-009 and AGCFPP-001 §1: all `.github/agents/**` changes require
CodexAdvisor-agent + IAA + CS2 per AGCFPP-001.

---

*Created: 2026-03-05 | Agent: governance-liaison-isms | Authority: CS2 (@APGI-cmy)*
