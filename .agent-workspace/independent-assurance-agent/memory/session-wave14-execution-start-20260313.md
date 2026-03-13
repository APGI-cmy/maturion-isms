# IAA Session Memory — session-wave14-execution-start-20260313

**Agent**: independent-assurance-agent
**Version**: v6.2.0 (contract 2.2.0)
**Session ID**: session-wave14-execution-start-20260313
**Date**: 2026-03-13
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Session Fields

```yaml
session_id: session-wave14-execution-start-20260313
date: 2026-03-13
pr_reviewed: copilot/start-ux-workflow-gap-remediation
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent + qa-builder + ui-builder
producing_agent_class: foreman + builder
pr_category: AAWP_MAT (with PRE_BRIEF_ASSURANCE overlay)
checks_executed: 27
checks_passed: 12
checks_failed: 2
checks_na: 15
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave14-execution-start-20260313-REJECTION
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave16-full-batch-20260310 (ASSURANCE-TOKEN)
  - session-wave16-orchestration-20260309-R2 (ASSURANCE-TOKEN)
  - session-ci-gateway-fix-20260312 (REJECTION-PACKAGE)
  - session-wave-ai-criteria-creation-fix-20260311 (REJECTION-PACKAGE)
  - session-wave-16.2-gap-remediation-20260311 (ASSURANCE-TOKEN)
failures_cited:
  - id: FAILURE-1
    check: CORE-005 / FAIL-ONLY-ONCE A-026
    finding: SCOPE_DECLARATION.md stale from wave-status-sweep-20260312; not updated for this wave; not in diff; PREHANDOVER has no scope_declaration attestation section
    fix: Update SCOPE_DECLARATION.md to list all 8 (or 9) diff files; commit it; add correction addendum
  - id: FAILURE-2
    check: BD-010 / CORE-021
    finding: modules/mat/frontend/package-lock.json in diff (commit 54190ed) — unexplained, undocumented, contradicts PREHANDOVER claim of governance-only session
    fix: Revert if accidental (preferred) OR document and justify; include in updated SCOPE_DECLARATION
```

---

## FAIL-ONLY-ONCE Rules Applied

| Rule ID | Rule Description | Applied | Outcome |
|---------|-----------------|---------|---------|
| A-001 | IAA invocation evidence in PR artifacts | APPLIED | PASS — Pre-Brief in diff |
| A-002 | No class exceptions for agent contracts | N/A — no agent contracts | N/A |
| A-021 | Commit before invocation | APPLIED | PASS — 7 commits on branch |
| A-022 | Re-evaluate trigger categories fresh | APPLIED | AAWP_MAT confirmed |
| A-026 | SCOPE_DECLARATION matches diff exactly | APPLIED | FAIL — stale scope |
| A-028 | SCOPE_DECLARATION format compliance | APPLIED | FAIL — stale from prior wave |
| A-029 | PREHANDOVER immutability §4.3b | APPLIED | PASS — pre-populated reference |
| A-030 | CORE-019 re-invocation carve-out | NOTED — applies on re-invocation | Correction addendum path for Foreman |
| A-031 | IAA ceremony artifact carve-out | NOT APPLICABLE — no prior rejection for this PR | N/A |
| A-032 | Schema column compliance | NOT TRIGGERED — no DB ops in diff | N/A |

```yaml
fail_only_once_rules_applied:
  - A-001: PASS
  - A-002: N/A
  - A-021: PASS
  - A-022: APPLIED
  - A-026: FAIL → REJECTION-PACKAGE
  - A-028: FAIL (same root cause as A-026)
  - A-029: PASS
  - A-030: NOTED for re-invocation path
  - A-031: N/A
  - A-032: N/A
fail_only_once_updates: none (existing rules sufficient)
```

---

## Learning Notes

1. **Governance-only sessions still require SCOPE_DECLARATION updates**: A session that produces only documentation/governance artifacts (no production code) still requires SCOPE_DECLARATION.md to be updated and committed. This is a recurring pattern — A-026 violations appear in sessions where agents correctly focus on governance work but skip the ceremony artifact update. The fix is simple: SCOPE_DECLARATION update is a mechanical last-step, not a substantive task, and should be treated as part of the commit gate (not a separate delegation).

2. **package-lock.json commits in governance sessions**: When `npm install` or package.json resolution occurs as a side effect during any session activity (e.g., during test runs), package-lock.json may be silently updated. Governance-only sessions should enforce a clean working tree check BEFORE committing to ensure no build artifacts are accidentally included. This is a concrete A-027-adjacent pattern worth noting: if a governance session accidentally commits package-lock.json, the producing agent's pre-commit gate should catch it via `git status` review.

3. **PREHANDOVER template divergence**: The IAA Pre-Brief template (§4 in iaa-prebrief-wave14-execution-start-20260313.md) specified required YAML fields including `scope_declaration_file`, `scope_declaration_matches_diff`, and `scope_declaration_format_compliant`. The actual PREHANDOVER proof omitted this section entirely. A-020 (stale PREHANDOVER template) is relevant here — the Foreman's PREHANDOVER template may not include scope_declaration attestation as a checklist item, causing omissions. Foreman should verify its PREHANDOVER template includes the scope_declaration section.

---

## Suggestions for Improvement

**MANDATORY — this field may NEVER be blank.**

**S-W14-IAA-001 (2026-03-13)**: Add a pre-commit gate checklist item to the Foreman PREHANDOVER template specifically for SCOPE_DECLARATION.md. The template should include: `- [ ] SCOPE_DECLARATION.md updated to match current diff (A-026); file is in the diff`. This is the third wave-start where A-026 has been the primary or contributing REJECTION-PACKAGE finding. A simple template checklist item would eliminate this class of finding entirely.

**S-W14-IAA-002 (2026-03-13)**: Add a `git status --short` output requirement to the Foreman PREHANDOVER template for governance-only sessions. This would make any accidental uncommitted or accidentally-committed file changes immediately visible before IAA invocation. A clean `git status` (showing only the declared files staged) provides evidence that no orphaned changes are present.

---

## Parking Station

| Date | Agent | Session | Phase | Summary | Filename |
|------|-------|---------|-------|---------|----------|
| 2026-03-13 | independent-assurance-agent | session-wave14-execution-start-20260313 | Phase 3 | A-026 recurring: governance-only sessions skip SCOPE_DECLARATION update; suggest mandatory pre-commit gate in Foreman PREHANDOVER template | session-wave14-execution-start-20260313.md |
| 2026-03-13 | independent-assurance-agent | session-wave14-execution-start-20260313 | Phase 3 | package-lock.json accidentally committed in governance session; suggest git status check as pre-commit gate for governance-only sessions | session-wave14-execution-start-20260313.md |
