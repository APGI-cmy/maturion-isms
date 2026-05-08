# ECAP Bundle — PR #1582 | ECAP snapshot enforcement hardening | 2026-05-08

**Session**: ecap-pr-1582-ecap-snapshot-enforcement-20260508
**Date**: 2026-05-08
**Producing Agent**: execution-ceremony-admin-agent
**Issue**: maturion-isms#1581
**Branch**: copilot/harden-current-head-gate-snapshot-enforcement
**PR**: #1582

---

protected_path_touched: true
ecap_required: true
ecap_invoked: true
ceremony_admin_appointed: execution-ceremony-admin-agent
ecap_verdict: PASS
iaa_audit_token: PENDING
# iaa_audit_token is PENDING because IAA cannot be invoked until CI is green.
# Per FAIL-ONLY-ONCE A-021 and PREHANDOVER template guidance (v1.3.0+),
# handover_allowed MUST remain NO while iaa_audit_token is PENDING or absent.

## Artifacts

- prehandover_proof: `.agent-admin/prehandover/proof-pr-1582-ecap-admin-ceremony-20260508.md`
- ecap_bundle: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1582-ecap-admin-ceremony-20260508.md`
- scope_declaration: `.agent-admin/scope-declarations/pr-1582.md`
- pr_manifest: `.admin/prs/pr-1582.json`

## Protected Paths Changed

- `governance/checklists/phase4-role-separation-operational-guidance.md`
- `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`
- `.github/workflows/handover-claim-gate.yml`

## Gate Test Evidence

The following test cases were executed locally against the snapshot precondition logic extracted from `.github/workflows/handover-claim-gate.yml` (the `readSnapshotField`, `isNonEmptySignal`, `asBoolYesNo` functions and the precondition validation block at lines 340–388 of the workflow):

**Test case 1 — `ready_for_review` without snapshot comment → BLOCK**
- `isIssueComment = false`
- Expected: preconditionFailures includes "Handover trigger came from ready_for_review without required current-head snapshot comment"
- Result: BLOCK ✅

**Test case 2 — Snapshot has `FAILING_CHECKS` set but `HANDOVER_ALLOWED: yes` → BLOCK**
- Input: `FAILING_CHECKS: preflight/scope-declaration-parity`, `HANDOVER_ALLOWED: yes`
- Expected: preconditionFailures includes "Snapshot reports failing/pending/missing checks while HANDOVER_ALLOWED is yes"
- Result: BLOCK ✅

**Test case 3 — Full green snapshot with all 11 required fields → preconditions PASS**
- Input: all fields set, `FAILING_CHECKS: none`, `PENDING_CHECKS: none`, `MISSING_CHECKS: none`, `HANDOVER_ALLOWED: yes`
- Expected: missingSnapshotFields = [], no precondition failures
- Result: PRECONDITIONS PASS ✅

**Test case 4 — Bullet-prefixed field parser regression**
- Input: all fields prefixed with `- ` (e.g., `- CURRENT_HEAD_SHA: c828c1d...`)
- Expected: all 11 fields successfully parsed (matches `readSnapshotField` regex `^\\s*(?:[-*]\\s+)?FIELD:`)
- Result: All fields parsed ✅

All test cases confirm the gate logic correctly enforces:
- `ready_for_review` without snapshot → BLOCK
- Internal snapshot inconsistency (`FAILING_CHECKS` set + `HANDOVER_ALLOWED: yes`) → BLOCK
- Valid all-green snapshot → preconditions PASS
- Bullet-prefixed field format accepted by parser

## IAA Token Pending Hardening (v1.3.0)

The following evidence covers the `iaa_audit_token: PENDING` watchdog pattern addressed by this PR's hardening of the PREHANDOVER template, Phase 4 guidance, and handover-claim-gate.yml. (Test cases 1–4 above cover the current-head snapshot gate; the numbering continues here.)

**Test case 5 — `iaa_audit_token: PENDING` + handover language → Governance Watchdog Gap 3 fires**
- Input: PREHANDOVER proof with `iaa_audit_token: PENDING` (or field absent) + file contains handover language
- Expected: Governance Watchdog `gap3-prehandover-pending-token` posts "IAA Token Missing at Handover" alert
- Result: WATCHDOG FIRES ✅ (observed on this PR: comment 4406151257)
- Confirmed: `handover_allowed: no` is the correct state while `iaa_audit_token: PENDING`; ECAP bundle and proof updated to make `iaa_audit_token: PENDING` explicit rather than absent.

Governance hardening added in this PR to prevent future occurrences:
- PREHANDOVER template: `handover_allowed` comment extended — MUST be NO if `iaa_audit_token` is PENDING/absent
- PREHANDOVER template: `iaa_audit_token` comment extended — BLOCKING while PENDING; set to resolved path only after IAA PASS token issued
- Phase 4 guidance ECAP section: MUST NOT rule added for IAA token pending + risk-scan question #13
- Phase 4 guidance Foreman section: checklist item added for IAA token verification + risk-scan question #13
- handover-claim-gate.yml header: documents IAA-token-pending as related blocking condition referencing Watchdog gap3 and A-021
