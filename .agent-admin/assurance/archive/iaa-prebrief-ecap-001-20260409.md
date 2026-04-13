# IAA Pre-Brief — ECAP-001 Downstream Normalization (Issue #1319)

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave**: ecap-001-downstream-normalization-20260409
**Branch**: copilot/ecap-001-downstream-normalization
**Issue**: maturion-isms#1319 — ECAP-001: Downstream normalization of protected contracts, runtime templates, registry, CI allowlist
**Pre-Brief authored by**: foreman-v2-agent (Phase 1 Step 1.8 — pre-brief request)
**Date**: 2026-04-09
**Authority**: CS2 (@APGI-cmy) | INDEPENDENT_ASSURANCE_AGENT_CANON.md
**Invocation mode**: PHASE 0 — PRE-BRIEF. IAA assurance phases 1–4 to be invoked at handover.

---

## 1. Wave Summary

ECAP-001 downstream normalization replay. PR #1315 created all required changes but bypassed the
governed Foreman → CodexAdvisor → IAA pathway (ChatGPT/human commits fail actor-authority CI gate).

This wave replays the same changes via the constitutionally correct governed pathway:
- Foreman orchestrates (this session)
- CodexAdvisor-agent executes all .github/agents/ modifications (CS2-authorized)
- IAA audits at handover

**Scope**:
1. `.github/workflows/agent-contract-audit.yml` — add `johan.ras@apginc.ca` to CS2_EMAILS,
   add `198982749+Copilot@users.noreply.github.com` to CODEX_EMAILS, add CS2_NAMES array
2. `.github/agents/execution-ceremony-admin-agent.md` — new protected contract (ECAP administrator class)
3. `.github/agents/CodexAdvisor-agent.md` — add administrator_class_coverage + ecap_role_boundary capabilities
4. `.github/agents/foreman-v2-agent.md` — boundary normalization (compress identity section for character budget)
5. `.github/agents/independent-assurance-agent.md` — add three_role_split, ceremony-admin check steps, compress HALT/prohibitions
6. `governance/canon/AGENT_HANDOVER_AUTOMATION.md` — add ceremony-admin wave-current-tasks fields documentation
7. Workspace knowledge files — specialist-registry update, Foreman playbook, IAA checklist, CodexAdvisor rollout note

---

## 2. IAA Trigger Category Declaration

