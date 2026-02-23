# PRE_BUILD_REALITY_CHECK_CANON

## Status
**Type**: Canonical Governance Definition  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras / Maturion)  
**Effective Date**: 2026-02-23  
**Owner**: Maturion Engineering Leadership  
**Applies To**: All modules — MAT, ROADMAP, PIT, AIMC, RADAM, and any future Maturion delivery modules  
**Precedence**: Subordinate only to GOVERNANCE_PURPOSE_AND_SCOPE.md  
**Issue Reference**: APGI-cmy/maturion-foreman-governance#459

---

## 1. Purpose

This canon establishes a **mandatory Pre-Build Reality Check gate** that must be passed before any implementation (build) work may begin in the Maturion module delivery lifecycle.

The gate exists because prior delivery stages — App Description, FRS, TRS, Architecture, Implementation Plan, and Red QA suite — each address a slice of requirements but do not individually guarantee that the **full user intent** has been faithfully captured and will be delivered.  Retrospectives on MAT, ROADMAP, and AIMC modules confirmed that misaligned requirements, ambiguous flows, and overlooked statutory obligations slipped past individual artifact reviews and were only discovered during or after build.

This canon closes that gap by requiring a structured, multi-party **reality-check and gap review** as the explicit gate between the planning/design cluster and the build/ticket cluster.

---

## 2. Constitutional Mandate

This canon derives authority from and complements:

- **GOVERNANCE_PURPOSE_AND_SCOPE.md** — Governance as canonical memory and delivery guardrail
- **BUILD_PHILOSOPHY.md** — One-Time Build Law; build once, build right
- **FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md** — Foreman POLC authority over planning, checking
- **GOVERNANCE_RIPPLE_MODEL.md** — Layer-down obligation when canon is created or updated

---

## 3. Scope and Applicability

### 3.1 When This Gate Applies

The Pre-Build Reality Check is **MANDATORY** before starting implementation for:

- Every major version or delivery milestone of any Maturion module (MAT, ROADMAP, PIT, AIMC, RADAM, or successor modules)
- Any new module introduced into the Maturion ecosystem
- Any re-architecture or scope-expanding revision of an existing module

### 3.2 Prerequisites — Gate Unlocks Only After All Are Complete

The following must all be complete and available for review before the check begins:

1. App Description (approved)
2. Functional Requirements Specification — FRS (approved)
3. Technical Requirements Specification — TRS (approved)
4. Architecture Design (approved)
5. Implementation Plan (approved)
6. Red QA Suite (signed off by Foreman)

If any prerequisite is missing or unapproved, the gate is **BLOCKED** until it is resolved.

---

## 4. The Pre-Build Reality Check Process

### 4.1 Overview

The Foreman (acting in POLC: Checking capacity) coordinates a structured cross-artifact review.  The review compares every artifact produced so far against the **original user requirements and stated intents**, looking for:

- Missing or incompletely captured requirements
- Misinterpreted requirements (requirement drift)
- Ambiguous user journeys or functional flows
- Technical oversights or architecture blind-spots
- Functional, statutory, or compliance non-conformance
- Gaps between the Red QA suite and actual user scenarios

### 4.2 Mandatory Participants

| Role | Participant | Contribution |
|------|-------------|--------------|
| Lead | Foreman (FM) | Coordinates check; owns gate outcome |
| Client/User | User or Client Representative | Validates intent alignment |
| Builder Lead | Lead Builder Agent | Technical feasibility assessment |
| Quality / Domain Expert | Quality Professor or Domain-Expert Agent | Independent gap analysis |

All four parties must participate.  A quorum of three is the absolute minimum; a missing user/client representative must be compensated by two additional rounds of FM review against documented user requirements.

### 4.3 Review Checklist

The Foreman records answers to every item below.  A "NO" or "UNCLEAR" finding blocks the gate until resolved.

#### A. Requirements Completeness
- [ ] All requirements from the original brief / user story backlog are traceable to at least one FRS item
- [ ] No FRS item contradicts another FRS item
- [ ] No FRS item is marked "TBD" or "placeholder"

