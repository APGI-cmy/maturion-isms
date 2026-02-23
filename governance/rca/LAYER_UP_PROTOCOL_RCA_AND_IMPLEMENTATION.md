# LAYER-UP PROTOCOL — Root Cause Analysis & Implementation Report

**Date**: 2026-02-23  
**Session**: foreman-v2-049  
**Issue**: Investigate failure to auto-create issue for layer-up protocol  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md  
**Foreman**: foreman-v2-agent v2.2.0

---

## Executive Summary

**Status**: ✅ ROOT CAUSE IDENTIFIED & REMEDIATED

Root cause of the auto-layer-down failure when `GOVERNANCE_LAYER_UP_PROTOCOL.md` was merged into the canonical governance repo (PR #1181):

> **`maturion-isms` had no `repository_dispatch` listener.** The canonical governance repo's `governance-ripple-dispatch.yml` dispatches `repository_dispatch: governance_ripple` events to consumer repos, but `maturion-isms` only had `ripple-integration.yml` which listens for *issues* (not `repository_dispatch` events). As a result, all incoming ripple dispatches were silently ignored.

**Remediation**:
1. ✅ Created `governance-ripple-sync.yml` — handles `repository_dispatch: governance_ripple` 
2. ✅ Created `layer-up-dispatch.yml` — automates layer-up escalation from isms to governance repo

---

## 1. Root Cause Analysis

### 1.1 Expected Flow (per CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md)

```
[Governance Repo] PR merged → governance-ripple-dispatch.yml fires
  → sends repository_dispatch: governance_ripple → consumer repos
    → consumer repo receives event → runs alignment → creates PR
```

### 1.2 Actual Flow (before remediation)

```
[Governance Repo] PR #1181 merged → governance-ripple-dispatch.yml fires
  → sends repository_dispatch: governance_ripple → maturion-isms
    → maturion-isms: NO handler for repository_dispatch
      → event silently dropped
        → NO issue auto-created
          → NO alignment PR created
```

### 1.3 Workflow Gap

| Workflow File | Trigger | Purpose |
|---|---|---|
| `ripple-integration.yml` | `issues: labeled` (governance+layer-down) | Handles issue-based layer-down dispatch |
| `governance-alignment-schedule.yml` | `schedule: hourly` | Scheduled fallback alignment |
| *(missing)* | `repository_dispatch: governance_ripple` | **Handles event-based ripple from governance repo** |

The `governance-ripple-sync.yml` file referenced in investigation reports (session-012-20260215) was either never created or was removed during a refactoring that introduced `ripple-integration.yml`. This left a dead-end in the automated ripple pipeline.

### 1.4 Why GOVERNANCE_LAYER_UP_PROTOCOL.md Was Not Auto-Propagated

1. PR #1181 merged `GOVERNANCE_LAYER_UP_PROTOCOL.md` into `maturion-foreman-governance/main`
2. `governance-ripple-dispatch.yml` dispatched `repository_dispatch: governance_ripple` to isms
3. No workflow in isms handled this event → silently dropped
4. The hourly `governance-alignment-schedule.yml` eventually ran and may have caught the drift, but this is a fallback — not the intended automated ripple
5. No issue was auto-created in isms per protocol expectation

---

## 2. Remediation Delivered

### 2.1 `governance-ripple-sync.yml` (NEW)

**File**: `.github/workflows/governance-ripple-sync.yml`

**Purpose**: Closes the `repository_dispatch` gap. Handles incoming `governance_ripple` events from the canonical governance repo.

**Trigger**: `repository_dispatch: types: [governance_ripple]`

**Flow**:
1. Receives `repository_dispatch: governance_ripple` from governance repo
2. Extracts canonical commit SHA and source metadata from event payload
3. Runs `align-governance.sh` to detect drift
4. If drift detected:
   - Checks if agent contract files changed (CS2 gate)
   - Creates standard PR (auto-merge enabled) if no agent files changed
   - Creates DRAFT PR (CS2 required) if agent files changed
   - Records layer-down receipt in `.agent-admin/ripple/`
5. Supports `workflow_dispatch` for manual testing/recovery

**Parity**: This workflow matches the behaviour of `ripple-integration.yml` for the equivalent code paths, including the CS2 escalation gate for agent file changes.

### 2.2 `layer-up-dispatch.yml` (NEW)

**File**: `.github/workflows/layer-up-dispatch.yml`

**Purpose**: Automates LAYER_UP_PROTOCOL.md Section 6, Phase 3 — escalating validated layer-up issues from maturion-isms to the canonical governance repo.

**Trigger**: `issues: types: [opened, labeled]` — fires when both `layer-up` + `governance-improvement` labels are present.

**Flow**:
1. Validates issue has both required labels
2. Reads source issue content and metadata
3. Checks for duplicates to prevent repeated escalation
4. Creates corresponding issue in `maturion-foreman-governance` with:
   - Title: `[Layer-Up] <original title> (from maturion-isms #N)`
   - Labels: `layer-up`, `governance-improvement`
   - Body: intake instructions for governance-repo-administrator + source issue content
5. Comments on originating issue with cross-reference
6. Records dispatch evidence in `.agent-admin/layer-up/`

**Authority boundary respected**: This workflow only creates issues — it does NOT modify canonical governance files. That authority remains with governance-repo-administrator.

---

## 3. Governance Protocol Compliance

| Requirement | Status | Evidence |
|---|---|---|
| Root cause identified | ✅ DONE | This report, Section 1 |
| Manual layer-down triggered | ✅ Available | `governance-ripple-sync.yml` `workflow_dispatch` input |
| Layer-up infrastructure created | ✅ DONE | `layer-up-dispatch.yml` created |
| Layer-up follows LAYER_UP_PROTOCOL.md | ✅ YES | Phase 1→3 handoff automated |
| Authority boundary respected | ✅ YES | No cross-repo file modifications attempted |
| Auto-merge parity with `ripple-integration.yml` | ✅ YES | Same CS2 gate + auto-merge logic |

---

## 4. Evidence of Prior Work (Phase 1 Already Complete)

The `governance-liaison-isms` agent already completed LAYER_UP_PROTOCOL Phase 1 (Detection & Documentation):

- `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md` — Full evidence package with SHA256 checksums
- `LAYER_UP_PHASE1_COMPLETE.md` — Phase 1 completion report
- `.agent-workspace/governance-liaison-isms/escalation-inbox/layer-up-trs-next-steps-20260213.md` — Escalation document

What was missing was the automated dispatch mechanism (Phase 3 automation) — now provided by `layer-up-dispatch.yml`.

---

## 5. End-to-End Layer-Up Flow (After Remediation)

```
1. Agent/developer creates issue in maturion-isms
   Labels: layer-up + governance-improvement
   
2. layer-up-dispatch.yml triggers
   → Reads issue content
   → Creates issue in maturion-foreman-governance
   → Labels: layer-up + governance-improvement
   → Comments on source issue with cross-reference
   
3. governance-repo-administrator receives intake issue
   → Validates evidence package
   → Classifies priority
   → Drafts governance change PR in canonical repo
   → Obtains CS2 approval
   → Merges PR
   
4. governance-ripple-dispatch.yml in canonical repo fires
   → Dispatches repository_dispatch: governance_ripple
   → All consumer repos receive event
   
5. governance-ripple-sync.yml in maturion-isms triggers
   → Runs align-governance.sh
   → Creates alignment PR (or DRAFT if agent files changed)
   → Enables auto-merge (standard path)
   
6. Loop closed: governance evolved from app learning
```

---

## 6. LAYER_UP_TRS_GOVERNANCE_UPGRADE.md Backlog

The TRS layer-up package from 2026-02-13 is still pending governance intake. With `layer-up-dispatch.yml` now in place, the issue labeled `layer-up` + `governance-improvement` in isms will automatically dispatch to the governance repo when created.

**Action required**: Create or label an issue in isms with:
- Labels: `layer-up`, `governance-improvement`
- Reference: `LAYER_UP_TRS_GOVERNANCE_UPGRADE.md`

The workflow will automatically escalate it to governance.

---

## 7. Known Gaps and Limitations

1. **Cross-repo token permissions**: `layer-up-dispatch.yml` requires `MATURION_BOT_TOKEN` with write access to `maturion-foreman-governance`. If token lacks cross-repo permissions, the workflow falls back to a comment instructing manual escalation.

2. **`ripple-integration.yml` coordination**: Both `ripple-integration.yml` and `governance-ripple-sync.yml` can now process governance alignment. They handle different triggers (issues vs repository_dispatch) and don't conflict, but operators should be aware both paths exist.

3. **Hourly schedule still active**: `governance-alignment-schedule.yml` continues as a safety net. This is by design.

---

**Foreman Session**: 049  
**Date**: 2026-02-23  
**Authority**: LAYER_UP_PROTOCOL.md v1.0.0, CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md  
**Deliverables**: governance-ripple-sync.yml, layer-up-dispatch.yml
