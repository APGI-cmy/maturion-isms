# ISMS P2 Runtime Supabase Persistence Hooks

Date: 2026-06-23
Evidence PR: #1834
Gate model: PR #1800 transition model; this artifact records implementation evidence and does not assert handover posture.

## Scope

P2 introduces the first runtime Supabase persistence hooks for ISMS while preserving the existing local/mock fallback posture.

This slice is deliberately narrow:

- adds an optional browser Supabase client factory for the ISMS portal;
- adds runtime persistence hooks for onboarding profile and maturity-roadmap handoff;
- keeps mock/local state as the active fallback when Supabase env or real Supabase auth is unavailable;
- updates the W6 persistence boundary registry to mark only appointed P2 hooks as `client_hook_ready`;
- keeps entitlement writes, free-assessment persistence, and audit writer invocation out of scope.

## Runtime surfaces wired

| Capability | Table | P2 behavior |
|---|---|---|
| `onboarding-profile` | `isms_onboarding_profiles` | Local fallback write plus Supabase insert when `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and a real Supabase auth user are available. |
| `maturity-handoff` | `isms_maturity_handoffs` | Local fallback write plus Supabase insert when Supabase runtime/auth requirements are available. |
| `entitlement-state` | `isms_entitlements` | Local fallback only. Runtime writes remain blocked because entitlement authority is not appointed and W6 RLS is select-only for entitlements. |

## Runtime constraints preserved

- No live AI provider call is introduced.
- No production auth/payment hardening is introduced.
- No production audit writer invocation is introduced.
- No Supabase Edge Function invocation is introduced.
- No entitlement authority or payment-derived entitlement writer is introduced.
- Supabase writes require a real Supabase-authenticated user, not the current mock auth user.

## Files changed

- `apps/isms-portal/package.json`
- `apps/isms-portal/src/lib/supabaseClient.ts`
- `apps/isms-portal/src/lib/runtimePersistence.ts`
- `apps/isms-portal/src/lib/runtimePersistence.test.ts`
- `apps/isms-portal/src/lib/persistenceBoundary.ts`
- `apps/isms-portal/src/lib/persistenceBoundary.test.ts`
- `apps/isms-portal/src/lib/handoff.ts`
- `apps/isms-portal/src/pages/Onboarding.tsx`
- `modules/isms/13-runtime/p2-runtime-supabase-persistence-hooks-20260623.md`

## Verification expectations

Expected PR checks:

- ISMS route verification passes.
- ISMS app build passes.
- Runtime persistence unit tests pass.
- Deployment preview may still treat Vercel preview protection as protection posture.

## Known limitations

- Local fallback remains active for mock-auth sessions.
- Supabase writes are conditional on real Supabase auth because W6 RLS policies require `auth.uid()`.
- Entitlement persistence remains local/mock until production entitlement authority is separately appointed.
- Audit writer invocation remains future-gated.

## Result

P2 opens the runtime persistence lane by wiring safe, conditional Supabase client hooks for onboarding context and maturity handoff data while preserving explicit boundaries for future auth, entitlement, assessment, and audit work.
