# IAA Pre-Brief — Wave 18 Post-Merge Hotfix

**Pre-Brief ID**: IAA-PREBRIEF-wave18-postmerge-hotfix-20260315
**Wave**: Wave 18 Post-Merge Hotfix — RLS, AI Pydantic, Prompt, Index, Artifacts, IAA
**Branch**: `copilot/fix-wave-18-post-merge-hotfixes`
**Triggering Issue**: maturion-isms#1116
**Date**: 2026-03-15
**Produced by**: foreman-v2-agent v6.2.0 (Phase 1 Step 1.8 — pre-brief request to IAA)
**Session**: session-wave18-postmerge-hotfix-20260315
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

## § 0 — Pre-Brief Mode Confirmation

This is the IAA Pre-Brief artifact for the Wave 18 Post-Merge Hotfix wave.
It is committed here per A-031 (PRE-BRIEF-BEFORE-DELEGATION) and Phase 1 Step 1.8 requirements.

IAA will execute Phase 4 assurance at handover when Foreman invokes IAA with a completed
PREHANDOVER proof. This pre-brief declares scope, trigger categories, and required proof structure.

---

## § 1 — Wave Scope

Following merge of PR #1115 (Wave 18 MAT Criteria Parsing Pipeline Repair), CS2 opened issue #1116
identifying the following post-merge hotfixes required:

| # | Task | Layer | Builder |
|---|------|-------|---------|
| T-W18P-001 | Fix RLS to restore org-path-prefix data isolation; address missing profiles row gaps | DB / Schema | schema-builder |
| T-W18P-002 | Verify and fix serialization of AI fields via Pydantic models | Python / api-builder | api-builder |
| T-W18P-003 | Eliminate verbatim-only rule contradictions in AI system prompt | Python / api-builder | api-builder |
| T-W18P-004 | Verify and correct descriptor index alignment logic | TypeScript / Edge Function | api-builder |
| T-W18P-005 | IAA QA Invocation — overall QA review + Wave 18 IAA token | IAA | independent-assurance-agent |
| T-W18P-006 | Update governance artifacts (App Description, FRS/TRS, Test Status, Implementation Plan, Progress Tracker) | Docs | mat-specialist |
| T-W18P-007 | Confirm iaa-prebrief-wave18*.md in .agent-admin/assurance/ | Governance | Foreman (this file) |

---

## § 2 — Trigger Categories (IAA will apply at handover)

- **schema**: T-W18P-001 modifies or adds Supabase migration SQL
- **api**: T-W18P-002 and T-W18P-003 modify apps/mat-ai-gateway/services/parsing.py
- **edge-function**: T-W18P-004 modifies supabase/functions/invoke-ai-parse-criteria/index.ts
- **governance-artifacts**: T-W18P-006 modifies modules/mat/ documentation files
- **POLC-boundary**: All tasks must be delegated to specialist agents — no Foreman implementation

---

## § 3 — FFA Checks IAA Will Run at Handover

1. **Zero test failures** — all Wave 18 tests (T-W18-QA-001 to T-W18-QA-015) must remain GREEN; any new tests introduced must also be GREEN
2. **Zero skipped/todo/stub tests** — no test.skip, no test.todo
3. **Zero deprecation warnings** in Python or TypeScript
4. **Zero linter warnings** in modified files
5. **Schema column compliance (A-032)** — any new/modified columns in migration SQL must be reflected in Edge Function write-back and vice versa
6. **RLS self-check (BD-015)** — every modified table/bucket must have correct org-scoped RLS
7. **POLC boundary check** — all committed code changes must originate from builder agents, not from foreman-v2-agent
8. **Pydantic serialization check** — CriterionResult, MpsResult, DomainResult models must include all AI-extractable fields
9. **Verbatim-only consistency** — system prompt must apply verbatim-only rule consistently without contradictions
10. **Governance artifact completeness** — Progress Tracker, FRS/TRS, Implementation Plan must reflect Wave 18 completion

---

## § 4 — PREHANDOVER Proof Structure Required

The PREHANDOVER proof for this wave MUST include:
- Session ID, date, agent version, triggering issue (#1116) reference
- Wave description: "Wave 18 Post-Merge Hotfix"
- QP verdict: PASS per builder (schema-builder, api-builder, mat-specialist)
- OPOJD gate: PASS (all sub-checks listed)
- CANON_INVENTORY alignment: CONFIRMED
- Bundle completeness: list each evidence artifact
- `merge_gate_parity: PASS` (§4.3 compliance confirmed)
- `iaa_audit_token: IAA-session-NNN-wave18postmerge-YYYYMMDD-PASS` (expected reference)
- CS2 authorization: maturion-isms#1116 (issue opened by CS2)
- Gap closure attestation for all 7 T-W18P tasks

---

## § 5 — Scope Blockers and Governance Conflicts

1. **INC-W18-CRITERIA-PIPELINE-001 is OPEN** in FAIL-ONLY-ONCE.md — this wave IS the continuation of that incident's remediation. The wave must close with this incident updated to REMEDIATED.
2. **Original Wave 18 IAA Final Audit was PENDING** — the iaa-token-session-wave18-criteria-parsing-repair-20260315.md exists but must be confirmed as PASS before proceeding.
3. **Architecture frozen**: The architecture for this hotfix is the Wave 18 architecture already frozen in maturion-isms#1114. No new architecture document is required — the hotfixes are corrections to the existing architecture's implementation.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Pre-Brief Type**: Foreman-initiated pre-brief per Phase 1 Step 1.8 (A-031)
