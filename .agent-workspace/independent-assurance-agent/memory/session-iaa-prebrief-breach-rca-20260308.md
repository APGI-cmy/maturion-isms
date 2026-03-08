# IAA Session Memory — iaa-prebrief-breach-rca-20260308

| Field | Value |
|-------|-------|
| `session_id` | iaa-prebrief-breach-rca-20260308 |
| `date` | 2026-03-08 |
| `pr_reviewed` | N/A — Phase 0 PRE-BRIEF invocation only. No PR assurance this session. |
| `invoking_agent` | Triggered by IAA PRE-BRIEF REQUEST comment on issue #1013 / wave breach-rca-20260308 |
| `producing_agent` | foreman-v2-agent (wave work not yet produced — pre-brief is pre-production) |
| `producing_agent_class` | foreman |
| `pr_category` | KNOWLEDGE_GOVERNANCE (primary) — T-RCA-001 modifies `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` |
| `checks_executed` | 0 — Phase 0 only. Phases 2–4 checks will execute at handover. |
| `checks_passed` | 0 |
| `checks_failed` | 0 |
| `merge_gate_parity_result` | N/A — Pre-Brief session, no parity check run |
| `verdict` | PRE-BRIEF ISSUED — not an assurance verdict |
| `token_reference` | N/A — no token issued this session |
| `token_file_path` | N/A |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-patch-T075-isolation-20260308-R3, R2, R1, session-wave15-schemadrift-20260307, session-cwt-envvars-20260307 |

---

## Pre-Brief Artifact

| Field | Value |
|-------|-------|
| Path | `.agent-admin/assurance/iaa-prebrief-breach-rca-20260308.md` |
| Commit SHA | `0518d42` (local — push pending, 403 in CI environment) |
| Wave | breach-rca-20260308 |
| Qualifying tasks | 1 (T-RCA-001 — KNOWLEDGE_GOVERNANCE trigger) |
| Total tasks declared | 3 (T-RCA-001, T-RCA-002, T-RCA-003) |

---

## Qualifying Tasks Found

| Task ID | Trigger Category | IAA Required? |
|---------|-----------------|---------------|
| T-RCA-001 | KNOWLEDGE_GOVERNANCE | YES — MANDATORY (Tier 2 knowledge file) |
| T-RCA-002 | Session memory only → EXEMPT | Governed by T-RCA-001 trigger |
| T-RCA-003 | Parking station → EXEMPT | Governed by T-RCA-001 trigger |

---

## Scope Blockers Identified

| # | Blocker | Rule | Severity |
|---|---------|------|----------|
| 1 | SCOPE_DECLARATION.md is stale — contains prior T075 wave content | A-029 (Foreman), A-026 (IAA), A-028 | BLOCKING — must fix before IAA invocation |
| 2 | A-rule ID confirmation — next available ID is A-031 (A-032 is CANDIDATE-only) | OVL-KG-004 | Non-blocking but must be verified |

---

## fail_only_once_rules_applied

| Rule | Applied? | Outcome |
|------|----------|---------|
| A-001 | YES | Attested — invocation evidence required at handover |
| A-002 | YES | Attested — Foreman class not exempt |
| A-015 | YES | Attested — Tier 2 knowledge patch requires PREHANDOVER ceremony |
| A-021 | YES | Flagged in Pre-Brief — all artifacts must be committed before invocation |
| A-025 | YES | Flagged — no PENDING in iaa_audit_token |
| A-026 | YES | Scope Blocker 1 — stale SCOPE_DECLARATION identified |
| A-028 | YES | Reinforced in Pre-Brief |
| A-029 (IAA) | YES | PREHANDOVER immutability §4.3b required |

---

## fail_only_once_updates

None this session — Pre-Brief sessions do not add new rules. Observations noted in learning_notes below.

---

## learning_notes

1. **SCOPE_DECLARATION.md stale content is a persistent pattern**: This is the 4th occurrence (A-026/A-028/A-029 rules exist precisely because of prior T075, wave15, and CWT-envvars sessions). The Foreman must establish a session-start habit of `cat /dev/null > SCOPE_DECLARATION.md` as the first file operation of any wave.

2. **A-rule ID gap awareness**: The existence of A-032 CANDIDATE in the Foreman FAIL-ONLY-ONCE.md creates a potential confusion trap. Clearly communicating in the Pre-Brief that A-031 is the next available ID (not A-033) reduces the risk of ID collision errors at handover.

3. **Ripple to contract vs. Tier 2 only**: The NO-IMPLEMENT-001 violation may or may not require a Foreman contract change. Pre-Brief surfaces this decision point early so the Foreman can resolve it before committing, rather than discovering it at IAA audit.

---

## Suggestions for Improvement

The Pre-Brief format is working well as a proactive governance tool. One concrete improvement: the wave-current-tasks.md should include a `iaa_prebrief_path` field that is updated when the Pre-Brief is issued, so that Foreman session startup can verify the Pre-Brief exists before beginning task work. Currently the field shows `PENDING` until IAA writes the artifact — but after IAA commits, the Foreman has no automated signal that the Pre-Brief is available for reference. A simple path reference in the tasks file would close this gap.

---

## Parking Station

Entry appended to IAA parking station suggestions log (see separate parking station update).

---

**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session type**: Phase 0 PRE-BRIEF — no Phases 2–4 executed
