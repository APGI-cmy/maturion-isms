# GOVERNANCE REPO ADMINISTRATOR REQUIREMENTS CHECKLIST

**Generated**: 2026-02-11  
**Authority**: Governance Canon + LCAS-001 Strategy  
**Scope**: governance-repo-administrator agent operating in maturion-foreman-governance repository  
**Version**: 2.0.0 (CANON_INVENTORY-first, excludes .github/agents references)

---

## Overview

This checklist defines all requirements for the governance-repo-administrator agent, derived exclusively from:
- Governance canon files (`governance/canon/**/*.md`)
- LCAS-001 Strategy (`maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md`)
- Canonical inventory and governance artifacts

**Degraded Mode Note**: CANON_INVENTORY.json contains placeholder/truncated hashes for PUBLIC_API layer-down artifacts. Per CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md Section 4, this triggers DEGRADED alignment mode. Consumer repositories must be notified and governance change request escalated to CS2.

---

## Category 1: Canon Management

### REQ-CM-001: Canon Inventory Integrity
**Statement**: MUST maintain governance/CANON_INVENTORY.json with full sha256 hashes (no placeholders) for all PUBLIC_API artifacts.  
**Source**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` Section 2  
**Severity**: CRITICAL  
**Validation Hook**: `jq -e '.canons[] | select(.layer_down_status=="PUBLIC_API") | select(.file_hash=="placeholder" or (.file_hash|type=="string" and (.|length)<16))' governance/CANON_INVENTORY.json` should return empty

### REQ-CM-002: Canon Provenance Recording
**Statement**: Every CANON_INVENTORY.json entry MUST record canonical commit SHA and canon effective date.  
**Source**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` Section 3  
**Severity**: HIGH  
**Validation Hook**: `jq -e '.canons[] | select(.effective_date == null or .effective_date == "")' governance/CANON_INVENTORY.json` should return empty

### REQ-CM-003: Canon Modification Authority
**Statement**: Constitutional canon semantic changes require CS2 approval; liaison may only correct syntax errors.  
**Source**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` Section 4.5  
**Severity**: CRITICAL  
**Validation Hook**: PR description must contain CS2 approval reference for constitutional canon changes

### REQ-CM-004: Canon Version Control
**Statement**: All constitutional canon MUST include explicit version in document header.  
**Source**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` Section 4.4  
**Severity**: HIGH  
**Validation Hook**: `grep -L "^\*\*Version\*\*:" governance/canon/*_CANON.md` should return empty

### REQ-CM-005: Protected Canon Files
**Statement**: MUST NOT modify BUILD_PHILOSOPHY.md, FM_ROLE_CANON.md, WAVE_MODEL.md, LIVING_AGENT_SYSTEM.md, GOVERNANCE_PURPOSE_AND_SCOPE.md without CS2 approval.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 9.1  
**Severity**: CRITICAL  
**Validation Hook**: Protected file change detection in PR diff with CS2 approval verification

---

## Category 2: Evidence & Records

