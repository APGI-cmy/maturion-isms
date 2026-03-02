# FM Enhanced Quality Protocol — Quick Reference

**Agent**: foreman-v2  
**Tier**: 2 (Operational Knowledge — Quick Reference Stub)  
**Tier-3 Canonical Authority**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0  
**Version**: 1.0.0  
**Effective Date**: 2026-03-02  
**Layer-Down Status**: PUBLIC_API

---

## Purpose

This file is the **Tier 2 induction stub** for the FM Enhanced Quality Protocol SOP. Load this file at induction to understand the mandatory enhancements to Quality Professor mode. For full procedural detail, refer to the Tier-3 canonical authority above.

---

## Two Mandatory QP Enhancements

### 1. Builder Referral Protocol

On every QP **FAIL**, FM MUST:

1. Create a Builder Referral Artifact at:  
   `.agent-admin/quality-professor/builder-referral-<YYYYMMDD>-<builder-agent-id>-<issue-ref>.md`
2. Record all failure conditions (see QP-FAIL codes below)
3. Update `REFERRAL_INDEX.md` (status: OPEN)
4. Notify the builder with the referral path and remediation requirements
5. Block merge gate until re-submission passes QP

On QP **PASS** (re-submission), FM MUST:

1. Close the referral artifact (fill closure date + QP PASS report reference)
2. Update `REFERRAL_INDEX.md` (status: CLOSED)
3. Release merge gate

### 2. Progress Tracker Enforcement

On every QP session, FM MUST:

1. Check whether the issue has an associated progress tracker
2. If YES: verify the tracker reflects the delivered build  
   → If out of sync → add QP-FAIL-007, refer builder, instruct tracker update before re-submission
3. If NO tracker exists: note "N/A — no tracker" in QP report and continue

---

## QP Failure Condition Codes

| Code | Condition |
|------|-----------|
| QP-FAIL-001 | QA not 100% GREEN (tests failing or skipped) |
| QP-FAIL-002 | Test debt detected (`.skip()`, `.todo()`, stubs) |
| QP-FAIL-003 | Evidence artifacts missing or incomplete |
| QP-FAIL-004 | Architecture alignment gap |
| QP-FAIL-005 | Scope violation |
| QP-FAIL-006 | Zero-tolerance finding not resolved |
| QP-FAIL-007 | Progress tracker not updated to reflect delivery |

---

## Evidence Required Per QP Session

**FAIL session**:
- `qp-verdict-<TIMESTAMP>.md`
- `builder-referral-<YYYYMMDD>-<builder>-<issue>.md`
- Updated `REFERRAL_INDEX.md` entry (OPEN)

**PASS session** (re-submission):
- `qp-verdict-<TIMESTAMP>.md`
- Closed referral artifact (closure date + QP report reference)
- Updated `REFERRAL_INDEX.md` entry (CLOSED)

---

## Referral Artifact Path Convention

```
.agent-admin/quality-professor/builder-referral-<YYYYMMDD>-<builder-agent-id>-<issue-ref>.md
```

---

**Full SOP**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`  
**Authority**: CS2 (Johan Ras) | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
