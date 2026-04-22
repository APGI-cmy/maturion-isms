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
| QP-FAIL-008 | Future-dated factual claim in governance evidence artifact (A-040 / Rule T-001) |
| QP-FAIL-009 | Evidence-type mismatch — deployment/CDV item marked COMPLETE with insufficient evidence fidelity (A-041 / Rule E-002) |

---

## Enhancement 3 — Temporal and Evidence-Type Audit at QP (A-040 / A-041)

**Trigger**: Any builder delivering governance evidence artifacts (CDV validation, deployment
checklists, staging validation, operational-validation reports).

**FM MUST** (per FAIL-ONLY-ONCE A-040 and A-041; canon: `TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md`):

1. **Temporal check (A-040)**: Scan all completion/validation statements and their timestamps.
   Verify NO timestamp is later than today's date. If found → QP-FAIL-008. Issue builder referral
   requiring: correct to forward-looking language; mark item PENDING; do not mark COMPLETE.

2. **Evidence-type labeling check (A-041 — Rule E-001)**: Confirm every deployment/CDV/operational
   item has an explicit `evidence_type:` label (STATIC_CODE / CI_TEST / CONFIG / LIVE_RUNTIME /
   LIVE_E2E). If any label is missing → QP-FAIL-009 partial (labeling). Issue builder referral.

3. **Evidence-type sufficiency check (A-041 — Rule E-002)**: For every item labeled or classified
   as LIVE_RUNTIME or LIVE_E2E: confirm the cited evidence is of equal or higher fidelity. A
   merged-PR reference or code presence alone is NOT sufficient. If found → QP-FAIL-009. Issue
   builder referral requiring: demote item to PENDING until live evidence exists.

**Evidence-type quick reference** (see wave-reconciliation-checklist.md Section E for full table):

| Item language | Required type |
|--------------|---------------|
| "deployed to staging/prod" | LIVE_RUNTIME |
| "CDV scenario executed" | LIVE_E2E |
| "service is live" | LIVE_RUNTIME |
| "end-to-end flow validated" | LIVE_E2E |
| "tests pass (CI)" | CI_TEST |
| "code merged / PR merged" | STATIC_CODE |

**N/A case**: If the builder delivered no governance evidence artifacts → note "N/A — no evidence
artifacts" in QP report and continue.

---

## Enhancement 2 — Progress Tracker Enforcement

**Trigger**: Build delivered that corresponds to an existing implementation plan or progress tracker.

**FM MUST**:
1. Identify if the issue has an associated progress tracker or implementation plan
2. Verify the tracker reflects the delivered build before accepting submission
3. If tracker is out of sync → add QP-FAIL-007 to failure conditions, issue builder referral

**N/A case**: If no tracker exists for the issue → note "N/A — no tracker" in QP report and continue.

---

## Required Infrastructure

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
| 1.1.0 | 2026-04-22 | QP-FAIL-008 (future-dated claim / A-040 / T-001) and QP-FAIL-009 (evidence-type mismatch / A-041 / E-002) added; Enhancement 3 (Temporal and Evidence-Type Audit at QP) added; canon: TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md; governance hardening maturion-isms#1445. |
| 1.0.0 | 2026-03-02 | Initial creation — Layer-Down propagation of `FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0 (canonical commit 7792913259b0); Builder Referral Protocol (QP-FAIL-001–007) and Progress Tracker Enforcement Tier 2 stub |

---

*Layer-Down by governance-liaison-isms-agent | Session 036 | 2026-03-02*  
*Per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md — canonical commit 7792913259b0*
