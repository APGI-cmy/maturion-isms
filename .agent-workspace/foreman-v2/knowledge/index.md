# Foreman v2 — Tier 2 Knowledge Index

**Agent**: foreman-v2  
**Contract Version**: 2.10.0  
**Knowledge Version**: 3.0.0  
**Last Updated**: 2026-04-30  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

This directory contains operational domain knowledge (Tier 2) for the Foreman v2 agent.
See `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` for the full tier architecture specification.

### Files

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 3.0.0 |
| `FAIL-ONLY-ONCE.md` | **PREFLIGHT §1.3** — Breach registry, Universal A-rules (ISMS-local namespace A-001+), incident log, open improvements; must be self-attested every session before any work begins | 4.7.0 |
| `specialist-registry.md` | Registry of all delegable agents with capabilities and separation-of-duties boundary | 1.0.0 |
| `domain-flag-index.md` | Mode flags, orchestration pattern flags, degraded mode flags, domain boundaries | 1.0.0 |
| `prehandover-template.md` | **PHASE 4 §S-009** — PREHANDOVER proof template with mandatory IAA Agent Response (verbatim) section per FAIL-ONLY-ONCE v1.8.0 S-009; `## Environment Parity` section per OVL-CI-006; `## Pre-IAA Commit Gate` MANDATORY STOP section per A-021; IAA Token Self-Certification Guard section per S-035 structural gate; `## Ripple/Cross-Agent Assessment` mandatory section per HFMC-01; `## Wave-Level Ceremony Contract Verification` mandatory section per ACR-18–21 | 1.9.0 |
| `FM_QP_ENHANCED_QUICK_REFERENCE.md` | **Quality Professor Mode** — Quick reference for Builder Referral Protocol (QP-FAIL-001–009) and Progress Tracker Enforcement; Enhancement 3: Temporal and Evidence-Type Audit (A-040/A-041); Tier 3 canonical authority: `governance/canon/FM_QUALITY_PROTOCOL_ENHANCED_SOP.md` v1.0.0 | 1.1.0 |
| `WAVE-CURRENT-TASKS-PROTOCOL.md` | Codifies `wave-current-tasks.md` creation and maintenance mandate; Re-Anchor Pulse integration; wave close steps now include Wave Reconciliation Checklist; Stage 10 ceremony contract integration (ACR-18–21) | 1.2.0 |
| `wave-reconciliation-checklist.md` | **PHASE 4 — wave close** — Mandatory checklist: post-wave incident → NBR entry, liveness verification, evidence completeness, temporal and evidence-type audit; HANDOVER BLOCKER | 1.3.0 |

---

## Governance Ceremony Merge Gate

**Workflow**: `.github/workflows/governance-ceremony-gate.yml`  
**Authority**: FAIL-ONLY-ONCE v3.4.0 (A-010, A-014, A-015, A-016, A-031)  
**Violation class**: GOV-BREACH-AIMC-W5-002  

This gate blocks merging of any PR that touches governed paths unless the full governance ceremony is complete. It is **Foreman-owned** and runs on all pull requests.

### Governed Paths (trigger scope)

| Path Pattern | Description |
|---|---|
| `.github/workflows/**` | CI workflow additions or modifications |
| `.github/agents/**` | Agent contract files |
| `.agent-workspace/foreman-v2/knowledge/*.md` | Foreman Tier 2 knowledge files |

### Gate Checks (all must pass)

| Check | Job name | What it enforces |
|---|---|---|
| Draft PR check | `governance-ceremony/draft-check` | PR must not be in draft state |
| PREHANDOVER proof + IAA token | `governance-ceremony/prehandover-and-iaa-token` | PREHANDOVER proof must exist; `iaa_audit_token` must be resolved (not PENDING, not PHASE_A_ADVISORY); `## IAA Agent Response (verbatim)` must be non-empty |
| PR body governance block | `governance-ceremony/pr-body-governance-block` | PR body must contain `## Governance` block with `IAA Category`, `IAA Audit Token` (non-stale), and `PREHANDOVER Proof` path |
| Final verdict | `governance-ceremony/verdict` | Aggregates all checks; fails if any check failed |

### Required PR Body Format

```markdown
## Governance
- IAA Category: <category of change>
- IAA Audit Token: IAA-session-NNN-YYYYMMDD-PASS
- PREHANDOVER Proof: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-NNN-waveX-YYYYMMDD.md
```

### Bypass Condition

Automated governance alignment PRs (labels: `governance` + `automated` + `agent:liaison`, or branch `governance-alignment-auto`) are pre-validated and bypass this gate, consistent with all other governance workflows.

---

## Constitutional Canon References (Tier 1)

