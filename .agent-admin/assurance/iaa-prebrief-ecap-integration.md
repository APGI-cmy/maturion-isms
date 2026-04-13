# IAA Pre-Brief — Wave: ecap-integration

**Agent**: independent-assurance-agent
**Version**: 6.2.0 | Contract: 2.5.0
**Wave**: ecap-integration
**Issue**: maturion-isms#1339
**Branch**: copilot/complete-execution-ceremony-integration
**Date**: 2026-04-13
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Pre-Brief Status

**All tasks qualifying. Zero EXEMPT. IAA assurance MANDATORY at handover.**

---

## Qualifying Tasks

| Task ID | Task Summary | IAA Trigger Category | Required Phases | Required Evidence Artifacts | Applicable Overlays | Specific Rules |
|---------|-------------|---------------------|-----------------|---------------------------|---------------------|----------------|
| ECAP-A1 | Wire Foreman → ceremony-admin appointment/handback into `foreman-v2-agent.md` | AGENT_CONTRACT | Phase 2–4 (full assurance) | PREHANDOVER proof, session memory, SCOPE_DECLARATION, agent contract diff, CANON_INVENTORY alignment evidence | AGENT_CONTRACT overlay (AC-01 through AC-07), ECAP three-role split checks | AGCFPP-001: CodexAdvisor gate required. A-001: IAA invocation evidence. A-002: no class exceptions. ECAP-001 three-role split preserved. |
| ECAP-A2 | Update ceremony-admin contract `execution-ceremony-admin-agent.md` | AGENT_CONTRACT | Phase 2–4 (full assurance) | PREHANDOVER proof, session memory, SCOPE_DECLARATION, agent contract diff, CANON_INVENTORY alignment evidence | AGENT_CONTRACT overlay (AC-01 through AC-07), ECAP three-role split checks | AGCFPP-001: CodexAdvisor gate required. A-001: IAA invocation evidence. A-002: no class exceptions. Self-modification lock SELF-MOD-ECA-001 must be preserved. |
| ECAP-B1 | Expand ceremony-admin Tier 2 knowledge files (checklists, templates, knowledge index) | KNOWLEDGE_GOVERNANCE | Phase 2–4 (full assurance) | PREHANDOVER proof, session memory, SCOPE_DECLARATION, Tier 2 index alignment, knowledge file diffs | KNOWLEDGE_GOVERNANCE overlay, A-015 (full PREHANDOVER ceremony for Tier 2 patches) | A-015: Tier 2 knowledge patches require full PREHANDOVER ceremony — no content-type exemption. Knowledge index must be updated to reference new files. |
| ECAP-B2 | Update Foreman Tier 2 knowledge references for Phase 4 ceremony flow | KNOWLEDGE_GOVERNANCE | Phase 2–4 (full assurance) | PREHANDOVER proof, session memory, SCOPE_DECLARATION, Foreman knowledge diffs | KNOWLEDGE_GOVERNANCE overlay | A-015 applies. Foreman knowledge references must be consistent with updated contract Phase 4 flow. |
| ECAP-C1 | Define authoritative artifact path/ownership model | KNOWLEDGE_GOVERNANCE or CANON_GOVERNANCE (depends on where model is authored) | Phase 2–4 (full assurance) | PREHANDOVER proof, session memory, SCOPE_DECLARATION, model document | KNOWLEDGE_GOVERNANCE or CANON_GOVERNANCE overlay (determined at build time) | If authored in governance/canon/: CANON_GOVERNANCE overlay + CANON_INVENTORY hash update required. If in Tier 2 knowledge: KNOWLEDGE_GOVERNANCE overlay + A-015 applies. |

---

## FFA (FAIL-ONLY-ONCE) Checks Applicable

| Rule | Description | Applicability to This Wave |
|------|-------------|---------------------------|
| A-001 | IAA invocation evidence must be present for all agent contract PRs | **CRITICAL** — two agent contracts modified (foreman-v2, execution-ceremony-admin). Evidence of IAA invocation MUST appear in PR artifacts. |
| A-002 | IAA is mandatory for ALL agent contract classes — no exceptions | **CRITICAL** — Foreman class (foreman-v2-agent.md) and Administrator class (execution-ceremony-admin-agent.md) both require IAA. Neither is exempt. |
| A-003 | Ambiguity resolves to mandatory invocation | **APPLICABLE** — if any task classification is ambiguous, IAA IS required. |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | **CRITICAL** — Tier 2 knowledge expansion is a core deliverable. Full ceremony required. |
| A-029 | Artifact immutability §4.3b: PREHANDOVER proof is read-only post-commit | **APPLICABLE** — PREHANDOVER proof must use A-029 format. Token field pre-populated with expected reference. |
| A-037 | Token file must include `PHASE_B_BLOCKING_TOKEN` key-value line | **APPLICABLE** — IAA token file must include this standalone key-value line. |

