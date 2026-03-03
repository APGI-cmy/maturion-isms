# Independent Assurance Agent — Tier 2 Knowledge Index

**Agent**: independent-assurance-agent
**Contract Version**: 2.0.0
**Knowledge Version**: 2.0.0
**Last Updated**: 2026-03-03
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

| File | Purpose | Version | Status |
|------|---------|---------|--------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.8.0 | PRESENT |
| `FAIL-ONLY-ONCE.md` | Permanent rules recording governance failures IAA must never repeat | 2.0.0 | PRESENT — Rules A-001 through A-027 active (A-027: third-consecutive A-021 failure = systemic workflow gap; A-026: SCOPE_DECLARATION.md must match PR diff exactly; A-025: ceremony artifacts must use PENDING until Post-ASSURANCE-TOKEN ceremony) |
| `iaa-core-invariants-checklist.md` | Core checks applied to every IAA invocation regardless of category | 2.5.0 | ACTIVE — CORE-001 to CORE-022; CORE-022 enforces secret field naming compliance |
| `iaa-trigger-table.md` | PR category classification table — when IAA activates and when it is exempt | 2.1.0 | ACTIVE — KNOWLEDGE_GOVERNANCE trigger category added |
| `iaa-category-overlays.md` | Per-category additional checks (AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT, KNOWLEDGE_GOVERNANCE) | 2.2.0 | ACTIVE — OVL-KG-001 through OVL-KG-005 added |
| `session-memory-template.md` | Standard session memory template for IAA invocations | 1.0.0 | PRESENT |
| `IAA_ZERO_SEVERITY_TOLERANCE.md` | Tier 2 operational note for Zero-Severity-Tolerance Rule — prohibited language table, machine-readable logic, exception procedure | 1.0.0 | ACTIVE |

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
| Tier 2 knowledge file changes | YES — MANDATORY | KNOWLEDGE_GOVERNANCE category. Evidence bundle + PREHANDOVER ceremony required (A-015). |
| Doc-only or parking station updates | NO | Must be unambiguously doc-only |
| Session memory files only | NO | |
| Ambiguous / unclear category | YES — MANDATORY | FAIL-ONLY-ONCE A-003: ambiguity resolves to mandatory |

---

## FAIL-ONLY-ONCE Active Rules (Key Rules — full registry in `FAIL-ONLY-ONCE.md`)

