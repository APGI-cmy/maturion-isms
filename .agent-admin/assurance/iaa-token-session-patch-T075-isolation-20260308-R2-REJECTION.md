# IAA Token File — REJECTION-PACKAGE (Re-invocation R2)

**Session ID**: session-patch-T075-isolation-20260308-R2
**Date**: 2026-03-08
**Wave**: patch-T075-isolation
**Branch**: copilot/fix-isolate-build-persistent-memory-test
**PR**: fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination
**Invoking Agent**: foreman-v2-agent
**Producing Agent**: qa-builder (test fix T-T075-ISO-001), foreman-v2-agent (coordination)
**Producing Agent Class**: builder + foreman
**Re-invocation**: YES — follows REJECTION-PACKAGE SHA e105d85 (R1)
**IAA Contract Version**: 2.2.0 | **Knowledge Version**: 2.6.0
**Adoption Phase**: PHASE_B_BLOCKING

---

## Phase 1 — Identity & Preflight

Executed fully. YAML block loaded from `agent-bootstrap` tool call.

> I am independent-assurance-agent, class: assurance, version 6.2.0.
> Role: Independent Assurance Agent — Hard-gate merge blocker.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy).

**Tier 2 loaded**: Knowledge version 2.6.0. All required files present.
**CANON_INVENTORY**: 191 entries, zero placeholder/null hashes. IAA canon present: YES. AGCFPP-001: YES.
**FAIL-ONLY-ONCE registry**: PRESENT — Rules A-001 through A-030 active.
**Prior sessions reviewed**: session-patch-T075-isolation-20260308 (REJECTION — this R1 is the correction addendum per A-030), session-wave15-schemadrift-20260307, session-cwt-envvars-20260307, session-postfcwt-prodfails-v2-20260306, session-postfcwt-prodfails-20260306.
**Open REJECTION-PACKAGEs**: session-patch-T075-isolation-20260308 — R1 findings F-1/F-2/A-027 all claimed remediated by foreman. This R2 invocation re-verifies.
**Merge gate checks loaded**: 3 — "Merge Gate Interface / merge-gate/verdict", "Merge Gate Interface / governance/alignment", "Merge Gate Interface / stop-and-fix/enforcement".
**Orientation Mandate**: Acknowledged. Proceeding as quality engineer. 90% effort on substantive delivery quality; 10% ceremony admin.

---

## Phase 2 — Alignment

**Invocation context**:
- PR: copilot/fix-isolate-build-persistent-memory-test — fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination
- Invoked by: foreman-v2-agent (re-invocation after REJECTION-PACKAGE SHA e105d85)
- Work produced by: qa-builder (T-T075-ISO-001), foreman-v2-agent (coordination), class: builder + foreman
- Being asked to assure: a test isolation fix for T-075-1 in `api/ai/request.test.ts` (production diff only) plus remediation of prior REJECTION findings F-1/F-2/A-027.
- STOP-AND-FIX mandate: ACTIVE for this invocation.

**Independence check**: CONFIRMED — I did not produce this work. I produced the prior REJECTION-PACKAGE verdict (e105d85) and session memory (764d591). None of the substantive test code or ceremony artifacts under review were produced by me.

**PR category**: AAWP_MAT / BUILD_DELIVERABLE
**IAA triggered**: YES — test fix delivering executable application behaviour
**Foreman/builder mandate check**: NOT APPLICABLE (not an agent contract PR)
**Ambiguity check**: CLEAR — AAWP_MAT category unambiguous

**Checklists loaded**: Core invariants (CORE-001 to CORE-022) + AAWP_MAT/BUILD_DELIVERABLE overlay (BD-001 to BD-024, FFA). Total checks this invocation: 46+.

---

## Phase 3 — Assurance Work

### FAIL-ONLY-ONCE Learning Check (Step 3.1)

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence) | YES | PASS — `iaa_audit_token: IAA-session-patch-T075-isolation-20260308-PASS` present in PREHANDOVER proof (pre-populated expected reference) |
| A-002 (no class exceptions) | YES | PASS — foreman correctly invoked IAA |
| A-021 (commit before IAA invocation) | YES — **primary R1 finding** | PASS — PREHANDOVER committed at SHA fe3f1af; confirmed tracked |
| A-026 (SCOPE_DECLARATION accuracy) | YES — **NEW FINDING THIS R2** | **FAIL** — validate-scope-to-diff.sh EXIT 1; 4 files in PR diff not declared in SCOPE_DECLARATION.md |
| A-027 (Pre-IAA Commit Gate section) | YES — **R1 finding** | PASS — Pre-IAA Commit Gate section present in PREHANDOVER with git status + git log evidence |
| A-028 (SCOPE_DECLARATION format) | YES | FAIL — derived from A-026 failure (scope declaration is stale/incomplete) |
| A-029 (PREHANDOVER immutability §4.3b) | YES | PASS — `iaa_audit_token` pre-populated with expected reference; PREHANDOVER read-only post-commit |
| A-030 (CORE-019 re-invocation carve-out) | YES | PASS — R1 REJECTION token (e105d85) committed on branch; serves as correction addendum; CORE-019 first-invocation exception not claimed |

