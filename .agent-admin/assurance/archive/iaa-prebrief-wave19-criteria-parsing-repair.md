# IAA Pre-Brief — Wave 19: MAT Criteria Parsing Holistic Repair

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave**: Wave 19 — MAT Criteria Parsing Holistic Repair
**Branch**: copilot/wave-19-holistic-mat-criteria-repair
**Issue**: maturion-isms#1137 — [Wave 19] Implement holistic MAT Criteria Parsing repair per governance gap register and plan
**Pre-Brief authored by**: independent-assurance-agent v6.2.0
**Date**: 2026-03-17
**Authority**: CS2 (@APGI-cmy) | INDEPENDENT_ASSURANCE_AGENT_CANON.md
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.
**Gap register source**: `modules/mat/00-app-description/CRITERIA-PARSING-GAP-REGISTER.md`
**Plan source**: `modules/mat/00-app-description/WAVE-19-PLAN-PROPOSAL.md`

---

## 1. Wave Summary

Wave 19 is a full-stack BUILD wave addressing all 12 production gaps in the MAT Criteria Parsing
pipeline identified by Foreman in Issue #1135 (GOV wave). The pipeline is entirely non-functional
in production (CS2 SQL probes confirm 0 rows in both `audit_logs` and `criteria`). This wave
restores lossless, transactional, end-to-end criteria parsing from document upload through to UI.

**Gap coverage**: GAP-PARSE-001 through GAP-PARSE-012 (all 12 gaps)
**Test coverage**: T-W19-001 through T-W19-016 (16 tests, QA-to-Red MUST precede all builds)
**Batches**: A (QA-Red) → B (Schema) → C (API/Edge) → D (UI) → E (Integration) → F (E2E)

---

## 2. IAA Trigger Category Declaration

This wave triggers **TWO** IAA categories:

| Category | Reason | Applicable Tasks |
|----------|--------|-----------------|
| **AAWP_MAT** (PRIMARY) | Schema migrations, Edge Function code, AI Gateway Python updates, UI hook changes, QA test suite, E2E fixtures — all are build deliverables for the MAT module | All batches A, B, C, D, E (excluding T-W19E-004), F |
| **CI_WORKFLOW** (SECONDARY) | T-W19E-004 adds a CI schema validation check (`modules/mat hook columns vs migrations`) — this modifies a CI pipeline | T-W19E-004 only |

**No AGENT_CONTRACT trigger**: No agent contracts are modified in this wave.
**No CANON_GOVERNANCE trigger**: No canon or governance documents are authored in this wave (governance docs were committed in Wave GOV #1135/#1136).

IAA's assurance focus for this wave:
- **90% effort** (quality): Do the builds work? Are tests genuinely RED before implementation? Do all 16 tests go GREEN? Is the schema correct? Is the RPC truly atomic? Are env validations fail-fast? Does poll timeout surface properly in UI?
- **10% effort** (ceremony): Existence checks — PREHANDOVER proof present? Token reference pre-populated? Session memory written?

---

## 3. Qualifying Tasks and Per-Task IAA Declarations

### BATCH A — QA-to-Red (Delegated to: qa-builder)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19A-001 through T-W19A-012 |
| **Task Summary** | Write 16 RED QA tests (T-W19-001 to T-W19-016) covering all 12 gaps. Tests must FAIL before any implementation begins. No stubs permitted. |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | Test output file showing all 16 T-W19-NNN tests FAILING (RED); test bodies inspected for real assertions (not `expect(true).toBe(true)` stubs); Foreman QP sign-off on test quality |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | **CRITICAL CHECK**: IAA must confirm tests are genuinely RED — not stubs, not skipped, not `todo()`. Test bodies must contain real assertions against actual schema/runtime behaviour. A stub test that always fails is a governance breach equivalent to dodging the gate. |
| **Acceptance gate for IAA** | CI output showing 16 FAIL, 0 PASS, 0 skip for T-W19-NNN suite. Any PASS at this stage is a FAIL for IAA (implementation happened before red). |

---

### BATCH B — Schema Migrations (Delegated to: schema-builder)

**Depends on**: Batch A complete (RED tests confirmed)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19B-001, T-W19B-002, T-W19B-003, T-W19B-004 |
| **Task Summary** | (1) ALTER criteria.number INTEGER→TEXT; (2) ADD MPS intent_statement + guidance columns; (3) CREATE parse_write_back_atomic() RPC; (4) RLS policies for new MPS columns |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | Migration SQL files present (20260317000001, 20260317000002, 20260317000003); T-W19-002 GREEN (criteria.number TEXT); T-W19-003 GREEN (MPS columns exist); T-W19-008 transitioning GREEN after Batch C |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) `criteria.number` migration must use `USING number::TEXT` — not a destructive drop/recreate. (2) RPC `parse_write_back_atomic` must use a single DB transaction wrapping all domain + MPS + criteria inserts — IAA will verify this by inspecting the function body. (3) AD-W19-001 architecture decision: `mini_performance_standards.number` stays INTEGER — only `criteria.number` changes. Any migration touching MPS.number type is a scope violation. (4) RLS policies for new MPS columns must be present and consistent with existing MPS RLS pattern. |
| **Risk flag** | R-W19-001: Verify all frontend usages of `criteria.number` handle TEXT after migration. IAA will spot-check. |

