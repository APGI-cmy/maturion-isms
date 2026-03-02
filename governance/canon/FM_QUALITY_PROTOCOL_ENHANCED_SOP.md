# FM ENHANCED QUALITY PROTOCOL — BUILDER REFERRAL AND PROGRESS TRACKER ENFORCEMENT SOP

## Status
**Type**: Tier-3 Governance SOP (Operational Protocol)
**Authority**: Governance Administrator — authorized by CS2 governance issue
**Version**: 1.0.0
**Effective Date**: 2026-03-02
**Last Updated**: 2026-03-02
**Owner**: Maturion Engineering Leadership (Johan Ras)
**Layer-Down Status**: PUBLIC_API
**Applies To**: All Foreman (FM) Agents, All Builder Submissions, All Repositories with Implementation Plans or Progress Trackers
**Issue Authority**: [Governance] Upgrade foreman quality protocol: builder referral & progress tracker enforcement

---

## 1. Purpose

This SOP defines **two mandatory enhancements** to the Foreman Quality Protocol (QP):

1. **Builder Referral Protocol** — When a Quality Professor verdict is FAIL, FM MUST formally reject the deliverable, record the rejection, and refer the job back to the responsible builder agent with explicit remediation requirements. The referral is tracked to closure.

2. **Progress Tracker Enforcement** — When a build is delivered that corresponds to an existing implementation plan or progress tracker, FM MUST verify that the tracker reflects the delivered work before accepting the submission or releasing the merge gate.

These enhancements close two gaps in the existing Quality Professor mode:
- Rejections were issued verbally (in script output) but not formally recorded as trackable governance artifacts
- Progress trackers were not consistently checked against delivered builds during quality review

**Core Principle**: A Quality Professor FAIL is not informational — it is a formal governance event that produces a traceable artifact and an explicit builder referral.

---

## 2. Constitutional Authority

This SOP derives authority from and implements:

- **governance/canon/LIVING_AGENT_SYSTEM.md v1.1.0** — Supreme governance authority
- **governance/quality/agent-integrity/foreman-v2.agent.md v2.3.0** — Quality Professor mode (Mode 3), Section 1.7
- **governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — FM supervision authority over builders
- **governance/canon/MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md** — Progress recording canon
- **governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md** — Evidence artifact requirements
- **governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md** — Referral pattern reference (IAA REJECTION-PACKAGE model)
- **BUILD_PHILOSOPHY.md** — One-Time Build Law, Zero Test Debt, QA-as-Proof

---

## 3. Builder Referral Protocol

### 3.1 Referral Conditions

FM MUST issue a formal Builder Referral when **any** of the following Quality Professor failure conditions are met:

| Condition | Code | Example |
|-----------|------|---------|
| QA is not 100% GREEN | QP-FAIL-001 | One or more tests failing or skipped |
| Test debt detected | QP-FAIL-002 | `.skip()`, `.todo()`, stub implementations present |
| Evidence artifacts missing | QP-FAIL-003 | Prehandover proof absent or incomplete |
| Architecture alignment gap | QP-FAIL-004 | No architecture document; implementation deviates from spec |
| Scope violation | QP-FAIL-005 | Builder delivered beyond or outside approved scope |
| Zero-tolerance finding not resolved | QP-FAIL-006 | Lint/type/build error present; security finding unaddressed |
| Progress tracker not updated | QP-FAIL-007 | See Section 4 — tracker out of sync with delivery |

If multiple conditions are triggered, all MUST be listed in the referral artifact.

### 3.2 Formal Rejection Record

On FAIL, FM MUST create a **Builder Referral Artifact** at the following path:

```
.agent-admin/quality-professor/builder-referral-<YYYYMMDD>-<builder-agent-id>-<issue-ref>.md
```

**Builder Referral Artifact Template**:

```markdown
# Builder Referral — <YYYYMMDD> — <builder-agent-id> — <issue-ref>

**Status**: OPEN
**Date**: YYYY-MM-DD
**Foreman**: foreman-v2 (Quality Professor Mode)
**Builder**: <builder-agent-id>
**Issue**: <issue-ref>
**QP Report**: .agent-admin/quality-professor/qp-verdict-<TIMESTAMP>.md

---

## Rejection Summary

Quality Professor verdict: **FAIL**

The build submitted for <issue-ref> does NOT meet the acceptance criteria.
Merge gate is BLOCKED. Builder is referred back for remediation.

## Failure Conditions

| Code | Condition | Detail |
|------|-----------|--------|
| <QP-FAIL-XXX> | <condition> | <specific finding> |

## Remediation Requirements

Builder MUST address ALL items below before re-submission:

- [ ] <Specific remediation item 1>
- [ ] <Specific remediation item 2>

## Re-submission Protocol

1. Address every item in Remediation Requirements
2. Run QA to GREEN and confirm 100% pass rate
3. Update progress tracker (if applicable — see Section 4 of FM_QUALITY_PROTOCOL_ENHANCED_SOP.md)
4. Notify FM of re-submission
5. FM will re-invoke Quality Professor (Mode 3) on re-submission

## Referral Closure

This artifact is closed when:
- All remediation items are resolved
- Quality Professor issues a PASS verdict on re-submission
- FM records closure date and QP PASS report reference below

**Closure Date**: [OPEN]
**Closing QP Report**: [OPEN]
```

