# Root Cause Analysis — QA-to-Red Process Lapse

| Field | Value |
|-------|-------|
| **Date** | 2026-02-13 |
| **Module** | MAT (Manual Audit Tool) |
| **Issue** | Initial registry/strategy creation omitted actual test code and execution |
| **Severity** | Process gap — no tests existed despite governance mandate |
| **Status** | Resolved |

---

## 1. Problem Statement

The MAT Red Test Suite registry (`governance/TEST_REGISTRY.json`) and strategy (`Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md`) were merged into the repository without accompanying executable test code. The QA-to-Red workflow requires that all tests exist as runnable code that fails with explicit RED signatures before any build-to-green implementation begins.

This created a gap between:
- **Planning artifacts** (registry + strategy) — ✅ Complete and merged
- **Executable test artifacts** (test code files) — ❌ Missing at time of merge

---

## 2. Root Causes

### 2.1 Phase Conflation (Primary Cause)

The registry/strategy compilation was treated as a standalone deliverable rather than as the first half of a two-step QA-to-Red process. The governance-mandated workflow is:

1. **Compile** — Create registry, strategy, and test definitions (planning)
2. **Execute** — Scaffold test code, run suite, verify RED status (execution)

Step 2 was deferred to a follow-up issue rather than being enforced as a gate condition on the registry merge itself.

### 2.2 Missing Gate Enforcement

The merge gate for the registry PR did not enforce the presence of executable test files. The gate validated:
- ✅ Registry JSON syntax and integrity
- ✅ Strategy document completeness
- ❌ **Not validated**: Corresponding test code files exist and run RED

### 2.3 Artifact vs. Execution Confusion

The distinction between "test definitions" (metadata in JSON) and "test code" (runnable `.test.ts` files) was not explicitly enforced. The registry described 98 tests but the concept of "compiled" was interpreted as "documented in JSON" rather than "scaffolded as executable code."

---

## 3. Impact

| Impact Area | Description |
|-------------|-------------|
| Build-to-Green readiness | Delayed — builders could not start turning tests green without runnable RED tests |
| QA confidence | Reduced — no evidence that test definitions were executable |
| Governance compliance | Gap — QA-to-Red mandate not fully satisfied by planning artifacts alone |
| Timeline | Minor — resolved in immediate follow-up session |

---

## 4. Corrective Actions Taken

| # | Action | Status |
|---|--------|--------|
| 1 | Scaffolded all 98 test files across 12 category directories | ✅ Done |
| 2 | Each test throws `NOT_IMPLEMENTED` with serial ID for traceability | ✅ Done |
| 3 | Configured vitest at workspace root to run MAT test suite | ✅ Done |
| 4 | Executed full suite — all 98 tests RED as expected | ✅ Done |
| 5 | Captured execution evidence in `modules/mat/05-build-evidence/` | ✅ Done |

---

## 5. Preventive Measures

### 5.1 Process Adjustments

1. **QA-to-Red gate must require executable tests** — Future test registry merges must include corresponding `.test.ts` files that run and fail. Registry-only merges without test code should be blocked.

2. **Two-phase QA delivery is one deliverable** — Registry compilation and test scaffolding must be treated as a single atomic unit, not split across separate PRs.

3. **Merge gate enhancement** — Add a validation step that checks: for every entry in `TEST_REGISTRY.json`, a corresponding test file exists in `modules/<module>/tests/` and contains a matching test case.

### 5.2 Template Improvements

1. **Issue templates** for QA-to-Red tasks should explicitly list both "compile registry" AND "scaffold test code" as acceptance criteria.

2. **PREHANDOVER_PROOF** for QA tasks should require "test run output showing N tests RED" as mandatory evidence.

### 5.3 Agent Learning

1. **FM memory update** — Record that QA-to-Red requires executable artifacts, not just planning documents.
2. **Pattern recognition** — Flag any future PR that adds test metadata without corresponding test code.

---

## 6. Lessons Learned

| # | Lesson |
|---|--------|
| 1 | Planning artifacts without execution artifacts create false confidence in QA readiness |
| 2 | The governance workflow (QA-to-Red → Build-to-Green) requires both phases to be atomic |
| 3 | Merge gates should validate the complete deliverable, not just document completeness |
| 4 | Agent workflow should treat "test compilation" as meaning "runnable test code exists" |

---

## 7. References

| Document | Location |
|----------|----------|
| Test Registry | `governance/TEST_REGISTRY.json` |
| Test Strategy | `Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md` |
| RED Suite Evidence | `modules/mat/05-build-evidence/RED_SUITE_EXECUTION_EVIDENCE.md` |
| Build Philosophy | `BUILD_PHILOSOPHY.md` |
| QA Catalog Alignment Gate | `governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md` |

---

*RCA completed 2026-02-13 — Process lapse resolved with corrective and preventive actions*