---

### BATCH C — API / Edge Function Updates (Delegated to: api-builder)

**Depends on**: Batch B complete (schema migrations applied)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19C-001 through T-W19C-009 |
| **Task Summary** | Edge Function: use c.number, write MPS intent/guidance, zero-insert assertion, atomic RPC wiring, startup validation. AI Gateway: add MpsResult intent/guidance fields + system prompt update + SUPABASE_STORAGE_URL startup assertion. |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | T-W19-001 GREEN (criteria.number = '1.4.1'); T-W19-004 GREEN (MPS intent_statement extracted); T-W19-007 GREEN (zero-insert → parse_failed); T-W19-008 GREEN (partial write rolled back); T-W19-010 GREEN (AI_GATEWAY_URL='' → 500); T-W19-012 GREEN (MPS AI extraction); T-W19-016 GREEN (SUPABASE_STORAGE_URL='' → ValueError) |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) Edge Function must call `supabase.rpc('parse_write_back_atomic', ...)` — NOT direct sequential upserts. Residual `supabase.from(...).upsert()` calls for domains/MPS/criteria in the same flow = scope violation. (2) T-W19C-005 startup validation must return HTTP 500 **synchronously** (before 202 is sent) — a 202 followed by a parse_failed log is NOT acceptable. (3) AI Gateway system prompt update (T-W19C-007) must ask for MPS-level `intent_statement` AND `guidance` extraction — not just one field. (4) `c.number` in Edge Function must be passed as a string — no parseInt or coercion. (5) Zero-insert assertion threshold: if ALL of domains + MPS + criteria = 0, treat as failure. If only criteria = 0 but domains > 0, this may also warrant a failure — IAA will verify the assertion logic covers the LDCS use case. |

---

### BATCH D — UI Update (Delegated to: ui-builder)

**Depends on**: Batch A complete (RED test T-W19-013 exists)

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19D-001 |
| **Task Summary** | Add poll timeout to `usePollCriteriaDocumentStatus`: max 30 min / ~600 iterations; surface user-visible error on timeout. |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | T-W19-013 GREEN (poll timeout surfaces error); existing criteria hook tests remain GREEN (no regression) |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) Poll timeout must surface a **user-visible error message** — not a silent state reset. An invisible timeout is the same bug in different clothes. (2) The 30-minute / 600-iteration limit is the architecture decision (AD-W19-003) — any significant deviation requires CS2 re-approval. (3) Must not break the existing happy-path polling behaviour (status transitions to `pending_review` or `parse_failed` before timeout). |

---

### BATCH E — Integration / Environment Configuration (Delegated to: integration-builder)

