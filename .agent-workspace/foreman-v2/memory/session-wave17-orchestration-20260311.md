# Session Memory — foreman-v2-agent — Wave 17

**Session ID**: session-wave17-orchestration-20260311
**Date**: 2026-03-11
**Agent Version**: foreman-v2-agent v6.2.0 (contract 2.7.0)
**Branch**: copilot/implement-user-guided-ai-parsing

---

## Preflight Attestation

```yaml
fail_only_once_attested: true
fail_only_once_version: 3.7.0
unresolved_breaches: none
canon_inventory_check: PASS
tier2_loaded: true
prior_sessions_reviewed: [session-wave16-2R-20260310, session-wave-ldcs-parse-bugfix-20260310, session-wave-polc-boundary-fix-1052-20260310, session-wave-wf-contract-audit-20260310, session-wave16-full-batch-20260310]
unresolved_items_from_prior_sessions: none
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md
prebrief_wave: 17
prebrief_tasks_count: 5
```

---

## Wave Summary

**Wave**: 17 — User-Guided AI Parsing Instruction System
**Design defect corrected**: MAT-DES-PARSE-001 (Hardcoded Parsing Strategy)
**Entry gate**: RED tests + IAA Pre-Brief + CS2 authorization (issue opened by CS2)

---

## Roles Invoked

```yaml
roles_invoked:
  - POLC-Orchestration
  - Quality-Professor
```

## Mode Transitions

```yaml
mode_transitions:
  - PREFLIGHT → POLC-Orchestration (Phase 2 complete, Phase 3 begin)
  - POLC-Orchestration → Quality-Professor (after each builder handover)
  - Quality-Professor → POLC-Orchestration (QP PASS → next batch)
  - POLC-Orchestration → Phase-4-Handover (all batches QP PASS)
```

---

## Agents Delegated To

| Agent | Task | Batch | Status |
|-------|------|-------|--------|
| independent-assurance-agent | IAA Pre-Brief — Wave 17 | Pre-brief | COMPLETE |
| schema-builder | parsing_instructions column + parsing_instruction_templates table + RLS + seed | Batch A | COMPLETE ✅ |
| api-builder | parsing.py user_instructions + split prompt architecture | Batch B | COMPLETE ✅ |
| api-builder | Edge Function user_instructions forwarding + DB storage | Batch C | COMPLETE ✅ |
| ui-builder | ParsingInstructionsModal + CriteriaUpload + useCriteria hook | Batch D | COMPLETE ✅ |
| qa-builder | T-W17-QA-001 to T-W17-QA-012 test suite | Batch E | COMPLETE ✅ |
| independent-assurance-agent | IAA Final Audit | Phase 4 | PENDING |

---

## QP Verdicts

| Batch | Builder | Verdict |
|-------|---------|---------|
| A | schema-builder | PASS |
| B+C | api-builder | PASS |
| D | ui-builder | PASS |
| E | qa-builder | PASS (17/17 GREEN + 14/14 regression GREEN) |

---

## Escalations Triggered

```yaml
escalations_triggered: none
```

---

## Separation Violations Detected

```yaml
separation_violations_detected: none
```

---

## IAA Pre-Brief Scope Blockers Addressed

1. ✅ wave-current-tasks.md updated to Wave 17 (was stale at wave-ai-criteria-creation-fix)
2. ✅ Prompt injection mitigation: `user_instructions` in user-role message + XML delimiters + length-bound 10,000 chars
3. ✅ System template protection: `is_system = false` guard in all write RLS policies
4. ✅ Edge Function fire-and-forget: `parsing_instructions` write-back in synchronous path (before waitUntil)
5. ✅ criteria_documents UPDATE RLS: service-role used by Edge Function bypasses RLS (confirmed)

---

## Suggestions for Improvement

1. **Multi-tenancy scoping for parsing_instruction_templates**: The UNIQUE constraint on `name` is global across all users. A future wave should consider changing to `UNIQUE(created_by, name)` or adding an `organisation_id` FK to scope templates per organization, consistent with other MAT tables.

2. **BUILD_PROGRESS_TRACKER update**: MAT-DES-PARSE-001 should be marked RESOLVED in BUILD_PROGRESS_TRACKER after CS2 sign-off. No automated mechanism currently handles this.

3. **CodeQL environment limitation**: CodeQL checker timed out in the sandbox environment. Consider adding a dedicated CodeQL GitHub Actions step to the CI pipeline for this PR's changes as a post-merge verification.

---

## Parking Station Entry

_Entry appended to suggestions-log.md below._

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Wave close gate**: Requires CS2 live LDCS verification + MAT-DES-PARSE-001 RESOLVED marking
