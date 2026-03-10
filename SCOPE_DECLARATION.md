# SCOPE_DECLARATION — wave-criteria-display-bugfix-1049

**Wave**: wave-criteria-display-bugfix-1049
**Session**: session-wave-criteria-display-bugfix-1049-20260310
**Date**: 2026-03-10
**Branch**: copilot/fix-column-mapping-issue
**Issue**: maturion-isms#1049 — "Bug: Criteria Not Displayed After Parsing — Column Mapping Mismatch"
**Agent**: foreman-v2-agent v6.2.0

---

## Files Modified in This Wave (branch diff vs main)

### Production Code (wave deliverables)
1. `supabase/functions/invoke-ai-parse-criteria/index.ts`
   - `normaliseMpsNumber` function: strips alphabetic prefix before `Number()` conversion
   - Before: `String(Number(v))` — returns "NaN" for "MPS 6"
   - After: strips `/^[A-Za-z]+\s*/`, uses `isNaN` guard

2. `modules/mat/tests/wave-criteria-display-bugfix/criteria-display-bugfix.test.ts`
   - NEW FILE: 5 regression tests T-WCDB-001 to T-WCDB-005

### Governance Artifacts
3. `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` — v3.8.0, INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001
4. `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave entry
5. `.agent-admin/assurance/iaa-prebrief-wave-criteria-display-bugfix-1049.md` — IAA Pre-Brief
6. `.agent-workspace/independent-assurance-agent/memory/session-prebrief-criteria-display-20260310.md` — IAA memory
7. `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md` — IAA parking
8. `.agent-admin/assurance/iaa-token-session-wave-criteria-display-bugfix-1049-20260310.md` — IAA rejection artifact (REJECTION-PACKAGE R1)
9. `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-criteria-display-bugfix-1049-20260310.md` — PREHANDOVER proof
10. `.agent-workspace/foreman-v2/memory/session-wave-criteria-display-bugfix-1049-20260310.md` — session memory
11. `SCOPE_DECLARATION.md` — this file

---

## Files NOT Modified in This Wave

- No `.github/agents/` files
- No `.github/workflows/` files
- No schema migration files
- No frontend hook files
- No architecture documents