**Depends on**: Batches B, C complete

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19E-001, T-W19E-002, T-W19E-003, T-W19E-004 |
| **Task Summary** | Configure `AI_GATEWAY_URL` in Supabase Edge Function secrets; configure `SUPABASE_STORAGE_URL` in Render; update `.env.example`; add CI schema validation check. |
| **IAA Trigger Category** | AAWP_MAT (T-W19E-001, 002, 003) + CI_WORKFLOW (T-W19E-004) |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay + CI_WORKFLOW overlay), Phase 4 |
| **Required Evidence Artifacts** | `.env.example` updated with canonical env var list; CI schema diff check added and passing; T-W19-009 GREEN (staging health check); T-W19-011 GREEN (CI schema validation); T-W19-005 + T-W19-006 GREEN (production/staging parse events confirmed) |
| **Applicable Overlays** | AAWP_MAT overlay + CI_WORKFLOW overlay |
| **Specific IAA Rules** | (1) T-W19E-001 and T-W19E-002 are ops-configuration tasks — IAA cannot directly verify runtime secrets. Evidence must include a staging test (T-W19-009) that confirms the configured URL is reachable. (2) CI schema validation (T-W19E-004) must not break any existing CI checks. IAA will verify the new CI job does not introduce a flaky check. (3) `.env.example` must document ALL required vars: `AI_GATEWAY_URL`, `SUPABASE_STORAGE_URL`, and any others identified during RC-011 resolution. No undocumented vars permitted. |

---

### BATCH F — E2E Validation (Delegated to: qa-builder + mat-specialist)

**Depends on**: All batches A–E complete

| Field | Value |
|-------|-------|
| **Task IDs** | T-W19F-001, T-W19F-002, T-W19F-003 |
| **Task Summary** | Create LDCS test fixture (known document → known expected output); E2E content assertion test (upload → assert criteria count + hierarchy + number format); E2E staging smoke test. |
| **IAA Trigger Category** | AAWP_MAT |
| **Required Phases at Handover** | Phase 2, Phase 3 (AAWP overlay), Phase 4 |
| **Required Evidence Artifacts** | LDCS test fixture committed to test assets; T-W19-014 GREEN (E2E content assertion); T-W19-015 GREEN (number format assertion); T-W19-005 + T-W19-006 GREEN (staging smoke); all 16 T-W19-NNN GREEN |
| **Applicable Overlays** | AAWP_MAT category overlay |
| **Specific IAA Rules** | (1) LDCS fixture must be a real LDCS-format document (or a trimmed representative subset) — a synthetic fixture that trivially satisfies the assertions is a governance breach. (2) T-W19-014 content assertion must verify **specific field values** (e.g., `criteria.number = '1.4.1'`, `mps.intent_statement IS NOT NULL`) — not just row count. (3) Staging smoke test (T-W19F-003) must produce an actual `criteria_parsed` audit_log row — not just a 202 response from the Edge Function. |

---

## 4. Complete FFA (Final Fitness-for-Assurance) Checks at Handover

IAA will execute the following checks at handover (Phase 3 + Phase 4 of final audit):

### 4.1 Test Suite Checks (BLOCKING — zero tolerance)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-001 | All 16 T-W19-NNN tests GREEN in CI | CI run shows 16 PASS, 0 FAIL, 0 skip for T-W19-NNN suite |
| FFA-002 | No Wave 18 / Wave 15 test regressions | All pre-existing MAT tests GREEN; compare against baseline |
| FFA-003 | No stub / TODO / always-pass tests in T-W19 suite | Each T-W19-NNN test body contains real assertions targeting actual behaviour |
| FFA-004 | Batch A RED state was confirmed before Batch B commenced | Evidence artifact (CI output) showing T-W19-NNN RED before first migration commit |

### 4.2 Schema Correctness Checks (BLOCKING)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-005 | `criteria.number` is TEXT type in migration | Migration SQL uses `ALTER COLUMN number TYPE TEXT USING number::TEXT` |
| FFA-006 | `mini_performance_standards.number` is still INTEGER | No migration touches MPS.number column type (AD-W19-001 compliance) |
| FFA-007 | `mini_performance_standards.intent_statement TEXT` column exists | Migration present; T-W19-003 GREEN |
| FFA-008 | `mini_performance_standards.guidance TEXT` column exists | Migration present; T-W19-003 GREEN |
| FFA-009 | `parse_write_back_atomic` RPC exists and wraps all inserts in one transaction | Function body inspected; `BEGIN`/`COMMIT` or equivalent present |
| FFA-010 | RLS policies for new MPS columns present and consistent with existing pattern | Migration includes RLS; no exposed columns |

