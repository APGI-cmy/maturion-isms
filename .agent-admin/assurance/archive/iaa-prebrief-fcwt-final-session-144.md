# IAA Pre-Brief — FCWT-Final (session-144)

**Agent**: independent-assurance-agent v6.2.0  
**Invocation Type**: PRE-BRIEF (Phase 0)  
**Wave**: FCWT-Final — Final Combined Wave Testing for Entire Build  
**Session**: session-144  
**Date**: 2026-03-05  
**Branch**: copilot/run-fcwt-for-entire-build  
**Requested By**: foreman-v2-agent v6.2.0  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  

---

## Pre-Brief Summary

| Task ID | Task Summary | IAA Trigger Category | Qualifying? |
|---------|-------------|---------------------|-------------|
| TASK-FCWT-001 | Full test suite execution — 706+ GREEN, run log, exact count | AAWP_MAT | ✅ QUALIFYING |
| TASK-FCWT-002 | FCWT Final Certificate (all waves 0–14) | AAWP_MAT | ✅ QUALIFYING |
| TASK-FCWT-003 | FCWT Evidence Bundle (all prior CWT/CST tokens) | AAWP_MAT | ✅ QUALIFYING |
| TASK-FCWT-004 | BUILD_PROGRESS_TRACKER.md — FCWT section + production readiness | AAWP_MAT | ✅ QUALIFYING |

**IAA Verdict**: ALL 4 tasks are QUALIFYING. IAA is MANDATORY for this wave.  
**Exempt tasks**: NONE.  
**Ambiguity check**: CLEAR — all 4 tasks produce deliverables in `modules/mat/` within an active AAWP/MAT build wave.

---

## Task-by-Task Pre-Brief Classification

---

### TASK-FCWT-001 — Full Test Suite Execution

| Field | Value |
|-------|-------|
| `task_id` | TASK-FCWT-001 |
| `task_summary` | Execute `npx vitest run` in modules/mat directory. Confirm 706+ tests GREEN, 0 new regressions. Document exact count and produce FCWT run log. |
| `iaa_trigger_category` | AAWP_MAT |
| `qualifying` | YES — MANDATORY |
| `required_phases` | Phase 1 (Preflight), Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Verdict) |
| `invoking_agent` | foreman-v2-agent (via CodexAdvisor/Foreman handover) |
| `producing_agent` | qa-builder |

**Required Evidence Artifacts (IAA will check at handover):**

| Artifact | Type | Check |
|----------|------|-------|
| PREHANDOVER proof file on branch | Mandatory ceremony artifact | CORE-018 / CORE-016 / A-015 |
| Session memory file on branch | Mandatory ceremony artifact | CORE-015 / CORE-018 |
| `iaa_audit_token` in PREHANDOVER proof | Field: `IAA-session-NNN-fcwt-final-20260305-PASS` | CORE-016 / A-029 |
| SCOPE_DECLARATION.md (list format, matching diff) | Merge gate parity artifact | A-026 / A-028 |
| IAA token file `.agent-admin/assurance/iaa-token-session-NNN-fcwt-final-20260305.md` | Token artifact | CORE-016 (§4.3b) |
| Test run log showing exact pass/fail counts | QA evidence — actual vitest output | BD-011 |
| Confirmation: 706+ GREEN / 715 total / 9 EXPECTED RED unchanged | QA evidence | BD-011 / BD-004 |
| Identification of the 9 EXPECTED RED tests (pre-existing live-env) | QA evidence | BD-004 |

**Applicable Overlays**: AAWP_MAT (BD-001 through BD-024)  
**FFA Sections Applicable**: FFA-01 (Delivery Completeness), FFA-02 (n/a — no new wiring), FFA-03 (Integration Fit — test suite integrity), FFA-05 (Code Quality — n/a doc artifact), FFA-06 (One-Time Build — test results must be real, first time)

**High-Risk Rules / A-Rules:**

