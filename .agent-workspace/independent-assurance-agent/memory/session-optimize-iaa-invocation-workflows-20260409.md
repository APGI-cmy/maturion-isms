# IAA Session Memory — Wave optimize-iaa-invocation-workflows

**Session ID**: session-optimize-iaa-invocation-workflows-20260409
**Date**: 2026-04-09
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Session Fields

```yaml
session_id: session-optimize-iaa-invocation-workflows-20260409
date: 2026-04-09
pr_reviewed: "Wave optimize-iaa-invocation-workflows — branch copilot/optimize-iaa-invocation-workflows, Issue #1311 (planning-only governance wave, foreman-v2-agent)"
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman

pr_category: GOVERNANCE_AUDIT (PLANNING_ONLY) — EXEMPT
checks_executed: 20
checks_passed: 19
checks_failed: 1
merge_gate_parity_result: FAIL (validate-scope-to-diff.sh exit code 1 — parking station log missing from SCOPE_DECLARATION)
verdict: REJECTION-PACKAGE
token_reference: N/A — REJECTION-PACKAGE (no token issued)
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-wave20-atomic-write-back-20260318-R2 (ASSURANCE-TOKEN)
  - session-wave20-atomic-write-back-20260318 (REJECTION-PACKAGE — A-021, scope, artifacts)
  - session-wave19-orchestration-20260317-R2 (REJECTION)
  - session-wave18-postmerge-hotfix-20260315-AUDIT
  - session-wave16-full-batch-20260310

failures_cited:
  - "HFMC-02 / A-026 / CORE-021: .agent-workspace/foreman-v2/parking-station/suggestions-log.md in three-dot diff but absent from SCOPE_DECLARATION.md. A-031 carve-out does not apply (A-031 covers IAA-owned artifacts only). validate-scope-to-diff.sh exit code 1."

fail_only_once_rules_applied:
  - A-001 (invocation evidence): PASS — iaa_audit_token pre-populated
  - A-002 (no class exceptions): PASS — no class exemption claimed
  - A-021 (commit before IAA): PASS — all artifacts committed, git status clean
  - A-022 (re-evaluate trigger categories): PASS — three-dot diff confirms GOVERNANCE_AUDIT EXEMPT
  - A-026 (SCOPE_DECLARATION parity): FAIL — parking station log missing
  - A-029 (iaa_audit_token pre-population): PASS — not PENDING, valid format
  - A-031 (IAA ceremony artifact carve-out): APPLIED — IAA prebrief and token correctly carved out;
    parking station log is NOT an IAA-owned artifact so A-031 does not exempt it
```

---

## A-022 Re-Evaluation Finding

Three-dot diff (`git diff origin/main...HEAD --name-only`) contains ONLY:
1. `.agent-admin/assurance/iaa-prebrief-optimize-iaa-invocation-workflows.md` (IAA ceremony — A-031)
2. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-162-optimize-iaa-inject-watchdog-20260409.md`
3. `.agent-workspace/foreman-v2/memory/iaa-inject-watchdog-reimplementation-review-20260409.md`
4. `.agent-workspace/foreman-v2/memory/session-162-optimize-iaa-inject-watchdog-20260409.md`
5. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`
6. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
7. `SCOPE_DECLARATION.md`

Pre-brief EXEMPT classification confirmed. Two-dot diff showed governance/canon files but these
were NOT introduced by this branch (git log --follow returned empty for each governance file).
Classification: GOVERNANCE_AUDIT EXEMPT (PLANNING_ONLY) — CONFIRMED.

---

## HFMC Summary

- HFMC-01 Ripple: YES ✅
- HFMC-02 Scope parity: NO ❌ — parking station log missing from SCOPE_DECLARATION
- HFMC-03 Artifacts committed: YES ✅
- HFMC-04 Pre-brief: YES ✅
- HFMC-05 Token ceremony: N/A — REJECTION-PACKAGE (no token written)
- HFMC-06 Evidence bundle: YES ✅

---

## Substantive Quality Assessment

All substantive checks PASS. D1 review artifact is thorough and well-structured. Reimplementation
strategy is well-reasoned: RE-ENABLE inject, RETIRE gate, KEEP+ENHANCE watchdog, RETIRE+REPLACE
reanchor, KEEP manual audit report. iaa_audit_token correctly pre-populated. PREHANDOVER proof
has comprehensive Ripple assessment and §4.3b compliance. Only failure is ceremony-level.

---

## Suggestions for Improvement

**Primary finding — prevention action required (NO-REPEAT-PREVENTABLE-001)**:
Parking station log omission from SCOPE_DECLARATION is a preventable ceremony gap. The foreman
PREHANDOVER bundle completeness checklist lists parking station log as a bundle item but the
SCOPE_DECLARATION template does not prompt for it explicitly. Template hardening required:
`.agent-workspace/foreman-v2/parking-station/suggestions-log.md` should be listed in the
foreman wave SCOPE_DECLARATION template whenever an S-NNN entry is produced.

**Continuous improvement note**: The validate-scope-to-diff.sh script correctly identified the
gap (exit code 1). The script does not understand A-031 carve-outs — it flagged the IAA token
as EXTRA (false alarm) and the parking station as MISSING (genuine gap). Future enhancement:
add A-031 carve-out awareness to the script to reduce false alarms while preserving genuine gap
detection. Consider: script reads A-031 carve-out section from SCOPE_DECLARATION and excludes
those files from the "EXTRA" comparison.

---

## Parking Station

Entry to be logged in suggestions-log.md:
| 2026-04-09 | independent-assurance-agent | session-optimize-iaa-invocation-workflows-20260409 | REJECTION | HFMC-02: Parking station log missing from SCOPE_DECLARATION — foreman parking station is NOT an A-031 carve-out artifact; template hardening needed | session-optimize-iaa-invocation-workflows-20260409.md |

---

## Fail-Only-Once Updates

No new FAIL-ONLY-ONCE rule added this session. The HFMC-02 failure (parking station log
omission) is a variant of existing A-026 coverage. The specific variant (omitting a specific
foreman ceremony artifact rather than the full wave stale-name pattern) is covered by A-026
as written. If this same variant recurs in the next session, A-026 should be extended with
an explicit sub-rule noting parking station logs are always foreman deliverables that must
appear in SCOPE_DECLARATION when an S-NNN entry is produced in that wave.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**STOP-AND-FIX Mandate**: ACTIVE
