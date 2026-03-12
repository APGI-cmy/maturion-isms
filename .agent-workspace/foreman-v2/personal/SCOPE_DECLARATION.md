# SCOPE DECLARATION — wave17-user-guided-parsing

**Wave**: 17 — User-Guided AI Parsing Instruction System
**Branch**: copilot/implement-user-guided-ai-parsing
**Date**: 2026-03-11
**Fresh overwrite**: YES (per A-029)

## Files Modified (git diff origin/main...HEAD --name-only)

| File | Type | Justification |
|------|------|---------------|
| `apps/maturion-maturity-legacy/supabase/migrations/20260311000002_wave17_parsing_instructions.sql` | Schema migration | Batch A — adds parsing_instructions column + parsing_instruction_templates table + RLS + seed |
| `apps/mat-ai-gateway/services/parsing.py` | AI Gateway | Batch B — ParseRequest.user_instructions, _SYSTEM_PROMPT rewrite, _call_gpt4_turbo update |
| `supabase/functions/invoke-ai-parse-criteria/index.ts` | Edge Function | Batch C — user_instructions forwarding + DB storage; also TODO→tracked comment fix |
| `modules/mat/frontend/src/components/criteria/ParsingInstructionsModal.tsx` | UI component (new) | Batch D — new modal component |
| `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | UI component | Batch D — modal integration + pending parse state |
| `modules/mat/frontend/src/lib/hooks/useCriteria.ts` | Frontend hook | Batch D — useTriggerAIParsing user_instructions |
| `modules/mat/tests/wave17/wave17-parsing-instructions.test.ts` | QA tests (new) | Batch E — T-W17-QA-001 through T-W17-QA-012 |
| `.agent-admin/assurance/iaa-prebrief-wave17-user-guided-parsing.md` | IAA governance artifact | PRE-BRIEF — written by IAA agent |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave17-orchestration-20260311.md` | Foreman memory | PHASE 4 — PREHANDOVER proof artifact |
| `.agent-workspace/foreman-v2/memory/session-wave17-orchestration-20260311.md` | Foreman memory | PHASE 4 — session memory artifact |
| `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | Foreman parking station | GOVERNANCE — improvement suggestion appended |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance personal | GOVERNANCE — wave task register updated to Wave 17 |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance personal | GOVERNANCE — this file (scope declaration for A-026/A-028) |

## Out of Scope

- No `.github/agents/` files (A-013 — N/A)
- No `.github/workflows/` files (no CI changes)
- No changes to core migration files from prior waves


## Files Modified (git diff origin/main...HEAD --name-only)

| File | Type | Justification |
|------|------|---------------|
| `apps/maturion-maturity-legacy/supabase/migrations/20260311000001_criteria_add_title_column.sql` | Schema migration | PRIMARY FIX — adds `title TEXT` to criteria table; drops NOT NULL on description |
| `modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts` | QA tests | RED→GREEN gate — T-W17-CP-001 through T-W17-CP-005 |
| `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` | IAA governance artifact | PRE-BRIEF — written by IAA agent |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Governance knowledge | GOVERNANCE — INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 REMEDIATED; version bumped to 3.9.0 |
| `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-ai-criteria-creation-fix-20260311.md` | Foreman memory | PHASE 4 — PREHANDOVER proof artifact |
| `.agent-workspace/foreman-v2/memory/session-wave-ai-criteria-creation-fix-20260311.md` | Foreman memory | PHASE 4 — session memory artifact |
| `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | Foreman parking station | GOVERNANCE — improvement suggestion S-WAVE-AI-CRITERIA-001 appended |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance personal | GOVERNANCE — wave task register (current wave) |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Governance personal | GOVERNANCE — this file (scope declaration for A-026/A-028) |

## Out of Scope

- No `.github/agents/` files (A-013 — N/A)
- No `.github/workflows/` files (no CI changes)
- No frontend product code (modules/mat/frontend/)
- No Edge Function code changes (code already correct, schema was missing)
