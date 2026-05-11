# IAA Wave Record — pr1607-rejection-first-handover-protocol — 2026-05-11

**Wave ID**: pr1607-rejection-first-handover-protocol
**Date**: 2026-05-11
**PR**: #1607 — Reinstate rejection-first handover protocol and current-head gate enforcement
**Branch**: copilot/re-establish-failed-gate-protocol
**Issue**: #1607
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA adoption phase at pre-brief**: PHASE_B_BLOCKING

---

## PRE-BRIEF

**Triggering action**: `action: "PRE-BRIEF"` — IAA PRE-BRIEF PROTOCOL invoked by CS2/Foreman
before assurance invocation. Phase 1–4 NOT executed. Pre-brief artifact generated only.

### PR Files Changed (7 files)

| File | Category |
|------|----------|
| `.github/agents/execution-ceremony-admin-agent.md` | AGENT_CONTRACT |
| `.github/agents/foreman-v2-agent.md` | AGENT_CONTRACT |
| `.github/agents/independent-assurance-agent.md` | AGENT_CONTRACT ⚠️ SELF-MOD-IAA-001 |
| `.github/scripts/pre-handover-checkpoint.js` | CI_WORKFLOW (scripts) |
| `.github/scripts/pre-handover-checkpoint.test.sh` | CI_WORKFLOW (scripts) |
| `.github/workflows/handover-claim-gate.yml` | CI_WORKFLOW |
| `governance/checklists/phase4-role-separation-operational-guidance.md` | CANON_GOVERNANCE |

### Qualifying tasks

- **AGENT_CONTRACT**: 3 agent contract files modified (execution-ceremony-admin-agent.md,
  foreman-v2-agent.md, independent-assurance-agent.md) — all require IAA per FAIL-ONLY-ONCE A-002.
- **CI_WORKFLOW**: 2 scripts (.github/scripts/) + 1 workflow (.github/workflows/) modified —
  IAA mandatory per FAIL-ONLY-ONCE A-019 (`.github/scripts/` files qualify as CI_WORKFLOW trigger).
- **CANON_GOVERNANCE**: 1 governance checklist modified (governance/checklists/) — IAA mandatory
  per trigger table CANON_GOVERNANCE row.

**Overall category: MIXED** — AGENT_CONTRACT + CI_WORKFLOW + CANON_GOVERNANCE.
IAA triggered: YES — MANDATORY. Ambiguity: CLEAR (all three trigger categories confirmed).

### Applicable overlay

- **OVL-AC** (AGENT_CONTRACT overlay) — primary overlay for agent contract changes
- **OVL-CI** (CI_WORKFLOW overlay) — for workflow + script changes
- **OVL-CG** (CANON_GOVERNANCE overlay) — for governance checklist change
- **IAA_AGENT_CONTRACT_AUDIT_STANDARD.md** AC-01–AC-07 applies (AGENT_CONTRACT overlay)
- **FAIL-ONLY-ONCE rules in scope**: A-001, A-002, A-003, A-005, A-015, A-019, A-021,
  A-022, A-023, A-026, A-029, A-029b

### Anti-regression obligations

**No** — FBR/NBR-001 through NBR-005 (FUNCTIONAL-BEHAVIOUR-REGISTRY) apply only to
BUILD/AAWP_MAT PRs. This is a governance-only MIXED PR. No product-facing code changes.
NBR pattern library checks NOT required at assurance time.

### Ceremony admin appointed

**NOT DECLARED** for this wave. Wave-current-tasks.md as of 2026-05-10 tracks the prior wave
(PR 1591, wave `layer-down-2026-05-08-481a57b1`) with `execution-ceremony-admin-agent` appointed.
No wave-current-tasks update has been committed for PR 1607 yet.

⚠️ **ECAP appointment is a prerequisite**: Gate `preflight/ecap-admin-ceremony` is currently
FAILING (ECAP-GATE-001). ECAP must be appointed and produce evidence before IAA can be invoked
for full assurance on this PR. See Scope Blockers below.

---

## SCOPE BLOCKERS (must be resolved before IAA full assurance invocation)

### BLOCKER-1 — SELF-MOD-IAA-001 (CONSTITUTIONAL — CS2 ESCALATION REQUIRED)

**Constraint**: SELF-MOD-IAA-001 is ACTIVE and CONSTITUTIONAL. IAA CANNOT review or issue
a verdict on any PR that modifies `.github/agents/independent-assurance-agent.md`.
Attempting to do so triggers HALT-003: "CONSTITUTIONAL VIOLATION. Escalate to CS2."

**File triggering this**: `.github/agents/independent-assurance-agent.md` (6 additions, 0 deletions)

