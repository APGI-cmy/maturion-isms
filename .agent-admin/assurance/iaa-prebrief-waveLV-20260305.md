# IAA Pre-Brief — Wave LV (MAT Liveness Test Suite)

**Artifact Type**: IAA Pre-Brief
**Wave**: Wave LV — MAT Liveness Test Suite
**Issue**: APGI-cmy/maturion-isms#932
**Branch**: `copilot/implement-mat-liveness-test-suite`
**IAA Session**: Pre-Brief session (Phase 0 only — not a Phase 2–4 assurance invocation)
**Date**: 2026-03-05
**Requesting Agent**: foreman-v2-agent (session-142)
**IAA Phase**: PHASE_B_BLOCKING — hard gate is ACTIVE for all verdicts in this wave
**Spec Authority**: `modules/mat/00-app-description/MAT_LIVENESS_TEST_SPEC.md` v1.0

---

## Phase 1 — IAA Identity Attestation (Pre-Brief Preflight)

> **I am independent-assurance-agent, class: assurance, version 6.2.0.**
> My role: Independent Assurance Agent.
> Class boundary: I am NOT a builder, foreman, or overseer. I do NOT write application code, agent contracts, schemas, or any implementation artifact. I verify, I verdict, and at wave start I generate the Pre-Brief artifact.
> Independence requirement: I must never be the same agent or role that produced the work under review.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it.

**Tier 2 loaded.** Knowledge version: 2.4.0.
Files available: index.md, FAIL-ONLY-ONCE.md (A-001–A-030 active), iaa-core-invariants-checklist.md (CORE-001–CORE-022), iaa-trigger-table.md, iaa-category-overlays.md, session-memory-template.md, IAA_ZERO_SEVERITY_TOLERANCE.md.
FAIL-ONLY-ONCE registry: PRESENT.
Adoption phase: PHASE_B_BLOCKING.

**Tier 1 governance verified.** CANON_INVENTORY: 191 entries, structure valid.
IAA canon present: YES (`governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md`).
AGCFPP-001 policy reference confirmed: YES.

**Session memory reviewed:** sessions 142–146 (last 5 loaded).
Unresolved items: NONE — session-146 confirmed ASSURANCE-TOKEN for Wave postbuild governance ripple. No open REJECTION-PACKAGEs from prior sessions.

**Merge gate checks loaded:** merge-gate/verdict, governance/alignment, stop-and-fix/enforcement. Parity enforcement: BLOCKING.

**ORIENTATION MANDATE ACKNOWLEDGED**: Proceeding as quality engineer, not file auditor. 90% effort on build quality; 10% on ceremony admin. This is a PRE-BRIEF only — phases 2–4 are NOT executed here.

---

## Phase 0 — Pre-Brief Invocation Confirmation

This session was triggered by a foreman-v2-agent comment requesting `action: "PRE-BRIEF"` for Wave LV.
**Pre-Brief mode CONFIRMED.** I do NOT execute Phase 2–4 assurance in this session.
I generate the Pre-Brief artifact only and stop.

---

## Step 0.2 — Wave LV Task Inventory

Wave LV tasks as declared by foreman-v2-agent (session-142):

| Task ID | Description | Builder |
|---------|-------------|---------|
| TASK-LV-RED-001 | File-existence meta-tests for liveness test files | qa-builder |
| TASK-LV-1-001 | `src/liveness/types.ts` — LivenessCheckResult interfaces | qa-builder |
| TASK-LV-1-002 through LV-1-012 | 11 step liveness test files (AUTO checks) | qa-builder |
| TASK-LV-1-013 | `.gitignore` + `.env.example` + `README-LIVENESS.md` | qa-builder |
| TASK-LV-2-001 | VISUAL screenshot checks (5 checks) | qa-builder |
| TASK-LV-3-001 through LV-3-003 | AI health probe tests + AI scoring checks | qa-builder |
| TASK-LV-4-001 | Manual checklist generator | qa-builder |
| TASK-LV-5-001 through LV-5-003 | Runner + report assembler + npm scripts | integration-builder |
| TASK-LV-6-001 | CI post-deploy trigger workflow | integration-builder |

---

## Step 0.3 — Qualifying Task Classification

**Trigger Table Applied**: AAWP_MAT — executable application test suite delivering liveness verification behaviour.
TASK-LV-6-001 additionally triggers: CI_WORKFLOW (dual category).