| Rule | Description | Risk Level |
|------|-------------|-----------|
| **BD-011** | 100% test pass rate — actual log required; no claimed count without evidence | 🔴 HIGH — BLOCKING |
| **BD-004** | No leftover debt — the 9 EXPECTED RED must be verified as pre-existing live-env only, not new regressions | 🔴 HIGH — BLOCKING |
| **BD-013** | No test dodging — test run must be genuine vitest output, not a fabricated/summarised count | 🔴 HIGH — BLOCKING |
| **BD-003** | One-time build compliance — test results must be reproducible and genuine | 🟡 MEDIUM |
| **A-026** | SCOPE_DECLARATION must match `git diff --name-only origin/main...HEAD` | 🔴 HIGH — BLOCKING |

**IAA Focus for TASK-FCWT-001**:
> IAA will verify the actual test run output log. A claim of "706 GREEN" without a committed log file = REJECTION-PACKAGE. The log must show per-test results or at minimum suite-level counts. IAA will cross-check the 9 EXPECTED RED tests against the wave14-final evidence to confirm these are the same pre-existing failures documented in prior IBWR/final sessions (session-143, session-153).

---

### TASK-FCWT-002 — FCWT Final Certificate

| Field | Value |
|-------|-------|
| `task_id` | TASK-FCWT-002 |
| `task_summary` | Create `modules/mat/05-build-evidence/fcwt-final-certificate-20260305.md` — full FCWT certificate covering all waves 0–14, certifying production readiness. |
| `iaa_trigger_category` | AAWP_MAT |
| `qualifying` | YES — MANDATORY |
| `required_phases` | Phase 1–4 (same invocation as TASK-FCWT-001 through FCWT-004) |
| `producing_agent` | qa-builder |

**Required Evidence Artifacts (IAA will check at handover):**

| Artifact | Type | Check |
|----------|------|-------|
| `modules/mat/05-build-evidence/fcwt-final-certificate-20260305.md` present on branch | Primary deliverable | BD-001 |
| Certificate content: covers waves 0–14 explicitly | Content completeness | BD-001 / BD-002 |
| Certificate references test count (706+ GREEN / 715 total) | Content accuracy | BD-002 / BD-011 |
| Certificate references prior wave certificates (wave13-fcwt, WAVE_CLOSURE_CERTIFICATION_FCWT) | Evidence chain | BD-001 |
| Certificate includes Wave 14 evidence: all 15 GAPs closed, 104/104 tests GREEN | Wave 14 coverage | BD-001 |
| No TODO/STUB/TBD in certificate body | Clean artifact | CORE-007 |
| SCOPE_DECLARATION.md includes this file | Diff alignment | A-026 |

**Applicable Overlays**: AAWP_MAT (BD-001 through BD-024, applied to documentation artifact)  
**Inapplicable Overlays**: BD-005 through BD-010 (wiring/integration checks — not applicable to documentation), BD-015 through BD-018 (security checks — not applicable to doc artifact)

**High-Risk Rules / A-Rules:**

| Rule | Description | Risk Level |
|------|-------------|-----------|
| **BD-001** | Full scope delivered — certificate must cover ALL waves 0–14, not a subset | 🔴 HIGH — BLOCKING |
| **BD-002** | No stubs/TODOs — every wave section must be populated with actual evidence | 🔴 HIGH — BLOCKING |
| **BD-003** | One-time completeness — certificate must be accurate at time of issuance; no "to be updated post-merge" sections | 🟡 MEDIUM |
| **CORE-007** | No placeholder content in certificate body | 🟡 MEDIUM |

**IAA Focus for TASK-FCWT-002**:
> IAA will verify the certificate explicitly covers waves 0–14, references the actual test count from TASK-FCWT-001's log, and links to prior certificates (wave13-fcwt-certificate-20260303.md, WAVE_CLOSURE_CERTIFICATION_FCWT.md as superseded predecessor). The prior 2026-02-18 certificate (127 tests) must be explicitly superseded or referenced as historical.