### 4.3 API / Edge Function Correctness Checks (BLOCKING)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-011 | Edge Function uses `c.number` (not `idx + 1`) for criteria number | `idx + 1` pattern absent from criteria upsert path |
| FFA-012 | Edge Function calls atomic RPC (not sequential upserts) | `supabase.rpc('parse_write_back_atomic', ...)` is the write path; no residual direct upserts for domain/MPS/criteria |
| FFA-013 | Edge Function startup: empty `AI_GATEWAY_URL` returns HTTP 500 synchronously | T-W19-010 GREEN; verified that 500 is returned before background task is spawned |
| FFA-014 | AI Gateway `MpsResult` has `intent_statement: str` and `guidance: str` fields | Python model definition inspected |
| FFA-015 | AI Gateway system prompt explicitly asks for MPS `intent_statement` AND `guidance` | Prompt text inspected; both fields explicitly requested |
| FFA-016 | AI Gateway startup: empty `SUPABASE_STORAGE_URL` raises `ValueError` | T-W19-016 GREEN; startup validation present in `parsing.py` or `main.py` |
| FFA-017 | Zero-insert assertion fires and writes `criteria_parse_failed` when all counts = 0 | T-W19-007 GREEN; assertion covers domains=0 AND mps=0 AND criteria=0 case |

### 4.4 UI / Hook Checks (BLOCKING)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-018 | `usePollCriteriaDocumentStatus` has max poll count ≤ 600 (30 min at 3s interval) | Code inspection; `refetchIntervalInBackground` or iteration counter present |
| FFA-019 | Poll timeout surfaces user-visible error (not silent state reset) | T-W19-013 GREEN; error state rendered to user |

### 4.5 E2E / Staging Checks (BLOCKING)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-020 | Staging smoke test produces `criteria_parsed` audit_log row | T-W19-005 + T-W19-006 GREEN with real staging assertion |
| FFA-021 | Criteria number format is hierarchical string ('1.4.1') in staging DB | T-W19-001 + T-W19-015 GREEN |
| FFA-022 | LDCS fixture is a real LDCS-format document (not synthetic stub) | Fixture file reviewed; contains recognisable LDCS structure |

### 4.6 Ceremony / Governance Checks (Non-blocking admin — 10% IAA effort)

| Check ID | Description | Pass Condition |
|----------|-------------|----------------|
| FFA-023 | PREHANDOVER proof present | `PREHANDOVER_PROOF.md` or equivalent committed to branch |
| FFA-024 | IAA audit token reference pre-populated in PREHANDOVER proof | `iaa_audit_token` field contains expected reference format `IAA-session-NNN-waveY-YYYYMMDD-PASS` |
| FFA-025 | SCOPE_DECLARATION.md matches actual diff | No undeclared files in PR diff |
| FFA-026 | `CRITERIA-PARSING-GAP-REGISTER.md` gaps updated to CLOSED status | All 12 gaps marked CLOSED (or MONITORING for GAP-PARSE-007) |
| FFA-027 | `.env.example` updated with all required env vars | File includes `AI_GATEWAY_URL` and `SUPABASE_STORAGE_URL` documentation |
| FFA-028 | CI schema validation check (T-W19E-004) passes and does not break existing CI | New CI job GREEN; no existing jobs broken |

---

## 5. Required PREHANDOVER Proof Structure

The producing agent(s) must commit a PREHANDOVER proof containing the following fields.
Absence of any BLOCKING field is a hard REJECTION-PACKAGE trigger.