The following Tier 1 documents govern this agent's constitutional behavior (SHA256 verified at session start via `governance/CANON_INVENTORY.json`):

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- `governance/canon/ECOSYSTEM_VOCABULARY.md` v1.1.0 — **Canonical verb/mode definitions**
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` v1.0.0
- `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`

---

## Operating Mode Summary

Per `governance/canon/ECOSYSTEM_VOCABULARY.md` Mode Reference Table:

| Mode | Trigger Verbs | Authority |
|------|--------------|-----------|
| POLC-Orchestration | orchestrate, plan, organize, lead, coordinate, delegate | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Implementation Guard | implement, build, code, write, fix (directed at FM) | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Quality Professor | review, evaluate, QA, assess, validate, audit | EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md |

Mode flags and activation states: see `domain-flag-index.md`

---

## Separation of Duties Quick Reference

Foreman NEVER executes directly. All operations delegated per `specialist-registry.md`:
- Implementation → builder agents
- Governance alignment → `governance-liaison-isms-agent`
- Agent file ops → `CodexAdvisor-agent` (CS2-gated)
- QA execution → `qa-builder`

---

## Vocabulary Reference

**Canonical source**: `governance/canon/ECOSYSTEM_VOCABULARY.md`  
**Alias**: `governance/canon/AGENT_TIER_ARCHITECTURE.md` → `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

All verb classification and mode-switching decisions MUST reference `ECOSYSTEM_VOCABULARY.md`.

---