---

### TASK-FCWT-003 — FCWT Evidence Bundle

| Field | Value |
|-------|-------|
| `task_id` | TASK-FCWT-003 |
| `task_summary` | Create `modules/mat/05-build-evidence/fcwt-final-evidence-bundle-20260305.md` — cross-wave evidence bundle listing all prior CWT/CST tokens and wave completion evidence. |
| `iaa_trigger_category` | AAWP_MAT |
| `qualifying` | YES — MANDATORY |
| `required_phases` | Phase 1–4 (same invocation) |
| `producing_agent` | qa-builder |

**Required Evidence Artifacts (IAA will check at handover):**

| Artifact | Type | Check |
|----------|------|-------|
| `modules/mat/05-build-evidence/fcwt-final-evidence-bundle-20260305.md` present on branch | Primary deliverable | BD-001 |
| Bundle lists all prior CWT tokens by wave (waves 0–14) | Content completeness | BD-001 |
| Bundle lists all prior CST tokens by wave (where applicable) | Content completeness | BD-001 |
| Bundle links to Wave 14 IAA tokens: session-143-wave14-final-20260305-PASS, session-143-v2-wave14-ibwr-20260305-PASS, plus all batch tokens | Evidence chain | BD-001 |
| Bundle includes reference to Wave 14 batch outcomes (Batch A: 37/37, Batch B: 40/40, Batch C: 27/27 = 104/104 total) | Wave 14 accuracy | BD-002 |
| No TODO/STUB/TBD in bundle body | Clean artifact | CORE-007 |
| SCOPE_DECLARATION.md includes this file | Diff alignment | A-026 |

**Applicable Overlays**: AAWP_MAT (BD-001 through BD-004, BD-011–BD-013 for evidence integrity)  
**Inapplicable Overlays**: BD-005 through BD-010 (wiring), BD-015 through BD-019 (security)

**High-Risk Rules / A-Rules:**

| Rule | Description | Risk Level |
|------|-------------|-----------|
| **BD-001** | Evidence bundle must be complete — all prior CWT/CST tokens, all waves | 🔴 HIGH — BLOCKING |
| **BD-002** | No stubs — every wave entry must have real token references, not placeholders | 🔴 HIGH — BLOCKING |
| **A-016** | Cross-PR token reuse — bundle entries must reference correct tokens for their respective waves, not recycled from another context | 🟡 MEDIUM |

**IAA Focus for TASK-FCWT-003**:
> IAA will cross-reference the bundle against `.agent-admin/assurance/` token files and prior session memory to verify that claimed CWT/CST token references are real, correctly dated, and correspond to the correct waves. Any invented or misattributed token reference = REJECTION-PACKAGE.

---

### TASK-FCWT-004 — BUILD_PROGRESS_TRACKER Update

| Field | Value |
|-------|-------|
| `task_id` | TASK-FCWT-004 |
| `task_summary` | Update `modules/mat/BUILD_PROGRESS_TRACKER.md` to record FCWT-Final results and production readiness state. |
| `iaa_trigger_category` | AAWP_MAT |
| `qualifying` | YES — MANDATORY |
| `required_phases` | Phase 1–4 (same invocation) |
| `producing_agent` | mat-specialist |

**Required Evidence Artifacts (IAA will check at handover):**

| Artifact | Type | Check |
|----------|------|-------|
| `modules/mat/BUILD_PROGRESS_TRACKER.md` updated on branch | Primary deliverable | BD-001 |
| BPT contains FCWT-Final section (dated 2026-03-05) | Section presence | BD-001 / BD-002 |
| BPT FCWT section records test count (706+ GREEN / 715 / 9 expected red) | Content accuracy | BD-002 |
| BPT records production readiness state: PRODUCTION READY | Content accuracy | BD-001 |
| BPT references FCWT certificate and evidence bundle paths | Cross-reference integrity | BD-001 |
| BPT version incremented (from v1.3 → v1.4 or equivalent) | Artifact currency | BD-002 |
| SCOPE_DECLARATION.md includes BUILD_PROGRESS_TRACKER.md | Diff alignment | A-026 |
| No TODO/STUB/TBD in FCWT section | Clean artifact | CORE-007 |

