# IAA Verdict Artifact — Wave CL-10 | LKIAC-L4 Routing Governance CI Enforcement

**Artifact Type**: IAA Verdict Artifact (REJECTION-PACKAGE)
**Agent**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Session**: session-cl10-routing-governance-20260405
**Date**: 2026-04-05
**Wave**: CL-10 — LKIAC-L4 — Routing Governance CI Enforcement
**Branch**: `copilot/cl-10-routing-governance-ci-enforcement`
**Issue**: maturion-isms#1227
**CS2 Authorization**: maturion-isms#1221 (2026-04-05)
**PR Category**: CI_WORKFLOW (primary) + AAWP_MAT (D1 test)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Invoking Agent**: Foreman (foreman-v2-agent)
**Producing Agents**: qa-builder (D1), integration-builder (D2+D3)
**PHASE_B_BLOCKING_TOKEN**: REJECTION-PACKAGE — Merge BLOCKED

---

## Deliverables Under Review

| ID | Deliverable | SHA | Author |
|----|------------|-----|--------|
| CL-10-D1 | `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts` | 501779e | qa-builder |
| CL-10-D2 | `.github/workflows/routing-governance-check.yml` | 43c2d99 | integration-builder |
| CL-10-D3 | `.github/workflows/stub-detection-check.yml` | 43c2d99 | integration-builder |

---

## Phase 2 — Alignment

**Independence check**: CONFIRMED — IAA did not produce any deliverable in this PR.

**PR category**: CI_WORKFLOW (primary, D2+D3) + AAWP_MAT (D1 test deliverable).
Both categories trigger mandatory IAA invocation. No class exemptions claimed.
**Foreman/builder mandate**: APPLICABLE — mandatory invocation confirmed.
**Ambiguity check**: CLEAR — no ambiguity.

**Liveness signal**: UNKNOWN — `last-known-good.md` not checked at file level; CI workflows
are additive-only. Treating as OK with advisory note.

---

## Phase 3 — Assurance Work

### FAIL-ONLY-ONCE Learning Checks (Step 3.1)

**A-001 invocation evidence check**:
- qa-builder PREHANDOVER (`PREHANDOVER-session-cl10-d1-20260405.md`) — COMMITTED at SHA 501779e.
  `iaa_audit_token: IAA-session-cl10-d1-20260405-PASS` — PRESENT ✅
- integration-builder PREHANDOVER (`PREHANDOVER-session-cl10-d2d3-20260405.md`) — EXISTS ON DISK,
  NOT COMMITTED TO GIT. `git ls-files` returns empty. A-033 rule: git not disk.
  `iaa_audit_token` present on disk but UNVERIFIABLE via git. → ABSENT IN GIT ❌
- Foreman PREHANDOVER (`PREHANDOVER-session-cl10-routing-governance-20260405.md`) — EXISTS ON DISK,
  NOT COMMITTED TO GIT. → ABSENT IN GIT ❌

**A-001 verdict**: PARTIAL — D1 evidence committed, D2+D3 evidence NOT committed. FAIL.

**A-002 no-class-exceptions check**: CONFIRMED — no class exemption claimed by any agent.

**A-033 (git not disk) — learning applied from Wave 20**:
Three ceremony artifacts exist on disk but are NOT committed to git:
- `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2d3-20260405.md`
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-routing-governance-20260405.md`
- `.agent-workspace/foreman-v2/memory/session-cl10-routing-governance-20260405.md`
And one modified file staged but not committed:
- `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` (shows `M` in git status)
This is the same pattern that caused the Wave 20 R1 REJECTION-PACKAGE. Recurrence confirmed.

**FUNCTIONAL-BEHAVIOUR-REGISTRY**: NBR-001 (TanStack Query cache invalidation) — NOT APPLICABLE
to this PR (no frontend mutation code). No applicable niggles.

---

### Core Invariants Checklist (Step 3.2)

**CORE-001 through CORE-012**: NOT APPLICABLE — PR category is CI_WORKFLOW + AAWP_MAT,
not AGENT_CONTRACT. No agent contract files in diff. Recording N/A for each.

| Check | Verdict | Evidence |
|-------|---------|---------|
| CORE-001 to CORE-012 | N/A | Not AGENT_CONTRACT PR — skipped per checklist rules |

**CORE-013**: IAA invocation evidence
- Evidence: qa-builder PREHANDOVER committed with expected token reference ✅.
  integration-builder PREHANDOVER NOT committed to git ❌. Foreman PREHANDOVER NOT committed ❌.
- Verdict: **FAIL ❌**
- Finding: integration-builder PREHANDOVER and Foreman PREHANDOVER exist on disk but are absent
  from git. IAA cannot verify the `iaa_audit_token` field in the committed artifact bundle
  for the D2+D3 deliverables. A-033 rule enforced.
- Fix required: Commit both PREHANDOVER proofs to git before re-invoking IAA.

**CORE-014**: No class exemption claim
- Evidence: No class exemption claimed. All agents subject to IAA.
- Verdict: **PASS ✅**

**CORE-015**: Session memory present
- Evidence: `.agent-workspace/foreman-v2/memory/session-cl10-routing-governance-20260405.md`
  exists on disk (5516 bytes). `git ls-files` returns empty — NOT IN GIT.
  The SCOPE_DECLARATION (modified) also shows `M` in git status — NOT committed.
- Verdict: **FAIL ❌**
- Finding: Foreman session memory file exists on disk but is not committed to git.
  A-033 rule (git not disk): IAA verifies via `git ls-files`, not filesystem presence.
- Fix required: `git add` and commit the session memory file and SCOPE_DECLARATION update.

**CORE-016**: IAA verdict evidenced (§4.3b architecture)
- Evidence: This is the FIRST invocation for session-cl10-routing-governance-20260405 on this PR.
  No prior session memory for this session ID exists in `.agent-workspace/independent-assurance-agent/memory/`.
  Token file does not yet exist — it will be created as THIS verdict artifact.
- Verdict: **PASS ✅** — First Invocation Exception applies. Token file created as this document.

**CORE-017**: No .github/agents/ modifications by unauthorized agent
- Evidence: `git diff --name-only 79335b2 HEAD` contains no `.github/agents/` paths.
- Verdict: **PASS ✅**

**CORE-018**: Complete evidence artifact sweep
- (a) PREHANDOVER proof file on branch:
  - qa-builder: `PREHANDOVER-session-cl10-d1-20260405.md` — COMMITTED ✅
  - integration-builder: `PREHANDOVER-session-cl10-d2d3-20260405.md` — NOT IN GIT ❌
  - Foreman: `PREHANDOVER-session-cl10-routing-governance-20260405.md` — NOT IN GIT ❌
- (b) Session memory file on branch:
  - Foreman: `session-cl10-routing-governance-20260405.md` — NOT IN GIT ❌
- (c) `iaa_audit_token` field non-empty in PREHANDOVER proofs:
  - qa-builder: PRESENT in committed file (`IAA-session-cl10-d1-20260405-PASS`) ✅
  - integration-builder: field visible on disk only — UNVERIFIABLE in git ❌
- (d) Dedicated IAA token file: first invocation — First Invocation Exception applies ✅
- Verdict: **FAIL ❌** — items (a), (b), (c) partially failing.
- Finding: Three ceremony artifacts on disk only. SCOPE_DECLARATION update uncommitted.
  CORE-018 is the hardest pre-condition: ANY absent item = immediate REJECTION-PACKAGE.
- Fix required: Commit all four artifacts in a ceremony commit before re-invoking IAA.

**CORE-019**: IAA token cross-verification
- Evidence: First Invocation Exception — no prior token file for this session ID.
  Token file (this document) will be created as part of this invocation.
- Verdict: **PASS ✅** — First Invocation Exception recorded.

**CORE-020**: Zero partial pass rule
- Verdict: **PASS ✅** — all checks issued as binary PASS/FAIL. No partial verdicts.

**CORE-021**: Zero-severity-tolerance
- Verdict: **PASS ✅** — REJECTION-PACKAGE issued. No soft verdicts granted.

**CORE-022**: Secret field naming — N/A (not AGENT_CONTRACT PR). **PASS ✅**

**CORE-023**: Workflow integrity ripple check
- Trigger condition met: PR introduces new `.github/workflows/` files.
- (a) Both new workflow files validated via `python3 yaml.safe_load`: VALID ✅
- (b) The test file `routing-governance-ci.test.ts` is in `modules/mat/tests/...`, which is
  referenced by path trigger `modules/**` in routing-governance-check.yml. However, test files
  are explicitly excluded from D2's grep scan (`--exclude="*.test.ts"`). No conflict. ✅
- (c) No existing workflow job is broken by these additions (additive only). ✅
- Verdict: **PASS ✅**

---

### Category Overlay Checks — CI_WORKFLOW (Step 3.3)

**OVL-CI-001**: Workflow policy correctness

*D2 (routing-governance-check.yml)*:
- Policy states: detect `from 'openai'` and `from '@anthropic-ai/sdk'` in modules/ and apps/,
  excluding maturion-maturity-legacy and test/spec files.
- Implementation: Two separate grep steps, one per provider. Both use correct patterns.
  Pattern `"from 'openai'\|from \"openai\""` correctly catches both single and double-quoted forms.
  Pattern `"from '@anthropic-ai/sdk'\|from \"@anthropic-ai/sdk\""` — same.
- Logic is correct, inversions absent, exit codes correct (`exit 1` on match).
- Local baseline scan: CLEAN (zero violations on current codebase) ✅
- Verdict: **PASS ✅**

*D3 (stub-detection-check.yml)*:
- Policy states: detect `expect(true).toBe(true)` in *.test.ts/*.spec.ts files in modules/,
  apps/, packages/, excluding node_modules/, fixture file, and comment lines.
- Implementation: `STUB_MATCHES=$(grep ... || true)` — the `|| true` prevents grep returning
  exit code 1 on zero matches, which is the CORRECT pattern (grep exit code on no-match is 1,
  which would silently fail the step without `|| true`). The check then explicitly tests
  `[ -n "$STUB_MATCHES" ]` and exits 1 on match. ✅
- Fixture exclusion via `grep -v "routing-governance-ci\.test\.ts"` ✅
- Comment exclusion via `grep -v ":[0-9]*: *\*"` and `grep -v ":[0-9]*: *//"` ✅
- Local baseline: CLEAN ✅
- Verdict: **PASS ✅**

**OVL-CI-002**: Merge gate integrity
- Evidence: `git diff 79335b2 HEAD -- .github/workflows/provider-model-ban.yml` returns empty.
  No existing CI gates modified, softened, or removed. These are additive new gates only.
- Verdict: **PASS ✅**

**OVL-CI-003**: Silent failure risk
- Evidence: No `continue-on-error` in either workflow. D2 uses `if/then/exit 1/fi` — correct.
  D3 uses `|| true` only on the grep command itself (prevents grep no-match from failing
  the STEP before the conditional check runs) — this is intentional and correct, NOT a
  silent failure path. The `if [ -n "$STUB_MATCHES" ]` check correctly enforces the gate.
- Verdict: **PASS ✅**

**OVL-CI-004**: Environment parity
- Both workflows use `ubuntu-latest`, `pull_request` event, `permissions: contents: read`.
  Single consistent environment. No multi-environment concern.
- Verdict: **PASS ✅**

**OVL-CI-005**: CI evidence present

*D2 assessment — self-referential determination*:
D2 has `paths: ['modules/**', 'apps/**']`. This PR modifies only `.github/workflows/`,
`.agent-workspace/`, `.agent-admin/assurance/`, and `modules/mat/tests/...` (a test file).
Wait — the test file IS in `modules/`. Does `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts`
satisfy the `modules/**` path trigger? YES — it is under `modules/`.

Therefore D2 IS triggered on this PR (because `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts`
is in `modules/`). D2 is NOT self-referential by path filter — it WILL run on this PR.

*D3 assessment — self-referential determination*:
D3 has `on: pull_request` (no path filter). D3 fires on every PR. D3 is definitely
triggered by this PR. NOT self-referential.

Since BOTH D2 and D3 trigger on this PR (D2 via `modules/**` match, D3 via no filter),
the S-033 Inherent Limitation Exception does NOT apply to either workflow.
Full CI run evidence is required: a GitHub Actions run URL confirming D2 and D3
executed successfully on this PR.

The integration-builder PREHANDOVER (`PREHANDOVER-session-cl10-d2d3-20260405.md`) would
be the document containing any CI run URL or exception invocation. However, this file
is NOT committed to git. IAA cannot access it as a committed artifact.

Even if examined on disk: no CI run can have occurred yet (this is the branch before PR
opening). A CI run URL requires an open PR on GitHub.

- Verdict: **FAIL ❌**
- Finding: D2 triggers on this PR (modules/mat/tests/ is under `modules/**`). D3 triggers on
  this PR (no path filter). S-033 self-referential exception does NOT apply to either workflow.
  Full CI run evidence (GitHub Actions run URL) is required but cannot be provided before
  the PR is opened. Additionally, the integration-builder PREHANDOVER (which would document
  any exception invocation or CI evidence) is not committed to git.
- Fix required: (Option A) Open the PR on GitHub first, wait for D2 and D3 CI jobs to complete,
  obtain the GitHub Actions run URLs, add them to the integration-builder PREHANDOVER,
  commit the updated PREHANDOVER, then re-invoke IAA with CI evidence attached.
  (Option B) Add `workflow_dispatch:` to both D2 and D3, invoke the S-033 exception in
  the integration-builder PREHANDOVER with (1) YAML validation evidence ✅ already provided,
  (2) pattern parity documentation, (3) workflow_dispatch confirmation — commit updated
  PREHANDOVER and D2/D3 files, then re-invoke IAA.
  **Recommended path**: Option B — add workflow_dispatch to both workflows and invoke S-033
  exception. This is cleaner than waiting for a CI run before IAA review.

---

### Injection Prevention Overlay (OVL-INJ)

**OVL-INJ-001**: Pre-Brief artifact existence
- Evidence: `git ls-files .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-20260405.md`
  → confirmed present. SHA f9db5ab. Committed BEFORE any builder task artifact.
  Pre-Brief commit (f9db5ab, 11:36:40) before D1 commit (501779e, 11:41:34) before D2+D3 (43c2d99, 11:52:01). ✅
- Verdict: **PASS ✅**

**OVL-INJ-ADM-001**: Pre-Brief non-empty
- Evidence: Pre-Brief is 23.5KB with full qualifying task analysis. Non-empty. ✅
- Verdict: **PASS ✅**

**OVL-INJ-ADM-002**: Pre-Brief references correct wave
- Evidence: Pre-Brief header declares `Wave: CL-10 — LKIAC-L4 — Routing Governance CI Enforcement`.
  Matches wave-current-tasks.md. ✅
- Verdict: **PASS ✅**

---

### CL10-FFA Verification (Step 3.1 / FAIL-ONLY-ONCE applied to this wave)

| Check | Evidence | Verdict |
|-------|---------|---------|
| CL10-FFA-001: D1 before D2+D3 | 501779e (11:41:34) before 43c2d99 (11:52:01) — git timestamps confirmed | **PASS ✅** |
| CL10-FFA-002: D2 catches BOTH providers | `grep -c "from 'openai'"` → 3; `grep -c "anthropic"` → 5; both present in D2 | **PASS ✅** |
| CL10-FFA-003: D2 excludes legacy | `--exclude-dir="maturion-maturity-legacy"` present in both grep steps of D2 | **PASS ✅** |
| CL10-FFA-004: D2 scans both modules/ AND apps/ | Both `modules/` and `apps/` in grep command AND in `paths:` trigger | **PASS ✅** |
| CL10-FFA-005: Stub baseline GREEN | Local stub scan returns empty (zero real stubs after fixture/comment exclusion) | **PASS ✅** |
| CL10-FFA-006: provider-model-ban.yml not weakened | `git diff 79335b2 HEAD -- .github/workflows/provider-model-ban.yml` = empty | **PASS ✅** |
| CL10-FFA-007: S-002 traceability | `# Authority: FAIL-ONLY-ONCE S-002` present in stub-detection-check.yml header | **PASS ✅** |

---

### Test Results Verification

Executed locally: `npx vitest run modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts`

```
✓ T-C-010-001: routing-governance-check.yml workflow file exists
✓ T-C-010-002: routing-governance-check.yml contains OpenAI and Anthropic import patterns
✓ T-C-010-003: routing-governance-check.yml covers both modules/ and apps/ directories
✓ T-C-010-004: routing-governance-check.yml excludes maturion-maturity-legacy
✓ T-C-010-005: stub-detection-check.yml workflow file exists
✓ T-C-010-006: stub-detection-check.yml contains expect(true).toBe(true) detection pattern
✓ T-C-010-007: fixture — regex catches direct OpenAI import pattern
✓ T-C-010-008: fixture — regex catches direct Anthropic import pattern
✓ T-C-010-009: fixture — regex catches expect(true).toBe(true) stub pattern

Test Files  1 passed (1)
     Tests  9 passed (9)
   Duration  306ms
```
**All 9 tests GREEN. ✅**

RED/GREEN sequencing verified: D1 committed at 11:41:34 (501779e) while D2+D3 absent → tests T-C-010-001 through T-C-010-006 would have been RED at that commit. After D2+D3 added at 11:52:01 (43c2d99) → all 9 GREEN. Sequencing mandate satisfied. ✅

---

### Assurance Check Results (Step 3.4)

| Category | PASS | FAIL |
|----------|------|------|
| FAIL-ONLY-ONCE learning (A-001, A-002, A-033) | 1 | 2 |
| Core invariants (CORE-001–CORE-023) | 15 | 3 |
| CI_WORKFLOW overlay (OVL-CI-001–005) | 4 | 1 |
| Injection prevention overlay (OVL-INJ) | 3 | 0 |
| CL10-FFA checks (001–007) | 7 | 0 |
| **TOTAL** | **30** | **6** |

---

## Phase 4 — Merge Gate Parity (§4.3)

| Check | Local Result |
|-------|------------|
| YAML validation — routing-governance-check.yml | PASS ✅ |
| YAML validation — stub-detection-check.yml | PASS ✅ |
| Tests: T-C-010-001 through T-C-010-009 | PASS ✅ (9/9) |
| Ceremony artifacts in git (PREHANDOVER × 3, session memory, SCOPE_DECLARATION) | **FAIL ❌** |
| Baseline provider import scan — CLEAN | PASS ✅ |
| Baseline stub scan — CLEAN | PASS ✅ |

**Merge Gate Parity Result**: **FAIL — ceremony artifacts not committed to git**

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/cl-10-routing-governance-ci-enforcement
Wave: CL-10 — LKIAC-L4 — Routing Governance CI Enforcement
Issue: maturion-isms#1227

6 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

PHASE_B_BLOCKING_TOKEN: REJECTION-PACKAGE

FAILURES:

  CORE-013: IAA invocation evidence — D2+D3 evidence chain broken
    Finding: integration-builder PREHANDOVER (PREHANDOVER-session-cl10-d2d3-20260405.md)
    and Foreman PREHANDOVER (PREHANDOVER-session-cl10-routing-governance-20260405.md)
    exist on disk but are NOT committed to git. `git ls-files` confirms absence.
    A-033 rule: IAA verifies via git, not filesystem.
    Fix: git add + commit both files before re-invoking IAA.

  CORE-015: Session memory not committed
    Finding: `.agent-workspace/foreman-v2/memory/session-cl10-routing-governance-20260405.md`
    exists on disk (5516 bytes, `git status` shows as untracked `??`). NOT in git.
    Fix: git add + commit session memory file before re-invoking IAA.

  CORE-018: Incomplete evidence artifact sweep
    Finding: Three ceremony artifacts are disk-only (not git-committed):
    (1) integration-builder PREHANDOVER — untracked
    (2) Foreman PREHANDOVER — untracked
    (3) Foreman session memory — untracked
    (4) SCOPE_DECLARATION — modified on disk, not staged/committed (`M` in git status)
    Any absent item = immediate REJECTION-PACKAGE per CORE-018.
    Fix: Single ceremony commit: `git add` all four files + commit, then re-invoke IAA.

  FAIL-ONLY-ONCE A-001 (A-033 application): Git-not-disk recurrence
    Finding: This is the same pattern as Wave 20 R1 REJECTION-PACKAGE.
    Ceremony artifacts committed on disk before IAA invocation, but not added to git.
    Fix: Before invoking IAA, always run `git ls-files <artifact>` to confirm it is
    tracked in git, not just present on disk.

  OVL-CI-005: CI evidence absent for D2 and D3
    Finding: D2 triggers on this PR (path `modules/mat/tests/ci-governance-check/...`
    satisfies `modules/**`). D3 triggers on all PRs (no path filter). S-033 self-referential
    exception does NOT apply. Full CI run evidence (GitHub Actions run URL) is required.
    Additionally, integration-builder PREHANDOVER not in git — cannot verify S-033 invocation.
    Fix (recommended): Add `workflow_dispatch:` to both D2 and D3 workflows, invoke S-033
    exception in integration-builder PREHANDOVER with YAML + pattern parity evidence,
    commit PREHANDOVER + updated workflow files, then re-invoke IAA.
    OR: Open PR on GitHub, wait for D2+D3 CI runs to complete, record run URLs in
    integration-builder PREHANDOVER, commit, re-invoke IAA.

TECHNICAL SUBSTANCE NOTE:
  The underlying deliverables are of HIGH QUALITY and TECHNICALLY CORRECT:
  - All 9 T-C-010 tests PASS ✅
  - D2 correctly detects OpenAI AND Anthropic imports ✅
  - D2 correctly excludes maturion-maturity-legacy ✅
  - D2 covers both modules/ and apps/ ✅
  - D3 correctly detects stub pattern with proper fixture exclusion ✅
  - No silent failure paths ✅
  - YAML valid for both workflows ✅
  - Baseline clean (zero violations) ✅
  - All CL10-FFA-001 through CL10-FFA-007 PASS ✅
  These failures are CEREMONY ONLY. A single commit fixes CORE-013/015/018.
  OVL-CI-005 requires one additional step (workflow_dispatch + S-033 invocation).

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

---

## Token Ceremony (§4.2b)

**Token file written**: `.agent-admin/assurance/iaa-token-session-cl10-routing-governance-20260405.md` (this file)
**PREHANDOVER proof**: UNCHANGED — immutable post-commit per §4.3b.
Note: qa-builder PREHANDOVER (`PREHANDOVER-session-cl10-d1-20260405.md`) at SHA 501779e is read-only.
integration-builder and Foreman PREHANDOVERs are not yet committed — they are NOT read-only
until committed. Foreman must commit them (without modification) and initiate fresh resolution.

---

## Required Fix Sequence

1. **Ceremony commit** (resolves CORE-013, CORE-015, CORE-018):
   ```
   git add .agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2d3-20260405.md
   git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-routing-governance-20260405.md
   git add .agent-workspace/foreman-v2/memory/session-cl10-routing-governance-20260405.md
   git add .agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md
   git commit -m "chore(ceremony): CL-10 wave ceremony artifacts — PREHANDOVER × 3, session memory, SCOPE_DECLARATION"
   ```

2. **OVL-CI-005 resolution** — either:
   - (A) Open PR → wait for D2/D3 CI runs → obtain run URLs → add to integration-builder
     PREHANDOVER → commit updated PREHANDOVER → re-invoke IAA; OR
   - (B) Add `workflow_dispatch:` to D2 and D3, update integration-builder PREHANDOVER
     to invoke S-033 exception with YAML evidence + pattern parity, commit, re-invoke IAA

3. **Also commit this IAA token file** (required per §4.2b):
   ```
   git add .agent-admin/assurance/iaa-token-session-cl10-routing-governance-20260405.md
   git commit -m "chore(iaa): REJECTION-PACKAGE for CL-10 — ceremony artifacts not committed"
   ```

4. **Re-invoke IAA** after all fixes are committed and pushed.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0 | Contract: 2.3.0
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE — CONSTITUTIONAL
**Stop-and-Fix**: ACTIVE — no PR opens until ASSURANCE-TOKEN issued
