# Wave Current Tasks — foreman-v2-agent

**Wave**: GOVERNANCE-2064 rejected-IAA control correction
**Session ID**: copilot-prevent-rejected-iaa-handover
**Date**: 2026-10-05
**Branch**: copilot/prevent-rejected-iaa-handover
**CS2 Authorization**: Issue #2064 bounded implementation appointment
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-pr-2065-prevent-rejected-iaa-handover-20261005.md

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | Correct protected Foreman, IAA, and active-CS2 Tier 1 contracts for rejected-assurance and class-first control flow | CodexAdvisor-agent | 🔴 PENDING | Issue #2064 |
| 2 | Correct product gate class routing and focused regression coverage for mixed migration/security payloads | qa-builder | 🟡 IN PROGRESS | Substantive work complete per PR #2065 commit `7dd188a7484365d272d2c79d3de3695a9c7c3838` (GOV-2064-T2): fixes to `.github/scripts/post-handover-auto-remediation.js`, `.github/workflows/handover-claim-gate.yml`, `.github/scripts/pre-handover-checkpoint.js` with regression coverage (`post-handover-auto-remediation.test.sh` 12/12, `handover-claim-gate.test.sh` 45/45, `pre-handover-checkpoint.test.sh` 57/57, all green); pending independent IAA re-assessment of the corrected T2 slice before this row may read 🟢 DONE |
| 3 | Align active-CS2 Tier 2/Tier 3 rejection deduplication, bounded correction, and refusal behavior | active-cs2-agent | 🟡 IN PROGRESS | Existing T3 assurance covers commit `b5ea440`; successor-wave and stale-IAA refusal regression added in PR #2065 commit `94e1559`, pending IAA reassessment |
| 4 | Align Foreman Tier 2/checkpoint semantics and verify the OPOJD v2.0/v2.1 layer-down route | governance-liaison-isms-agent | 🟡 IN PROGRESS | Substantive work complete per PR #2065 — see `.agent-admin/prehandover/proof-pr-2065-gov-2064-t4-foreman-tier23-opojd-20261005.md`; pending independent IAA re-assessment of the corrected T4 slice before this row may read 🟢 DONE |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| 2065 | `IAA-session-gov2064-t1t2t4-reassess-20261005-PASS` (scoped: T1 excl. IAA-file / T2 / T4, HEAD `4f4a698`) | 2026-10-05 |
| 2065 | `IAA-session-gov2064-t3-aggregate-20261006-PASS` (scoped: T3 + aggregate current-head closure excl. IAA-file content, HEAD `99b6373`) | 2026-10-06 |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] All PRs have ASSURANCE-TOKEN
- [ ] Session memory written
- [ ] PREHANDOVER proof committed (or BUILD-EVIDENCE PREHANDOVER_PROOF_SESSION committed)
- [ ] ECAP reconciliation summary committed when ceremony_admin_appointed is true
- [ ] CS2 notified for merge approval