**Applicable Overlays**: AAWP_MAT (BD-001 through BD-004, CORE checks)

**High-Risk Rules / A-Rules:**

| Rule | Description | Risk Level |
|------|-------------|-----------|
| **BD-001** | Full FCWT section delivered — must include test counts, readiness state, references | 🔴 HIGH — BLOCKING |
| **BD-002** | No stubs/TODOs in the FCWT section | 🟡 MEDIUM |
| **A-026** | SCOPE_DECLARATION must include BUILD_PROGRESS_TRACKER.md | 🔴 HIGH — BLOCKING |
| **CORE-007** | No placeholder content | 🟡 MEDIUM |

**IAA Focus for TASK-FCWT-004**:
> IAA will verify the FCWT section in BUILD_PROGRESS_TRACKER.md matches the actual test count from TASK-FCWT-001's run log. The production readiness declaration must be explicit and unambiguous. IAA will check that the BPT version reflects this update (no stale v1.3 header with new content appended without version bump).

---

## Cross-Wave Evidence Ceremony Requirements

The following ceremony artifacts are required **once per IAA invocation** (covering all 4 tasks as a single PR bundle):

| Ceremony Artifact | Requirement | Governing Rule |
|------------------|-------------|----------------|
| PREHANDOVER proof file | One PREHANDOVER proof covering all 4 FCWT tasks | CORE-013, CORE-016, CORE-018, A-015 |
| Session memory file | One session memory for the producing agent session | CORE-015, CORE-018 |
| `iaa_audit_token` in PREHANDOVER | Pre-populated to `IAA-session-NNN-fcwt-final-20260305-PASS` | CORE-016, A-029 |
| SCOPE_DECLARATION.md | List format, matching `git diff --name-only origin/main...HEAD` exactly | A-026, A-028 |
| Dedicated IAA token file | `.agent-admin/assurance/iaa-token-session-NNN-fcwt-final-20260305.md` (created by IAA post-verdict) | CORE-016, §4.3b |

**§4.3b Artifact Immutability Rule (A-029)**:
- PREHANDOVER proof is committed **before** IAA runs → **read-only** thereafter
- IAA writes verdict to **separate dedicated token file** — NEVER edits the PREHANDOVER proof
- PREHANDOVER `iaa_audit_token` field: pre-populate with expected reference, not `PENDING`

---

## Invocation Pattern

Per `wave-current-tasks.md` sequencing, the IAA gate fires **once** at the end of the wave (after all 4 tasks are complete):

```
TASK-FCWT-001 → TASK-FCWT-002 → TASK-FCWT-003 → TASK-FCWT-004
                                                   ↓
                                    FOREMAN QP EVALUATION
                                    PREHANDOVER PROOF (foreman/mat-specialist)
                                    IAA GATE (Phase 1–4, covering all tasks)
                                    ASSURANCE-TOKEN → CS2 merge approval
```

**IAA is invoked ONCE** for the complete PR bundle. A single PREHANDOVER proof and single IAA token cover all 4 deliverables.

---

## Pre-Conditions and Blockers

The following pre-conditions must be satisfied **before IAA is invoked** (Foreman QP evaluation responsibility):