| Rule ID | Trigger | Status |
|---------|---------|--------|
| A-001 | IAA invocation evidence must be present in all agent contract PRs | ACTIVE |
| A-002 | IAA is mandatory for ALL agent contract classes — no class exceptions | ACTIVE |
| A-003 | Ambiguity resolves to mandatory invocation | ACTIVE |
| A-004 | Bootstrap directive non-negotiable — repo read before agent file is a preflight violation | ACTIVE |
| A-005 | Agent contract file immutability — no agent may modify .github/agents/ except CodexAdvisor+CS2 | ACTIVE |
| A-006 | PHASE_A_ADVISORY FABRICATION breach detection (INC-IAA-SKIP-001 pattern) | ACTIVE |
| A-015 | Tier 2 knowledge patches require full PREHANDOVER ceremony | ACTIVE |
| A-016 | Cross-PR IAA token reuse is a governance breach | ACTIVE |
| A-017 | Session memory must not cite a REJECTION-PACKAGE session as PASS | ACTIVE |
| A-018 | Post-merge retrospective audit findings must be formally recorded — no informal notes | ACTIVE |
| A-019 | Trigger table misapplication is an IAA bypass — all triggering categories require IAA | ACTIVE |
| A-020 | PREHANDOVER template must be kept current with overlay requirements — stale template causes cascading REJECTION-PACKAGEs | ACTIVE |
| A-021 | Commit and push BEFORE invoking IAA — working-tree-only fix is not a committed fix and will fail IAA audit | ACTIVE |
| A-022 | Re-evaluate ALL trigger categories on every IAA invocation — do not carry forward prior session's category classification; new commits can introduce new trigger categories | ACTIVE |
| A-023 | OVL-AC-012 ripple assessment is a standing PREHANDOVER requirement for all AGENT_CONTRACT PRs | ACTIVE |
| A-024 | `secret:` field prohibited in agent contracts — must use `secret_env_var:` to prevent CI scanner false positives | ACTIVE |
| A-025 | Ceremony artifacts must use PENDING until Post-ASSURANCE-TOKEN ceremony — no pre-fill of anticipated -PASS tokens | ACTIVE |
| A-026 | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` exactly before IAA invocation — stale = BL-027 merge gate parity failure | ACTIVE |
| A-027 | Third-consecutive A-021 failure on same PR/branch = systemic workflow gap — producing agent must add Pre-IAA Commit Gate to PREHANDOVER template with git status + git log evidence | ACTIVE |

---

## Adoption Phase

| Phase | Status | Behaviour |
|-------|--------|-----------|
| Phase A | CLOSED | Advisory mode — verdicts informational, not hard-blocking |
| Phase B | **CURRENT — PHASE_B_BLOCKING** | Mandatory blocking — REJECTION-PACKAGE prevents PR open |

---

## Stub Population Status

All previously stub files have been fully populated (as of 2026-02-28):

1. `iaa-core-invariants-checklist.md` — fully populated from IAA canon v2.0.0 (CORE-001 to CORE-017)
2. `iaa-trigger-table.md` — fully populated from IAA canon v2.0.0 (with AGENT_INTEGRITY category and classification decision flow)
3. `iaa-category-overlays.md` — fully populated from IAA canon v2.0.0 (with OVL-CI-004 and AGENT_INTEGRITY overlay)

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

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-02-25 | Initial index — FAIL-ONLY-ONCE.md, session-memory-template.md stubs |
| 1.1.0 | 2026-02-28 | Core knowledge files fully populated (iaa-core-invariants-checklist.md, iaa-trigger-table.md, iaa-category-overlays.md) |
| 1.2.0 | 2026-03-01 | iaa-core-invariants-checklist.md v2.1.0 update (CORE-016 copy-paste requirement) |
| 1.3.0 | 2026-03-02 | iaa-trigger-table.md v2.1.0 (KNOWLEDGE_GOVERNANCE category); iaa-category-overlays.md v2.2.0 (OVL-KG-001 through OVL-KG-005); FAIL-ONLY-ONCE.md v1.3.0 (A-018, A-019) |
| 1.4.0 | 2026-03-02 | iaa-core-invariants-checklist.md v2.3.0 (CORE-018 to CORE-020; CORE-007 PENDING carve-out); A-020 (PREHANDOVER template staleness); all stub files populated |
| 1.5.0 | 2026-03-02 | IAA_ZERO_SEVERITY_TOLERANCE.md v1.0.0; iaa-core-invariants-checklist.md v2.4.0 (CORE-021); A-021 (commit before invocation); A-022 (re-evaluate trigger categories every invocation) |
| 1.6.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.6.0 (A-023 OVL-AC-012 ripple assessment standing requirement codified from sessions 084–101); index updated to 1.6.0 |
| 1.7.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.7.0 (A-024 secret field naming — `secret:` prohibited, must use `secret_env_var:`); iaa-core-invariants-checklist.md v2.5.0 (CORE-022); all 16 active agent contracts fixed; CI scanner failures resolved |
| 1.8.0 | 2026-03-03 | Conflict resolution: A-023 collision fixed — PR #816 rule renumbered to A-025 (ceremony PENDING rule); A-023 now = OVL-AC-012 ripple assessment; A-024 = secret field naming; A-025 = ceremony PENDING pre-fill prohibition |
| 1.9.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v1.9.0 — A-026 (SCOPE_DECLARATION.md must match PR diff exactly before IAA invocation — stale = BL-027 merge gate parity failure) added from session-116 Wave 13 Addendum B+C re-invocation |
| 2.0.0 | 2026-03-03 | FAIL-ONLY-ONCE.md v2.0.0 — A-027 (third-consecutive A-021 = systemic workflow gap) added from session-119 (Wave 14 Addendum A); FAIL-ONLY-ONCE.md header corrected from 1.8.0 to 2.0.0 (header/index version mismatch resolved) |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