#### B. Functional Coverage
- [ ] Every critical user journey is covered by at least one TRS flow
- [ ] Every TRS flow maps to at least one architecture component
- [ ] All edge cases and error paths are documented

#### C. Architecture Alignment
- [ ] The Architecture Design supports every TRS requirement
- [ ] No TRS requirement is marked "out of scope" without explicit CS2 approval
- [ ] Integration points with external systems are explicitly designed and agreed

#### D. Plan Fidelity
- [ ] The Implementation Plan covers all Architecture components
- [ ] The plan sequencing does not create dependency deadlocks
- [ ] Estimates are plausible and risk-adjusted

#### E. Red QA Coverage
- [ ] Every critical user journey has at least one Red QA test scenario
- [ ] Red QA scenarios are written against user-intent, not implementation assumptions
- [ ] No Red QA item is a duplicate or a weaker restatement of another

#### F. Statutory and Compliance
- [ ] Applicable legal, regulatory, and policy obligations are identified
- [ ] Each obligation is covered by at least one FRS requirement
- [ ] No known compliance gap remains open

#### G. Risk Assessment
- [ ] High-risk areas are identified and have mitigation plans
- [ ] Technical unknowns are documented with investigation spikes planned before full build

### 4.4 Gap Handling Protocol

When one or more gaps are found:

1. **Document**: Record each gap in the Reality Check Log (see §5).
2. **Classify**: Assign severity — CRITICAL (blocks build), MAJOR (must fix before build), MINOR (must address in this delivery but may proceed after team sign-off).
3. **Assign**: Identify the artifact(s) that require update.
4. **Remediate**: Update artifacts; each update requires re-review of the affected checklist section.
5. **Re-check**: Repeat the relevant portions of §4.3.
6. **Pass or Escalate**: All CRITICAL and MAJOR gaps must be resolved.  If a gap cannot be resolved within the delivery timeline, escalate to CS2.

The gate **cannot be bypassed** because a gap appears minor.  All gaps must be documented even if they proceed to MINOR disposition.

### 4.5 Gate Outcome

| Outcome | Condition | Next Action |
|---------|-----------|-------------|
| **PASS** | All checklist items answered YES; no open CRITICAL or MAJOR gaps | Proceed to ticket generation and build |
| **CONDITIONAL PASS** | All CRITICAL/MAJOR resolved; MINOR gaps documented with owner and target date | Proceed with written acknowledgement from FM and client rep |
| **FAIL** | Any open CRITICAL or MAJOR gap | Artifact remediation required; re-check mandatory |
| **ESCALATED** | Gap cannot be resolved within delivery constraints | CS2 decision required before proceeding |

---

## 5. Evidence and Record Requirements

### 5.1 Reality Check Log

A formal Reality Check Log **must** be created for every gate execution.  

**File Location** (choose the applicable path in priority order):
1. `<module-repo>/05-build-readiness/pre-build-reality-check-YYYYMMDD.md` (ISMS modules)
2. `.agent-workspace/foreman-v2/build-readiness/pre-build-reality-check-<module>-YYYYMMDD.md` (non-ISMS modules)
3. Any governance-approved equivalent path documented in the module manifest

**Minimum Required Content**:

```markdown
# Pre-Build Reality Check Log

**Module**: [module name and version]
**Date**: YYYY-MM-DD
**Foreman**: [foreman instance identifier]
**Participants**: [list all participants]

## Prerequisite Checklist
- [x/o] App Description approved
- [x/o] FRS approved
- [x/o] TRS approved
- [x/o] Architecture approved
- [x/o] Implementation Plan approved
- [x/o] Red QA Suite signed off

## Review Findings

### A. Requirements Completeness
[findings per §4.3.A]

### B. Functional Coverage
[findings per §4.3.B]

### C. Architecture Alignment
[findings per §4.3.C]

### D. Plan Fidelity
[findings per §4.3.D]

### E. Red QA Coverage
[findings per §4.3.E]

### F. Statutory and Compliance
[findings per §4.3.F]

### G. Risk Assessment
[findings per §4.3.G]

## Gap Register

| Gap ID | Description | Severity | Artifact to Update | Owner | Status |
|--------|-------------|----------|--------------------|-------|--------|

## Gate Outcome
**Result**: PASS / CONDITIONAL PASS / FAIL / ESCALATED
**Authorized by**: [Foreman] + [Client/User Rep]
**Date**: YYYY-MM-DD
**Next Step**: [ticket generation / artifact remediation / CS2 escalation]
```