### 3.3 Builder Notification

FM MUST explicitly notify the builder agent of the referral. The notification MUST include:
- Path to the Builder Referral Artifact
- Summary of failure conditions
- Explicit re-submission instructions

FM does NOT implement any fixes — the builder is solely responsible for remediation.

### 3.4 Referral Tracking

FM MUST maintain an index of open Builder Referrals:

```
.agent-admin/quality-professor/REFERRAL_INDEX.md
```

**Referral Index Format**:

```markdown
# Builder Referral Index

| Date | Issue | Builder | Referral Artifact | Status | Closure Date |
|------|-------|---------|-------------------|--------|--------------|
| YYYY-MM-DD | <issue-ref> | <builder-id> | .agent-admin/quality-professor/builder-referral-*.md | OPEN / CLOSED | - |
```

FM MUST update the index whenever:
- A new referral is opened
- A referral is closed (builder re-submission passes QP)

### 3.5 Re-submission Protocol

On builder re-submission:

1. FM receives builder re-submission notification
2. FM re-activates Quality Professor mode (Mode 3 per foreman-v2.agent.md Section 1.7)
3. All original failure conditions MUST be re-evaluated
4. If **PASS**: FM closes the Builder Referral Artifact (records closure date + QP report path), updates REFERRAL_INDEX.md status to CLOSED, and proceeds to merge gate release
5. If **FAIL again**: FM creates a NEW Builder Referral Artifact with an explicit re-submission suffix (`-r2`, `-r3`, etc.) appended to the filename — e.g., `builder-referral-<YYYYMMDD>-<builder-agent-id>-<issue-ref>-r2.md` for the second referral. FM updates REFERRAL_INDEX.md and re-notifies builder. FM MUST NOT accept partial remediation.

**Partial Remediation**: If builder has addressed only some failure conditions, the re-submission is still FAIL. FM issues a new referral with remaining items. This is not a new job — it is a continuation of the same referral.

---

## 4. Progress Tracker Enforcement

### 4.1 When a Progress Tracker Is Required

A **Progress Tracker check is MANDATORY** when ALL of the following are true:

1. The build corresponds to an open GitHub issue
2. The issue has an associated implementation plan or progress tracker artifact (e.g., `WAVE_IMPLEMENTATION_PROGRESS.md`, `BUILD_PROGRESS_TRACKER_TEMPLATE.md`-derived file, or any document explicitly linked in the issue as the progress tracker)
3. The issue is part of a multi-wave or multi-phase execution

If no progress tracker exists for the issue, this section is N/A and SHOULD be noted in the QP report.

### 4.2 Tracker Update Requirements

When a progress tracker exists, FM MUST verify the following before accepting a build:

| Requirement | Evidence |
|-------------|----------|
| Tracker reflects current wave/phase state | Last wave entry in tracker matches the delivered wave |
| Delivered artifacts are listed in tracker | Architecture doc, QA suite, build output paths explicitly listed |
| No uncertified waves marked complete | Each completed wave shows FM wave closure certification per MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md |
| Tracker version/last-updated reflects this delivery | Timestamp in tracker matches or post-dates the PR |

### 4.3 Enforcement Gate

**If the progress tracker is NOT updated before submission**:

1. FM records `QP-FAIL-007` (Progress Tracker Not Updated) in the Quality Professor verdict
2. FM creates a Builder Referral Artifact (Section 3.2) citing `QP-FAIL-007`
3. FM instructs builder to update the tracker before re-submission
4. FM does NOT release the merge gate until tracker is current

**Tracker Update is NOT Optional**: A build that is otherwise 100% GREEN MUST still be blocked if the progress tracker is out of sync with the delivered work. Evidence-first operations require the tracker to be accurate before merge.

---

## 5. Foreman Responsibilities Summary

