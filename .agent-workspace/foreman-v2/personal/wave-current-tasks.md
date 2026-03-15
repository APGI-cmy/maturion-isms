# Wave Current Tasks — foreman-v2-agent — Wave 18

**Wave**: 18 — MAT Criteria Parsing Pipeline End-to-End Repair (LDCS Implementation)
**Session**: session-wave18-orchestration-20260315
**Date**: 2026-03-15
**Branch**: copilot/repair-mat-criteria-parsing-pipeline
**Triggering Issue**: maturion-isms#1114 — "Wave 18 Orchestration: MAT Criteria Parsing Pipeline End-to-End Repair — Governance-First, IAA-Ceremonial Gate (LDCS Implementation)"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and assigns foreman-v2-agent; constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md` — COMMITTED (SHA 70fcab7)

---

## Wave 18 Scope

Eight confirmed critical gaps in the MAT Criteria Upload → Parse → Review pipeline:

| # | Gap | Layer | Severity |
|---|-----|-------|----------|
| 1 | Upload fails: `Failed to upload file: Failed to fetch` — RLS/bucket/profile config | Frontend → Storage | 🔴 CRITICAL |
| 2 | `guidance` column receives `source_anchor` (page reference) — not guidance text | Edge Function write-back | 🔴 CRITICAL |
| 3 | `criteria` table has no `intent_statement` column | DB Schema | 🔴 CRITICAL |
| 4 | AI system prompt does not extract `intent_statement` or `guidance` as distinct fields | AI Gateway (parsing.py) | 🔴 CRITICAL |
| 5 | AI system prompt does not extract 5-level maturity descriptors per criterion | AI Gateway (parsing.py) | 🔴 HIGH |
| 6 | Descriptor tables exist but Edge Function never writes to them | Edge Function write-back | 🔴 HIGH |
| 7 | No Criteria Review/Approval screen | Frontend UX | 🔴 HIGH |
| 8 | `source_anchor` not stored separately — lost when repurposed as `guidance` | DB Schema | 🟡 MEDIUM |

---

## Tasks

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W18-000 | Phase 1 — Identity & Preflight complete | Foreman | COMPLETE ✅ |
| 2 | T-W18-001 | Create wave-current-tasks.md | Foreman | COMPLETE ✅ |
| 3 | T-W18-002 | Invoke IAA Pre-Brief | IAA | COMPLETE ✅ |
| 4 | T-W18-003 | Phase 2 — Alignment (CS2 auth, verb classification, architecture review) | Foreman | PENDING |
| 5 | T-W18-004 | Red QA suite: tests for all 8 gaps | qa-builder | PENDING |
| 6 | T-W18-005 | Schema migration: add `intent_statement`, `source_anchor` columns | schema-builder | PENDING |
| 7 | T-W18-006 | Fix upload RLS/bucket/profile config | schema-builder + api-builder | PENDING |
| 8 | T-W18-007 | Fix AI system prompt — add intent_statement, guidance, maturity descriptors extraction | api-builder (mat-specialist assist) | PENDING |
| 9 | T-W18-008 | Fix Edge Function write-back — guidance field, descriptor table writes | api-builder | PENDING |
| 10 | T-W18-009 | Frontend: Criteria Review/Approval screen | ui-builder | PENDING |
| 11 | T-W18-010 | Phase 4 handover: PREHANDOVER proof, session memory, IAA audit | Foreman + IAA | PENDING |
| 12 | T-W18-011 | Merge gate release | Foreman | PENDING |

---

## Re-Anchor Pulse

```yaml
status: ASSURANCE_TOKEN_PASS
wave: wave18-criteria-parsing-repair
session: session-wave18-orchestration-20260315
branch: copilot/repair-mat-criteria-parsing-pipeline
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md
last_updated: 2026-03-15
tasks_done: 12
tasks_total: 12
iaa_token: IAA-wave18-criteria-parsing-repair-20260315-PASS
iaa_token_file: .agent-admin/assurance/iaa-token-session-wave18-criteria-parsing-repair-20260315.md
```

---

# --- PRIOR WAVE RECORD (wave-cl-4-aimc-audit-phase-a) ARCHIVED BELOW ---

