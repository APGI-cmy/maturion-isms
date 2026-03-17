# IAA Correction Addendum — Wave: maturion-iaa-bootstrap (2026-03-17)

**Artifact Type**: IAA_CORRECTION_ADDENDUM
**Session ID**: session-waveiaabootstrap-20260317
**Rejection Reference**: `.agent-admin/assurance/iaa-rejection-session-waveiaabootstrap-20260317.md`
**Date**: 2026-03-17
**Branch**: copilot/adopt-standardized-bootstrap-workflow
**Producing Agent**: copilot (builder class)
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This artifact documents the corrections applied to address each finding in the IAA
REJECTION-PACKAGE for wave `maturion-iaa-bootstrap`. It is produced per A-030 (correction
addendum required before re-invocation) and is committed as part of the correction commit
prior to IAA Phase 4 re-invocation.

---

## FINDING-1 Remediation — OVL-CI-001 / CORE-021: Dockerfile COPY Path Mismatch

### Rejection finding summary
The IAA rejection identified that the `Dockerfile` `COPY` instruction and the `README.md`
documented build command used an inconsistent Docker build context:

- **Dockerfile** (line 58): `COPY scripts/agent-runner.sh /usr/local/bin/agent-runner.sh`
- **README.md** (original): `docker build -t maturion-agent-runner .github/runner/`

The build context `.github/runner/` does not contain a `scripts/` subdirectory, so the
`COPY` would fail at Phase 2 when someone follows the documented build command.

### Fix applied — Option B (README + Dockerfile comment updated to use `.github/` context)

**`.github/runner/README.md`** — Build command updated to:
```bash
docker build -t maturion-agent-runner -f .github/runner/Dockerfile .github/
```

**`.github/runner/Dockerfile`** — Inline comment updated to document the same invocation:
```dockerfile
# Build (build context must be .github/ so that COPY scripts/agent-runner.sh resolves):
#   docker build -t maturion-agent-runner -f .github/runner/Dockerfile .github/
```

**Resolution**: With build context `.github/`, the `COPY scripts/agent-runner.sh` instruction
correctly resolves to `.github/scripts/agent-runner.sh` — the actual location of the script.
Both the Dockerfile comment and the README now document the identical and correct invocation.

### Verification

```
Build context:  .github/
COPY source:    scripts/agent-runner.sh  →  .github/scripts/agent-runner.sh  ✅
Destination:    /usr/local/bin/agent-runner.sh
```

The `docker build` command documented in both files will succeed when Phase 2 is implemented
and the container is built.

---

## FINDING-2 Remediation — OVL-CI-001 / OVL-CI-003 / CORE-021: Untrusted Checkout + Execute

### Rejection finding summary
The original workflow checkout and execution pattern in the `run-bootstrap` job used
`ref: ${{ steps.pr-info.outputs.head_ref }}` (the PR HEAD branch), then executed
`.github/scripts/agent-runner.sh` from that checked-out branch. With `issue_comment`
running in a privileged context (full secrets + `contents: write`), this constituted a
code-injection vector: a malicious PR author could submit a tampered `agent-runner.sh`
that exfiltrates `MATURION_BOT_TOKEN` when a collaborator triggers the workflow.

### Fix applied — Trusted default-branch checkout only; artifacts via Contents API

The `maturion-iaa-bootstrap.yml` workflow now implements the following security pattern:

#### 1. Collaborator authorization gate (executes BEFORE any checkout)

```yaml
- name: Verify comment author has write permission
  if: github.event_name == 'issue_comment'
  env:
    GH_TOKEN: ${{ secrets.MATURION_BOT_TOKEN }}
    ACTOR: ${{ needs.parse-command.outputs.actor }}
  run: |
    PERM=$(gh api "repos/${{ github.repository }}/collaborators/${ACTOR}/permission" \
      --jq '.permission' 2>/dev/null || echo "none")
    case "$PERM" in
      admin|write|maintain) echo "Authorization: PASS" ;;
      *) echo "::error::Authorization FAILED"; exit 1 ;;
    esac
```

Only collaborators with `write`, `maintain`, or `admin` permission can proceed past this gate.
A fork author commenting on their own PR cannot trigger privileged execution.

#### 2. Checkout targets DEFAULT BRANCH only — never the PR HEAD

```yaml
- name: Checkout default branch (trusted agent-runner.sh)
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.MATURION_BOT_TOKEN }}
    ref: ${{ github.event.repository.default_branch }}   # ← TRUSTED; not PR HEAD
    fetch-depth: 1
```

There is **exactly one** `actions/checkout@v4` step in the workflow. It always targets
`github.event.repository.default_branch`. The PR HEAD branch is **never checked out**.

#### 3. Agent runner executes from trusted default-branch checkout

`agent-runner.sh` is executed while the workspace contains the default-branch version
of the script — sourced from merged, reviewed, trusted code:

```yaml
- name: Run agent runner
  run: |
    chmod +x .github/scripts/agent-runner.sh
    .github/scripts/agent-runner.sh ...
```

A PR author cannot substitute their own version of `agent-runner.sh` because the PR
branch is never checked out.

#### 4. Artifacts pushed via GitHub Contents API — no PR branch checkout

```yaml
- name: Push governance artifacts to PR branch via API
  run: |
    gh api --method PUT \
      "repos/$REPO/contents/${FILE_PATH}" \
      --field message="$COMMIT_MSG" \
      --field content="$CONTENT_B64" \
      --field branch="$PR_BRANCH"
```

Governance artifacts are committed to the PR branch exclusively via the GitHub Contents
API. No `git checkout` of the PR branch occurs at any point in the workflow. The
`actions/untrusted-checkout` attack vector is fully eliminated.

### Verification of zero PR-head execution paths

| Security property | Evidence |
|-------------------|----------|
| Single checkout step only | `grep -c "actions/checkout" maturion-iaa-bootstrap.yml` → `1` |
| Checkout `ref:` is default branch | Line 213: `ref: ${{ github.event.repository.default_branch }}` |
| No `ref: steps.pr-info.outputs.head_ref` in any checkout | Not present in workflow |
| PR branch written only via API | `gh api --method PUT repos/.../contents/...` |
| Auth gate runs before any privileged operation | Auth step is first step in `run-bootstrap` job |
| CodeQL `actions/untrusted-checkout/high` alerts | 0 (confirmed via `codeql_checker`) |

---

## Summary

| Finding | Severity | Fix Status |
|---------|----------|------------|
| FINDING-1: Dockerfile COPY path vs README build context mismatch | OVL-CI-001 / CORE-021 | ✅ FIXED — README + Dockerfile both use `.github/` build context |
| FINDING-2: Untrusted checkout + execute in privileged `issue_comment` context | OVL-CI-001 / OVL-CI-003 / CORE-021 HIGH | ✅ FIXED — default-branch checkout; API-only PR branch writes; auth gate |

**All findings from the REJECTION-PACKAGE are remediated.** This correction addendum,
together with the committed fixes, satisfies A-030 requirements for re-invocation of
IAA Phase 4.

---

## Re-Invocation Request

IAA Phase 4 re-invocation is requested. Branch:
`copilot/adopt-standardized-bootstrap-workflow`

Per A-030: IAA should re-run all checks (not just the previously failed checks) and
issue an ASSURANCE-TOKEN if all checks pass, or a new REJECTION-PACKAGE if any
additional finding is discovered.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Correction produced by**: copilot (builder class)
**IAA Governance Version**: 6.2.0