**Required action**: CS2 (@APGI-cmy) must either:
  (a) Review and approve the IAA contract modification directly, OR
  (b) Explicitly authorise IAA to proceed with a scope-limited review that excludes the
      IAA contract file (written CS2 waiver with verbatim quote required per CORE-021), OR
  (c) Separate the IAA contract modification into a standalone CS2-only PR.

**IAA cannot issue ASSURANCE-TOKEN or REJECTION-PACKAGE while this blocker is open.**

---

### BLOCKER-2 — agent-contract/cs2-authorization GATE FAILURE

**Gate**: `agent-contract/cs2-authorization` — FAIL (AGCFPP-001)
**Finding**: No CS2-authorized issue reference found in PR description.
**Required**: PR description must include a reference to the CS2-approved issue authorizing
modification of `.github/agents/` files. Example: `CS2 authorization: #NNN` or `Fixes #NNN`
where NNN is the CS2-approved layer-down issue.
**Fix**: Obtain CS2 (@APGI-cmy) authorization via a layer-down issue. Reference that issue
in the PR description. Push to re-trigger CI.
**Authority**: AGENT_CONTRACT_FILE_PROTECTION_POLICY.md §2, §3 Step 2

---

### BLOCKER-3 — preflight/ecap-admin-ceremony GATE FAILURE

**Gate**: `preflight/ecap-admin-ceremony` — FAIL (ECAP-GATE-001)
**Finding**: Protected-path PR (`.github/agents/` modified) without ECAP evidence.
Anti-self-certification rule violated. `ecap_required: N/A` is NOT acceptable when
protected paths are touched.
**Required**: ECAP agent (execution-ceremony-admin-agent) must be appointed for this wave,
produce an ECAP_GATE_AND_ADMIN_REPORT, and commit the ECAP bundle with
`ecap_required: YES` and qualifying ECAP evidence.
**Fix**: Appoint ECAP agent, update wave-current-tasks.md with `ceremony_admin_appointed`,
produce ECAP bundle at canonical path, commit to branch.

---

### BLOCKER-4 — preflight/scope-declaration-parity GATE FAILURE

**Gate**: `preflight/scope-declaration-parity` — FAIL (PER-PR-SCOPE-REQUIRED)
**Finding**: Per-PR scope declaration not found at `.agent-admin/scope-declarations/pr-1607.md`
**Required**: Create `.agent-admin/scope-declarations/pr-1607.md` using template at
`governance/canon/scope-declaration.template.md`. Required fields: PR_NUMBER, ISSUE,
BRANCH, OWNER, DATE_UTC, OUT_OF_SCOPE, FILES_CHANGED.
**Authority**: SCOPE_DECLARATION_SCHEMA.md v2.0.0, maturion-isms#1521
**FAIL-ONLY-ONCE reference**: A-026

---

### BLOCKER-5 — preflight/gate-changing-pr-rule GATE FAILURE

**Gate**: `preflight/gate-changing-pr-rule` — FAIL
**Finding**: PR modifies gate scripts/workflows without evidence of testing:
  - `.github/scripts/pre-handover-checkpoint.js`
  - `.github/scripts/pre-handover-checkpoint.test.sh`
  - `.github/workflows/handover-claim-gate.yml`
**Required**: Include in PR body one of:
  1. GitHub Actions run ID showing the gate passing with PR context injected, OR
  2. Local command output showing gate script passing with PR_BODY, PR_NUMBER,
     and expected issue number injected, OR
  3. CS2 waiver phrase `CS2-GATE-TEST-WAIVER` in the PR body.
**Reference**: maturion-isms#1542

---

### BLOCKER-6 — handover-claim/check-current-head GATE FAILURE

**Gate**: `handover-claim/check-current-head` — FAIL
**Finding**: "HANDOVER BLOCKED: 27 pending check(s) on HEAD 20b88f5da823."
**Root cause**: A handover/merge-ready claim was posted while 27 CI checks were still
pending on the current HEAD SHA. This is the exact failure pattern that this PR is designed
to prevent — and it is currently exhibiting it.
**Required**: All required CI checks must be GREEN on the current HEAD SHA before any
handover claim can be posted. Resolve Blockers 2–5 first (they are the upstream cause of
the CI failures), re-trigger CI, confirm green, then post a fresh handover claim
accompanied by a PRE_HANDOVER_CHECKPOINT_RESULT comment with `HANDOVER_ALLOWED: yes`.
**FAIL-ONLY-ONCE reference**: A-021 (commit and confirm before claiming)

---

## FAILING GATE RESOLUTION ORDER

The following resolution sequence is recommended (Blockers 2–5 are prerequisites; Blocker 1
requires CS2 action and should be actioned in parallel):

