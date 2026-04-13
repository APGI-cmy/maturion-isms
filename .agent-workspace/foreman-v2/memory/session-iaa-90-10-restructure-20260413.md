# Session Memory — foreman-v2-agent — IAA 90/10 Restructure

**Session ID**: session-iaa-90-10-restructure-20260413
**Date**: 2026-04-13
**Agent Version**: foreman-v2-agent v2.13.0
**Branch**: copilot/iaa-90-structure-90-10-evaluation-ratio
**Issue**: Restructure IAA contract for 90/10 evaluation-to-admin ratio

---

## Preflight Attestation

```yaml
fail_only_once_attested: true
fail_only_once_version: 4.2.0
unresolved_breaches: none
canon_inventory_check: PASS
tier2_loaded: true
prior_sessions_reviewed: [session-wave20-atomic-write-back-20260318, session-wave19-orchestration-20260317, session-wave18-postmerge-hotfix-20260315]
unresolved_items_from_prior_sessions: none
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-gov-simplification.md
```

---

## Wave Summary

**Wave**: IAA Contract Restructure — 90/10 evaluation-to-admin ratio
**Scope**: Restructure independent-assurance-agent.md contract so that 90% of IAA work is evaluation substance and 10% is admin ceremony. Move mechanical checks to CI. Restructure Tier 2 knowledge. Add agent-contract-format-gate CI workflow.

---

## Roles Invoked

```yaml
roles_invoked:
  - POLC-Orchestration
  - Quality-Professor
```

---

## Agents Delegated To

agents_delegated_to:
  - independent-assurance-agent (contract restructure v2.7.0 — 90/10 ratio, Phase 0/1/3/4 rewrite)
  - governance-liaison-isms-agent (canon updates — INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.7.0, GOVERNANCE_ARTIFACT_TAXONOMY.md)
  - qa-builder (CI workflow — agent-contract-format-gate.yml enforcement of CORE-001/003/004/005/007/008/009/012)

---

## Key Deliverables

1. **independent-assurance-agent.md v2.7.0** — 90/10 evaluation-to-admin ratio made structural
   - Phase 0: 6 steps → 3-step pre-brief
   - Phase 1: 8 verbose steps → 4 silent checks
   - Phase 3: Mechanical checks HFMC-01–06, CORE-001–019, CERT-001–004, ECAP-01–04 moved to CI
   - Phase 4: Session memory reduced 18 fields → 6 fields
   - YAML: Tier 2 split into tier_2a_evaluation (90%) and tier_2b_admin (10%)

2. **iaa-core-invariants-checklist.md v4.0.0** — retains CORE-020/021 only; others in CI reference table
3. **iaa-high-frequency-checks.md v2.0.0** — converted to CI enforcement specification
4. **session-memory-template.md v2.0.0** — 6-field template
5. **agent-contract-format-gate.yml** — CI enforcement of format checks
6. **INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.7.0** — §90/10 ratio section added
7. **GOVERNANCE_ARTIFACT_TAXONOMY.md** — standalone prebrief/token patterns FULLY DEPRECATED

---

## Required Fields

```yaml
prior_sessions_reviewed: [session-wave20-atomic-write-back-20260318, session-wave19-orchestration-20260317, session-wave18-postmerge-hotfix-20260315]
unresolved_items_from_prior_sessions: none
roles_invoked: [POLC-Orchestration, Quality-Professor]
mode_transitions: [PREFLIGHT→POLC-Orchestration, POLC-Orchestration→Phase-4-Handover]
agents_delegated_to:
  - independent-assurance-agent (contract restructure v2.7.0)
  - governance-liaison-isms-agent (canon updates)
  - qa-builder (CI workflow agent-contract-format-gate.yml)
escalations_triggered: none
separation_violations_detected: none
fail_only_once_attested: true
fail_only_once_version: 4.2.0
unresolved_breaches: none
```
