# IAA Session Memory — session-wave-audit-log-column-fix-20260308

| Field | Value |
|-------|-------|
| `session_id` | session-wave-audit-log-column-fix-20260308 |
| `date` | 2026-03-08 |
| `pr_reviewed` | wave-audit-log-column-fix / branch `copilot/fix-document-upload-issues` |
| `invoking_agent` | foreman-v2-agent |
| `producing_agent` | qa-builder (T-ALCF-QA-001), api-builder (T-ALCF-API-001), foreman-v2-agent (T-ALCF-GOV-001) |
| `producing_agent_class` | builder + foreman |
| `pr_category` | AAWP_MAT + KNOWLEDGE_GOVERNANCE |
| `checks_executed` | 37 (11 CORE + 23 FFA + 3 merge gate parity) |
| `checks_passed` | 37 |
| `checks_failed` | 0 |
| `merge_gate_parity_result` | PASS |
| `verdict` | ASSURANCE-TOKEN |
| `token_reference` | IAA-session-wave-audit-log-column-fix-20260308-PASS |
| `token_file_path` | `.agent-admin/assurance/iaa-token-session-wave-audit-log-column-fix-20260308.md` |
| `adoption_phase_at_time_of_verdict` | PHASE_B_BLOCKING |
| `prior_sessions_reviewed` | session-wave15r-impl-R2-20260308 (ASSURANCE-TOKEN), session-wave-upload-doclist-fix-20260308 (REJECTION-PACKAGE — different branch, resolved) |

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (invocation evidence present) | YES | PASS — PREHANDOVER references IAA audit token |
| A-002 (no class exceptions) | YES | PASS — builder and foreman classes subject to IAA |
| A-021 (commit before invoking) | YES | PASS — validate-scope-to-diff.sh exit 0 confirms clean state |
| A-026 (SCOPE_DECLARATION must match diff) | YES | PASS — 12/12 exact match confirmed |
| A-028 (SCOPE_DECLARATION format compliance) | YES | PASS — list format, wave-specific entries |
| A-029 (PREHANDOVER immutability §4.3b) | YES | PASS — expected reference pre-populated; token file written as separate artifact |
| A-030 (CORE-019 re-invocation carve-out) | YES | PASS — first invocation for this branch/session; no prior rejection applies |
| A-032 (Schema Column Compliance — NEW this session) | YES | PASS — IAA read migration DDL; all INSERT/SELECT columns verified |

---

## IAA Self-Governance Actions This Session

| Action | File | Change |
|--------|------|--------|
| A-032 added to FAIL-ONLY-ONCE | `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | v2.4.0 → v2.5.0 |
| A-031/A-032 added to key rules table | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | v2.6.0 → v2.7.0 |
| FAIL-ONLY-ONCE table entry updated | `index.md` | FAIL-ONLY-ONCE.md reference updated to v2.5.0, A-032 description |
| Token file written | `.agent-admin/assurance/iaa-token-session-wave-audit-log-column-fix-20260308.md` | Created |
| Session memory written | `.agent-workspace/independent-assurance-agent/memory/session-wave-audit-log-column-fix-20260308.md` | Created (this file) |

---

## Substantive Code Review Findings

**ZERO substantive findings.** The implementation is correct and complete:

1. **INSERT columns**: All 6 INSERT columns (`audit_id`, `organisation_id`, `action`, `file_path`, `created_by`, `details`) verified against migration DDL. Non-existent columns (`user_id`, `resource_type`, `resource_id`) all removed.
2. **organisation_id NOT NULL**: Correctly included using already-fetched `organisationId` variable — no unnecessary profile re-fetch introduced.
3. **SELECT columns**: 6 SELECT columns all exist in schema; `resource_id` removed.
4. **UploadedDocument interface**: Clean — `resource_id` removed, `created_by` added.
5. **Deduplication key**: `row.details?.file_path ?? row.file_path ?? ''` — correct; no `row.resource_id`.
6. **Non-fatal try/catch**: Preserved correctly. The architecture is correct — audit_log write failure should not block upload. Tests now assert argument shapes, so column correctness is verified despite the mock boundary.
7. **Tests**: 7 tests with extract helpers that correctly isolate the INSERT block and SELECT string. Non-trivial, non-dodging assertions.
8. **QA RED gate sequence**: Confirmed via Foreman session memory mode transitions — qa-builder completed before api-builder was opened.

**Advisory observation** (not a finding): Code comment at line 241 of useCriteria.ts reads `// Deduplicate by resource_id/file_path` — `resource_id` is a stale reference in the comment (the actual key no longer uses it). This is a cosmetic comment accuracy issue. Not a CORE-007 failure (not a stub/TODO/FIXME/placeholder). Recommend the producing agent update this comment in a future pass.

