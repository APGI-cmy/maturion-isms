# IAA Pre-Brief — Wave: patch-T075-isolation

**Agent**: independent-assurance-agent
**Pre-Brief Version**: 1.0.0
**Wave**: patch-T075-isolation
**Branch**: `copilot/fix-isolate-build-persistent-memory-test`
**Issue**: [Agent Task] fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination
**Date Issued**: 2026-03-08
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger (invoked via wave-current-tasks.md)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Phase 0 Invocation Confirmation

This Pre-Brief was triggered by the `IAA_PRE_BRIEF_PROTOCOL.md §Trigger` pattern in the wave
request comment. Per contract §Phase 0, this is a **Pre-Brief invocation only**. IAA is
generating and committing the Pre-Brief artifact and STOPPING. Phases 1–4 full assurance
will execute only after the builder (qa-builder) submits the completed PR for handover.

---

## Wave Scope Summary

| Field | Value |
|-------|-------|
| Wave slug | `patch-T075-isolation` |
| Single file changed | `api/ai/request.test.ts` |
| Task count | 1 |
| Task ID | T-T075-ISO-001 |
| Builder | qa-builder |
| Production code changes | NONE — test isolation fix only |

**Root Cause (documented)**: T-075-1 `buildPersistentMemory() stores and retrieves entries (non-null behaviour)` calls `buildPersistentMemory()` directly, which uses the real Supabase client when env vars are present. The fixed `organisationId: 'org-red-001'` causes entries from concurrent/parallel CI workflow runs to accumulate across runs, producing up to 9 results when the test expects exactly 1.

---

## Qualifying Task Inventory

| Task ID | Task Summary | Qualifying? | Reason |
|---------|-------------|------------|--------|
| T-T075-ISO-001 | Update T-075-1 test in `api/ai/request.test.ts`: use fresh `makeTestSupabaseClient()`-backed `SupabasePersistentMemoryAdapter` + unique `organisationId: 'org-red-${Date.now()}'` to isolate from cross-run contamination | **YES** | Modifies test behaviour in an AAWP/MAT deliverable module (`api/ai/`). Falls under BUILD_DELIVERABLE / AAWP_MAT trigger. |

---

## IAA Trigger Category Declaration

### Primary Category: **AAWP_MAT / BUILD_DELIVERABLE**

**Rationale**: `api/ai/request.test.ts` is the test suite for the core AI Centre request handler
in the AAWP/MAT delivery scope. Changes to this file — even test-only isolation fixes —
fall under the BUILD_DELIVERABLE overlay because:

1. The test directly exercises production behaviour of `SupabasePersistentMemoryAdapter` via a real Supabase client pathway.
2. A broken isolation fix could introduce false-positive test passes (vacuous tests / test dodging — BD-013).
3. The CI pipeline runs this test against a shared Supabase environment — a botched fix could re-introduce the contamination it intends to fix.

**Secondary triggers checked and cleared**:

| Trigger | Status | Reasoning |
|---------|--------|-----------|
| AGENT_CONTRACT | NOT TRIGGERED | No `.github/agents/` files modified |
| CANON_GOVERNANCE | NOT TRIGGERED | No `governance/canon/` files modified |
| CI_WORKFLOW | NOT TRIGGERED | No `.github/workflows/` files modified |
| KNOWLEDGE_GOVERNANCE | NOT TRIGGERED | No `.agent-workspace/*/knowledge/` files modified |
| AGENT_INTEGRITY | NOT TRIGGERED | No `governance/quality/agent-integrity/` files modified |
| MIXED | NOT TRIGGERED | Single-category change |

**AMBIGUITY CHECK**: Classification is unambiguous. Category = `AAWP_MAT`. IAA = MANDATORY.

---

## FFA Checks IAA Will Run at Handover

IAA will run the full BUILD_DELIVERABLE overlay (Phases 3–4) at handover. The following FFA
checks are specifically relevant to this wave's scope and will be the **substantive focus
(90% effort)**:

| FFA Check | IAA Focus for This Wave |
|-----------|------------------------|
| **FFA-01 Delivery Completeness** | Verify T-075-1 is updated exactly as specified: (a) `SupabasePersistentMemoryAdapter` instantiated via `makeTestSupabaseClient()`, (b) `organisationId` uses `org-red-${Date.now()}`, (c) no other tests modified beyond scope. |
| **FFA-02 Wiring Verification** | Confirm `makeTestSupabaseClient()` is correctly imported; `SupabasePersistentMemoryAdapter` is constructable from the test utility; the adapter's `persist()` and `retrieve()` methods are called on the same fresh instance (no shared state leakage). |
| **FFA-03 Integration Fit** | Verify the fix does not break the T-075-1 test's actual intent: `expect(results).toHaveLength(1)` must assert on real behaviour of the adapter, not on a vacuous mock. The adapter must actually write to and read from a distinct, isolated scope per run. |
| **FFA-04 Security** | Confirm no credentials or real Supabase connection strings are hardcoded. `makeTestSupabaseClient()` must use test-env variables only. Check for BD-016 (no hardcoded secrets). |
| **FFA-05 Code Quality** | No `.skip()`, `.only()`, `test.todo()`, or commented-out assertions. No TODO/FIXME/stub content in updated test code. |
| **FFA-06 One-Time Build Compliance** | The isolation fix must be sufficient to produce a passing test under concurrent CI runs on first merge — unique org ID + fresh client must guarantee no cross-run accumulation regardless of parallel job count. IAA will reason about whether `Date.now()` uniqueness is robust enough for the CI environment (millisecond precision may collide under high concurrency — IAA will flag if a stronger isolation mechanism is needed). |

