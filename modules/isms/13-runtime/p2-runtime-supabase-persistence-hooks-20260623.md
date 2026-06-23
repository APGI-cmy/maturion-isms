# ISMS P2 Runtime Supabase Persistence Hooks

Date: 2026-06-23
Evidence PR: #1834
Gate model: PR #1800 transition model; this artifact records implementation evidence and does not assert handover posture.

## Scope

P2 introduces the first runtime persistence hooks for ISMS while preserving the existing local/mock fallback posture.

This slice is deliberately narrow:

- adds dependency-free Supabase runtime configuration detection for the ISMS portal;
- adds runtime persistence hooks for onboarding profile and maturity-roadmap handoff;
- keeps mock/local state as the active fallback when the authenticated Supabase session boundary is unavailable;
- updates the W6 persistence boundary registry to mark only appointed P2 hooks as `client_hook_ready`;
- keeps entitlement writes, free-assessment persistence, live Supabase writes, and audit writer invocation out of scope.

## Runtime surfaces wired

| Capability | Table | P2 behavior |
|---|---|---|
| `onboarding-profile` | `isms_onboarding_profiles` | Local fallback write plus a gated Supabase write adapter seam. The adapter currently skips writes until production auth hardening appoints the authenticated Supabase session boundary. |
| `maturity-handoff` | `isms_maturity_handoffs` | Local fallback write plus a gated Supabase write adapter seam. The adapter currently skips writes until production auth hardening appoints the authenticated Supabase session boundary. |
| `entitlement-state` | `isms_entitlements` | Local fallback only. Runtime writes remain blocked because entitlement authority is not appointed and W6 RLS is select-only for entitlements. |

## Runtime constraints preserved

- No live AI provider call is introduced.
- No production auth/payment hardening is introduced.
- No production audit writer invocation is introduced.
- No Supabase Edge Function invocation is introduced.
- No entitlement authority or payment-derived entitlement writer is introduced.
- No browser auth-token parser or unreviewed Supabase session extraction is introduced.
- Supabase writes remain gated until a real Supabase-authenticated session boundary is separately appointed.

## Files changed

- `.agent-admin/control/delegation-order.json`
- `.agent-admin/scope-declarations/pr-1834.md`
- `.agent-workspace/foreman-v2/memory/session-1834-isms-p2-runtime-persistence-hooks-20260623.md`
- `.functional-delivery/pr-1834.md`
- `apps/isms-portal/src/vite-env.d.ts`
- `apps/isms-portal/src/lib/supabaseClient.ts`
- `apps/isms-portal/src/lib/runtimePersistence.ts`
- `apps/isms-portal/src/lib/runtimePersistence.test.ts`
- `apps/isms-portal/src/lib/persistenceBoundary.ts`
- `apps/isms-portal/src/lib/persistenceBoundary.test.ts`
- `apps/isms-portal/src/lib/handoff.ts`
- `apps/isms-portal/src/lib/subscription.ts`
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
- Supabase writes are gated until a real Supabase auth boundary is separately appointed.
- Entitlement persistence remains local/mock until production entitlement authority is separately appointed.
- Audit writer invocation remains future-gated.

## Result

P2 opens the runtime persistence lane by wiring safe local fallback hooks and a dependency-free Supabase configuration/write-adapter seam for onboarding context and maturity handoff data while preserving explicit boundaries for future auth, entitlement, assessment, and audit work.
