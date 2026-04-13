# IAA REJECTION-PACKAGE — session-wave-node-ripple-20260316-R1

**Agent**: independent-assurance-agent v6.2.0
**Session ID**: session-wave-node-ripple-20260316
**Date**: 2026-03-16
**Verdict**: REJECTION-PACKAGE
**Token Reference**: IAA-session-wave-node-ripple-20260316-REJECT-R1
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## PR Under Review

- **Branch**: copilot/update-node-supabase-cli-workflows
- **Issue**: maturion-isms#1121 — Foreman Orchestration: Ripple Node.js & Supabase CLI version corrections throughout CI/CD workflows
- **Producing Agent**: foreman-v2-agent
- **Invoking Agent**: foreman-v2-agent (Phase 4 handover)
- **PR Category**: CI_WORKFLOW

---

## Substantive Assessment (Quality Engineer 90%)

The substantive changes are **CORRECT**:
- `deploy-mat-ai-gateway.yml:226` → `node-version: '22'` ✅
- `liveness.yml:44` → `node-version: '22'` ✅
- No remaining `node-version: '20'` pins anywhere in `.github/workflows/` ✅
- No `supabase/setup-cli@v2` references anywhere ✅
- `deploy-mat-vercel.yml` already uses `NODE_VERSION: '22'` via env var ✅
- `deploy-mat-edge-functions.yml` already uses `supabase/setup-cli@v1` ✅

The Node.js 20→22 upgrade is the correct governance policy. The REJECTION is procedural only.

---

## Failures

### FINDING-1 — A-021 / CORE-018 / CERT-001 / CERT-002 (CRITICAL)

**Check**: Pre-invocation commit gate — evidence artifacts committed to branch before IAA invocation

**Finding**: PREHANDOVER proof and session memory are UNTRACKED working-tree files:
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-node-ripple-20260316.md` — git status: `??` (untracked)
- `.agent-workspace/foreman-v2/memory/session-wave-node-ripple-20260316.md` — git status: `??` (untracked)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — git status: `M` (modified, not committed)

Per A-021: "working-tree-only fix is not a committed fix and will fail IAA audit."
Evidence bundle does not exist in the repository branch.

**Fix required**:
```bash
git add .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-node-ripple-20260316.md
git add .agent-workspace/foreman-v2/memory/session-wave-node-ripple-20260316.md
git add .agent-workspace/foreman-v2/personal/wave-current-tasks.md
# ALSO update SCOPE_DECLARATION.md (per FINDING-2) before committing
git commit -m "chore: commit wave-node-ripple governance artifacts (PREHANDOVER, session memory, scope)"
git push
```

---

### FINDING-2 — A-026 / BL-027

**Check**: SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD`

**Finding**: Root `SCOPE_DECLARATION.md` is stale from **Wave 18 Post-Merge Hotfix** (session-wave18-postmerge-hotfix-20260315). It declares 20 Wave-18 files including `apps/mat-ai-gateway/services/parsing.py`, `supabase/migrations/20260315000003_wave18_profiles_rls_fix.sql`, etc. This PR's actual diff contains only 2 files:
- `.github/workflows/deploy-mat-ai-gateway.yml`
- `.github/workflows/liveness.yml`

`validate-scope-to-diff.sh` exits 1 (mismatch). Per A-026: "stale = BL-027 merge gate parity failure."

**Fix required**: Overwrite `SCOPE_DECLARATION.md` (and `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`) to list ONLY this wave's changed files, then include it in the same commit with FINDING-1 artifacts:
```
# Wave Node/CLI Ripple Scope Declaration
# Session: session-wave-node-ripple-20260316
# Branch: copilot/update-node-supabase-cli-workflows

- `.github/workflows/deploy-mat-ai-gateway.yml`
- `.github/workflows/liveness.yml`
- `SCOPE_DECLARATION.md`
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-node-ripple-20260316.md`
- `.agent-workspace/foreman-v2/memory/session-wave-node-ripple-20260316.md`
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
- `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md`
- `.agent-workspace/independent-assurance-agent/memory/session-wave-node-ripple-20260316-AUDIT.md` [IAA session memory — to be added]
- `.agent-admin/assurance/iaa-rejection-session-wave-node-ripple-20260316-R1.md` [this file — A-031 carve-out]
```
(Plus CORRECTION-ADDENDUM from FINDING-3 once created)

---

### FINDING-3 — OVL-CI-005

**Check**: CI evidence present for both modified workflow files

**Finding**: PREHANDOVER §4.3 provides only: "Valid YAML — 2 single-line string value changes | PASS". This is a bare assertion — NOT tool output and NOT a CI run URL. The S-033 Inherent Limitation Exception IS applicable for both workflows:

- `deploy-mat-ai-gateway.yml`: Modified job is `cwt` (line 221), which has condition `if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'` — does NOT run on `pull_request`. S-033 applicable.
- `liveness.yml`: Triggers only on `workflow_run` and `workflow_dispatch` — NOT on `pull_request`. S-033 fully applicable.

BUT the PREHANDOVER does NOT explicitly invoke the S-033 exception clause with all 3 required substitutes: (1) actionlint/yamllint tool output, (2) pattern parity documentation, (3) workflow_dispatch confirmed retained. Only (3) is satisfiable by inspection. Per OVL-CI-005: "PREHANDOVER proof MUST explicitly invoke this exception clause with justification — a bare claim of 'CI passed' without evidence still triggers REJECTION-PACKAGE."

**Fix required**: Since PREHANDOVER is immutable post-commit (§4.3b), create and commit a CORRECTION-ADDENDUM:
`.agent-workspace/foreman-v2/memory/CORRECTION-ADDENDUM-session-wave-node-ripple-20260316-OVL-CI-005.md`

Required content:
1. Explicit S-033 invocation with justification for each workflow file
2. `actionlint` output: run `actionlint .github/workflows/deploy-mat-ai-gateway.yml .github/workflows/liveness.yml` and include raw output
3. Pattern parity statement: compare structure to approved equivalent (e.g., `deploy-mat-vercel.yml` which already uses Node.js 22)
4. Confirmation: `workflow_dispatch` retained on both files (deploy-mat-ai-gateway.yml line 16, liveness.yml line 12)

---

## Re-Invocation Instructions

After resolving all 3 findings in a single commit (or sequential commits):

1. Commit PREHANDOVER + session memory + updated SCOPE_DECLARATION.md
2. Commit CORRECTION-ADDENDUM (OVL-CI-005) + actionlint output
3. Update SCOPE_DECLARATION.md to include ALL newly added files
4. Re-invoke IAA: `@independent-assurance-agent [IAA PHASE 4 HANDOVER AUDIT REQUEST] ... (R2 re-invocation)`

**Note**: The A-031 carve-out applies to this rejection artifact (`.agent-admin/assurance/iaa-rejection-session-wave-node-ripple-20260316-R1.md`) — it need not appear in the next SCOPE_DECLARATION.md unless the Foreman chooses to include it.

---

## IAA Session Record

- Session: session-wave-node-ripple-20260316
- Checks executed: 18 applicable
- Checks passed: 13
- Checks failed: 5 (consolidated into 3 root-cause findings)
- Merge gate parity: FAIL
- Verdict: REJECTION-PACKAGE

**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Contract**: 2.2.0
**Lock**: SELF-MOD-IAA-001 ACTIVE
