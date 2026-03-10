# IAA Pre-Brief — wave-wf-contract-audit-20260310

**Pre-Brief Version**: 1.0.0
**Date**: 2026-03-10
**Artifact Type**: PHASE_0_PRE-BRIEF
**Authority**: independent-assurance-agent v6.2.0 | CS2 (Johan Ras / @APGI-cmy)
**Wave**: wave-wf-contract-audit-20260310 — Agent-Contract-Audit Workflow Trigger Migration
**Branch**: copilot/update-agent-contract-audit-workflow
**Issue**: "Update agent-contract-audit workflow to use pull_request_target trigger for Copilot agent compatibility"
**Invocation Mode**: RETROACTIVE — code committed before Pre-Brief (POLC violation on record: INC-WCA-PREBRIEF-IMPL-001)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Phase 0 Bootstrap Confirmation

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it."
>
> Tier 2 loaded. Knowledge version: 2.7.0. FAIL-ONLY-ONCE rules A-001 through A-032 active.
> Adoption phase: PHASE_B_BLOCKING. Hard gate ACTIVE.
>
> Wave task file read: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — PRESENT.
> POLC violation note acknowledged: INC-WCA-PREBRIEF-IMPL-001 (Foreman self-implemented before ceremony).
>
> Pre-Brief invocation mode CONFIRMED. Proceeding through Steps 0.2–0.6 ONLY.
> NOT executing Phases 1–4 assurance this session. Those execute at handover invocation.

---

## Step 0.2 — Wave-Current-Tasks Read

Wave: **wave-wf-contract-audit-20260310**
Tasks declared:

| Task ID | Summary | File | Status |
|---------|---------|------|--------|
| T-WCA-001 | Change `pull_request` trigger → `pull_request_target` in `agent-contract-audit.yml` | `.github/workflows/agent-contract-audit.yml` | COMMITTED (pre-protocol — breach registered) |
| T-WCA-002 | Add `ref: ${{ github.event.pull_request.head.sha }}` to all 3 checkout steps | `.github/workflows/agent-contract-audit.yml` | COMMITTED (pre-protocol — breach registered) |

---

## Step 0.3 — Trigger Category Classification

Applying the IAA trigger table (`iaa-trigger-table.md`) to the wave task set:

| Task ID | Files Changed | Category | IAA Triggered? | Rationale |
|---------|--------------|----------|----------------|-----------|
| T-WCA-001 | `.github/workflows/agent-contract-audit.yml` | **CI_WORKFLOW** | ✅ YES — MANDATORY | Workflow file modification. IAA trigger table: CI workflow changes → IAA required. |
| T-WCA-002 | `.github/workflows/agent-contract-audit.yml` | **CI_WORKFLOW** | ✅ YES — MANDATORY | Same file, same category. |

**Secondary overlay applied alongside CI_WORKFLOW:**

| Overlay | Applied? | Rationale |
|---------|---------|-----------|
| INJECTION_AUDIT_TRAIL (OVL-INJ-001) | ✅ YES | CI_WORKFLOW = T2 qualifying PR. Injection audit trail overlay is always applied alongside any triggering category. |

**No AGENT_CONTRACT trigger:** Wave-current-tasks.md confirms no `.github/agents/` files are modified. A-013 (agent contract file immutability) is not applicable here — workflow files are not agent contracts.

**Final trigger summary:**
- **Primary**: `CI_WORKFLOW`
- **Secondary overlay**: `INJECTION_AUDIT_TRAIL`
- **Exempt categories**: AGENT_CONTRACT (not applicable), CANON_GOVERNANCE (not applicable), AAWP_MAT (not applicable)

---

## Step 0.4 — Qualifying Tasks and Required Evidence

### Task T-WCA-001 / T-WCA-002 (treated as single delivery on one file)

| Field | Value |
|-------|-------|
| `task_id` | T-WCA-001, T-WCA-002 |
| `task_summary` | Migrate `agent-contract-audit.yml` from `pull_request` to `pull_request_target` trigger; add `ref: ${{ github.event.pull_request.head.sha }}` to all 3 checkout steps. Single-file change. |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 2 (Alignment), Phase 3 (Assurance Work), Phase 4 (Verdict + Handover) |
| `applicable_overlays` | OVL-CI-001, OVL-CI-002, OVL-CI-003, OVL-CI-004, OVL-CI-005, OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002 |
| `specific_rules` | See §FFA Checks below |

