# Wave Current Tasks — foreman-v2-agent

**Wave**: FCWT-Final — Final Combined Wave Testing for Entire Build (All Waves 0–14)
**Session**: session-144
**Date**: 2026-03-05
**Issue**: Run FCWT (Final Combined Wave Testing) for Entire Build
**Branch**: copilot/run-fcwt-for-entire-build
**CS2 Authorization**: Issue assigned to foreman-v2-agent by @APGI-cmy
**Protocol Reference**: FINAL_COMPLETE_WAVE_TEST_PROTOCOL.md v1.0.0

---

## FCWT Scope

Final Combined Wave Testing covers all waves of the MAT (Manual Audit Tool) build:
- Waves 0–9.11 (core build)
- Wave 10–13 (advanced features + CI-certified auth/wiring)
- Wave 14 (UX workflow gap remediation — all batches A/B/C, all 15 GAPs closed)
- Postbuild waves (postbuild-fails-01/02/03)

Known baseline: 706 GREEN / 715 total (9 EXPECTED RED = pre-existing live-env only)
FCWT entrance criterion: 100% CI-testable tests GREEN, 0 regressions from Wave 14

---

## FCWT Task List

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 1 | TASK-FCWT-001 | Execute full test suite (npx vitest run) — confirm 706+ GREEN, document exact count, produce FCWT run log | qa-builder | 🔴 PENDING |
| 2 | TASK-FCWT-002 | Create FCWT certificate `modules/mat/05-build-evidence/fcwt-final-certificate-20260305.md` covering all waves 0–14 | qa-builder | 🔴 PENDING |
| 3 | TASK-FCWT-003 | Create FCWT evidence bundle `modules/mat/05-build-evidence/fcwt-final-evidence-bundle-20260305.md` listing all prior CWT/CST tokens and wave completion evidence | qa-builder | 🔴 PENDING |
| 4 | TASK-FCWT-004 | Update BUILD_PROGRESS_TRACKER.md to record FCWT results and production readiness sign-off | mat-specialist | 🔴 PENDING |

---

## Sequencing

```
TASK-FCWT-001 (qa-builder: test execution)
  ↓ FOREMAN QP EVALUATION
TASK-FCWT-002 (qa-builder: certificate)
TASK-FCWT-003 (qa-builder: evidence bundle)
  ↓ FOREMAN QP EVALUATION
TASK-FCWT-004 (mat-specialist: BUILD_PROGRESS_TRACKER)
  ↓ FOREMAN QP EVALUATION + PHASE 4 (PREHANDOVER + IAA)
```

---

## Governance

- IAA Category: AAWP_MAT
- Each substantive task = PREHANDOVER proof + IAA gate before merge
- CS2 sign-off required before production deployment

---

**Wave**: Wave 14 Final — Apply Final Supabase Migrations (000000–000008) with PREHANDOVER Proof and IAA Token
**Wave**: Wave 14 IBWR — Formal In-Between Wave Reconciliation & Progress Tracker Update
**Session**: session-143
**Wave**: Wave LV (MAT Liveness Test Suite) — 6 sub-waves (LV-RED, LV-1 through LV-5)
**Session**: session-142
**Wave**: Wave GovImpr — IAA Governance & Template Improvements (A-028, Token Date, Test Fallbacks, OVL-CI-006)
**Session**: session-current
**Date**: 2026-03-05
**Issue**: Implement IAA Governance & Template Improvements (A-028, Token Date, Test Fallbacks, OVL-CI-006)
**Branch**: copilot/update-iaa-governance-templates
**CS2 Authorization**: Issue opened and assigned by CS2 (@APGI-cmy) directly
**IAA Pre-Brief**: PENDING — awaiting IAA Pre-Brief artifact

---