| Task ID | IAA Triggered? | Category | Rationale |
|---------|---------------|----------|-----------|
| TASK-LV-RED-001 | YES | AAWP_MAT | Executable test file (meta-tests for liveness suite gate) |
| TASK-LV-1-001 | YES | AAWP_MAT | TypeScript interface file — application code |
| TASK-LV-1-002 – LV-1-012 | YES | AAWP_MAT | 11 test implementation files |
| TASK-LV-1-013 | YES | AAWP_MAT | Config + documentation in application module |
| TASK-LV-2-001 | YES | AAWP_MAT | VISUAL check implementation |
| TASK-LV-3-001 – LV-3-003 | YES | AAWP_MAT | AI health probe implementation |
| TASK-LV-4-001 | YES | AAWP_MAT | Executable checklist generator |
| TASK-LV-5-001 – LV-5-003 | YES | AAWP_MAT | Runner + assembler — integration code |
| TASK-LV-6-001 | YES | **AAWP_MAT + CI_WORKFLOW** | CI workflow file — dual category |

**All tasks are QUALIFYING. No tasks are exempt.**

---

## Step 0.4 — Pre-Brief Artifact

---

### PRE-BRIEF SECTION 1 — Per-Task Evidence Requirements

#### TASK-LV-RED-001 — File-Existence Meta-Tests (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-RED-001 |
| `task_summary` | Vitest meta-tests that assert the existence of every liveness test file before build begins. RED gate — these tests must exist and be RED before any LV-1–4 work begins. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (build output: meta-test file present, imports correct paths). **Phase 2** (RED confirmation: `pnpm test` output shows meta-tests failing for expected reason — files not yet present). **Phase 3** (security: no hardcoded paths to prod env). **Phase 4** (ceremony: PREHANDOVER + session memory + `iaa_audit_token` field). |
| `required_evidence_artifacts` | (1) The meta-test file at the correct path per spec §7. (2) `pnpm test` run output showing RED state. (3) PREHANDOVER proof with `iaa_audit_token` field. (4) Session memory file. |
| `applicable_overlays` | BD-TIER-1 (BD-001 scope, BD-002 no-stubs), BD-TIER-3 (BD-012 zero test debt, BD-013 no test dodging). CERT-001–004. |
| `specific_rules` | CORE-007 (no TODO/stub), CORE-018 (evidence sweep), BD-013 (meta-tests must actually fail for the right reason — not vacuous). |
| `watch_points` | ⚠️ Meta-tests must reference the EXACT file paths from spec §7 (`modules/mat/tests/liveness/`). **See BLOCKER-001 below — path must be confirmed before this task begins.** |

---

#### TASK-LV-1-001 — `types.ts` TypeScript Interfaces (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-1-001 |
| `task_summary` | TypeScript interfaces for `LivenessCheckResult` and related types consumed by all liveness check implementations. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (build: file present, TypeScript compiles, exports correct). **Phase 2** (wiring: all expected check types defined — `AUTO`, `VISUAL`, `AI`, `MANUAL`; result type includes `id`, `description`, `type`, `result: 'PASS'|'FAIL'|'WARN'`, `error?`, `screenshotPath?`). **Phase 3** (security: no `any`, no unsafe casts). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) `types.ts` at correct path. (2) `tsc --noEmit` clean. (3) PREHANDOVER proof + session memory. |
| `applicable_overlays` | BD-TIER-2 (BD-009 cross-component fit), BD-TIER-4 (BD-016 no secrets), BD-TIER-5 (BD-021 no `any`). CERT-001–004. |
| `specific_rules` | Result type must exactly match spec §5 JSON shape: `{ id, description, type, result: 'PASS'|'FAIL'|'WARN', error?, screenshotPath? }`. WARN is a valid result — not just PASS/FAIL. |
| `watch_points` | Types must accommodate `WARN` state (BD-013 guard: a type that only allows PASS/FAIL would silently drop the LV-AI-06 latency warn). |

---

