# MMM — Wave Execution Standard
## Stage 12 — Build Execution Governance Standard

---

## Status Header

- **Module**: MMM — Maturity Model Management
- **Artifact Type**: Wave Execution Standard (Stage 12 governance requirement)
- **Status**: ACTIVE — Applies to all MMM build waves from Phase 3 onwards
- **Version**: 1.1.0
- **Date**: 2026-05-18
- **Owner**: CS2 (Johan Ras / @APGI-cmy)
- **Produced By**: mat-specialist (delegated by foreman-v2-agent; wave mmm-phase3-retrofit-20260507)
- **Issue**: maturion-isms#1564 (Phase 3 retrofit)
- **Governing Wave Record**: `.agent-admin/assurance/iaa-wave-record-mmm-phase3-retrofit-20260507.md`

---

## 0. Purpose

This document defines the Functional Delivery Evidence Pack (FDEP) that every MMM build wave
MUST deliver before handover is accepted.

The FDEP requirement was created in response to PR maturion-isms#1553, where a wave was
accepted as complete despite:
- visible CTAs with no backend target
- no error handling
- no journey-level evidence
- no live/preview smoke confirmation

This standard ensures the failure class documented in maturion-isms#1553 cannot recur.

---

## 1. Functional Delivery Evidence Pack (FDEP) — Minimum Required Contents

Every MMM build wave handover MUST include ALL of the following before IAA is invoked:

### 1.1 CTA/API Matrix Completed (for this wave's scope)

**What**: A completed table showing every CTA introduced or modified in this wave, with its
backend target confirmed.

**Format**: Reference or copy of the CTA/API/Data Contract Matrix from Stage 2, filtered to
this wave's scope.

**Verified by**: Integration role (see Stage 11 Wave Role Assignment Matrix).

| Evidence Item | Required | Format |
|---|---|---|
| All new CTAs registered in matrix | ✅ MANDATORY | Matrix row per CTA |
| All matrix entries have non-null backend capability | ✅ MANDATORY | Row-by-row confirmation |
| No CTA left with "TBD" backend | ✅ MANDATORY | Zero TBD entries |

### 1.2 All Visible Actions Tested

**What**: Test results confirming every visible action (CTA click) in this wave calls a real
backend target.

**Format**: QA test run output for Domain 12 (T-MMM-S6-FD-001 through FD-006) scoped to this
wave.

| Evidence Item | Required | Format |
|---|---|---|
| T-MMM-S6-FD-001 result | ✅ MANDATORY | Test pass/fail with log |
| T-MMM-S6-FD-002 result (no 404) | ✅ MANDATORY | Test pass/fail with log |
| T-MMM-S6-FD-003 result (error visible) | ✅ MANDATORY | Test pass/fail with log |
| T-MMM-S6-FD-004 result (state updates) | ✅ MANDATORY | Test pass/fail with log |
| T-MMM-S6-FD-005 result (no placeholders) | ✅ MANDATORY | Test pass/fail with log |
| T-MMM-S6-FD-006 result (golden path) | ✅ MANDATORY when scope touches golden path | Test pass/fail with log |

### 1.3 Preview/Live URL

**What**: A URL where the wave's changes can be observed running live or in preview.

| Evidence Item | Required | Format |
|---|---|---|
| Preview deployment URL | ✅ MANDATORY | URL with deployment timestamp |
| URL accessible (returns HTTP 200 for entry route) | ✅ MANDATORY | Manual verification log |
| URL shows new functionality (not pre-wave state) | ✅ MANDATORY | Screenshot comparison |

### 1.4 Screenshots

**What**: Before/after screenshots of every new or modified user-facing screen.

| Evidence Item | Required | Format |
|---|---|---|
| Screenshot of every new screen (after state) | ✅ MANDATORY | PNG/JPEG, labelled by journey step |
| Screenshot of error state for each new CTA | ✅ MANDATORY | Shows visible error message |
| Screenshot of success state for each new CTA | ✅ MANDATORY | Shows state change |
| Screenshot of dashboard update (if applicable) | ✅ MANDATORY when dashboard scope touched | Shows new scores/state |

### 1.5 Backend Logs or Workflow Evidence

**What**: Log output or backend confirmation showing the backend processed the requests.

