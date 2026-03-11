# Wave Current Tasks — foreman-v2-agent — wave-ai-criteria-creation-fix

**Wave**: wave-ai-criteria-creation-fix — Diagnostic Wave: Fix AI Criteria Creation Failure in MAT App
**Session**: session-wave-ai-criteria-creation-fix-20260311
**Date**: 2026-03-11
**Branch**: copilot/fix-ai-criteria-creation-failure
**Triggering Issue**: maturion-isms — "Diagnostic Wave: Fix AI Criteria Creation Failure in MAT App"
**CS2 Authorization**: Issue body states "CS2 note: Full authority granted for this diagnostic wave"; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` — COMMITTED (SHA 5478deb)

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

**Status**: IAA_PRE_BRIEF_PENDING → CLEAR_TO_DELEGATE (Pre-Brief committed SHA 5478deb)
**Tasks done**: 0 / 3
**Blockers**: None