1. **Resolve BLOCKER-1** (CS2 action): CS2 to clarify IAA self-review scope or separate IAA
   contract changes to a standalone CS2 PR.
2. **Resolve BLOCKER-2**: Add CS2-authorised issue reference to PR description. Confirm issue
   #1607 is the CS2-authorizing issue, OR obtain a dedicated authorization issue from @APGI-cmy.
3. **Resolve BLOCKER-4**: Create `.agent-admin/scope-declarations/pr-1607.md` using canonical
   template. Declare all 7 changed files.
4. **Resolve BLOCKER-5**: Produce gate-test evidence for modified scripts/workflow (run ID or
   local output) and include in PR body or linked artifact.
5. **Resolve BLOCKER-3**: Appoint ECAP agent, produce ECAP bundle, commit to branch.
6. **Re-trigger CI** — confirm all preflight gates GREEN on new HEAD SHA.
7. **Resolve BLOCKER-6**: Once all gates are green, post a fresh PRE_HANDOVER_CHECKPOINT_RESULT
   with `HANDOVER_ALLOWED: yes` and `RESULT: HANDOVER_ALLOWED`, then post handover claim.
8. **Invoke IAA for full assurance** — only after all 6 blockers are cleared and CI is green.

---

## PREHANDOVER STRUCTURE (required before IAA full assurance invocation)

The producing agent (CodexAdvisor acting under CS2 direction, per A-005) must commit a
PREHANDOVER proof with the following mandatory sections before IAA is invoked:

| Section | Governing rule |
|---------|----------------|
| `iaa_audit_token: IAA-session-NNN-pr1607-rejection-first-handover-protocol-20260511-PASS` | A-029 §4.3b |
| `## Architecture Ripple/Impact Assessment` | A-020, OVL-AC-012 |
| `## Ripple/Cross-Agent Assessment` | A-023 (AGENT_CONTRACT mandatory) |
| `## Wave Gap Register` | A-020, OVL-AM-005 |
| `## Environment Parity` | A-020, OVL-AM-006 |
| `## CI Check Run Evidence` | A-020, OVL-CI-005 (CI_WORKFLOW PR) |
| `## ECAP Evidence Reference` | ECAP-GATE-001 (BLOCKER-3) |
| ECAP bundle path declared | ACR-01 (ECAP reconciliation) |
| CS2 authorization reference | BLOCKER-2 |
| Scope declaration reference `.agent-admin/scope-declarations/pr-1607.md` | A-026 |

**PREHANDOVER proof path** (canonical): `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-1607-rejection-first-handover-protocol-20260511.md`
**Scope declaration path**: `.agent-admin/scope-declarations/pr-1607.md`
**IAA token path** (written by IAA after verdict): `.agent-admin/assurance/iaa-token-session-NNN-pr1607-rejection-first-handover-protocol-20260511.md`

---

## ADDITIONAL IAA PRE-BRIEF NOTES

### Note 1 — IAA Contract Self-Modification (CRITICAL)

The IAA contract is being modified as part of this PR (6 additions to
`.github/agents/independent-assurance-agent.md`). SELF-MOD-IAA-001 is a constitutional lock.
IAA will trigger HALT-003 if asked to produce a verdict on this PR without CS2 resolution.
This is the single most critical blocker. CS2 must act on this before any assurance invocation.

### Note 2 — Circular Irony Flag (Informational)

This PR reinstates "rejection-first handover protocol and current-head gate enforcement."
The PR itself is currently exhibiting the exact failure mode it is designed to prevent:
a handover/merge-ready claim was posted while CI was pending (Blocker 6). This is
informational only — it does not change the blocking requirements above.

### Note 3 — ceremony_admin_appointed Flag

Per ACR-01: if `ceremony_admin_appointed` is YES for this wave, IAA must apply all
ACR-01 through ACR-16 checks at assurance time. ECAP appointment status for PR 1607
is currently `NOT DECLARED` — this will become `YES` once Blocker 3 is resolved and
ECAP is formally appointed in an updated wave-current-tasks.md.

### Note 4 — FAIL-ONLY-ONCE A-005 Pre-Note

Per A-005 (`.github/agents/` immutability), the producing agent for ALL three agent contract
files MUST be CodexAdvisor-agent acting with explicit CS2 permission. IAA will verify this
at assurance time. If Copilot (the PR author) is not acting as CodexAdvisor-agent or does
not have explicit CS2 authorization for each file, the assurance invocation will produce
a REJECTION-PACKAGE on A-005 grounds.

---

## TOKEN

*(Populated by IAA after full assurance invocation — this section is reserved)*

---

## REJECTION_HISTORY

*(Populated if IAA issues REJECTION-PACKAGE — this section is reserved)*
