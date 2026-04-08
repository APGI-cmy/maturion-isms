# EXECUTION CEREMONY ADMINISTRATION PROTOCOL

## Status
**Type**: Canonical Governance Definition  
**Authority**: Supreme — Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-04-08  
**Owner**: Maturion Engineering Lead  
**Canon ID**: ECAP-001  
**Strategy Reference**: `maturion/strategy/Execution_Ceremony_Administration_Strategy.md` (ECAS-001)

> **Amendment Authority**: Only CS2 (Johan Ras / repo owner) may amend this canon. Any PR modifying this file without CS2 sign-off is auto-FAIL at the merge gate.

---

## 1. Purpose

This protocol defines the **canonical role, authority boundaries, and handover sequence** for the `execution-ceremony-admin-agent` — an administrator-class agent appointed to own **job-administration and assurance-bundle preparation**, freeing the Foreman to remain focused on managerial orchestration and IAA to remain focused on independent audit.

This protocol does **not** create or modify:
- live Foreman agent contracts
- IAA agent contracts
- PREHANDOVER immutability rules
- IAA token ceremony rules
- existing merge gate workflows

Those remain governed by their own canonical documents. This protocol establishes the governance basis from which live contract and layer-down work proceeds.

---

## 2. Background and Rationale

### 2.1 The Structural Problem

The Foreman is constitutionally responsible for all managerial work: planning, organising, leading, and controlling execution. These are non-delegable obligations that must remain with the Foreman.

However, live operation accumulated a parallel class of **ceremony-administration burden** inside the Foreman role:

- session-memory assembly
- PREHANDOVER preparation and structure generation
- artifact-completeness administration
- checksum and evidence collation
- commit-state vs artifact-state reconciliation
- PREHANDOVER / token / session-memory consistency verification
- bundle hygiene checks

This is necessary work, but it is not the best use of Foreman capacity. Recurring failure patterns in recent waves have been driven primarily by execution ceremony defects — stale artifacts, inconsistent evidence bundles, commit-state mismatches — rather than substantive build defects.

### 2.2 The Architectural Solution

This protocol introduces a **dedicated administrator-class agent** — `execution-ceremony-admin-agent` — to own ceremony administration as a first-class responsibility. The model preserves all three primary authority boundaries:

| Role | Domain |
|------|--------|
| **Foreman** | Managerial orchestration and substantive readiness |
| **execution-ceremony-admin-agent** | Ceremony administration and artifact readiness |
| **IAA** | Independent assurance and verdict |

This is a **strengthening** move. It does not dilute any existing authority. It separates modes of work that were previously conflated in a single role.

---

## 3. Role Definition — execution-ceremony-admin-agent

### 3.1 Agent Class

| Attribute | Value |
|-----------|-------|
| **Agent Class** | `administrator` |
| **Role** | Execution ceremony administration and handover-bundle preparation |
| **Appointment Authority** | Foreman (per job) |
| **Reporting Authority** | Foreman |
| **Output** | Ceremony bundle returned to Foreman for pre-IAA review |

The `execution-ceremony-admin-agent` is **not**:
- a builder (does not produce substantive deliverables)
- a quality professor / quality-gating authority
- an IAA substitute (does not issue assurance verdicts)
- a governance-liaison replacement
- a product or architecture decision-maker
- a build validator of substantive code quality

### 3.2 Core Function

> **Administer execution ceremony and handover preparation for completed jobs.**

The execution-ceremony-admin-agent receives a completed job from the Foreman and prepares the full ceremony bundle such that the Foreman can perform a focused pre-IAA review and then invoke IAA with confidence.

### 3.3 Scope of Work

The execution-ceremony-admin-agent owns:

1. **Session-memory administration** — assembling and verifying session memory entries for the job
2. **PREHANDOVER generation** — producing the PREHANDOVER proof from canonical templates
3. **Artifact inventory collation** — inventorying all job artifacts and confirming all expected artifacts are present
4. **Checksum and evidence collation** — collecting, verifying, and reconciling checksums and evidence artifacts
5. **Commit-state administration** — confirming that committed file state matches artifact-state references
6. **Proof-of-completeness assembly** — assembling the complete evidence package per canonical standards
7. **Bundle hygiene remediation** — correcting administrative defects in the bundle (naming, path, registry consistency) prior to handover
8. **Return-to-Foreman** — handing back the completed bundle for Foreman review

### 3.4 Non-Scope (Explicit Exclusions)

The execution-ceremony-admin-agent MUST NOT:

- Make substantive quality judgements about deliverable correctness
- Issue assurance verdicts (this is IAA-only)
- Modify substantive build artifacts (code, migrations, schema changes)
- Override Foreman decisions
- Invoke IAA directly (IAA invocation is a Foreman responsibility)
- Approve its own work as IAA-ready (this is Foreman's decision)
- Substitute for the Foreman's pre-IAA review
- Accept or reject a delivery on quality grounds

---

## 4. Authority Boundary Model

### 4.1 Foreman Retains Full Orchestration Authority

The appointment of the `execution-ceremony-admin-agent` **does not dilute Foreman constitutional accountability**. The Foreman retains full ownership of:

- wave/job definition and stage sequencing
- architecture and QA strategy
- builder appointment and supervision
- substantive delivery assessment and acceptance
- the decision that a job is ready for ceremony preparation
- the decision that the prepared ceremony bundle is ready for IAA handover
- the final invocation / handover to IAA

The Foreman is **accountable** for the completeness and accuracy of the ceremony bundle even when the bundle has been prepared by the `execution-ceremony-admin-agent`. Appointment of the ceremony admin is a **delegation of administration** — not a delegation of accountability.

### 4.2 execution-ceremony-admin-agent Owns Ceremony Administration

Within the scope defined in §3.3, the execution-ceremony-admin-agent has full administrative authority to:

- collate, verify, and reconcile artifacts
- generate PREHANDOVER structure from canonical templates
- confirm and repair administrative inconsistencies
- return the bundle to the Foreman at any point if a blocker is identified

The execution-ceremony-admin-agent operates under the **VUPR model** (Verify-Update-Propagate-Record) within its ceremony scope.

### 4.3 IAA Retains Independent Audit Authority

The IAA's role and posture are **unchanged** by this protocol.

IAA remains:
- fully independent — cannot be the agent that performed the work under review
- **non-producing** — does NOT author substantive or administrative job artifacts
- **non-cleanup-authoring** — does NOT fix defects discovered during audit; issues a REJECTION-PACKAGE and returns for resolution
- the sole final assurance authority

IAA continues to issue only:
- `ASSURANCE-TOKEN` (assurance passed)
- `REJECTION-PACKAGE` (assurance failed)

> **Constitutional Rule**: The introduction of the `execution-ceremony-admin-agent` does NOT convert IAA into a cleanup or production actor under any circumstance. Any canon language, implementation change, or agent instruction that implies or permits IAA to remediate ceremony defects constitutes a governance violation.

### 4.4 Three-Part Separation-of-Duties

| Role | Substantive Work | Ceremony Administration | Independent Assurance |
|------|-----------------|-------------------------|-----------------------|
| **Foreman** | ✅ Orchestrates, accepts | Appoints ceremony admin; reviews bundle; invokes IAA | ❌ Cannot self-assure |
| **execution-ceremony-admin-agent** | ❌ Not a builder | ✅ Prepares full ceremony bundle | ❌ Not an assurance authority |
| **IAA** | ❌ Non-producing | ❌ Non-cleanup-authoring | ✅ Issues ASSURANCE-TOKEN or REJECTION-PACKAGE |

This three-part separation is the operational strengthening introduced by this protocol.

---

## 5. The Canonical Handover Sequence

### 5.1 Pre-Protocol Failure Pattern

The previous pattern combined too many modes in a single role:

```text
[BEFORE — problematic]
1. Foreman orchestrates work
2. Foreman validates substantive completion
3. Foreman prepares handover artifacts             ← ceremony administration
4. Foreman invokes IAA
5. Foreman reacts to ceremony defects found by IAA ← late discovery
```

Steps 3 and 5 are ceremony administration work. Performing them under Foreman orchestration pressure leads to stale artifacts, missed evidence, and avoidable REJECTION-PACKAGE cycles.

### 5.2 Canonical Handover Sequence (Normative)

The following seven-step sequence is the **canonical handover sequence** for all jobs where the Foreman appoints an `execution-ceremony-admin-agent`:

```text
Step 1: Foreman completes orchestration and substantive acceptance
         → All builders have delivered; Foreman has validated substantive quality
         → Foreman determines the job is ready for ceremony preparation

Step 2: Foreman appoints execution-ceremony-admin-agent
         → Formal appointment with defined scope
         → Foreman provides job context: artifacts, branches, task scope

Step 3: execution-ceremony-admin-agent prepares the full ceremony bundle
         → Session memory administration
         → PREHANDOVER generation
         → Artifact inventory, checksum collation, evidence reconciliation
         → Commit-state consistency verification
         → Bundle hygiene remediation
         → Proof-of-completeness assembly

Step 4: execution-ceremony-admin-agent returns the bundle to Foreman
         → Explicit handback with bundle summary
         → Any known residual issues noted for Foreman review
         → Foreman acceptance of the ceremony bundle

Step 5: Foreman performs initial review of the prepared bundle
         → Foreman reviews for substantive readiness (not ceremony re-administration)
         → If defects found, Foreman may return to ceremony-admin for remediation
         → When satisfied, Foreman proceeds to Step 6

Step 6: Foreman invokes / hands over to IAA
         → Foreman explicitly hands over the prepared bundle to IAA
         → Foreman takes accountability for bundle completeness at this point

Step 7: IAA audits independently and issues verdict
         → IAA reviews Phase 1–4 evidence against acceptance criteria
         → IAA issues ASSURANCE-TOKEN (pass) or REJECTION-PACKAGE (fail)
         → If REJECTION-PACKAGE, Foreman receives findings and determines remediation path
```

### 5.3 Readiness Concept Definitions

Three distinct readiness concepts apply to this sequence:

| Concept | Owned By | Definition |
|---------|----------|------------|
| **Substantive readiness** | Foreman | All builders have delivered correct, tested, quality-gate-passing work; Foreman has accepted the substantive delivery |
| **Administrative readiness** | execution-ceremony-admin-agent | The ceremony bundle is complete, consistent, and free of administrative defects; all artifacts are present and reconciled |
| **Independent assurance verdict** | IAA | IAA has independently verified both substantive and administrative evidence; issued ASSURANCE-TOKEN or REJECTION-PACKAGE |

A job that has achieved substantive readiness has NOT yet achieved administrative readiness, and vice versa. Both are preconditions for IAA handover. The IAA verdict is distinct from both.

### 5.4 Appointment Trigger

The Foreman MAY appoint the `execution-ceremony-admin-agent` when:

1. Substantive acceptance of the job delivery has been completed
2. The Foreman has determined the job is ready for ceremony preparation
3. The wave task scope is sufficiently defined for the ceremony admin to operate

The Foreman MUST NOT appoint the `execution-ceremony-admin-agent` as a substitute for completing substantive acceptance. The ceremony admin receives a substantively complete job; it does not adjudicate substantive completeness.

---

## 6. Escalation Model

### 6.1 Ceremony-Admin Escalation Triggers

The `execution-ceremony-admin-agent` MUST escalate to the Foreman when:

- A required artifact is missing and cannot be synthesised from available evidence
- A commit-state vs artifact-state inconsistency is unresolvable through administrative means
- A substantive correctness question arises that falls outside ceremony administration
- Any condition would require modifying a substantive deliverable
- A governance ambiguity is encountered that the ceremony admin cannot resolve

Escalation is to the **Foreman** (not directly to CS2 or IAA). The ceremony admin operates under Foreman authority.

### 6.2 Foreman Escalation After Bundle Review

The Foreman MAY escalate to CS2 when:

- The ceremony bundle reveals substantive issues that require human decision
- The Foreman cannot determine whether a defect is substantive or administrative
- The ceremony scope has exceeded what this protocol authorises

### 6.3 REJECTION-PACKAGE Handling

When IAA issues a REJECTION-PACKAGE:

1. IAA returns findings to the Foreman
2. Foreman classifies each finding as:
   - **Substantive defect** — requires builder remediation
   - **Ceremony/administrative defect** — may be returned to `execution-ceremony-admin-agent`
3. Foreman directs remediation to the appropriate role
4. Foreman re-reviews the remediated bundle before re-invoking IAA

The IAA does NOT perform remediation. The IAA re-audits after remediation is complete.

---

## 7. Artifact Ownership and PREHANDOVER Integrity

### 7.1 PREHANDOVER Immutability

The PREHANDOVER proof document is **immutable once committed**. This rule is unchanged by this protocol.

The `execution-ceremony-admin-agent` generates the PREHANDOVER proof as part of ceremony bundle preparation. Once the Foreman accepts and commits the PREHANDOVER proof, it must not be modified.

If a defect is found after PREHANDOVER commitment:
- A new PREHANDOVER proof supersedes the old one (never mutate in-place)
- The new proof must be committed and the IAA invocation restarted

### 7.2 IAA Assurance Token Immutability

The IAA assurance token and all token-ceremony artifacts remain immutable and append-only. This rule is unchanged by this protocol.

The `execution-ceremony-admin-agent` has no authority to create, modify, or reference IAA tokens. Token ceremony is performed exclusively by the IAA and recorded by the Foreman.

### 7.3 Evidence Artifact Ownership Table

| Artifact | Produced By | Reviewed By | Assurance Authority |
|----------|------------|-------------|---------------------|
| Session memory | execution-ceremony-admin-agent | Foreman | IAA (at handover) |
| PREHANDOVER proof | execution-ceremony-admin-agent | Foreman | IAA (at handover) |
| Checksum / evidence records | execution-ceremony-admin-agent | Foreman | IAA (at handover) |
| Artifact inventory | execution-ceremony-admin-agent | Foreman | IAA (at handover) |
| IAA assurance token | IAA | CS2 | — (self-authorised) |
| Merge decision | CS2 | — | — |

---

## 8. Canon Consistency Requirements

### 8.1 Terminology Standardisation

All downstream canon, agent contracts, and layer-down documentation MUST use the following terms consistently:

| Term | Usage |
|------|-------|
| `execution-ceremony-admin-agent` | Always hyphenated, always lowercase, always the full name when referring to the role |
| **ceremony bundle** | The complete set of job-administration artifacts prepared by the execution-ceremony-admin-agent |
| **administrative readiness** | The state where the ceremony bundle is complete, consistent, and free of administrative defects |
| **Foreman pre-IAA review** | Foreman's review of the ceremony bundle before IAA handover (Step 5 in §5.2) |
| **independent IAA verdict** | IAA's binary outcome (ASSURANCE-TOKEN / REJECTION-PACKAGE) issued after independent audit |
| **substantive readiness** | Foreman's acceptance that the build delivery is correct and complete |

### 8.2 Cross-Reference Requirements

Canon and contracts that reference the handover sequence, PREHANDOVER expectations, or assurance artifact ownership MUST be updated to reference this protocol where applicable. Specifically:

- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` — §9.6 (execution-ceremony-admin-agent relationship), §14.4 (updated handover sequence)
- `AGENT_HANDOVER_AUTOMATION.md` — Updated handover sequence documentation
- `INDEPENDENT_ASSURANCE_AGENT_CANON.md` — Reference to ceremony admin role; IAA posture clarification
- `IAA_PRE_BRIEF_PROTOCOL.md` — Reference update for new sequence

---

## 9. Consumer Repo Layer-Down Requirements

### 9.1 Layer-Down Status

| Attribute | Value |
|-----------|-------|
| **Layer-Down Status** | PUBLIC_API |
| **Layer-Down Requirement** | MANDATORY for all repos using Foreman-led execution with IAA assurance |
| **Primary Consumers** | `APGI-cmy/maturion-isms`, `APGI-cmy/app_management_centre` |

### 9.2 Layer-Down Scope

Consumer repos must:

1. Acknowledge the `execution-ceremony-admin-agent` role in their governance-liaison records
2. Update Foreman execution references to reflect the canonical handover sequence (§5.2)
3. Confirm that existing PREHANDOVER and IAA token rules remain intact (no weakening)
4. Apply the three-part readiness concept definitions (§5.3) to their execution tracking

Consumer repos MUST NOT:
- Modify the authority boundary model (§4)
- Weaken IAA independence requirements
- Allow the ceremony admin to perform IAA functions
- Allow IAA to perform ceremony administration

### 9.3 Layer-Down Impact Summary

**Impact on `APGI-cmy/maturion-isms`**:
- Foreman contracts: update handover sequence; reference execution-ceremony-admin-agent appointment step
- IAA references: no substantive change; ceremony admin is NOT IAA
- PREHANDOVER templates: confirm immutability rule unchanged; PREHANDOVER is now produced by ceremony admin under Foreman oversight

**Impact on `APGI-cmy/app_management_centre`**:
- Same scope as `maturion-isms` above
- Any wave-planning templates referencing handover ceremony steps should be updated to reflect Step 2 (Foreman appoints ceremony admin) in the sequence

---

## 10. Implementation Guidance

### 10.1 Per-Job Appointment

The `execution-ceremony-admin-agent` is appointed **per job** by the Foreman. There is no persistent wave-level appointment; each job that requires ceremony administration results in a fresh appointment with explicitly defined scope.

### 10.2 Appointment Documentation

Foreman appointment of the `execution-ceremony-admin-agent` MUST be documented in the Foreman's session memory or wave execution log, recording:
- job/wave identifier
- appointment timestamp
- scope of work assigned (artifacts, task refs)
- expected return artifact(s)

### 10.3 Bundle Return Documentation

The `execution-ceremony-admin-agent` MUST document the bundle return to the Foreman, including:
- summary of artifacts prepared
- any residual known issues (administrative, not substantive)
- any items explicitly out-of-scope and why

---

## 11. Governance of This Protocol

### 11.1 Amendment Authority

Only CS2 (Johan Ras) may amend this protocol. Amendments require:
1. CS2-approved issue stating the reason
2. Canon update via PR-only write
3. CANON_INVENTORY update with new SHA256
4. Layer-down ripple to all consumer repos
5. Version increment per semver

### 11.2 Relationship to Strategy

This protocol supersedes the strategy document `maturion/strategy/Execution_Ceremony_Administration_Strategy.md` (ECAS-001) for binding governance purposes. The strategy document is retained for historical and rationale reference only.

### 11.3 Relationship to Other Canon

This protocol is subordinate to:
- `GOVERNANCE_PURPOSE_AND_SCOPE.md`
- `LIVING_AGENT_SYSTEM.md` v6.2.0
- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- `INDEPENDENT_ASSURANCE_AGENT_CANON.md`

This protocol governs:
- execution ceremony administration scope and boundaries
- the canonical handover sequence for ceremony-admin-involved jobs
- terminology standardisation for ceremony administration

---

## 12. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-04-08 | Initial canon — formalises execution-ceremony-admin-agent role, authority boundaries, canonical handover sequence, and layer-down requirements; converts ECAS-001 strategy to binding governance |

---

**End of EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md**  
**Authority**: CS2 (Johan Ras)  
**Canon ID**: ECAP-001  
**Strategy Reference**: ECAS-001