### 5.2 Tracker and Memory Reference

The module progress tracker **must** reference the Reality Check Log file path and gate outcome.  The Foreman session memory created at session closure **must** record the gate result.

### 5.3 Immutability

Once a Reality Check Log is filed, it is **immutable**.  If a re-check is required (due to gap remediation), a new log is created with an incremented date suffix (`-v2`, `-v3`, etc.).  Prior logs are never modified.

---

## 6. Retroactive Application

### 6.1 Mandate

This canon applies retroactively to all modules currently in active delivery:

- **MAT** — if in pre-build or early-build phase: execute full gate before next build wave
- **ROADMAP** — same as above
- **AIMC** — same as above
- **PIT** — same as above
- **RADAM** — same as above
- Any other module where implementation has not yet reached 50% completion

### 6.2 Retrospective Gate (Modules Past 50% Build)

For modules where implementation is past 50% completion, a **Retrospective Reality Check** is required:

- Execute §4.3 checklist against current state
- Document gaps found
- Create remediation plan for remaining build waves
- Record in Reality Check Log with note: "Retrospective Application per PRE_BUILD_REALITY_CHECK_CANON.md v1.0.0"

---

## 7. Module Manifest Update Requirement

Every module manifest must be updated to reference this canon as a required delivery step:

```markdown
## Required Delivery Gates (extract)

- Pre-Build Reality Check Gate: PRE_BUILD_REALITY_CHECK_CANON.md v1.0.0 (MANDATORY — cannot be bypassed)
```

This update must be applied to all module manifests within one delivery cycle of this canon's effective date.

---

## 8. Prohibitions

- **❌ NEVER** begin ticket generation or any build activity before the gate is formally PASSED or CONDITIONAL PASSED
- **❌ NEVER** auto-approve the gate without documented multi-party review
- **❌ NEVER** mark a CRITICAL or MAJOR gap as MINOR to facilitate bypass
- **❌ NEVER** modify a filed Reality Check Log (create a new version instead)
- **❌ NEVER** omit the gate record from the module tracker and Foreman session memory
- **❌ NEVER** defer this gate to a later wave once build has started without CS2 approval

---

## 9. Cross-Repository Layer-Down Requirements

**MANDATORY**: When this canon is approved, the following layer-down actions must be executed:

1. **Update CANON_INVENTORY.json** — add this file with full SHA256 hash (REQ-CM-001)
2. **Update GOVERNANCE_ARTIFACT_INVENTORY.md** — add entry for this canon
3. **Update LIVING_AGENT_SYSTEM.md** — add Pre-Build Reality Check Gate section
4. **Update Foreman Agent Contract** (`.github/agents/foreman-v2.agent.md`) — add as explicit Phase 2.5
5. **Update each module manifest** — add required gate reference per §7
6. **Update CHANGELOG.md** — add versioned change log entry
7. **Create layer-down issues in consumer repos** — per GOVERNANCE_RIPPLE_MODEL.md and GOVERNANCE_LAYER-UP_PROTOCOL.md
8. **Create ripple evidence artifact** in `governance/ripple/`

---

## 10. Version History

**v1.0.0** (2026-02-23): Initial canon creation. Establishes mandatory Pre-Build Reality Check gate, defines process, participants, evidence requirements, and retroactive application mandate. Authority: CS2. Issue: APGI-cmy/maturion-foreman-governance#459.

---

**Document Metadata**:  
Canon ID: PRE_BUILD_REALITY_CHECK_CANON  
Authority: CS2 (Johan Ras / Maturion)  
Maintained By: Governance Administrator  
Required By: GOVERNANCE_PURPOSE_AND_SCOPE.md, BUILD_PHILOSOPHY.md  
