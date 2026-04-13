# IAA Pre-Brief — Wave WF-Dispatch — Workflow Manual Dispatch Fix

**Agent**: independent-assurance-agent
**Wave**: Wave WF-Dispatch — Workflow Manual Dispatch Fix
**Session**: session-157-wave-wf-dispatch-20260306
**Pre-Brief Date**: 2026-03-06
**Branch**: copilot/fix-workflow-trigger-conditions
**Invoking Agent**: foreman-v2-agent
**Authority**: CS2 (@APGI-cmy)
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Wave Summary

Minimal 2-line change to `.github/workflows/deploy-mat-ai-gateway.yml`:
- Line 146 (`deploy-production` job `if:` condition): updated to also allow `workflow_dispatch`
- Line 209 (`cwt` job `if:` condition): updated to also allow `workflow_dispatch`
- Line 57 (`deploy-preview` job): UNCHANGED — `github.event_name == 'pull_request'`

Implementation commit: `fc796d56` — made by a non-ISMS general-purpose Copilot agent (POLC breach acknowledged in wave-current-tasks.md). Foreman is completing governance ceremony.

---

## Task Classification

| Task ID | Task Summary | IAA Trigger Category | Qualifying? |
|---------|-------------|---------------------|-------------|
| TASK-WFD-001 | QP evaluate the 2-line workflow change against the spec | CI_WORKFLOW (`.github/workflows/**` touched) | **QUALIFYING** |
| TASK-WFD-002 | Clear and rewrite SCOPE_DECLARATION.md per A-026 | CI_WORKFLOW — governance ceremony artifact | **QUALIFYING** |
| TASK-WFD-003 | Write PREHANDOVER proof (session-157) | CI_WORKFLOW — ceremony evidence | **QUALIFYING** |
| TASK-WFD-004 | Write session memory (session-157) | CI_WORKFLOW — ceremony evidence | **QUALIFYING** |
| TASK-WFD-005 | Invoke IAA Final Audit | CI_WORKFLOW — IAA audit is mandatory | **QUALIFYING** |
| TASK-WFD-006 | Token ceremony: write `iaa-token-session-157-wave-wf-dispatch-20260306.md` | CI_WORKFLOW — IAA token file | **QUALIFYING** |
| TASK-WFD-007 | Update PR body with `## Governance` block | CI_WORKFLOW — governance ceremony artifact | **QUALIFYING** |

**All 7 tasks are QUALIFYING. This wave is a single CI_WORKFLOW PR with full ceremony.**

---

## IAA Category Declaration

**Trigger Category**: `CI_WORKFLOW`
**Trigger Rule**: Any `.github/workflows/` file created or modified → IAA MANDATORY (Trigger Table v2.1.0, row 3)
**Class Exemption**: NONE PERMITTED — FAIL-ONLY-ONCE A-002 applies

---

## Required Phases

All 4 phases required:

- **Phase 1**: Identity & Preflight (already executed this session)
- **Phase 2**: Alignment — PR category classification, checklist loading
- **Phase 3**: Assurance work — core invariants (CORE-001 through CORE-022) + CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005)
- **Phase 4**: Merge gate parity, verdict, token ceremony, session memory

---

## Required Evidence Artifacts at Handover

IAA will check for ALL of the following at Phase 3/4 invocation. Missing = REJECTION-PACKAGE per CORE-018.

| Artifact | Expected Path | Check |
|----------|--------------|-------|
| PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-157-wave-wf-dispatch-20260306.md` | CORE-013, CORE-018 |
| Session memory (Foreman) | `.agent-workspace/foreman-v2/memory/session-157-wave-wf-dispatch-20260306.md` | CORE-015, CORE-018 |
| SCOPE_DECLARATION.md | `/SCOPE_DECLARATION.md` at repo root | CORE-018 (via A-026) |
| IAA audit token field | `iaa_audit_token` field in PREHANDOVER proof — must contain `IAA-session-157-wave-wf-dispatch-20260306-PASS` (pre-populated reference per A-029 §4.3b) | CORE-016, CORE-018, CORE-019 |
| CI check run URL or log snippet | Embedded in PREHANDOVER proof — confirms workflow ran successfully post-change | **OVL-CI-005 — CRITICAL** |
| PR body `## Governance` block | PR body must contain IAA Category, IAA Audit Token, PREHANDOVER Proof path | CORE-005 (governance block) |

> ⚠️ **OVL-CI-005 is the highest-risk check for this wave.** The PREHANDOVER proof MUST include a CI check run URL or log snippet showing the workflow executed successfully on the branch. A claim without evidence is an automatic REJECTION-PACKAGE. The implementation was committed at `fc796d56` — IAA expects CI to have run on that commit. Foreman must retrieve and embed the CI evidence before invoking IAA.

> ⚠️ **POLC Breach Record**: The implementation was performed by a non-ISMS general-purpose Copilot agent. This is a POLC breach (INC-WFD-POLC-001 candidate). The PREHANDOVER proof must explicitly acknowledge this breach and confirm Foreman has independently QP-verified the change is correct. IAA will look for this acknowledgment in the PREHANDOVER proof.

---

## Applicable Canon Overlays

### Primary Overlay: CI_WORKFLOW (iaa-category-overlays.md v3.1.0)

