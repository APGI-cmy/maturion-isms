# FM Enhanced Quality Protocol — Quick Reference

**Agent**: foreman-v2  
**Tier**: 2 (Operational Knowledge — Quick Reference Stub)  
**Version**: 1.1.0  
**Authority**: CS2 (Johan Ras)  
**Canonical SOP**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0  
**Layer-Down Source**: APGI-cmy/maturion-foreman-governance commit `7792913259b00fab77c2d1be966e923a463853db`  
**Effective Date**: 2026-03-02

---

## Purpose

This Tier 2 stub provides Foreman v2 with a concise reference to the two mandatory enhancements
defined in `FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`. Load at induction alongside `FAIL-ONLY-ONCE.md`.

**Full canonical authority**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md`

---

## Enhancement 1 — Builder Referral Protocol

**Trigger**: Any Quality Professor FAIL verdict.

**FM MUST**:
1. Record `qp-verdict: FAIL` with all failure conditions
2. Create a Builder Referral artifact: `.agent-admin/quality-professor/builder-referral-<date>-<builder>-<issue>.md`
3. Update `REFERRAL_INDEX.md` in `.agent-admin/quality-professor/`
4. Notify the responsible builder agent with referral path + remediation requirements
5. On re-submission: re-invoke QP; if PASS → close referral; if FAIL → create new referral

**Failure Codes that mandate a Referral**:

| Code | Condition |
|------|-----------|
| QP-FAIL-001 | QA not 100% GREEN |
| QP-FAIL-002 | Test debt detected (.skip/.todo/stubs) |
| QP-FAIL-003 | Evidence artifacts missing |
| QP-FAIL-004 | Architecture alignment gap |
| QP-FAIL-005 | Scope violation |
| QP-FAIL-006 | Zero-tolerance finding not resolved |
| QP-FAIL-007 | Progress tracker not updated (see Enhancement 2) |

---

## Enhancement 2 — Progress Tracker Enforcement

**Trigger**: Build delivered that corresponds to an existing implementation plan or progress tracker.

**FM MUST**:
1. Identify if the issue has an associated progress tracker or implementation plan
2. Verify the tracker reflects the delivered build before accepting submission
3. If tracker is out of sync → add QP-FAIL-007 to failure conditions, issue builder referral

**N/A case**: If no tracker exists for the issue → note "N/A — no tracker" in QP report and continue.

---

## Enhancement 3 — SCOPE_DECLARATION Title Format Check (NO-REPEAT-PREVENTABLE-001)

**Trigger**: Any QP review that includes SCOPE_DECLARATION.md.

**FM MUST**:
1. Verify SCOPE_DECLARATION.md title uses a hyphen separator (U+002D `-`), NOT an em-dash (U+2014 `—`)
2. Correct format: `# SCOPE_DECLARATION - Wave <wave-name>`
3. Incorrect format: `# SCOPE_DECLARATION — Wave <wave-name>` (em-dash causes silent 0-file parse in `validate-scope-to-diff.sh`)
4. If em-dash is present → **BLOCKING** — correct before issuing QP PASS

**Failure Code** (BLOCKING — add to QP failure conditions):

| Code | Condition |
|------|-----------|
| QP-FAIL-008 | SCOPE_DECLARATION.md title uses em-dash instead of hyphen separator |

**Authority**: NO-REPEAT-PREVENTABLE-001 — IAA finding SCOPE-FORMAT-001, session-161-ecap-001-20260408

---



Per SOP §8 (Layer-Down Propagation), this repository MUST maintain:
- `.agent-admin/quality-professor/` — directory for referral artifacts and REFERRAL_INDEX.md
- QA checklists must include Builder Referral and Tracker Enforcement requirements

---

## References

- **Full SOP**: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0
- **Authority**: `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- **Canonical Source**: APGI-cmy/maturion-foreman-governance
- **LIVING_AGENT_SYSTEM**: v6.2.0

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-02 | Initial creation — Layer-Down propagation of `FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0 (canonical commit 7792913259b0); Builder Referral Protocol (QP-FAIL-001–007) and Progress Tracker Enforcement Tier 2 stub |
| 1.1.0 | 2026-04-09 | NO-REPEAT-PREVENTABLE-001: Added Enhancement 3 — SCOPE_DECLARATION Title Format Check (QP-FAIL-008); em-dash vs hyphen blocking check per IAA finding SCOPE-FORMAT-001 session-161-ecap-001-20260408 |

---

*Layer-Down by governance-liaison-isms-agent | Session 036 | 2026-03-02*  
*Per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md — canonical commit 7792913259b0*
