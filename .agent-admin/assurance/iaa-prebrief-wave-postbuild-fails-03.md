# IAA Pre-Brief — Wave: postbuild-fails-03

| Field | Value |
|---|---|
| **Pre-Brief Type** | WAVE PRE-BRIEF |
| **Wave** | postbuild-fails-03 — App-wide RLS Policy Violations & Settings Page Blank Screen |
| **Session** | session-102 |
| **Branch** | copilot/fix-rls-policy-violations |
| **Date** | 2026-03-04 |
| **IAA Version** | 6.2.0 |
| **Knowledge Version** | 2.4.0 |
| **Foreman** | foreman-v2-agent v6.2.0 |
| **Artifact Path** | `.agent-admin/assurance/iaa-prebrief-wave-postbuild-fails-03.md` |
| **Status** | COMMITTED — ACTIVE |

---

## Phase 0 Execution Record

### Step 0.1 — Pre-Brief Invocation Context

Invoked with `action: "PRE-BRIEF"` for wave `postbuild-fails-03`.  
This is a distinct invocation mode. IAA will NOT execute Phase 2–4 assurance until builders
deliver and commit their work. This artifact is the wave planning gate only.

**Root cause (from wave-current-tasks.md):**
1. `audits_org_isolation`, `domains_org_isolation`, `criteria_org_isolation` RLS policies use
   `current_setting('app.current_organisation_id', true)` — never set by the frontend SDK.
   Result: all SELECT/UPDATE/DELETE on these tables silently fail for authenticated users.
2. `organisations` table has RLS enabled but zero SELECT policy — total read block.
3. Storage upload paths in `useEvidence.ts` and `useCriteria.ts` use bare `evidence/<criterionId>/...`
   and `criteria/<auditId>/...` — but the hardened RLS policy
   (`audit_documents_rls_hardening`) checks `split_part(name,'/',1) = organisation_id`.
   All evidence uploads will fail the RLS check.
4. Test `MAT-T-0123` in `ui-wiring-behavior.test.ts` asserts `user_profiles` but the actual
   DB table is `profiles` — assertion was written against an older stub, not the production table.

**POLC Breach Note (from wave-current-tasks.md):**
Foreman committed a planning checklist before completing Phase 1 and obtaining IAA Pre-Brief
(SELF-BREACH-SESSION-102-001). No production code was committed in the breach. Corrective
action confirmed: Foreman stopped all build work and is completing the proper Phase 2 sequence.
This Pre-Brief constitutes the corrective gate artifact.

---

### Step 0.2 — wave-current-tasks.md Read