**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 3.0.0 | 2026-04-30 | FAIL-ONLY-ONCE.md bumped to v4.7.0 — A-043 MMM-LUIEP-GATE-MANDATORY locked in; no MMM PREHANDOVER proof may claim L2/L3 completion without a committed LUIEP per `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md` v1.0.0. Wave: mmm-ui-evidence-pack-hardening-20260430 (issue #1523). CANON_INVENTORY.json updated with MMM_UI_EVIDENCE_PACK_GATE.md entry. |
| 2.9.0 | 2026-04-22 | WAVE-CURRENT-TASKS-PROTOCOL.md bumped to v1.2.0 — Stage 10 ceremony contract integration (ACR-18–21); prehandover-template.md bumped to v1.9.0 — `## Wave-Level Ceremony Contract Verification` mandatory section added (IAA_PRE_BRIEF_PROTOCOL.md v1.3.0 §Expected Wave-Level Admin Ceremony Contract). Wave: stage10-prebrief-hardening-20260422 (issue #1447). |
| 2.8.0 | 2026-04-19 | Knowledge version header updated to 2.8.0 (Last Updated date aligned to 2026-04-19); prehandover-template.md Wave: cl6-wave3-knowledge-reingestion |
| 2.7.0 | 2026-04-09 | prehandover-template.md bumped to v1.8.0 — `## Ripple/Cross-Agent Assessment` mandatory section added (HFMC-01 / NO-REPEAT-PREVENTABLE-001 systemic fix); Wave: cl6-wave3-knowledge-reingestion |
| 2.9.0 | 2026-04-22 | FAIL-ONLY-ONCE.md bumped to v4.5.0 — A-040 TEMPORAL-AUDIT-AT-QP and A-041 EVIDENCE-TYPE-CLASSIFICATION-AT-QP locked in (governance hardening maturion-isms#1445); wave-reconciliation-checklist.md bumped to v1.3.0 — Section E (Temporal and Evidence-Type Audit) added with E-1 through E-4 checks; canon: governance/canon/TEMPORAL_AND_EVIDENCE_INTEGRITY_CANON.md created. |
| 2.6.0 | 2026-04-08 | FAIL-ONLY-ONCE.md bumped to v4.3.0 — INC-OPOJD-PSF-001 registered (Foreman OPOJD violation: PS-F Phase 4 incomplete at session termination); S-039 SCOPE_DECLARATION-FORMAT-VERIFICATION added; version history entry v4.3.0 appended. Wave: ps-f-iaa-trigger-table-new-categories (issue #1270). |
| 2.5.0 | 2026-04-07 | FAIL-ONLY-ONCE.md bumped to v4.2.0 — PS-B-01/02: ID Namespace Note updated; A-019 ARTIFACT-IMMUTABILITY canonical layer-down added. PS-B-03/04/05: A-033→A-036, A-034→A-037, A-035→A-038 renumbered; new A-033 CEREMONY-FILES-IN-SCOPE-DECLARATION, A-034 CANON-INVENTORY-UPDATE-MANDATORY, A-035 DELEGATION-ISSUE-REQUIRED locked in; S-025 REMEDIATED. PS-B-06: Completion marker [ ]/[x] convention added to Section 2 incident log header. Wave: ps-b-fail-only-once-v420-20260407; IAA pre-brief: KNOWLEDGE_GOVERNANCE category. |
| 2.4.0 | 2026-04-06 | FAIL-ONLY-ONCE.md bumped to v4.1.0 — A-035 COPILOT-BUILDER-ROLE-LABEL-BYPASS-PROHIBITION locked in as mandatory rule; S-035 (both entries) marked REMEDIATED; polc-boundary-gate.yml amended to enforce full POLC gate on Foreman-authored PRs regardless of copilot-builder-role label, and to extend builder-involvement-check to cover .github/workflows/ path changes; PR copilot/disallow-copilot-builder-role-bypass |
| 2.3.0 | 2026-03-18 | FAIL-ONLY-ONCE.md bumped to v4.0.0 — INC-BLANK-FRONTEND-PREBRIEF-001 registered (IAA Pre-Brief and handover token skipped: blank frontend fix; eleventh occurrence of A-031+A-014 violation class); S-035 COPILOT-BUILDER-ROLE-LABEL-BYPASS-PROHIBITION added; A-035 candidate documented; index version bumped per OVL-KG-ADM-002 |
| 2.2.0 | 2026-03-18 | wave-reconciliation-checklist.md v1.0.0 added — post-wave incident → NBR entry mandatory checklist, liveness verification, evidence completeness gate; WAVE-CURRENT-TASKS-PROTOCOL.md bumped to v1.1.0 with wave-close reconciliation step; CS2 mandate from wave 19/20 retrospective (PR #1142 review) |
| 2.1.0 | 2026-03-08 | FAIL-ONLY-ONCE.md bumped to v3.4.0 — INC-ALCF-001 registered (schema column mismatch escaped IAA gate: audit_logs INSERT/SELECT used non-existent columns; REMEDIATED in wave-audit-log-column-fix); S-028 SCHEMA-COLUMN-COMPLIANCE-MANDATORY added; index version bumped per OVL-KG-002 |
| 2.0.0 | 2026-03-08 | FAIL-ONLY-ONCE.md bumped to v3.1.0 — INC-OPOJD-W15R-QA-001 recorded (missing GitHub issue for T-W15R-QA-001 delegation); S-025 DELEGATION-ISSUE-REQUIRED added; footer version corrected; maturion-isms#1000 created; index bumped per OVL-KG-002 |
| 1.9.0 | 2026-03-08 | FAIL-ONLY-ONCE.md bumped to v3.0.0 — INC-WAVE15-PARSE-001 recorded (Wave 15 criteria parsing pipeline not functional in production); S-024 added (A-032 lock-in escalation); index bumped per OVL-KG-002 |
| 1.8.0 | 2026-03-08 | FAIL-ONLY-ONCE.md bumped to v2.9.0 — INC-BOOTSTRAP-IMPL-001 recorded (PRs #986/#990 Phase 1 bootstrap skip + NO-IMPLEMENT-001); A-031 PRE-BRIEF-BEFORE-DELEGATION locked in; S-023 improvement suggestion added |
| 1.7.0 | 2026-03-03 | WAVE-CURRENT-TASKS-PROTOCOL.md v1.0.0 added — wave-current-tasks.md mandate and Re-Anchor Pulse data contract |
| 1.6.4 | 2026-03-02 | prehandover-template.md bumped to v1.2.0 — `## Environment Parity` section added (OVL-CI-006 / A-020 7-session recurring flag resolved, issue #815) |
| 1.6.3 | 2026-03-02 | FM_QP_ENHANCED_QUICK_REFERENCE.md added (v1.0.0) — Layer-Down propagation of FM_QUALITY_PROTOCOL_ENHANCED_SOP.md v1.0.0 (canonical commit 7792913259b0); Builder Referral Protocol and Progress Tracker Enforcement Tier 2 stub |
| 1.6.2 | 2026-03-02 | FAIL-ONLY-ONCE.md updated to v2.2.0 — A-017 ISMS-AGENTS-ONLY rule locked in, INC-GENERAL-PURPOSE-001 incident recorded, S-014 improvement suggestion added (CS2 directive 2026-03-02) |
| 1.6.1 | 2026-03-02 | Corrected version table row for `index.md` from `1.2.0` to `1.6.1` — cosmetic drift from PR #785 (v1.3.0→v1.6.0 progression did not update table cell); version bumped on edit per OVL-KG-002 |
| 1.6.0 | 2026-03-02 | FAIL-ONLY-ONCE.md updated to v2.1.0 (INC-IAA-SKIP-002, A-016, S-013); prehandover-template.md added (PHASE 4 §S-009) |

---

## Differences from CodexAdvisor Layout

| Aspect | CodexAdvisor | Foreman v2 |
|---|---|---|
| Operating model | RAEC (Review/Advise/Escalate/Coordinate) | POLC (Plan/Organize/Lead/Check) |
| Phase 3 purpose | Agent contract creation & alignment | Wave orchestration & builder supervision |
| FAIL-ONLY-ONCE source | `memory/breach-registry.md` | `knowledge/FAIL-ONLY-ONCE.md` (Tier 2) |
| Quality Professor evaluates | Agent contract files (YAML, char count) | Builder code deliverables (tests, warnings) |
| OPOJD Gate checks | YAML validation, char count, checklist compliance | Test failures, warnings, evidence artifacts |
| Phase 4 output | Opens PR | Releases merge gate |
| Self-modification lock | SELF-MOD-001 (CodexAdvisor-agent.md) | SELF-MOD-FM-001 (foreman-v2-agent.md) |
| IAA oversight | Required for agent contract changes | IAA audits Foreman output independently. Foreman QAs builders; IAA QAs Foreman. Double-layer QA is intentional and required. |
| Phase 2 alignment | Per agent file job | Per wave start |

