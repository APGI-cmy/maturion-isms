# IAA Session Memory — session-wave-ai-criteria-creation-fix-20260311

```yaml
session_id: session-wave-ai-criteria-creation-fix-20260311
date: 2026-03-11
pr_reviewed: "wave-ai-criteria-creation-fix / copilot/fix-ai-criteria-creation-failure"
invoking_agent: foreman-v2-agent
producing_agent: "qa-builder (T-W17-QA-001), schema-builder (T-W17-SCH-001)"
producing_agent_class: builder
pr_category: AAWP_MAT
secondary_triggers:
  - A-032 SCHEMA COLUMN COMPLIANCE (mandatory for criteria INSERT path fix)
checks_executed: 36
checks_passed: 35
checks_failed: 1
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave-ai-criteria-creation-fix-20260311-R1-REJECTION
token_file: .agent-admin/assurance/iaa-token-session-wave-ai-criteria-creation-fix-20260311-R1-REJECTION.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave16-full-batch-20260310
  - session-wave-wf-contract-audit-20260310
  - session-wave-criteria-display-bugfix-1049-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave15r-impl-R2-20260308
prehandover_proof: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-ai-criteria-creation-fix-20260311.md
session_memory_foreman: .agent-workspace/foreman-v2/memory/session-wave-ai-criteria-creation-fix-20260311.md
iaa_prebrief: .agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md (SHA 5478deb)
```

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 | IAA invocation evidence check | PASS — iaa_audit_token present |
| A-021 | Commit before IAA invocation | PASS — all 5 commits ahead of origin/main before invocation |
| A-026 | SCOPE_DECLARATION exact match | **FAIL** — 3 ceremony files missing from SCOPE_DECLARATION |
| A-029 | PREHANDOVER immutability §4.3b | APPLIED — PREHANDOVER read-only; rejection token written to dedicated file |
| A-031 | IAA ceremony carve-out check | NOT APPLICABLE — missing files are Foreman artifacts, not IAA prior-rejection artifacts |
| A-032 | Schema Column Compliance | PASS — all 8 Edge Function INSERT columns verified against post-migration DDL |

## Failure Detail

**Only failure: A-026 SCOPE_DECLARATION.md incomplete**

`.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` lists 6 files.
`git diff --name-only origin/main...HEAD` returns 9 files.

Missing from SCOPE_DECLARATION:
1. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-ai-criteria-creation-fix-20260311.md`
2. `.agent-workspace/foreman-v2/memory/session-wave-ai-criteria-creation-fix-20260311.md`
3. `.agent-workspace/foreman-v2/parking-station/suggestions-log.md`

Fix: Add 3 entries to SCOPE_DECLARATION.md, commit, push, re-invoke IAA.

## Substantive Quality Review

All substantive (90%) checks PASS. Key findings:

1. **Root cause correct and complete**: PRIMARY (missing `title TEXT` column) and SECONDARY (`description NOT NULL` constraint) both identified and fixed. Two-pronged fix is correct.

2. **Migration quality**: Idempotent DDL (`ADD COLUMN IF NOT EXISTS` + `DO $$ BEGIN information_schema check END $$`). Safe to re-run. No FK changes.

3. **A-032 fully verified independently**: IAA read both migration files directly.
   - Base DDL: `criteria` has no `title` column, has `description TEXT NOT NULL` ✓ (confirms root cause)
   - Fix migration: `ADD COLUMN IF NOT EXISTS title TEXT` + `ALTER COLUMN description DROP NOT NULL` ✓ (confirms fix correct)
   - Post-migration: all 8 Edge Function INSERT columns present ✓

4. **Test methodology sound**: File-based tests — read actual source files, no live DB required for CI. Tests would have been RED before migration, are GREEN after. T-W17-CP-003 (pre-existing GREEN) correctly validates that Edge Function code was already correct. IAA independently ran tests: 5/5 PASS confirmed.

5. **Governance sequence correct**: Pre-Brief committed at SHA 5478deb BEFORE first implementation commit (f26e2a5 tests, 53232e2 migration). Correct OVL-INJ-001 compliance.

6. **ParsedCriterion.source_anchor mapping**: `guidance: c.source_anchor ?? null` maps `source_anchor` property to `guidance` column. `guidance TEXT` (nullable) exists in base DDL. This alias is consistent with existing architecture (line 282 comment documents it). No A-032 gap.

## CST/CWT Assessment

**CST**: This wave is a targeted schema fix (single-table, one migration). No new cross-boundary integration point introduced. The fix RESTORES a broken path (Edge Function → DB) rather than adding a new one. CST is NOT warranted — the existing test suite adequately covers the fix.

**CWT**: Not applicable at this stage — this is a single targeted bugfix wave, not a wave-completion handover. CWT check will be applicable at the next IBWR closing point.

## Learning Notes

1. **SCOPE_DECLARATION pattern**: For the third+ time, Foreman's SCOPE_DECLARATION omits the ceremony files that Foreman commits in the same session (PREHANDOVER proof, session memory, parking station). These files are always committed to the branch but routinely missing from the SCOPE_DECLARATION. This is a persistent A-026 pattern. IAA notes: the foreman PREHANDOVER template should include explicit reminders to add ALL committed files to SCOPE_DECLARATION, including ceremony files.

2. **A-026 specifically covers ceremony files**: The purpose of A-026 (preventing stale prior-wave content) is met in this PR — the scope declaration is entirely current-wave. However the exact-match requirement exists precisely because partial scope declarations have historically obscured what was actually modified. Ceremony files must be included.

3. **Rejection is proportionate**: This REJECTION-PACKAGE is for one ceremony gap only. All substantive quality checks PASS. Re-invocation should be a fast-pass. The Foreman should be able to resolve in one commit.

4. **Pre-Brief sequence was excellent**: The governance sequence in this wave was correct — Pre-Brief committed BEFORE any builder work. The pre-brief explicitly warned about the SCOPE_DECLARATION risk (Blocker 3). Yet the pattern repeated. Suggests the SCOPE_DECLARATION template needs a mandatory checklist item for `memory/PREHANDOVER-*.md`, `memory/session-*.md`, and `parking-station/suggestions-log.md`.

## fail_only_once_updates

No new FAIL-ONLY-ONCE rules added this session. A-026 pattern is already covered by the existing rule. The learning note above is recorded for pattern tracking.

## Suggestions for Improvement

**Mandatory continuous improvement note:**

1. **SCOPE_DECLARATION template enhancement**: The foreman personal SCOPE_DECLARATION template should have pre-populated rows for the ceremony artifacts that are always committed:
   ```
   | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-<WAVE>-<DATE>.md` | CEREMONY | PREHANDOVER proof |
   | `.agent-workspace/foreman-v2/memory/session-<WAVE>-<DATE>.md` | CEREMONY | Foreman session memory |
   | `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` | CEREMONY | Parking station entry |
   ```
   Pre-populating these reduces the risk of omission. Foreman only needs to fill in the specific wave/date identifiers.

2. **Pre-IAA Commit Gate checklist item**: The PREHANDOVER template should have an explicit item:
   `[ ] SCOPE_DECLARATION lists ALL git diff --name-only output including ceremony files`
   This is the third+ A-026 violation for ceremony file omission across recent waves.

**Session**: session-wave-ai-criteria-creation-fix-20260311
**IAA Agent**: independent-assurance-agent v6.2.0

---

**Parking Station Note**: Entry to be added to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`
