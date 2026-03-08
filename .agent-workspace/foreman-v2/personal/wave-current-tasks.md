# Wave Current Tasks — foreman-v2-agent — wave15r-closure

**Wave**: wave15r-closure
**Branch**: copilot/run-cwt-and-ibwr-for-closure
**Issue**: maturion-isms#1003 — Wave 15R: Run CWT and IBWR after remediation merge for governance closure
**Date**: 2026-03-08
**Session**: session-wave15r-closure-correction-20260308
**CS2 Authorization**: Issue #1003 opened directly by @APGI-cmy
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-closure.md` — RETROACTIVE (see INC-PREBRIEF-GOVERNANCE-CLOSURE-001)
**Ceremony Model**: Governance-only closure session — no builder delegation

---

## BREACH NOTE — INC-PREBRIEF-GOVERNANCE-CLOSURE-001

This wave-current-tasks.md was NOT created before the initial wave15r-closure session commit.
That is the violation being remediated in this correction session.
CS2 issued a FOREMAN RE-ALIGNMENT directive (maturion-isms#1003 comment, 2026-03-08).

---

## Wave Context

**Wave Slug**: wave15r-closure
**Summary**: Post-merge governance closure for Wave 15R (Criteria Parsing Pipeline Remediation).
PR #1002 was merged to main on 2026-03-08. This closure session compiles the CWT evidence,
produces the IBWR, and closes the governance loop for INC-WAVE15-PARSE-001.

No production code, tests, or CI scripts are modified. All changes are governance documents.

---

## Tasks — wave15r-closure

| Task ID | Description | Builder | Status |
|---------|-------------|---------|--------|
| CWT-W15R-001 | Compile CWT evidence (vitest 81/81 GREEN + pytest 45/45 GREEN) | foreman-v2-agent (governance only) | ✅ DONE |
| IBWR-W15R-001 | Produce IBWR with all 7 INC-WAVE15-PARSE-001 root causes closed | foreman-v2-agent (governance only) | ✅ DONE |
| IMPL-PLAN-001 | Update implementation plan v2.6.0 — Wave 15R status CLOSED | foreman-v2-agent (governance only) | ✅ DONE |
| CORRECTION-001 | Record INC-PREBRIEF-GOVERNANCE-CLOSURE-001 in FAIL-ONLY-ONCE registry | foreman-v2-agent (governance only) | IN PROGRESS |
| CORRECTION-002 | Create wave-current-tasks.md (retroactive) | foreman-v2-agent (governance only) | ✅ DONE (this file) |
| CORRECTION-003 | Invoke IAA Pre-Brief and create pre-brief artifact | foreman-v2-agent (governance only) | IN PROGRESS |
| CORRECTION-004 | Create CORRECTION-ADDENDUM for wave15r-closure session | foreman-v2-agent (governance only) | PENDING |

---

**IAA Pre-Brief Qualifying Tasks (per A-031):**
- CWT-W15R-001: N/A (already complete — corrective session)
- IBWR-W15R-001: N/A (already complete — corrective session)
- CORRECTION-001 through CORRECTION-004: Governance correction — IAA review of violation recording

> This wave-current-tasks.md was created retroactively as part of INC-PREBRIEF-GOVERNANCE-CLOSURE-001
> corrective action. Per A-031: retroactive Pre-Brief does not fully satisfy the rule — the
> violation has been recorded in FAIL-ONLY-ONCE registry.
