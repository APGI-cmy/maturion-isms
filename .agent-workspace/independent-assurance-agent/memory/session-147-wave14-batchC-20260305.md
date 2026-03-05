# IAA Session Memory — session-147 / Wave 14 Batch C Final Audit / 2026-03-05

## Session Header

| Field | Value |
|-------|-------|
| `session_id` | session-147 |
| `date` | 2026-03-05 |
| `agent` | independent-assurance-agent v6.2.0 |
| `pr_reviewed` | Issue #909 — Wave 14 Batch C: Finalise MAT remaining gap closure and QA acceptance / branch: copilot/finalise-mat-gap-closure |
| `invoking_agent` | foreman-v2-agent v6.2.0 (session-142) |
| `producing_agent` | schema-builder (TASK-W14-BC-001, TASK-W14-BC-002), mat-specialist (TASK-W14-BC-003, TASK-W14-BC-004) |
| `producing_agent_class` | builder |
| `pr_category` | AAWP_MAT |
| `checks_executed` | 39 (6 FAIL-ONLY-ONCE + 10 CORE active + 20 BD-TIER + 3 OVL-AM-CST/CWT/FCWT) |
| `checks_passed` | 37 |
| `checks_failed` | 2 (FINDING-BC-001, FINDING-BC-002) |
| `merge_gate_parity_result` | FAIL — governance/alignment gate: 2 check failures |
| `verdict` | REJECTION-PACKAGE |
| `token_reference` | IAA-session-142-wave14-batchC-20260305-REJECTION |
| `token_file` | `.agent-admin/assurance/iaa-token-session-142-wave14-batchC-20260305.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `invocation_type` | FIRST INVOCATION for this PR (Wave 14 Batch C) |

---

## Prior Sessions Reviewed

| Session | Wave | Verdict |
|---------|------|---------|
| session-146 | Ripple #935 (4th invocation) | ASSURANCE-TOKEN |
| session-145 | Ripple #935 (3rd invocation) | REJECTION-PACKAGE |
| session-144 | Ripple #935 (2nd invocation) | REJECTION-PACKAGE |
| session-143 | Ripple #935 (1st invocation) | REJECTION-PACKAGE |
| session-142 | Ripple #921 (governance) | ASSURANCE-TOKEN |

**Unresolved items carried forward**: None.
**Open REJECTION-PACKAGEs from prior sessions**: None applicable to this PR.

---

## Failures Cited

### FINDING-BC-001 — BD-003 / BD-005

**Check**: BD-003 (One-time build compliance) + BD-005 (End-to-end wiring)
**Finding**: `aggregate_scores` migration internal contradiction.
- Migration comment acknowledges PostgreSQL NULLs are distinct in UNIQUE constraints
- Migration comment simultaneously says "multiple overall scores are NOT expected" and "ON CONFLICT (audit_id, level_type, scope_id) DO UPDATE is the intended UPSERT pattern"
- These are contradictory: ON CONFLICT cannot detect conflicts for NULL scope_id rows
- Scoring compute function (future implementation) will INSERT duplicates instead of updating
- IAA pre-brief security spotlight explicitly required confirmation of partial index or COALESCE — neither is present
- PREHANDOVER characterisation misrepresented the migration comment (said "permitted — intentional" when migration says "NOT expected")

**Fix required**: Choose one of:
(a) Add partial unique index: `CREATE UNIQUE INDEX aggregate_scores_null_scope_unique ON public.aggregate_scores (audit_id, level_type) WHERE scope_id IS NULL;`
(b) Correct comment to document DELETE+INSERT (not UPSERT) for NULL scope_id, remove misleading ON CONFLICT instruction
(c) Use non-NULL sentinel UUID for "no scope" in application layer

### FINDING-BC-002 — OVL-AM-CWT-01

**Check**: OVL-AM-CWT-01 (CWT mandatory before IBWR completion)
**Finding**: Wave 14 Batch C is the wave IBWR closing point (all 15 GAPs now closed). No CWT PASS verdict exists in any Wave 14 artifact. Post-implementation assurance report has test counts (706+) but not a formal CWT PASS verdict with scope breakdown (waves covered, modules covered, scenarios covered). Wave 13 had dedicated `wave13-cwt-evidence-20260303.md` — Wave 14 has no equivalent.

**Fix required**:
(a) Commission Wave 14 CWT via qa-builder
(b) Create `modules/mat/05-build-evidence/wave14-cwt-evidence-YYYYMMDD.md`
(c) Per A-029 (PREHANDOVER immutable), reference CWT artifact in a new file (correction addendum per A-030 pattern), commit, push, re-invoke IAA

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | YES — IAA invocation evidence check | PASS — PREHANDOVER proof committed |
| A-002 | YES — class exemption check | PASS — no class exemption claims |
| A-021 | YES — commit before invoke | PASS — working tree clean, all 9 files committed |
| A-022 | YES — re-evaluate trigger categories | APPLIED — AAWP_MAT confirmed, no new categories |
| A-026 | YES — SCOPE_DECLARATION exact match | PASS — 9/9 files declared, matches diff exactly |
| A-029 | YES — PREHANDOVER immutable | PASS — iaa_audit_token pre-populated correctly |

---

## Substantive Assessment — What Passed

The Wave 14 Batch C schema migrations are substantively well-implemented. Key positives:

- 20/20 Batch C tests GREEN — verified by live test run
- Zero regressions (706/715, 9 pre-existing live-env unchanged)
- Both migrations idempotent with IF NOT EXISTS guards throughout
- All 6 new tables have correct FK chains with ON DELETE CASCADE
- RLS policies correctly implemented — org-isolation via profile→organisation_id join
- Public-read posture for maturity_levels/scoring_rules intentional, pre-brief verified
- Migration 000008 (prior batch) correctly consolidates RLS — ordering dependency documented
- No TODOs/stubs/placeholders in any production artifact
- PREHANDOVER fully compliant (A-021, A-026, A-028, A-029)
- SCOPE_DECLARATION exactly matches PR diff (9/9 files)
- Pre-brief security spotlight items 1 and 3 adequately addressed — item 2 (NULL UNIQUE) is the gap

The two findings are targeted and specific. Resolution is straightforward.

---

## FAIL-ONLY-ONCE Updates

No new rules added this session. Both findings are covered by existing checks (BD-003/BD-005 and OVL-AM-CWT-01).

However, a learning observation is recorded (see below) that may warrant future codification.

---

## Learning Notes

1. **Pre-brief security spotlight partial satisfaction**: The IAA pre-brief for TASK-W14-BC-002 explicitly flagged the NULL UNIQUE issue and required confirmation of a partial index or COALESCE. The producing agent's PREHANDOVER characterised the migration as intentionally allowing multiple NULLs ("permitted — intentional") — mischaracterising the migration's own comment which says "NOT expected." The pre-brief spotlight generated a correct flag, but the handover response to that flag was incorrect. This pattern suggests the pre-brief spotlight acknowledgment in PREHANDOVER proofs should be verified against the actual artifact content, not just acknowledged as "addressed."

2. **CWT gap at wave close**: Wave 14 Batch C is the wave IBWR. The foreman session memory contains "CWT requirement noted" but no CWT was commissioned. The pre-brief did not flag CWT as a required artifact for Batch C (only TASK-W14-BC-001 and BC-002 were flagged as QUALIFYING). This means the pre-brief could be improved to explicitly flag CWT as a REQUIRED artifact when the task list represents the FINAL BATCH of a multi-batch wave. Consider adding a pre-brief rule: "If this batch closes all remaining wave GAPs (i.e., no further batches expected), CWT is mandatory and must be listed as a required artifact in the pre-brief."

3. **Aggregate_scores UNIQUE semantics pattern**: The NULL UNIQUE issue in PostgreSQL is a well-known trap. When a migration creates a UNIQUE constraint over a nullable column AND documents an ON CONFLICT UPSERT pattern, IAA should always verify whether the conflict detection will actually fire for NULL values. This is a recurring risk in Supabase schema migrations where nullable FK columns are part of composite UNIQUE keys. Consider adding a specific check in the AAWP_MAT overlay for this pattern.

---

## Suggestions for Improvement (MANDATORY — NEVER BLANK)

**Improvement 1 (substantive)**: Add a AAWP_MAT overlay check specifically for nullable columns in UNIQUE constraints where ON CONFLICT is the stated UPSERT pattern. The current BD-015 and BD-005 cover this conceptually but a targeted check for "UNIQUE constraint over nullable column + documented ON CONFLICT pattern → verify NULL conflict detection" would catch this faster in future sessions.

**Improvement 2 (pre-brief)**: The IAA pre-brief Phase 0 logic should include: if the foreman's wave-current-tasks.md shows this batch closes ALL remaining wave GAPs (i.e., all prior GAPs are now CLOSED), automatically add "Wave CWT required — QUALIFYING" to the pre-brief artifact. The current pre-brief only classifies declared tasks, not the wave-level closure implications. A wave-close detector would prevent the CWT gap.

---

## Parking Station Entry

Appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`.

---

## Session Close Status

| Item | Status |
|------|--------|
| Rejection token file written | `.agent-admin/assurance/iaa-token-session-142-wave14-batchC-20260305.md` ✅ |
| Session memory written | `.agent-workspace/independent-assurance-agent/memory/session-147-wave14-batchC-20260305.md` ✅ |
| Parking station updated | `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` ✅ |
| Verdict returned to invoking agent | REJECTION-PACKAGE ✅ |
| PREHANDOVER proof | UNCHANGED — immutable per A-029 ✅ |
