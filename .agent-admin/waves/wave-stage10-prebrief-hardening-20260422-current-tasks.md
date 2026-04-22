# Wave Task Checklist — stage10-prebrief-hardening-20260422

**Wave**: stage10-prebrief-hardening-20260422
**Foreman**: foreman-v2-agent v6.2.0
**Session**: session-167-stage10-prebrief-hardening-20260422
**IAA Pre-Brief**: .agent-admin/assurance/iaa-wave-record-stage10-prebrief-hardening-20260422.md
**Status**: IN PROGRESS
**Issue**: maturion-isms#1442 — Harden Stage 10 IAA Pre-Brief: add wave-level admin ceremony contract and enforce it at handover
**Branch**: copilot/fix-253484265-1108482416-d97140c1-67b5-4859-8372-838dd1a899c8
**Date**: 2026-04-22
**CS2 Authorization**: CONFIRMED — issue opened directly by CS2 (@APGI-cmy); assigns Copilot

---

## Wave Summary

This wave hardens the Stage 10 IAA Pre-Brief by adding an explicit **wave-level admin ceremony contract** section to the Pre-Brief model. The current Pre-Brief declares task-level assurance requirements but lacks a formal declaration of the expected end-of-job admin ceremony package shape. This gap causes late-discovery of ceremony expectations and avoidable reject-fix-reject churn. The wave updates the IAA Pre-Brief protocol, IAA canon, pre-brief template/schema, and Foreman guidance, and adds proof-of-operation examples showing the new contract changes handover evaluation behaviour.

---

## Tasks

- [ ] TASK-S10H-000 — IAA Pre-Brief: invoke IAA for PRE-BRIEF section of wave record
      builder: independent-assurance-agent
      qp_verdict: PENDING
      notes: Must complete before any delegation below. Wave record path: .agent-admin/assurance/iaa-wave-record-stage10-prebrief-hardening-20260422.md

- [x] TASK-S10H-SCOPE — Scope declaration committed
      builder: foreman-v2-agent
      qp_verdict: COMMITTED
      notes: .agent-workspace/foreman-v2/personal/scope-declaration-wave-stage10-prebrief-hardening-20260422.md

- [ ] TASK-S10H-001 — D1: Harden IAA_PRE_BRIEF_PROTOCOL.md — add mandatory §Expected Wave-Level Admin Ceremony Contract section to Pre-Brief Content Requirements (version bump v1.2.2 → v1.3.0)
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: Required new section must declare: required_admin_ceremony_artifacts, required_final_state_conditions, required_cross_artifact_consistency_checks, required_acknowledgements, required_role_boundaries, required_handover_references. Must also add this section to Merge Gate Enforcement table.

- [ ] TASK-S10H-002 — D2: Update Pre-Brief schema — add wave-level ceremony contract fields to wave-current-tasks.md schema and to iaa-wave-record.template.md Pre-Brief section (version bump)
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: The per-task Pre-Brief structure must include a new optional/mandatory wave_ceremony_contract block. Update IAA_PRE_BRIEF_PROTOCOL.md §Wave Checklist Schema and governance/templates/iaa-wave-record.template.md §1.6 or new §1.7 for ceremony contract.

- [ ] TASK-S10H-003 — D3: Add ACR to INDEPENDENT_ASSURANCE_AGENT_CANON.md — unmet wave-level ceremony contract item = REJECTION trigger at handover (⚠️ SELF-MOD-IAA-001: requires CS2 direct review for this specific file)
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: New ACR should cover: missing declared ceremony artifact, unmet declared final-state condition, unmet declared cross-artifact consistency condition, missing acknowledgement/ownership requirement. Draft the ACR entry; CS2 must sign off on the INDEPENDENT_ASSURANCE_AGENT_CANON.md change per SELF-MOD-IAA-001. All other tasks in this wave may proceed via IAA review.

- [ ] TASK-S10H-004 — D4: Update PRE_BUILD_STAGE_MODEL_CANON.md Stage 10 section — communicate that Stage 10 must explicitly declare the wave-level admin ceremony contract, not just task-level assurance requirements
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: Stage 10 gate condition and description must reference the new wave-level ceremony contract requirement. Version bump required.

- [ ] TASK-S10H-005 — D5: Update Foreman Tier 2 guidance — add Stage 10 ceremony contract communication requirement to relevant Tier 2 knowledge file(s) so Foreman agents understand Stage 10 now defines both task-level AND ceremony-level expectations
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: Candidate files: .agent-workspace/foreman-v2/knowledge/WAVE-CURRENT-TASKS-PROTOCOL.md and/or prehandover-template.md. Must NOT modify .github/agents/foreman-v2-agent.md (agent file changes require CodexAdvisor + CS2 per A-002).

- [ ] TASK-S10H-006 — D6: Add proof-of-operation examples demonstrating the new wave-level ceremony contract changes handover evaluation behaviour
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: Must demonstrate at minimum: (a) wave with ceremony contract that passes cleanly, (b) wave that meets task-level requirements but fails wave-level ceremony contract, (c) wave where tracker/final-state contradiction is rejected because Pre-Brief already declared that condition. Can be embedded in IAA_PRE_BRIEF_PROTOCOL.md §Proof-of-Operation or as a separate artifact at governance/examples/.

- [ ] TASK-S10H-007 — D7: Update CANON_INVENTORY.json — update SHA256 hashes for all modified canon files
      builder: governance-liaison-isms-agent
      qp_verdict: PENDING
      notes: All canon files modified in D1–D6 must have updated hashes in governance/CANON_INVENTORY.json.

- [ ] TASK-S10H-ECAP — ECAP ceremony bundle
      builder: execution-ceremony-admin-agent
      qp_verdict: PENDING
      notes: Phase 4 only. Delegated after QP PASS on D1–D7.

- [ ] TASK-S10H-IAA-FINAL — IAA Final Audit — ASSURANCE-TOKEN
      builder: independent-assurance-agent
      qp_verdict: PENDING
      notes: Phase 4 only. After ECAP bundle returned and Foreman QP admin-compliance checkpoint passed.

---

## Wave Completion Gate

| Gate | Status |
|------|--------|
| IAA Pre-Brief committed | ⏳ PENDING |
| Scope declaration committed | ⏳ PENDING |
| D1 IAA_PRE_BRIEF_PROTOCOL.md hardened | ⏳ PENDING |
| D2 Pre-Brief schema updated | ⏳ PENDING |
| D3 ACR added to IAA canon | ⏳ PENDING |
| D4 PRE_BUILD_STAGE_MODEL_CANON.md Stage 10 updated | ⏳ PENDING |
| D5 Foreman Tier 2 guidance updated | ⏳ PENDING |
| D6 Proof-of-operation examples added | ⏳ PENDING |
| D7 CANON_INVENTORY.json updated | ⏳ PENDING |
| QP PASS (D1–D7) | ⏳ PENDING |
| ECAP ceremony bundle returned | ⏳ PENDING |
| IAA ASSURANCE-TOKEN obtained | ⏳ PENDING |