## Outstanding Tasks

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 1 | TASK-GI-001 | Update `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v2.6.0→v2.7.0: (a) Add A-029 SCOPE_DECLARATION Fresh-Overwrite rule; (b) Add A-031 OVL-CI-006 Workflow Job Permissions rule (pending CS2 approval); (c) Add S-017 improvement suggestion for SCOPE_DECLARATION; (d) Add S-018 for IAA token date accuracy; (e) Add S-019 for workflow job permissions; (f) Add S-020 for FAIL-ONLY-ONCE delegation to IAA; (g) Document IAA delegation protocol for FAIL-ONLY-ONCE approvals in Section 1 preamble; (h) Update attestation block in Section 4. Update `index.md` to bump knowledge version. | governance-liaison-isms-agent | 🔴 PENDING |
| 2 | TASK-GI-002 | Update `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` v1.4.0→v1.5.0: Add explicit note in SCOPE_DECLARATION section — "Always begin with `cat /dev/null > SCOPE_DECLARATION.md` before writing new scope content (prevents A-028 stale content rejections)". Add note for IAA token date — "Use the actual assurance token filename/date from the IAA token file, not the session date". | governance-liaison-isms-agent | 🔴 PENDING |
| 3 | TASK-GI-003 | Update `.agent-workspace/mat-specialist/knowledge/` Tier 2 brief to require lookup of actual assurance token filename/date when referencing IAA tokens. Add note: "IAA token date must match the token file date, not the session date — look up actual `.agent-admin/assurance/iaa-token-session-NNN-*` filename before citing the token". | governance-liaison-isms-agent | 🔴 PENDING |
| 4 | TASK-GI-004 | Update `modules/mat/tests/liveness/README-LIVENESS.md`: Add explicit WARNING block for `BASE_URL` and `LIVENESS_TEST_PASSWORD` fallback values — tests will silently run against localhost (not production) if `BASE_URL` is not set; `LIVENESS_TEST_PASSWORD` has a hardcoded fallback `LivenessTest!2026` which must not be used in production environments; all env vars should be explicitly set. | qa-builder | 🔴 PENDING |
| 5 | TASK-GI-005 | Add `permissions:` blocks to `.github/workflows/copilot-setup-steps.yml` and `.github/workflows/provider-model-ban.yml`. Both workflows currently lack explicit `permissions:` declarations (OVL-CI-006 compliance). `copilot-setup-steps.yml` needs `contents: read`; `provider-model-ban.yml` needs `contents: read`. Add at workflow level (before `jobs:`). | integration-builder | 🔴 PENDING |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief received and read
- [ ] TASK-GI-001 complete: FAIL-ONLY-ONCE.md updated with A-029, A-031 candidate, S-017–S-020, delegation protocol
- [ ] TASK-GI-002 complete: prehandover-template.md updated with SCOPE_DECLARATION and token date notes
- [ ] TASK-GI-003 complete: mat-specialist Tier 2 knowledge updated for IAA token date accuracy
- [ ] TASK-GI-004 complete: README-LIVENESS.md updated with explicit env var warnings
- [ ] TASK-GI-005 complete: workflow permissions blocks added to 2 workflows
- [ ] All tasks show 🟢 DONE
- [ ] QP evaluation complete (all builders PASS)
- [ ] §4.3 Merge gate parity check executed (scripts run)
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

## Sequencing

```
TASK-GI-001 (governance-liaison-isms-agent) ─── parallel ──→ TASK-GI-004 (qa-builder)
TASK-GI-002 (governance-liaison-isms-agent) ─── parallel ──→ TASK-GI-005 (integration-builder)
TASK-GI-003 (governance-liaison-isms-agent)
  ↓ All complete
QP Evaluation (Foreman)
  ↓
§4.3 Merge Gate Parity Check
  ↓
IAA Final Audit
  ↓
Token Ceremony (§4.3b)
  ↓
Handover to CS2
```

## Governance
- IAA Category: GOVERNANCE_ARTIFACT
- IAA Overlays: CORE-001–022, OVL-CI-006, BD-001–024
- Total tasks: 5
- All tasks = one PREHANDOVER proof + single IAA gate
