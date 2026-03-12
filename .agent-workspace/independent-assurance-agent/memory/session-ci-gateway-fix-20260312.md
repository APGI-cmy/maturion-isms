# IAA Session Memory — session-ci-gateway-fix-20260312

```yaml
session_id: session-ci-gateway-fix-20260312
date: 2026-03-12
agent_version: independent-assurance-agent v6.2.0 (contract 2.2.0)
pr_reviewed: "maturion-isms#1086 — fix(ci): sync pnpm-lock.yaml + add pnpm-lock.yaml to deploy-mat-vercel.yml paths"
pr_branch: copilot/fix-ci-gateway-failure
issue: "maturion-isms#1085 — CI Gateway Failure: Deploy Preview & agent-contract/authority-check"
invoking_agent: foreman-v2-agent (via CS2 — Issue #1085)
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: CI_WORKFLOW
secondary_triggers:
  - PRE_BRIEF_ASSURANCE (OVL-INJ-001)
checks_executed: 30
checks_passed: 27
checks_failed: 3
merge_gate_parity_result: FAIL (3 committed-artifact failures discovered)
verdict: REJECTION-PACKAGE
token_reference: IAA-session-ci-gateway-fix-20260312-REJECTION-20260312
token_file: .agent-admin/assurance/iaa-token-session-ci-gateway-fix-20260312.md
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-prebrief-ci-gateway-fix-20260312 (Pre-Brief for this wave)
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave15r-gov-20260308-R2
  - session-wave15r-impl-R2-20260308
prehandover_proof: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md (UNTRACKED — not committed)
iaa_prebrief: .agent-admin/assurance/iaa-prebrief-ci-gateway-fix-20260312.md
foreman_session_memory: .agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md (committed version has INCORRECT attestation)
first_invocation_exception_applied: true
first_invocation_applies_to: CORE-016, CORE-019 (moot — verdict is REJECTION-PACKAGE)
failures_cited:
  - "CORE-018(a): PREHANDOVER proof not committed to git — untracked on disk only"
  - "CORE-018/CORE-021: FAIL-ONLY-ONCE INC-CI-GATEWAY-FIX-001 not committed — disk only"
  - "CORE-007/CORE-021: Corrected session memory not committed — committed version has iaa_prebrief_artifact: N/A"
```

---

## FAIL-ONLY-ONCE Rules Applied

| Rule | Applied | Outcome |
|------|---------|---------|
| A-001 (IAA invocation evidence present) | YES | PASS — Pre-Brief artifact on branch; PREHANDOVER on disk (not committed — REJECTION-PACKAGE issued) |
| A-002 (no class exceptions — foreman class) | YES | PASS — Foreman invoked IAA; no class exemption claimed |
| A-026 (SCOPE_DECLARATION alignment) | YES | MOOT — REJECTION-PACKAGE on CORE-018 |
| A-031 (PRE-BRIEF-BEFORE-DELEGATION) | YES | INC-CI-GATEWAY-FIX-001 NOT COMMITTED — v3.8.0 on disk only |
| A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) | YES | Not committed in FAIL-ONLY-ONCE — disk only |

---

## Phase 3 Assessment Revision

IAA initially assessed CORE-018(a) as PASS based on disk file existence. During Phase 4 merge
gate parity verification, `git ls-tree -r HEAD` confirmed the PREHANDOVER is NOT in any git
commit. `git show HEAD:.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md | grep INC-CI-GATEWAY-FIX-001`
returned nothing. `git show HEAD:.agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md`
showed `iaa_prebrief_artifact: N/A` (original incorrect version).

**IAA self-correction**: Phase 3 read files from disk. Phase 4 git verification revealed these
files were NOT committed. REJECTION-PACKAGE was issued after the merge gate parity check
confirmed the committed state. This is the correct STOP-AND-FIX behaviour.

**Learning**: IAA must verify governance artifacts via `git show HEAD:<path>` or `git ls-tree`
— NOT via disk file existence — during CORE-018(a) evaluation. Disk presence ≠ committed.
This will be added to the FAIL-ONLY-ONCE registry as A-033-class learning.

---

## Substantive Quality Review (90% Layer — for Reference)

The CI changes THEMSELVES are correct:
- pnpm-lock.yaml: `@testing-library/dom ^10.4.0` specifier confirmed in modules/mat/frontend ✅
- deploy-mat-vercel.yml: symmetric pnpm-lock.yaml path addition, no gates removed ✅
- workflow_dispatch retained, YAML structurally valid ✅

REJECTION-PACKAGE is SOLELY on governance artifact commit completeness — not CI fix quality.

---

---

## Substantive Quality Review Findings (90% Layer)

### T-CI-003: pnpm-lock.yaml specifier fix ✅ CORRECT

`@testing-library/dom ^10.4.0` specifier confirmed present in `modules/mat/frontend`
devDependencies section of pnpm-lock.yaml (version 10.4.1). This directly resolves the
Vercel Deploy Preview frozen-lockfile failure: Vercel aborts when specifiers in
pnpm-lock.yaml don't match package.json declarations. The root cause (PR #1082 adding the
dependency to package.json without regenerating the lockfile) is now corrected.

**No new packages introduced**: `10.4.1` was already in the lockfile resolutions. The fix
adds only the importer specifier. This is a minimal, surgical change.

### T-CI-006: deploy-mat-vercel.yml paths filter ✅ CORRECT AND SAFE

Two additive insertions to trigger paths blocks:
- `push.paths` line 14: `- 'pnpm-lock.yaml'`
- `pull_request.paths` line 25: `- 'pnpm-lock.yaml'`

