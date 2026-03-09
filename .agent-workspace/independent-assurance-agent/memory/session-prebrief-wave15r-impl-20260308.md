# IAA Session Memory — session-prebrief-wave15r-impl-20260308

| Field | Value |
|-------|-------|
| `session_id` | session-prebrief-wave15r-impl-20260308 |
| `date` | 2026-03-08 |
| `pr_reviewed` | N/A — Phase 0 PRE-BRIEF invocation only. No PR assurance this session. |
| `invoking_agent` | Triggered by [IAA PRE-BRIEF REQUEST] comment for wave15r-impl / Issue #997 |
| `producing_agent` | foreman-v2-agent (wave work not yet produced — pre-brief is pre-production) |
| `producing_agent_class` | foreman |
| `pr_category` | AAWP_MAT (single category — no mixed conditions detected) |
| `checks_executed` | 0 — Phase 0 only. Phases 2–4 checks execute at handover. |
| `checks_passed` | 0 |
| `checks_failed` | 0 |
| `merge_gate_parity_result` | N/A — Pre-Brief session, no parity check run |
| `verdict` | PRE-BRIEF ISSUED — not an assurance verdict |
| `token_reference` | N/A — no token issued this session |
| `token_file_path` | N/A |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-prebrief-wave15r-20260308, session-wave15r-gov-20260308-R2, session-rca-breach-20260308-R2, session-patch-T075-isolation-20260308-R3, session-wave15-schemadrift-20260307 |

---

## Pre-Brief Artifact

| Field | Value |
|-------|-------|
| Path | `.agent-admin/assurance/iaa-prebrief-wave15r-impl.md` |
| Pre-Brief Ref | IAA-PREBRIEF-WAVE15R-IMPL-20260308 |
| Wave | wave15r-impl — Wave 15R Implementation (Criteria Parsing Pipeline Remediation) |
| Issue | maturion-isms#997 |
| Branch | copilot/commission-api-ui-qa-builders |
| Qualifying tasks | 12 |
| Trigger category | AAWP_MAT |
| Hard blockers declared | 3 (B-002: Edge Function deployment, B-003: AI_GATEWAY_URL runtime evidence, B-004: alert() removal) |
| Advisory items declared | 2 (B-001: wave-current-tasks.md stale, B-007: ceremony model not declared) |

---

## Qualifying Tasks Found

| Task ID | Trigger Category | IAA Required? |
|---------|-----------------|---------------|
| T-W15R-API-001 | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-002 | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-003 | AAWP_MAT | YES — MANDATORY |
| T-W15R-API-004 | AAWP_MAT (conditional) | YES — if diff exists |
| T-W15R-IMPL-PLAN | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-001 | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-002 | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-003 | AAWP_MAT | YES — MANDATORY |
| T-W15R-UI-004 | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-001 | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-002 | AAWP_MAT | YES — MANDATORY |
| T-W15R-QA-003 | AAWP_MAT | YES — MANDATORY |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied? | Outcome |
|------|----------|---------|
| A-001 | YES | Attested — PREHANDOVER must reference pre-brief token IAA-PREBRIEF-WAVE15R-IMPL-20260308 |
| A-002 | YES | Attested — Foreman/builder classes not exempt from IAA |
| A-003 | YES | No ambiguity in trigger category — AAWP_MAT unambiguous |
| A-015 | N/A | No KNOWLEDGE_GOVERNANCE category in this wave |
| A-021 | NOTED | Will enforce at handover — all deliverables committed before IAA invocation |
| A-022 | YES | Trigger categories re-evaluated fresh this session — AAWP_MAT confirmed (no MIXED) |
| A-025 | NOTED | Will enforce — iaa_audit_token must use expected reference format at PREHANDOVER commit time |
| A-026 | NOTED | wave-current-tasks.md stale (wave15r-gov) — Foreman must update before PREHANDOVER commit |
| A-028 | NOTED | SCOPE_DECLARATION.md format compliance enforced at handover |
| A-029 | NOTED | PREHANDOVER immutable post-commit; IAA writes dedicated token file |

---

## CST/CWT Obligations Declared

| Gate | When | Mandatory |
|------|------|-----------|
| CST Batch A→B | Before ui-builder starts Batch B | YES — cross-boundary: backend (Edge Function + AI Gateway) → frontend |
| CST Batch B→C | Before qa-builder starts Batch C | YES — frontend integration with verified backend complete |
| CWT Wave 15R | Before IBWR completion | YES — constitutional requirement |

---

## Scope Blockers Declared

| Blocker | Severity | Resolution |
|---------|----------|-----------|
| B-002: Edge Function not deployed to production | HARD | api-builder must provide HTTP 200 evidence from live endpoint |
| B-003: AI_GATEWAY_URL not set in production runtime | HARD | api-builder must provide runtime log evidence |
| B-004: alert() in CriteriaUpload.tsx | HARD | ui-builder must replace with React state |
| B-001: wave-current-tasks.md stale | ADVISORY | Foreman must update before PREHANDOVER |
| B-007: Ceremony model not declared | ADVISORY | Foreman must declare Option A or B before commissioning api-builder |

---

## Suggestions for Improvement

**S-001 (Actionable)**: This is the second consecutive pre-brief for a wave15r sub-wave
(first was wave15r-gov, now wave15r-impl). The wave-current-tasks.md was stale for BOTH.
This confirms the pattern first noted in session-prebrief-wave15r-20260308 is systemic:
Foreman does not update wave-current-tasks.md before commissioning the IAA Pre-Brief when
the wave transitions from governance to implementation. Recommending this be codified as
a formal rule (candidate for A-031 or foreman-level workflow update).

**S-002 (Process)**: This wave has three builders working sequentially with strict gate
conditions. The ceremony model (Option A vs Option B) has a significant impact on IAA
invocation frequency. Pre-Brief should include a required ceremony model declaration
step — Foreman should be required to state the model in their first wave task. Adding
this to the PREHANDOVER template as a required field going forward.

---

## fail_only_once_updates

**Candidate for A-031**: "Foreman must update wave-current-tasks.md before commissioning
IAA Pre-Brief for any sub-wave or transition wave (gov→impl). Recurrence: wave15r-gov
(session-prebrief-wave15r-20260308) and wave15r-impl (this session). If this pattern
recurs once more, formalize as A-031."
Current status: CANDIDATE (2 occurrences — 1 more recurrence triggers formal rule).

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0