### REQ-ER-001: Evidence Immutability
**Statement**: Governance evidence artifacts (Type 5) are immutable after generation; create new file for re-validation.  
**Source**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` Section 8.5  
**Severity**: HIGH  
**Validation Hook**: Git history check for modifications to existing evidence files

### REQ-ER-002: Evidence Completeness
**Statement**: All evidence files MUST contain Date, Author, and required schema fields.  
**Source**: `governance/canon/GOVERNANCE_VALIDATION_PROTOCOL.md` Section 6.5  
**Severity**: MEDIUM  
**Validation Hook**: `grep -L "Date:" governance/evidence/*.md && grep -L "Author:" governance/evidence/*.md`

### REQ-ER-003: Session Memory Capture
**Statement**: MUST create session memory in `.agent-workspace/governance-repo-administrator/memory/` with structured format per LIVING_AGENT_SYSTEM.md.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 5 (Memory Format)  
**Severity**: MEDIUM  
**Validation Hook**: Existence check for `memory/session-*.md` with required sections

### REQ-ER-004: Memory Rotation
**Statement**: Maintain rolling 5-session memory window; archive older sessions to `.archive/` with monthly summaries.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 3.3  
**Severity**: LOW  
**Validation Hook**: `ls -1 .agent-workspace/governance-repo-administrator/memory/session-*.md | wc -l` should be ≤ 5

### REQ-ER-005: Audit Trail Preservation
**Statement**: All governance changes MUST maintain git history audit trail; never force-push or rewrite history.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.1  
**Severity**: CRITICAL  
**Validation Hook**: Git reflog check for force-push or rebase operations

---

## Category 3: Ripple & Alignment

### REQ-RA-001: Constitutional Canon Ripple Mandatory
**Statement**: Changes to constitutional canon MUST trigger governance ripple (layer-down) to all consumer repos.  
**Source**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` Section 11  
**Severity**: CRITICAL  
**Validation Hook**: Ripple execution log in `governance/ripple/` for constitutional changes

### REQ-RA-002: Inventory Update on Canon Changes
**Statement**: MUST update GOVERNANCE_ARTIFACT_INVENTORY.md and CANON_INVENTORY.json when canon created/modified/removed.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 4.3  
**Severity**: HIGH  
**Validation Hook**: `git diff --name-status | grep "governance/canon/" | wc -l` vs `git diff governance/CANON_INVENTORY.json | wc -l` correlation

### REQ-RA-003: Ripple Log Atomic Updates
**Statement**: Ripple log entries MUST be created atomically with issue creation, including issue numbers, timestamps, and status.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.3  
**Severity**: HIGH  
**Validation Hook**: Ripple log timestamp correlation with GitHub issue creation timestamp

### REQ-RA-004: Layer-Up Intake and Processing
**Statement**: MUST process layer-up issues from consumer repos, validate evidence, classify severity (CRITICAL/HIGH/MEDIUM/LOW), and draft governance changes.  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 5.3 + `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 5.3  
**Severity**: HIGH  
**Validation Hook**: Layer-up issue label and processing documentation in governance PR

### REQ-RA-005: Pre-Canon-Change Layer-Up Scan
**Statement**: MUST scan consumer repositories for drift and pending layer-up issues BEFORE making new canon changes.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 5.3 (Pre-Canon-Change Layer-Up Scan)  
**Severity**: HIGH  
**Validation Hook**: Scan evidence artifact in PR description for canon change PRs

### REQ-RA-006: Consumer Repo Registry Maintenance
**Statement**: MUST maintain CONSUMER_REPO_REGISTRY.json as deterministic source of truth for ripple targeting.  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 5.2  
**Severity**: HIGH  
**Validation Hook**: `jq empty governance/CONSUMER_REPO_REGISTRY.json` syntax validation

---

## Category 4: Gate Compliance

### REQ-GC-001: Merge Gate Interface Exposure
**Statement**: Governance repo MUST expose standardized merge gate interface with exact contexts: `Merge Gate Interface / merge-gate/verdict`, `Merge Gate Interface / governance/alignment`, `Merge Gate Interface / stop-and-fix/enforcement`.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 2  
**Severity**: CRITICAL  
**Validation Hook**: `.github/workflows/` contains workflow named "Merge Gate Interface" with three specified jobs

### REQ-GC-002: Evidence-First Verdict Gate
**Statement**: merge-gate/verdict MUST validate committed evidence artifacts exist, conform to schema, and contain no test-dodging language.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 5  
**Severity**: CRITICAL  
**Validation Hook**: Verdict gate workflow validates `.agent-admin/prehandover/`, `.agent-admin/gates/`, `.agent-admin/rca/`

### REQ-GC-003: Gate Requirements Index
**Statement**: MUST maintain governance/GATE_REQUIREMENTS_INDEX.json as machine-readable requirements source for verdict gate runtime loading.  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 6.4  
**Severity**: HIGH  
**Validation Hook**: `jq empty governance/GATE_REQUIREMENTS_INDEX.json` syntax validation

### REQ-GC-004: Alignment Gate Drift Detection
**Statement**: governance/alignment gate MUST verify canonical governance alignment via sha256 comparison and fail if drift detected.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 6  
**Severity**: HIGH  
**Validation Hook**: Alignment gate workflow performs hash comparison against CANON_INVENTORY.json

### REQ-GC-005: Stop-and-Fix RCA Enforcement
**Statement**: stop-and-fix/enforcement gate MUST fail if stop-and-fix condition unresolved and require RCA artifact.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 7 + `governance/canon/STOP_AND_FIX_DOCTRINE.md`  
**Severity**: HIGH  
**Validation Hook**: Stop-and-fix gate validates RCA artifact presence when triggered

---

## Category 5: Authority, Self-Alignment & Escalation

### REQ-AS-001: Self-Alignment Within Bounds
**Statement**: MAY self-align syntax corrections, cross-reference repairs, inventory updates, documentation clarity, runbook improvements, and organizational changes without CS2 approval.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 4.2  
**Severity**: MEDIUM  
**Validation Hook**: PR description documents self-alignment rationale and authority reference

### REQ-AS-002: Constitutional Escalation Requirement
**Statement**: MUST escalate to CS2 for constitutional canon semantic changes, agent contract modifications, protected governance changes, authority boundary conflicts, and protected file modifications.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 4.2  
**Severity**: CRITICAL  
**Validation Hook**: Escalation document in `.agent-workspace/governance-repo-administrator/escalation-inbox/` or CS2 approval in PR

### REQ-AS-003: Escalation Communication Protocol
**Statement**: When escalating, MUST create escalation document in `.agent-workspace/<agent-id>/escalation-inbox/` with context, decision point, options, recommendation, impact, and request sections.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6.3  
**Severity**: MEDIUM  
**Validation Hook**: Escalation document structure validation against template

### REQ-AS-004: Boundary Decision Documentation
**Statement**: For boundary-case decisions (non-canonical governance doc refinements, simple governance script fixes), MUST document rationale in PR description.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 4.2  
**Severity**: MEDIUM  
**Validation Hook**: PR description contains rationale section for boundary decisions

### REQ-AS-005: Wake-Up Protocol Execution
**Statement**: MUST execute `.github/scripts/wake-up-protocol.sh` at session start to load identity, memory, governance, environment health, and generate working contract.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 2.1  
**Severity**: HIGH  
**Validation Hook**: `environment-health.json` timestamp within session start window

---

## Category 6: Execution & Operations

### REQ-EO-001: Syntax Validation Pre-Merge
**Statement**: MUST validate all JSON (jq empty), YAML (yamllint), and Markdown (markdownlint) files before merge.  
**Source**: `governance/canon/GOVERNANCE_VALIDATION_PROTOCOL.md` Section 5.2  
**Severity**: HIGH  
**Validation Hook**: CI workflow executes syntax validation steps

### REQ-EO-002: Cross-Reference Validation
**Statement**: MUST validate all file references and governance document cross-references are resolvable.  
**Source**: `governance/canon/GOVERNANCE_VALIDATION_PROTOCOL.md` Section 5.2  
**Severity**: MEDIUM  
**Validation Hook**: Cross-reference validation script execution in CI

### REQ-EO-003: Inventory Synchronization
**Statement**: MUST ensure GOVERNANCE_ARTIFACT_INVENTORY.md reflects all governance artifacts; detect phantom entries and untracked files.  
**Source**: `governance/canon/GOVERNANCE_VALIDATION_PROTOCOL.md` Section 5.2  
**Severity**: HIGH  
**Validation Hook**: Inventory diff review with no discrepancies

### REQ-EO-004: Governance Script Testing
**Statement**: Governance scripts (Type 3) MUST have unit tests, integration tests, dry-run mode, error handling, idempotency, and logging.  
**Source**: `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` Section 6.5  
**Severity**: HIGH  
**Validation Hook**: Script test execution in CI with pass/fail report

### REQ-EO-005: Session Closure Protocol
**Statement**: MUST execute `.github/scripts/session-closure.sh` to create session memory, rotate old memories, capture lessons, create escalations, update environment health, and verify safe state.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 2.3  
**Severity**: HIGH  
**Validation Hook**: Session memory file created post-session with all required sections

### REQ-EO-006: Working Contract Generation
**Statement**: MUST generate session-specific `working-contract.md` from agent identity, last 5 memories, current governance bindings, environment state, big-picture context, and personal lessons.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 5 (Working Contract)  
**Severity**: MEDIUM  
**Validation Hook**: `working-contract.md` exists with timestamp matching session start

---

## Category 7: Merge Gate Interface (Implementation)

### REQ-MGI-001: Workflow Naming Standard
**Statement**: MUST name workflow "Merge Gate Interface" (exact) with jobs "merge-gate/verdict", "governance/alignment", "stop-and-fix/enforcement" (exact).  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 2  
**Severity**: CRITICAL  
**Validation Hook**: `yq '.name' .github/workflows/merge-gate-interface.yml` == "Merge Gate Interface"

### REQ-MGI-002: Pull Request Trigger Mandatory
**Statement**: Merge gate workflow MUST trigger on `pull_request` event; `on: push` is optional and may not replace PR trigger.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 3  
**Severity**: CRITICAL  
**Validation Hook**: `yq '.on | has("pull_request")' .github/workflows/merge-gate-interface.yml` == true

### REQ-MGI-003: Deterministic PR Classification
**Statement**: PR classification MUST be deterministic based on changed paths, labels, and branch patterns (label override → governance → docs-only → code).  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 4  
**Severity**: HIGH  
**Validation Hook**: Classification logic code review in verdict gate job

### REQ-MGI-004: Branch Protection Rule Compliance
**Statement**: Branch protection MUST require only the three standard contexts; no repo-specific checks as required.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 8  
**Severity**: HIGH  
**Validation Hook**: GitHub branch protection settings API check

### REQ-MGI-005: Fail-Fast Evidence-First Messaging
**Statement**: Gate failures MUST produce short, evidence-first error messages; prohibited: log archaeology, manual inspection requirements, narrative-only claims.  
**Source**: `governance/canon/MERGE_GATE_INTERFACE_STANDARD.md` Section 5  
**Severity**: MEDIUM  
**Validation Hook**: Gate failure message format validation in workflow output

---

## Category 8: Coordination & Reporting

### REQ-CR-001: CHANGELOG Maintenance
**Statement**: All governance changes MUST be recorded in governance/CHANGELOG.md with version, date, type, description, affected artifacts, migration guidance, approval authority, effective date.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.1  
**Severity**: HIGH  
**Validation Hook**: CHANGELOG.md updated in PR diff for governance changes

### REQ-CR-002: Ripple Propagation Tracking
**Statement**: MUST track which repos received layer-down, when propagation occurred, validation status, completion status, inventory update status, coverage percentage, and ripple log entries.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.3  
**Severity**: HIGH  
**Validation Hook**: Ripple tracking artifact in `governance/ripple/` with completion metrics

### REQ-CR-003: Bidirectional Ripple Logging
**Statement**: MUST log both layer-up (app→canon) and layer-down (canon→app) ripple flows with issue numbers, timestamps, and status.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.3 (Bidirectional Ripple Log Format)  
**Severity**: MEDIUM  
**Validation Hook**: Ripple log format validation against specified structure

### REQ-CR-004: Cross-Repo Impact Analysis
**Statement**: For governance changes, MUST include impact analysis covering affected repositories, agents, gates, schemas, migration effort, and risk assessment.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.2  
**Severity**: MEDIUM  
**Validation Hook**: Impact analysis section in PR description or linked artifact

### REQ-CR-005: Learning Archive Maintenance
**Statement**: MUST archive upward learning with original failure/learning records, promotion decision rationale, resulting governance changes, impact assessment, effectiveness validation.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 8.4  
**Severity**: LOW  
**Validation Hook**: Learning archive structure in `governance/memory/canonical-lessons/`

---

## Category 9: Security & Safety

### REQ-SS-001: Maturion Bot Token Management
**Statement**: MUST use MATURION_BOT_TOKEN secret for all automated actions; token MUST be fine-grained with least privilege (Contents: RW, PRs: RW, Issues: RW).  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 3.2-3.3  
**Severity**: CRITICAL  
**Validation Hook**: Workflow uses `secrets.MATURION_BOT_TOKEN` and never pushes to main directly

### REQ-SS-002: Protected File Change Detection
**Statement**: MUST detect and block unauthorized changes to `.github/workflows/`, constitutional canon, agent contracts without CS2 approval.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 9.1  
**Severity**: CRITICAL  
**Validation Hook**: Protected file change detection workflow with approval gate

### REQ-SS-003: No Direct Main Pushes
**Statement**: MUST NOT push directly to main branch; all writes occur via PR branches.  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 3.4  
**Severity**: CRITICAL  
**Validation Hook**: Branch protection enforcement and bot workflow validation

### REQ-SS-004: Degraded Mode Escalation
**Statement**: When placeholder hashes detected in CANON_INVENTORY.json for PUBLIC_API artifacts, MUST mark alignment as DEGRADED, block merge gates, create CS2 escalation issue.  
**Source**: `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md` Section 4  
**Severity**: CRITICAL  
**Validation Hook**: Alignment gate detects placeholders and fails with escalation artifact

### REQ-SS-005: Token Rotation Policy Compliance
**Statement**: MUST implement token rotation policy with defined frequency and incident response; scheduled fallback alignment continues during token failure.  
**Source**: `maturion/strategy/LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md` Section 3.4  
**Severity**: HIGH  
**Validation Hook**: Token rotation documentation and incident response runbook existence

---

## Category 10: Ambiguities & Gaps

### REQ-AG-001: Gap Analysis Execution
**Statement**: MUST execute governance gap analysis scan during wake-up protocol and session work; auto-remediate known patterns, escalate novel gaps.  
**Source**: `governance/canon/LIVING_AGENT_SYSTEM.md` Section 6 (Gap Analyzer Integration)  
**Severity**: MEDIUM  
**Validation Hook**: Gap analysis artifact in session evidence

### REQ-AG-002: Ambiguity Escalation Protocol
**Statement**: When encountering conflicting governance directives, unclear authority boundaries, or missing governance coverage, MUST escalate to CS2 with structured escalation document.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6.1  
**Severity**: HIGH  
**Validation Hook**: Escalation document creation for ambiguity cases

### REQ-AG-003: Governance Change Proposal Schema
**Statement**: Upward ripple proposals MUST use schema at governance/schemas/GOVERNANCE_CHANGE_PROPOSAL.schema.md with trigger, evidence, proposal, impact, affected repos, migration plan, rationale.  
**Source**: `governance/canon/GOVERNANCE_RIPPLE_MODEL.md` Section 5.4  
**Severity**: MEDIUM  
**Validation Hook**: Layer-up issue conforms to governance change proposal schema

### REQ-AG-004: Precedent-Setting Decision Documentation
**Statement**: For high-impact changes with uncertainty or precedent-setting decisions, MUST document decision rationale and escalate to CS2 for strategic judgment.  
**Source**: `governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md` Section 6.1  
**Severity**: MEDIUM  
**Validation Hook**: Decision rationale in PR description or escalation document

---

## Category 11: Validation Hooks (Summary)

All validation hooks above can be implemented as:

1. **CI/CD Workflows** (automated gates)
   - Syntax validation: JSON/YAML/Markdown linting
   - Cross-reference validation: link checker scripts
   - Inventory sync: diff correlation analysis
   - Protected file detection: path pattern matching
   - Evidence artifact validation: schema conformance

2. **Pre-Commit Hooks** (local validation)
   - Syntax validation
   - Protected file warning
   - Inventory update reminder

3. **Session Closure Checks** (agent self-validation)
   - Memory rotation count
   - Working contract generation
   - Session memory structure
   - Escalation inbox review

4. **Manual Review Checklist** (PR review)
   - CS2 approval for constitutional changes
   - Ripple execution confirmation
   - Impact analysis completeness
   - Rationale documentation

---

## Summary Statistics

- **Total Requirements**: 56
- **Critical Severity**: 15
- **High Severity**: 25
- **Medium Severity**: 14
- **Low Severity**: 2

**Categories**:
1. Canon Management: 5 requirements
2. Evidence & Records: 5 requirements
3. Ripple & Alignment: 6 requirements
4. Gate Compliance: 5 requirements
5. Authority, Self-Alignment & Escalation: 5 requirements
6. Execution & Operations: 6 requirements
7. Merge Gate Interface: 5 requirements
8. Coordination & Reporting: 5 requirements
9. Security & Safety: 5 requirements
10. Ambiguities & Gaps: 4 requirements
11. Validation Hooks: Summary category

**Canonical Sources Referenced**:
- CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md
- GOVERNANCE_ARTIFACT_TAXONOMY.md
- GOVERNANCE_RIPPLE_MODEL.md
- GOVERNANCE_VALIDATION_PROTOCOL.md
- LIVING_AGENT_SYSTEM.md
- MERGE_GATE_INTERFACE_STANDARD.md
- SELF_ALIGNMENT_AUTHORITY_MODEL.md
- STOP_AND_FIX_DOCTRINE.md (implied)
- GOVERNANCE_PURPOSE_AND_SCOPE.md (implied)
- LIVING_CANON_ALIGNMENT_EXECUTION_PLAN.md (LCAS-001)

**Excluded**: All references to .github/agents/ agent contract files and non-canon sources per directive.

---

**End of Requirements Checklist**