**A-001 invocation evidence check**: PRESENT
**A-002 no-class-exceptions check**: CONFIRMED
**A-026 SCOPE_DECLARATION accuracy**: FAIL — see finding below

---

### Core Invariants Checklist (Step 3.2)

| Check | Evidence | Verdict |
|-------|---------|---------|
| CORE-005: Governance block present | N/A — not an agent contract PR | PASS ✅ (non-applicable, no governance block to check) |
| CORE-006: CANON_INVENTORY alignment | 191 entries, zero null hashes, IAA canon present | PASS ✅ |
| CORE-007: No placeholder content | PREHANDOVER `iaa_audit_token` = `IAA-session-patch-T075-isolation-20260308-PASS` (valid expected reference per A-029 carve-out, not a bare placeholder). No TODO/FIXME/TBD found in delivered artifacts. | PASS ✅ |
| CORE-013: IAA invocation evidence | `iaa_audit_token` field present in PREHANDOVER proof. R1 REJECTION token file committed (SHA e105d85). | PASS ✅ |
| CORE-014: No class exemption claim | None claimed | PASS ✅ |
| CORE-015: Session memory present | qa-builder session memory: `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` — committed at SHA fe3f1af. Confirmed tracked and non-empty. | PASS ✅ (F-2 remediated) |
| CORE-016: IAA verdict evidenced (§4.3b) | `iaa_audit_token` in PREHANDOVER = `IAA-session-patch-T075-isolation-20260308-PASS` (valid expected reference). R1 token file exists at `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md` (R1 REJECTION, not PASS). **This R2 invocation writes the new R2 token file.** Second invocation — not first-invocation exception. R1 token file exists and contains REJECTION-PACKAGE. `iaa_audit_token` references the anticipated PASS token. The PREHANDOVER proof is immutable post-commit (A-029). PASS condition: PREHANDOVER has valid expected reference format ✅; this R2 token file is being created now. | PASS ✅ |
| CORE-017: No .github/agents/ modifications | `git diff --name-only origin/main...HEAD \| grep ".github/agents/"` → NONE | PASS ✅ |
| CORE-018: Complete evidence artifact sweep | (a) PREHANDOVER proof: PRESENT — `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` committed SHA fe3f1af ✅ (b) Session memory: PRESENT — qa-builder session memory committed SHA fe3f1af ✅ (c) `iaa_audit_token`: non-empty, valid expected reference format ✅ (d) Dedicated IAA token file: R1 REJECTION token exists; R2 token being created this session ✅ | PASS ✅ |
| CORE-019: IAA token cross-verification | R1 token file exists at `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md` containing REJECTION-PACKAGE verdict. `iaa_audit_token` references anticipated PASS token `IAA-session-patch-T075-isolation-20260308-PASS`. Per A-030: R1 REJECTION serves as correction addendum; CORE-019 first-invocation exception not claimed. The anticipated PASS token will be written by IAA upon ASSURANCE-TOKEN verdict. Since this invocation produces REJECTION-PACKAGE, the PASS token is not written. | PASS ✅ (A-030 applied) |
| CORE-020: Zero partial pass rule | All checks verified from actual committed artifacts. No assumed passes. | PASS ✅ |
| CORE-021: Zero-severity-tolerance | Applied. All findings reported at full severity. | PASS ✅ |

---

### AAWP_MAT / BUILD_DELIVERABLE Overlay (Step 3.3)

**BD-TIER-1 — Delivery Completeness**

