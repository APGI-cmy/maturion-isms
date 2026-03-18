# IAA Functional Behaviour Registry

**Agent**: independent-assurance-agent
**Version**: 1.2.0
**Last Updated**: 2026-03-18
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry captures post-merge behavioural failures — "niggles" — where a feature appeared
functionally wired and passed IAA review, but exhibited incorrect or incomplete behaviour from
the user's perspective after deployment. Each entry becomes a **permanent, mandatory check**
applied to all future BUILD PRs touching the relevant code area.

The contract is: **a niggle must never be missed twice.** Once a pattern is registered here,
IAA applies it as a blocking check at Step 3.1 for every relevant PR.

**IAA reads this file at Step 3.1 (FAIL-ONLY-ONCE learning check) for all BUILD/AAWP_MAT PRs.**
**FAIL-ONLY-ONCE Rule A-034 governs this registry.**

---

## How to Add an Entry

When a post-merge behavioural failure is identified:
1. Assign the next sequential ID (NBR-001, NBR-002, etc.)
2. Describe the symptom, root cause, and permanent check
3. Specify the code area / technology trigger so IAA can pattern-match to relevant PRs
4. Set status to ACTIVE

**Who can add entries**: IAA (self-governance), Foreman (wave reconciliation), CS2 (direct mandate).

---

## Registry Entries

### NBR-001 — TanStack Query: Mutation Does Not Invalidate Affected Query Cache

**Incident date**: (template — populate on first real incident)
**Last reviewed**: 2026-03-18 — confirmed template pattern; no real incident recorded yet
**Symptom**: User saves/updates a record. Save appears to succeed (no error shown). User navigates
away and returns. The old data is displayed — the list or detail view has not refreshed. The
mutation succeeded in the database but the cache was not invalidated, so the UI continues to
serve stale data.

**Root cause**: `useMutation` was implemented without an `onSuccess` or `onSettled` callback
that calls `queryClient.invalidateQueries([affected-query-key])`. The mutation succeeds but the
cache serving the related query is never told to refetch.

**Code area trigger**: Any PR that introduces or modifies a `useMutation` call (TanStack Query /
React Query) in combination with a query that reads the same data entity.

**Permanent check**:
> NBR-001: For every `useMutation` call in the PR diff:
> 1. Identify the data entity being mutated (table name / resource type).
> 2. Locate all `useQuery`/`useInfiniteQuery` calls that read the same entity.
> 3. Verify that the mutation's `onSuccess` or `onSettled` callback calls
>    `queryClient.invalidateQueries` with a key covering the affected query.
> 4. If any mutation is missing invalidation for a related query → REJECTION-PACKAGE.
> Evidence: cite the mutation file/line and the missing `invalidateQueries` call.

**Status**: ACTIVE — applies to all PRs containing TanStack Query mutations

---

### NBR-002 — Supabase: RLS Policy Allows Read but Silently Blocks Write for Non-Owner

**Incident date**: (template — populate on first real incident)
**Last reviewed**: 2026-03-18 — confirmed template pattern; no real incident recorded yet
**Symptom**: User successfully loads data (read works). User submits a form or triggers a mutation.
The operation appears to complete (no visible error, or a generic "something went wrong"). Data is
not saved. No error is surfaced in the UI because the Supabase client returns an empty result
rather than a thrown exception for RLS-blocked writes.

**Root cause**: The Supabase table has an INSERT/UPDATE/DELETE RLS policy that only permits the
row owner or a specific role. A user in a different role (e.g., viewer vs. editor) can read the
data but the write is silently blocked by the RLS policy. The application code does not check the
return value of the write operation for null/empty rows affected.

**Code area trigger**: Any PR that introduces or modifies a Supabase INSERT, UPDATE, or DELETE
operation, OR modifies RLS policies on a table that has both read and write flows.

**Permanent check**:
> NBR-002: For every Supabase write operation (INSERT/UPDATE/DELETE) in the PR diff:
> 1. Identify the target table.
> 2. Locate the RLS policies for that table (in the relevant migration file).
> 3. Verify that the application code checks the result of the write for errors or empty response.
> 4. Verify the RLS write policy covers all roles that are expected to write.
> 5. If any role expected to write is not covered by an RLS write policy → REJECTION-PACKAGE.
> 6. If the write operation does not check for RLS-blocked response → REJECTION-PACKAGE.
> Evidence: cite the RLS policy file, the write operation, and any missing check.

**Status**: ACTIVE — applies to all PRs containing Supabase write operations

---

### NBR-003 — Zustand Store: State Not Reset Between User Sessions or Route Transitions

**Incident date**: (template — populate on first real incident)
**Last reviewed**: 2026-03-18 — confirmed template pattern; no real incident recorded yet
**Symptom**: User completes a flow (e.g., completes a wizard, submits a form, logs out). User
navigates to a different resource or starts a new session. The Zustand store retains state from
the previous interaction. The new resource shows data from the previous one (store leakage),
or the new session starts with pre-populated fields.

**Root cause**: Zustand store is initialised once at module level and persists across route
changes. The store slice for a given flow was not reset at the correct lifecycle point
(route exit, resource change, session end).

**Code area trigger**: Any PR that introduces or modifies a Zustand store slice used in a
multi-step flow, wizard, form, or resource-scoped view.

**Permanent check**:
> NBR-003: For every Zustand store slice introduced or modified in the PR diff:
> 1. Identify the lifecycle scope of the store (per-route, per-resource, per-session, global).
> 2. Locate where the store is reset or re-initialised when the scope changes.
> 3. Verify there is an explicit `reset` action or `useEffect` cleanup that clears the store
>    when the user navigates away from the scope (route unmount, resource change, logout).
> 4. If no reset mechanism exists for a scoped store → REJECTION-PACKAGE.
> Evidence: cite the store slice, the scope, and the missing reset location.

