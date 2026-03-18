# IAA Niggle Pattern Library — Stack & Integration Patterns

**Agent**: independent-assurance-agent
**Version**: 1.0.0
**Last Updated**: 2026-03-17
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This library catalogues stack-specific and integration-specific known failure patterns for the
Maturion ISMS technology stack (Next.js 14 App Router / Supabase / TanStack Query / Zustand /
TypeScript). Each pattern is a recurring class of defect that surfaces as a working-but-wrong
feature — it passes CI but fails the user.

IAA applies relevant patterns from this library at Step 3.1 for every BUILD/AAWP_MAT PR.
**FAIL-ONLY-ONCE Rule A-035 governs this library.**

---

## How to Use

1. IAA identifies which technology areas the PR touches (by scanning imports, filenames, hooks used).
2. For each relevant section below, IAA applies listed pattern checks to the PR diff.
3. A matched but failing pattern → REJECTION-PACKAGE citing the Pattern ID and code location.

---

## Section 1: TanStack Query (React Query) Patterns

### NP-TQ-001 — Query Key Scope Too Broad

**Symptom**: Saving record A invalidates the cache for record B (unrelated refetch storm). Or,
saving record A only invalidates A but not the list query that shows A in context.

**When to check**: Any PR touching `useQuery`, `useInfiniteQuery`, or `invalidateQueries`.

**Check**:
> NP-TQ-001: For every `queryClient.invalidateQueries(key)` call: verify the key is scoped
> appropriately — broad enough to refresh all affected consumers, narrow enough not to
> invalidate unrelated queries. Verify list queries that display the mutated entity are included.
> If list query key is missing from invalidation → REJECTION-PACKAGE.

---

### NP-TQ-002 — Stale Time / Cache Time Misconfiguration

**Symptom**: Data shows as fresh when it is stale (staleTime too long), or excessive network
requests for data that rarely changes (staleTime too short / 0 on static lookups).

**When to check**: Any PR that introduces a `useQuery` with custom `staleTime` or `gcTime`.

**Check**:
> NP-TQ-002: For every `useQuery` with custom `staleTime`/`gcTime`: verify the value is
> appropriate for the data volatility. Real-time data (scores, statuses): staleTime ≤ 30s.
> Slow-changing reference data (org settings, criteria): staleTime ≥ 5min. If the value
> appears inverted (long staleTime for volatile data) → flag as advisory with suggested value.

---

### NP-TQ-003 — Missing Error State in Query Consumer

**Symptom**: Query fails (network error, RLS block, 500). The component renders nothing or
renders a blank space — no error message, no retry button, no user guidance.

**When to check**: Any PR that introduces a `useQuery` result consumer in a component.

**Check**:
> NP-TQ-003: For every `useQuery` result destructured in a component: verify `isError`/`error`
> state is handled with a visible user-facing message or fallback. If `error` is not handled
> in the component render → REJECTION-PACKAGE.

---

### NP-TQ-004 — Query Enabled Flag Not Dependent on Required Data

**Symptom**: Query fires before required data (e.g., auth user, organisation ID) is available.
Results in a query with `undefined` parameters, returns wrong data or 400/RLS errors.

**When to check**: Any PR introducing a query that depends on auth state or URL params.

**Check**:
> NP-TQ-004: For every `useQuery` that uses auth.user, organisation_id, or URL params as part
> of the query key or query function arguments: verify `enabled` is set to a boolean that is
> `false` when the dependency is undefined/null. Example: `enabled: !!userId`.
> If missing `enabled` guard → REJECTION-PACKAGE.

---

## Section 2: Supabase Patterns

### NP-SB-001 — RLS Policy Missing for New Table Role Combination

**Symptom**: Feature works for admin/owner but silently fails or returns empty for
regular users — no error surfaced, just empty state or "no data found".

**When to check**: Any PR introducing a new table or new user role interaction with an existing table.

**Check**:
> NP-SB-001: For every new or modified Supabase table in the PR:
> List all roles expected to interact with the table (authenticated, anon, service_role).
> For each role: verify SELECT/INSERT/UPDATE/DELETE policies exist where required.
> Cross-check with the application code to confirm which operations each role performs.
> Any missing policy for an application-level operation → REJECTION-PACKAGE.

---

### NP-SB-002 — Storage Bucket Policy Missing or Overly Permissive

**Symptom**: Files cannot be uploaded by legitimate users (missing INSERT policy), OR files
from one org are accessible by another org (missing org-scoped path restriction).

**When to check**: Any PR introducing storage bucket operations (`supabase.storage.from(...)`).

**Check**:
> NP-SB-002: For every storage bucket operation in the PR:
> 1. Verify the bucket has INSERT/SELECT/DELETE policies appropriate for the user role.
> 2. Verify the path convention includes org-scoping: `/{organisation_id}/...`
> 3. Verify the RLS policy checks `split_part(name,'/',1) = profiles.organisation_id`.
> If org-scoping is absent or policy is missing → REJECTION-PACKAGE.

---

### NP-SB-003 — Supabase Realtime Subscription Not Cleaned Up

**Symptom**: Multiple subscriptions accumulate on re-renders or route transitions. Events
fire multiple times, causing duplicate UI updates or memory leaks.

**When to check**: Any PR using `supabase.channel().on().subscribe()`.

