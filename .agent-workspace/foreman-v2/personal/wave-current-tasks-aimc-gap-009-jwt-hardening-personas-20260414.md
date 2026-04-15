# Wave Current Tasks — AIMC Remediation & Persona Improvement

wave: aimc-gap-009-jwt-hardening-personas-20260414
iaa_prebrief_path: .agent-admin/assurance/iaa-wave-record-aimc-gap-009-jwt-hardening-personas-20260414.md
triggering_issue: maturion-isms — [AIMC Persona & Gap Remediation] Multi-wave execution: persona specification, GAP-009, F-D3-002, CL-7/CL-6, GRS sign-off
branch: copilot/aimc-gap-009-harden-jwt-auth
date: 2026-04-14
cs2_authorization: Issue opened by CS2 (@APGI-cmy) and assigns copilot — valid per §2.1
ceremony_admin_appointed: execution-ceremony-admin-agent (Phase 4)
iaa_prebrief_artifact: .agent-admin/assurance/iaa-wave-record-aimc-gap-009-jwt-hardening-personas-20260414.md

## Active Wave: AIMC Remediation & Persona Improvement — 6-Wave Post-Audit Execution

### Wave Description

This wave implements the 6 post-audit remediation actions identified in the AIMC Phase 2 audit
(PR #1367). The audit found PASS WITH GAPS verdict (41/48 PASS, 6 PARTIAL, 1 FAIL).

### Pre-Build Stages Status
- Stage 5 (Architecture): FROZEN — defined in AIMC_PHASE2_AUDIT_CONSOLIDATED_REPORT.md + existing implementations
- Stage 6 (Red QA): DEFINED — existing test suites in ai-centre package and api/ai/ directory
- Stage 7 (PBFAG): CONFIRMED — audit report establishes frozen build foundation
- Stage 8 (Implementation Plan): PRESENT — issue body + audit findings serve as formal impl. plan
- Stage 9 (Builder Checklist): PRESENT — declared per wave task below
- Stage 10 (IAA Pre-Brief): COMMITTED — iaa-wave-record-aimc-gap-009-jwt-hardening-personas-20260414.md

### Wave Tasks

#### Wave 1 — GAP-009: EpisodicMemoryAdapter Supabase persistence
- Status: EXISTING IMPLEMENTATION FOUND — verify tests pass
- Assignee: integration-builder (verification/confirmation)
- Expected files: packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts (existing)
- Test evidence: packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts
- Blocker: B-001 — migration DDL (packages/ai-centre/supabase/migrations/004_ai_episodic_memory.sql)

#### Wave 2 — F-D3-002: JWT auth hardening on ARC approval endpoint
- Status: EXISTING IMPLEMENTATION FOUND — verify tests pass
- Assignee: api-builder (verification/confirmation)
- Expected files: api/ai/feedback/approve.ts (existing, uses supabase.auth.getUser())
- Test evidence: api/ai/feedback/approve.test.ts (W9.4-T-009, W9.4-T-011, W9.4-T-012)
- Blocker: B-002 — CORE-021 zero-tolerance; must be complete

#### Wave 3 — CL-6: LKIAC knowledge re-ingestion
- Status: T-D-003 FAIL (expected — zero approved items, blocked on CL-12)
- Assignee: Note for CS2 — knowledge seeding requires CL-12 module integration
- Expected files: governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md (update with at least 1 seed item)
- Note: Structural framework complete; T-D-003 fail is dependency-chain FAIL not structural

#### Wave 4 — CL-7: PersonaLoader improvements
- Status: EXISTING IMPLEMENTATION FOUND — PersonaValidationError + YAML validation present
- Assignee: qa-builder (verify test coverage and CI pass)
- Expected files: packages/ai-centre/src/personas/PersonaLoader.ts (existing)
- Test evidence: packages/ai-centre/src/__tests__/personas/PersonaLoader*.test.ts

#### Wave 5 — Persona improvement
- Status: DELEGATED to specialists
- Assignees:
  - mat-specialist: mat-advisor.md, isms-navigator.md
  - risk-platform-agent: risk-advisor.md, xdetect-advisor.md
  - maturity-scoring-agent: maturity-roadmap-advisor.md
- Expected files: packages/ai-centre/src/agents/{mat-advisor,isms-navigator,risk-advisor,xdetect-advisor,maturity-roadmap-advisor}.md
- Audit findings: T-E-001, T-E-003, T-E-004, T-E-006, T-E-008 all PARTIAL

#### Wave 6 — GRS Admin sign-off
- Status: CS2 ACTION REQUIRED
- Expected: governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md Status updated to APPROVED
- Note: This is a CS2 administrative action. Foreman has prepared the document for sign-off.

### Delegation Table

| Builder | Task | Issue | Expected Artifacts |
|---------|------|-------|-------------------|
| integration-builder | Verify GAP-009 impl + migration schema | maturion-isms#1368 | EpisodicMemoryAdapter.ts, migration SQL, test results GREEN |
| api-builder | Verify F-D3-002 impl + security tests | maturion-isms#1368 | approve.ts, test results GREEN |
| mat-specialist | Improve mat-advisor, isms-navigator | maturion-isms#1368 | persona .md files improved |
| risk-platform-agent | Improve risk-advisor, xdetect-advisor | maturion-isms#1368 | persona .md files improved |
| maturity-scoring-agent | Improve maturity-roadmap-advisor | maturion-isms#1368 | persona .md file improved |
| qa-builder | Verify CL-7 test coverage | maturion-isms#1368 | PersonaLoader tests GREEN |
