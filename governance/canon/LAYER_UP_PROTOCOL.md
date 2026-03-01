# LAYER-UP PROTOCOL

## Status
**Type**: Canonical Governance Process — Mandatory Enforcement  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-02-09  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Complements CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md, implements GOVERNANCE_RIPPLE_MODEL.md (Section 3.1 Upward)  
**Purpose**: Define explicit, controlled protocol for propagating learnings, improvements, and governance feedback from application repositories back to canonical governance

---

## 1. Purpose

This protocol defines the **explicit, controlled mechanism** for propagating lessons learned, governance improvements, and alignment feedback from downstream application repositories back to the canonical governance repository (`maturion-foreman-governance`).

**The Bidirectional Governance Loop**:
- **Layer-Down** (Governance → Applications): New governance rules propagate to all governed repos
- **Layer-Up** (Applications → Governance): Lessons learned propagate back to improve governance

This protocol exists to:
- **Prevent governance stagnation** by incorporating real-world learnings
- **Close the learning loop** from execution back to governance canon
- **Detect and remediate governance drift** before it becomes systemic
- **Ensure governance evolves** without weakening enforcement
- **Provide audit trail** for all governance improvements
- **Prevent learning loss** when agent sessions end

**Constitutional Principle**: All governance improvements MUST originate from validated learnings. Governance changes without evidence are PROHIBITED.

---

## 2. Constitutional Authority

