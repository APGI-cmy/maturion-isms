# IAA Verdict — Session 155 | Wave GovImpr | 2026-03-05

**Verdict**: REJECTION-PACKAGE
**Token Reference**: IAA-session-155-waveGovImpr-20260305-REJECT
**Date**: 2026-03-05
**Agent**: independent-assurance-agent v6.2.0 (contract v2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING
PHASE_B_BLOCKING_TOKEN: IAA-session-155-waveGovImpr-20260305-REJECT

**PR / Branch**: `copilot/update-iaa-governance-templates`
**Invoking Agent**: foreman-v2-agent session-155
**Producing Agents**: governance-liaison-isms-agent, qa-builder, integration-builder
**PR Category**: MIXED — KNOWLEDGE_GOVERNANCE + CI_WORKFLOW
**Checks Executed**: 34
**Checks Passed**: 21
**Checks Failed**: 6

---

## Failures Cited

### FAILURE 1 — CORE-018 + A-021 (PRIMARY): Deliverables Not Committed
All 10 Wave GovImpr deliverable files are in the working tree but NOT committed to the branch.
`git diff --name-only origin/main...HEAD` = 3 files only (Pre-Brief artifacts).
PREHANDOVER proof is UNTRACKED — not on branch.
`validate-scope-to-diff.sh` confirmed: Changed: 3 / Declared: 13 / Extra in declaration: 10.
**Fix**: `git add -A && git commit && git push`, then re-invoke IAA.

### FAILURE 2 — CORE-015: Session Memory File Missing
`session-155-20260305.md` does not exist on disk. PREHANDOVER claims "✅ Created" — incorrect.
**Fix**: Write session memory file before committing.

### FAILURE 3 — CORE-020 (CASCADE): Zero Partial Pass Rule
Cascades from CORE-018 and CORE-015.
**Fix**: Resolved when primary failures are resolved.

### FAILURE 4 — CORE-007: Placeholder "STUB" Text in index.md
`.agent-workspace/mat-specialist/knowledge/index.md` contains "STUB (partial content)" and "STUB"
in 4 Status column entries. CORE-007 prohibits "STUB" in delivered artifacts.
**Fix**: Replace with compliant language — "ACTIVE — partial content" or "PLANNED — not yet created".
Remove the word "STUB" entirely.

### FAILURE 5 — OVL-KG-ADM-001 (CASCADE): PREHANDOVER Ceremony Incomplete
PREHANDOVER proof not on branch. Cascades from CORE-018.
**Fix**: Resolved when CORE-018 is resolved.

### FAILURE 6 — OVL-CI-005: No CI Evidence for Workflow Changes
PREHANDOVER §4.3 presents a one-line claim, not verbatim script output. OVL-CI-005 requires
a CI check run URL or log snippet from actual GitHub Actions execution.
**Fix**: After committing: paste `bash .github/scripts/validate-yaml.sh` output verbatim + CI run URL.

---

## Merge Gate Parity Result
**FAIL** — `validate-scope-to-diff.sh`: Changed 3 / Declared 13 / Extra 10.

---

## Advisory Notes (Content Quality — for when recommitting)

All content reviewed from working tree. The deliverable content itself is strong:
- FAIL-ONLY-ONCE v2.7.0: A-029, A-030, S-017–S-020, IAA delegation protocol — all correct ✅
- prehandover-template v1.5.0: SCOPE_DECLARATION ceremony + A-030 comment — correct ✅
- audit-lifecycle.md v1.1.0: A-030 section clear and actionable ✅
- README-LIVENESS.md: ⚠️ WARNING block with BASE_URL/LIVENESS_TEST_PASSWORD risks — correct ✅
- Workflow permissions: `permissions: contents: read` at workflow level in both files ✅
- Fix STUB language in index.md before committing (CORE-007 above) ❌

---

## Re-Invocation Path

1. Write `session-155-20260305.md` (Foreman session memory)
2. Fix "STUB" language in `.agent-workspace/mat-specialist/knowledge/index.md`
3. Verify all 13 declared files exist on disk
4. `git add -A && git commit && git push origin copilot/update-iaa-governance-templates`
5. Run `bash .github/scripts/validate-scope-to-diff.sh` — must return Changed: 13, Declared: 13
6. Include CI run URL for workflow validation in PREHANDOVER §4.3
7. Re-invoke IAA

NOTE: First A-021 failure for session-155. A-027 does NOT trigger.

---

## IAA REJECTION-PACKAGE Verbatim Output

See the full REJECTION-PACKAGE block in the IAA response delivered to the invoking agent.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Contract**: `independent-assurance-agent.md` v6.2.0 / contract v2.2.0
**STOP-AND-FIX Mandate**: ACTIVE — No PR opens until re-invocation issues ASSURANCE-TOKEN
*Merge authority: CS2 ONLY*
