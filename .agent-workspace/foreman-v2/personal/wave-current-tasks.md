# Wave Current Tasks — foreman-v2-agent — wave-disable-injections-reinforce-contract

**Wave**: wave-disable-injections-reinforce-contract — Disable Automatic Injections & Reinforce Foreman Agent Contract
**Session**: session-wave-disable-injections-reinforce-contract-20260311
**Date**: 2026-03-11
**Branch**: copilot/disable-automatic-injections-again
**Triggering Issue**: maturion-isms — "Wave: Disable Automatic Injections & Reinforce Foreman Agent Contract — CS2 Approval for Codex Advisor, Governance Liaison Surgical Edits"
**CS2 Authorization**: Issue opened by @APGI-cmy and assigned to Copilot; explicit CS2 approval stated in issue body: "CS2 approval: The Codex Advisor agent may operate on agent files for this wave only."
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration

---

## POLC Governance Note

> **MANDATORY PRE-WAVE PROTOCOL EXECUTING (per CS2 Re-Alignment Directive 2026-03-11):**
> This wave-current-tasks.md is being created BEFORE any builder delegation or implementation
> commit. The IAA Pre-Brief will be invoked immediately after this file is committed.
> Governance sequence: Phase 1 PREFLIGHT → wave-current-tasks.md → IAA Pre-Brief → builder delegation.
> No implementation work has been committed to this branch yet.

---

## Wave Summary

This wave delivers surgical governance updates across three areas:

1. **Deactivate automatic injection workflows** — disable (not delete) all workflow injections:
   - `iaa-prebrief-inject.yml`
   - `agent-bootstrap-inject.yml`
   - `injection-audit-report.yml`

2. **Remove injection requirements from merge gate and IAA evidence checks** — replace string-based
   checks with artifact existence checks:
   - `agent-contract-audit.yml` — remove PR body string check (Check 3) and PREHANDOVER string search (Check 4)
   - `polc-boundary-gate.yml` — update injection workflow reference text
   - `governance-watchdog.yml` — remove iaa-prebrief-inject.yml references from alerts

3. **Surgical edits to Foreman agent contract** (via CodexAdvisor-agent, CS2-gated):
   - `.github/agents/foreman-v2-agent.md` — revise bootstrap directive, add re-anchor reminders,
     update Phase 2 Step 2.7 to remove injection workflow reference

---

## Files in Scope

### Workflows to Deactivate (change triggers to workflow_dispatch only):
1. `.github/workflows/iaa-prebrief-inject.yml` — automatic IAA pre-brief injection
2. `.github/workflows/agent-bootstrap-inject.yml` — automatic bootstrap instruction injection
3. `.github/workflows/injection-audit-report.yml` — injection audit report

### Workflows to Update (remove injection string references):
4. `.github/workflows/agent-contract-audit.yml` — remove PR body / PREHANDOVER string signature checks
5. `.github/workflows/polc-boundary-gate.yml` — update line 371 injection workflow reference
6. `.github/workflows/governance-watchdog.yml` — remove iaa-prebrief-inject.yml references from alerts

### Agent Contract (via CodexAdvisor-agent — CS2 explicitly authorized):
7. `.github/agents/foreman-v2-agent.md` — bootstrap directive revision, re-anchor reminders, injection workflow reference removal

### Governance Artifacts (ceremony files for this wave):
8. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — this file
9. `.agent-admin/assurance/iaa-prebrief-wave-disable-injections-reinforce-contract.md` — PENDING IAA response

### Files Out of Scope
- No production code (apps/, modules/, supabase/, packages/)
- No schema migrations
- No frontend hooks
- Other governance documents not referenced by injections

---

## Architecture Frozen Status

This wave makes no architectural changes. The changes are:
- Operational: disabling automated workflows (parked for AMC future)
- Governance refinement: removing auto-injection dependencies from merge gates
- Contract: surgical text edits to Foreman contract (bootstrap directive + re-anchors)

No architecture document update required.

---

## Red QA Gate

This wave touches only workflow files and one agent contract file. QA verification:
- Workflow deactivation: verify `on:` trigger changed to `workflow_dispatch` only
- Merge gate: verify injection string checks removed, artifact-based checks preserved
- Agent contract: verify char count within 30,000 limit per file, YAML valid

---

## Task Register

| ID | Task | File(s) | Builder | Status |
|----|------|---------|---------|--------|
| T-DI-WF-001 | Deactivate iaa-prebrief-inject.yml (workflow_dispatch only) | `.github/workflows/iaa-prebrief-inject.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-WF-002 | Deactivate agent-bootstrap-inject.yml (workflow_dispatch only) | `.github/workflows/agent-bootstrap-inject.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-WF-003 | Deactivate injection-audit-report.yml (workflow_dispatch only) | `.github/workflows/injection-audit-report.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-WF-004 | Remove injection string checks from agent-contract-audit.yml | `.github/workflows/agent-contract-audit.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-WF-005 | Update polc-boundary-gate.yml injection reference text | `.github/workflows/polc-boundary-gate.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-WF-006 | Remove iaa-prebrief-inject.yml references from governance-watchdog.yml | `.github/workflows/governance-watchdog.yml` | governance-liaison-isms-agent | PENDING PRE-BRIEF |
| T-DI-AC-001 | Surgical edits to foreman-v2-agent.md (bootstrap + re-anchors + injection refs) | `.github/agents/foreman-v2-agent.md` | CodexAdvisor-agent (CS2-gated) | PENDING PRE-BRIEF |

---

## IAA Pre-Brief Trigger

This file commit triggers the IAA Pre-Brief invocation per Phase 1 Step 1.8 and Phase 2 Step 2.7.
IAA Pre-Brief target: `.agent-admin/assurance/iaa-prebrief-wave-disable-injections-reinforce-contract.md`

---

## Re-Anchor Pulse

| Field | Value |
|---|---|
| wave | wave-disable-injections-reinforce-contract |
| status | IAA_PRE_BRIEF_PENDING |
| tasks_total | 7 |
| tasks_done | 0 |
| builders_active | none — awaiting IAA Pre-Brief |
| last_updated | 2026-03-11 |
| iaa_prebrief_artifact | `.agent-admin/assurance/iaa-prebrief-wave-disable-injections-reinforce-contract.md` |
| prebrief_status | PENDING |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Foreman Contract**: v6.2.0