---

## fail_only_once_updates

New rule added this session:
- **A-032 (Schema Column Compliance Check)** added to IAA FAIL-ONLY-ONCE v2.5.0
- Triggered by: INC-ALCF-001
- Effect: All future IAA sessions reviewing PRs with INSERT/SELECT must read migration DDL and cross-check columns

---

## Learning Notes

1. **Silent try/catch is an IAA visibility gap**: The non-fatal try/catch pattern is architecturally correct for observability writes. But it creates a silent failure mode that was invisible during the prior wave's review. A-032 closes this gap — column compliance must be verified via DDL, not runtime behavior or mock-based tests.

2. **Migration file path diversity**: The `audit_logs` migration was in `apps/maturion-maturity-legacy/supabase/migrations/` — NOT the standard `supabase/migrations/`. IAA must actively search for migration files when reviewing INSERT/SELECT operations; the standard path assumption is insufficient.

3. **IAA self-governance authority is real and should be exercised promptly**: The Pre-Brief correctly identified that IAA should add A-032 to its own FAIL-ONLY-ONCE. The Foreman's T-ALCF-GOV-001 scope covered Foreman's registry. IAA's own registry is IAA's responsibility — no REJECTION-PACKAGE needed; IAA simply acted.

4. **Comment accuracy in fixed code**: When fixing column names, comments that reference old column names (like `resource_id/file_path`) should also be updated. This was missed in the api-builder fix. Low priority, but worth noting for future builder QP evaluations.

5. **Pre-Brief numbering conflicts**: The Pre-Brief said "add A-031 to IAA FAIL-ONLY-ONCE" but A-031 was already taken (A-026 Carve-Out). The correct ID was A-032. Pre-Brief numbering should be verified against the actual registry before writing the Pre-Brief. Consider adding a "next available ID" verification step to the Pre-Brief protocol.

---

## Suggestions for Improvement

**S-029 (this session)**: MIGRATION-FILE-SEARCH-PATTERN — When IAA applies A-032 (Schema Column Compliance), the first step is locating the migration file. Non-standard paths (legacy app directories) are common. IAA should perform a broader search using `find` or `glob` patterns when the standard path (`supabase/migrations/`) does not contain the relevant file. Candidate search pattern: `find . -path "*/migrations/*<table_name>*" -name "*.sql"`. This prevents a repeat of INC-ALCF-001 where the migration was in a legacy path.

---

## Parking Station

Entry appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:

| Date | Agent | Session | Phase | Summary | Session File |
|------|-------|---------|-------|---------|--------------|
| 2026-03-08 | independent-assurance-agent | session-wave-audit-log-column-fix-20260308 | Phase 4 | S-029: MIGRATION-FILE-SEARCH-PATTERN — IAA should use `find` patterns for non-standard migration paths when applying A-032 | session-wave-audit-log-column-fix-20260308.md |

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*Agent: independent-assurance-agent v6.2.0 | Session: session-wave-audit-log-column-fix-20260308 | Date: 2026-03-08*
