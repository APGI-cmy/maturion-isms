# Admin-Ceremony Handover Hardening — Gap Analysis and Target-State Design

**Type**: Wave Design / Gap Analysis (D1)
**Wave**: admin-ceremony-hardening-20260421
**Branch**: copilot/harden-admin-ceremony-handover
**Author**: foreman-v2-agent (POLC-Orchestration)
**Date**: 2026-04-21
**Issue**: Harden admin-ceremony handovers after PR #1432
**Authority**: CS2 (@APGI-cmy)
**Version**: 1.0.0

---

## 1. Why PR #1432-Class Defects Were Not Rejected

### 1.1 Root Cause: Existence-Only Checking

The current ceremony system excels at detecting **absent artifacts** but is structurally blind to **wrong-but-existing artifact references**. Specifically:

| Current Check | What It Detects | What It Misses |
|--------------|-----------------|----------------|
| `git ls-files --error-unmatch <path>` (AAP-03) | Missing/uncommitted files | Files that exist but have the wrong session ID, date, or wave in their content |
| AAP-06 (requested vs completed session mismatch) | PREHANDOVER `iaa_audit_token` ≠ token file session ID | PREHANDOVER references a superseded session-memory FILE where both session ID and filename exist, but one is from a prior draft |
| AAP-22 / §4.3e Check L | Two DIFFERENT session IDs in active bundle simultaneously | A single wrong-but-plausible session ID that was never updated after session renumber |
| R01 (reconciliation matrix) | Session ID in PREHANDOVER ≠ session memory filename pattern | Only applies when ECAP is formally appointed; not enforced on liaison/non-ECAP paths |

### 1.2 Session Renumber / Conflict Resolution Drift Pattern

The PR #1432 defect class follows this pattern:

1. An initial draft of ceremony artifacts is created with session number N.
2. A conflict resolution or renumber event occurs: session number changes to N+1, or date changes, or PR number updates.
3. Most artifacts are updated to reflect N+1.
4. One or more "lower-visibility" artifacts (inventory notes, wave record section, session memory path reference) retain the old N reference.
5. All artifact paths still **exist on disk** — every path check passes.
6. Every reference **looks plausible** — N is a valid session format, and AAP-22 requires two different values in the same bundle, not just one wrong value.
7. The bundle passes automated checks and enters IAA review.

**Gap**: No check currently asks "Is every session/date/wave reference in artifact X the *same authoritative value* that governs the active bundle?" The checks only ask "Does the path exist?" and "Are there two different values simultaneously?" — not "Is each value the correct authoritative one?"

### 1.3 Liaison / Non-ECAP Path Gap

The full ECAP stack (reconciliation matrix R01-R17, AAP-10 through AAP-14, ECAP reconciliation summary) only activates when `execution-ceremony-admin-agent` is formally appointed. Governance-liaison flows and non-ECAP governance ceremonies produce final-state artifacts without:

- Cross-artifact reference reconciliation (R01-R17 not run)
- Bundle coherence declaration (`active_bundle_iaa_coherence` field not required)
- Authoritative Reference Table verification

---

## 2. Existing Protections (ECAP / IAA / Foreman QP)

### 2.1 ECAP Protections (Active for ECAP-Involved Handovers)

| Control | Location | What It Catches |
|---------|---------|----------------|
| Reconciliation Matrix R01-R17 | `execution-ceremony-admin-reconciliation-matrix.md` | Cross-artifact dependency verification for session ID, token, issue, PR, wave, branch, file paths, counts, CANON_INVENTORY hash |
| AAP-01 through AAP-22 | `execution-ceremony-admin-anti-patterns.md` | 22 named anti-patterns including token/session incoherence (AAP-22) and active tracker contradiction (AAP-21) |
| ECAP reconciliation summary | `ECAP_RECONCILIATION_SUMMARY.template.md` | Formal declaration of reconciliation completion |
| `active_bundle_iaa_coherence` field | `PREHANDOVER.template.md` (v1.2.0) | Requires explicit confirmation all active artifacts agree on IAA session |
| §4.3e Admin Ceremony Compliance Gate | `AGENT_HANDOVER_AUTOMATION.md` (v1.6.0) | Machine-executable gate checks including Check L (AAP-22) |

### 2.2 IAA Protections