```yaml
# PREHANDOVER PROOF — Wave 19: MAT Criteria Parsing Holistic Repair
# Required structure declared by IAA Pre-Brief 2026-03-17

document_type: PREHANDOVER_PROOF
wave: wave-19-holistic-mat-criteria-repair
issue: maturion-isms#1137
branch: copilot/wave-19-holistic-mat-criteria-repair
producing_agent: <agent-class and version>
session_id: <session-NNN>
date: <YYYY-MM-DD>

# --- BLOCKING FIELDS (all required) ---

# Test evidence
test_suite_result: <all 16 T-W19-NNN PASS | CI run URL or log excerpt>
test_batch_a_red_evidence: <CI output or log showing 16 RED before Batch B>
wave18_regression_check: <PASS — N existing tests GREEN | or list of regressions>
stub_test_check: CONFIRMED_NO_STUBS

# Schema evidence
migration_criteria_number_text: <migration filename — 20260317000001_...>
migration_mps_columns: <migration filename — 20260317000002_...>
migration_atomic_rpc: <migration filename — 20260317000003_...>
mps_number_unchanged: CONFIRMED_INTEGER

# API / Edge Function evidence
edge_fn_uses_c_number: CONFIRMED
edge_fn_uses_atomic_rpc: CONFIRMED
edge_fn_startup_validation: CONFIRMED_500_ON_EMPTY_URL
ai_gateway_mps_result_updated: CONFIRMED
ai_gateway_system_prompt_updated: CONFIRMED
ai_gateway_startup_validation: CONFIRMED_VALUEERROR_ON_EMPTY_URL
zero_insert_assertion: CONFIRMED

# UI evidence
poll_timeout_implemented: CONFIRMED
poll_timeout_value: 30min / 600 iterations (per AD-W19-003)
poll_timeout_user_visible_error: CONFIRMED

# E2E / Staging evidence
staging_smoke_test: <PASS — audit_log criteria_parsed row confirmed>
staging_criteria_number_format: <sample: '1.4.1' confirmed>
ldcs_fixture_type: REAL_LDCS_FORMAT (not synthetic)

# Governance / Ceremony
scope_declaration_matches_diff: CONFIRMED
gap_register_updated: CONFIRMED_ALL_GAPS_CLOSED
env_example_updated: CONFIRMED
ci_schema_validation_check: CONFIRMED_PASSING

# IAA Token (pre-populated as per §4.3b architecture)
iaa_audit_token: IAA-session-NNN-wave19-YYYYMMDD-PASS
# ↑ Replace NNN and YYYYMMDD with actual values at commit time
```

**Critical note**: Per FAIL-ONLY-ONCE A-029 and §4.3b architecture:
- The `iaa_audit_token` field is **pre-populated** with the expected reference at commit time.
- IAA writes its verdict to a **dedicated new token file** (`.agent-admin/assurance/iaa-token-session-NNN-wave19-YYYYMMDD.md`).
- The PREHANDOVER proof is **read-only** after initial commit — IAA does NOT edit it.

---

## 6. Scope Blockers and Governance Conflicts Visible Now

### BLOCKER-W19-001 — QA-to-Red Sequencing Is Non-Negotiable

**Status**: 🔴 ACTIVE GOVERNANCE CONSTRAINT (pre-emptive block)
**Description**: The wave plan is explicit: Batch A (QA-to-Red) MUST complete before any
builder receives an implementation task. If Foreman delegates Batches B/C before T-W19-NNN
tests are RED and verified, this is a POLC violation and IAA will issue REJECTION-PACKAGE
regardless of implementation quality.
**IAA action at handover**: Verify Batch A RED evidence is dated BEFORE first Batch B commit.

---

### BLOCKER-W19-002 — T-W19E-004 CI Change Triggers CI_WORKFLOW Overlay

**Status**: 🟡 ADVISORY (not a blocker — declare and verify)
**Description**: T-W19E-004 adds a CI schema validation check. This triggers the CI_WORKFLOW
overlay in addition to AAWP_MAT. The CI overlay requires IAA to verify the new CI check does
not introduce flakiness or break any existing CI jobs.
**IAA action at handover**: Run CI_WORKFLOW overlay checks for T-W19E-004 specifically.

---

### BLOCKER-W19-003 — Architecture Decision AD-W19-001 Scope Lock

