# IAA Rejection Artifact — Session waveiaabootstrap — 2026-03-17

**Artifact Type**: IAA_REJECTION_PACKAGE
**Session ID**: session-waveiaabootstrap-20260317
**Date**: 2026-03-17
**IAA Version**: 6.2.0
**PR Branch**: copilot/adopt-standardized-bootstrap-workflow
**Wave**: maturion-iaa-bootstrap
**Invoking Agent**: foreman-v2-agent
**Adoption Phase**: PHASE_B_BLOCKING

---

## ═══════════════════════════════════════
## REJECTION-PACKAGE
## ═══════════════════════════════════════

**PR**: copilot/adopt-standardized-bootstrap-workflow (Wave maturion-iaa-bootstrap)
**Checks executed**: 21
**Checks passed**: 20
**Checks failed**: 1
**Merge status**: BLOCKED — STOP-AND-FIX required

---

## Failure Detail

### FINDING-1: OVL-CI-001 / CORE-021 — Dockerfile COPY Path Mismatch

**Check**: OVL-CI-001 Workflow policy correctness / CORE-021 Zero-severity-tolerance
**File**: `.github/runner/Dockerfile` line 58
**Severity**: Any finding = REJECTION-PACKAGE (CORE-021 zero-tolerance)

**Evidence**:

The Dockerfile contains:
```
COPY scripts/agent-runner.sh /usr/local/bin/agent-runner.sh
```

The README.md documents the build command as:
```
docker build -t maturion-agent-runner .github/runner/
```

This sets the Docker build context to `.github/runner/`. Within `.github/runner/`, no `scripts/` subdirectory exists. The actual runner script is at `.github/scripts/agent-runner.sh`.

When Phase 2 is implemented and someone follows the documented build command, the Docker build will fail:
```
COPY failed: file not found in build context or excluded by .dockerignore: scripts/agent-runner.sh
```

This is an inconsistency between the Dockerfile COPY path, the README build command, and the actual file structure. The scaffold documents incorrect state.

**Addendum (post-README fix)**: After this rejection artifact was created, `README.md` was updated to document the build command as:
```
docker build -t maturion-agent-runner -f .github/runner/Dockerfile .github/
```
This sets the Docker build context to `.github/`, where `scripts/agent-runner.sh` exists at `./scripts/agent-runner.sh`, so the Dockerfile instruction `COPY scripts/agent-runner.sh /usr/local/bin/agent-runner.sh` is now valid. The analysis above reflects the pre-fix README state and is retained here as an immutable historical record of the original rejection condition.

**Fix required (choose one)**:

**OPTION A** — Update Dockerfile line 58:
```dockerfile
COPY ../scripts/agent-runner.sh /usr/local/bin/agent-runner.sh
```
*(adjusts COPY path to reach `.github/scripts/` from context `.github/runner/`)*

**OPTION B** — Update README.md build command:
```bash
docker build -t maturion-agent-runner -f .github/runner/Dockerfile .github/
```
*(widens build context to `.github/` which contains the `scripts/` directory)*

**OPTION C** — Add a note in the Dockerfile and README that the build context must be the repo root or `.github/`:
```bash
# From repo root:
docker build -t maturion-agent-runner -f .github/runner/Dockerfile .
```

After applying the fix: commit, then re-invoke IAA via task(agent_type: "independent-assurance-agent") with the corrected branch.

---

## Checks Passed (for reference)

| Check | Result |
|-------|--------|
| A-001 IAA invocation evidence | PASS ✅ |
| CORE-005 Governance block | PASS ✅ |
| CORE-006 CANON_INVENTORY alignment (191 canons, 0 bad hashes) | PASS ✅ |
| CORE-007 No placeholder content | PASS ✅ (documented stubs acceptable) |
| CORE-013 IAA invocation evidence | PASS ✅ |
| CORE-014 No class exemption claim | PASS ✅ |
| CORE-015 Session memory present | PASS ✅ |
| CORE-016 IAA verdict (§4.3b First Invocation Exception) | PASS ✅ |
| CORE-017 No .github/agents/ modifications | PASS ✅ |
| CORE-018 Complete evidence sweep | PASS ✅ |
| CORE-019 Token cross-verification (First Invocation Exception) | PASS ✅ |
| CORE-020 Zero partial pass rule | PASS ✅ |
| CORE-023 Workflow integrity ripple check | PASS ✅ |
| OVL-CI-002 Merge gate integrity (AGCFPP-001 intact) | PASS ✅ |
| OVL-CI-003 Silent failure risk | PASS ✅ |
| OVL-CI-004 Environment parity | PASS ✅ |
| OVL-CI-005 CI evidence / S-033 exception (all 3 conditions met) | PASS ✅ |
| OVL-INJ-001 Pre-Brief artifact existence | PASS ✅ |
| Merge gate parity — merge-gate/verdict | PASS ✅ |
| Merge gate parity — governance/alignment | PASS ✅ |

