# Scope Declaration — fix-cwt-w9-11-fu-t-005-20260427

**Wave**: fix-cwt-w9-11-fu-t-005-20260427
**Issue**: maturion-isms#1476
**Branch**: copilot/fix-supabase-client-wiring
**Date**: 2026-04-27
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Reconcile stale CWT assertion W9.11-FU-T-005 in `feedback.supabase-wiring.test.ts`:
1. Flip W9.11-FU-T-005 from a blanket ban on SUPABASE_SERVICE_ROLE_KEY to confirming its
   presence — service-role is approved for the pending endpoint (auth enforced before
   listPending(); key is server-side only, never exposed to client/Vite/browser).
2. Retitle W9.11-FU-T-006 to clarify SUPABASE_ANON_KEY scope (bearer token verification).
3. Add W9.11-FU-T-007: source-inspection gate verifying Forbidden guard, x-arc-token check,
   and ARC_APPROVAL_TOKEN are all present before any privileged data access.

## Changed Files

- `api/ai/feedback.supabase-wiring.test.ts`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Any agent contract files (.github/agents/*.md)
- Any application code or schema migrations
- Any files not listed above