#### TASK-LV-1-002 through LV-1-012 — Step Liveness Test Files / `mat-liveness.spec.ts` (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-1-002 – LV-1-012 |
| `task_summary` | AUTO-type liveness checks covering STEP 0–10 (LV-00-xx through LV-10-xx). Spec §7 specifies a single `mat-liveness.spec.ts` covering all AUTO checks; the 11-file decomposition must converge to the spec's file structure. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (all 37 AUTO+VISUAL checks implemented and mapping to spec IDs). **Phase 2** (end-to-end wiring: each check uses env vars from the required set; each check exports `livenessCheckId`; cleanup runs after each check). **Phase 3** (security: test user credentials come from env, never hardcoded; no LIVENESS_TEST_PASSWORD literal in code). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) All AUTO check implementations present. (2) `livenessCheckId` export on every check file. (3) Cleanup logic present on every check that creates data. (4) `pnpm test` GREEN for all checks (or evidence that tests correctly FAIL when app is down — not vacuous). (5) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001 (full scope: all 37 AUTO+VISUAL IDs from spec §1), BD-002 (no TODO/stub checks), BD-003 (one-time build), BD-005 (wiring traced), BD-011 (100% pass), BD-012 (zero test debt), BD-013 (no vacuous tests), BD-016 (no hardcoded credentials), BD-017 (env var validation), CERT-001–004. |
| `specific_rules` | **BD-001 SCOPE CHECK**: IAA will cross-reference every check ID in spec §1 against the delivered implementation. Missing IDs = REJECTION-PACKAGE. **BD-013**: Each check must have assertions that actually verify app behaviour — not just "page loads without exception." **CLEANUP**: Every check that signs up a user, creates an org, or creates an audit must clean up those resources in an `afterEach`/`afterAll` block. |
| `watch_points` | ⚠️ **RISK-1** (see below): Account cleanup complexity — sign-up flow creates DB records; deletion must hit the right Supabase tables. ⚠️ **RISK-2**: LV-00-02 creates a user with a timestamp email — if cleanup fails, test pollution accumulates across runs. |

---

#### TASK-LV-1-013 — Config Files + README (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-1-013 |
| `task_summary` | `.gitignore` entry for `liveness-evidence/`, `.env.example` additions for all 8 required env vars, and `README-LIVENESS.md` in `src/liveness/` (or `modules/mat/tests/liveness/`). |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (files present). **Phase 2** (gitignore covers correct path; env.example covers all 8 vars: `LIVENESS_TEST_EMAIL`, `LIVENESS_TEST_PASSWORD`, `BASE_URL`, `AI_GATEWAY_URL`, `AI_DOC_PARSER_URL`, `AI_SCORING_URL`, `AI_CHAT_URL`, `AI_REPORT_URL`). **Phase 3** (no actual credentials in `.env.example`). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) `.gitignore` diff showing `liveness-evidence/` entry. (2) `.env.example` diff showing all 8 vars. (3) `README-LIVENESS.md` at correct path. (4) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001, BD-016 (no secrets in env.example), BD-002 (no stubs). CERT-001–004. |
| `specific_rules` | The gitignore path must match the actual runtime output path from spec §7 (`modules/mat/tests/liveness/liveness-evidence/`). A path mismatch means screenshots get committed to the repo accidentally. |
| `watch_points` | ⚠️ **RISK-3** (see below): Gitignore path must exactly match the liveness-evidence output path. If the suite runs from a different working directory than gitignore expects, screenshots will be committed. |

---

#### TASK-LV-2-001 — VISUAL Screenshot Checks (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-2-001 |
| `task_summary` | 5 VISUAL-type checks that take screenshots and assert the captured page is not blank. Spec §4 specifies exactly 11 required screenshots; 5 are VISUAL check type, the others are produced as evidence during AUTO checks. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (VISUAL checks present). **Phase 2** (each VISUAL check: navigates to correct state, captures screenshot at correct path matching spec §4 manifest, asserts non-blank). **Phase 3** (screenshots not committed to repo — gitignored). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) VISUAL check implementations. (2) Screenshot paths match spec §4 manifest exactly. (3) Blank-screen detection logic present (not just "screenshot taken"). (4) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001 (all 5 VISUAL IDs: LV-02-05, LV-03-06, LV-05-08, LV-07-04, LV-08-06), BD-005 (wiring: screenshot path matches runner's output location), BD-013 (non-vacuous: assertion on content, not just "Playwright didn't throw"). CERT-001–004. |
| `specific_rules` | **BD-013**: "Not blank" assertion must check actual page content (e.g., `page.locator('body').textContent()` length > 50), not just that Playwright captured a non-zero-byte file. |

---

#### TASK-LV-3-001 through LV-3-003 — AI Health Probes + AI Scoring Checks (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-3-001 – LV-3-003 |
| `task_summary` | AI-type checks: 5 AI health probes (LV-AI-01 to LV-AI-06) plus AI scoring interaction checks (LV-02-03, LV-06-02, LV-06-04 to LV-06-10, LV-10-01 to LV-10-02). Total: up to 17 AI checks. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (all AI check IDs implemented). **Phase 2** (health probes use correct env var endpoints; WARN-not-FAIL logic for latency on LV-AI-06 and LV-AI-06; LV-00-05 AUTO component correctly intercepts network request). **Phase 3** (AI gateway URL comes from env, never hardcoded; no API keys in code). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) All AI check implementations. (2) LV-AI-06 WARN threshold correctly implemented at 15s warn / 30s fail (120s for report generation). (3) Endpoint env vars: `AI_GATEWAY_URL`, `AI_DOC_PARSER_URL`, `AI_SCORING_URL`, `AI_CHAT_URL`, `AI_REPORT_URL`. (4) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001 (all AI check IDs per spec §1), BD-002 (no TODO stub AI responses), BD-013 (non-vacuous: "response non-empty" is validated against minimum content, not just `!== null`), BD-016 (no hardcoded AI keys), BD-019 (AI response quality — non-error, non-garbled), CERT-001–004. |
| `specific_rules` | **WARN state is valid** — LV-AI-06 must produce WARN (not FAIL) when response is >15s but <30s. The runner must handle WARN results without treating them as CI failures. This is explicitly specified in the pre-brief request: "Does NOT fail the deploy on WARN." |
| `watch_points` | ⚠️ **RISK-4** (see below): AI latency timeouts. Tests that call real AI endpoints will be flaky on slow days. Timeout handling and WARN-not-FAIL logic must be rock-solid. |