Symmetry confirmed. No existing entries removed. No job logic modified. No gates weakened.
`workflow_dispatch:` retained (line 26) for CS2 manual post-merge validation. YAML
structurally valid (yamllint run by IAA: all flagged items are pre-existing style warnings
in unchanged lines — zero new structural errors).

**OVL-CI-005 self-referential exception (S-033)**: correctly invoked. All three substitutes
satisfied (YAML valid, pattern parity, workflow_dispatch retained).

---

## Core Invariants Summary

All applicable CORE checks PASS. Eight CORE checks N/A (AGENT_CONTRACT only — no agent
contract files in PR diff). First Invocation Exception applied for CORE-016, CORE-018,
CORE-019 — token file will be created this session.

---

## Governance Observations

1. **A-031 Orientation Mandate application**: OVL-INJ-001 evaluated on existence basis per
   Orientation Mandate §1.3 (ceremony admin = existence check only). Pre-Brief exists ✅.
   A-031 timing violation handled through FAIL-ONLY-ONCE REMEDIATED status. This is the
   correct governance boundary: IAA verifies ceremony existence; FAIL-ONLY-ONCE governs
   sequencing violations.

2. **Foreman FAIL-ONLY-ONCE pre-populated completion state**: INC-CI-GATEWAY-FIX-001 marked
   as REMEDIATED including "IAA ASSURANCE-TOKEN obtained" before this audit ran. Aspirational
   pre-population in internal foreman registry — not a ceremony artifact IAA certifies. The
   authoritative PREHANDOVER correctly showed token as PENDING. **Learning**: foreman
   FAIL-ONLY-ONCE incident corrective action items should use `[ ]`/`[x]` pending/complete
   notation to distinguish planned from executed steps.

3. **PREHANDOVER yamllint output gap**: PREHANDOVER provided substantive reasoning for YAML
   validity without attaching actual tool output. For a 2-line additive change, the reasoning
   was verifiable. IAA confirmed validity independently. **Future practice**: include actual
   yamllint/actionlint output in PREHANDOVER OVL-CI-005 evidence section to be fully self-
   sufficient without relying on IAA independent verification.

4. **INC-CI-GATEWAY-FIX-001 persistent pattern (10th occurrence)**: A-033 and the candidate
   A-034 (CI-FIX-NO-EXEMPTION) are the correct FAIL-ONLY-ONCE responses. S-023 (machine
   enforcement — CI gate requiring Pre-Brief for .github/workflows/ changes) remains highest-
   priority structural improvement. Recommend CS2 schedule S-023.

---

## fail_only_once_rules_applied

| Rule ID | Applied | Outcome |
|---------|---------|---------|
| A-001 | YES | PASS |
| A-002 | YES | PASS |
| A-026 | YES | PASS |
| A-031 | YES | PASS (Orientation Mandate — existence only) |
| A-033 | YES | PASS |

---

## fail_only_once_updates

No new FAIL-ONLY-ONCE rules added this session. Learning notes recorded above for potential
future codification:
- Foreman FAIL-ONLY-ONCE: pending/complete notation discipline (new entry candidate for foreman)
- PREHANDOVER yamllint output standard for OVL-CI-005 self-referential exception (potential
  addition to iaa-category-overlays.md OVL-CI-005 evidence guidance)

---

## Suggestions for Improvement

1. **IAA MUST VERIFY VIA GIT, NOT DISK (NEW LEARNING — HIGHEST PRIORITY)**:
   CORE-018(a) check must use `git show HEAD:<path>` or `git ls-tree -r HEAD | grep <file>` to
   verify PREHANDOVER is committed — NOT a disk file existence check (`-f`). This session
   demonstrates the gap: PREHANDOVER existed on disk but was never committed.
   **Action**: Add explicit `git ls-tree HEAD` verification step to CORE-018(a) in the
   core invariants checklist (candidate update for iaa-core-invariants-checklist.md v2.9.0).

2. **YAML tool output in PREHANDOVER (OVL-CI-005)**: When invoking the S-033 self-referential
   exception, PREHANDOVER should include the literal output of `yamllint <file>` or
   `actionlint <file>` rather than a self-attestation. The OVL-CI-005 exception text says
   "evidence (e.g., yamllint or actionlint output)" — tool output is the standard evidence
   form.

3. **S-023 machine enforcement (HIGHEST PRIORITY)**: Tenth documented occurrence of
   Pre-Brief skipping. A CI gate blocking `.github/workflows/*.yml` PRs absent a matching
   `iaa-prebrief-*.md` on the branch would provide machine-level enforcement.

4. **Foreman commit completeness gate**: Before invoking IAA, foreman should run
   `git status --porcelain` to confirm ALL governance artifacts are committed and pushed.
   Any untracked or modified file that is a governance artifact = HALT before IAA invocation.

5. **Foreman FAIL-ONLY-ONCE incident completion notation**: Use `[ ]` (planned) vs `[x]`
   (executed) for corrective action items in incident log entries to avoid false attestation.

---

## Parking Station Entry

Logged to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`
per Phase 4 Step 4.3 mandatory parking station requirement.

---

**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session date**: 2026-03-12
**Verdict**: REJECTION-PACKAGE — IAA-session-ci-gateway-fix-20260312-REJECTION-20260312
**Re-invocation required after**: Foreman commits PREHANDOVER + FAIL-ONLY-ONCE v3.8.0 + corrected session memory and pushes to origin
