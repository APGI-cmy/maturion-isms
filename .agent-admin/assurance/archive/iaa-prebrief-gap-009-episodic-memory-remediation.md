# IAA Pre-Brief — Wave: gap-009-episodic-memory-remediation

**Artifact type**: IAA Pre-Brief (Phase 0)
**Wave**: gap-009-episodic-memory-remediation
**Branch**: copilot/gap-009-wire-supabase-insert
**Issue**: maturion-isms#1274
**Pre-Brief date**: 2026-04-07
**IAA version**: 6.2.0
**Adoption phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Step 0.2 — Wave Task Extraction

Wave `gap-009-episodic-memory-remediation` contains one qualifying build task derived from
CL-11-D4 finding F-D4-001 (audit commissioned under maturion-isms#1221, wave mmm-mat-harvest-20260405).

> **Note**: `wave-current-tasks.md` on the branch reflects a prior wave
> (wave-mmm-pre-impl-orchestration-20260407). This Pre-Brief is issued for the
> gap-009-episodic-memory-remediation wave declared in the issue and branch.
> IAA Pre-Brief is keyed to the issue and branch — not to the prior wave file.

---

## Step 0.3 — Task Classification

### Task T-01 — Wire Supabase INSERT to `ai_episodic_events` in `EpisodicMemoryAdapter`

| Field | Value |
|-------|-------|
| `task_id` | T-01 |
| `task_summary` | Replace `this.store.push()` in `EpisodicMemoryAdapter.record()` with a Supabase INSERT to `ai_episodic_events`; add `app.current_organisation_id` RLS setting call; retain constructor guard; update tests to inject mock Supabase client and assert DB writes |
| `source_files` | `packages/ai-centre/src/memory/EpisodicMemoryAdapter.ts`, `packages/ai-centre/src/__tests__/memory/EpisodicMemoryAdapter.test.ts` |
| `references` | CL-11-D4 F-D4-001 · GRS-009 · APS §7.6 · AAD §9.4 · migration `004_ai_episodic_memory.sql` |
| `iaa_trigger_category` | **AAWP_MAT** — `packages/ai-centre/` path pattern matches AAWP_MAT trigger; PR delivers executable application behaviour (Supabase write path + test wiring) |
| `iaa_required` | **YES — MANDATORY** |
| `qualifying` | YES |

No other tasks declared in this wave. No agent contract, canon, CI/workflow, or governance
integrity files are in scope.

---

## Step 0.4 — Qualifying Task: Pre-Brief Declarations

### T-01: IAA Trigger Category

**Category**: `AAWP_MAT`

**Trigger justification**:
- Files in `packages/ai-centre/src/memory/` and `packages/ai-centre/src/__tests__/memory/`
  match the AAWP/MAT path pattern (`packages/ai-centre/`)
- The change delivers executable application behaviour: replacing an in-memory stub with
  a live Supabase write path is a production data persistence change
- RLS enforcement and organisation-scoped tenant isolation (GRS-009) are safety-critical concerns

---

### T-01: Required Phases at IAA Handover Invocation

| Phase | Required | Notes |
|-------|----------|-------|
| Phase 2 — Alignment | YES | PR category classification, independence check |
| Phase 3 — Assurance Work | YES | Core invariants + AAWP_MAT overlay + BD-000 user journey trace + FUNCTIONAL-BEHAVIOUR-REGISTRY |
| Phase 4 — Merge Gate Parity + Verdict | YES | Binary ASSURANCE-TOKEN / REJECTION-PACKAGE |

---

### T-01: Required Evidence Artifacts (PREHANDOVER bundle)

The builder must produce ALL of the following before invoking IAA at handover:

| Artifact | Path | Required |
|----------|------|----------|
| PREHANDOVER proof | Root-level `PREHANDOVER_PROOF_GAP_009_SUPABASE_INSERT.md` or equivalent | MANDATORY |
| Session memory | `.agent-workspace/<builder-agent-id>/memory/session-NNN-YYYYMMDD.md` | MANDATORY |
| Dedicated IAA token file | `.agent-admin/assurance/iaa-token-session-NNN-wave-gap-009-20260407.md` | Written BY IAA post-verdict |
| IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-gap-009-episodic-memory-remediation.md` | PRESENT (this artifact) |
| SCOPE_DECLARATION.md | Root `SCOPE_DECLARATION.md` updated to list only this PR's changed files | MANDATORY |

**PREHANDOVER proof required fields** (per §4.3b / A-029):
- `wave:` gap-009-episodic-memory-remediation
- `branch:` copilot/gap-009-wire-supabase-insert
- `issue:` maturion-isms#1274
- `iaa_audit_token:` pre-populated as `IAA-session-NNN-wave-gap-009-20260407-PASS` (expected reference format — not PENDING)
- `session_memory:` path to session memory file on branch
- User journey declaration (see BD-000 below)
- CI check run URL or evidence confirming tests pass GREEN post-implementation

---

### T-01: Applicable Overlays

| Overlay | Applies | Reason |
|---------|---------|--------|
| AAWP_MAT / Build Overlay (BD-000 through BD-xxx) | YES | Behaviour-changing diff — Supabase write path wired |
| BD-000 User Journey Trace | YES — BLOCKING | record() now writes to DB; retrieve() must read from DB; user-visible behaviour changes |
| OVL-INJ-001 Pre-Brief Artifact Existence | YES | Covered by this artifact |
| FUNCTIONAL-BEHAVIOUR-REGISTRY (A-034) | YES | BUILD PR touching Supabase operations |
| Niggle Pattern Library (A-035) | YES | Supabase RLS gotchas directly relevant |
| CORE-023 Workflow Integrity Ripple | ASSESS AT HANDOVER | Test file changes may affect CI test runner workflow paths |

---

### T-01: Specific Rules and Scope Blockers

#### SB-001 — S-QA-001: Tests Must Go RED Before Going GREEN (Cited in Issue)

The issue explicitly calls out S-QA-001: the existing tests currently pass GREEN against the
in-memory violation. The QA-to-Red phase requires the builder to **update tests first** so
they fail RED against the in-memory implementation (injecting a mock Supabase client and
asserting DB writes), then implement Supabase wiring to turn them GREEN.

IAA at handover MUST verify:
- Tests inject a mock Supabase client (not `new EpisodicMemoryAdapter()` with no args)
- Tests assert that the mock's `.from('ai_episodic_events').insert(...)` was called
- Tests do NOT rely on in-memory state (`this.store`) for assertions

**If tests still pass against in-memory implementation without a mock client → REJECTION-PACKAGE.**

---

#### SB-002 — Schema Column Completeness (F-D4-002)

The issue brief lists `organisation_id / summary / full_context` as the schema columns. The
actual `ai_episodic_events` migration (`004_ai_episodic_memory.sql`) defines:

| Column | Constraint |
|--------|-----------|
| `id` | UUID, auto-generated |
| `organisation_id` | TEXT NOT NULL |
| `session_id` | TEXT (nullable) |
| `user_id` | TEXT (nullable) |
| `agent_id` | TEXT (nullable) |
| `event_type` | TEXT **NOT NULL** |
| `capability` | TEXT **NOT NULL** — CHECK (capability IN ('advisory','analysis','embeddings','document-generation','image-generation','deep-search','video-generation','algorithm-execution')) |
| `summary` | TEXT (nullable) |
| `full_context` | TEXT (nullable) |
| `created_at` | TIMESTAMPTZ NOT NULL DEFAULT now() |
| `redacted_at` / `redacted_by` / `redaction_reason` | Nullable soft-redaction |

**Builder must map ALL NOT NULL columns in the INSERT.** Missing `event_type` or `capability`
in the INSERT will produce a DB constraint violation at runtime. The `capability` value must
match one of the 8 CHECK constraint values — it cannot be an arbitrary string.

IAA at handover MUST verify the INSERT statement includes `event_type` and `capability`
with constraint-compliant values mapped from `EpisodicEventEntry`.

---

#### SB-003 — RLS Setting Call Must Precede INSERT (GRS-009)

The `ai_episodic_events_insert_org_scope` RLS policy enforces:

```sql
WITH CHECK (organisation_id = current_setting('app.current_organisation_id', true))
```

The `app.current_organisation_id` Postgres setting must be set on the connection/transaction
before the INSERT executes. The issue specifies using Supabase's `rpc()` or connection-level
setting call.

IAA at handover MUST verify that the `app.current_organisation_id` setting call is present
and executed **before** the `.insert()` call in `record()`. An INSERT without this setting
will be silently rejected by the RLS policy (no error raised — row simply not inserted).
This is a silent failure mode (see A-035 Supabase RLS gotchas).

---

#### SB-004 — `retrieve()` Must Also Be Updated (Supabase SELECT)

The current `retrieve()` method uses `this.store.filter(...)` for tenant isolation.
Once `record()` is wired to Supabase, `retrieve()` must also be updated to query
`ai_episodic_events` via Supabase SELECT with `.eq('organisation_id', params.organisationId)`.

An implementation that wires `record()` to Supabase but leaves `retrieve()` reading from
`this.store` is a broken half-implementation — retrieve will always return empty after
the in-memory store is removed.

IAA at handover MUST verify `retrieve()` is also wired to Supabase.

---

#### SB-005 — Constructor Guard Must Be Retained (Required by Existing Tests)

The existing test suite includes:

```typescript
it('constructor throws when no SupabaseClient is provided ...', () => {
  expect(() => new (EpisodicMemoryAdapter as ...)(undefined)).toThrow(
    'SupabaseClient is required for EpisodicMemoryAdapter'
  );
});
```

The builder must retain:
```typescript
if (arguments.length > 0 && supabaseClient === undefined) {
  throw new Error('SupabaseClient is required for EpisodicMemoryAdapter');
}
```

After the Supabase wiring is complete, the constructor will actually USE the `supabaseClient`
parameter. The guard ensures it is not silently bypassed. The constructor signature should
change from `supabaseClient?: any` to `supabaseClient: SupabaseClient` (typed).

---

#### SB-006 — BD-000 User Journey Declaration Required in PREHANDOVER

The PREHANDOVER proof must declare the user journey for the write path:

> "Agent invokes `EpisodicMemoryAdapter.record(entry)` →
> adapter sets `app.current_organisation_id` on the Supabase connection →
> adapter executes INSERT into `ai_episodic_events` with all required fields →
> Supabase enforces RLS policy (organisation_id matches setting) →
> row persisted to database →
> adapter returns without error."

And for the read path:

> "Caller invokes `EpisodicMemoryAdapter.retrieve({ organisationId, sessionId?, limit? })` →
> adapter executes SELECT from `ai_episodic_events` with `eq('organisation_id', organisationId)` filter →
> Supabase enforces RLS policy for row-level isolation →
> filtered results returned as `EpisodicEventEntry[]`."

And the edge case:
> "INSERT fails (DB error, RLS violation) →
> adapter throws / rejects with an actionable error message →
> caller receives rejection (no silent swallowing of Supabase errors)."

If no journey declaration is present → IAA will issue REJECTION-PACKAGE at BD-000-A.

---

#### SB-007 — Error Handling: No Silent Swallow of Supabase Errors

The Supabase JS client's `.insert()` returns `{ data, error }`. An implementation that
ignores the `error` field will silently drop DB failures:

```typescript
// WRONG — silent failure
const { data } = await this.supabaseClient.from('ai_episodic_events').insert({ ... });

// CORRECT — error must be checked and thrown
const { error } = await this.supabaseClient.from('ai_episodic_events').insert({ ... });
if (error) throw new Error(`EpisodicMemoryAdapter.record() failed: ${error.message}`);
```

IAA at handover will verify the `error` field is checked and surfaced.

---

### T-01: FFA Rules Applicable at Handover

| Rule | Relevance |
|------|-----------|
| A-021 | CI must have run on the branch before IAA is invoked. Commit and push implementation before calling IAA. |
| A-028 | SCOPE_DECLARATION.md must be in list format, contain only this PR's files, and prior-wave entries must be trimmed. |
| A-029 | PREHANDOVER proof is read-only post-commit. IAA will NOT edit it. Builder must pre-populate `iaa_audit_token` with expected reference format. |
| A-034 | FUNCTIONAL-BEHAVIOUR-REGISTRY must be read by IAA at Step 3.1. No applicable registered niggles for Supabase INSERT path yet — but Supabase RLS gotchas (SB-003) are directly relevant. |
| A-035 | Niggle Pattern Library applied — Supabase RLS silent failure is a well-known gotcha (SB-003, SB-007). |
| A-037 | IAA token file must contain `PHASE_B_BLOCKING_TOKEN:` on its own line with a non-empty, non-PENDING value. |

---

## Step 0.5 — Pre-Brief Commit

This artifact is committed to branch `copilot/gap-009-wire-supabase-insert` as:
`.agent-admin/assurance/iaa-prebrief-gap-009-episodic-memory-remediation.md`

**OVL-INJ-001 satisfied**: Pre-Brief artifact is present before builder task implementation begins.

---

## Summary: Qualifying Tasks Found

| Task | Category | IAA Required | Scope Blockers |
|------|----------|--------------|----------------|
| T-01: Wire Supabase INSERT to `ai_episodic_events` | AAWP_MAT | YES — MANDATORY | SB-001 (tests RED gate), SB-002 (schema columns), SB-003 (RLS setting), SB-004 (retrieve also needs wiring), SB-005 (constructor guard), SB-006 (BD-000 journey declaration), SB-007 (error handling) |

**No EXEMPT tasks in this wave.** All changes are qualifying AAWP_MAT build work.

**IAA at handover**: The builder must invoke IAA (via `task(agent_type: "independent-assurance-agent")`)
after committing all deliverables. IAA will execute Phases 2–4 and issue a binary verdict.

---

*Generated by independent-assurance-agent v6.2.0 | Phase 0 Pre-Brief | 2026-04-07*
*Authority: CS2 (Johan Ras / @APGI-cmy) | Adoption phase: PHASE_B_BLOCKING*