---

#### TASK-LV-4-001 — Manual Checklist Generator (qa-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-4-001 |
| `task_summary` | Generator that produces the Manual Liveness Checklist (spec §3) as a printable/exportable document after each automated run. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (generator present). **Phase 2** (generated checklist matches spec §3 format exactly; all 4 MANUAL check IDs covered: LV-00-05, LV-04-05, LV-06-11, LV-10-05, LV-10-06). **Phase 3** (output is a static text/markdown file — no PII in generated document). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) Generator implementation. (2) Sample output showing spec §3 sections present. (3) Run date, run-by, environment fields in output. (4) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001, BD-002, BD-003, CERT-001–004. |
| `specific_rules` | **BD-001**: All 4 MANUAL check entries from spec §1 must appear. Additional human checks (audio, video, offline, push notifications) from spec §3 must also be present. |

---

#### TASK-LV-5-001 through LV-5-003 — Runner + Report Assembler + npm Scripts (integration-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-5-001 – LV-5-003 |
| `task_summary` | Liveness runner that orchestrates all check types, report assembler that produces the JSON machine report + Markdown assurance report per spec §5, and npm/pnpm scripts to invoke the suite. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | **Phase 1** (runner + assembler + scripts present and wired). **Phase 2** (runner invokes ALL check types; assembler produces report matching spec §5 format exactly; WARN results surface in report as warnings, not failures; only blocking FAIL triggers non-zero exit code). **Phase 3** (runner handles partial failures gracefully; no unhandled promise rejections; test output not committed to repo). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) Runner implementation. (2) Report assembler with spec §5 format compliance: Summary table, Overall Verdict (`✅ LIVE | ❌ DEGRADED | ⚠️ PARTIAL`), Failed Checks section, AI Health Summary table, Screenshots section, Manual Checklist Status. (3) `package.json` scripts: at minimum `liveness:run`, `liveness:report`. (4) Sample report output (can be fixture). (5) PREHANDOVER + session memory. |
| `applicable_overlays` | BD-001 (full scope: all report sections per spec §5), BD-002 (no stub report sections), BD-003 (one-time build: runner works end-to-end on first deploy), BD-005 (runner wired to all check implementations), BD-009 (integration fit: runner correctly consumes `LivenessCheckResult` type from TASK-LV-1-001), BD-010 (no orphaned scripts), BD-011 (runner exits 0 on full PASS), BD-013 (runner exit code correctly distinguishes FAIL vs WARN), CERT-001–004. |
| `specific_rules` | **BD-013 CRITICAL**: The runner's exit code logic must be: `exit 0` if all blocking checks PASS (even if WARNs exist); `exit 1` only if any blocking check FAILs. This is explicitly required by the wave spec. A runner that exits 1 on WARN is a **defect** that causes false CI failures post-deploy. |
| `watch_points` | ⚠️ **RISK-5** (see below): Runner/report assembler integration with CI artifact upload. The `liveness-evidence/run-*/` path used for CI artifact upload must exactly match what the runner actually writes. |

---

#### TASK-LV-6-001 — CI Post-Deploy Trigger Workflow (integration-builder)