---

## Re-Invocation Instructions

1. Fix the Dockerfile COPY path (or README build command) as described above
2. Commit the correction to the branch `copilot/adopt-standardized-bootstrap-workflow`
3. Per A-030: add a CORRECTION ADDENDUM commit (or note in session memory) documenting this rejection
4. Per A-029: PREHANDOVER proof is immutable — do NOT edit it; initiate a fresh PREHANDOVER if required by Foreman contract
5. Re-invoke IAA: `@independent-assurance-agent [IAA PHASE 4 HANDOVER AUDIT REQUEST]` on the corrected branch
6. IAA will run all checks again and issue ASSURANCE-TOKEN if the fix is complete and no new issues are found

---

## PREHANDOVER Note (§4.3b)

The PREHANDOVER proof `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-waveiaabootstrap-20260317.md`
is **READ-ONLY post-commit** per A-029. It must NOT be modified.

The `iaa_audit_token` field in the PREHANDOVER proof (`IAA-session-waveiaabootstrap-20260317-PASS`)
was pre-populated correctly at commit time per §4.3b. The `-PASS` suffix represents the
**expected** reference — not the actual verdict. The actual verdict is this REJECTION-PACKAGE.

For the re-invocation after fix, the PREHANDOVER proof remains as-is. IAA will write a new
token file upon re-invocation.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
**Adoption Phase**: PHASE_B_BLOCKING — hard gate ACTIVE

---

## ADDENDUM — FINDING-2 (CodeQL HIGH severity security alert)

**Finding**: FINDING-2
**Check**: OVL-CI-001 workflow policy correctness / OVL-CI-003 silent failure risk / CORE-021 zero-severity-tolerance
**Severity**: HIGH — untrusted checkout in privileged workflow (CodeQL alert: actions/untrusted-checkout/high)
**Location**: `.github/workflows/maturion-iaa-bootstrap.yml` lines 176–204

### Description

The workflow uses the `issue_comment` event trigger. The `issue_comment` event runs workflows **with full access to repository secrets and write permissions** — regardless of whether the PR is from a fork or a collaborator.

The `run-bootstrap` job:
1. Checks out the **PR HEAD branch** (potentially from an untrusted fork): `ref: ${{ steps.pr-info.outputs.head_ref }}`
2. **Executes code from that checked-out branch**: `chmod +x .github/scripts/agent-runner.sh && .github/scripts/agent-runner.sh ...`

**Attack vector**: A malicious actor submits a PR from a fork with a tampered `.github/scripts/agent-runner.sh`. Anyone (or an automated bot) comments `/maturion-bootstrap` on that PR. The malicious script executes with:
- `MATURION_BOT_TOKEN` accessible in environment
- `contents: write` + `pull-requests: write` + `issues: write` permissions
- The `git push origin HEAD` capability

The write-path restriction step runs **after** the script — a malicious script could exfiltrate the token before reaching that step.

### Fix required

The root cause is running PR-branch code in a privileged `issue_comment` workflow. The fix is to NOT execute code from the PR branch:

**OPTION A (Recommended)**: Run the agent-runner script from the **BASE branch**, not the PR branch. Check out the default branch first to get the trusted script, then use the GitHub API to commit artifacts directly to the PR branch (without additional checkout):
```yaml
- name: Checkout base branch (trusted script source)
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.MATURION_BOT_TOKEN }}
    ref: ${{ github.event.repository.default_branch }}  # base branch — trusted
```

**OPTION B**: Add an actor authorization check BEFORE the checkout step — only allow actors who are collaborators/org members with write access:
```yaml
- name: Authorize actor
  env:
    GH_TOKEN: ${{ secrets.MATURION_BOT_TOKEN }}
    ACTOR: ${{ needs.parse-command.outputs.actor }}
  run: |
    set -euo pipefail
    PERMISSION=$(gh api "repos/${{ github.repository }}/collaborators/${ACTOR}/permission" \
      --jq '.permission' 2>/dev/null || echo "none")
    if [[ "$PERMISSION" != "admin" && "$PERMISSION" != "write" && "$PERMISSION" != "maintain" ]]; then
      echo "::error::Actor '${ACTOR}' does not have write access. Aborting."
      exit 1
    fi
```

**OPTION C**: Remove the `issue_comment` trigger entirely. Rely on `workflow_dispatch` only (which already requires actor to have workflow dispatch permission — a trusted control).

**Total failures**: FINDING-1 (Dockerfile COPY path) + FINDING-2 (untrusted checkout security vulnerability) = **2 failures**.
