# Wave Current Tasks — harden-deploy-mmm-supabase-migrations-20260427

**Foreman**: foreman-v2-agent v6.2.0
**Wave**: harden-deploy-mmm-supabase-migrations-20260427
**Issue**: maturion-isms — "Foreman: harden Deploy MMM Supabase Migrations workflow end-to-end until it passes"
**Branch**: copilot/harden-deploy-mmm-supabase-migrations
**Date**: 2026-04-27
**CS2 Authorization**: CONFIRMED — issue opened by CS2 (@APGI-cmy) in CS2-governed repository, foreman-v2-agent assigned
iaa_wave_record_path: .agent-admin/assurance/iaa-wave-record-harden-deploy-mmm-supabase-migrations-20260427.md
iaa_prebrief_status: COMPLETE — PRE-BRIEF committed SHA a548b39; CI_WORKFLOW category; D-001–D-005 active; SB-002 OPEN (evidence strategy declared)
ceremony_admin_appointed: NO

## Wave Purpose

Harden the Deploy MMM Supabase Migrations workflow end-to-end. Replace the failing `supabase link + supabase db push` mechanism (which prompts for DB password interactively) with the proven Management API approach already in use for cross-app migrations. Ensure the workflow runs fully non-interactively on GitHub-hosted runners.

## Current Wave Tasks

| # | Task | Agent | Status | Notes |
|---|------|-------|--------|-------|
| 1 | Phase 1 Preflight | foreman-v2-agent | 🟢 DONE | Identity, Tier 2, CANON_INVENTORY, sessions, FAIL-ONLY-ONCE v4.6.0, merge gates |
| 2 | wave-current-tasks.md | foreman-v2-agent | 🟢 DONE | This file |
| 3 | scope-declaration | foreman-v2-agent | 🟢 DONE | scope-declaration-wave-harden-deploy-mmm-supabase-migrations-20260427.md |
| 4 | IAA Pre-Brief | independent-assurance-agent | 🟢 DONE | PRE-BRIEF committed SHA a548b39; CI_WORKFLOW + D-001–D-005 active |
| 5 | SCOPE_DECLARATION.md update | foreman-v2-agent | 🟢 DONE | Cleared per A-029; wave-scoped |
| 6 | Implement workflow fix | api-builder | 🟢 DONE | SHAs 5db2734 (main fix) + b68e094 (comment fix); QP PASS |
| 7 | PREHANDOVER proof | foreman-v2-agent (no ECAP) | 🟢 DONE | .agent-workspace/foreman-v2/memory/PREHANDOVER-session-075-harden-deploy-mmm-supabase-migrations-20260427.md |
| 8 | Session memory | foreman-v2-agent (no ECAP) | 🟢 DONE | .agent-workspace/foreman-v2/memory/session-075-20260427.md |
| 9 | IAA Final Audit | independent-assurance-agent | 🔴 PENDING | Invoked after this commit |

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

## Wave Completion Gate

- [x] Phase 1 Preflight complete
- [x] IAA Pre-Brief complete — SHA a548b39
- [x] scope-declaration committed
- [x] SCOPE_DECLARATION.md updated
- [x] Workflow fix implemented (api-builder) — QP PASS
- [x] QP PASS
- [x] PREHANDOVER proof committed
- [x] Session memory committed
- [ ] IAA Final Audit ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED
