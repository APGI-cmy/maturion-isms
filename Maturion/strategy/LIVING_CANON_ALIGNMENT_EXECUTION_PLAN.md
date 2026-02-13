# LIVING CANON ALIGNMENT — STRATEGY (CANON → EXECUTABLE → LIVING)
**Strategy ID**: LCAS-001  
**Status**: Strategy (to be compiled into canon + executable enforcement)  
**Authority**: CS2 (non-delegable for governance and agent contract changes)  
**Scope**: Entire APGI-cmy ecosystem (governance repo + all consumer repos)  
**Operating Philosophy**: Proactive compliance, stop-and-fix, zero test debt, zero test dodging, no “later”, evidence-first, deterministic automation

---

## 0) Strategic Objective

Build a **fully automated, self-aligning, self-improving governance ecosystem** where:

1. Canonical governance is authored in a single canonical repository.
2. All consumer repositories automatically detect governance drift and self-align via PRs.
3. All PR merges are **governance-verified**, not reactive, and never depend on manual log archaeology.
4. Agents operate proactively: they run prehandover checks, stop-and-fix before handover, and only submit work that will pass merge gates.
5. Every job produces improvement capture (“how could this have been done better”) without scope drift, via a governed parking mechanism.
6. Governance evolves through controlled promotion (CS2 authorization), and ripples down deterministically.

**Non-negotiable end state**: A living agent system with **automated cross-repo workflow activities** executed via **Maturion Bot** (execution identity) using **push-based ripple** with **scheduled fallback** for resilience.

---

## 1) Why This Strategy Exists (Problem Statement)

### 1.1 The ecosystem is currently inconsistent
- Different repositories expose different numbers and names of PR checks (1, 3, 15, 30+).
- Some checks run only `on: push`, making them unreliable as PR merge requirements.
- Branch protection becomes difficult to configure safely; auto-merge can deadlock or allow unintended merges.

### 1.2 Canon drift detection is not yet deterministic enough
- Canon inventory contains placeholder hashes and/or truncated hashes.
- Placeholder hashes prevent strict drift validation.
- Truncated hashes reduce integrity assurance and auditability.

### 1.3 The system must remain proactive and resilient
- CI failures are costly because agents/humans cannot reliably interpret logs.
- A resilient system must prevent predictable failures by enforcing prehandover evidence and deterministic merge-gate verification.
- Cross-repo ripple must be immediate, but also resilient to transient dispatch failures.

---

## 2) The 3-Layer Model (Strategy → Canon → Executable)

This strategy MUST be “compiled” into two downstream layers:

### Layer A — Strategy (this file)
Defines intent, principles, target architecture, and rollout approach.

### Layer B — Canon (governance/canon/)
Defines the **normative requirements** (MUST/SHALL) for:
- canonical inventory integrity
- consumer alignment behavior
- evidence artifacts + schemas
- merge gate interface standard
- stop-and-fix + RCA + improvement capture obligations
- ripple propagation expectations and SLAs
- execution identity boundaries (Maturion Bot)
Canon changes require CS2 authorization.

### Layer C — Executable Enforcement (workflows/scripts/schemas)
Implements canon via:
- GitHub Actions workflows (PR gates, ripple dispatch, alignment PR creation)
- deterministic scripts (hashing, syncing, validation)
- schemas for evidence artifacts
- validators (fast failure, evidence-first)
Executable enforcement is the mechanism that makes governance “alive”.

---

## 3) Execution Identity — Maturion Bot (Required)

### 3.1 Purpose
Maturion Bot is a **non-judgment execution identity** used by GitHub Actions to:
- create branches
- commit changes
- open PRs
- comment on PRs/issues
- (optional) dispatch ripple events across repos

Maturion Bot is **not an agent** and holds no discretionary governance authority.

### 3.2 Token and Secret Standard
All repos MUST use:
- Actions secret: `MATURION_BOT_TOKEN`

Governance repo (for ripple dispatch) MUST use:
- Actions secret: `RIPPLE_DISPATCH_TOKEN` (may be the same token if scope permits)

### 3.3 Permission Boundaries (Least Privilege)
The bot token MUST be fine-grained and limited to selected repos with:
- Contents: Read/Write
- Pull requests: Read/Write
- Issues: Read/Write
- (If dispatch is used) appropriate permissions to send repository_dispatch to target repos

### 3.4 Safety Rules
- Bot MUST NOT push directly to `main`. All writes occur via PR branches.
- Token rotation policy MUST exist (canon will define frequency and incident response).
- If token fails or expires, scheduled fallback alignment MUST continue (with degraded reporting).