File path: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`  
Wave confirmed: `postbuild-fails-03 — App-wide RLS Policy Violations & Settings Page Blank Screen`  
Total declared tasks: **4**

---

### Step 0.3 — Task Classification

| Task ID | Builder | Description | IAA Trigger Category | Qualifying? |
|---------|---------|-------------|---------------------|-------------|
| TASK-PBF3-001 | schema-builder | New migration: drop broken `current_setting(...)` RLS policies; add correct `auth.uid()` + profiles-join SELECT/UPDATE/DELETE policies; add `organisations_select_own` | AAWP_MAT | ✅ QUALIFYING |
| TASK-PBF3-002 | ui-builder | Fix storage upload paths in `useEvidence.ts` + `useCriteria.ts` to include `organisationId/` prefix | AAWP_MAT | ✅ QUALIFYING |
| TASK-PBF3-003 | ui-builder | Fix test assertion `MAT-T-0123` in `ui-wiring-behavior.test.ts`: change `user_profiles` → `profiles` | AAWP_MAT | ✅ QUALIFYING |
| TASK-PBF3-004 | qa-builder | New RED QA test file: `modules/mat/tests/security-rls/wave-postbuild-fails-03.test.ts` (T-PBF3-001 to T-PBF3-007) | AAWP_MAT | ✅ QUALIFYING |

**IAA Trigger Category**: `AAWP_MAT` — All four tasks are MAT/AAWP build deliverables.  
**IAA Invocation**: MANDATORY at handover. No class exceptions.

**CST Assessment (Pre-Brief Advisory):**  
This wave closes three distinct cross-boundary integration points simultaneously:
1. RLS policy layer (DB) ↔ frontend SDK (auth.uid() assumption)
2. Storage upload paths (frontend hooks) ↔ Supabase Storage RLS (organisationId prefix)
3. Test assertions ↔ actual DB table schema

Per `COMBINED_TESTING_PATTERN.md` §4.2 and IAA knowledge index §CST/CWT/FCWT, a **CST
checkpoint is warranted** after all four tasks are GREEN. Foreman should plan a CST covering
the security-rls test suite and storage path guards before wave closure.

---

## Task Pre-Brief Detail

---

### TASK-PBF3-001 — RLS Migration (schema-builder)

**Builder**: schema-builder  
**Trigger Category**: AAWP_MAT  
**Required IAA Phases**: 1, 2, 3, 4 (all phases — full assurance)

#### Target File
```
apps/maturion-maturity-legacy/supabase/migrations/20260305000000_fix_rls_current_setting_policies.sql
```
(or next available timestamp — timestamp must be after existing migrations)

#### Required Migration Operations (IAA will verify presence of each)

| # | Operation | IAA Check |
|---|-----------|-----------|
| 1 | `DROP POLICY IF EXISTS audits_org_isolation ON public.audits` | Must be present — idempotent drop |
| 2 | `CREATE POLICY audits_select_org_isolation` FOR SELECT USING auth.uid() pattern | Must use `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` |
| 3 | `CREATE POLICY audits_update_org_isolation` FOR UPDATE (USING + WITH CHECK) auth.uid() pattern | Must have both USING and WITH CHECK clauses |
| 4 | `CREATE POLICY audits_delete_org_isolation` FOR DELETE USING auth.uid() pattern | Required — DELETE was blocked |
| 5 | `DROP POLICY IF EXISTS domains_org_isolation ON public.domains` | Must be present — idempotent drop |
| 6 | `CREATE POLICY domains_select_org_isolation` FOR SELECT USING auth.uid() pattern | Same profiles-join pattern |
| 7 | `DROP POLICY IF EXISTS criteria_org_isolation ON public.criteria` | Must be present — idempotent drop |
| 8 | `CREATE POLICY criteria_select_org_isolation` FOR SELECT USING auth.uid() pattern | Same profiles-join pattern |
| 9 | `CREATE POLICY organisations_select_own` FOR SELECT ON public.organisations | Must include USING with auth.uid() profiles join — fills current zero-policy RLS gap |

#### Evidence Artifacts Required at Handover

- [ ] Migration file committed to branch at specified path
- [ ] Migration is idempotent: `DROP POLICY IF EXISTS` (not bare DROP POLICY)
- [ ] Migration is idempotent: `CREATE POLICY ... IF NOT EXISTS` or preceded by `DROP POLICY IF EXISTS`
- [ ] All 9 operations above are present in the migration SQL
- [ ] auth.uid() pattern is consistent: `organisation_id IN (SELECT organisation_id FROM profiles WHERE id = auth.uid())` — NOT `current_setting(...)` anywhere
- [ ] No `current_setting` references survive in migration output
- [ ] UPDATE policy has both `USING` and `WITH CHECK` (not just one)
- [ ] PREHANDOVER proof filed by schema-builder citing this migration
- [ ] Session memory written by schema-builder

#### Applicable Canon Overlays

| Overlay | Check IDs | Why Applies |
|---------|-----------|-------------|
| AAWP_MAT BD-TIER-1 | BD-001, BD-002, BD-003, BD-004 | Full delivery compliance check |
| AAWP_MAT BD-TIER-2 | BD-005, BD-006, BD-007, BD-008 | Auth guards (BD-007) critical: policies must be auth.uid()-gated; table writers/readers must both function post-migration (BD-006) |
| AAWP_MAT BD-TIER-3 | BD-011, BD-012, BD-013 | QA test file must be GREEN after migration lands |
| AAWP_MAT BD-TIER-4 | **BD-015 (primary)**, BD-016, BD-018 | BD-015 is the critical check: RLS policies must be complete for all CRUD operations on all affected tables |
| AAWP_MAT BD-TIER-5 | BD-022 | Architecture alignment — migration must match TASK spec exactly |
| Core Invariants | CORE-001 to CORE-022 | Standard ceremony checks |

**BD-015 Special Focus**: IAA will verify that after this migration, all three tables (`audits`,
`domains`, `criteria`) have complete CRUD coverage (SELECT ✅, UPDATE ✅, DELETE ✅) and the
`organisations` table has a working SELECT policy. Any table left with a coverage gap = REJECTION-PACKAGE.

**BD-007 Special Focus**: The old `current_setting(...)` pattern provided zero protection because
the setting was never populated. IAA will confirm the replacement auth.uid() + profiles JOIN is
the correct Supabase-native RLS pattern and that no residual `current_setting` calls remain.

---

### TASK-PBF3-002 — Storage Upload Path Fix (ui-builder)

**Builder**: ui-builder  
**Trigger Category**: AAWP_MAT  
**Required IAA Phases**: 1, 2, 3, 4 (all phases — full assurance)

#### Target Files
```
modules/mat/frontend/src/lib/hooks/useEvidence.ts
modules/mat/frontend/src/lib/hooks/useCriteria.ts
```

#### Required Changes (IAA will verify each)

| File | Before | After | IAA Check |
|------|--------|-------|-----------|
| `useEvidence.ts` | `evidence/${criterionId}/...` | `${organisationId}/evidence/${criterionId}/...` | Path must start with organisationId segment |
| `useCriteria.ts` | `criteria/${auditId}/...` | `${organisationId}/criteria/${auditId}/...` | Path must start with organisationId segment |
| `useEvidence.ts` | No org fetch | Profile query for `organisation_id` before upload | Must fetch org ID from authenticated user's profile |
| `useCriteria.ts` | No org fetch | Profile query for `organisation_id` before upload | Must fetch org ID from authenticated user's profile |

#### Architecture Alignment Verification
The Supabase Storage RLS policy `audit_documents_rls_hardening`
(migration `20260303000005_audit_documents_rls_hardening.sql`) checks:
```sql
split_part(name, '/', 1) = organisation_id
```
The new upload path `${organisationId}/evidence/${criterionId}/...` satisfies this:
`split_part('${orgId}/evidence/${criterionId}/...', '/', 1)` = `${orgId}` ✅

IAA will verify the path structure is consistent with this storage RLS policy.

#### Evidence Artifacts Required at Handover

- [ ] `useEvidence.ts` updated — no bare `evidence/${criterionId}` upload path present
- [ ] `useCriteria.ts` updated — no bare `criteria/${auditId}` upload path present
- [ ] Both hooks fetch `organisation_id` from the authenticated user's profile before upload
- [ ] Profile fetch handles error state (null orgId guard)
- [ ] T-PBF3-006 (QA test) is GREEN after this change
- [ ] T-PBF3-007 (QA test) is GREEN after this change
- [ ] PREHANDOVER proof filed by ui-builder citing both files
- [ ] Session memory written by ui-builder

#### Applicable Canon Overlays

| Overlay | Check IDs | Why Applies |
|---------|-----------|-------------|
| AAWP_MAT BD-TIER-1 | BD-001, BD-002, BD-003 | Delivery completeness — both hooks updated, not just one |
| AAWP_MAT BD-TIER-2 | BD-005, BD-007, BD-009 | End-to-end wiring: upload path must satisfy storage RLS (BD-005); auth guard on orgId fetch (BD-007); no contract breakage with storage RLS migration (BD-009) |
| AAWP_MAT BD-TIER-3 | BD-011, BD-012, BD-013 | T-PBF3-006 and T-PBF3-007 must be GREEN |
| AAWP_MAT BD-TIER-4 | BD-015, BD-017 | Storage path correctness is functionally equivalent to an auth guard; input validation check |
| AAWP_MAT BD-TIER-5 | BD-021, BD-022 | TypeScript strictness (organisationId must be typed, not `any`); architecture alignment |
| Core Invariants | CORE-001 to CORE-022 | Standard ceremony checks |

**BD-005 Special Focus (End-to-End Wiring)**: IAA will trace:
`user profile → organisation_id → upload path → storage RLS check → split_part match`
to verify the complete chain functions. A missing step anywhere = REJECTION-PACKAGE.

**BD-017 Special Focus (Input Validation)**: IAA will verify that `organisationId` is checked
for null/empty before being interpolated into the upload path. A null organisationId silently
breaking the path is a runtime failure.

---

### TASK-PBF3-003 — Test Assertion Fix (ui-builder)

**Builder**: ui-builder  
**Trigger Category**: AAWP_MAT  
**Required IAA Phases**: 1, 2, 3, 4 (all phases — full assurance)

#### Target File
```
modules/mat/tests/ui-wiring-behavior/ui-wiring-behavior.test.ts
```

#### Required Change

| Location | Current (wrong) | Corrected | IAA Check |
|----------|-----------------|-----------|-----------|
| `MAT-T-0123` assertion | `expect(hookSrc).toContain('user_profiles')` | `expect(hookSrc).toContain('profiles')` | Assertion must match actual DB table name per all migrations |

#### Architecture Alignment Note
All migrations in `apps/maturion-maturity-legacy/supabase/migrations/` use the table name `profiles`
(not `user_profiles`). The test was written against an older stub. Correcting the test is the
right fix — the production hook code is correct, the test was wrong.

IAA will verify `profiles` is the correct table name by cross-referencing migration SQL before
approving this fix.

#### Evidence Artifacts Required at Handover

- [ ] `ui-wiring-behavior.test.ts` updated — `MAT-T-0123` assertion checks `'profiles'` not `'user_profiles'`
- [ ] Test `MAT-T-0123` is GREEN after the fix
- [ ] No other test assertions in this file reference `user_profiles` (sweep required)
- [ ] `profiles` table name confirmed against migration SQL (cross-reference evidence in PREHANDOVER)
- [ ] PREHANDOVER proof filed by ui-builder citing the test file
- [ ] Session memory written by ui-builder

#### Applicable Canon Overlays

| Overlay | Check IDs | Why Applies |
|---------|-----------|-------------|
| AAWP_MAT BD-TIER-3 | BD-011, BD-012, BD-013 | Test debt elimination: the wrong assertion is a form of test dodging (BD-013) — a test that asserts a stale stub passes vacuously |
| AAWP_MAT BD-TIER-1 | BD-001, BD-003 | Delivery completeness; one-time fix — the corrected assertion must not introduce new drift |
| AAWP_MAT BD-TIER-5 | BD-022 | Architecture alignment — test must reflect the actual data model |
| Core Invariants | CORE-001 to CORE-022 | Standard ceremony checks |

**BD-013 Special Focus (Test Dodging)**: An assertion that checks for a table name (`user_profiles`)
that does not exist in any migration would have been passing vacuously if the hook source happened
to contain that string as a comment or otherwise. IAA will confirm the corrected assertion
actually validates against the real table name used by the hook code.

---

### TASK-PBF3-004 — Security RLS QA Test Suite (qa-builder)

**Builder**: qa-builder  
**Trigger Category**: AAWP_MAT  
**Required IAA Phases**: 1, 2, 3, 4 (all phases — full assurance)

#### Target File
```
modules/mat/tests/security-rls/wave-postbuild-fails-03.test.ts
```

#### Required Tests (IAA will verify each is present and non-vacuous)

| Test ID | What It Asserts | RED Before? | GREEN After? |
|---------|-----------------|-------------|--------------|
| T-PBF3-001 | Migration drops `audits_org_isolation` OR the old policy is absent from new migration (replaced by auth.uid() version) | ✅ RED before migration | ✅ GREEN after |
| T-PBF3-002 | Migration adds `audits_select_org_isolation` with SELECT + auth.uid() pattern | ✅ RED before migration | ✅ GREEN after |
| T-PBF3-003 | Migration adds `domains_select_org_isolation` with SELECT + auth.uid() pattern | ✅ RED before migration | ✅ GREEN after |
| T-PBF3-004 | Migration adds `criteria_select_org_isolation` with SELECT + auth.uid() pattern | ✅ RED before migration | ✅ GREEN after |
| T-PBF3-005 | Migration adds `organisations_select_own` SELECT policy on organisations | ✅ RED before migration | ✅ GREEN after |
| T-PBF3-006 | Storage path guard: `useEvidence.ts` must NOT contain bare `evidence/${criterionId}` as upload path (must have organisationId prefix) | ✅ RED before hook fix | ✅ GREEN after |
| T-PBF3-007 | Storage path guard: `useCriteria.ts` must NOT contain bare `criteria/${auditId}` as upload path (must have organisationId prefix) | ✅ RED before hook fix | ✅ GREEN after |

#### Test Implementation Constraints (IAA will enforce)

- **File-based only** — no live Supabase connection required
- Migration tests read SQL file content from disk: use `fs.readFileSync` on the migration file path
- Storage path tests read hook source from disk: use `fs.readFileSync` on hook file paths
- All 7 tests must fail (RED) before TASK-PBF3-001 and TASK-PBF3-002 are implemented
- All 7 tests must pass (GREEN) after both implementation tasks are complete
- No `.skip()`, `.only()`, or `test.todo()` — zero test debt

#### Evidence Artifacts Required at Handover

- [ ] Test file created at specified path
- [ ] All 7 test IDs (T-PBF3-001 to T-PBF3-007) present in the file
- [ ] Test run output showing RED state (before implementation) — screenshot or log snippet in PREHANDOVER
- [ ] Test run output showing GREEN state (after TASK-PBF3-001 and TASK-PBF3-002 land)
- [ ] No vacuous assertions (tests must fail if the target pattern is absent)
- [ ] Migration file path reference in tests is correct
- [ ] Hook file path references in tests are correct
- [ ] PREHANDOVER proof filed by qa-builder citing this test file and both run states
- [ ] Session memory written by qa-builder

#### Applicable Canon Overlays

| Overlay | Check IDs | Why Applies |
|---------|-----------|-------------|
| AAWP_MAT BD-TIER-3 | BD-011, BD-012, **BD-013** | Test dodging check is primary: each test must be a genuine sentinel that fails when the pattern is absent |
| AAWP_MAT BD-TIER-1 | BD-001, BD-002, BD-003 | All 7 tests must be present; no TODOs; one-time delivery |
| AAWP_MAT BD-TIER-4 | BD-015 | Security test suite is the guard for RLS correctness — completeness of security coverage is a BD-015 concern |
| AAWP_MAT BD-TIER-5 | BD-022 | Architecture alignment: tests must reference the correct migration file timestamp and hook file paths |
| Core Invariants | CORE-001 to CORE-022 | Standard ceremony checks |

**BD-013 Special Focus (Test Dodging — PRIMARY check for this task)**: IAA will independently
assess each test for vacuousness:
- T-PBF3-001 to T-PBF3-005: if the regex/contains check is too broad (e.g., `toContain('auth')`
  instead of the specific policy name), it may pass vacuously. IAA will verify specificity.
- T-PBF3-006 and T-PBF3-007: the negative assertion pattern (`not.toContain(...)`) must be
  precise enough to catch the old bare path pattern specifically, not just any string.

---

## Wave-Level IAA Requirements

### Pre-Conditions Before IAA Full Assurance Invocation

IAA will NOT issue a verdict until ALL of the following are true:

| Pre-Condition | Responsible | Description |
|---------------|-------------|-------------|
| All 4 tasks committed | Respective builders | All files in the Required Evidence lists above must exist on the branch |
| PREHANDOVER proof committed | Foreman or producing builder | Single PREHANDOVER proof covering this wave, committed to branch |
| Session memory committed | Producing agent(s) | Session memory file(s) at `.agent-workspace/<builder>/memory/session-NNN-YYYYMMDD.md` |
| All tests GREEN | qa-builder / ui-builder | `pnpm test` or equivalent — including T-PBF3-001 to T-PBF3-007 and MAT-T-0123 |
| SCOPE_DECLARATION.md current | Foreman | Must match `git diff --name-only origin/main...HEAD` exactly (FAIL-ONLY-ONCE A-026, A-028) |
| IAA token field pre-populated | Producing agent | `iaa_audit_token` in PREHANDOVER proof must contain expected reference format per A-029 |

### Wave Completion Gate

Per `wave-current-tasks.md`:

- [ ] This Pre-Brief exists (✅ satisfied by this artifact)
- [ ] TASK-PBF3-001 (schema-builder) 🟢 DONE
- [ ] TASK-PBF3-002 (ui-builder) 🟢 DONE
- [ ] TASK-PBF3-003 (ui-builder) 🟢 DONE
- [ ] TASK-PBF3-004 (qa-builder) 🟢 DONE
- [ ] All tests GREEN (100%)
- [ ] IAA assurance token received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

### CST Mandate

Before wave closure, Foreman must commission a **Combined Subwave Test (CST)** covering:
- `modules/mat/tests/security-rls/` (new test file from TASK-PBF3-004)
- `modules/mat/tests/ui-wiring-behavior/` (updated MAT-T-0123 from TASK-PBF3-003)
- Full test suite regression (to confirm no regressions from storage path changes)

IAA will verify CST evidence is present in the PREHANDOVER proof before issuing ASSURANCE-TOKEN.
Absence of CST evidence = REJECTION-PACKAGE citing `OVL-AM-CST-01`.

---

## Canon References

| Reference | Purpose |
|-----------|---------|
| `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` | Primary IAA governance canon |
| `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 | Agent system constitutional authority |
| `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` | PREHANDOVER proof format requirements |
| `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b | Token file architecture (A-029) — PREHANDOVER immutability |
| `governance/canon/COMBINED_TESTING_PATTERN.md` | CST/CWT/FCWT mandate |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` v2.3.0 | AAWP_MAT BD-001 to BD-024 overlay |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` v2.8.0 | CORE-001 to CORE-022 |
| `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` v2.3.0 | Active rules A-001 to A-030 |

---

## Summary Table

| Task | Builder | IAA Category | Proof Phases | Primary Overlay Checks | CST Required |
|------|---------|--------------|--------------|----------------------|--------------|
| TASK-PBF3-001 | schema-builder | AAWP_MAT | 1, 2, 3, 4 | BD-001–BD-024, **BD-015** (RLS completeness), BD-007 (auth guards) | Part of wave CST |
| TASK-PBF3-002 | ui-builder | AAWP_MAT | 1, 2, 3, 4 | BD-001–BD-024, **BD-005** (end-to-end wiring), BD-017 (input validation) | Part of wave CST |
| TASK-PBF3-003 | ui-builder | AAWP_MAT | 1, 2, 3, 4 | BD-001–BD-024, **BD-013** (test dodging), BD-022 (architecture alignment) | Part of wave CST |
| TASK-PBF3-004 | qa-builder | AAWP_MAT | 1, 2, 3, 4 | BD-001–BD-024, **BD-013** (test dodging / vacuousness), BD-015 (security coverage) | Part of wave CST |

---

> **COMMITTED AND ACTIVE.**
> All four tasks are QUALIFYING for IAA assurance under category AAWP_MAT.
> IAA invocation is MANDATORY before merge. No class exceptions.
> Foreman may now delegate to builders. IAA assurance will be executed at handover
> when all tasks are complete and all pre-conditions are satisfied.
>
> **IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE.
> REJECTION-PACKAGE prevents PR from being opened. No advisory mode.
