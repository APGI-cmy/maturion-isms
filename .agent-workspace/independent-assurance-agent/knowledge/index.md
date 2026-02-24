# Independent Assurance Agent — Tier 2 Knowledge Index

**Agent**: independent-assurance-agent
**Contract Version**: 1.0.0
**Knowledge Version**: 1.0.0
**Last Updated**: 2026-02-24
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.0.0 | PRESENT |
| `iaa-core-invariants-checklist.md` | Core checks applied to every IAA invocation regardless of category | 1.0.0 | STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `iaa-trigger-table.md` | PR category classification table — when IAA activates and when it is exempt | 1.0.0 | STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `iaa-category-overlays.md` | Per-category additional checks (AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT) | 1.0.0 | STUB — must be populated from INDEPENDENT_ASSURANCE_AGENT_CANON.md before Phase B activation |
| `session-memory-template.md` | Standard session memory template for IAA invocations | 1.0.0 | STUB — must be created per S6 memory protocol before Phase B activation |

---

## Constitutional Canon References (Tier 1 — verified via CANON_INVENTORY)

- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` — primary IAA governance canon
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` v1.0.0
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` v1.0.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.0.0

---

## IAA Trigger Summary (interim — load full table from `iaa-trigger-table.md`)

| PR Category | IAA Triggered? |
|-------------|---------------|
| Agent contract creation or update | YES |
| Canon / governance document changes | YES |
| CI / workflow changes | YES |
| AAWP / MAT deliverables | YES |
| Doc-only or parking station updates | NO |
| Session memory files only | NO |

---

## Adoption Phase

| Phase | Status | Behaviour |
|-------|--------|-----------|
| Phase A | **CURRENT** | Advisory mode — verdicts informational, not hard-blocking |
| Phase B | PENDING | Mandatory blocking — REJECTION-PACKAGE prevents PR open |

---

## Stub Population Instructions

The following files are stubs that **must be populated before Phase B activation** (when IAA becomes blocking).
Blocker: `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` must be fully specified with complete check lists.
Timeline: CS2-authorized governance layer-down session after Phase B activation decision.

1. `iaa-core-invariants-checklist.md` — extract core check list from IAA canon
2. `iaa-trigger-table.md` — extract trigger classification table from IAA canon
3. `iaa-category-overlays.md` — extract per-category overlay checks from IAA canon
4. `session-memory-template.md` — create using standard memory template pattern (see CodexAdvisor Tier 2)

See: `.agent-workspace/CodexAdvisor-agent/memory/session-026-20260224.md` (parking station suggestion).

---

## Operating Model Summary

IAA operates with a single objective: binary verdict.
- **ASSURANCE-TOKEN**: all checks PASS → merge permitted (subject to CS2 approval)
- **REJECTION-PACKAGE**: one or more checks FAIL → merge blocked, all failures cited with fix required

IAA never produces partial verdicts, never reviews its own work, and is never the same agent
that produced the work under review.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