**BD-013 Anti-Dodging Check (Critical for this wave)**: IAA will specifically verify the updated
test is not vacuous. The test must:
- Create a fresh adapter (real or adequately real — not a bare no-op mock)
- Write exactly 1 entry via `persist()`
- Read back exactly 1 entry via `retrieve()`
- Assert `toHaveLength(1)` on a result that would fail if 0 or >1 entries were returned

A test that always passes because it uses a pure in-memory stub with no real isolation
boundary is **test dodging** (BD-013) and will produce a REJECTION-PACKAGE.

**BD-011 Test Pass Rate**: CI evidence of a successful test run (no `expected 1 but got 9`
failure) is required in the PREHANDOVER proof.

---

## Required Evidence Artifacts at Handover

The following artifacts **must be present on the branch** at the time of IAA invocation.
Missing any item = immediate REJECTION-PACKAGE (CORE-018, CERT-001 through CERT-004).

| Artifact | Path | Required Content |
|----------|------|-----------------|
| **PREHANDOVER proof** | Root of branch (e.g. `PREHANDOVER_PROOF_PATCH_T075_ISOLATION.md`) | Session ID, task ID T-T075-ISO-001, file list (`api/ai/request.test.ts`), `iaa_audit_token` field pre-populated in format `IAA-session-NNN-patch-T075-isolation-YYYYMMDD-PASS`, FAIL-ONLY-ONCE attestation, CI test run evidence |
| **Session memory** | `.agent-workspace/qa-builder/memory/session-NNN-YYYYMMDD.md` | Covers this session; produced_artifacts includes test file; references T-T075-ISO-001 |
| **CI test run evidence** | Linked in PREHANDOVER proof | GitHub Actions workflow run URL or log snippet showing T-075-1 PASS — `expect(results).toHaveLength(1)` green |
| **IAA token file (pre-populated stub)** | `.agent-admin/assurance/iaa-token-session-NNN-patch-T075-isolation-YYYYMMDD.md` | Expected reference format. IAA will fill verbatim verdict post-review. Per §4.3b: PREHANDOVER proof is read-only post-commit; IAA writes dedicated token file. |
| **SCOPE_DECLARATION.md** | Root of branch | Must list `api/ai/request.test.ts` only (per FAIL-ONLY-ONCE A-026/A-028). Must match `git diff --name-only origin/main...HEAD` exactly. List format required — no prior-wave entries. |

> **§4.3b Architecture Reminder (A-029)**: The PREHANDOVER proof must be committed **before**
> IAA is invoked and is **read-only** thereafter. The `iaa_audit_token` field must contain the
> expected reference format (e.g. `IAA-session-NNN-patch-T075-isolation-20260308-PASS`) — not
> `PENDING`. IAA writes its verdict to the dedicated token file only. Do NOT edit the
> PREHANDOVER proof after commit.

---

## Applicable Overlays

| Overlay | Status | Notes |
|---------|--------|-------|
| **BUILD_DELIVERABLE** | **ACTIVE — PRIMARY** | Full BD-001 through BD-024 apply; BD-001, BD-003, BD-011, BD-012, BD-013, BD-016 are highest-priority for this wave |
| Universal Ceremony Gate (CERT-001 to CERT-004) | **ACTIVE** | Existence checks only — PREHANDOVER, session memory, FAIL-ONLY-ONCE attestation, iaa_audit_token field |
| AGENT_CONTRACT overlay | NOT ACTIVE | No agent contract changes |
| CANON_GOVERNANCE overlay | NOT ACTIVE | No canon changes |
| CI_WORKFLOW overlay | NOT ACTIVE | No workflow changes |
| KNOWLEDGE_GOVERNANCE overlay | NOT ACTIVE | No Tier 2 knowledge changes |

---

## PREHANDOVER Proof Structure IAA Requires

The PREHANDOVER proof must contain at minimum the following sections/fields:

```markdown
# PREHANDOVER Proof — T-T075-ISO-001 (patch-T075-isolation)

**Session ID**: session-NNN-YYYYMMDD
**Task ID**: T-T075-ISO-001
**Wave**: patch-T075-isolation
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**Builder**: qa-builder
**Date**: YYYY-MM-DD

## Scope Declaration
- `api/ai/request.test.ts` — T-075-1 test isolation fix

## Change Summary
[Describe: what was changed in T-075-1, why, and how isolation is achieved]

## Test Evidence
[CI run URL or log snippet showing T-075-1 PASS, `toHaveLength(1)` green]
[Confirm: "No `expected array to have length 1 but got N` failures observed"]

## Artifacts Produced
- `api/ai/request.test.ts` (modified)
- `SCOPE_DECLARATION.md` (must match diff exactly)
- Session memory: `.agent-workspace/qa-builder/memory/session-NNN-YYYYMMDD.md`

## FAIL-ONLY-ONCE Attestation
fail_only_once_attested: true
[Reference applicable rules: A-021 (commit before IAA), A-026 (SCOPE_DECLARATION match),
A-028 (SCOPE_DECLARATION format), A-029 (PREHANDOVER immutable post-commit)]

## IAA Audit Token
iaa_audit_token: IAA-session-NNN-patch-T075-isolation-YYYYMMDD-PASS
[Pre-populated expected reference — IAA writes verdict to dedicated token file]
```

> **Pre-Commit Gate Reminder (A-021)**: All changes must be committed and pushed to the branch
> **before** invoking IAA. A working-tree-only fix is not a committed fix and will fail
> CORE-018 evidence sweep.

---

## Specific Governance Rules Active for This Wave

| Rule | Relevance to This Wave |
|------|----------------------|
| **A-021** (commit before IAA) | All test changes must be committed to branch before IAA is invoked |
| **A-025** (PENDING prohibition) | `iaa_audit_token` must use expected reference format, not `PENDING` |
| **A-026** (SCOPE_DECLARATION accuracy) | Must list only `api/ai/request.test.ts` — stale or extra entries = merge gate failure |
| **A-028** (SCOPE_DECLARATION format) | List format required; no prior-wave entries |
| **A-029** (PREHANDOVER immutability §4.3b) | PREHANDOVER committed before IAA; read-only post-commit; IAA writes dedicated token file |
| **BD-013** (no test dodging) | Updated test must assert on real behaviour — not a vacuous stub |
| **BD-011** (100% test pass rate) | CI evidence of passing test run required |
| **CORE-020** (zero partial pass) | Any unverifiable evidence = REJECTION-PACKAGE |
| **CORE-021** (zero severity tolerance) | Any finding regardless of size → REJECTION-PACKAGE |

---

## Scope Blockers and Governance Conflicts (Visible Now)

### Blockers: NONE

No blockers are visible at Pre-Brief time. The scope is narrow and well-defined.

### Governance Notes (Advisory — Not Blockers):

1. **`Date.now()` collision risk (FFA-06 pre-flag)**: `org-red-${Date.now()}` uses millisecond
   precision. In environments where tests execute extremely rapidly in parallel within the same
   process (e.g., vitest parallel worker threads on the same machine), two tests could
   theoretically generate the same timestamp. IAA will assess whether this is a realistic risk
   in the CI setup (most likely not an issue given vitest worker scheduling), but qa-builder
   should consider `crypto.randomUUID()` or `org-red-${Date.now()}-${Math.random().toString(36).slice(2)}`
   as a more robust alternative if CI parallelism is known to be aggressive.
   **This is advisory — qa-builder decides; IAA will flag at handover only if the current
   approach appears materially unsafe.**

2. **T-075-SUP-1 through SUP-4 are separate tests using mocked Supabase** (lines 332–457): These
   tests use mock clients and are NOT affected by this isolation fix. qa-builder must not modify
   these tests as part of this scope. If they appear in the diff, IAA will flag as scope creep (BD-001).

3. **RED gate comment on line 531** (`// RED: buildPersistentMemory is undefined (not exported) — throws at call site`):
   The issue description implies this test is now GREEN (buildPersistentMemory is exported and
   working). If this RED gate comment is no longer accurate after the fix, qa-builder should
   update or remove it as part of the test isolation change. IAA will note if the comment
   remains inaccurate post-fix.

4. **CWT/FCWT scope**: This is a patch wave for a single test isolation fix. It is **not** a
   wave-closing deliverable that triggers a CWT or FCWT requirement. No integration convergence
   point is introduced. CST/CWT/FCWT prompting obligations do NOT apply to this wave.

---

## IAA Pre-Brief Status

```
PRE-BRIEF COMPLETE
Wave: patch-T075-isolation
Qualifying tasks: 1 (T-T075-ISO-001)
Trigger category: AAWP_MAT / BUILD_DELIVERABLE
IAA invocation: MANDATORY — PHASE_B_BLOCKING
Pre-Brief artifact: .agent-admin/assurance/iaa-prebrief-patch-T075-isolation.md
Status: COMMITTED — awaiting builder completion and PR submission for full Phase 1–4 assurance
```

IAA will NOT issue an ASSURANCE-TOKEN or REJECTION-PACKAGE at Pre-Brief stage.
Full assurance (Phases 1–4) executes only after qa-builder submits the completed PR for IAA review.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Contract Version**: 2.2.0 | **Knowledge Version**: 2.6.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE — CONSTITUTIONAL