| Field | Value |
|-------|-------|
| `task_id` | TASK-LV-6-001 |
| `task_summary` | GitHub Actions workflow that triggers liveness suite post-Vercel-deploy and on `workflow_dispatch`. Uploads liveness evidence as artifact. |
| `iaa_trigger_category` | **AAWP_MAT + CI_WORKFLOW** (dual category) |
| `required_phases` | **Phase 1** (workflow file present at `.github/workflows/`). **Phase 2** (trigger on `workflow_run` for Vercel deploy success + `workflow_dispatch`; WARN does NOT fail workflow; only blocking FAIL causes workflow failure; artifact upload covers `liveness-evidence/run-*/`). **Phase 3** (secrets used correctly: `LIVENESS_TEST_EMAIL`, `LIVENESS_TEST_PASSWORD`, and all AI URL vars declared as GitHub secrets/env; no hardcoded values in YAML). **Phase 4** (ceremony). |
| `required_evidence_artifacts` | (1) Workflow YAML file. (2) `workflow_run` trigger correctly identifies the Vercel deploy workflow. (3) `workflow_dispatch` trigger present. (4) `upload-artifact` step with correct path. (5) `continue-on-error` NOT applied to blocking check steps. (6) PREHANDOVER + session memory + CI workflow evidence per OVL-CI-005. |
| `applicable_overlays` | **BUILD overlays**: BD-001, BD-002, BD-016, BD-017. **CI overlays**: OVL-CI-001 (policy correctness), OVL-CI-002 (merge gate integrity — WARN must not = FAIL), OVL-CI-003 (no silent failure paths), OVL-CI-005 (CI evidence: workflow run URL required). CERT-001–004. |
| `specific_rules` | **OVL-CI-001**: The workflow must correctly implement the "WARN ≠ FAIL" policy. If the runner exits 0 on WARN but the workflow wraps it in a step that still fails, the policy is inverted — REJECTION-PACKAGE. **OVL-CI-003**: Every step that could silently fail (artifact upload on FAIL run, env var injection) must have explicit error handling. **OVL-CI-005**: PREHANDOVER must include a CI run URL showing the workflow executed successfully. |
| `watch_points` | Dual-category means IAA applies BOTH BD overlays AND CI overlays at assurance time. This is the most overlay-dense task in Wave LV. |

---

### PRE-BRIEF SECTION 2 — Top 5 Highest-Risk Watch Points

#### ⚠️ BLOCKER-001 — FILE PATH DISCREPANCY (Must Resolve Before Wave Begins)

**Risk Level**: 🔴 BLOCKER  
**Affects**: ALL tasks (LV-RED-001, LV-1-001 through LV-1-013, LV-2-001, LV-3-001 through LV-3-003, LV-4-001, LV-5-001 through LV-5-003)

**Finding**: The foreman's wave decomposition references `src/liveness/types.ts` as the path for TASK-LV-1-001. The spec `§7 File Structure` unambiguously specifies the implementation location as:

```
modules/mat/tests/liveness/
├── mat-liveness.spec.ts
├── mat-ai-health.spec.ts
├── mat-visual.spec.ts
├── fixtures/
│   ├── test-criteria-document.pdf
│   └── test-evidence.pdf
├── liveness-evidence/
└── reports/
```

There is **no `src/liveness/` directory referenced anywhere in the spec**. If builders implement to `src/liveness/`, the delivered files will:
1. Fail the TASK-LV-RED-001 meta-tests (which should reference `modules/mat/tests/liveness/`)
2. Fail BD-005 (wiring to existing MAT module at `modules/mat/`)
3. Fail BD-022 (architecture alignment deviation)
4. Be subject to immediate REJECTION-PACKAGE at assurance time

**Pre-condition required before Wave LV-RED delegation**:  
Foreman must confirm the authoritative implementation path in writing before delegating to qa-builder. IAA recommends: `modules/mat/tests/liveness/` per spec §7. If there is a valid architecture reason to use a different path, CS2 must amend the spec before any builder begins work.

---

#### ⚠️ BLOCKER-002 — MISSING FIXTURE FILES IN TASK BREAKDOWN

**Risk Level**: 🔴 BLOCKER (for LV-1-002/LV-02-02)  
**Affects**: TASK-LV-1-002 through LV-1-012 (upload tests)

**Finding**: Spec §7 requires two fixture files:
- `modules/mat/tests/liveness/fixtures/test-criteria-document.pdf`
- `modules/mat/tests/liveness/fixtures/test-evidence.pdf`

