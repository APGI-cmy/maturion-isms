# IAA REJECTION-PACKAGE — Wave 19: MAT Criteria Parsing Holistic Repair

**Document type**: IAA REJECTION-PACKAGE
**Token reference**: IAA-session-wave19-orchestration-20260317-REJECTION-R1
**PR**: Wave 19 — MAT Criteria Parsing Holistic Repair
**Branch**: copilot/wave-19-holistic-mat-criteria-repair
**Issue**: maturion-isms#1137
**Date**: 2026-03-17
**IAA Session**: session-wave19-orchestration-20260317
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING — verdicts are HARD-BLOCKING
**Authority**: CS2 (@APGI-cmy)

---

## Verdict: REJECTION-PACKAGE

6 checks FAILED. Merge BLOCKED. STOP-AND-FIX required.
This PR must NOT be opened until ALL 6 failures are resolved and IAA re-invoked.

---

## Failures

### FAILURE 1 — CORE-021 / A-021: Commits Not Pushed [CRITICAL]

**Finding**: 3 commits are local-only and have NOT been pushed to `origin/copilot/wave-19-holistic-mat-criteria-repair` before IAA invocation. This violates A-021 (Commit and Push Before IAA Invocation).

Local-only commits:
- `49bb707c` — `fix(wave19): Batch C — Edge Function GAP-PARSE-001/002/003/004/005/006/012 fixes [T-W19-001,004,005,006,007,010]`
- `9913accd` — `feat(wave19): Batch E — CI schema alignment validation script [T-W19-011]`
- `7a3c467a` — `feat(wave19): Batch F — LDCS E2E test fixture [T-W19-014]`

This means Batch C (Edge Function fixes), Batch E (CI script), and Batch F (LDCS fixture) — representing the majority of Wave 19 deliverables — have never been reviewed by CI.

**Fix required**:
```bash
git push origin copilot/wave-19-holistic-mat-criteria-repair
```
Confirm CI pipeline runs to GREEN before re-invoking IAA.

---

### FAILURE 2 — CORE-013 / CORE-018: PREHANDOVER Proof Absent [CRITICAL]

**Finding**: `PREHANDOVER-session-wave19-orchestration-20260317.md` does not exist on the filesystem. The file was referenced in the IAA invocation request as the Wave 19 PREHANDOVER proof artifact. It is absent entirely (`wc: No such file or directory`).

This fails:
- CORE-013: IAA invocation evidence must be readable and non-empty
- CORE-018: Evidence artifact sweep — PREHANDOVER proof required
- A-029: Token reference pre-population cannot be verified

**Fix required**: Create `PREHANDOVER-session-wave19-orchestration-20260317.md` per `AGENT_HANDOVER_AUTOMATION.md` template. Mandatory fields:
- Wave summary
- Evidence summary (test results 14/14, gap coverage GAP-PARSE-001–012)
- Architecture decisions honoured (AD-W19-001, AD-W19-002, AD-W19-003)
- Pre-IAA commit gate (git status + git log evidence)
- `iaa_audit_token: IAA-session-wave19-orchestration-20260317-PASS` (per A-029)
- SCOPE_DECLARATION reference (A-026)

Commit to branch and push.

---

### FAILURE 3 — CORE-015: Foreman Session Memory Untracked [BLOCKING]

**Finding**: `session-wave19-orchestration-20260317.md` exists in `.agent-workspace/foreman-v2/memory/` but is listed as **untracked** in `git status`. It was not committed to the branch before IAA invocation.

**Fix required**:
```bash
git add .agent-workspace/foreman-v2/memory/session-wave19-orchestration-20260317.md
git commit -m "chore(wave19): add foreman session memory"
```
Include in the same commit batch as the PREHANDOVER proof.

---

### FAILURE 4 — CORE-016 / A-029: IAA Token Reference Not Pre-Populated [BLOCKING]

**Finding**: Since the PREHANDOVER proof is absent (Failure 2), the `iaa_audit_token` field with a pre-populated expected token reference cannot be present. A-029 requires that the PREHANDOVER proof be committed with the expected reference ending in `-PASS` before IAA is invoked.

**Fix required**: Resolved by Failure 2 fix. PREHANDOVER must include:
```yaml
iaa_audit_token: IAA-session-wave19-orchestration-20260317-PASS
```

