# MMM AI Linkage Validation Matrix — MPS / Intent / Criteria

## Objective
Validate runtime linkage from MMM domain workflow surfaces to Maturion AI paths with deterministic fallback behavior.

## Matrix

| Stage | UI/Hook | Primary Route | Required Context | Fallback |
|---|---|---|---|---|
| MPS generation | `useAIMPSGeneration` | `mmm-ai-chat-user` | `workflow_stage=mps_generation`, `domain_name` | Legacy blueprint MPS pack |
| Intent generation | `useIntentGeneration` | `mmm-ai-chat-user` | `workflow_stage=intent_generation`, `domain_name`, `mps_code` | Deterministic intent draft |
| Criteria generation | `CriteriaManagement.handleGenerate` | `mmm-ai-chat-user` | `workflow_stage=criteria_generation`, `domain_name`, `mps_code` | Deterministic 3-item criteria draft |

## Validation Gates

- `T-MMM-S6-199`: MPS generation uses user-scoped AI endpoint + fallback pack.
- `T-MMM-S6-200`: Intent generation uses user-scoped AI endpoint + fallback intent draft.
- `T-MMM-S6-201`: Criteria generation uses user-scoped AI endpoint + fallback criteria draft.

## Runtime Validation Evidence (2026-05-26)

| Probe | Endpoint | Result | Status |
|---|---|---|---|
| Deploy surface exists | `mmm-ai-chat-user` | Function deployed (no longer `NOT_FOUND`) | PASS |
| Deploy surface exists | `mmm-subject-knowledge-migrate-legacy` | Function deployed (no longer `NOT_FOUND`) | PASS |
| Auth guard behavior | `mmm-ai-chat-user` with anon token | `401 Invalid or expired JWT` | PASS (expected) |
| Auth guard behavior | `mmm-subject-knowledge-list` with anon token | `401 Invalid or expired JWT` | PASS (expected) |
| Migration precondition | `mmm-subject-knowledge-migrate-legacy` | `500 LEGACY_SUPABASE_URL and LEGACY_SUPABASE_SERVICE_ROLE_KEY are required` | BLOCKED (secrets missing) |

### Current Blocker
- Legacy migration cannot run until project secrets are set:
  - `LEGACY_SUPABASE_URL`
  - `LEGACY_SUPABASE_SERVICE_ROLE_KEY`

### Operator Commands
- Deploy functions:
  - `supabase functions deploy mmm-ai-chat-user --project-ref ujucvyyspfxlxlfdamda`
  - `supabase functions deploy mmm-subject-knowledge-migrate-legacy --project-ref ujucvyyspfxlxlfdamda`
- Set missing secrets:
  - `pnpm supabase:mmm:set-secrets -- -ProjectRef ujucvyyspfxlxlfdamda -LegacySupabaseUrl "<url>" -LegacySupabaseServiceRoleKey "<key>"`
- Validate matrix:
  - `pnpm supabase:mmm:validate-ai-linkage -- -SupabaseUrl "https://ujucvyyspfxlxlfdamda.supabase.co" -AnonKey "<anon>"`