| Phase | FM Action | Priority |
|-------|-----------|----------|
| QP FAIL detected | Create Builder Referral Artifact immediately | FM_H |
| QP FAIL detected | Update REFERRAL_INDEX.md | FM_H |
| QP FAIL detected | Notify builder with referral details | FM_H |
| Progress tracker missing update | Issue QP-FAIL-007, create referral | FM_H |
| Builder re-submission received | Re-invoke Quality Professor (Mode 3) | FM_H |
| QP PASS on re-submission | Close referral artifact, update index | FM_H |
| Each QP session | Note N/A in QP report if no tracker exists | FM_M |

---

## 6. Evidence Requirements

Every Quality Professor session that results in a FAIL MUST produce:
1. `qp-verdict-<TIMESTAMP>.md` — the Quality Professor verdict report
2. `builder-referral-<YYYYMMDD>-<builder-id>-<issue-ref>.md` — the Builder Referral Artifact
3. Updated `REFERRAL_INDEX.md` entry

Every Quality Professor session that results in a PASS MUST produce:
1. `qp-verdict-<TIMESTAMP>.md` — the Quality Professor verdict report (PASS)
2. Closed referral artifact (if this was a re-submission) — closure date and QP report reference filled in
3. Updated `REFERRAL_INDEX.md` entry (if closing a referral)

---

## 7. Relationship to Existing Quality Professor Mode

This SOP **supplements** the Quality Professor mode defined in `governance/quality/agent-integrity/foreman-v2.agent.md` Section 1.7. It does NOT modify the agent contract.

The existing Quality Professor script already:
- Issues remediation orders to builder on FAIL
- Generates Quality Professor Evidence Report
- Blocks merge gate on FAIL

This SOP adds:
- Formal, trackable Builder Referral Artifacts (recorded to disk, indexed)
- REFERRAL_INDEX.md for open-referral visibility
- Progress Tracker check as a mandatory QP gate item (QP-FAIL-007)
- Formal closure protocol when builder re-submission passes

**Agent Contract Immutability**: This SOP is designed to be implemented by foreman agents without requiring any modification to the foreman-v2 agent contract. Foreman agents MUST load `FM_QP_ENHANCED_QUICK_REFERENCE.md` as Tier 2 knowledge at induction (see `.agent-workspace/foreman-v2/knowledge/FM_QP_ENHANCED_QUICK_REFERENCE.md`). This SOP is the Tier-3 canonical authority referenced by that Tier-2 stub.

---

## 8. Layer-Down Propagation

This SOP is `layer_down_status: PUBLIC_API`. Consumer repositories with foreman agents MUST:

1. Ensure foreman agents load `FM_QP_ENHANCED_QUICK_REFERENCE.md` as Tier 2 knowledge during induction, with this SOP serving as the Tier-3 canonical authority
2. Amend local QA checklists to include the Builder Referral and Tracker Enforcement requirements
3. Verify that `.agent-admin/quality-professor/` directory exists or is created at first QP FAIL
4. Reference this SOP in any local QP SOP or quality protocol documentation

**Layer-Down Scope**: All repositories where a foreman-v2 agent (or equivalent) operates and where Quality Professor mode is invoked.

---

## Appendix A: Quick Reference — Builder Referral Flow

```
Quality Professor Mode Activated
    ↓
Evaluate all quality criteria
    ↓
[PASS?] ──YES──→ Record qp-verdict (PASS) → Release merge gate
    ↓NO
Record qp-verdict (FAIL) with all failure conditions
    ↓
Create builder-referral-<date>-<builder>-<issue>.md
    ↓
Update REFERRAL_INDEX.md (status: OPEN)
    ↓
Notify builder — include referral path + remediation requirements
    ↓
[Wait for builder re-submission]
    ↓
Re-invoke Quality Professor (Mode 3)
    ↓
[PASS?] ──YES──→ Close referral artifact → Update index (CLOSED) → Release merge gate
    ↓NO
Create NEW builder-referral artifact (increment) → Update index → Re-notify builder
```

---

## Appendix B: Quick Reference — Progress Tracker Enforcement Flow

```
Quality Professor Mode Activated
    ↓
Does issue have associated progress tracker?
    ↓NO──→ Note "N/A — no tracker" in QP report, continue normal QP evaluation
    ↓YES
Is tracker updated to reflect delivered build?
    ↓YES──→ Continue normal QP evaluation
    ↓NO
Add QP-FAIL-007 to failure conditions
Create builder-referral citing QP-FAIL-007
Instruct builder to update tracker before re-submission
Block merge gate
```

---

**Authority**: governance/canon/LIVING_AGENT_SYSTEM.md v1.1.0 | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md | MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md
**Governance Issue**: [Governance] Upgrade foreman quality protocol: builder referral & progress tracker enforcement
