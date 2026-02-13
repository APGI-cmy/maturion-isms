# RIPPLE ACTIVATION PLAN - TRS Governance Upgrade

**Date**: 2026-02-13  
**Session**: governance-trs-upgrade-20260213  
**Agent**: governance-liaison-isms  
**Governance Change**: Insert TRS (Technical Requirements Specification) stage in module lifecycle

---

## 1. Governance Changes Summary

### Changes Made in maturion-isms Repository

#### 1.1 Core Governance Documents Updated

1. **MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md**
   - Updated canonical module lifecycle from 6 to 7 stages
   - Inserted TRS stage between FRS (Stage 1) and Architecture (Stage 2)
   - Added new section 4.1 defining TRS stage comprehensively
   - Updated module folder structure to include `01.5-trs/`
   - Defined TRS ownership, scope, deliverables, and traceability requirements

2. **APP_DESCRIPTION_REQUIREMENT_POLICY.md**
   - Updated canonical flow diagram to include TRS stage
   - Updated ordering rule to: App Description → FRS → TRS → Architecture → Build Authorization → Implementation

3. **BUILD_PROGRESS_TRACKER_TEMPLATE.md** (NEW)
   - Created new governance template for tracking module progress
   - Includes all 7 lifecycle stages with TRS stage
   - Provides checklist for artifacts, approvals, and completion tracking
   - Location: `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`

#### 1.2 Module-Level Changes

Created `BUILD_PROGRESS_TRACKER.md` for all 8 existing modules:
- course-crafter
- incident-intelligence
- isms
- mat
- maturity-roadmap
- pit
- risk-management
- xdetect

Each tracker documents:
- TRS stage as NOT_STARTED
- Note explaining governance upgrade
- Next steps for creating TRS content

---

## 2. Ripple Scope and Impact

### 2.1 Breaking Change Classification

**Classification**: **MODERATE BREAKING CHANGE**

**Rationale**:
- Adds new mandatory stage (TRS) between existing stages (FRS and Architecture)
- Requires module structure change (`01.5-trs/` folder)
- Requires process change (TRS must be developed before Architecture)
- Does NOT invalidate existing work (existing modules can continue with TRS as next step)

### 2.2 Affected Repositories (Per CONSUMER_REPO_REGISTRY.json)

According to canonical governance, the following consumer repositories need ripple:

1. **APGI-cmy/maturion-isms** (THIS REPOSITORY - already updated)
2. **APGI-cmy/maturion-foreman-office-app** (FM repository)
3. **APGI-cmy/office-app** (if exists and governed)
4. **APGI-cmy/PartPulse** (if exists and governed)
5. **APGI-cmy/R_Roster** (if exists and governed)

### 2.3 Governance Artifacts Requiring Layer-Down

**Canon Files Updated**: (None - these are strategy/policy files, not canon)

**Strategy/Policy Files Updated**:
- `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md`
- `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md`

**Templates Created**:
- `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`

**Action Required**: 
- If these strategy/policy files are shared across repos, they should be layered down
- If these are local strategy files, ripple communication should inform other repos of the change

---

## 3. Ripple Listener Status

### 3.1 Current State

**Workflow Files Found**:
- `.github/workflows/merge-gate-interface.yml`
- `.github/workflows/model-scaling-check.yml`

**Ripple Listener Workflow**: ❌ **NOT FOUND**

**Observation**: Per the issue, no dedicated ripple-listener, ripple-sync, or equivalent workflow exists in the ISMS repository.

### 3.2 Ripple Listener Requirements (Per CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md)

**Mandatory Requirements**:

1. **Repository Dispatch Listener**
   - Listen for `repository_dispatch` events with `event_type: governance_ripple`
   - Triggered by governance repo when canon changes

2. **Scheduled Fallback**
   - Runs hourly (cron schedule)
   - Checks for governance drift even if dispatch missed
   - Recovers from missed ripple events

3. **Ripple Log**
   - Record received ripple events to `.agent-admin/governance/ripple-log.json`
   - Track dispatch ID, timestamp, changed paths

4. **Sync State Update**
   - Update `.agent-admin/governance/sync_state.json` after ripple processed
   - Record alignment status, last sync time

5. **Alignment PR Creation**
   - Create PR if drift detected
   - Layer down updated canon files
   - Update local governance artifacts

### 3.3 Ripple Listener Implementation Status

**Status**: ⚠️ **MISSING - IMPLEMENTATION REQUIRED**

**Recommendation**: Create ripple-listener workflow following CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md requirements.

**Workflow Location**: `.github/workflows/ripple-listener.yml`

**Workflow Triggers**:
```yaml
on:
  repository_dispatch:
    types: [governance_ripple]
  schedule:
    - cron: '0 * * * *'  # Hourly fallback
  workflow_dispatch:  # Manual trigger for testing
```

