# IAA Trigger Table

**Agent**: independent-assurance-agent
**Version**: 2.5.0
**Status**: ACTIVE
**Last Updated**: 2026-04-26
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This table defines when IAA activates and when it is exempt for a given PR.
IAA uses this table in Phase 2 Step 2.3 for PR category classification.

**AMBIGUITY RULE**: If classification is unclear, IAA IS required (FAIL-ONLY-ONCE A-003).
Default: MANDATORY INVOCATION when in doubt.

---

## Trigger Table

| PR Category | IAA Required? | Trigger Condition | Notes |
|-------------|---------------|------------------|-------|
| AGENT_CONTRACT | YES — MANDATORY | Any `.github/agents/*.md` file created or modified; any `governance/agents/` or `governance/contracts/` file created or modified; any `*-agent-contract.md` file | All agent classes. No exceptions. FAIL-ONLY-ONCE A-002. This includes Foreman, Builder, Overseer, Specialist, and Assurance (IAA self-review → escalate to CS2). |
| CANON_GOVERNANCE | YES — MANDATORY | Any `governance/canon/` file created or modified; any `governance/CANON_INVENTORY.json` update; any file matching `*ARCHITECTURE*.md` or `*STRATEGY*.md` in governance | Includes CANON_INVENTORY.json updates. Version bump must be present. |
| CI_WORKFLOW | YES — MANDATORY | Any `.github/workflows/` file created or modified | Includes merge gate workflow, ripple sync workflow, and all governance automation workflows. |
| AAWP_MAT | YES — MANDATORY | PR labelled `aawp-deliverable` or `mat-deliverable`; files match AAWP/MAT path patterns (`modules/mat/`, `packages/ai-centre/`, AAWP architecture files) | Evidence bundle completeness required. |
| AGENT_INTEGRITY | YES — MANDATORY | Any `governance/quality/agent-integrity/` file created or modified | CS2-only update authority. Any non-CS2 modification → auto-REJECTION-PACKAGE. |
| KNOWLEDGE_GOVERNANCE | YES — MANDATORY | Any `.agent-workspace/*/knowledge/` file created or modified; any Tier 2 knowledge index, overlay, trigger table, checklist, or FAIL-ONLY-ONCE registry updated | Covers all IAA and agent Tier 2 knowledge patches. Evidence bundle + PREHANDOVER ceremony required (FAIL-ONLY-ONCE A-015). |
| LIAISON_ADMIN | YES — MANDATORY | Any `.agent-workspace/governance-liaison-isms-agent/` file created or modified; governance ripple sync artifacts; `governance/sync_state.json` updates; `governance/consumers/` registry files; liaison session memory or knowledge files | Governance liaison agent workspace updates. Covers ripple processing artifacts, consumer registry, and sync state files. KNOWLEDGE_GOVERNANCE overlay applies. |
| MIXED | YES — MANDATORY | PR contains both triggering and non-triggering artifacts | Ambiguity rule applies. Any triggering artifact activates IAA for the whole PR. |
| PRE_BUILD_STAGE_MODEL | YES — MANDATORY | Any PR modifying pre-build stage governance artifacts: `governance/canon/PRE_BUILD_STAGE_MODEL*.md`, `modules/*/module.manifest.json`, `modules/*/BUILD_PROGRESS_TRACKER.md`, `modules/*/00-app-description/`, `modules/*/01-frs/`, or any file that defines or advances a module's pre-build lifecycle stage | Pre-build stage gate enforcement for all 12 canonical stages: (1) App Description, (2) UX Workflow & Wiring Spec, (3) FRS, (4) TRS, (5) Architecture, (6) QA-to-Red, (7) PBFAG, (8) Implementation Plan, (9) Builder Checklist, (10) IAA Pre-Brief, (11) Builder Appointment, (12) Build. PRE_BUILD_GATES overlay applies (OVL-PBG-001 through OVL-PBG-017). Supporting controls: §7.1 Change-Propagation Audit, §7.2 Runtime/Deployment Contract, §7.3 Golden Path Verification Pack, §7.4 Deployment Execution Contract. IAA must produce stage-readiness view at Pre-Brief and verify stage completion at handover. |
| MANDATORY_CROSS_APP_COMPONENTS | YES — MANDATORY | Any PR modifying cross-app component governance: `governance/canon/MANDATORY_CROSS_APP_COMPONENTS*.md`, any file in `packages/` that is referenced as a mandatory cross-app component, or any module file that claims compliance with or exemption from mandatory cross-app component requirements | Cross-app component compliance gate. IAA must verify the component governance claim against the canonical MANDATORY_CROSS_APP_COMPONENTS specification. |
| GOVERNANCE_AUDIT | EXEMPT — unless mixed | Read-only retrospective audit artifacts: session memory files (`.agent-workspace/*/memory/session-*.md`), parking station log entries, PREHANDOVER proof files (`.agent-workspace/*/memory/PREHANDOVER-*.md`), IAA token files (`.agent-admin/assurance/iaa-token-*.md`), PREHANDOVER addendum files | Pure retrospective record-keeping. These artifacts document past events and do NOT modify governance operational state. AMBIGUITY RULE applies — if the PR contains any non-retrospective artifact, the entire PR is classified as MIXED (IAA mandatory). The EXEMPT status of these artifacts applies only when they appear in isolation. IAA token files are themselves the outcome of IAA review — IAA cannot self-review its own output. |
| EXEMPT | NO — if unambiguously non-triggering | Pure doc-only changes outside governance/canon; parking station updates (labelled `parking-station`); session memory files only; README changes with no agent/governance/CI content; admin/housekeeping (labelled `admin` or `housekeeping`) | Must be unambiguously non-triggering. If any doubt → apply AMBIGUITY RULE. |
| AMBIGUOUS | YES — MANDATORY | Classification unclear; mixed signals; trigger table file is missing | FAIL-ONLY-ONCE A-003: ambiguity resolves to mandatory invocation. |

