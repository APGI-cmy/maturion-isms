# Governance Ripple and Alignment System

## Overview

The maturion-isms repository implements a complete governance ripple receiver and alignment infrastructure per **Living Agent System v6.2.0** and **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md**.

This system ensures that governance artifacts remain synchronized with the canonical source (`APGI-cmy/maturion-foreman-governance`) through automated drift detection, layer-down, and PR creation.

## Authority

- **LIVING_AGENT_SYSTEM.md v6.2.0**
- **CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md**
- **GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md**
- **Governance Liaison Contract v2.0.0**

## Architecture

### 8 Core Components

#### 1. Receiver Workflow ✅
**File**: `.github/workflows/governance-ripple-sync.yml`

Event-driven workflow that listens for `repository_dispatch` events with type `governance_ripple` from the canonical governance repository.

**Triggers**:
- Repository dispatch events (push-based, < 1 minute latency)
- Manual workflow dispatch (for testing)

**Actions**:
1. Receives ripple event with canonical commit hash and changed paths
2. Runs alignment script to detect drift
3. Layers down canonical governance files
4. Creates PR with evidence artifacts

#### 2. Alignment Script ✅
**File**: `.github/scripts/align-governance.sh`

Comprehensive alignment script that handles drift detection, SHA256 verification, and layer-down.

**Features**:
- Fetches canonical `CANON_INVENTORY.json`
- Compares local and canonical SHA256 hashes
- Detects missing files and hash mismatches
- Layers down canonical files with verification
- Updates `sync_state.json` and `CANON_INVENTORY.json`
- Creates drift reports and ripple logs
- Supports `--dry-run` and `--force-pr` modes

**Usage**:
```bash
# Normal alignment
.github/scripts/align-governance.sh

# Dry run (no changes)
.github/scripts/align-governance.sh --dry-run

# Force PR creation (for testing)
.github/scripts/align-governance.sh --force-pr
```

#### 3. Scheduled Fallback Workflow ✅
**File**: `.github/workflows/governance-alignment-schedule.yml`

Scheduled workflow that runs hourly as a fallback mechanism in case push-based ripple events are missed.

**Schedule**: Every hour on the hour (`0 * * * *`)

**Purpose**:
- Provides redundancy for ripple receiver
- Ensures governance stays aligned even if repository_dispatch fails
- Independent of external event delivery

**Actions**:
1. Runs alignment script on schedule
2. Detects drift automatically
3. Creates alignment PR if needed

#### 4. Evidence/Sync Infrastructure ✅
**Directory**: `.agent-admin/governance/`

Contains evidence artifacts, ripple logs, and drift reports.

**Files**:
- `ripple-log.json` - Log of all governance ripple events
- `drift-report-*.md` - Drift detection reports (one per alignment)
- `README.md` - Documentation for evidence directory

**Related**:
- `governance/sync_state.json` - Synchronization state and metadata
- `governance/CANON_INVENTORY.json` - Canonical artifact inventory with SHA256 hashes

#### 5. Merge Gate Standardization ✅
**File**: `.github/workflows/merge-gate-interface.yml`

Standardized merge gate workflow with required job names per **MERGE_GATE_INTERFACE_STANDARD.md**.

**Required Jobs** (for branch protection):
1. `merge-gate/verdict` - Evidence-based validation and verdict
2. `governance/alignment` - Governance artifact integrity checks
3. `stop-and-fix/enforcement` - Stop-and-fix compliance verification

**Branch Protection Configuration**:
```yaml
required_status_checks:
  contexts:
    - "merge-gate/verdict"
    - "governance/alignment"
    - "stop-and-fix/enforcement"
```

#### 6. Token Configuration ⚠️
**Secret**: `MATURION_BOT_TOKEN`

**Required Permissions**:
- `contents: write` - Create branches and commits
- `pull-requests: write` - Create PRs

**Verification**:
```bash
# Test token can create branches
gh auth status --hostname github.com

# Test token can create PRs
gh pr list --repo APGI-cmy/maturion-isms
```

**Fallback**: Workflows use `secrets.MATURION_BOT_TOKEN || github.token` to gracefully degrade to default token if bot token unavailable.

#### 7. Layer-Up Trigger Automation ✅
**File**: `.github/workflows/layer-up-trigger.yml`

Automated workflow that listens for PR merge or approval comment events and creates
a layer-up issue with the required labels, eliminating manual issue creation for
most governance improvement scenarios.

**Triggers**:
- PR comment containing `"Auto layer up approved"` or `"Layer up approved"` (case-insensitive)
- PR closed as merged with approval phrase in the PR body

**Actions**:
1. Detects approval phrase in PR body or comment
2. Checks for duplicate layer-up issues (idempotent)
3. Creates layer-up issue with labels `layer-up` + `governance-improvement` and PR cross-link
4. Includes conflict-detection instructions for reviewers
5. Comments on the originating PR with the issue reference
6. `layer-up-dispatch.yml` automatically picks up the labeled issue and escalates to the governance repo

**Human fallback**: Manual issue creation with `layer-up` + `governance-improvement` labels
is always supported and continues to work unchanged.