**Workflow Actions**:
1. Receive ripple event (dispatch or scheduled check)
2. Fetch latest CANON_INVENTORY.json from canonical governance repo
3. Compare with local sync_state.json to detect drift
4. If drift detected:
   - Create PR with updated canon files
   - Update ripple-log.json
   - Update sync_state.json
5. If no drift: Log "no changes" and exit

---

## 4. Ripple Activation Approach

### 4.1 Option A: Automated Ripple (RECOMMENDED)

**Prerequisites**:
1. Implement ripple-listener workflow in maturion-isms (`.github/workflows/ripple-listener.yml`)
2. Implement ripple-dispatcher workflow in canonical governance repo
3. Configure CONSUMER_REPO_REGISTRY.json with maturion-isms entry

**Activation Steps**:
1. Create issue in maturion-foreman-governance repo: "Layer-Down TRS Governance Upgrade to Consumer Repos"
2. Issue triggers ripple-dispatcher workflow
3. Dispatcher sends `repository_dispatch` to all consumer repos
4. Ripple-listener workflows in consumer repos receive event
5. Governance liaison agents in each repo create alignment PRs
6. PRs reviewed and merged

**Timeline**: 1-2 hours after governance repo merge

**Advantages**:
- ✅ Deterministic and automated
- ✅ Follows canonical governance protocol
- ✅ Auditable with ripple logs
- ✅ Scalable to many repos

**Disadvantages**:
- ❌ Requires ripple-listener implementation first
- ❌ Requires governance repo dispatcher setup

---

### 4.2 Option B: Manual Ripple (FALLBACK)

**Activation Steps**:
1. Create layer-down issues manually in each consumer repo:
   - `maturion-foreman-office-app`: "Layer-Down: TRS Stage Governance Upgrade"
   - `office-app`, `PartPulse`, `R_Roster`: Similar issues
2. Assign issues to governance liaison agents in each repo
3. Governance liaison agents:
   - Review governance changes from maturion-isms
   - Update local governance/strategy files
   - Create BUILD_PROGRESS_TRACKER.md for modules
   - Update module structures
   - Create alignment PR

**Timeline**: 1-3 days depending on agent availability

**Advantages**:
- ✅ No workflow implementation required
- ✅ Can proceed immediately
- ✅ Human review at each step

**Disadvantages**:
- ❌ Manual and time-consuming
- ❌ Not scalable
- ❌ Risk of inconsistency across repos
- ❌ Not aligned with canonical governance protocol

---

### 4.3 Recommended Approach: **HYBRID**

**Phase 1: Manual Ripple for This Cycle** (Immediate)
- Proceed with manual layer-down issues for TRS governance upgrade
- Document manual ripple process and learnings

**Phase 2: Implement Automated Ripple** (Next Sprint)
- Create ripple-listener.yml workflow
- Test with non-breaking governance changes
- Fully automate for future governance upgrades

**Rationale**:
- TRS upgrade is time-sensitive (prevents implementation failures)
- Automated ripple implementation should not block this critical governance change
- Manual process provides learning for automated implementation
- Future governance changes will benefit from automation

---

## 5. Ripple Communication Artifacts

### 5.1 Governance Change Summary for Upstream Ripple

**Subject**: Governance Upgrade - TRS Stage Inserted in Module Lifecycle

**Summary**:
- **Change Type**: Module Lifecycle Enhancement
- **Breaking**: Moderate (adds mandatory stage between FRS and Architecture)
- **Affected Artifacts**: MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md, APP_DESCRIPTION_REQUIREMENT_POLICY.md
- **New Template**: BUILD_PROGRESS_TRACKER_TEMPLATE.md
- **Action Required**: Consumer repos should update local governance and create BUILD_PROGRESS_TRACKER.md for modules

**Change Details**:
1. TRS stage inserted between FRS (Stage 1) and Architecture (Stage 2)
2. TRS captures: technical constraints, performance requirements, integration requirements, tool validation rules
3. Module folder structure updated: add `01.5-trs/` folder
4. TRS prevents downstream implementation/integration failures by bridging FRS and Architecture

**Migration Path**:
- Existing modules: Continue with current stage; add TRS before next Architecture update
- New modules: Must include TRS stage from start
- No retroactive invalidation of existing work

**Evidence**:
- Commit: [commit SHA from this PR]
- PR: [PR number]
- Session Memory: `.agent-workspace/governance-liaison-isms/memory/session-005-20260213.md`

### 5.2 Consumer Repo Action Items

For each consumer repo (office-app, PartPulse, R_Roster, FM):

