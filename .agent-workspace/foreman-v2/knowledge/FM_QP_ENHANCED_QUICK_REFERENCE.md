# FM Enhanced Quality Protocol — Quick Reference (Tier 2 Stub)

**Agent**: foreman-v2  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-03-02  
**Tier**: 2 (Operational Knowledge)  
**Canonical Authority (Tier 3)**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Purpose

This file is the **Tier 2 induction stub** for the FM Enhanced Quality Protocol. It provides a quick-reference summary of the two mandatory Quality Professor enhancements. For the full protocol, always refer to the Tier-3 canonical authority above.

---

## QP Enhancement 1: Builder Referral Protocol

When Quality Professor verdict is **FAIL**, FM MUST:

1. **Create** a Builder Referral Artifact at `.agent-admin/quality-professor/builder-referral-<YYYYMMDD>-<builder-id>-<issue-ref>.md`
2. **Update** the Referral Index at `.agent-admin/quality-professor/REFERRAL_INDEX.md`
3. **Notify** the builder with the referral path, failure conditions, and re-submission instructions
4. **Block** the merge gate until the builder re-submission achieves a QP PASS

### Failure Condition Codes

| Code | Condition |
|------|-----------|
| QP-FAIL-001 | QA not 100% GREEN |
| QP-FAIL-002 | Test debt detected |
| QP-FAIL-003 | Evidence artifacts missing |
| QP-FAIL-004 | Architecture alignment gap |
| QP-FAIL-005 | Scope violation |
| QP-FAIL-006 | Zero-tolerance finding not resolved |
| QP-FAIL-007 | Progress tracker not updated (see Enhancement 2) |

---

## QP Enhancement 2: Progress Tracker Enforcement

When reviewing a build, FM MUST check the progress tracker **before** accepting the submission if:
- The build corresponds to an open GitHub issue, AND
- An implementation plan or progress tracker exists for that issue, AND
- The issue is part of a multi-wave or multi-phase execution

If the tracker is out of sync → issue **QP-FAIL-007** and create a Builder Referral Artifact.

---

## Re-submission Protocol

1. Builder addresses all remediation items
2. Builder runs QA to 100% GREEN
3. Builder updates progress tracker (if applicable)
4. FM re-invokes Quality Professor (Mode 3)
5. FM closes referral artifact and updates REFERRAL_INDEX.md on PASS

Repeat referrals use suffixes: `-r2`, `-r3`, etc.

---

## Key Paths

| Artifact | Path |
|----------|------|
| Builder Referral | `.agent-admin/quality-professor/builder-referral-<YYYYMMDD>-<builder-id>-<issue-ref>.md` |
| Referral Index | `.agent-admin/quality-professor/REFERRAL_INDEX.md` |
| QP Verdict Report | `.agent-admin/quality-professor/qp-verdict-<TIMESTAMP>.md` |

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-03-02 | Copilot (foreman-v2 agent, session-036) | Initial creation — Tier 2 induction stub for FM Enhanced Quality Protocol (Builder Referral + Progress Tracker Enforcement) |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0  
**Full SOP**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`