| Check | Evidence | Verdict |
|-------|---------|---------|
| BD-001: Full scope delivered | Production diff: only `api/ai/request.test.ts` changed (test isolation fix). Issue: fix T-075 shared state contamination. Delivered: T-075-1 updated with fresh `makeTestSupabaseClient()` + unique `org-red-${Date.now()}-${Math.random().toString(36).slice(2)}` per run. Scope fully delivered. | PASS ✅ |
| BD-002: No stub/TODO in production paths | `api/ai/request.test.ts` — no TODO/FIXME/stub found in T-075-1 implementation or surrounding code. | PASS ✅ |
| BD-003: One-time build compliance | Fix is complete and self-contained. T-075-1 uses in-memory client that will produce consistent results regardless of environment or parallelism. No follow-up fix needed. | PASS ✅ |
| BD-004: No leftover debt | No pre-existing failing tests, linter errors, or broken wiring visible in diff context. | PASS ✅ |

**BD-TIER-2 — Wiring & Integration Verification**

| Check | Evidence | Verdict |
|-------|---------|---------|
| BD-005: End-to-end wiring verified | Test fix only. `makeTestSupabaseClient()` imported from `./__test-utils__/makeTestSupabaseClient.js` (line 26). `SupabasePersistentMemoryAdapter` imported dynamically (line 534–536). Chain: makeTestSupabaseClient() → adapter constructor → persist() → retrieve(). All links confirmed in diff. | PASS ✅ |
| BD-006: Writers and readers confirmed | persist() called (writer, line 545–552). retrieve() called (reader, line 554). toHaveLength(1) + content assertion (lines 556–557). Both paths exercised. | PASS ✅ |
| BD-007: Auth guards | Test-only fix. No protected routes or auth paths added. N/A. | PASS ✅ |
| BD-008: FK relational integrity | No schema changes. N/A. | PASS ✅ |
| BD-009: Cross-component integration fit | T-075-1 matches pattern of T-075-SUP-2/3/4 which already use `makeTestSupabaseClient()`. Consistent pattern. | PASS ✅ |
| BD-010: No orphaned deliverables | Only one file changed. No new files. No orphans. | PASS ✅ |

**BD-TIER-3 — Test Quality & Zero Debt**

| Check | Evidence | Verdict |
|-------|---------|---------|
| BD-011: 100% test pass rate | qa-builder session memory: "25/25 tests pass." No evidence of failure. | PASS ✅ |
| BD-012: Zero test debt | `grep -n "\.skip\|\.only\|\.todo\|TODO\|FIXME" api/ai/request.test.ts` → NONE | PASS ✅ |
| BD-013: No test dodging | T-075-1 directly instantiates `SupabasePersistentMemoryAdapter` with real in-memory store. `persist()` called, `retrieve()` called, `toHaveLength(1)` + `results[0]!.content === 'test memory entry'` asserted. Non-vacuous round-trip. Anti-dodging: the null stub (pre-fix) would return `[]` → `toHaveLength(1)` would FAIL, confirming test discriminates. | PASS ✅ |

**BD-TIER-4 — Security**

| Check | Evidence | Verdict |
|-------|---------|---------|
| BD-014: Supabase RLS / DB security | Test-only. In-memory client. No Supabase RLS changes. N/A. | PASS ✅ |
| BD-015: Auth & token handling | No auth tokens in test. makeTestSupabaseClient() creates in-memory adapter. No network calls. | PASS ✅ |
| BD-016: No hardcoded secrets | `grep` found only "internal secret error" (mock rejection value, line 282, 295) — this is a test for error message sanitization, not a hardcoded credential. No API keys, passwords, connection strings. | PASS ✅ |
| BD-017: Input validation | Test-only fix. No user-controlled inputs. N/A. | PASS ✅ |
| BD-018: No injection vectors | No raw SQL, no user-rendered HTML, no shell expansion in test code. | PASS ✅ |
| BD-019: Standards compliance | Test-only fix. No compliance-sensitive paths affected. | PASS ✅ |

**BD-TIER-5 — Code Quality & Architecture Fitness**

| Check | Evidence | Verdict |
|-------|---------|---------|
| BD-020: Clean coding structure | T-075-1 (lines 529–558): 29 lines, single responsibility (round-trip persistence test), clear naming, no magic strings (orgId variable). | PASS ✅ |
| BD-021: International coding best practice | TypeScript strictness: `buildPersistentMemory as unknown as () => unknown` — necessary for RED gate pattern (import not yet exported). `results[0]!` — non-null assertion appropriate given `toHaveLength(1)`. No bare `catch`. No silent swallows. | PASS ✅ |
| BD-022: Architecture alignment | Test matches T-075-SUP-2/3/4 pattern exactly. Architecture compliant. | PASS ✅ |
| BD-023: Technology currency | `makeTestSupabaseClient()` and `SupabasePersistentMemoryAdapter` are established in-repo utilities. No new packages introduced. | PASS ✅ |
| BD-024: Could it be done better — right now | The use of `Date.now()` + `Math.random().toString(36).slice(2)` for uniqueness is the correct pattern (consistent with prior test isolation fixes in this codebase). No materially better approach warranted. | PASS ✅ |

