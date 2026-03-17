# IAA Session Memory — Wave 19 Audit

**Session ID**: session-wave19-orchestration-20260317
**Date**: 2026-03-17
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING

---

## Session Fields

```yaml
session_id: session-wave19-orchestration-20260317
date: 2026-03-17
pr_reviewed: "Wave 19 — MAT Criteria Parsing Holistic Repair (branch: copilot/wave-19-holistic-mat-criteria-repair, issue #1137)"
invoking_agent: foreman-v2-agent
producing_agent: "qa-builder (Batches A, F), schema-builder (Batch B), api-builder (Batch C), ui-builder (Batch D), integration-builder (Batch E)"
producing_agent_class: builder

pr_category: AAWP_MAT (PRIMARY) / CI_WORKFLOW (SECONDARY)
checks_executed: 30
checks_passed: 24
checks_failed: 6
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave19-orchestration-20260317-REJECTION-R1
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING

prior_sessions_reviewed:
  - session-wave18-postmerge-hotfix-20260315-AUDIT
  - session-wave16-full-batch-20260310
  - (3 earlier sessions noted as context)

failures_cited:
  - check: CORE-021 / A-021
    description: "3 commits not pushed to origin before IAA invocation (Batch C, E, F all local-only)"
    fix: "git push origin copilot/wave-19-holistic-mat-criteria-repair; confirm CI GREEN"
  - check: CORE-013 / CORE-018
    description: "PREHANDOVER-session-wave19-orchestration-20260317.md does not exist (file absent, not just empty)"
    fix: "Create full PREHANDOVER proof per AGENT_HANDOVER_AUTOMATION.md template, commit to branch"
  - check: CORE-015
    description: "Foreman session memory untracked — not committed before IAA invocation"
    fix: "git add + commit session memory before re-invocation"
  - check: CORE-016 / A-029
    description: "iaa_audit_token not pre-populated — flows from PREHANDOVER absence"
    fix: "Include iaa_audit_token: IAA-session-wave19-orchestration-20260317-PASS in PREHANDOVER"
  - check: CORE-022 / A-026
    description: "SCOPE_DECLARATION.md shows previous wave (node-ripple) — 12 Wave 19 files absent"
    fix: "Overwrite SCOPE_DECLARATION.md with Wave 19 file list, add A-031 carve-out, commit+push"
  - check: OVL-AM-CWT-01
    description: "No CWT PASS evidence — final audit requires cumulative regression confirmation"
    fix: "Execute CWT through Wave 19, record PASS verdict with scope in PREHANDOVER"
```

---

## FAIL-ONLY-ONCE Rules Applied

```yaml
fail_only_once_rules_applied:
  - rule: A-001
    outcome: "FAIL — PREHANDOVER proof absent; IAA invocation evidence not verifiable"
  - rule: A-021
    outcome: "FAIL — 3 commits local-only, not pushed before IAA invocation"
  - rule: A-026
    outcome: "FAIL — SCOPE_DECLARATION stale, shows previous wave content"
  - rule: A-029
    outcome: "FAIL — iaa_audit_token pre-population not verifiable (PREHANDOVER absent)"
  - rule: A-002
    outcome: "PASS — no agent class exemption claimed; no agent contracts in this PR"
  - rule: A-032
    outcome: "PASS — all INSERT/SELECT columns verified against migration DDL"
```

---

## Build Quality Note

The substantive build quality is STRONG and production-ready. All 14 T-W19-NNN TypeScript
tests PASS (independently verified by IAA running vitest: 14/14 PASS, 313ms). Migration DDL is
correct, idempotent, and well-annotated. AD-W19-001/002/003 honoured. RPC is atomic. Edge Function
returns 500 synchronously for missing AI_GATEWAY_URL. MpsResult model correct. Poll timeout correct.

All 6 failures are ceremony and push-hygiene — not code quality defects.

---

## Learning Notes

1. **A-021 remains the highest-frequency Wave 19 failure pattern.** This is the third major
   wave where commits were not pushed before IAA invocation. The A-027 rule (third consecutive
   A-021 = systemic gap) applies. Foreman should add a mandatory Pre-IAA Commit Gate step to the
   PREHANDOVER template with `git status` + `git log origin/<branch>..HEAD` evidence required
   before the template can be considered complete.

2. **PREHANDOVER proof absence (not just empty) is a new failure mode.** Prior sessions showed
   empty PREHANDOVER proofs; this session shows the file was never created at all. The distinction
   matters: an empty file suggests partial ceremony; an absent file suggests the ceremony was
   entirely skipped. Consider adding a pre-IAA-invocation checklist that explicitly asks
   "PREHANDOVER proof file EXISTS and is non-empty? YES/NO" as the first check.

3. **OVL-AM-CWT-01 continues to be under-applied.** Wave 18 and Wave 19 both lacked explicit
   CWT PASS evidence despite having green test suites. The 14-test GREEN result is not CWT.
   CWT requires running the cumulative regression across all prior waves. This distinction must be
   more prominent in the Foreman's wave closure checklist.

4. **A-026 SCOPE_DECLARATION staleness persists wave-over-wave.** The SCOPE_DECLARATION was
   last updated for Wave Node Ripple and was not regenerated for Wave 19. The fix is simple
   (one command) but is consistently missed. Embedding `git diff --name-only origin/main...HEAD`
   output as a literal attachment in the PREHANDOVER template would make stale declarations
   immediately visible.

---

## Suggestions for Improvement (MANDATORY — must not be blank)

1. **Pre-IAA Commit Gate enforcement**: The PREHANDOVER template should have a mandatory
   "Pre-IAA Commit Gate" section at the very top — above all other fields — that requires:
   ```bash
   git status                             # must show: nothing to commit
   git log origin/<branch>..HEAD          # must show: no output (0 unpushed commits)
   ```
   Both commands' actual outputs must be attached as literal text in the template. A template
   with empty Pre-IAA Commit Gate fields is a PREHANDOVER template violation (per A-020).
   This would mechanically prevent A-021 failures.

2. **CWT evidence section in PREHANDOVER template**: Add a mandatory `## CWT PASS` section
   to the PREHANDOVER template with required sub-fields (`waves_covered`, `modules_covered`,
   `scenarios_covered`, `verdict`, `command`, `output_reference`). An empty/missing CWT section
   should be a mandatory REJECTION-PACKAGE finding. This encodes OVL-AM-CWT-01 directly into
   the ceremony template and prevents recurring omissions.

3. **SCOPE_DECLARATION auto-generation hint**: Add a one-liner to the PREHANDOVER template as
   a comment: `# Run: git diff --name-only origin/main...HEAD | sort to populate this section`.
   The mechanical reminder reduces the cognitive load of remembering A-026 requirements.

---

## Fail-Only-Once Updates

The following rule addition is recommended to CS2/CodexAdvisor based on this session:

**Proposed A-034**: PREHANDOVER proof must physically exist as a committed file before IAA
invocation. An absent PREHANDOVER file (not just empty) is a distinct failure from an empty file —
the distinction matters for classification and fix path. IAA must distinguish between
"file absent" and "file empty" in CORE-013 evidence descriptions. This would close a gap in the
existing A-029 rule which focuses on token pre-population but does not explicitly address the
prior condition of file existence.

---

## Parking Station Entry

See `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session**: session-wave19-orchestration-20260317 | Date: 2026-03-17
