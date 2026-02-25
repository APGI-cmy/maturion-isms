# Independent Assurance Agent — Tier 2 Knowledge Index

**Agent**: independent-assurance-agent
**Contract Version**: 2.0.0
**Knowledge Version**: 1.1.0
**Last Updated**: 2026-02-25
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.1.0 | PRESENT |
| `FAIL-ONLY-ONCE.md` | Permanent rules recording governance failures IAA must never repeat | 1.0.0 | PRESENT — Rules A-001, A-002, A-003 active |
| `iaa-core-invariants-checklist.md` | Core checks applied to every IAA invocation regardless of category | 1.0.0 | STUB — must be fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `iaa-trigger-table.md` | PR category classification table — when IAA activates and when it is exempt | 1.0.0 | STUB — must be fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `iaa-category-overlays.md` | Per-category additional checks (AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT) | 1.0.0 | STUB — must be fully populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `session-memory-template.md` | Standard session memory template for IAA invocations | 1.0.0 | PRESENT |

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` — primary IAA governance canon
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` v1.0.0
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` v1.0.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.0.0
- `governance/canon/AGENT_CONTRACT_FILE_PROTECTION_POLICY.md` (AGCFPP-001)

---

## IAA Trigger Summary (load full table from `iaa-trigger-table.md`)

| PR Category | IAA Triggered? | Notes |
|-------------|---------------|-------|
| Agent contract creation or update | YES — MANDATORY | All classes. No exceptions. FAIL-ONLY-ONCE A-002. |
| Canon / governance document changes | YES | |
| CI / workflow changes | YES | |
| AAWP / MAT deliverables | YES | |
| Doc-only or parking station updates | NO | Must be unambiguously doc-only |
| Session memory files only | NO | |
| Ambiguous / unclear category | YES — MANDATORY | FAIL-ONLY-ONCE A-003: ambiguity resolves to mandatory |

---

## FAIL-ONLY-ONCE Active Rules

| Rule ID | Trigger | Status |
|---------|---------|--------|
| A-001 | IAA invocation evidence must be present in all agent contract PRs | ACTIVE |
| A-002 | IAA is mandatory for ALL agent contract classes — no class exceptions | ACTIVE |
| A-003 | Ambiguity resolves to mandatory invocation | ACTIVE |

---

## Adoption Phase

| Phase | Status | Behaviour |
|-------|--------|-----------|
| Phase A | **CURRENT** | Advisory mode — verdicts informational, not hard-blocking |
| Phase B | PENDING | Mandatory blocking — REJECTION-PACKAGE prevents PR open |

---

## Stub Population Instructions

The following files are stubs that **must be fully populated before Phase B activation**:
Blocker: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` must be fully specified.
Timeline: CS2-authorized governance layer-down session after Phase B activation decision.

1. `iaa-core-invariants-checklist.md` — extract complete core check list from IAA canon
2. `iaa-trigger-table.md` — extract complete trigger classification table from IAA canon
3. `iaa-category-overlays.md` — extract complete per-category overlay checks from IAA canon

---

## Operating Model Summary

IAA operates with a single objective: binary verdict.
- **ASSURANCE-TOKEN**: all checks PASS → merge permitted (subject to CS2 approval)
- **REJECTION-PACKAGE**: one or more checks FAIL → merge blocked, all failures cited with fix required
- **STOP-AND-FIX mandate**: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.

IAA never produces partial verdicts, never reviews its own work, and is never the same agent
that produced the work under review. Every invocation is logged in session memory and
`learning_notes` are used to refine future decisions and grow the FAIL-ONLY-ONCE registry.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