| Control | Location | What It Catches |
|---------|---------|----------------|
| ACR-16 (active final-state token/session incoherence) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md` | Active bundle contains conflicting IAA session IDs |
| ACR-07 (PREHANDOVER cross-artifact coherence) | IAA canon | Broad cross-artifact coherence at IAA time |
| ACR-08 (artifact path mismatch) | IAA canon | Declared paths not matching committed files |
| CORE-020/CORE-021 (zero partial pass, zero severity tolerance) | IAA canon | Strict zero-tolerance at assurance time |

### 2.3 Foreman QP Protections

| Control | Location | What It Catches |
|---------|---------|----------------|
| §4.3 Pre-Handover Merge Gate Parity Check | Foreman contract Phase 3 Step 3.6 | Gate states verified GREEN before Phase 4 |
| §14.6 Admin-Compliance Checkpoint | Foreman contract Phase 4 Step 4.1b | ECAP bundle reviewed against AAP-10–14 |
| OPOJD Gate (Step 4.1) | Foreman contract Phase 4 Step 4.1 | Zero failures, skips, warnings; evidence complete |

---

## 3. Protections NOT Applying to Liaison/Non-ECAP Paths

| Missing Protection | Why It's Missing | Impact |
|-------------------|-----------------|--------|
| Reconciliation matrix R01-R17 | ECAP not appointed; no formal reconciliation obligation | Cross-artifact reference drift goes undetected |
| Bundle coherence declaration | No ECAP bundle structure; no `active_bundle_iaa_coherence` field requirement | Final-state artifacts can tell inconsistent stories |
| Authoritative Reference Table | No formal mechanism to establish the single authoritative source for each reference | Wrong-but-plausible references pass |
| Renumber / conflict-resolution refresh trigger | No rule mandating re-reconciliation after session number or date changes | Drift from conflict resolution or renumber persists to handover |
| Formal anti-pattern scan | AAP scan is ECAP responsibility; liaison flows have no equivalent | PR #1432-class defects slip through |
| Cross-artifact count verification | R16 is ECAP-only | Declared counts can contradict actuals |

---

## 4. Minimum Retained Checks for Universal Admin-Truth Enforcement

These checks MUST apply to ALL handover pathways, regardless of ECAP appointment.

### 4.1 Universal Reference-Truth Table (ART)

Every PREHANDOVER proof, regardless of wave type, MUST include an **Authoritative Reference Table (ART)** that declares the single authoritative value for each of:

| Reference Slot | Authoritative Source | Check Method |
|---------------|---------------------|-------------|
| Session ID (Foreman) | Foreman session memory filename | Compare filename suffix with all session ID references in active bundle |
| Session date | System date at proof creation (confirmed) | All date fields match single date |
| IAA session reference | Token file as issued by IAA | `iaa_audit_token` field and all IAA references match token file |
| Wave identifier | wave-current-tasks.md `Wave:` field | All wave references match |
| PR number | GitHub PR number (once created) | All PR references match |
| Branch name | `git branch --show-current` at proof creation | All branch references match |
| PREHANDOVER file path | Actual committed path | Declared `prehandover_proof:` field matches committed file |
| Session memory file path | Actual committed path | Declared `session_memory:` field matches committed file |

### 4.2 Renumber/Rebase/Conflict-Resolution Refresh Trigger

Any change to the following MUST trigger a mandatory re-reconciliation of all active artifact references before handover:

- Session number (renumber)
- Session date (rebase, date change)
- Wave identifier
- PR number
- Branch identity (where referenced)
- Any conflict-resolution merge that modifies active truth anchors

The refresh MUST:
1. Re-populate the ART with the updated authoritative values
2. Re-check all active artifact references against the updated ART
3. Recommit updated artifacts (does not require new PREHANDOVER proof file if not yet submitted to IAA)
4. Note the refresh event in the session memory artifacts section

### 4.3 Liaison / Non-ECAP Mini-Ceremony Pack

A lightweight but mandatory ceremony pack for governance-liaison and non-ECAP flows that:
- Requires the ART declaration (Section 4.1)
- Requires the renumber refresh trigger compliance (Section 4.2)
- Does NOT require the full ECAP reconciliation matrix (too heavyweight for liaison flows)
- DOES require a cross-artifact spot-check for the 5 highest-risk reference slots:
  1. Session ID in PREHANDOVER ↔ session memory filename
  2. IAA token reference in PREHANDOVER ↔ token file
  3. Wave ID in PREHANDOVER ↔ wave record
  4. Inventory/completion notes ↔ session number (if inventory notes reference session)
  5. PREHANDOVER path self-reference (declared path = actual committed path)

### 4.4 Wrong-But-Existing Reference Hardening

A new AAP class covering the following pattern:
- **Dependent reference resolves to a valid-looking but non-authoritative artifact**
- Examples: PREHANDOVER references a superseded session-memory filename (old session number), inventory note cites prior session after renumber, wave record cites pre-renumber session
- Detection: ART-based cross-check (compare each reference in active bundle against ART authoritative value, not just check file existence)

---

## 5. Target State

After this wave, the system MUST enforce:

1. **Universal**: ART required in all PREHANDOVER proofs (ECAP and non-ECAP)
2. **Universal**: Wrong-but-existing reference anti-pattern formally covered in AAP stack
3. **Universal**: Renumber/rebase/conflict-resolution refresh trigger defined as mandatory rule
4. **Liaison**: Mini-ceremony pack with 5-point spot-check as retained check set
5. **Foreman QP**: Explicit ART verification step before authorizing final handover
6. **IAA**: Retained check set includes ART cross-verification for all trigger categories

---

## 6. Deliverable Mapping

| Deliverable | Target Files | Addresses Gap |
|------------|-------------|--------------|
| D2 | `governance/canon/AGENT_HANDOVER_AUTOMATION.md` | Universal ART requirement via §4.3e extension |
| D3 | `governance/checklists/execution-ceremony-admin-anti-patterns.md` | AAP-23: Wrong-but-existing reference anti-pattern |
| D4 | `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` | Renumber/rebase refresh trigger rule (R18) |
| D5 | `governance/templates/execution-ceremony-admin/PREHANDOVER.template.md`, `SESSION_MEMORY.template.md` | ART fields in templates; QP verification step |
| D6 | `governance/templates/liaison-mini-ceremony-pack.md`, `governance/checklists/liaison-mini-ceremony-checklist.md` | Liaison 5-point spot-check pack |
| D7 | `governance/checklists/execution-ceremony-admin-checklist.md`, updated cross-references | ECAP checklist updated to include ART check; cross-references to new liaison pack |

---

*Version: 1.0.0 | Wave: admin-ceremony-hardening-20260421 | Author: foreman-v2-agent | Authority: CS2*