These are **real binary files** (minimal valid PDFs) that must exist for LV-02-02 (PDF upload test) and LV-05-03 (file evidence upload test) to function. No task in the foreman's decomposition explicitly assigns creation of these fixture files.

**Pre-condition required**: Add an explicit task or add to TASK-LV-1-013 (config files task) to create the fixture PDFs. They must be minimal valid PDFs (not zero-byte files — Supabase storage and the AI document parser will reject empty files).

---

#### ⚠️ RISK-1 — Test User Cleanup Complexity

**Risk Level**: 🟠 HIGH  
**Affects**: TASK-LV-1-002 (LV-00-02 sign-up), TASK-LV-1-004 (LV-01-04 audit creation)

The liveness test creates real Supabase auth users, profiles, organisations, and audit records on each run. If cleanup fails (e.g., test times out mid-cleanup, network failure), these records accumulate and eventually:
- Exhaust Supabase row limits for test organisations
- Create noise in production monitoring dashboards
- Trigger Supabase rate limits on sign-up

**IAA will verify at assurance time**:
- `afterEach`/`afterAll` cleanup blocks present on every data-creating check
- Cleanup calls the correct Supabase admin or service-role endpoint (not a user-facing delete that requires auth)
- Cleanup failures are logged as WARN (not silently swallowed) so operations can manually clean up on failure

---

#### ⚠️ RISK-2 — AI Latency Flakiness in CI

**Risk Level**: 🟠 HIGH  
**Affects**: TASK-LV-3-001 through LV-3-003 (AI checks), TASK-LV-5-001 (runner), TASK-LV-6-001 (CI workflow)

AI endpoint response times are variable. On slow days or during model warm-up, response times may exceed the LV-AI-06 15-second WARN threshold — causing the liveness suite to report WARN on every CI run, drowning out real WARNs.

**IAA will verify at assurance time**:
- WARN threshold for AI checks is configurable via env var (not hardcoded at 15s)
- CI workflow correctly reads WARN-vs-FAIL from runner exit code (not from log parsing)
- LV-AI-06 latency measurement correctly covers ALL timed AI calls (LV-06-02, LV-06-04, LV-06-10, LV-10-01) as specified in spec §2
- Report generation timeout is correctly set to 120s (not the default 30s)

---

#### ⚠️ RISK-3 — Runner Exit Code / CI WARN-vs-FAIL Policy Inversion

**Risk Level**: 🟠 HIGH  
**Affects**: TASK-LV-5-001 through LV-5-003 (runner), TASK-LV-6-001 (CI workflow)

This is the most common failure mode for test-suite/CI integrations. The policy is explicitly:
- WARN → runner exits 0 → CI step succeeds → workflow succeeds
- FAIL on blocking check → runner exits 1 → CI step fails → workflow fails

**If any layer in the chain inverts this** (e.g., the CI step uses `continue-on-error: true` on a blocking check step, or the runner exits 1 on any WARN), the policy is broken.

IAA will trace the complete exit-code chain from `LivenessCheckResult.result` → runner aggregation logic → runner exit code → CI workflow step outcome → CI workflow final status. Any break in this chain = REJECTION-PACKAGE.

---

#### ⚠️ RISK-4 — Spec File Structure vs. Foreman's Decomposition Mismatch

**Risk Level**: 🟡 MEDIUM  
**Affects**: TASK-LV-1-002 through LV-1-012 (deliverable alignment)

The foreman's wave decomposition describes "11 step liveness test files (AUTO checks)" suggesting one file per step (step-0.spec.ts through step-10.spec.ts). The spec §7 describes ONE `mat-liveness.spec.ts` for all AUTO checks LV-00 through LV-10.

These may be reconcilable: the 11-file decomposition could be a build-time pattern where each file is separately developed and then the final delivery is a single assembled `mat-liveness.spec.ts`. OR the foreman may intend to deviate from spec §7 with 11 individual files.

**IAA will verify at assurance time**: The delivered file structure matches spec §7 exactly, OR the foreman has documented and CS2 has approved a deviation. A 12-file structure where spec requires 3 = BD-022 architecture deviation finding.

---

### PRE-BRIEF SECTION 3 — Canon Overlays Applicable to Wave LV

#### Primary Overlay: BUILD_DELIVERABLE (AAWP_MAT Category)

All tasks (LV-RED through LV-6) receive the full BUILD_DELIVERABLE overlay:

| Overlay Tier | Check IDs | Applies To |
|---|---|---|
| BD-TIER-1 (Delivery Completeness) | BD-001, BD-002, BD-003, BD-004 | ALL tasks |
| BD-TIER-2 (Wiring & Integration) | BD-005, BD-006, BD-007, BD-008, BD-009, BD-010 | LV-5 (runner wiring), LV-6 (CI wiring), LV-1 (type wiring) |
| BD-TIER-3 (Test Quality) | BD-011, BD-012, BD-013, BD-014 | ALL test tasks |
| BD-TIER-4 (Security) | BD-015, BD-016, BD-017, BD-018, BD-019 | ALL tasks — especially credential handling |
| BD-TIER-5 (Code Quality) | BD-020, BD-021, BD-022, BD-023, BD-024 | Advisory for most; BD-022 BLOCKING for path deviations |
| BD-TIER-6 (FFA Summary) | FFA-01 through FFA-06 | Wave closure summary |

**Most critical for Wave LV**: BD-001 (spec ID completeness), BD-013 (non-vacuous test assertions), BD-016 (no hardcoded credentials), BD-022 (architecture path alignment).

#### Secondary Overlay: CI_WORKFLOW (TASK-LV-6-001 only)

| Check ID | Check Name | Applies To |
|---|---|---|
| OVL-CI-001 | Workflow policy correctness | TASK-LV-6-001 — WARN≠FAIL policy |
| OVL-CI-002 | Merge gate integrity | TASK-LV-6-001 |
| OVL-CI-003 | Silent failure risk | TASK-LV-6-001 — artifact upload, env injection |
| OVL-CI-004 | Environment parity | TASK-LV-6-001 — workflow_dispatch vs. workflow_run |
| OVL-CI-005 | CI evidence present | TASK-LV-6-001 — run URL in PREHANDOVER |

#### Universal Ceremony Gate (ALL tasks)

| Check ID | Check Name |
|---|---|
| CERT-001 | PREHANDOVER proof exists |
| CERT-002 | Session memory exists |
| CERT-003 | FAIL-ONLY-ONCE attestation declared |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof |

**Applies to every builder session — qa-builder and integration-builder alike.**

#### Core Invariants (ALL tasks — CORE-001 through CORE-022)

Key invariants for AAWP_MAT category (non-agent-contract checks are active):

| CORE ID | Check | Wave LV Relevance |
|---------|-------|------------------|
| CORE-005 | Governance block present | n/a (no agent contracts in this wave) |
| CORE-007 | No placeholder content | HIGH — stub tests, TODO cleanups |
| CORE-013 | IAA invocation evidence | HIGH — PREHANDOVER must contain `iaa_audit_token` |
| CORE-015 | Session memory present | HIGH — all builder sessions |
| CORE-016 | IAA token file exists | HIGH — post-verdict token file required |
| CORE-018 | Complete evidence artifact sweep | BLOCKING — first check applied |
| CORE-020 | Zero partial pass rule | Absent evidence = FAIL, no assumed passes |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE, no "minor" exceptions |

---

### PRE-BRIEF SECTION 4 — Pre-Conditions and Blockers Before Delegation Proceeds

#### Pre-Conditions (Must Be Met Before Builders Begin)

| Pre-Condition ID | Condition | Owner | Blocking |
|------------------|-----------|-------|----------|
| PC-LV-001 | **BLOCKER-001 RESOLUTION**: Foreman confirms authoritative implementation path is `modules/mat/tests/liveness/` per spec §7, not `src/liveness/`. Written confirmation in wave task files or issue comment. | foreman-v2-agent | YES — blocks Wave LV-RED |
| PC-LV-002 | **BLOCKER-002 RESOLUTION**: Explicit task assigned to create `fixtures/test-criteria-document.pdf` and `fixtures/test-evidence.pdf` (minimal valid PDFs). | foreman-v2-agent | YES — blocks LV-1-002, LV-1-005 |
| PC-LV-003 | Foreman declares the final file structure: Is the delivery 3 files matching spec §7 (`mat-liveness.spec.ts`, `mat-ai-health.spec.ts`, `mat-visual.spec.ts`) OR 11+ individual step files? If 11 files, CS2 approval required for spec §7 deviation before building begins. | foreman-v2-agent / CS2 | YES — blocks LV-1-002 through LV-1-012 |
| PC-LV-004 | qa-builder session must be a fresh builder session (not the same session as foreman). Independence requirement enforced at assurance time. | foreman-v2-agent | YES |
| PC-LV-005 | The existing MAT test infrastructure at `modules/mat/tests/` must be confirmed operational (existing tests GREEN) before adding the liveness suite. If existing tests are RED, BD-004 applies and LV wave is blocked until existing debt is cleared. | foreman-v2-agent / qa-builder | ADVISORY — verify before LV-RED |