#### 8. Documentation ✅
**This file**: `docs/GOVERNANCE_RIPPLE_SYSTEM.md`

Comprehensive maintainability guide covering:
- System architecture and components
- Trigger mechanisms and workflows
- Evidence artifacts and audit trail
- Troubleshooting and manual intervention
- Testing and validation procedures

## Trigger Mechanisms

### 1. Push-Based Ripple (Primary)

**Canonical Source → Consumer Repository**

When governance changes are pushed to `APGI-cmy/maturion-foreman-governance`:
1. Canonical repository dispatches `governance_ripple` event
2. Consumer receives event via `repository_dispatch` webhook
3. `governance-ripple-sync.yml` triggers immediately (< 1 minute)
4. Alignment script detects drift and creates PR

**Expected Latency**: < 1 minute

### 2. Scheduled Fallback (Secondary)

**Hourly Cron Job**

Every hour, `governance-alignment-schedule.yml`:
1. Runs alignment script automatically
2. Fetches latest canonical governance
3. Compares with local governance
4. Creates PR if drift detected

**Expected Latency**: Up to 1 hour

### 3. Automated Layer-Up Trigger (Upward Direction)

**PR Merge or Approval Comment → Layer-Up Issue Created Automatically**

When a PR merges with an approval phrase in its body, or when a reviewer comments
`"Auto layer up approved"` / `"Layer up approved"` on a PR:

1. `layer-up-trigger.yml` detects the approval phrase
2. Creates a layer-up issue with labels `layer-up` + `governance-improvement`
3. Includes conflict-detection instructions and PR cross-link
4. `layer-up-dispatch.yml` picks up the issue and escalates to the governance repo

**Supported approval phrases** (case-insensitive):
- `Auto layer up approved`
- `Layer up approved`

**Idempotency**: If a layer-up issue for the same PR already exists, no duplicate is created.

**Human fallback**: Manual issue creation with the required labels continues to work.

### 4. Manual Trigger (Testing)

**Workflow Dispatch**

Both workflows support manual triggering:
```bash
# Trigger ripple sync manually
gh workflow run governance-ripple-sync.yml

# Trigger scheduled alignment manually
gh workflow run governance-alignment-schedule.yml
```

## Evidence Artifacts

### Ripple Log

**File**: `.agent-admin/governance/ripple-log.json`

**Format**:
```json
{
  "version": "1.0.0",
  "repository": "APGI-cmy/maturion-isms",
  "canonical_source": "APGI-cmy/maturion-foreman-governance",
  "ripple_events": [
    {
      "timestamp": "2026-02-14T12:00:00Z",
      "session_id": "align-20260214-120000",
      "type": "automated-alignment",
      "canonical_commit": "abc123...",
      "files_updated": 5,
      "status": "SUCCESS"
    }
  ]
}
```

### Drift Reports

**Files**: `.agent-admin/governance/drift-report-*.md`

**Format**:
```markdown
# Governance Drift Report

**Session ID**: align-20260214-120000
**Timestamp**: 2026-02-14T12:00:00Z
**Canonical Commit**: abc123...
**Canonical Version**: 1.0.0

## Drift Summary
- **Missing Files**: 2
- **Hash Mismatches**: 3
- **Files Layered Down**: 5

## Missing Files
- `governance/canon/NEW_FILE.md`

## Hash Mismatches
- `governance/canon/UPDATED_FILE.md`

## Files Updated
- `governance/canon/NEW_FILE.md`
- `governance/canon/UPDATED_FILE.md`
- `governance/CANON_INVENTORY.json`
- `governance/sync_state.json`
```

### Sync State

**File**: `governance/sync_state.json`

Tracks synchronization metadata:
- Last sync timestamp and session ID
- Canonical commit hash
- Total canons synced
- Alignment status (ALIGNED/DRIFTED)
- SHA256 variance tracking

## Validation & Testing

### End-to-End Test

**Objective**: Verify governance update triggers alignment PR in < 1 minute

**Steps**:
1. Make change in canonical governance repository
2. Push change (triggers ripple dispatch)
3. Verify ripple event received in consumer repository
4. Verify alignment PR created automatically
5. Verify PR contains drift report and evidence artifacts

**Command**:
```bash
# Trigger manual test
gh workflow run governance-ripple-sync.yml --repo APGI-cmy/maturion-isms
```

### Scheduled Fallback Test

**Objective**: Verify hourly check detects and corrects drift

**Steps**:
1. Manually modify local governance file (create drift)
2. Wait for next hourly run OR trigger manually
3. Verify drift detected
4. Verify alignment PR created
5. Verify PR corrects the drift

**Command**:
```bash
# Trigger manual test
gh workflow run governance-alignment-schedule.yml --repo APGI-cmy/maturion-isms
```

### Alignment Script Test

**Objective**: Verify alignment script functions correctly

**Steps**:
```bash
# Dry run test (no changes)
.github/scripts/align-governance.sh --dry-run

# Force PR test (even if no drift)
.github/scripts/align-governance.sh --force-pr
```

## Troubleshooting

### Issue: No PR Created After Ripple Event

