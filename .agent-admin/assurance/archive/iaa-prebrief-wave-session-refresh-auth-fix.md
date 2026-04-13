# IAA Pre-Brief Artifact — Wave: session-refresh-auth-fix

**Pre-Brief Reference**: `IAA-PREBRIEF-WAVE-SESSION-REFRESH-AUTH-FIX-20260309`
**Wave**: wave-session-refresh-auth-fix
**Branch**: `copilot/fix-session-refresh-auth-header`
**Issue**: maturion-isms — "Bug: Edge Function returns 401 unless session is refreshed before parsing (fix useCriteria.ts mutation)"
**Pre-Brief Invocation Date**: 2026-03-09
**IAA Session**: session-prebrief-wave-session-refresh-auth-fix-20260309
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Breach Context**: INC-AUTHFIX-IMPL-001 — REGISTERED in FAIL-ONLY-ONCE v3.5.0 (Foreman direct implementation — REVERSED per CS2 re-alignment directive 2026-03-09)

---

## Phase 0 Execution — Pre-Brief Mode Confirmed

**Invocation mode**: PRE-BRIEF (Phase 0 only). Phases 1–4 assurance will NOT be executed this session.
**Trigger**: `[IAA PRE-BRIEF REQUEST]` in invoking comment — explicit Phase 0 invocation.
**CS2 Authorisation**: CS2 FOREMAN RE-ALIGNMENT directive issued 2026-03-09 (INC-AUTHFIX-IMPL-001 corrective sequence).
**wave-current-tasks.md confirmed**: Present at `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — committed on branch `copilot/fix-session-refresh-auth-header`.

---

## Step 0.2 — Wave Scope Extracted from wave-current-tasks.md

**Wave Number**: wave-session-refresh-auth-fix
**Branch**: `copilot/fix-session-refresh-auth-header`

**Problem Statement**: Supabase Edge Function `invoke-ai-parse-criteria` returns `401 Unauthorized` even when the user appears logged in. Root cause: `supabase.functions.invoke()` does not automatically refresh a stale or expired session, so the `Authorization` header carries an invalid JWT.

**Fix**: In `modules/mat/frontend/src/lib/hooks/useCriteria.ts`, the `useTriggerAIParsing` hook's `mutationFn` must call `supabase.auth.getSession()` before calling `supabase.functions.invoke()` to guarantee the session is valid and the Authorization header is fresh.

**Scope boundaries (explicit)**:
- ✅ Single function `useTriggerAIParsing` in one file only
- ❌ No schema changes
- ❌ No migrations
- ❌ No Edge Function changes
- ❌ No CI/workflow changes
- ❌ No agent contract changes

**Tasks declared in wave-current-tasks.md**:

| Task ID | Assigned To | Description | Status at Pre-Brief |
|---------|-------------|-------------|---------------------|
| T-SRAF-GOV-001 | foreman-v2 | Record INC-AUTHFIX-IMPL-001 in FAIL-ONLY-ONCE v3.5.0; create wave-current-tasks.md; invoke IAA Pre-Brief | IN PROGRESS |
| T-SRAF-QA-001 | qa-builder | Define RED gate tests for session refresh logic (4 tests) | NOT STARTED — blocked on this Pre-Brief |
| T-SRAF-API-001 | api-builder | Implement session refresh fix in `useTriggerAIParsing` | NOT STARTED — blocked on T-SRAF-QA-001 RED gate |

---

## Step 0.3 — Qualifying Task Classification

All tasks evaluated against IAA Trigger Table v2.1.0.

| Task ID | Task Summary | IAA Trigger Category | IAA Required? | Rationale |
|---------|-------------|---------------------|--------------|-----------|
| T-SRAF-GOV-001 | Record FAIL-ONLY-ONCE breach; wave-current-tasks.md; IAA Pre-Brief | EXEMPT | NO (for this task's own artifacts) | wave-current-tasks.md = session memory. FAIL-ONLY-ONCE update is to the **Foreman's** registry (`.agent-workspace/foreman-v2/`), not IAA Tier 2 knowledge. No canon change. |
| T-SRAF-QA-001 | Write RED gate tests for session refresh logic | **AAWP_MAT** | **YES — MANDATORY** | Delivers executable test code for MAT frontend hook. Test files land in MAT test suite and must be verified by IAA for quality, correctness, and RED→GREEN compliance. |
| T-SRAF-API-001 | Implement session refresh fix in `useTriggerAIParsing` | **AAWP_MAT** | **YES — MANDATORY** | Directly modifies production code in `modules/mat/frontend/src/lib/hooks/useCriteria.ts`. Deliverable is executable application behaviour affecting auth security path. |

**Total qualifying tasks**: 2 (T-SRAF-QA-001, T-SRAF-API-001)
**Non-qualifying tasks**: 1 (T-SRAF-GOV-001 — governance admin/session memory)

---

## Step 0.4 — IAA Trigger Categories Declared

### Primary Category

**AAWP_MAT** — Both qualifying tasks deliver or verify executable MAT frontend application behaviour:

- `modules/mat/frontend/src/lib/hooks/useCriteria.ts` — production hook (T-SRAF-API-001)
- `modules/mat/frontend/src/lib/hooks/useCriteria.test.ts` (or equivalent test file path) — RED→GREEN test suite (T-SRAF-QA-001)

### Secondary / Mixed Category Check

**None declared. Confirmed absent**:
- ❌ `AGENT_CONTRACT` — No `.github/agents/*.md` files are in scope
- ❌ `CANON_GOVERNANCE` — No `governance/canon/` files are in scope
- ❌ `CI_WORKFLOW` — No `.github/workflows/` files are in scope
- ❌ `SCHEMA` — No migration files are in scope
- ❌ `KNOWLEDGE_GOVERNANCE` — The FAIL-ONLY-ONCE update is to the Foreman's registry, not IAA Tier 2 knowledge

> **AMBIGUITY STANDING INSTRUCTION**: If any builder produces a diff that includes files outside the declared scope (e.g., a CI file, an agent contract modification, or a canon document), IAA's trigger category automatically upgrades to **MIXED** for that delivery. This pre-brief must be re-evaluated before issuing the final assurance token. The builder agent producing out-of-scope files must disclose this immediately in their PREHANDOVER proof.

> **A-005 WATCH**: IAA will inspect the PR diff for any `.github/agents/*.md` modifications per FAIL-ONLY-ONCE A-005 / CORE-017. None are expected. Any such modification is an immediate REJECTION-PACKAGE unless produced by CodexAdvisor-agent with explicit CS2 authorisation.

---

## Step 0.5 — FFA Checks IAA Will Run at Handover

### Section A — Core Invariants (ALL checks apply to every triggered invocation)

IAA will execute CORE-001 through CORE-022 as defined in `iaa-core-invariants-checklist.md` v2.8.0.

**Key core checks with specific relevance to this wave**:

| Check | Specific Relevance to This Wave |
|-------|--------------------------------|
| CORE-007 | No stub/TODO in `useTriggerAIParsing` implementation or test code |
| CORE-013 | IAA invocation evidence present in PREHANDOVER proof |
| CORE-015 | Session memory file present on branch |
| CORE-016 | Dedicated IAA token file present at `.agent-admin/assurance/iaa-token-session-wave-session-refresh-auth-fix-20260309.md` |
| CORE-017 | No `.github/agents/` modifications in diff |
| CORE-018 | Complete evidence artifact sweep: PREHANDOVER proof + session memory + `iaa_audit_token` field + token file |
| CORE-019 | IAA token cross-verification: expected reference format present in PREHANDOVER proof |
| CORE-020 | Zero partial pass: no missing/blank evidence fields |
| CORE-021 | Zero-severity-tolerance: no "minor" or "trivial" characterisation of any finding |

### Section B — AAWP_MAT Category Overlay Checks

IAA will execute all checks from `iaa-category-overlays.md` v3.1.0 AAWP_MAT overlay:

#### BD-TIER-1 — Delivery Completeness

| Check | What IAA Will Verify for This Wave |
|-------|-----------------------------------|
| BD-001 | Full scope delivered: `useTriggerAIParsing` contains `getSession()` call before `functions.invoke()` AND throws `'Authentication required. Please sign in again.'` on session error/missing session |
| BD-002 | No stub/TODO in production path: complete implementation, no placeholder branches |
| BD-003 | One-time build: if merged and deployed today, the 401 error is resolved end-to-end without a follow-up fix |
| BD-004 | No leftover debt: no pre-existing failing tests or linter errors in the diff context |

#### BD-TIER-2 — Wiring & Integration

| Check | What IAA Will Verify for This Wave |
|-------|-----------------------------------|
| BD-005 | End-to-end wiring: `getSession()` → valid session → `functions.invoke()` path is correctly wired; error path throws expected message |
| BD-006 | Writers/readers: N/A — no new schema entities (explicitly out of scope) |
| BD-007 | Auth guard: The session check IS the auth guard for this function. IAA will verify it gates `functions.invoke()` correctly — i.e., `invoke()` is NEVER called when session is null or errored |
| BD-008 | FK/relational integrity: N/A — no schema changes |
| BD-009 | Cross-component integration fit: IAA will confirm the modified function signature/return type is unchanged — no calling components should break |
| BD-010 | No orphaned deliverables: new test file must be consumed by the test runner configuration |
| BD-015 | RLS policies: N/A — no new tables or RLS changes |

#### BD-TIER-3 — Test Quality & Zero Debt

| Check | What IAA Will Verify for This Wave |
|-------|-----------------------------------|
| BD-011 | All tests pass: all 81 existing tests GREEN + all new RED→GREEN tests GREEN. Test run evidence required |
| BD-012 | Zero test debt: no `.skip()`, `.only()`, `test.todo()`, or commented-out tests in any new or modified test file |
| BD-013 | No test dodging: each test asserts on real behaviour — see FFA Test Quality section below for specific required assertions |
| BD-014 | No deprecated APIs: `supabase.auth.getSession()` is confirmed current (not deprecated in favour of `getUser()`) |

**FFA Test Quality — Specific RED Gate Tests Required (from T-SRAF-QA-001)**:

IAA will verify that all four of the following test cases are present and non-trivially asserting:

| Test Case | Required Assertion | RED Condition |
|-----------|-------------------|--------------|
| (a) `mutationFn` calls `getSession` before `invoke` | `getSession` is called AND called before `invoke` in execution order | RED when `getSession` call is absent from code |
| (b) Throws on missing session (null session) | Error message EXACTLY matches `'Authentication required. Please sign in again.'` | RED when no session guard present |
| (c) Throws on sessionError | Error message EXACTLY matches `'Authentication required. Please sign in again.'` | RED when no session error guard present |
| (d) `invoke` only called with valid session | `functions.invoke()` is NOT called when session is missing or errored | RED when invoke is called regardless of session state |

> **IAA will reject any test that**:
> - Only checks that the function throws (without checking the exact message)
> - Uses a vacuous mock that always succeeds regardless of code logic
> - Does not mock `supabase.auth.getSession` correctly (should return `{ data: { session: null }, error: null }` for "missing session" case and `{ data: { session: null }, error: new Error(...) }` for "sessionError" case)

#### BD-TIER-4 — Security Review

| Check | What IAA Will Verify for This Wave |
|-------|-----------------------------------|
| BD-016 | No hardcoded secrets: no API keys, tokens, or credentials in implementation or test code |
| BD-017 | Input validation: `getSession()` return value is correctly validated (null check on `session`, truthy check on `sessionError`) |
| BD-018 | No injection vectors: session check is a guard, not a data-processing path — low risk, but IAA will confirm no raw JWT manipulation |

> **Security note**: IAA will specifically verify that `getSession()` is used (not `getUser()`) for this use case. `getSession()` is the correct Supabase method for ensuring a fresh token is used in `functions.invoke()`. If the implementation uses a deprecated or incorrect method, BD-014 and BD-017 will fail.

#### BD-TIER-5 — Code Quality

| Check | What IAA Will Verify for This Wave |
|-------|-----------------------------------|
| BD-020 | Clean structure: the `getSession` block is minimal (3–4 lines) — no god function expansion |
| BD-021 | TypeScript strictness: destructuring pattern `const { data: { session }, error: sessionError }` is correctly typed; no unsafe `as` casts |
| BD-022 | Architecture alignment: fix matches the issue specification exactly — no deviation from the target code pattern in the issue body |
| BD-024 | Could it be done better: IAA will note if `refreshSession()` or `setSession()` would be more appropriate, but this is advisory only if `getSession()` achieves the stated fix |

#### BD-TIER-6 — FFA Summary

IAA will produce the full FFA Result block at handover:
```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL]
  FFA-02 Wiring Verification: [PASS|FAIL]
  FFA-03 Integration Fit: [PASS|FAIL]
  FFA-04 Security: [PASS|FAIL]
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL]
  FFA-06 One-Time Build: [PASS|FAIL]
  FFA-CARRY-FORWARD: [NONE|ISSUED]
```

### Section C — FAIL-ONLY-ONCE Rules Applied at Handover

| Rule | Applicability to This Wave |
|------|--------------------------|
| A-001 | IAA invocation evidence must be in PREHANDOVER proof |
| A-002 | No class exemption claim (api-builder, qa-builder — all subject to IAA) |
| A-003 | Ambiguity resolves to mandatory invocation |
| A-004 | Bootstrap directive compliance (not auditable post-hoc, but INC-AUTHFIX-IMPL-001 confirms the violation was caught and reversed) |
| A-005 | No `.github/agents/` modifications by unauthorised agent |
| A-006 | PHASE_A_ADVISORY fabrication detection (iaa_audit_token must contain real reference, not bare date) |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony — N/A this wave (no IAA Tier 2 changes) |
| A-029 | §4.3b artifact immutability: PREHANDOVER proof is read-only post-commit; IAA token in separate file |
| A-032 | Schema column compliance — N/A (no INSERT/SELECT schema operations changed in this fix) |

**INC-AUTHFIX-IMPL-001 Specific Check**: IAA will verify at handover that:
1. The PREHANDOVER proof explicitly references INC-AUTHFIX-IMPL-001 and declares its status as REMEDIATED
2. The code change was NOT present at the time of Pre-Brief invocation (code reverted per CS2 directive — verifiable via git log)
3. The corrective sequence was followed: Pre-Brief → QA RED gate → Implementation → GREEN → Handover

---

## Step 0.6 — Required PREHANDOVER Proof Structure

The producing agents (qa-builder for T-SRAF-QA-001, api-builder for T-SRAF-API-001) and the Foreman (T-SRAF-GOV-001 completion) must produce a **single PREHANDOVER proof** on the branch before invoking IAA for final assurance. The proof must contain all of the following fields:

```markdown
# PREHANDOVER PROOF — wave-session-refresh-auth-fix

## Wave Identity
- wave: wave-session-refresh-auth-fix
- branch: copilot/fix-session-refresh-auth-header
- session: session-wave-session-refresh-auth-fix-20260309
- date: 2026-03-09

## Tasks Completed
- T-SRAF-GOV-001: [status] — [summary]
- T-SRAF-QA-001: [status] — [summary: N RED→GREEN tests written, file path]
- T-SRAF-API-001: [status] — [summary: session refresh fix implemented]

## INC-AUTHFIX-IMPL-001 Status
- breach_registered: YES (FAIL-ONLY-ONCE v3.5.0)
- code_reverted_before_pre_brief: YES (confirmed by git log)
- corrective_sequence_followed: YES
- status: REMEDIATED

## Implementation Evidence
- file_modified: modules/mat/frontend/src/lib/hooks/useCriteria.ts
- function_modified: useTriggerAIParsing
- getSession_called_before_invoke: [YES/NO — must be YES]
- auth_error_throw_message_exact: 'Authentication required. Please sign in again.'
- invoke_gated_on_valid_session: [YES/NO — must be YES]

## Test Evidence
- test_file_path: [path to test file]
- tests_added: [count] (minimum 4 — covering test cases a, b, c, d from T-SRAF-QA-001)
- red_gate_confirmed: [YES/NO — evidence that tests were RED before implementation]
- green_gate_confirmed: [YES/NO — all tests pass after implementation]
- existing_test_count_before: 81
- existing_test_count_after: [81 + N]
- all_tests_pass: [YES/NO — must be YES]
- test_run_evidence: [CI run URL or local run output excerpt]

## Session Memory
- session_memory_file: .agent-workspace/[producing-agent]/memory/session-wave-session-refresh-auth-fix-20260309.md
- session_memory_present: [YES/NO — must be YES]

## IAA Audit Token (pre-populated expected reference)
- iaa_audit_token: IAA-session-wave-session-refresh-auth-fix-20260309-PASS
```

> **Note on `iaa_audit_token`**: Per A-029 §4.3b architecture, the PREHANDOVER proof is committed BEFORE IAA runs and is **read-only** thereafter. The `iaa_audit_token` field is pre-populated with the expected token reference (`IAA-session-wave-session-refresh-auth-fix-20260309-PASS`). IAA will write the actual verdict to a dedicated token file. The PREHANDOVER proof MUST NOT be edited after initial commit.

> **Note on RED gate evidence**: The qa-builder must provide verifiable evidence that the tests were RED before the api-builder implemented the fix. Acceptable formats: (a) commit SHA of the test file commit before implementation, or (b) test run output screenshot/log showing RED state, or (c) statement in PREHANDOVER proof citing the commit order (test commit SHA → implementation commit SHA).

---

## Step 0.5 — Scope Blockers and Governance Conflicts

### Confirmed Blockers at Pre-Brief Time

| Item | Type | Status | Action Required |
|------|------|--------|----------------|
| INC-AUTHFIX-IMPL-001 | Governance breach (POLC violation) | REGISTERED — corrective sequence underway | Complete corrective sequence as declared in wave-current-tasks.md; declare REMEDIATED in PREHANDOVER proof |
| T-SRAF-QA-001 → T-SRAF-API-001 dependency | Process gate | ACTIVE — T-SRAF-API-001 blocked on RED gate | Do not start implementation until qa-builder RED tests are confirmed and committed |

### Governance Conflicts — None Identified

- No agent contract changes in scope → no AGENT_CONTRACT conflict
- No canon changes in scope → no CANON_GOVERNANCE conflict
- No CI/workflow changes in scope → no CI_WORKFLOW conflict
- No schema changes in scope → no SCHEMA conflict
- IAA Tier 2 knowledge is not modified by this wave → no KNOWLEDGE_GOVERNANCE trigger

### Potential Risk Flags (Non-Blocking at Pre-Brief)

1. **`getSession()` vs `refreshSession()` / `getUser()`**: IAA notes that `supabase.auth.getSession()` retrieves the current cached session without forcing a network refresh. If the underlying issue is a truly expired JWT (not just stale), `getSession()` may return a session with an expired token. The correct Supabase pattern for ensuring a fresh JWT before a function call may require `supabase.auth.getSession()` combined with checking session expiry, or using `refreshSession()` if expiry is detected. IAA will evaluate at handover whether the implemented fix genuinely resolves the 401 in the stated root cause scenario. If IAA determines the fix is insufficient to address the root cause (stale/expired JWT), this will be raised as a BD-003 / BD-024 finding.

   > **Pre-Brief Advisory**: The issue specification explicitly prescribes `getSession()` as the fix — IAA will apply BD-022 (architecture alignment) and accept the specified approach unless it can be positively demonstrated to be incorrect for the stated use case.

2. **Test file placement**: The test file for `useCriteria.ts` must be placed in a location consistent with the existing test suite structure (e.g., `modules/mat/frontend/src/lib/hooks/useCriteria.test.ts` or the equivalent wave15r test directory). IAA will apply BD-010 (no orphaned deliverables) to confirm the test file is discoverable by the test runner.

3. **Exact error message string**: Test case (b) and (c) check the EXACT error message `'Authentication required. Please sign in again.'`. IAA will verify implementation and tests use the identical string (case-sensitive, punctuation-exact). A mismatch will fail BD-013.

---

## Step 0.6 — Dependency Chain Summary

```
✅ IAA Pre-Brief Received (this artifact)
  ↓
🔴 T-SRAF-QA-001 (qa-builder: 4 RED gate tests — committed before implementation)
  ↓ CST Gate: all 4 new tests confirmed RED
🔴 T-SRAF-API-001 (api-builder: session refresh fix in useTriggerAIParsing)
  ↓ All tests GREEN (81 existing + N new = all pass)
✅ T-SRAF-GOV-001 completion (Foreman: PREHANDOVER proof + session memory + INC-AUTHFIX-IMPL-001 REMEDIATED)
  ↓
🔴 IAA Final Assurance Audit (Phases 1–4) → ASSURANCE-TOKEN or REJECTION-PACKAGE
  ↓
🔴 CS2 review and merge approval
```

---

## Pre-Brief Confirmation

**Pre-Brief Status**: COMPLETE  
**Pre-Brief artifact path**: `.agent-admin/assurance/iaa-prebrief-wave-session-refresh-auth-fix.md`  
**Qualifying tasks identified**: 2 (T-SRAF-QA-001, T-SRAF-API-001)  
**IAA Trigger Category**: AAWP_MAT  
**Blockers visible at pre-brief**: INC-AUTHFIX-IMPL-001 corrective sequence underway (no hard blockers after pre-brief receipt)  
**IAA availability for final assurance**: AVAILABLE — invoke IAA after all qualifying tasks are complete and PREHANDOVER proof is committed  

> The Foreman may now unblock T-SRAF-QA-001 and initiate the dependency chain per the wave task registry. IAA does not need to be re-invoked until PREHANDOVER proof is committed and all tests are GREEN.

---

*IAA Pre-Brief issued by: independent-assurance-agent*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*  
*Contract Version: 2.2.0 | IAA Version: 6.2.0*  
*Adoption Phase: PHASE_B_BLOCKING — Hard gate ACTIVE*
