# Wave Current Tasks — foreman-v2-agent

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