**Required Actions**:
1. ✅ Review TRS governance upgrade changes
2. ✅ Update local `governance/strategy/MODULE_LIFECYCLE_AND_REPO_STRUCTURE_STRATEGY.md` (if exists)
3. ✅ Update local `governance/policy/APP_DESCRIPTION_REQUIREMENT_POLICY.md` (if exists)
4. ✅ Create `governance/templates/BUILD_PROGRESS_TRACKER_TEMPLATE.md`
5. ✅ For each existing module: Create `BUILD_PROGRESS_TRACKER.md`
6. ✅ For future modules: Include `01.5-trs/` folder in structure
7. ✅ Update module manifest templates to include TRS stage
8. ✅ Document TRS requirements in architecture guidelines

**Timeline**: Within 2 weeks of governance upgrade merge

---

## 6. Ripple Activation Checklist

### 6.1 Pre-Ripple (Governance Repo)

- [x] TRS governance changes implemented in maturion-isms
- [x] Changes committed and PR created
- [ ] PR reviewed and approved
- [ ] PR merged to main
- [ ] Governance change documented in CHANGELOG (if applicable)
- [ ] Layer-down issue created in governance repo

### 6.2 Ripple Dispatch (Governance Repo)

**IF AUTOMATED**:
- [ ] Ripple-dispatcher workflow triggered
- [ ] `repository_dispatch` events sent to all consumer repos
- [ ] Dispatch success logged in governance repo

**IF MANUAL**:
- [ ] Layer-down issues created in each consumer repo
- [ ] Issues assigned to governance liaison agents
- [ ] Issues include governance change summary and action items

### 6.3 Ripple Reception (Consumer Repos)

**IF AUTOMATED**:
- [ ] Ripple-listener workflows received dispatch events
- [ ] Ripple events logged to ripple-log.json
- [ ] Alignment PRs created automatically
- [ ] Sync state updated

**IF MANUAL**:
- [ ] Governance liaison agents acknowledged issues
- [ ] Governance liaison agents reviewed changes
- [ ] Alignment PRs created by agents
- [ ] PRs reviewed and merged

### 6.4 Ripple Completion

- [ ] All consumer repos aligned with TRS governance upgrade
- [ ] All BUILD_PROGRESS_TRACKER.md files created
- [ ] All module structures updated
- [ ] Governance alignment verified
- [ ] Ripple completion logged in governance repo

---

## 7. Escalation Path

**Blocker**: Ripple-listener workflow does not exist

**Resolution Options**:
1. **Implement ripple-listener workflow** (Recommended for long-term)
   - Assign to: Governance Administrator or FM
   - Timeline: 1-2 days
   - Follow: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md

2. **Proceed with manual ripple** (Recommended for this cycle)
   - Assign to: Governance Liaison agents in each repo
   - Timeline: 1-3 days
   - Document learnings for future automation

**Decision Authority**: CS2 (Johan) or FM

**Recommendation**: Proceed with manual ripple for TRS upgrade (time-sensitive), implement automated ripple for future governance changes.

---

## 8. Evidence and Audit Trail

**Governance Changes**:
- Location: `maturion-isms` repository
- Branch: `copilot/upgrade-governance-for-trs`
- Commit: [To be recorded after merge]
- PR: [To be recorded after creation]

**Ripple Log**:
- Location: `.agent-admin/governance/ripple-log.json` (to be created)
- Format: Per CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md Section 5

**Sync State**:
- Location: `governance/sync_state.json`
- Updated: After ripple completion

**Session Memory**:
- Location: `.agent-workspace/governance-liaison-isms/memory/session-005-20260213.md`
- Status: To be created during session closure

---

## 9. Next Steps

### Immediate (This Session)
1. ✅ Complete governance document updates
2. ✅ Create BUILD_PROGRESS_TRACKER files
3. ✅ Commit and push changes
4. [ ] Complete Phase 6 validation (code review, security scan)
5. [ ] Create session memory
6. [ ] Execute session closure protocol

### Short-Term (Next 1-2 Days)
1. [ ] PR reviewed and merged
2. [ ] Create layer-down issues in consumer repos (MANUAL approach)
3. [ ] OR implement ripple-listener workflow (AUTOMATED approach)
4. [ ] Activate ripple to all consumer repos

### Medium-Term (Next 1-2 Weeks)
1. [ ] All consumer repos aligned with TRS governance
2. [ ] BUILD_PROGRESS_TRACKER files created across all repos
3. [ ] TRS stage documented in all governance
4. [ ] Ripple completion verified

### Long-Term (Next Sprint)
1. [ ] Implement automated ripple-listener workflows
2. [ ] Test automated ripple with non-breaking changes
3. [ ] Document ripple automation learnings
4. [ ] Update governance liaison training with ripple protocols

---

**Authority**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md, GOVERNANCE_RIPPLE_MODEL.md, LAYER_UP_PROTOCOL.md  
**Session**: governance-trs-upgrade-20260213  
**Agent**: governance-liaison-isms  
**Status**: Ripple activation planning complete; awaiting decision on automated vs manual approach