---

## Class-Based Exemption Prohibition

No agent class is exempt from the AGENT_CONTRACT trigger. Specifically:
- **Foreman class**: NOT exempt. Double-layer QA is constitutional. Authority: maturion-isms#523, #528, #531.
- **Builder class**: NOT exempt.
- **Overseer class**: NOT exempt (CodexAdvisor, maturion-agent).
- **Specialist class**: NOT exempt.
- **Assurance class (IAA itself)**: IAA cannot self-review. If IAA contract changes → escalate to CS2.

Any agent claiming class exemption → REJECTION-PACKAGE citing FAIL-ONLY-ONCE A-002.

---

## Classification Decision Flow

```
1. Does PR contain any .github/agents/ or governance/agents/ changes?
   → YES: Category = AGENT_CONTRACT. IAA = MANDATORY.

2. Does PR contain any governance/canon/ or CANON_INVENTORY.json changes?
   → YES: Category = CANON_GOVERNANCE. IAA = MANDATORY.

3. Does PR contain any .github/workflows/ changes?
   → YES: Category = CI_WORKFLOW. IAA = MANDATORY.

4. Does PR contain AAWP/MAT deliverable artifacts?
   → YES: Category = AAWP_MAT. IAA = MANDATORY.

5. Does PR contain governance/quality/agent-integrity/ changes?
   → YES: Category = AGENT_INTEGRITY. IAA = MANDATORY.

6. Does PR contain any .agent-workspace/*/knowledge/ file changes?
   → YES: Category = KNOWLEDGE_GOVERNANCE. IAA = MANDATORY.

7. Does PR modify governance liaison artifacts (.agent-workspace/governance-liaison-isms-agent/, governance/sync_state.json, governance/consumers/)?
   → YES: Category = LIAISON_ADMIN. IAA = MANDATORY.

8. Does PR modify pre-build stage governance artifacts (PRE_BUILD_STAGE_MODEL, module.manifest.json, BUILD_PROGRESS_TRACKER.md, module lifecycle stages for any of the 12 canonical stages)?
   → YES: Category = PRE_BUILD_STAGE_MODEL. PRE_BUILD_GATES overlay (OVL-PBG-001–OVL-PBG-017) applies. Stage-readiness view required at Pre-Brief. IAA = MANDATORY.

9. Does PR modify cross-app component governance (MANDATORY_CROSS_APP_COMPONENTS, packages/ mandatory components, cross-app compliance claims)?
   → YES: Category = MANDATORY_CROSS_APP_COMPONENTS. IAA = MANDATORY.

10. Does PR contain ONLY retrospective audit artifacts (session memory files, PREHANDOVER proofs, IAA token files, parking station log entries, PREHANDOVER addendum files)?
    → YES AND no triggering artifacts: Category = GOVERNANCE_AUDIT. IAA = EXEMPT.
    → UNCERTAIN or mixed with triggering artifacts: Apply AMBIGUITY RULE → Category = MIXED. IAA = MANDATORY.

11. Is the PR clearly and unambiguously doc-only, parking-station, or admin?
   → YES: Category = EXEMPT. IAA = NOT REQUIRED.
   → UNCERTAIN: Apply AMBIGUITY RULE → Category = AMBIGUOUS. IAA = MANDATORY.
```

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial STUB (placeholder from canon) |
| 2.0.0 | 2026-02-28 | Fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md; AGENT_INTEGRITY category added; classification decision flow added; STUB status removed |
| 2.1.0 | 2026-03-02 | KNOWLEDGE_GOVERNANCE trigger category added; classification decision flow updated with step 6 for knowledge governance path (maturion-isms#IAA-TIER2) |
| 2.2.0 | 2026-04-06 | PRE_BUILD_STAGE_MODEL and MANDATORY_CROSS_APP_COMPONENTS trigger categories added; classification decision flow updated with steps 7–8; PRE_BUILD_GATES overlay cross-reference added (wave: pre-mmm-build-readiness) |
| 2.3.0 | 2026-04-07 | PRE_BUILD_STAGE_MODEL trigger row updated — all 12 stages named explicitly, OVL-PBG reference range updated to OVL-PBG-001 through OVL-PBG-016, supporting controls referenced, stage-readiness view requirement added; step 7 classification flow updated; wave: iaa-12stage-upgrade (issue #1258) |
| 2.4.0 | 2026-04-07 | LIAISON_ADMIN and GOVERNANCE_AUDIT trigger categories added; classification decision flow updated with steps 7–8 (LIAISON_ADMIN) and 10 (GOVERNANCE_AUDIT EXEMPT — positioned after all triggering steps per BLOCKER-003); PRE_BUILD_STAGE_MODEL renumbered to step 8, MANDATORY_CROSS_APP_COMPONENTS to step 9, EXEMPT/AMBIGUOUS to step 11; wave: ps-f-iaa-trigger-table-new-categories (issue #1270) |
| 2.5.0 | 2026-04-26 | PRE_BUILD_STAGE_MODEL trigger row updated — OVL-PBG reference range updated to OVL-PBG-001 through OVL-PBG-017; §7.4 Deployment Execution Contract added to supporting controls list; step 8 classification flow updated to reflect OVL-PBG-017; wave: mmm-deploy-strategy-oversight-20260426 (issue maturion-isms#1468). |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
