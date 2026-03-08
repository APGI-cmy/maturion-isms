# Wave Current Tasks — foreman-v2-agent — T-W15R-QA-001 (create-red-tests-wave-15r)

**Wave**: Wave 15R Batch C — T-W15R-QA-001 (governance closure for qa-builder RED test delegation)
**Branch**: copilot/create-red-tests-wave-15r
**Issue**: maturion-isms#1000 — T-W15R-QA-001 — 5 RED tests for Wave 15R UX features
**Date**: 2026-03-08
**Session**: session-T-W15R-QA-001-20260308
**CS2 Authorization**: Issue #1000 opened directly by @APGI-cmy; "Please finish this job" directive 2026-03-08
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md` — PENDING

---

## GOVERNANCE CONTEXT — INC-OPOJD-W15R-QA-001 Recovery

Issue #1000 was created to recover the OPOJD failure recorded as INC-OPOJD-W15R-QA-001:
during the wave15r-gov governance session, qa-builder was delegated T-W15R-QA-001 (5 RED tests)
but no GitHub issue was created. The tests were delivered in Wave 15R and merged to main.

**Current test status**: `modules/mat/tests/wave15r/wave15r-ux-features.test.ts` — 35 assertions
covering T-W15R-UX-001 through T-W15R-UX-005. Tests are GREEN (implementation is complete).
The QA-to-Red gate sequence was bypassed (tests written post-implementation). This is recorded
in FAIL-ONLY-ONCE v3.2.0 as INC-OPOJD-W15R-QA-001 (REMEDIATED).

**Purpose of this PR**: Governance closure — produce proper governance artifacts for issue #1000
to close the OPOJD recovery loop. CS2 authorization: "Please finish this job" directive.

---

## Tasks — T-W15R-QA-001

| Task ID | Description | Builder | Status |
|---------|-------------|---------|--------|
| GOVERNANCE-001 | wave-current-tasks.md created for this wave | foreman-v2-agent (governance) | ✅ DONE |
| GOVERNANCE-002 | IAA Pre-Brief invoked | foreman-v2-agent → IAA | 🔴 PENDING |
| GOVERNANCE-003 | SCOPE_DECLARATION.md updated for this wave | foreman-v2-agent (governance) | 🔴 PENDING |
| QP-EVAL-001 | QP evaluation of qa-builder deliverable (wave15r-ux-features.test.ts on main) | foreman-v2-agent (QP mode) | 🔴 PENDING |
| PREHANDOVER-001 | PREHANDOVER proof + session memory written | foreman-v2-agent (governance) | 🔴 PENDING |
| IAA-AUDIT-001 | IAA final audit invoked | foreman-v2-agent → IAA | 🔴 PENDING |
| MERGE-001 | Merge gate released | foreman-v2-agent | 🔴 PENDING |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief published at `.agent-admin/assurance/iaa-prebrief-wave15r-qa001.md`
- [ ] QP evaluation of qa-builder deliverable: PASS
- [ ] PREHANDOVER proof committed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval

---

# ───────────────────────────────────────────────
# ARCHIVED — wave15r-closure (previous wave)
# ───────────────────────────────────────────────
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