---

## 4) Canonical Inventory as the Machine Source-of-Truth

### 4.1 Canonical Inventory Contract
Canonical repository MUST publish:
- `governance/CANON_INVENTORY.json`

Consumer repos MUST treat it as the authoritative machine contract.

### 4.2 Integrity Requirements (Missing Nuances to Fix)
To be deterministic and auditable:

1. **No placeholders** for any artifact classified as required for consumer alignment (e.g., `PUBLIC_API`).
2. Hashes MUST be strong and unambiguous:
   - Preferred: full `sha256`
   - Optional: also store full `git_blob_sha`
3. Canon inventory MUST be tied to provenance:
   - record the canonical commit SHA used when generating the inventory
4. Inventory MUST be reproducible:
   - same content → same hash
   - generation_timestamp is informational only

### 4.3 Consumer repos do NOT store canon inventory as truth (Option 1)
Consumers fetch canonical inventory at runtime.
Consumers store only local sync state:
- `.agent-admin/governance/sync_state.json` (machine state; not canon)

### 4.4 Failure Mode: Incomplete Canon Inventory
If any required canon entry has missing/placeholder hash:
- Consumer alignment operates in **DEGRADED** mode
- Consumer MUST create a Governance Change Request issue upstream (CS2 authorization required)
- Consumer MUST proceed only with entries that are verifiable

---

## 5) Alignment Loop (Distributed Execution, Central Policy)

### 5.1 Alignment Triggers (Mandatory Both)
Consumers MUST support both:

1. **Push-based ripple (mandatory)** — for immediacy  
2. **Scheduled fallback (mandatory)** — for resilience  

This ensures:
- immediate propagation when governance changes
- recovery if dispatch fails or a repo is temporarily unavailable

### 5.2 Push Ripple Transport (Mandatory)
**Canonical governance repo** MUST dispatch ripple events to consumer repos upon:
- merge to main that changes governance canon/policy/executable enforcement artifacts
- published inventory version change

**Consumer repos** MUST:
- listen for `repository_dispatch` events
- run alignment immediately on receipt
- record the ripple event payload in evidence artifacts

**Target repo enumeration MUST be deterministic**:
- defined by a canonical list (canon will define the source of truth), e.g.:
  - `governance/CONSUMER_REPO_REGISTRY.json` (preferred)
  - or a canonical inventory field that lists consumer repos

### 5.3 Scheduled Fallback (Mandatory)
Each consumer repo MUST run alignment on a schedule:
- recommended every 1 hour (minimum: daily)

If push ripple fails, scheduled alignment guarantees eventual consistency.

### 5.4 Drift Detection (Deterministic)
Consumers must:
- resolve canonical `main` → commit SHA
- compare local file hashes to canonical hashes
- classify each artifact: ALIGNED / MISSING / DRIFT
- record results in `.agent-admin/governance/sync_state.json`

### 5.5 Self-Alignment (Automated via PR)
If drift exists:
- create a branch
- layer down missing/drift artifacts
- update inventory + evidence
- open PR
- enable auto-merge (subject to required checks passing)

**Stop-and-fix rule**: if alignment PR fails gates, the workflow must produce RCA artifacts and must not retry blindly.

### 5.6 Cascading Failure Control
Executable enforcement MUST include circuit-breakers:
- rate limiting dispatch
- backoff/retry policy
- max retry count before escalation
- third-repeat failure escalation threshold (catastrophic)

---

## 6) Merge Gate Standardization (The Key to Auto-Merge + Reliability)

### 6.1 Standardize the Interface, Not the Internals
Repos may run many internal checks, but every repo MUST expose a stable, standard PR merge interface so branch protection is consistent and auto-merge is safe.

### 6.2 Standard GitHub Check Context Naming (Required)
Because GitHub branch protection typically requires the check context as:
`<workflow name> / <job name>`, the ecosystem MUST standardize:

- **Workflow name**: `Merge Gate Interface`
- **Job names (exact)**:
  1. `merge-gate/verdict`
  2. `governance/alignment`
  3. `stop-and-fix/enforcement`

Branch protection MUST require only these 3 contexts:
- `Merge Gate Interface / merge-gate/verdict`
- `Merge Gate Interface / governance/alignment`
- `Merge Gate Interface / stop-and-fix/enforcement`

No repo-specific checks should be required by branch protection.

### 6.3 Verdict Gate is Evidence-First (Not Reactive)
The system enforces proactive behavior by requiring committed evidence artifacts, not log archaeology.

