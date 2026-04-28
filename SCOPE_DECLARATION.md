# Scope Declaration — fix-ai-gateway-cwt-listpending-source-anchor-20260428

**Wave**: fix-ai-gateway-cwt-listpending-source-anchor-20260428
**Issue**: maturion-isms#1488
**Branch**: cs2/fix-ai-gateway-cwt-listpending-source-anchor
**Date**: 2026-04-28
**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)

## Scope Decision

Fix the AI gateway Combined Wave Test source-inspection assertion for W9.11-FU-T-007 so it anchors privileged access ordering to the actual `pipeline.listPending(` call instead of the first textual `listPending(` occurrence, which may appear in comments before the Forbidden/auth guard.

## Changed Files

- `api/ai/feedback.supabase-wiring.test.ts`
- `SCOPE_DECLARATION.md`

## Out of Scope

- Runtime changes to `api/ai/feedback/pending.ts`
- Any Supabase schema or migration changes
- Any deployment workflow changes
- Any files not listed above