**Check**:
> NP-SB-003: For every Supabase realtime subscription:
> Verify the `useEffect` that creates the subscription returns a cleanup function that calls
> `supabase.removeChannel(channel)` or `subscription.unsubscribe()`.
> Missing cleanup → REJECTION-PACKAGE.

---

### NP-SB-004 — Auth State Race Condition on Route Guard

**Symptom**: Protected page briefly renders before redirect to login (flash of unauthorised content),
OR redirect happens even for authenticated users because `session` is null on first render.

**When to check**: Any PR implementing route guards or conditional render based on auth session.

**Check**:
> NP-SB-004: For every route guard or auth-conditional render:
> Verify a `loading` state is handled while auth state is being resolved.
> Pattern: `if (loading) return <Spinner />` before the `if (!user) redirect(...)` check.
> Missing loading guard → flag as advisory (flash) or REJECTION-PACKAGE if auth bypass possible.

---

## Section 3: Zustand Patterns

### NP-ZU-001 — Store Slice Persisted to localStorage for Sensitive Data

**Symptom**: Sensitive data (user identity, org-specific config, auth tokens) persisted to
`localStorage` via Zustand `persist` middleware. Data survives logout or browser refresh,
leaks between accounts on shared devices.

**When to check**: Any PR using Zustand `persist` middleware.

**Check**:
> NP-ZU-001: For every Zustand store slice using `persist` middleware:
> Verify no sensitive data (tokens, user IDs, org data, personal information) is in the
> persisted state. Verify `partialize` is used to explicitly whitelist persisted keys.
> Persisting auth tokens or org-specific data → REJECTION-PACKAGE.

---

### NP-ZU-002 — Store Action Missing Error State Reset

**Symptom**: User submits form → error. User fixes the error and submits again → old error
message still shows even though the second submission succeeds. Store error state not cleared
at the start of a new action.

**When to check**: Any PR introducing a Zustand action that sets an error state.

**Check**:
> NP-ZU-002: For every Zustand action that sets `error` or `errorMessage`:
> Verify the action first clears the error state at the start of execution:
> `set({ error: null, isLoading: true })` before async operations.
> If error is only set on failure but never cleared at action start → REJECTION-PACKAGE.

---

## Section 4: Next.js App Router Patterns

### NP-NX-001 — Server Component Data Fetch Not Revalidated

**Symptom**: Server Component fetches data from Supabase. Data is cached at request level.
After a mutation, navigating back to the server-component page shows stale data because
Next.js cached the page-level fetch.

**When to check**: Any PR using server-side Supabase data fetches in App Router Server Components.

**Check**:
> NP-NX-001: For every Supabase fetch in a Server Component:
> Verify `cache: 'no-store'` is set on the fetch, OR `revalidatePath`/`revalidateTag` is
> called in the mutation action. If neither is present → REJECTION-PACKAGE.

---

### NP-NX-002 — Client Component Using `useRouter` Without Awaiting Navigation

**Symptom**: User clicks a button that navigates AND updates state. The state update fires
after navigation, causing a React state update on an unmounted component warning, or the
navigation state is inconsistent.

**When to check**: Any PR using `useRouter().push()` in combination with state updates.

**Check**:
> NP-NX-002: For every `router.push()` call combined with state updates in the same handler:
> Verify state updates that must complete before navigation are `await`-ed or sequenced
> correctly. If `setState` and `router.push` fire in the same synchronous block without
> explicit ordering → flag as advisory with suggested fix.

---

## Section 5: TypeScript / General Code Quality Patterns

### NP-TS-001 — Type Assertion Masking Runtime Type Mismatch

**Symptom**: `as SomeType` cast used to silence TypeScript error. At runtime the actual
data shape does not match `SomeType`. Causes silent undefined access, missing field errors,
or incorrect rendering.

**When to check**: Any PR introducing `as` type assertions.

**Check**:
> NP-TS-001: For every `as Type` cast in the PR diff:
> Verify it is not masking a genuine type mismatch. Acceptable: narrowing after a runtime
> check (`if (typeof x === 'string') return x as string`). Unacceptable: `apiResponse as UserProfile`
> without validation. Any unsafe cast without runtime validation → REJECTION-PACKAGE.

---

### NP-TS-002 — Silent Error Swallow in Try/Catch

**Symptom**: Operation fails. No error surfaces to the user. Developer sees a blank state.
The `catch` block logs to console (invisible in production) or does nothing.

**When to check**: Any PR introducing `try/catch` blocks in user-facing code paths.

**Check**:
> NP-TS-002: For every `catch` block in user-facing code paths:
> Verify the catch block either: (a) sets an error state visible to the user, OR
> (b) propagates the error up the call stack. `console.log` or `console.error` alone
> in a catch block that produces no user-visible feedback → REJECTION-PACKAGE.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-17 | Initial library — 5 sections covering TanStack Query (NP-TQ-001 through NP-TQ-004), Supabase (NP-SB-001 through NP-SB-004), Zustand (NP-ZU-001, NP-ZU-002), Next.js App Router (NP-NX-001, NP-NX-002), TypeScript/general (NP-TS-001, NP-TS-002) — CS2 IAA functional behaviour strengthening mandate |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Governed by**: FAIL-ONLY-ONCE Rule A-035
**Read at**: IAA Phase 3 Step 3.1 (BUILD/AAWP_MAT PRs — identify relevant sections by technology area)
