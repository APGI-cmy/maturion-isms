# Governance Change Log

## Status
Canonical Governance Record  
Version: Continuous  
Authority: Governance Administrator  
Required By: GOVERNANCE_RIPPLE_MODEL.md

---

## Purpose

This change log provides a complete, auditable record of all governance changes, supporting the **Governance Ripple Model** by tracking evolution across time.

Every governance change must be recorded here with:
- Change version/identifier
- Change date
- Change type (clarification, enhancement, breaking, emergency)
- Change description
- Affected artifacts
- Migration guidance (if breaking)
- Approval authority
- Effective date

---

## Change Log Format

Each entry follows this structure:

```markdown
### [VERSION/ID] - YYYY-MM-DD - [CHANGE_TYPE]

**Changed By**: [Authority]
**Approved By**: [Approver] (if required)
**Effective Date**: YYYY-MM-DD

**Summary**: [Brief description]

**Affected Artifacts**:
- path/to/file1.md
- path/to/file2.md

**Migration Required**: [YES/NO]
**Migration Guidance**: [Details if YES]

**Rationale**: [Why this change]

**Impact**: [Who/what is affected]

**References**: [Links to proposals, issues, PRs]
```

---

## Change Types

- **CLARIFICATION**: Documentation improvement, no functional change
- **NON_BREAKING_ENHANCEMENT**: Additive change, backward compatible
- **BREAKING_CHANGE**: Incompatible change, requires migration
- **EMERGENCY_FIX**: Critical fix, fast-tracked

---

## Change History

### [AAWP-V0.3.0-2026-03-01] - 2026-03-01 - NON_BREAKING_ENHANCEMENT

**Changed By**: governance-liaison-isms-agent (CL-0-D2 follow-up — canonicalise AAWP v0.3.0)
**Approved By**: CS2 (Johan Ras) — Wave 9 sign-off; GOV-006 resolved; maturion-foreman-governance#1251
**Effective Date**: 2026-03-01
**Layer-Down Status**: NOT_REQUIRED — governance planning artefact; no layer-down ripple needed

**Summary**: Updated `AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` (AAWP) from v0.2.0 to v0.3.0.
Records formal CS2 Wave 9 sign-off and adds a direct reference and cross-link to the AIMC +
LKIAC Combined Execution Plan (`governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`
v1.1.0). Explains the Combined Plan's precedence over the AAWP's standalone execution sequence
for all CL-* waves. Resolves governance gap GOV-006.

**Changes Made**:
1. **(UPDATED)** `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` v0.2.0 → v0.3.0:
   - Version bumped to 0.3.0; Effective Date updated to 2026-03-01
   - Status changed to `ACTIVE — Wave 9 CS2 sign-off recorded; Combined Execution Plan is authoritative`
   - Combined Execution Plan Reference block added to frontmatter (v0.3.0 addition)
   - v0.3.0 amendment paragraph added to §1 explaining Combined Plan precedence and GOV-006 resolution
   - Combined Execution Plan reference table added to §9 References
   - Wave 9 CS2 sign-off acceptance criterion marked `[x]` in §10
   - `governance-liaison-isms-agent` assigned as owner in footer
   - Footer updated with v0.3.0 amendment trail and authorised Next Action

**Affected Artifacts**:
- `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` (v0.2.0 → v0.3.0)

**Migration Required**: NO
**Migration Guidance**: N/A

**Rationale**: Satisfies governance gap GOV-006. Required entry gate for all subsequent CL-*
waves in the AIMC + LKIAC Combined Execution Plan. The canonical home of AAWP is maturion-isms;
this entry applies the same amendments merged in maturion-foreman-governance (PR #1251) to ensure
both repositories carry identical v0.3.0 content.

**Impact**: Wave 9 execution now authorised. All builders and governance agents must reference
the Combined Execution Plan for execution sequencing while treating the AAWP as authoritative
for wave scope definitions and agent assignments.

**References**:
- Governance copy: https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md
- Original PR: https://github.com/APGI-cmy/maturion-foreman-governance/pull/1251
- Combined Execution Plan: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.1.0

---

## Instructions for Future Changes

When adding a new governance change:

1. **Create entry above this section** (newest first, reverse chronological order)
2. **Use the format shown above** for consistency
3. **Assign a unique version/identifier** (e.g., V1.1-FEATURE-NAME or YYYYMMDD-CHANGE-ID)
4. **Record all affected artifacts** with paths
5. **Specify migration requirements** if breaking
6. **Include approval authority** per GOVERNANCE_RIPPLE_MODEL.md
7. **Reference source evidence** (proposals, issues, PRs)
8. **Update immediately** when change is merged (not before)

---

## Archive Policy

Changes older than 2 years may be moved to:
`governance/archive/CHANGELOG_YYYY.md`

Current year + previous year must remain in this file for easy reference.

---

**End of Governance Change Log**

---

**Document Metadata**:
- Log ID: GOVERNANCE_CHANGELOG
- Authority: Canonical Governance Record
- Maintained By: Governance Administrator (governance-liaison-isms-agent)
- Required By: GOVERNANCE_RIPPLE_MODEL.md
- Format: Reverse chronological (newest first)