---

### FAILURE 5 — CORE-022 / A-026: SCOPE_DECLARATION.md Stale [BLOCKING]

**Finding**: Root `SCOPE_DECLARATION.md` shows Wave Node/CLI Ripple scope from the previous wave (`session-wave-node-ripple-20260316`). The 12 Wave 19 changed files are absent from the scope declaration.

Actual `git diff --name-only HEAD origin/main` produces:
```
.agent-admin/assurance/iaa-prebrief-wave19-criteria-parsing-repair.md
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
.github/scripts/validate-mat-schema-alignment.sh
apps/mat-ai-gateway/services/parsing.py
apps/mat-ai-gateway/tests/test_wave19_startup.py
apps/maturion-maturity-legacy/supabase/migrations/20260317000001_criteria_number_text.sql
apps/maturion-maturity-legacy/supabase/migrations/20260317000002_mps_intent_guidance.sql
apps/maturion-maturity-legacy/supabase/migrations/20260317000003_parse_write_back_atomic_rpc.sql
modules/mat/frontend/src/lib/hooks/useCriteria.ts
modules/mat/tests/wave19/fixtures/ldcs-fixture.json
modules/mat/tests/wave19/wave19-criteria-parsing.test.ts
supabase/functions/invoke-ai-parse-criteria/index.ts
```
_(Plus Wave 19 ceremony artifacts added after pushing — add A-031 carve-out note for those)_

**Fix required**: Overwrite `SCOPE_DECLARATION.md` with the above file list, formatted as a markdown list. Add A-031 carve-out note for subsequent IAA ceremony artifacts. Commit and push.

---

### FAILURE 6 — OVL-AM-CWT-01: No CWT PASS Evidence [BLOCKING]

**Finding**: This is a "FINAL AUDIT" wave closure invocation. Per `COMBINED_TESTING_PATTERN.md` §5.2, a Combined Wave Test (CWT) is **mandatory** before wave completion. The Wave 19 test suite (14/14 GREEN) is necessary but not sufficient — CWT requires cumulative regression across all prior waves to confirm Wave 19 changes introduced no regressions.

No CWT PASS evidence appears in any ceremony artifact (PREHANDOVER proof absent; Foreman session memory only records "14/14 T-W19-NNN GREEN").

**Fix required**: Execute CWT covering all waves through Wave 19. Record CWT PASS verdict in PREHANDOVER proof with mandatory scope fields:
```yaml
cwt_pass:
  verdict: CWT PASS
  waves_covered: [Wave 1 through Wave 19]
  modules_covered: [MAT, supabase/functions/invoke-ai-parse-criteria, apps/mat-ai-gateway]
  scenarios_covered: [count]
  test_run_date: 2026-03-17
  command: npx vitest run [scope]
  output_reference: [attach CI log or test output]
```

---

## Build Quality Assessment (Independent)

**The substantive build quality is STRONG.** All 14 T-W19-NNN tests were independently verified by IAA (vitest run: 14/14 PASS, 313ms). Migration DDL is correct, idempotent, and well-annotated. Architecture decisions AD-W19-001/002/003 are honoured without exception. The RPC is correctly atomic. The Edge Function returns 500 synchronously for missing `AI_GATEWAY_URL`. The AI Gateway `MpsResult` model correctly includes `intent_statement` and `guidance`. Poll timeout `MAX_POLL_ITERATIONS = 600` is correct.

**All 6 blocking failures are ceremony and push-hygiene issues — NOT code quality defects.** The production code is ready. The PREHANDOVER, push, session memory commit, SCOPE_DECLARATION regeneration, and CWT execution are the only outstanding items.

---

## Re-Invocation Requirements

Before re-invoking IAA, the following must ALL be complete and pushed:
1. ✅→ Push 3 local commits to origin
2. ✅→ Create and commit PREHANDOVER-session-wave19-orchestration-20260317.md (non-empty, complete)
3. ✅→ Commit Foreman session memory
4. ✅→ Regenerate SCOPE_DECLARATION.md (Wave 19 file list, A-031 carve-out)
5. ✅→ Execute CWT and record PASS evidence in PREHANDOVER

---

**Token reference**: IAA-session-wave19-orchestration-20260317-REJECTION-R1
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Date**: 2026-03-17
