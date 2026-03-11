# Wave Current Tasks — foreman-v2-agent — wave17-user-guided-parsing

**Wave**: 17 — User-Guided AI Parsing Instruction System
**Session**: session-wave17-orchestration-20260311
**Date**: 2026-03-11
**Branch**: copilot/implement-user-guided-ai-parsing
**Triggering Issue**: maturion-isms — "Wave 17 — Build Orchestration: User-Guided AI Parsing Instruction System"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md` — COMMITTED (SHA a569450)

---

## Design Defect Corrected

**MAT-DES-PARSE-001 — Hardcoded Parsing Strategy**: The AI Gateway previously used a hardcoded LDCS-specific system prompt. Wave 17 replaces this with a split-layer architecture: invariant schema-first permanent layer (system role) + user-provided variable instructions (user role).

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W17-A | Schema: parsing_instructions column + parsing_instruction_templates table + RLS + seed | schema-builder | COMPLETE ✅ |
| 2 | T-W17-B | AI Gateway: parsing.py user_instructions support + split prompt | api-builder | COMPLETE ✅ |
| 3 | T-W17-C | Edge Function: user_instructions forwarding + DB storage | api-builder | COMPLETE ✅ |
| 4 | T-W17-D | UI: ParsingInstructionsModal + CriteriaUpload + useCriteria hook | ui-builder | COMPLETE ✅ |
| 5 | T-W17-E | QA: T-W17-QA-001 to T-W17-QA-012 RED→GREEN | qa-builder | COMPLETE ✅ |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PENDING
wave: 17
session: session-wave17-orchestration-20260311
branch: copilot/implement-user-guided-ai-parsing
batches_complete: [A, B, C, D, E]
tests_green: 17/17
regression_green: 14/14
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md
last_updated: 2026-03-11
tasks_done: 5
tasks_total: 5
```

---

## Root Cause Identified

**PRIMARY ROOT CAUSE**: The `criteria` table is missing the `title TEXT` column.
- The Edge Function (`supabase/functions/invoke-ai-parse-criteria/index.ts`, line 318) attempts to insert `title: c.title ?? null`
- The criteria table DDL (`apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql`) has no `title` column
- PostgreSQL error: `column "title" of relation "criteria" does not exist`
- This causes `criteriaError` to be thrown → status set to `parse_failed` → criteria never created

**SECONDARY ISSUE**: `description TEXT NOT NULL` in criteria table but Edge Function sends `c.description ?? null` — null description would cause NOT NULL violation.

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W17-QA-001 | Define Red QA test for criteria title column insertion failure | qa-builder | PENDING |
| 2 | T-W17-SCH-001 | Add migration: `title TEXT` column to criteria table; make `description` nullable | schema-builder | PENDING |
| 3 | T-W17-QA-002 | Run tests to confirm Green after schema fix | qa-builder | PENDING |

---

## Re-Anchor Pulse

**Status**: ASSURANCE_TOKEN_PASS — IAA-session-wave-ai-criteria-creation-fix-20260311-R2-PASS
**Tasks done**: 3 / 3
**Blockers**: None