The verdict gate MUST validate:
- required evidence artifacts exist in the PR diff
- evidence artifacts conform to schema and contain mandatory sections
- forbidden test-dodging language is absent
- required governance alignment has been satisfied
- PR classification rules are satisfied (OPOJD / wave model / IBWR / CST / VWT obligations when applicable)

### 6.4 Dynamic Compliance (Governance “Compilation”) — Required
Governance changes must automatically update what the verdict gate expects.

Therefore, canon MUST define a machine-readable requirements index that verdict gate loads at runtime, e.g.:
- `governance/GATE_REQUIREMENTS_INDEX.json` (or equivalent)

The verdict gate computes “what is required for this PR type” deterministically from that index, avoiding hardcoded checklists and branch protection churn.

---

## 7) Mandatory Evidence Artifacts (Make Proactivity Enforceable)

To prevent “clever phrases” and ensure systematic improvement capture, canon must mandate standard artifacts, paths, and schemas.

### 7.1 Required Artifact Bundle (Per PR)
At minimum, every PR must include:

1. **Prehandover Proof** (human readable)
2. **Gate Results Summary** (machine readable)
3. **Continuous Improvement Capture** (mandatory, parked if not in scope)
4. **RCA** when stop-and-fix occurred or when gates fail

### 7.2 Standard Paths (Required)
The ecosystem MUST standardize where these artifacts live to enable deterministic validation. Preferred root:
- `.agent-admin/`

Minimum required paths (canon will finalize exact filenames):
- `.agent-admin/prehandover/`
- `.agent-admin/gates/`
- `.agent-admin/rca/`
- `.agent-admin/improvements/`
- `.agent-admin/governance/` (sync_state)

### 7.3 Schema Requirement (Required)
Canon MUST publish schemas for:
- prehandover proof structure (even if markdown, require mandatory headings)
- gate results summary JSON schema
- improvement capture schema
- RCA schema

Executable validators MUST enforce schema compliance.

---

## 8) CS2 Authority Boundaries (Non-Delegable Domains)

This strategy explicitly preserves CS2 boundaries:

- Canonical governance changes: CS2-only authorization.
- Agent contract changes: CS2-only authorization.
- Consumer repos may self-align canon artifacts (layer down) automatically.
- Consumer repos may create governance change requests upstream (issues/PR drafts) but may not merge canon.

---

## 9) Implementation Roadmap (No “Later”)

**Day 0 (2026-02-10)**  
- Freeze the 3-check interface and standardized workflow/job naming.
- Create canon drafts for:
  - inventory integrity requirements (no placeholders, sha256, provenance)
  - Maturion Bot execution identity boundary model
  - push ripple transport + scheduled fallback requirements + repo registry
  - merge gate interface requirement (3 checks)
  - evidence artifact bundle + standard paths + schemas
  - gate requirements index (“compiler input”) specification

**Day 1 (2026-02-11) — Pilot Repo**  
- Implement `Merge Gate Interface` workflow in `maturion-foreman-office-app`.
- Switch branch protection to require only the 3 standardized contexts.
- Confirm auto-merge merges a trivial PR successfully.
- Confirm evidence-first failure messaging works on a controlled failing PR.

**Day 2 (2026-02-12) — Governance Repo**  
- Implement the same interface in governance repo.
- Implement push ripple dispatcher workflow in governance repo.
- Implement consumer repo registry source of truth.
- Ensure CS2-only governance change workflow remains enforced.

**Day 3 (2026-02-13) — Rollout**  
- Apply to PartPulse and R_Roster, then all consumer repos.
- Enable repository_dispatch listeners and scheduled fallback alignment everywhere.

**Day 4 (2026-02-14) — Stabilization**  
- Run controlled failure drills:
  - dispatch failure → scheduled fallback recovery
  - placeholder hash detection → degraded mode + governance change request
  - repeated PR failure → stop-and-fix + RCA + no blind retries
- Verify auto-merge does not deadlock and only merges on passing standardized checks.

---

## 10) Definition of Done (Strategy Success Criteria)

The strategy is successfully executed when:

1. Canon inventory contains no placeholder hashes for required artifacts.
2. A deterministic consumer repo registry exists for ripple targeting.
3. Governance repo dispatches ripple events on canon change, and consumers respond immediately.
4. Scheduled fallback alignment runs everywhere and repairs missed ripple events.
5. All repos expose the same 3 PR checks with standardized workflow/job naming.
6. Branch protection across all repos requires only those 3 contexts.
7. Auto-merge is enabled and works without deadlocks.
8. PR failures are evidence-first, fast to diagnose, and produce automatic RCA artifacts.
9. Every merged job includes continuous improvement capture without scope drift.

---