This protocol derives authority from and complements:
- **GOVERNANCE_RIPPLE_MODEL.md** (Section 3.1: Bidirectional Evolution, Upward path) — Foundation for layer-up
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md** — Learning capture and promotion requirements
- **LEARNING_PROMOTION_RULE.md** — When and how to promote learnings
- **FAILURE_PROMOTION_RULE.md** — Failure pattern handling
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md** — Complement to layer-down
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md** — Enhancement capture requirements
- **STOP_AND_FIX_DOCTRINE.md** — Immediate remediation mandate
- **Issue #1047**: Living Agent System v5.0.0 — Governance gap closure including layer-up

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Learning capture from application repositories
- Governance drift detection and escalation
- Governance improvement proposal process
- Layer-up initiation and completion process
- governance-repo-administrator responsibilities for layer-up intake
- Breaking change detection from application execution
- Audit trail and evidence requirements for governance improvements
- Integration with governance ripple tracking

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- Governance decision-making (escalate to CS2/Johan)
- Direct governance canon editing by non-administrators
- Governance interpretation (escalate to CS2/Johan)
- Application-specific architecture improvements (FM's role)
- Build execution improvements (Builder's role)

---

## 4. Core Principles

### 4.1 Evidence-Based Governance Evolution

**Principle**: All governance changes MUST originate from validated, evidence-backed learnings from real-world execution.

**Rationale**:
- Prevents speculative or theoretical governance changes
- Ensures governance remains grounded in operational reality
- Provides traceability for governance evolution
- Supports rollback and troubleshooting

**Enforcement**:
- Every governance improvement MUST reference the originating learning/failure
- Evidence MUST be preserved in governance repository
- Speculative governance changes are PROHIBITED

---

### 4.2 Mandatory Layer-Up Before Canon Changes

**Principle**: Before making ANY canon changes, governance-repo-administrator MUST execute layer-up scan to detect drift and gather alignment feedback.

**Rationale**:
- Prevents governance changes that conflict with application state
- Detects drift before introducing new rules
- Ensures governance changes account for current application needs
- Prevents circular drift (governance → apps → governance with misalignment)

**Enforcement**:
- Layer-up scan is STEP 0 of governance change process
- Evidence of layer-up scan MUST be documented
- Detected drift MUST be escalated to CS2 before proceeding

---

### 4.3 Governance Administrator as Layer-Up Intake Point

**Principle**: The governance-repo-administrator agent is the SOLE intake point for layer-up from application repositories.

**Rationale**:
- Single point of control for governance improvements
- Prevents uncoordinated governance changes
- Enables systematic review and integration
- Maintains governance authority boundary

**Enforcement**:
- Application agents MUST escalate governance improvements via issues
- Direct PR creation for canon changes by non-administrators is PROHIBITED
- governance-repo-administrator validates and integrates all layer-up

---

### 4.4 Bi-Directional Ripple Tracking

**Principle**: All layer-up that results in canon changes MUST trigger layer-down ripple back to consumer repositories.

**Rationale**:
- Closes the governance feedback loop
- Ensures all applications benefit from learnings
- Prevents asymmetric governance state across repositories
- Maintains governance synchronization

**Enforcement**:
- Layer-up resulting in canon changes MUST be logged in ripple log
- Subsequent layer-down MUST reference the originating layer-up
- Ripple log tracks full bidirectional flow

---

## 5. Layer-Up Triggers

Layer-up MUST be initiated when:

### 5.1 Mandatory Triggers (Governance-Critical)

1. **Governance Drift Detected**
   - Application deviates from canonical governance
   - LOCKED sections modified without authority
   - Governance file versions out of sync
   - **Action**: Escalate to CS2, remediate drift before proceeding

2. **Governance Gap Discovered**
   - Missing governance for operational scenario
   - Ambiguous or incomplete canonical guidance
   - Agent unable to determine correct action from governance
   - **Action**: Document gap, propose new/updated canon

3. **Governance Conflict Discovered**
   - Multiple canon files provide contradictory guidance
   - Canon conflicts with operational reality
   - Enforcement creates operational deadlock
   - **Action**: Escalate to CS2 for resolution

4. **Governance Failure Pattern Detected**
   - Same governance violation occurs multiple times
   - Gate failure due to governance ambiguity
   - Governance enforcement prevents valid action
   - **Action**: Promote to governance improvement

5. **Breaking Change Required**
   - Application evolution requires governance rule change
   - New architectural pattern needs governance support
   - Current governance rule blocks valid progress
   - **Action**: Propose governance evolution with evidence

### 5.2 Routine Triggers (Improvement-Focused)

6. **Learning Promotion Threshold Met**
   - Pattern observed across multiple builds
   - Improvement opportunity validated by evidence
   - Efficiency gain opportunity identified
   - **Action**: Submit governance enhancement proposal

7. **Governance Enhancement Validated**
   - Agent contracts improved successfully
   - New protocol tested and validated
   - Governance simplification opportunity confirmed
   - **Action**: Propose canon update

8. **Cross-Repository Pattern Observed**
   - Multiple applications experience same issue
   - Common solution emerges across repositories
   - Shared governance need identified
   - **Action**: Propose canonical pattern

---

## 6. Layer-Up Process

### Phase 1: Detection & Documentation (Application Repository)

**Who**: governance-liaison, foreman, or builder in application repository  
**When**: Upon trigger (see Section 5)  
**Where**: Application repository

**Steps**:
1. **Capture Evidence**:
   - What happened (event, failure, learning)
   - Why it matters (impact, frequency, scope)
   - Current governance state (which canon files apply)
   - Proposed improvement (what should change)

2. **Create Layer-Up Issue** in application repository:
   ```markdown
   Title: [Layer-Up] <Brief Description>
   Labels: layer-up, governance-improvement
   
   ## Trigger
   [Which layer-up trigger from Section 5]
   
   ## Evidence
   [Logs, screenshots, git history, etc.]
   
   ## Current Governance State
   [Which canon files apply, current version, current guidance]
   
   ## Observed Gap/Conflict/Failure
   [What's wrong or missing]
   
   ## Proposed Governance Improvement
   [What should change in canonical governance]
   
   ## Impact Assessment
   [Who's affected, urgency, scope]
   ```

3. **Escalate to governance-repo-administrator**:
   - Create issue in `maturion-foreman-governance` repository
   - Reference application repository issue
   - Tag: `layer-up`, `governance-improvement`

### Phase 2: Intake & Validation (Governance Repository)

**Who**: governance-repo-administrator  
**When**: Upon layer-up issue creation  
**Where**: Governance repository

**Steps**:
1. **Validate Layer-Up Request**:
   - [ ] Evidence is sufficient and credible
   - [ ] Trigger is valid (matches Section 5)
   - [ ] No duplicate/overlapping layer-up exists
   - [ ] Impact assessment is reasonable

2. **Classify Layer-Up**:
   - **CRITICAL** (Drift, Conflict, Blocker): Escalate to CS2 immediately
   - **HIGH** (Gap, Failure Pattern, Breaking Change): Plan for next governance cycle
   - **MEDIUM** (Enhancement, Pattern): Queue for review
   - **LOW** (Optimization): Document for future consideration

3. **Log Layer-Up in Evidence**:
   ```
   LAYER_UP: <issue_number> | TRIGGER: <trigger_type> | PRIORITY: <priority> | STATUS: INTAKE
   ```

4. **If CRITICAL**: Escalate to CS2 with:
   - Evidence package
   - Impact assessment
   - Proposed remediation options
   - Timeline recommendation

### Phase 3: Analysis & Proposal (Governance Repository)

**Who**: governance-repo-administrator (with CS2 approval if needed)  
**When**: After intake validation  
**Where**: Governance repository

**Steps**:
1. **Analyze Governance Impact**:
   - Which canon files need changes
   - Which consumer repositories affected
   - Breaking vs. non-breaking change
   - Ripple scope and effort

2. **Draft Governance Change**:
   - Create draft canon file updates
   - Update GOVERNANCE_ARTIFACT_INVENTORY.md
   - Update CANON_INVENTORY.json
   - Document rationale and evidence

3. **Prepare Layer-Up Evidence Package**:
   ```markdown
   ## Layer-Up Evidence Package
   
   **Origin**: <application-repo> #<issue>
   **Trigger**: <trigger type>
   **Priority**: <priority>
   **Canon Files Affected**: <list>
   **Breaking Change**: [YES/NO]
   
   ### Evidence Summary
   [Consolidated evidence from application]
   
   ### Proposed Canon Changes
   [Specific file changes with rationale]
   
   ### Ripple Impact
   [Which repos affected, estimated effort]
   
   ### Authority
   [CS2 approval if required]
   ```

4. **Create Governance PR**:
   - Title: `[Layer-Up] <Description> (from <app-repo> #<issue>)`
   - Include evidence package
   - Reference originating application issue
   - Tag with `layer-up`

### Phase 4: Review & Integration (Governance Repository)

**Who**: CS2 (Johan) or delegated governance authority  
**When**: Upon PR creation  
**Where**: Governance repository

**Steps**:
1. **Review Governance Change**:
   - Evidence is compelling
   - Change maintains governance authority
   - Change doesn't weaken enforcement
   - Change is generalizable (not app-specific)

2. **Approve or Request Changes**:
   - Approve: Merge PR
   - Request Changes: Provide guidance, iterate
   - Reject: Document rationale, close

3. **Upon Merge**:
   - Update layer-up issue: STATUS → INTEGRATED
   - Trigger layer-down ripple (see Section 7)
   - Close originating application issue with reference

### Phase 5: Ripple Back (Layer-Down) (All Repositories)

**Who**: governance-repo-administrator → governance-liaison agents  
**When**: Immediately after governance PR merge  
**Where**: All consumer repositories

**Steps**:
1. **Execute Layer-Down Ripple**:
   - Follow GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md
   - Create layer-down issues in all consumer repos
   - Note originating layer-up in ripple log

2. **Update Ripple Log**:
   ```markdown
   [YYYY-MM-DD HH:MM] Layer-Up from <app-repo> #<issue> → Canon Change PR #<pr>
   [YYYY-MM-DD HH:MM] Layer-Down Ripple → <consumer-repo> (NOTIFIED) #<issue>
   ```

3. **Close Loop**:
   - Originating application receives improved governance
   - All applications benefit from learning
   - Ripple log shows complete bidirectional flow

### Phase 6: HITL Close-Loop Automation (Governance Repository)

**Who**: Authorized maintainer or CS2 (HITL), then `governance-layer-up-auto-triage` workflow  
**When**: After Phase 2 intake; anytime before Phase 3 manual analysis begins  
**Where**: Governance repository — issue comment

**Purpose**: Accelerate canonical close-loop for straightforward, additive layer-up improvements
that do not require deep CS2 analysis, via a Human-In-The-Loop approval comment.

#### 6.1 HITL Approval Phrase

An authorized principal (CS2 or designated maintainer) posts **any** of the following phrases
as a comment on the governance-repo layer-up issue (case-insensitive):

- `Layer up approved`
- `Layer-up approved`
- `Auto layer up approved`

#### 6.2 Authorization Requirements

Only the following GitHub actors are authorized to trigger HITL auto-triage:

- **APGI-cmy** (repository owner / CS2)
- **johanras** (CS2)
- **maturion-bot** (automation principal)

Approval phrases posted by unauthorized actors are rejected with a notice; the issue remains
open for manual triage.

#### 6.3 Conflict vs. Additivity Evaluation

Upon receiving an authorized HITL approval, the `governance-layer-up-auto-triage` workflow
evaluates the governance delta in the issue body for conflict signals:

| Signal | Evaluation | Action |
|--------|-----------|--------|
| No `Breaking Change: YES`, no conflict language | **ADDITIVE** | Open canonization candidate PR (Draft) |
| `Breaking Change: YES` present | **CONFLICTING** | Add `layer-up-conflict-escalation` label, escalate to CS2 |
| Conflict/incompatibility language in body | **CONFLICTING** | Add `layer-up-conflict-escalation` label, escalate to CS2 |

#### 6.4 Additive Path — Canonization Candidate PR

When the improvement is assessed as ADDITIVE:

1. Workflow creates branch `canonization/layer-up-<issue>-<date>` from `main`
2. Workflow creates a tracking file at `.agent-admin/governance/layer-up-canonization/canonization-<issue>-<date>.md`
3. Workflow opens a **Draft PR** titled `[Canonization Candidate] Layer-Up #<N> — <title>`
4. Issue is labeled `layer-up-canonization-candidate`
5. **governance-repo-administrator** must apply the actual canon file changes in the PR
6. **CS2 must review and approve** the canonization candidate PR per GOVERNANCE_LAYER_UP_PROTOCOL.md §5.3
7. After CS2 merges, close layer-up issue #N to trigger the close-loop dispatch (Phase 5)

#### 6.5 Conflicting Path — CS2 Escalation

When conflict signals are detected:

1. Issue is labeled `layer-up-conflict-escalation`
2. A comment explains the conflict signals found
3. CS2 must review and reconcile the conflict
4. After reconciliation, CS2 may re-post `Layer up approved` to trigger the additive path
5. If irreconcilable, CS2 closes with `not_planned`

#### 6.6 Manual Triage Fallback

When no HITL approval is present (either on intake or on any subsequent comment that is
not an approval phrase):

- The `layer-up-awaiting-triage` label is applied automatically on intake
- The issue is assigned to `APGI-cmy` (governance-repo-admin) for manual triage
- Manual triage follows the standard Phase 2–5 process above

#### 6.7 Automation Operations Log

All HITL auto-triage operations are logged in the GitHub Actions step summary for the
`governance-layer-up-auto-triage` workflow run, including:

- Issue number and HITL approval actor
- Conflict/additivity assessment result
- Canonization candidate PR URL (if created)
- Escalation label (if added)
- Timestamp of all actions

**Workflow**: `.github/workflows/governance-layer-up-auto-triage.yml`
**Authority**: LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md v1.1.0, Section 13

---

## 7. Integration with Governance Ripple

### 7.1 Layer-Up as Ripple Trigger

**When layer-up results in canon changes**, it MUST trigger layer-down ripple:

```
Application → Layer-Up → Governance Change → Layer-Down → All Applications
```

### 7.2 Ripple Log Format for Layer-Up

**Layer-Up Entry**:
```markdown
[YYYY-MM-DD HH:MM] LAYER_UP from <app-repo> #<issue> → <canon-file> (PROPOSED)
[YYYY-MM-DD HH:MM] LAYER_UP <canon-file> → PR #<pr> (INTEGRATED)
```

**Subsequent Layer-Down Entry**:
```markdown
[YYYY-MM-DD HH:MM] PR #<pr> (Layer-Up Origin: <app-repo> #<issue>) → <consumer-repo> (NOTIFIED) #<issue>
```

### 7.3 Ripple Debt Prevention

**Pre-Canon-Change Layer-Up Scan**:
Before making ANY canon changes, governance-repo-administrator MUST:
1. Scan all consumer repositories for alignment issues
2. Check for pending layer-up issues
3. Resolve any detected drift
4. Log layer-up scan results in evidence log

**Evidence Log Format**:
```
LAYER_UP_SCAN: TIMESTAMP | REPOS_SCANNED: 3 | DRIFT_DETECTED: 0 | PENDING_LAYER_UP: 0 | STATUS: CLEAR
```

---

## 8. Governance Drift Detection & Escalation

### 8.1 What is Governance Drift?

**Governance Drift**: When an application repository's governance state deviates from canonical governance without following layer-up protocol.

**Examples**:
- Modified LOCKED sections in agent contracts
- Outdated governance file versions
- Custom governance rules not in canon
- Disabled or bypassed PR gates
- Unapproved governance file deletions

### 8.2 Drift Detection Methods

1. **Automated (via wake-up protocols)**:
   - governance-liaison wake-up checks GOVERNANCE_ALIGNMENT.md
   - Version mismatch triggers drift alert
   - SHA256 mismatch on LOCKED sections triggers alert

2. **Manual (via governance scans)**:
   - governance-repo-administrator performs layer-up scan
   - Cross-reference governance files with canonical versions
   - Detect unauthorized modifications

3. **Incident-Based (via failure analysis)**:
   - Gate failure reveals governance inconsistency
   - Build failure due to outdated governance
   - Agent confusion from conflicting governance

### 8.3 Drift Escalation Protocol

**Upon drift detection**:

1. **STOP**: Halt any governance changes in progress
2. **DOCUMENT**: Capture full drift evidence
   - Which files drifted
   - Current vs. canonical state
   - When drift occurred (git history)
   - Why drift occurred (if known)

3. **ESCALATE TO CS2**:
   ```markdown
   Title: [CRITICAL] Governance Drift Detected: <repo-name>
   Labels: governance-drift, critical, escalation
   
   ## Drift Summary
   Repository: <repo-name>
   Canonical Version: <version>
   Application Version: <version>
   Drift Scope: <file count>
   
   ## Drifted Files
   - <file1>: <diff summary>
   - <file2>: <diff summary>
   
   ## Evidence
   [Git history, SHA256 mismatches, etc.]
   
   ## Remediation Options
   1. Revert application to canonical (layer-down)
   2. Validate drift and layer-up (if legitimate improvement)
   3. [Other options]
   
   ## Impact Assessment
   [Who's affected, urgency, risk]
   
   @CS2 @johan-ras: Governance authority required for drift resolution
   ```

4. **AWAIT CS2 DECISION**:
   - **Revert**: Execute layer-down to restore canonical state
   - **Validate & Layer-Up**: If drift is legitimate improvement, promote via layer-up
   - **Custom Resolution**: Follow CS2 guidance

5. **PREVENT RECURRENCE**:
   - Update agent contracts to prevent unauthorized changes
   - Add drift detection to PR gates if needed
   - Document incident in governance learnings

---

## 9. Governance-Repo-Administrator Responsibilities

### 9.1 Pre-Canon-Change Layer-Up Scan (Mandatory)

**Before ANY canon changes**, governance-repo-administrator MUST:

```bash
# 1. Check ripple log for pending layer-up
cat .agent-workspace/governance-repo-administrator/ripple-log.md | grep "LAYER_UP.*PROPOSED"

# 2. Check governance repository for open layer-up issues
# (Use GitHub search: is:issue is:open label:layer-up)

# 3. Scan consumer repositories for drift indicators
# - GOVERNANCE_ALIGNMENT.md version mismatches
# - Pending governance issues
# - Recent gate failures

# 4. Log layer-up scan results
echo "LAYER_UP_SCAN: $(date -u +"%Y%m%dT%H%M%SZ") | STATUS: [CLEAR/DRIFT_DETECTED/PENDING_LAYER_UP]" >> .agent-workspace/governance-repo-administrator/evidence-$(date +"%Y%m%d").log
```

**If layer-up scan detects issues**:
- **Drift**: Escalate to CS2 immediately, halt canon changes
- **Pending Layer-Up**: Evaluate and integrate before proceeding with unrelated canon changes
- **Clear**: Proceed with canon changes

### 9.2 Layer-Up Intake Processing

When layer-up issue created in governance repository:

1. **Acknowledge within 24 hours**
2. **Validate and classify** (Section 6, Phase 2)
3. **Escalate if CRITICAL**
4. **Queue for analysis** if HIGH/MEDIUM/LOW
5. **Keep originating application informed** of status

### 9.3 Layer-Up Evidence Preservation

All layer-up evidence MUST be preserved:
- Store in `.agent-workspace/governance-repo-administrator/layer-up-evidence/`
- Include in PR description when creating governance change
- Reference in ripple log
- Maintain audit trail

---

## 10. Failure Modes & Prevention

### ❌ Failure: "Governance stagnates, ignores learnings"
**Prevention**: Mandatory layer-up triggers, evidence-based evolution

### ❌ Failure: "Governance changes without evidence"
**Prevention**: Layer-up protocol requires evidence package for all canon changes

### ❌ Failure: "Application drifts from governance"
**Prevention**: Drift detection in layer-up scan, escalation to CS2

### ❌ Failure: "Governance changes break applications"
**Prevention**: Layer-up scan before changes, ripple tracking, version synchronization

### ❌ Failure: "Learnings lost between agent sessions"
**Prevention**: Layer-up issues persist beyond sessions, evidence preservation

### ❌ Failure: "Circular drift" (governance → app → governance with misalignment)
**Prevention**: Pre-canon-change layer-up scan detects misalignment before new changes

### ❌ Failure: "Uncoordinated governance improvements"
**Prevention**: governance-repo-administrator as sole layer-up intake point

---

## 11. Success Metrics

**Layer-Up Health Indicators**:
- **Learnings Captured**: Count of layer-up issues created per quarter
- **Drift Incidents**: Count of drift detections (target: 0)
- **Layer-Up Integration Time**: Time from issue to canon integration
- **Bidirectional Ripples**: Count of layer-up → layer-down cycles
- **Governance Evolution Rate**: Canon changes per quarter with layer-up evidence

**Target State**:
- Governance evolves continuously from real-world learnings
- Zero governance drift across all repositories
- All canon changes trace back to validated evidence
- Bidirectional ripple tracking shows closed loop
- Applications and governance remain synchronized

---

## 12. Authority References

- **GOVERNANCE_RIPPLE_MODEL.md**: Bidirectional governance evolution framework
- **LEARNING_INTAKE_AND_PROMOTION_MODEL.md**: Learning capture requirements
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md**: Complement layer-down protocol
- **GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md**: Systematic ripple execution
- **STOP_AND_FIX_DOCTRINE.md**: Immediate remediation mandate
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md**: Enhancement capture
- **GOVERNANCE_LAYER_UP_PROTOCOL.md**: Automated layer-up for local extensions (complement)
- **LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md v1.1.0**: HITL approval automation strategy

## 13. HITL Close-Loop Automation Summary

| Component | Detail |
|-----------|--------|
| **Trigger** | Issue comment on a `layer-up` + `governance-improvement` issue |
| **Approval phrase** | `Layer up approved` (case-insensitive variants accepted) |
| **Authorized actors** | APGI-cmy, johanras, maturion-bot |
| **Additive result** | Draft canonization candidate PR opened automatically |
| **Conflicting result** | `layer-up-conflict-escalation` label + CS2 escalation comment |
| **No-approval fallback** | `layer-up-awaiting-triage` label + assignee APGI-cmy |
| **Ops log** | GitHub Actions step summary for each run |
| **Workflow file** | `.github/workflows/governance-layer-up-auto-triage.yml` |
| **Doc reference** | Section 6 Phase 6 (above) |

---

## Appendix A: Layer-Up Checklist for Application Agents

**When to consider layer-up** (governance-liaison, foreman, builder):

- [ ] Encountered governance gap (no canonical guidance for situation)
- [ ] Encountered governance conflict (multiple canons provide contradictory guidance)
- [ ] Detected governance drift (local governance differs from canonical)
- [ ] Observed governance failure pattern (same governance issue multiple times)
- [ ] Identified governance improvement opportunity (validated by evidence)
- [ ] Breaking change needed (current governance blocks valid progress)
- [ ] Cross-repository pattern observed (multiple apps have same issue)

**If ANY checked**, create layer-up issue following Section 6, Phase 1.

---

## Appendix B: Layer-Up Issue Template

```markdown
Title: [Layer-Up] <Brief Description>

## Trigger
<!-- Select one from Section 5 -->
- [ ] Governance Drift Detected
- [ ] Governance Gap Discovered
- [ ] Governance Conflict Discovered
- [ ] Governance Failure Pattern Detected
- [ ] Breaking Change Required
- [ ] Learning Promotion Threshold Met
- [ ] Governance Enhancement Validated
- [ ] Cross-Repository Pattern Observed

## Origin
**Repository**: <application-repo-name>
**Reference Issue**: <app-repo>#<issue-number>
**Agent**: <agent-name>
**Date**: <YYYY-MM-DD>

## Evidence
<!-- Provide concrete evidence -->
- Logs:
- Screenshots:
- Git history:
- Gate output:
- Other:

## Current Governance State
**Applicable Canon Files**:
- <file1> (version)
- <file2> (version)

**Current Canonical Guidance**:
<!-- What does current governance say? -->

**Current Application State**:
<!-- How does application differ? -->

## Observed Gap/Conflict/Failure
<!-- Describe what's wrong or missing -->

## Proposed Governance Improvement
<!-- What should change in canonical governance? -->

**Affected Canon Files**:
- <file1>: <proposed change>
- <file2>: <proposed change>

**Rationale**:
<!-- Why this change improves governance -->

**Breaking Change**: [YES / NO]

## Impact Assessment
**Who's Affected**: <list of repos/agents>
**Urgency**: [CRITICAL / HIGH / MEDIUM / LOW]
**Scope**: [Single repo / Multiple repos / All repos]

## Request
@governance-repo-administrator: Please review and integrate this layer-up.
```

---

**Version**: 1.1.0  
**Created**: 2026-02-09  
**Updated**: 2026-03-01 — Added Section 6 Phase 6 (HITL Close-Loop Automation), Section 13  
**Authority**: GOVERNANCE_RIPPLE_MODEL.md, Living Agent System v5.0.0, Issue #1047  
**Owner**: governance-repo-administrator  
**Purpose**: Enable bidirectional governance evolution through structured layer-up protocol