---

## PREHANDOVER Proof Structure Requirements

The PREHANDOVER proof for this wave MUST contain at minimum:

```
## PREHANDOVER Proof — Wave ecap-integration

session_id: [session-NNN]
wave: ecap-integration
issue: 1339
branch: copilot/complete-execution-ceremony-integration
date: [YYYY-MM-DD]

### Scope Declaration
- [Every file touched, verified against git diff]

### QP Evaluation
- qp_result: [PASS/FAIL]
- qp_evidence: [reference]

### §4.3 Merge Gate Parity
- local_parity_result: [PASS/FAIL]
- checks_run: [list]

### Evidence Bundle
- agent_contract_diffs: [foreman-v2-agent.md, execution-ceremony-admin-agent.md]
- tier2_knowledge_files: [list of new/modified knowledge files]
- knowledge_index_updates: [execution-ceremony-admin-agent/knowledge/index.md]
- canon_inventory_alignment: [PASS/FAIL — if canon files modified]
- scope_to_diff_parity: [PASS/FAIL]
- commit_state_hygiene: [all artifacts committed before IAA invocation]

### CodexAdvisor Gate
- codexadvisor_authorization: [reference to CodexAdvisor approval for agent file changes]
- agent_files_modified: [foreman-v2-agent.md, execution-ceremony-admin-agent.md]

### Three-Role Split Attestation
- foreman_retained_supervisory_authority: [YES]
- ceremony_admin_limited_to_administration: [YES]
- iaa_independence_preserved: [YES]

### IAA Audit Token
- iaa_audit_token: IAA-session-NNN-ecap-integration-YYYYMMDD-PASS
```

---

## Scope Blockers Identified

| Blocker ID | Description | Severity | Resolution Required |
|-----------|-------------|----------|---------------------|
| SB-001 | **CodexAdvisor gate**: Both `.github/agents/foreman-v2-agent.md` and `.github/agents/execution-ceremony-admin-agent.md` are AGCFPP-001 protected. CodexAdvisor must authorize all agent file modifications. No agent contract changes may proceed without CodexAdvisor approval. | BLOCKING | CodexAdvisor must be invoked and approval evidenced before any agent file changes are committed. |
| SB-002 | **Ceremony-admin self-review risk**: This wave modifies the execution-ceremony-admin-agent contract. If ceremony-admin is appointed to prepare the handover bundle for this same wave, there is a conflict: the agent whose contract is being modified should not prepare its own assurance bundle. Foreman should either (a) handle ceremony preparation directly, or (b) note this advisory and ensure IAA verifies no self-review occurred. | ADVISORY | Foreman decides at wave-start. IAA will verify at invocation. |
| SB-003 | **Tier 2 knowledge expansion scope**: The ceremony-admin currently has only `index.md` in its Tier 2 knowledge. The wave must create multiple new knowledge files. All new files must be indexed and the knowledge version bumped. | NON-BLOCKING | Tracked as part of ECAP-B1 deliverable. |
| SB-004 | **CANON_INVENTORY alignment**: If any governance/canon/ files are created or modified (e.g., for artifact ownership model), CANON_INVENTORY.json must be updated with new hashes. Currently 199 entries — all valid. Any new canon file must be registered. | CONDITIONAL | Only applies if ECAP-C1 places the artifact model in governance/canon/. |
| SB-005 | **Ripple assessment**: Changes to Foreman's Phase 4 flow may ripple to other agents that reference Foreman's handover process. A ripple check against all agent contracts and Tier 2 knowledge files is recommended. | ADVISORY | Ripple assessment should be declared in SCOPE_DECLARATION. |

---

## Evidence Artifacts Expected at Handover