**Diagnosis**:
1. Check workflow runs: `gh run list --workflow governance-ripple-sync.yml`
2. Check workflow logs: `gh run view <run-id> --log`
3. Verify ripple event received: Check workflow trigger

**Common Causes**:
- Token permissions insufficient
- Alignment script found no drift
- PR creation failed (conflict, branch exists)

**Resolution**:
- Verify `MATURION_BOT_TOKEN` has correct permissions
- Run alignment script manually: `.github/scripts/align-governance.sh`
- Check for existing branch: `git branch -r | grep governance-ripple`

### Issue: Scheduled Fallback Not Running

**Diagnosis**:
1. Check workflow file syntax: `.github/workflows/governance-alignment-schedule.yml`
2. Verify cron schedule: `0 * * * *`
3. Check last run: `gh run list --workflow governance-alignment-schedule.yml`

**Common Causes**:
- Workflow file has syntax errors
- Repository settings disable scheduled workflows
- Workflow disabled in UI

**Resolution**:
- Validate YAML syntax: `yamllint .github/workflows/governance-alignment-schedule.yml`
- Enable workflow in repository settings
- Trigger manually to test: `gh workflow run governance-alignment-schedule.yml`

### Issue: Hash Verification Fails

**Diagnosis**:
1. Check drift report: `.agent-admin/governance/drift-report-*.md`
2. Compare local and canonical SHA256
3. Verify canonical inventory not using placeholder hashes

**Common Causes**:
- Canonical inventory has placeholder hashes (degraded mode)
- Local file modified outside of governance process
- SHA256 calculation error

**Resolution**:
- Verify canonical `CANON_INVENTORY.json` has full SHA256 hashes
- Re-fetch canonical file and recalculate hash
- Escalate to CS2 if canonical inventory degraded

### Issue: Evidence Artifacts Missing

**Diagnosis**:
1. Check directory exists: `ls -la .agent-admin/governance/`
2. Check alignment script logs
3. Verify workflow has write permissions

**Common Causes**:
- Evidence directory not created
- Alignment script failed before creating evidence
- File system permissions issue

**Resolution**:
- Create directory: `mkdir -p .agent-admin/governance`
- Run alignment script manually to test
- Verify workflow permissions: `contents: write`

## Manual Intervention

### Force Alignment

If automated alignment fails, manually run:

```bash
cd /path/to/maturion-isms
.github/scripts/align-governance.sh
git add .
git commit -m "Manual governance alignment"
git push origin <branch>
```

### Verify Alignment Status

```bash
# Check sync state
cat governance/sync_state.json | jq '.alignment_status'

# Check last sync
cat governance/sync_state.json | jq '.last_sync'

# Check ripple log
cat .agent-admin/governance/ripple-log.json | jq '.ripple_events[-5:]'
```

### Reset Alignment

If alignment is corrupted:

```bash
# Backup current state
cp governance/sync_state.json governance/sync_state.json.backup

# Force re-sync from canonical
.github/scripts/align-governance.sh --force-pr
```

## Maintenance

### Evidence Artifact Retention

- Keep last 10 drift reports
- Archive older reports to `.agent-admin/governance/archive/`
- Ripple log grows indefinitely (consider rotation after 1000 events)

### Scheduled Tasks

- **Hourly**: Scheduled alignment check
- **Quarterly**: Manual review of alignment status
- **Annually**: Review and update this documentation

### Monitoring

Key metrics to monitor:
- Ripple event latency (should be < 1 minute)
- Scheduled fallback success rate (should be 100%)
- Drift frequency (should be low)
- PR creation success rate (should be 100%)

## Governance Liaison Authority

Per **GOVERNANCE_LIAISON_MINIMUM_APPOINTMENT_REQUIREMENTS.md**, the Governance Liaison has **unique self-alignment authority**:

✅ Layer down governance canon automatically when drift detected  
✅ Update governance inventories automatically  
✅ Sync local governance with canonical source  
✅ Verify and proceed with job after self-alignment

❌ CANNOT modify own contract (escalate to CS2)  
❌ CANNOT interpret governance policy  
❌ CANNOT cross repository boundaries to modify canonical source  
❌ CANNOT make architecture, builder, or enforcement decisions

## Reference Implementation

This maturion-isms implementation serves as the **gold standard reference** for governance ripple infrastructure across all consumer repositories.

Key features:
- Complete 7-component implementation
- Evidence-based validation
- Deterministic drift detection
- SHA256 verification at every step
- Comprehensive audit trail
- Graceful degradation with fallback mechanisms

## Version History

- **v1.1.0** (2026-03-01) - Layer-up trigger automation
  - Added `layer-up-trigger.yml` (Component 7) for automated layer-up issue creation
  - Documented Layer-Up Trigger in Trigger Mechanisms section
  - Updated component count from 7 to 8

- **v1.0.0** (2026-02-14) - Initial complete implementation
  - All 7 components implemented
  - End-to-end testing validated
  - Documentation complete

---

**Version**: 1.0.0  
**Created**: 2026-02-14  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0  
**Maintained By**: Governance Liaison (governance-liaison-isms)