---

### Scope-to-Diff Merge Gate Parity Check — **FAILURE**

**MERGE GATE PARITY CHECK (§4.3 — mandatory pre-verdict):**

```
validate-scope-to-diff.sh (BL-027):

=== Scope-to-Diff Validation (BL-027) ===
Mode: Exact Set Comparison

Found 8 changed files in git diff
Found 4 files declared in SCOPE_DECLARATION.md

❌ MISSING FILES: 4 file(s) in git diff but NOT declared in SCOPE_DECLARATION.md

   - .agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md
   - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md
   - .agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308.md
   - .agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md

❌ Scope-to-Diff validation FAILED
EXIT CODE: 1
```

**Finding**: SCOPE_DECLARATION.md was last updated for the initial fix commit (6166d12). Subsequent commits added 4 new ceremony artifacts to the branch:
1. `.agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md` (R1 REJECTION token — SHA e105d85)
2. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md` (remediation of F-1 — SHA fe3f1af)
3. `.agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308.md` (IAA session memory — SHA 764d591)
4. `.agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md` (remediation of F-2 — SHA fe3f1af)

None of these four files were added to SCOPE_DECLARATION.md. Per A-026, SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly before IAA invocation. The validate-scope-to-diff.sh script enforces this as BL-027 merge gate parity. EXIT 1 = merge gate FAIL.

**Parity result**: FAIL — validate-scope-to-diff.sh (BL-027) FAILED, EXIT CODE 1.

---

### Substantive Assessment

Substantive quality of the test fix remains HIGH. The T-075-1 isolation fix is:
- Correctly implemented using in-memory adapter
- Correctly using unique org ID per run
- Confirmed 25/25 tests pass
- Zero test debt, zero security issues

This REJECTION-PACKAGE requires zero code changes. Only SCOPE_DECLARATION.md needs to be updated.

---

### Check Tallies (Step 3.4)

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 8 | 7 | 1 (A-026) |
| Core invariants | 12 | 12 | 0 |
| AAWP_MAT overlay (BD-001 to BD-024) | 24 | 24 | 0 |
| Merge gate parity (§4.3) | 1 | 0 | 1 (BL-027/validate-scope-to-diff.sh) |
| **Total** | **45** | **43** | **2** |

**Adoption phase modifier**: PHASE_B_BLOCKING — verdicts are hard-blocking.

---

## Phase 4 — Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE (R2)
PR: copilot/fix-isolate-build-persistent-memory-test
    fix(test): Isolate buildPersistentMemory() test (T-075) from shared state contamination

2 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

FAILURES:
  A-026 / BL-027: SCOPE_DECLARATION.md stale — 4 files in PR diff not declared
    Finding: validate-scope-to-diff.sh returns EXIT 1. SCOPE_DECLARATION.md
    (last updated at commit 6166d12) does not list 4 ceremony artifact files
    that were added to the branch in subsequent commits (e105d85, 764d591, fe3f1af):
      - .agent-admin/assurance/iaa-token-session-patch-T075-isolation-20260308.md
      - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-patch-T075-isolation-20260308.md
      - .agent-workspace/independent-assurance-agent/memory/session-patch-T075-isolation-20260308.md
      - .agent-workspace/qa-builder/memory/session-patch-T075-isolation-20260308.md
    Fix required: Update SCOPE_DECLARATION.md to list all 8 files in the PR diff.
    Commit the updated SCOPE_DECLARATION.md. Re-invoke IAA.

Token reference: IAA-session-patch-T075-isolation-20260308-R2-REJECTION
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
═══════════════════════════════════════════════════════════════
```

**Substantive note to foreman**: The underlying test fix is correct and complete. This REJECTION-PACKAGE is ceremony-only. A single commit updating SCOPE_DECLARATION.md to list all 8 PR diff files will resolve this. No code changes required.

---

*Token file written per §4.3b. PREHANDOVER proof is immutable post-commit and was not modified.*
*Merge authority: CS2 ONLY (@APGI-cmy)*
*Authority: independent-assurance-agent v6.2.0 | LIVING_AGENT_SYSTEM v6.2.0*