| # | Artifact | Path Pattern | Mandatory? |
|---|----------|-------------|-----------|
| 1 | PREHANDOVER proof | `.agent-workspace/[agent]/memory/PREHANDOVER-session-NNN-ecap-integration-YYYYMMDD.md` | YES |
| 2 | Session memory | `.agent-workspace/[agent]/memory/session-NNN-ecap-integration-YYYYMMDD.md` | YES |
| 3 | SCOPE_DECLARATION | Within PREHANDOVER proof or standalone | YES |
| 4 | Foreman contract diff | `.github/agents/foreman-v2-agent.md` (committed changes) | YES |
| 5 | Ceremony-admin contract diff | `.github/agents/execution-ceremony-admin-agent.md` (committed changes) | YES |
| 6 | Ceremony-admin Tier 2 knowledge files | `.agent-workspace/execution-ceremony-admin-agent/knowledge/` (new files) | YES |
| 7 | Ceremony-admin Tier 2 knowledge index | `.agent-workspace/execution-ceremony-admin-agent/knowledge/index.md` (updated) | YES |
| 8 | CodexAdvisor authorization evidence | Session memory or dedicated artifact referencing CodexAdvisor approval | YES |
| 9 | Ripple assessment | Within PREHANDOVER proof or SCOPE_DECLARATION | YES |
| 10 | IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-ecap-integration.md` | YES (COMMITTED) |
| 11 | CANON_INVENTORY.json alignment | Updated if any governance/canon/ files added | CONDITIONAL |
| 12 | Foreman Tier 2 knowledge updates | `.agent-workspace/foreman-v2/knowledge/` (if applicable) | CONDITIONAL |

---

## Anti-Regression Obligations

| Pattern ID | Recurring Pattern | Anti-Regression Obligation | Mechanical Verification |
|-----------|------------------|--------------------------|------------------------|
| AR-001 | SCOPE_DECLARATION drift (A-026) | SCOPE_DECLARATION must list every file touched including all Tier 2 knowledge files | `git diff --name-only origin/main...HEAD` must match SCOPE_DECLARATION file list |
| AR-002 | CWT PASS declaration missing (OVL-AM-CWT-01) | CWT evidence must include formal PASS declaration even for governance-only waves | PREHANDOVER proof must contain explicit CWT PASS section |
| AR-003 | PREHANDOVER token field format (A-029) | Must use §4.3b architecture — pre-populated expected reference, not PENDING | Token field value must match `IAA-session-NNN-*-PASS` pattern at commit time |
| AR-004 | ECAP three-role boundary (ECAP-001) | Three-role split must be verifiable from artifact authorship trail | ECAP-01 through ECAP-04 checks applied at Phase 3 |

---

## ECAP Three-Role Split Checks (Applicable at Assurance)

This wave specifically strengthens the three-role split model. IAA will apply ECAP checks with heightened scrutiny:

- **ECAP-01**: Verify ceremony-admin did NOT invoke IAA
- **ECAP-02**: Verify ceremony-admin did NOT issue readiness approval or verdict
- **ECAP-03**: Verify Foreman reviewed bundle before IAA invocation
- **ECAP-04**: Verify IAA did NOT perform ceremony administration

Additionally, because this wave modifies the ceremony-admin contract itself:
- **ECAP-SELF**: Verify the contract changes do not expand ceremony-admin authority beyond administration
- **ECAP-BOUNDARY**: Verify the updated contract preserves all existing class_boundary and three_role_split invariants
- **ECAP-LOCK**: Verify SELF-MOD-ECA-001 lock is preserved in the updated contract

---

## IAA Invocation Requirements at Handover

- IAA must be invoked by **Foreman** (not ceremony-admin, not builder, not CS2 proxy)
- All evidence artifacts must be **committed** before IAA invocation
- PREHANDOVER proof must be **immutable** (A-029 — read-only post-commit)
- CodexAdvisor authorization must be **evidenced** for agent file changes
- Phase 2–4 full assurance applies (AGENT_CONTRACT + KNOWLEDGE_GOVERNANCE overlays)
- AC-01 through AC-07 (IAA Agent Contract Audit Standard) applies to both agent contracts
- ECAP three-role split checks apply with heightened scrutiny

---

**Pre-Brief Status**: COMPLETE
**Qualifying Tasks**: 5 (ECAP-A1, ECAP-A2, ECAP-B1, ECAP-B2, ECAP-C1)
**Trigger Categories**: AGENT_CONTRACT, KNOWLEDGE_GOVERNANCE, possibly CANON_GOVERNANCE
**IAA Required at Handover**: YES — MANDATORY — PHASE_B_BLOCKING
**Scope Blockers**: 2 BLOCKING (SB-001 CodexAdvisor gate), 0 NON-BLOCKING, 2 ADVISORY, 1 CONDITIONAL

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 | Contract 2.5.0
**Generated**: Pre-Brief invocation for wave ecap-integration