**Status**: ACTIVE — applies to all PRs containing Zustand store changes in scoped flows

---

### NBR-004 — Optimistic Update Not Rolled Back on Mutation Error

**Incident date**: (template — populate on first real incident)
**Last reviewed**: 2026-03-18 — confirmed template pattern; no real incident recorded yet
**Symptom**: User performs an action (e.g., deletes a record, reorders items). The UI immediately
updates to reflect the expected outcome (optimistic update). The server request fails. The UI
does not revert — the user now sees a state that does not match the database.

**Root cause**: `useMutation` was implemented with an `onMutate` optimistic update callback but
without a corresponding `onError` callback that calls `queryClient.setQueryData` to revert the
cache to the snapshot taken in `onMutate`.

**Code area trigger**: Any PR that implements optimistic updates using TanStack Query `useMutation`
with an `onMutate` callback.

**Permanent check**:
> NBR-004: For every `useMutation` with an `onMutate` callback in the PR diff:
> 1. Verify `onMutate` takes a snapshot: `const previous = queryClient.getQueryData(key)`.
> 2. Verify `onError` is present and calls `queryClient.setQueryData(key, previous)`.
> 3. Verify `onSettled` calls `queryClient.invalidateQueries(key)` to sync server state.
> 4. If any of these three are missing → REJECTION-PACKAGE.
> Evidence: cite the mutation and the missing callback.

**Status**: ACTIVE — applies to all PRs containing optimistic mutations

---

### NBR-005 — Schema Migration: Column Mismatch Silently Masked by Try/Catch in Write Path

**Incident date**: 2026-03-08
**Wave reference**: wave-audit-log-column-fix (INC-ALCF-001)
**Symptom**: A schema migration was merged that created a table without the columns the application
code expected. The application's audit log write path was wrapped in a broad `try/catch` block.
When the INSERT failed due to the missing columns (`user_id`, `resource_type`, `resource_id`;
`organisation_id NOT NULL` constraint omitted), the error was swallowed silently. Audit logs
stopped being written entirely with no visible UI error or console warning to the user.
Post-merge, the system appeared to function correctly for all business flows — the silent failure
was only discovered during a separate liveness investigation.

**Root cause**: Two compounding failures:
1. The migration created the `audit_logs` table with a schema that did not match the columns
   referenced in the application INSERT statement (INC-ALCF-001 column set mismatch).
2. The application INSERT was inside a `try { ... } catch { /* ignored */ }` block. When the
   INSERT failed, the error was discarded, and the calling code continued as if the write had
   succeeded.

**Code area trigger**: Any PR that:
- Introduces or modifies a database schema migration **AND** touches the corresponding
  application write path for that table, OR
- Wraps a database write operation (Supabase INSERT/UPDATE/DELETE) in a `try/catch` block
  without re-throwing or at minimum logging the error.

**Permanent check**:
> NBR-005: For every schema migration in the PR diff:
> 1. Identify the table(s) being created or altered.
> 2. Search the application code for all INSERT/UPDATE/DELETE statements targeting those tables.
> 3. Verify that every column referenced in the application code exists in the migration
>    (column name must match exactly — case-sensitive).
> 4. Verify that all NOT NULL columns in the migration are provided in the application INSERT.
> 5. For every Supabase write in the PR diff wrapped in `try/catch`: verify the `catch` block
>    either re-throws, calls a monitoring function, or at minimum `console.error`s the failure.
>    A `catch` that silently discards the error → REJECTION-PACKAGE.
> 6. If any column mismatch or silent-catch pattern is found → REJECTION-PACKAGE.
> Evidence: cite the migration file, the application INSERT, and the column diff.

**Status**: ACTIVE — applies to all PRs containing schema migrations paired with application writes

---

## NBR Aging Policy

Template entries (those with `Incident date: (template — ...)`) are **preventive patterns**
registered before any real incident occurs. They do not age out. Update the incident date only
when a confirmed real incident matching the pattern is recorded — then replace the template
placeholder with the actual date and add a wave reference.

For **real incident entries** (those with a concrete date, e.g., NBR-005), the `Last reviewed`
field should be updated during every wave reconciliation checklist execution. If a real-incident
NBR entry has not been reviewed in more than 90 days, the Foreman wave reconciliation checklist
(Section B) should flag it for reassessment and update the `Last reviewed` date.

**Review schedule**: At minimum once per wave close, via the wave reconciliation checklist
(`.agent-workspace/foreman-v2/knowledge/wave-reconciliation-checklist.md` Section B).

---

## Next Sequential ID

**NBR-006** — reserve for next registered incident.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-17 | Initial registry with 4 template entries (NBR-001 through NBR-004) covering TanStack Query cache invalidation, Supabase RLS silent write block, Zustand store leakage, and optimistic update rollback — CS2 IAA functional behaviour strengthening mandate |
| 1.1.0 | 2026-03-18 | NBR-005 added — Schema migration column mismatch silently masked by try/catch; triggered by INC-ALCF-001 (wave-audit-log-column-fix 2026-03-08); wave 19/20 retrospective CS2 mandate (issue #[wave-19-20-retro], PR #1142 review) |
| 1.2.0 | 2026-03-18 | NBR-AGING-001 follow-up — added Last reviewed field to NBR-001–004 (confirmed templates); added NBR Aging Policy section with 90-day review cycle for real incident entries; cross-reference to wave-reconciliation-checklist.md Section B |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**Governed by**: FAIL-ONLY-ONCE Rule A-034
**Read at**: IAA Phase 3 Step 3.1 (BUILD/AAWP_MAT PRs only)