| Category | Reason | Tasks |
|----------|--------|-------|
| **AGENT_CONTRACT** (PRIMARY) | 4 protected .github/agents/*.md files modified + 1 new file created | T-ECAP-002 through T-ECAP-005 |
| **CI_WORKFLOW** | .github/workflows/agent-contract-audit.yml modified | T-ECAP-001 |
| **CANON_GOVERNANCE** | governance/canon/AGENT_HANDOVER_AUTOMATION.md modified | T-ECAP-006 |

Workspace knowledge files (T-ECAP-007): informational artifacts only, no separate trigger category.

**ceremony_admin_appointed**: NO — standard Foreman + CodexAdvisor + IAA pathway only.

---

## 3. Qualifying Tasks

### T-ECAP-001: CI workflow update (CI_WORKFLOW)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-001 |
| **Task Summary** | Update `.github/workflows/agent-contract-audit.yml`: add `johan.ras@apginc.ca` to CS2_EMAILS, add `198982749+Copilot@users.noreply.github.com` to CODEX_EMAILS, introduce CS2_NAMES array with `"APGI-cmy"` and `"Johan Ras"` |
| **IAA Trigger Category** | CI_WORKFLOW |
| **Required Evidence** | (1) `johan.ras@apginc.ca` present in CS2_EMAILS array; (2) `198982749+Copilot@users.noreply.github.com` present in CODEX_EMAILS; (3) CS2_NAMES array present and used in author check; (4) existing CS2/CODEX values unchanged |
| **Applicable Overlays** | CI_WORKFLOW category overlay |

### T-ECAP-002: New execution-ceremony-admin-agent.md (AGENT_CONTRACT)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-002 |
| **Task Summary** | Create `.github/agents/execution-ceremony-admin-agent.md` — administrator-class agent for Phase 4 bundle preparation only. Contract must encode the three-role split: (1) Foreman = substantive supervisory authority, (2) ceremony-admin = administrative Phase 4 bundle preparation only, (3) IAA = independent assurance gate only. |
| **IAA Trigger Category** | AGENT_CONTRACT |
| **Required Evidence** | (1) File exists at `.github/agents/execution-ceremony-admin-agent.md`; (2) class: administrator in YAML; (3) three-role split invariants encoded; (4) file size ≤ 30,000 characters; (5) YAML frontmatter ≤ 200 lines |
| **Applicable Overlays** | AGENT_CONTRACT category overlay, AGCFPP-001 §3 |

### T-ECAP-003: CodexAdvisor-agent.md update (AGENT_CONTRACT)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-003 |
| **Task Summary** | Update `.github/agents/CodexAdvisor-agent.md`: add `administrator_class_coverage` (includes execution-ceremony-admin-agent), add `ecap_role_boundary` capabilities block with governed_contracts list and non_substitution_invariants, add Step 2.3a (ECAP role-boundary review step) |
| **IAA Trigger Category** | AGENT_CONTRACT |
| **Required Evidence** | (1) `administrator_class_coverage` block present under agent_class_authority; (2) `ecap_role_boundary` block with all 4 governed_contracts listed; (3) Step 2.3a present in Phase 2; (4) file size ≤ 30,000 characters |
| **Applicable Overlays** | AGENT_CONTRACT category overlay |

### T-ECAP-004: foreman-v2-agent.md normalization (AGENT_CONTRACT)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-004 |
| **Task Summary** | Update `.github/agents/foreman-v2-agent.md`: compress identity.mission and identity.class_boundary from multi-line YAML blocks to single-line strings; compress iaa_oversight.trigger, mandatory_artifacts, and invocation_step to shorter forms. Preserves all semantic content. |
| **IAA Trigger Category** | AGENT_CONTRACT |
| **Required Evidence** | (1) mission: field is single-line string; (2) class_boundary: field is single-line string; (3) trigger: ALL_WAVE_HANDOVERS (compact form); (4) all POLC supervisor authority intact; (5) SELF-MOD-FM-001 lock intact; (6) file size ≤ 30,000 characters |
| **Applicable Overlays** | AGENT_CONTRACT category overlay |

### T-ECAP-005: independent-assurance-agent.md update (AGENT_CONTRACT)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-005 |
| **Task Summary** | Update `.github/agents/independent-assurance-agent.md`: add three_role_split block to identity, compress HALT conditions to inline YAML, compress prohibitions to inline YAML, add Step 0.3c (ceremony-admin appointment check in pre-brief), add Step 3.1c (three-role split boundary check at handover). |
| **IAA Trigger Category** | AGENT_CONTRACT |
| **Required Evidence** | (1) three_role_split block present in identity; (2) HALT conditions still enumerate all HALT IDs; (3) prohibitions still enumerate all prohibition IDs; (4) Step 0.3c present; (5) Step 3.1c present with ECAP-01 through ECAP-04 checks; (6) file size ≤ 30,000 characters |
| **Applicable Overlays** | AGENT_CONTRACT category overlay |

### T-ECAP-006: AGENT_HANDOVER_AUTOMATION.md update (CANON_GOVERNANCE)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-006 |
| **Task Summary** | Update `governance/canon/AGENT_HANDOVER_AUTOMATION.md`: add documentation of wave-current-tasks.md runtime template fields for ceremony-admin appointment, Foreman review obligation before IAA, and PR artifact trail requirements. |
| **IAA Trigger Category** | CANON_GOVERNANCE |
| **Required Evidence** | (1) ceremony_admin_appointed field documented; (2) Foreman review before IAA section present; (3) PR artifact trail requirements present |
| **Applicable Overlays** | CANON_GOVERNANCE category overlay |

### T-ECAP-007: Workspace knowledge files (informational)

| Field | Value |
|-------|-------|
| **Task ID** | T-ECAP-007 |
| **Task Summary** | Add/update workspace knowledge files: specialist-registry.md (administrator agents section), execution-ceremony-admin-delegation-playbook.md, ecap-agent-factory-rollout.md, ecap-three-role-split-checklist.md, wave-current-tasks-template.md update |
| **IAA Trigger Category** | N/A (informational workspace artifacts — not executable, not protected) |
| **Required Evidence** | Files exist at expected paths |

---

## 4. PREHANDOVER Structure

At handover, the following evidence bundle is required:

- `wave-current-tasks.md` with all tasks marked complete
- Session memory: `.agent-workspace/foreman-v2/memory/session-ecap-001-20260409.md`
- PREHANDOVER proof: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-ecap-001-20260409.md`
- IAA token: `.agent-admin/assurance/iaa-token-ecap-001-20260409.md` (PHASE_B_BLOCKING_TOKEN required)

---

## 5. Scope Blockers

- **SB-001**: foreman-v2-agent.md character budget — current file is ~29,880 chars; normalization must compress identity section to stay under 30,000 after ECAP text addition. The PR #1315 approach (single-line mission/class_boundary) is validated as the correct technique.
- **SB-002**: independent-assurance-agent.md is already 30,580 chars — PR #1315 compresses HALT conditions and prohibitions to inline YAML to bring it under the limit. This compression is mandatory.
- **SB-003**: AGCFPP-001 — all .github/agents/ changes require CodexAdvisor + IAA audit. Foreman must not directly write agent contract text; Foreman delegates to CodexAdvisor (Copilot runtime). CS2 authorization in issue #1319.

---

## 6. Anti-regression obligations

Per FAIL-ONLY-ONCE registry (v4.2.0):
- A-010: Pre-IAA commit gate must pass before IAA invocation
- A-021: Commit ALL files before invoking IAA
- A-029: PREHANDOVER proof is immutable after initial commit — IAA token goes to dedicated file only
- SELF-MOD-FM-001: Foreman must not author agent contract text directly

**Known recurring failure**: CORE-013 (IAA invocation evidence) — PREHANDOVER proof must be committed before IAA invocation. Verified per A-021.