**Status**: 🔴 ACTIVE GOVERNANCE CONSTRAINT (scope lock)
**Description**: AD-W19-001 locks the following: `criteria.number` → TEXT (required), but
`mini_performance_standards.number` → stays INTEGER (explicitly confirmed). Any migration
that changes `mps.number` column type will be treated as an unauthorized scope change and
trigger REJECTION-PACKAGE.
**IAA action at handover**: Inspect all migration files; confirm no MPS.number type change.

---

### BLOCKER-W19-004 — Atomic RPC Must Be a Single DB Transaction

**Status**: 🔴 ACTIVE GOVERNANCE CONSTRAINT (quality gate)
**Description**: GAP-PARSE-005 root cause was sequential non-transactional inserts. The fix
(T-W19B-003 + T-W19C-004) must produce a genuinely atomic RPC. An RPC that internally calls
separate supabase-js upserts without transaction wrapping is the same bug repackaged.
**IAA action at handover**: Inspect `parse_write_back_atomic` function body for transaction boundary.

---

### BLOCKER-W19-005 — Staging Environment Configuration Dependency (RC-001, RC-009)

**Status**: 🟡 ADVISORY (ops dependency — IAA cannot verify directly)
**Description**: T-W19E-001 and T-W19E-002 require configuring secrets in Supabase and Render.
These are ops-level changes IAA cannot verify by code inspection alone. The staging smoke tests
(T-W19-005, T-W19-006, T-W19-009) are the only indirect evidence IAA can assess.
**IAA action at handover**: Verify T-W19-005, T-W19-006, T-W19-009 are GREEN with real staging assertions (not mocked).

---

### ADVISORY-W19-001 — R-W19-001 Frontend Sort/Display Risk

**Status**: 🟡 ADVISORY (risk — verify at handover)
**Description**: Changing `criteria.number` from INTEGER to TEXT may break existing frontend
sort/display logic that expects numeric comparison. The risk register flags this as MEDIUM/HIGH.
**IAA action at handover**: Spot-check frontend code for `criteria.number` usages; verify Wave 18
tests that cover criteria display remain GREEN.

---

### ADVISORY-W19-002 — GAP-PARSE-007 Legacy Overlap (Monitoring Only)

**Status**: 🟢 MONITORING (T-W19-011 CI check is the mitigation)
**Description**: Legacy MAT (`apps/maturion-maturity-legacy/`) and new MAT (`modules/mat/`)
coexist. GAP-PARSE-007 is classified MEDIUM/MONITORING, not CRITICAL. The CI schema diff check
(T-W19E-004 / T-W19-011) is the declared mitigation. IAA will verify T-W19-011 is GREEN.

---

## 7. Summary — Pre-Brief Outcome

| Item | Value |
|------|-------|
| **Qualifying tasks found** | All 6 batches (A–F), 28 task IDs across 12 gap remediations |
| **IAA trigger categories** | AAWP_MAT (primary) + CI_WORKFLOW (T-W19E-004 only) |
| **FFA checks declared** | 28 checks (FFA-001 through FFA-028) |
| **BLOCKING FFA checks** | 22 (FFA-001 through FFA-022) |
| **Ceremony/admin FFA checks** | 6 (FFA-023 through FFA-028) |
| **PREHANDOVER proof fields required** | 30 fields (see §5 above) |
| **Active scope blockers** | 3 (BLOCKER-W19-001, -003, -004 are hard gates) |
| **Active advisories** | 2 (BLOCKER-W19-002 CI overlay, BLOCKER-W19-005 ops deps) |
| **Monitoring items** | 1 (ADVISORY-W19-002 legacy overlap) |
| **IAA adoption phase** | PHASE_B_BLOCKING — hard gate ACTIVE |
| **Verdict type at handover** | ASSURANCE-TOKEN (PASS) or REJECTION-PACKAGE (FAIL) — binary only |

---

*IAA Pre-Brief committed: .agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md*
*Authority: CS2 (@APGI-cmy) | independent-assurance-agent v6.2.0*
*Phase 0 PRE-BRIEF mode — Phases 1–4 not executed in this session.*