| Pre-Condition | Check | Responsible |
|--------------|-------|-------------|
| PC-FCWT-001 | All 4 deliverable files committed to branch | Foreman / QA-builder / mat-specialist |
| PC-FCWT-002 | Test run log is a genuine vitest output (not a paraphrase or summary) | qa-builder |
| PC-FCWT-003 | Test count in certificate matches test count in run log (no discrepancy) | qa-builder / mat-specialist |
| PC-FCWT-004 | SCOPE_DECLARATION.md updated to list format, matching current diff | Foreman (pre-IAA commit gate) |
| PC-FCWT-005 | PREHANDOVER proof committed with `iaa_audit_token` pre-populated (not `PENDING`) | Foreman |
| PC-FCWT-006 | Session memory committed | Producing agent |
| PC-FCWT-007 | BUILD_PROGRESS_TRACKER.md version incremented | mat-specialist |

**If any pre-condition fails**, Foreman must resolve before IAA invocation. IAA will issue REJECTION-PACKAGE if any of the above is absent or inconsistent.

---

## Prior Wave Context (IAA Awareness)

The following prior artifacts are known-good and form the evidence baseline IAA will reference:

| Artifact | Status | Notes |
|----------|--------|-------|
| `iaa-token-session-143-wave14-final-20260305.md` | ✅ ASSURANCE-TOKEN | Wave 14 Final — 104/104 tests, 15 GAPs closed |
| `iaa-token-session-143-v2-wave14-ibwr-20260305.md` | ✅ ASSURANCE-TOKEN | Wave 14 IBWR — BPT v1.3, progress tracker updated |
| `modules/mat/05-build-evidence/wave13-fcwt-certificate-20260303.md` | ✅ BASELINE | 619 tests — superseded by this FCWT |
| `WAVE_CLOSURE_CERTIFICATION_FCWT.md` | ⚠️ OUTDATED | 2026-02-18, 127 tests — historical predecessor only |
| `modules/mat/BUILD_PROGRESS_TRACKER.md` v1.3 | ✅ CURRENT PRE-FCWT | Last updated session-143 |

---

## Advisory Notes

1. **Test count accuracy is the highest-risk item**. The FCWT certificate and BPT must reflect the same count as the actual test run log. IAA will cross-check these three sources and any discrepancy = REJECTION-PACKAGE.

2. **The 9 EXPECTED RED tests must be explicitly named or identified**. A claim of "9 expected red (live-env only)" without identifying which tests = insufficient evidence. At minimum, the test names or suite names must be documented.

3. **Do not reference the outdated 2026-02-18 certificate (127 tests) as a current baseline**. It should be referenced as "superseded predecessor" only.

4. **SCOPE_DECLARATION has caused rejections on waves 14 Final and 14 Batch C**. Foreman must execute the Pre-IAA Commit Gate (A-027) before IAA invocation: `git diff --name-only origin/main...HEAD` → confirm SCOPE_DECLARATION exactly matches.

5. **BPT version bump required**. The BUILD_PROGRESS_TRACKER.md is currently v1.3. The FCWT update constitutes a substantive change. Increment version in the header.

---

## Phase A Advisory Status

**Not applicable.** Adoption phase is **PHASE_B_BLOCKING**. All IAA verdicts for this wave are hard-blocking. REJECTION-PACKAGE prevents PR merge. No advisory-only mode.

---

## Pre-Brief Completion

| Step | Status |
|------|--------|
| Step 0.1 — PRE-BRIEF invocation confirmed | ✅ DONE |
| Step 0.2 — wave-current-tasks.md read | ✅ DONE |
| Step 0.3 — Tasks classified per trigger table | ✅ DONE — 4/4 QUALIFYING |
| Step 0.4 — Pre-Brief artifact generated | ✅ THIS DOCUMENT |
| Step 0.5 — Commit to branch | 🔄 IN PROGRESS |
| Step 0.6 — Reply confirming completion | 🔄 IN PROGRESS |

---

**IAA Pre-Brief Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Pre-Brief Version**: 1.0  
**Next Action**: foreman-v2-agent proceeds with TASK-FCWT-001 through TASK-FCWT-004 execution, then invokes IAA for Phase 1–4 assurance at wave close.