#### CST/CWT Obligations (IAA Prompting per COMBINED_TESTING_PATTERN.md §4.2)

**CST Assessment**: Wave LV is a new test suite module being integrated into the existing MAT module (`modules/mat/`). The runner (LV-5) integrates with npm scripts in the MAT package.json. The CI workflow (LV-6) integrates with the existing Vercel deploy workflow.

This constitutes a **cross-module integration convergence point** when LV-5 closes. IAA will prompt Foreman to commission a CST covering:
- LV-1 through LV-4 (qa-builder test files)
- LV-5 (runner + assembler)
- Existing MAT test suite

...before LV-6 (CI workflow) begins, to confirm the suite runs correctly end-to-end before CI wiring is added.

**CWT Obligation**: After all LV subwaves complete, before wave closure/IBWR: CWT is mandatory per `COMBINED_TESTING_PATTERN.md §5.2`. IBWR cannot close without CWT PASS.

---

### PRE-BRIEF SECTION 5 — PREHANDOVER Proof Template Reminder for Wave LV Builders

Each builder session (qa-builder and integration-builder) must produce a PREHANDOVER proof containing:

```markdown
# [Agent] PREHANDOVER Proof — Wave LV — [Task ID]
**Session**: session-NNN
**Wave**: Wave LV — MAT Liveness Test Suite
**Branch**: copilot/implement-mat-liveness-test-suite
**Issue**: #932

## Scope Declaration
[Exact list of files delivered — must match `git diff --name-only origin/main...HEAD`]

## Evidence Checklist
- [ ] All check IDs from spec §1 within scope of this task: DELIVERED
- [ ] `livenessCheckId` exported from every check file: YES/NO
- [ ] Cleanup blocks present: YES/NO (list which checks clean up)
- [ ] No hardcoded credentials: CONFIRMED
- [ ] TypeScript compiles clean: CONFIRMED
- [ ] Tests pass: CONFIRMED (attach run output)
- [ ] FAIL-ONLY-ONCE attested: YES (rules A-001, A-002, A-016, A-021, A-026)

## IAA Audit Token
iaa_audit_token: IAA-session-NNN-waveLV-YYYYMMDD-PASS  ← pre-populate per A-029
```

Per **A-029** (PREHANDOVER immutability): the `iaa_audit_token` field must be pre-populated at commit time with the expected reference format. IAA writes the dedicated token file post-verdict. PREHANDOVER is READ-ONLY post-commit.

Per **A-026** (SCOPE_DECLARATION exact match): the scope declaration must exactly match `git diff --name-only origin/main...HEAD` at invocation time. A stale SCOPE_DECLARATION = BL-027 merge gate parity failure = REJECTION-PACKAGE.

---

## Pre-Brief Summary

**Wave LV status**: QUALIFIED for delegation — subject to BLOCKER-001 and BLOCKER-002 resolution.

**Qualifying tasks**: 9 task groups (all tasks in the wave), covering AAWP_MAT + CI_WORKFLOW categories.

**Two blockers must be resolved by foreman before delegation**:
1. **BLOCKER-001**: File path confirmation (`modules/mat/tests/liveness/` per spec §7, not `src/liveness/`)
2. **BLOCKER-002**: Fixture PDF creation task must be explicitly assigned

**Top watch points for assurance**:
1. Architecture path alignment (BD-022) — REJECTION-PACKAGE if wrong path
2. Test user cleanup completeness — BD-013, BD-012
3. WARN-vs-FAIL exit code chain integrity — OVL-CI-001, BD-013
4. AI latency handling — WARN not FAIL for slow responses
5. Runner/CI artifact upload path match — BD-005

**Applicable overlays**: BUILD_DELIVERABLE (BD-001 through BD-024), CI_WORKFLOW (OVL-CI-001 through OVL-CI-005 for LV-6-001), Universal Ceremony Gate (CERT-001–004), Core Invariants (CORE-001–022).

**CST prompt**: Required when LV-5 closes (before LV-6 begins).
**CWT prompt**: Required before wave IBWR completion.

---

**IAA Pre-Brief Reference**: IAA-PREBRIEF-waveLV-20260305
**Pre-Brief artifact path**: `.agent-admin/assurance/iaa-prebrief-waveLV-20260305.md`
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Phase B blocking active**: All Wave LV assurance invocations will be hard-gate verdicts.
