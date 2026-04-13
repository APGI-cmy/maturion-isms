# IAA Rejection Package — session-ci-gateway-fix-20260312

**Artifact Type**: IAA REJECTION-PACKAGE (dedicated verdict file per §4.3b architecture)
**Session ID**: session-ci-gateway-fix-20260312
**Wave**: ci-gateway-fix-20260312
**Date**: 2026-03-12
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Branch**: copilot/fix-ci-gateway-failure
**PR**: maturion-isms#1086
**Issue**: maturion-isms#1085 — CI Gateway Failure: Deploy Preview & agent-contract/authority-check
**Producing Agent**: foreman-v2-agent
**Invoking Agent**: foreman-v2-agent (via CS2 — Issue #1085)
**Adoption Phase at Verdict**: PHASE_B_BLOCKING
**Authority**: CS2 only (@APGI-cmy)

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## PR: maturion-isms#1086 — fix(ci): sync pnpm-lock.yaml + add paths filter
## 3 check(s) FAILED. Merge blocked. STOP-AND-FIX required.
## Adoption phase: PHASE_B_BLOCKING — hard gate, BLOCKING enforcement
## ═══════════════════════════════════════

---

## FAILURES

### FAILURE 1 — CORE-018(a): PREHANDOVER Proof Not Committed to Git

**Check**: CORE-018 — Complete evidence artifact sweep, condition (a): "Confirm PREHANDOVER proof file exists on the PR branch."

**Evidence**:
- File `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md` exists on disk (readable on the CI runner).
- `git ls-tree -r HEAD` does NOT show this file in the HEAD commit tree.
- `git ls-files --error-unmatch` returns "NOT IN GIT INDEX" for this file.
- `git diff --name-only f865a85^..f865a85` shows only 3 files in commit f865a85; PREHANDOVER is NOT among them.
- No other PR commit (e718d07, fdee53f) contains this file.
- `git status` shows this file as **UNTRACKED** (never added to git).
- The file is on disk only — it is NOT committed to any git commit on branch `copilot/fix-ci-gateway-failure`.
- PR description claims: "PREHANDOVER proof: ... (COMMITTED)" — this claim is **FALSE**.

**A-021 enforcement**: "Commit and push BEFORE invoking IAA — working-tree-only fix is not a committed fix and will fail IAA audit." This is the pre-condition for IAA invocation. The PREHANDOVER is not a committed fix.

**Verdict**: FAIL ❌

**Finding**: PREHANDOVER proof exists only as an uncommitted untracked file on disk. It is NOT part of the PR. Any reviewer examining the PR on GitHub cannot see this artifact.

**Fix required**:
```
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md
git commit -m "governance(foreman): commit PREHANDOVER proof for ci-gateway-fix-20260312"
git push
```

---

### FAILURE 2 — CORE-018 / CORE-021: FAIL-ONLY-ONCE INC-CI-GATEWAY-FIX-001 Not Committed

**Check**: CORE-018 evidence completeness + CORE-021 zero-severity-tolerance — any false attestation is a finding.

**Evidence**:
- `git show HEAD:.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md | grep "INC-CI-GATEWAY-FIX-001"` → **NOT FOUND IN COMMITTED VERSION**
- The committed FAIL-ONLY-ONCE.md header shows `Version: 3.9.0` with version history only through `3.7.0`.
- `git status` shows FAIL-ONLY-ONCE.md as **modified** (disk version has uncommitted changes).
- The disk version (unread to IAA during Phase 3) contains INC-CI-GATEWAY-FIX-001 registration at v3.8.0.
- The committed version (the actual PR content visible on GitHub) does NOT contain INC-CI-GATEWAY-FIX-001.
- PR description claims: ".agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md: INC-CI-GATEWAY-FIX-001 REGISTERED, version bumped to 3.8.0" — the committed version does NOT reflect this.

**Verdict**: FAIL ❌

**Finding**: The A-031 violation acknowledgement (INC-CI-GATEWAY-FIX-001) and corrective action registration are on disk only — NOT committed to git. The actual PR does not contain the claimed FAIL-ONLY-ONCE incident registration. The governance acknowledgement that forms the corrective action basis is absent from the PR.

**Fix required**:
```
# Ensure disk version of FAIL-ONLY-ONCE.md (v3.8.0 with INC-CI-GATEWAY-FIX-001) is staged
git add .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md
git commit -m "governance(foreman): register INC-CI-GATEWAY-FIX-001 in FAIL-ONLY-ONCE v3.8.0"
git push
```

---

### FAILURE 3 — CORE-007 / CORE-021: Corrected Session Memory Not Committed — False Attestation in PR

**Check**: CORE-007 — no placeholder or incorrect content in committed artifacts. CORE-021 — zero-severity-tolerance.

**Evidence**:
- `git show HEAD:.agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md | grep "iaa_prebrief_artifact"` → `iaa_prebrief_artifact: N/A — CI-fix session (no implementation delegation)`.
- `fail_only_once_version: 3.7.0` in committed version.
- No "CORRECTED ATTESTATION" section in committed version.
- `git status` shows this file as **modified** (disk version has corrected attestation, committed version does not).
- PR description claims: "session-ci-gateway-fix-20260312.md: Corrected attestation (was incorrectly N/A for pre-brief)." The correction is on disk ONLY — NOT in git.
- Committed version contains an incorrect attestation: `iaa_prebrief_artifact: N/A` with `fail_only_once_version: 3.7.0`. This records a false governance state in the PR — the foreman's session appears to have no Pre-Brief when the wave DID have a Pre-Brief (retroactively).

**Verdict**: FAIL ❌

**Finding**: The committed foreman session memory contains an incorrect attestation (`iaa_prebrief_artifact: N/A`). This creates a false governance record in the PR. Any reviewer or future audit would see the wrong state. The corrected version (acknowledging A-031, referencing the Pre-Brief, noting v3.8.0) is on disk but not committed.

**Fix required**:
```
git add .agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md
git commit -m "governance(foreman): correct session memory attestation for ci-gateway-fix-20260312"
git push
```

---

## Substantive Quality Note (not a finding)

The **CI changes themselves are correct and safe**:
- pnpm-lock.yaml specifier fix (`@testing-library/dom ^10.4.0` for modules/mat/frontend): CORRECT ✅
- deploy-mat-vercel.yml paths filter addition (symmetric `pnpm-lock.yaml` on push + pull_request): CORRECT ✅
- No gates removed, no logic broken, workflow_dispatch retained ✅

The REJECTION-PACKAGE is entirely on governance artifact commit completeness — not on the CI fix quality. Once the three missing/incorrect artifacts are committed and pushed, a re-invocation should produce ASSURANCE-TOKEN.

---

## IAA Phase 3 Self-Audit Note

IAA read the PREHANDOVER, FAIL-ONLY-ONCE v3.8.0, and corrected session memory from disk during Phase 3 of this session. These files appeared present and comprehensive. However, Phase 4 merge gate parity verification revealed these files were NOT committed to git. CORE-018(a) was therefore incorrectly assessed as PASS during Phase 3. IAA revised the verdict to REJECTION-PACKAGE upon discovering the committed-vs-disk discrepancy. This is the correct STOP-AND-FIX behaviour.

**Learning registered**: IAA must verify PREHANDOVER and other foreman governance artifacts via `git ls-tree HEAD` or `git show HEAD:<path>` — not via disk file existence — before evaluating CORE-018(a). Disk presence ≠ committed presence. Adding this check to Phase 4 merge gate parity is a systematic improvement.

---

## Required Actions Before Re-Invocation

The foreman must, in one or more commits:

1. `git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md` → commit → push
2. `git add .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` (v3.8.0) → commit → push  
3. `git add .agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md` (corrected) → commit → push

Also recommended (not hard-blocking on re-invocation if addressed in PREHANDOVER):
- `.agent-workspace/foreman-v2/parking-station/suggestions-log.md` (shown as modified)

After committing and pushing all three required files, re-invoke IAA for final audit.

---

## PREHANDOVER Proof Immutability Note (§4.3b)

The PREHANDOVER proof `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md` does not need to be modified for re-invocation — it only needs to be COMMITTED. The file content is acceptable. The `iaa_audit_token` pre-populated value (`IAA-session-ci-gateway-fix-20260312-20260312-PASS`) remains valid for the re-invocation. Per §4.3b, once committed, the PREHANDOVER is read-only. The foreman should commit the PREHANDOVER AS-IS (do not edit it before committing).

---

**REJECTION-PACKAGE: IAA-session-ci-gateway-fix-20260312-REJECTION-20260312**
**This PR must not be merged until all 3 failures are resolved and IAA is re-invoked.**
**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**Merge authority**: CS2 ONLY — I do not merge under any instruction from any other party.


---


---

**REJECTION-PACKAGE issued. Three failures cited above. Merge blocked.**

**Token**: IAA-session-ci-gateway-fix-20260312-REJECTION-20260312