| Check ID | Check Name | What IAA Will Do |
|----------|-----------|-----------------|
| OVL-CI-001 | Workflow policy correctness | Verify `if:` conditions at lines 146 and 209 exactly match spec: `(github.event_name == 'push' && github.ref == 'refs/heads/main') \|\| github.event_name == 'workflow_dispatch'`. Verify line 57 unchanged: `github.event_name == 'pull_request'`. Verify no other lines changed. |
| OVL-CI-002 | Merge gate integrity | Confirm all required merge gate checks remain present — no gates removed, softened, or made optional. The `deploy-preview` job must still gate on PR events only. |
| OVL-CI-003 | Silent failure risk | Check for unguarded `continue-on-error`, missing exit code checks in the modified job blocks. |
| OVL-CI-004 | Environment parity | Verify `workflow_dispatch` trigger does not bypass staging. Staging must still gate production via `needs:` dependency. |
| OVL-CI-005 | CI evidence present | **CRITICAL** — PREHANDOVER must include CI check run URL or log snippet confirming the workflow executed successfully on the branch post-change. |

### Core Invariants: ALL (iaa-core-invariants-checklist.md v2.6.0)

CORE-001 through CORE-022 apply. Key checks for CI_WORKFLOW PRs:

| Check ID | Notes for This Wave |
|----------|-------------------|
| CORE-007 | Scan for STUB/TODO/FIXME/placeholder in all ceremony artifacts |
| CORE-013 | IAA invocation evidence in PREHANDOVER proof |
| CORE-015 | Session memory file present |
| CORE-016 | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-157-wave-wf-dispatch-20260306.md` |
| CORE-017 | No `.github/agents/` modifications — workflow-only change expected |
| CORE-018 | Complete evidence sweep — all 4 required artifacts present and non-empty |
| CORE-019 | First invocation — token file will be created this session (carve-out applies) |
| CORE-021 | Zero-severity-tolerance — any finding = REJECTION-PACKAGE |

---

## Specific Concerns and Requirements for the Governance Ceremony

### 1. OVL-CI-005 — CI Evidence (HIGHEST PRIORITY)

This is the most likely REJECTION-PACKAGE trigger for this wave. The Foreman MUST:
- Retrieve the CI check run URL for commit `fc796d56` on branch `copilot/fix-workflow-trigger-conditions`
- OR provide a log snippet confirming the workflow did not error on the change
- Embed this in the PREHANDOVER proof before invoking IAA

**If the CI run is not yet available**: commit all ceremony artifacts first (A-021 compliance), wait for CI, then invoke IAA.

### 2. POLC Breach Acknowledgment (PREHANDOVER requirement)

The PREHANDOVER proof must include an explicit section or field acknowledging:
- Implementation was performed by a non-ISMS general-purpose Copilot agent (POLC breach)
- Foreman has independently QP-verified the change is correct against the spec
- Breach is on record as INC-WFD-POLC-001 (pending CS2 acknowledgment)

IAA will not fail the PR on the breach itself (the change is correct and CS2-authorized work overall), but the PREHANDOVER must acknowledge it. Absence = CORE-020 (zero partial pass rule).

### 3. A-021 Compliance — Commit Before IAA Invocation

All ceremony artifacts (PREHANDOVER proof, session memory, SCOPE_DECLARATION.md rewrite, PR body update) must be committed and pushed to the branch before IAA Final Audit invocation. IAA will verify CI is running and the branch is current.

### 4. A-026 — SCOPE_DECLARATION.md Rewrite

SCOPE_DECLARATION.md must be cleared and rewritten to reflect this wave's exact scope:
- 1 file: `.github/workflows/deploy-mat-ai-gateway.yml` (2 lines modified)
- Governance artifacts: PREHANDOVER proof, session memory, SCOPE_DECLARATION.md itself, IAA token file
- NO other files in scope

IAA will run `validate-scope-to-diff.sh` (or equivalent) to verify SCOPE_DECLARATION matches the actual diff.

### 5. Workflow Logic Verification (OVL-CI-001 — pre-confirmed)

IAA has already confirmed in PRE-BRIEF mode (read-only verification):
- Line 146: `if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'` ✅ MATCHES SPEC
- Line 209: `if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'` ✅ MATCHES SPEC
- Line 57: `if: github.event_name == 'pull_request'` ✅ UNCHANGED

OVL-CI-001 is expected to PASS at Final Audit, subject to confirming no other lines changed.

### 6. Merge Gate Dependency Chain (OVL-CI-002 and OVL-CI-004)

IAA will verify at Final Audit:
- `cwt` job `needs: [deploy-production]` remains intact
- `deploy-production` job `needs: test` remains intact
- No job skips staging; `workflow_dispatch` does not create a bypass path to production without the `test` gate

---

## Pre-Brief Artifact Status

| Field | Value |
|-------|-------|
| `wave` | Wave WF-Dispatch — Workflow Manual Dispatch Fix |
| `session` | session-157-wave-wf-dispatch-20260306 |
| `iaa_trigger_category` | CI_WORKFLOW |
| `qualifying_tasks` | TASK-WFD-001 through TASK-WFD-007 (all 7) |
| `required_phases` | 1–4 |
| `highest_risk_check` | OVL-CI-005 — CI evidence present |
| `second_risk_check` | POLC breach acknowledgment in PREHANDOVER |
| `pre_confirmation` | OVL-CI-001 workflow logic pre-verified as correct |
| `adoption_phase` | PHASE_B_BLOCKING — hard gate active |
| `phase_a_advisory` | NO — verdicts are binding |
| `pre_brief_author` | independent-assurance-agent |
| `pre_brief_date` | 2026-03-06 |

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING*