---

## Step 0.4 — FFA Checks IAA Will Run at Handover

This section declares every FAIL-ONLY-ONCE rule and core check that will be applied during Phase 3 assurance at handover. Producing agent must satisfy all of these.

### FAIL-ONLY-ONCE Rules (Mandatory)

| Rule | Check at Handover |
|------|------------------|
| **A-001** | IAA invocation evidence must be present in PR artifacts. For CI_WORKFLOW PRs: PREHANDOVER proof referencing IAA or dedicated token file must exist. |
| **A-002** | No class exemption claim. Foreman self-implementation does not exempt this PR from IAA. |
| **A-003** | Ambiguity resolves to mandatory invocation — no ambiguity present here; CI_WORKFLOW confirmed. |
| **A-021** | Commit before IAA invocation. ⚠️ Code is already committed (SHA 5272fc4) — this satisfies A-021's requirement for a committed fix. However, the violation is that implementation occurred BEFORE governance ceremony, not after. The corrective path is retroactive ceremony completion, not revert (see §Retroactive Assessment below). |
| **A-022** | Re-evaluate ALL trigger categories on every invocation. IAA will re-evaluate at handover. |
| **A-026** | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` at time of IAA invocation. Producing agent must ensure this is accurate before handover. |
| **A-029** | PREHANDOVER proof immutability. `iaa_audit_token` must be pre-populated with expected reference format `IAA-session-NNN-wave-wf-contract-audit-20260310-YYYYMMDD-PASS`. IAA writes dedicated token file post-verdict. PREHANDOVER is READ-ONLY post-commit. |
| **A-031** | IAA ceremony artifacts (parking station/session memory/token file from this Pre-Brief) excluded from SCOPE_DECLARATION when A-031 carve-out note is present. |

### Core Invariants (CORE checks applicable to CI_WORKFLOW)

| Check | What Will Be Verified |
|-------|----------------------|
| **CORE-005** | Governance block present in any contract files (N/A for workflow-only PR — mark accordingly) |
| **CORE-006** | CANON_INVENTORY alignment (workflow files are not canon artifacts — but verify no canon hash corruption from this PR's commits) |
| **CORE-007** | No placeholder content in PREHANDOVER proof or session memory |
| **CORE-013** | IAA invocation evidence present in PR artifacts |
| **CORE-014** | No class exemption claim by invoking agent |
| **CORE-015** | Session memory file committed on branch |
| **CORE-016** | Dedicated IAA token file exists at `.agent-admin/assurance/iaa-token-session-NNN-wave-wf-contract-audit-20260310-YYYYMMDD.md` |
| **CORE-017** | No `.github/agents/` modifications by unauthorized agent. ⚠️ **Pre-Brief advisory**: IAA will verify that SHA 5272fc4 (Foreman commit) touched `.github/workflows/` ONLY and NOT `.github/agents/`. If any agent file was modified → REJECTION-PACKAGE regardless of ceremony status. |
| **CORE-018** | Complete evidence artifact sweep — PREHANDOVER proof present, session memory present, `iaa_audit_token` non-empty, dedicated token file present. |
| **CORE-019** | IAA token cross-verification. First invocation exception applies on initial handover (token file will be created that session). |
| **CORE-020** | Zero partial pass rule. No assumed passes. |
| **CORE-021** | Zero-severity-tolerance. Any finding regardless of size = REJECTION-PACKAGE. |

### CI_WORKFLOW Overlay Checks

| Check | What Will Be Verified |
|-------|----------------------|
| **OVL-CI-001** | **Workflow policy correctness** — Does the `pull_request_target` trigger + `ref: ${{ github.event.pull_request.head.sha }}` correctly implement the intent? Does the workflow correctly check for `.github/agents/**` path filters? IAA will verify the updated trigger still fires correctly on agent contract PRs. |
| **OVL-CI-002** | **Merge gate integrity** — All three gate jobs (`agent-contract/diff-report`, `agent-contract/cs2-authorization`, `agent-contract/iaa-token-verification`) remain present and non-weakened in the updated file. Any gate removed or softened = REJECTION-PACKAGE. |
| **OVL-CI-003** | **Silent failure risk** — IAA will scan for any `continue-on-error`, unguarded exit codes, or silent failure paths introduced or retained in the updated workflow. |
| **OVL-CI-004** | **Environment parity** — Workflow behavior consistent between PR contexts. The `pull_request_target` trigger uses base branch context (not PR head) for secrets — IAA will verify this does not create inconsistency in the gate outcomes. |
| **OVL-CI-005** | **CI evidence present** ⚠️ **CRITICAL REQUIREMENT** — PREHANDOVER must include a CI check run URL or log snippet confirming the `agent-contract-audit.yml` workflow executed successfully on a PR with `.github/agents/**` changes after the trigger migration. This is a **blocking requirement**. Claim without evidence = REJECTION-PACKAGE. |

### INJECTION_AUDIT_TRAIL Overlay Checks

| Check | What Will Be Verified |
|-------|----------------------|
| **OVL-INJ-001** | Injection audit trail present. Evidence hierarchy: **Tier 2 satisfied** — THIS pre-brief artifact (`.agent-admin/assurance/iaa-prebrief-wave-wf-contract-audit-20260310.md`) committed on branch before IAA handover invocation. IAA will verify this file is non-empty and non-placeholder at handover. |
| **OVL-INJ-ADM-001** | Pre-Brief artifact non-empty — THIS file. |
| **OVL-INJ-ADM-002** | Pre-Brief references correct wave — this file declares `wave-wf-contract-audit-20260310` matching `wave-current-tasks.md`. ✅ Match confirmed. |

---

## Step 0.4 — Required PREHANDOVER Proof Structure

The producing agent (or CodexAdvisor orchestrating handover) must commit a PREHANDOVER proof with **all** of the following fields before invoking IAA for final assurance:

```
# PREHANDOVER PROOF — wave-wf-contract-audit-20260310

wave: wave-wf-contract-audit-20260310
branch: copilot/update-agent-contract-audit-workflow
date: YYYY-MM-DD
producing_agent: [agent name + session ID]
invoking_agent: [foreman-v2-agent or CodexAdvisor-agent + session ID]

## Scope Declaration
- `.github/workflows/agent-contract-audit.yml` — trigger migration + checkout ref updates
- `SCOPE_DECLARATION.md` — updated to reflect exact diff
[A-031 carve-out note: IAA ceremony artifacts from prior sessions excluded from scope per A-031]

## CS2 Authorization
Issue: [issue URL — must reference issue opened by @APGI-cmy]
Authorization: [confirm issue opened and assigned by CS2]

## Governance Ceremony Sequence
- [x] IAA Pre-Brief committed: `.agent-admin/assurance/iaa-prebrief-wave-wf-contract-audit-20260310.md`
- [x] POLC violation registered: INC-WCA-PREBRIEF-IMPL-001 in FAIL-ONLY-ONCE.md (A-033 or next available ID)
- [x] wave-current-tasks.md committed on branch
- [x] PREHANDOVER proof committed (this file)
- [x] Session memory committed: `.agent-workspace/[agent]/memory/session-[NNN]-YYYYMMDD.md`

## Technical Correctness Declaration
- Trigger: `pull_request_target` — consistent with preflight-evidence-gate.yml pattern
- Ref: `${{ github.event.pull_request.head.sha }}` added to all 3 checkout steps
- Path filter: `.github/agents/**` retained — no gate weakening
- All 3 gate jobs present and unchanged in logic
- Security: permissions remain `contents: read, pull-requests: read` — no secret access, no write operations

## CI Evidence (OVL-CI-005 — MANDATORY)
[REQUIRED: URL to a GitHub Actions workflow run showing agent-contract-audit.yml
executed successfully on a PR touching .github/agents/** after the trigger migration,
OR a log snippet from the CI run showing the workflow ran and produced expected output.
THIS FIELD CANNOT BE LEFT AS PLACEHOLDER. NO CI EVIDENCE = REJECTION-PACKAGE.]

## IAA Audit Token (pre-populated per A-029)
iaa_audit_token: IAA-session-NNN-wave-wf-contract-audit-20260310-YYYYMMDD-PASS
```

> ⚠️ **CRITICAL NOTE on OVL-CI-005**: The CI evidence field cannot be a placeholder. The
> workflow change must be validated by an actual CI run on a qualifying PR before IAA handover.
> If no such run has occurred at the time of handover invocation, IAA WILL issue
> REJECTION-PACKAGE citing OVL-CI-005. Plan accordingly.

---

## Step 0.4 — Retroactive Ceremony Assessment

Per the POLC violation note (INC-WCA-PREBRIEF-IMPL-001), this Pre-Brief is retroactive.
IAA is asked to assess whether: (a) committed code is technically acceptable, or (b) code must
be reverted and re-delivered.

**Pre-Brief Advisory (not a Phase 3 verdict):**

Based on a preliminary review of the committed state (SHA 5272fc4):

**Technical Assessment (advisory):**
1. The `pull_request` → `pull_request_target` trigger migration is technically correct and consistent with the established pattern in `preflight-evidence-gate.yml` (confirmed in place).
2. `ref: ${{ github.event.pull_request.head.sha }}` added to all 3 checkout steps — confirmed visually.
3. All 3 gate jobs retained — no merge gate weakening observed in preliminary review.
4. Permissions remain `contents: read, pull-requests: read` — mitigating the known `pull_request_target` + `ref: HEAD_SHA` injection risk.

**⚠️ Security Observation (to be formally assessed in Phase 3 under CORE-021):**
The pattern `pull_request_target` + `ref: ${{ github.event.pull_request.head.sha }}` is a
GitHub-documented injection risk when workflows execute scripts from the checked-out code.
IAA will formally assess this at Phase 3 (OVL-CI-001, OVL-CI-003). Preliminary review suggests
the risk is mitigated (read-only permissions, inline scripts only, no secret access), consistent
with the already-approved `preflight-evidence-gate.yml` pattern. **This is an advisory note
only — Phase 3 formal assessment governs.**

**IAA Pre-Brief Determination on Revert Question:**
> IAA Pre-Brief (Phase 0) does NOT issue verdicts. The full binary verdict is issued only at
> Phase 3–4 assurance during handover invocation. However, based on the preliminary assessment:
>
> **Code APPEARS technically correct.** The POLC violation is in governance sequence (ceremony
> bypassed), not in technical correctness of the change itself. A revert is NOT INDICATED on
> technical grounds at this stage. However, IAA will formally verify all OVL-CI checks at
> handover. If any technical finding emerges, REJECTION-PACKAGE will be issued at that point.
>
> **The governance violation (INC-WCA-PREBRIEF-IMPL-001)** must be recorded permanently:
> - Register in FAIL-ONLY-ONCE.md as a new rule (next available ID: A-033 or as assigned)
> - Document in session memory of the producing agent
> - Document in IAA session memory at handover
>
> **Recommended path forward**: Complete the retroactive ceremony (this Pre-Brief is now
> committed), produce PREHANDOVER proof with all required fields, and invoke IAA for Phase 3-4
> assurance. Do NOT revert the committed code unless Phase 3 reveals a technical defect.

---

## Step 0.4 — Scope Blockers and Governance Conflicts Visible Now

### Blocker 1 — OVL-CI-005 CI Evidence (BLOCKING at handover)

**Status**: BLOCKING unless resolved before handover invocation.
**Description**: OVL-CI-005 requires a CI check run URL or log snippet confirming the `agent-contract-audit.yml` workflow executed successfully after the trigger migration. The PR is on a feature branch and may not yet have a qualifying CI run.
**Resolution required before invoking IAA for Phase 3**: Obtain a CI run URL demonstrating the workflow ran successfully on a PR that touches `.github/agents/**`. This may require either (a) merging the PR and observing the first triggered run, or (b) a test PR that touches an agent file.
**IAA disposition**: If this evidence is absent at handover, REJECTION-PACKAGE will be issued citing OVL-CI-005.

### Blocker 2 — POLC Breach Registration in FAIL-ONLY-ONCE.md (Governance Obligation)

**Status**: REQUIRED before handover.
**Description**: INC-WCA-PREBRIEF-IMPL-001 (Foreman self-implementation before ceremony) must be formally registered as a new rule entry in `FAIL-ONLY-ONCE.md`. The breach note currently exists only in `wave-current-tasks.md` — it must be elevated to a permanent governance rule to satisfy IAA's learning integration mandate.
**Rule to add** (producing agent's responsibility, coordinated through CodexAdvisor):
- Next available ID: A-033
- Rule: "IMPLEMENTATION_GUARD_BYPASS — Foreman class agents must never commit production artifacts before completing Phase 1 preflight and invoking IAA Pre-Brief. Any Foreman implementation commit before ceremony = POLC breach. Retroactive ceremony is permitted only when technical correctness is confirmed and breach is permanently registered."
- Incident reference: INC-WCA-PREBRIEF-IMPL-001
**IAA disposition**: IAA will check for this registration at handover. Absent registration = finding under CORE-021 (any finding = REJECTION-PACKAGE).

### Observation — Not Blocking (security advisory pre-Phase-3)

**Status**: ADVISORY (not blocking Pre-Brief, will be formally assessed in Phase 3).
**Description**: `pull_request_target` + `ref: ${{ github.event.pull_request.head.sha }}` injection risk pattern. Mitigated by read-only permissions and inline scripts. Consistent with established pattern in `preflight-evidence-gate.yml`. IAA will formally evaluate under OVL-CI-001 and OVL-CI-003 at Phase 3.

### Observation — Retroactive Pre-Brief Pattern

**Status**: NOTED. Not a separate blocker.
**Description**: This Pre-Brief is retroactive — code was committed before ceremony. The OVL-INJ-001 evidence hierarchy requires the Pre-Brief artifact to have been committed BEFORE builder task artifacts. Since tasks are already committed, OVL-INJ-ADM-001 (non-empty pre-brief) and OVL-INJ-ADM-002 (correct wave reference) are satisfied by THIS file, but the temporal ordering violation is already documented in `wave-current-tasks.md` as INC-WCA-PREBRIEF-IMPL-001. IAA will not re-penalize for this at OVL-INJ-001 beyond what is already registered, provided the PREHANDOVER proof and other required artifacts are in order.

---

## Step 0.4 — Summary Table

| Field | Value |
|-------|-------|
| Wave | wave-wf-contract-audit-20260310 |
| Qualifying tasks | T-WCA-001, T-WCA-002 (both on same file — treated as single delivery) |
| IAA trigger category | CI_WORKFLOW |
| Secondary overlay | INJECTION_AUDIT_TRAIL |
| Exempt tasks | None |
| Required evidence artifacts | PREHANDOVER proof (with CI evidence), session memory, SCOPE_DECLARATION.md, FAIL-ONLY-ONCE.md A-033 entry |
| Blocking requirement | OVL-CI-005 CI evidence (run URL or log snippet) — must be present before handover invocation |
| Governance obligation | Register INC-WCA-PREBRIEF-IMPL-001 as A-033 in FAIL-ONLY-ONCE.md before handover |
| Retroactive code assessment | Code APPEARS technically correct. No revert indicated at Pre-Brief stage. Phase 3 governs. |
| Adoption phase | PHASE_B_BLOCKING — hard gate ACTIVE at handover |

---

## Step 0.5 — Commit Note

This artifact is committed to branch `copilot/update-agent-contract-audit-workflow` as the
canonical Pre-Brief record for wave-wf-contract-audit-20260310.

**Artifact path**: `.agent-admin/assurance/iaa-prebrief-wave-wf-contract-audit-20260310.md`
**Committed by**: independent-assurance-agent v6.2.0 (Phase 0 — Pre-Brief only)

---

## Step 0.6 — Confirmation to Invoking Context

**Pre-Brief complete. Summary:**

1. **Qualifying tasks found**: T-WCA-001, T-WCA-002 (CI_WORKFLOW trigger — IAA mandatory at handover)
2. **Trigger categories**: CI_WORKFLOW (primary) + INJECTION_AUDIT_TRAIL (secondary overlay)
3. **FFA checks declared**: A-001, A-002, A-003, A-021, A-022, A-026, A-029, A-031 + CORE-005 through CORE-022 (applicable subset) + OVL-CI-001 through OVL-CI-005 + OVL-INJ-001/ADM-001/ADM-002
4. **PREHANDOVER proof structure**: Declared above (§Required PREHANDOVER Proof Structure)
5. **Scope blockers**: Two blockers identified — OVL-CI-005 CI evidence (HARD BLOCKING) and FAIL-ONLY-ONCE.md A-033 registration (governance obligation before handover)
6. **Security advisory**: `pull_request_target` + head SHA injection pattern — advisory only, mitigated, formal Phase 3 assessment at handover
7. **Retroactive code assessment**: Code appears technically correct; revert NOT indicated at Pre-Brief stage; Phase 3 governs final determination
8. **Adoption phase**: PHASE_B_BLOCKING — REJECTION-PACKAGE will hard-block PR if any check fails at handover

---

*IAA Pre-Brief — Authority: independent-assurance-agent v6.2.0 | CS2 (Johan Ras / @APGI-cmy)*
*Phase 0 only — Phases 1–4 execute at handover invocation after PREHANDOVER proof is committed*
