# Wave Current Tasks — foreman-v2-agent — Wave GOV MAT Criteria Repair (Issue #1135)

**Wave**: wave-gov-mat-criteria-repair-1135 — MAT Criteria Parsing Holistic Repair: Gap Register + Governance Updates + Foreman Plan
**Session**: session-wave-gov-mat-criteria-repair-1135-20260317
**Date**: 2026-03-17
**Branch**: copilot/gov-mat-criteria-repair
**Triggering Issue**: maturion-isms#1135 — "[GOV] MAT Criteria Parsing Holistic Repair — Gap Register + Governance Updates + Foreman Plan (NO IMPLEMENTATION)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns this agent — constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration (governance/planning only — no builder delegation, no code changes)
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-gov-mat-criteria-repair-1135.md` — COMMITTED (SHA 16d648e)

---

## Wave Scope

Governance-documentation-only wave. Foreman surveys the MAT criteria parsing pipeline, produces a comprehensive gap register, updates governance documents to record identified gaps, and produces a Wave Plan Proposal for Issue #2 (implementation wave). NO production code, migrations, tests, or CI changes in this issue.

---

## Tasks

| # | Task ID | Description | Owner | Status |
|---|---------|-------------|-------|--------|
| 1 | T-GOV-001 | Phase 1 PREFLIGHT + IAA Pre-Brief | Foreman | ✅ COMPLETE |
| 2 | T-GOV-002 | Codebase survey (pipeline, schema, Edge Fn, AI Gateway, env vars, FRS/TRS) | Foreman | ✅ COMPLETE |
| 3 | T-GOV-003 | Create CRITERIA-PARSING-GAP-REGISTER.md (Deliverables A1, B1, C1, G1) | Foreman | ✅ COMPLETE |
| 4 | T-GOV-004 | Update BUILD_PROGRESS_TRACKER.md — new incidents + remediation placeholders | Foreman | ✅ COMPLETE |
| 5 | T-GOV-005 | Update app-description.md — parsing pipeline expectations vs reality section | Foreman | ✅ COMPLETE |
| 6 | T-GOV-006 | Update MAT_UX_WORKFLOW_AND_WIRING.md — correct Step 2a parse wiring, known gaps | Foreman | ✅ COMPLETE |
| 7 | T-GOV-007 | Update functional-requirements.md — add gap flags for parsing FRs | Foreman | ✅ COMPLETE |
| 8 | T-GOV-008 | Update technical-requirements-specification.md — add gap flags for parsing TRs | Foreman | ✅ COMPLETE |
| 9 | T-GOV-009 | Create WAVE-19-PLAN-PROPOSAL.md — wave plan for Issue #2 | Foreman | ✅ COMPLETE |
| 10 | T-GOV-010 | Create SCOPE_DECLARATION.md for this wave | Foreman | ✅ COMPLETE |
| 11 | T-GOV-IAA | IAA Phase 4 Final Audit + token | independent-assurance-agent | ⏳ PENDING (Phase 4.3a) |

---

## Gap Register Summary (Seed + Discovered)

| Gap ID | Severity | Component | Status |
|--------|----------|-----------|--------|
| GAP-PARSE-001 | 🔴 CRITICAL | criteria.number is INTEGER — cannot store LDCS hierarchical IDs (1.4.1) | 🔴 OPEN |
| GAP-PARSE-002 | 🔴 CRITICAL | mini_performance_standards missing intent_statement + guidance columns | 🔴 OPEN |
| GAP-PARSE-003 | 🔴 CRITICAL | No audit_logs parse events in production (0 rows confirmed) | 🔴 OPEN |
| GAP-PARSE-004 | 🟠 HIGH | Silent success: pipeline can complete with 0 inserts | 🔴 OPEN |
| GAP-PARSE-005 | 🟠 HIGH | No DB transaction — partial writes possible on failure | 🔴 OPEN |
| GAP-PARSE-006 | 🔴 CRITICAL | AI_GATEWAY_URL not configured in Supabase Edge Function secrets | 🔴 OPEN |
| GAP-PARSE-007 | 🟡 MEDIUM | Legacy overlap drift — two MAT implementations, schema alignment risk | 🟡 MONITORING |
| GAP-PARSE-008 | 🟠 HIGH | AI Gateway MpsResult missing intent_statement + guidance fields | 🔴 OPEN |
| GAP-PARSE-009 | 🟠 HIGH | usePollCriteriaDocumentStatus polls forever on silent background task failure | 🔴 OPEN |
| GAP-PARSE-010 | 🟡 MEDIUM | No content assertions in QA tests (S-034) | 🔴 OPEN |
| GAP-PARSE-011 | 🟠 HIGH | SUPABASE_STORAGE_URL may not be configured in Render production | 🔴 OPEN |
| GAP-PARSE-012 | 🔴 CRITICAL | Edge Function number mapping uses idx+1 — LDCS hierarchical structure entirely lost | 🔴 OPEN |

---

## Re-Anchor Pulse

```yaml
wave: wave-gov-mat-criteria-repair-1135
branch: copilot/gov-mat-criteria-repair
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave-gov-mat-criteria-repair-1135.md
iaa_prebrief_committed: true
iaa_prebrief_sha: 16d648e
status: ASSURANCE_TOKEN_PENDING
tasks_total: 11
tasks_done: 10
tasks_pending: [T-GOV-IAA]
mode: POLC-Orchestration (governance-planning-only)
governance_docs_to_update: [CRITERIA-PARSING-GAP-REGISTER.md, BUILD_PROGRESS_TRACKER.md, app-description.md, MAT_UX_WORKFLOW_AND_WIRING.md, functional-requirements.md, technical-requirements-specification.md, WAVE-19-PLAN-PROPOSAL.md]
no_implementation_constraint: CONFIRMED
```

---

*Authority: CS2 (@APGI-cmy) | LIVING_AGENT_SYSTEM.md v6.2.0 | Contract: 2.7.0*