| Evidence Item | Required | Format |
|---|---|---|
| Edge Function invocation log (or Vercel log) | ✅ MANDATORY for each new backend call | Log snippet per function |
| Database record confirmation | ✅ MANDATORY for each mutating operation | Row count or record screenshot |
| Error handling log (for simulated error state) | ✅ MANDATORY | Log showing error path executed |

### 1.6 Known Limitations

**What**: An explicit, honest declaration of what this wave does NOT deliver, even if it
appears to.

| Evidence Item | Required | Format |
|---|---|---|
| Placeholder UI (if any) explicitly declared | ✅ MANDATORY if any placeholder exists | List with CS2 approval ref |
| Partial functionality (if any) declared | ✅ MANDATORY if any feature is incomplete | List with planned completion wave |
| Out-of-scope CTAs (present but not wired) | ✅ MANDATORY if any exist | List — these must be hidden, not shown |

### 1.7 Explicit Delivery Verdict

**What**: A binary statement from the builder confirming delivery status.

```
FUNCTIONAL DELIVERY VERDICT

Wave: [wave-name]
Scope: [list of features delivered]

All visible CTAs call real backend targets: [ ] YES / [ ] NO
Error states are visible for all failed calls: [ ] YES / [ ] NO
Success states update UI correctly for all calls: [ ] YES / [ ] NO
No placeholder accepted as functional delivery: [ ] YES / [ ] NO
Golden path (OC-009) not broken: [ ] YES / [ ] NO

VERDICT: [ ] FUNCTIONALLY COMPLETE  [ ] INCOMPLETE — [reason]

Builder: ____________________  Date: ____________________
```

**A wave is not eligible for IAA final assurance until the VERDICT is marked FUNCTIONALLY
COMPLETE.**

### 1.8 Compile Handoff Evidence Pack (Scope-Specific: `/assessment/framework`)

For any implementation wave that addresses compile handoff to `/assessment/framework`
(governing issue: maturion-isms#1669; including APGI-cmy/maturion-isms#1667), the Functional Delivery Evidence Pack MUST include:

| Evidence Item | Required | Format |
|---|---|---|
| Preview URL proving compile handoff route render | ✅ MANDATORY | URL + timestamp + referenced framework_id |
| Screenshot: compile success destination visible workspace state | ✅ MANDATORY | Labelled image showing non-blank workspace |
| Screenshot: missing `framework_id` error state | ✅ MANDATORY | Labelled image with user-facing error message |
| Screenshot: invalid/unresolvable `framework_id` error state | ✅ MANDATORY | Labelled image with user-facing error message |
| Mode A/B/C handoff verification evidence | ✅ MANDATORY | Test output and journey-step evidence showing visible workspace post-compile |
| Explicit compile handoff functional verdict | ✅ MANDATORY | PASS/FAIL statement for "URL + visible workspace render" |

URL-only redirect proof is explicitly insufficient for this scope.

---

## 2. Handover Sequence

No wave may proceed to handover without completing the following in order:

1. Builder completes all FFD Affirmations (Stage 9 Builder Checklist — FFD Section)
2. QA confirms Domain 12 tests pass for wave scope
3. Integration confirms CTA/API matrix complete for wave scope
4. Builder populates the Functional Delivery Evidence Pack (all 7 sections above)
5. Builder marks FUNCTIONAL DELIVERY VERDICT as FUNCTIONALLY COMPLETE
6. Foreman Quality Professor review
7. Stage 11 Wave Role Assignment Matrix — all 5 roles confirmed
8. ECAP ceremony
9. IAA final assurance (per Stage 10 FDM mandate)

---

## 3. Origin and Authority

This standard was created in direct response to the functional delivery failure documented in
maturion-isms#1553 (Phase 0 — temporary build freeze).

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Governing issue**: maturion-isms#1564 (Phase 3 retrofit)
**Applies from**: Wave mmm-phase3-retrofit-20260507 onwards
**Revision required when**: New delivery patterns (mobile, offline, batch) are introduced

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.1.0 | 2026-05-18 | Added scope-specific compile handoff evidence requirements for `/assessment/framework`, including preview URL, success/error screenshots, Mode A/B/C verification, and explicit functional verdict |
| 1.0.0 | 2026-05-07 | Initial Wave Execution Standard — created per Phase 3 retrofit (maturion-isms#1564) |
