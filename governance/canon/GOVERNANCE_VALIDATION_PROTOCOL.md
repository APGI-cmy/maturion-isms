# GOVERNANCE VALIDATION PROTOCOL

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document establishes the **canonical validation protocol for governance artifacts**, specifically defining validation success criteria for each agent class, including **non-Build-to-Green (non-BtG) agents** with explicit, actionable checklists.

This protocol exists to ensure:
- **Clear validation criteria** for all governance artifacts
- **Agent-class-specific validation** - Different agents validate differently
- **Non-BtG agent clarity** - Liaisons, overseers, foremen know exactly how to validate
- **Zero ambiguity** on "validation complete"
- **Audit trail** of validation performed

**Core Principle**: Every governance change must be validated. Validation methods differ by agent class and artifact type, but validation is never optional.

---

## 2. Constitutional Authority

This protocol derives authority from and implements:
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and testing requirements
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-specific gate requirements
- **BUILD_PHILOSOPHY.md** - Quality and testing standards (for builders)
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle and validation responsibilities
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - Self-alignment validation requirements

---

## 3. Scope

### 3.1 In Scope

✅ **Covered by this protocol**:
- Validation criteria per agent class
- Validation checklists per artifact type
- Validation methods (automated, manual, hybrid)
- Validation evidence requirements
- Validation failure handling

### 3.2 Out of Scope

❌ **NOT covered by this protocol**:
- Specific tool implementations (linters, validators)
- Test execution details (for builders - see BUILD_PHILOSOPHY.md)
- Ripple execution validation (see GOVERNANCE_RIPPLE_MODEL.md)

---

## 4. Agent Class Validation Models

### 4.1 Builder Validation (Build-to-Green)

**Validation Model**: **Test-Driven (100% GREEN)**

**Success Criteria**:
- ✅ All tests passing (100% GREEN)
- ✅ Linting passing (zero errors, zero governance-flagged warnings)
- ✅ Code coverage meets requirements
- ✅ Security scans passing (no new vulnerabilities)
- ✅ Build succeeds without errors

**Validation Method**: **Automated Test Execution**

**Evidence Required**:
- Test execution report (pass/fail, coverage)
- Linting report (clean)
- Security scan report (clean)
- Build log (success)

**Reference**: BUILD_PHILOSOPHY.md, AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md Section 6

---

### 4.2 Liaison Validation (Non-BtG)

**Validation Model**: **Artifact Integrity + Cross-Reference + Ripple**

**Success Criteria**:
- ✅ Syntax validation passed (JSON, YAML, Markdown)
- ✅ Schema validation passed (if schema exists)
- ✅ Cross-references validated (no broken links)
- ✅ Inventory synchronized (GOVERNANCE_ARTIFACT_INVENTORY.md)
- ✅ Ripple executed (if required)
- ✅ Self-alignment authority verified (within bounds)

**Validation Method**: **Automated + Manual Checklist**

**Evidence Required**:
- Syntax validation report
- Cross-reference validation report
- Inventory diff (showing sync)
- Ripple report (if applicable)
- Self-alignment attestation (in PR description)

**Validation Checklist**: See Section 5.2

---

### 4.3 Foreman Validation (Non-BtG)

**Validation Model**: **Wave Execution + QA Validation + Evidence**

**Success Criteria**:
- ✅ Wave plan complete and validated
- ✅ All QA tests passing (100% GREEN)
- ✅ Builder evidence collected and verified
- ✅ Wave closure certification complete
- ✅ Learning loop artifacts generated

**Validation Method**: **Wave Lifecycle + Evidence Audit**

**Evidence Required**:
- Wave plan artifact
- QA execution report (100% GREEN)
- Builder evidence (PRs, test reports)
- Wave closure certification
- Learning loop artifacts (IBWR, lessons learned)

**Validation Checklist**: See Section 5.3

---

### 4.4 Overseer Validation (Non-BtG)

**Validation Model**: **Constitutional Compliance + Cross-Repo Integrity**

**Success Criteria**:
- ✅ Constitutional compliance verified (no CS1-CS6 violations)
- ✅ Cross-repository integrity validated (no breaking changes)
- ✅ Quality gates satisfied
- ✅ Layer-down completed (if required)
- ✅ Governance alignment confirmed

**Validation Method**: **Compliance Audit + Cross-Repo Analysis**

**Evidence Required**:
- Constitutional compliance report
- Cross-repo impact analysis
- Quality gate validation report
- Layer-down status (if applicable)

**Validation Checklist**: See Section 5.4

---

## 5. Validation Checklists (Non-BtG Agents)

### 5.1 Universal Validation Checklist (All Non-BtG Agents)

**Before marking validation complete, verify**:

- [ ] **Self-Governance Check Performed**
  - [ ] Agent contract read and understood
  - [ ] Canonical governance sources identified
  - [ ] Drift detected and remediated (or escalated)
  - [ ] Working contract generated

- [ ] **Changes Within Authority**
  - [ ] Changes fall within self-alignment authority
  - [ ] No constitutional interpretation performed
  - [ ] No protected governance changed without CS2 approval
  - [ ] Escalations created for out-of-bounds issues

- [ ] **Documentation Complete**
  - [ ] Clear commit messages
  - [ ] PR description explains changes and rationale
  - [ ] Evidence of validation provided
  - [ ] Traceability to requirements or issues

---

### 5.2 Liaison Validation Checklist

**Governance Artifact Integrity Validation**:

- [ ] **Syntax Validation**
  - [ ] All JSON files validated (run `find governance -name "*.json" -exec jq empty {} \;`)
  - [ ] All YAML files validated (run `find governance -name "*.yml" -o -name "*.yaml" -exec yamllint {} \;`)
  - [ ] All Markdown files linted (run `markdownlint governance/**/*.md` or equivalent)
  - [ ] No trailing whitespace (run `git diff --check`)

- [ ] **Schema Validation** (if applicable)
  - [ ] Artifacts conform to schemas (e.g., `.agent.schema.md`, `GOVERNANCE_INVENTORY_SCHEMA.json`)
  - [ ] Required fields present
  - [ ] Data types correct
  - [ ] Schema validation script executed (if exists)

- [ ] **Cross-Reference Validation**
  - [ ] All file references valid (no broken links)
  - [ ] All governance document references resolvable
  - [ ] All canonical references point to existing canon
  - [ ] Cross-reference validation script executed (if exists)

- [ ] **Inventory Synchronization**
  - [ ] `GOVERNANCE_ARTIFACT_INVENTORY.md` updated with new/changed/removed artifacts
  - [ ] `CANON_INVENTORY.json` updated (if canon changed)
  - [ ] Inventory metadata current (last updated date, artifact count)
  - [ ] Inventory diff reviewed (no phantom entries or untracked files)

- [ ] **Ripple Execution** (if required per GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md)
  - [ ] Ripple trigger identified and documented
  - [ ] Ripple signaled (PR label, description, or file)
  - [ ] Ripple executed per GOVERNANCE_RIPPLE_MODEL.md
  - [ ] Ripple report generated and committed
  - [ ] Ripple status tracked to completion

- [ ] **Self-Alignment Verification**
  - [ ] Changes within liaison self-alignment authority (per SELF_ALIGNMENT_AUTHORITY_MODEL.md)
  - [ ] No agent contract modifications (protected)
  - [ ] No constitutional interpretation (escalated if needed)
  - [ ] Rationale documented for boundary-case decisions

**Validation Evidence**:
- [ ] Syntax validation log attached (or CI report)
- [ ] Cross-reference validation report attached
- [ ] Inventory diff attached
- [ ] Ripple report attached (if applicable)
- [ ] Self-alignment attestation in PR description

---

### 5.3 Foreman Validation Checklist

**Wave Execution Validation**:

- [ ] **Wave Plan Completeness**
  - [ ] Wave plan artifact generated (per FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md)
  - [ ] All wave steps defined and scoped
  - [ ] Builder assignments created (GitHub issues)
  - [ ] Success criteria defined for each step

- [ ] **QA Creation & Validation**
  - [ ] Comprehensive QA test suite created
  - [ ] All QA tests initially RED (before implementation)
  - [ ] All QA tests now GREEN (after builder implementation)
  - [ ] QA coverage validated (all requirements covered)
  - [ ] QA execution report attached

- [ ] **Builder Supervision**
  - [ ] All builder assignments completed
  - [ ] Builder PRs merged (100% GREEN)
  - [ ] Builder evidence collected (test reports, coverage, PRs)
  - [ ] Builder compliance verified (no test debt)

- [ ] **Wave Closure**
  - [ ] Wave closure certification complete (per MANDATORY_CANONICAL_PROGRESS_RECORDING_AND_WAVE_CLOSURE_CERTIFICATION.md)
  - [ ] Combined wave testing executed (if multi-wave) per COMBINED_TESTING_PATTERN.md
  - [ ] Wave progress artifacts generated
  - [ ] Wave status updated (COMPLETE)

- [ ] **Learning Loop**
  - [ ] Session memory captured (per FOREMAN_MEMORY_PROTOCOL.md)
  - [ ] Lessons learned documented
  - [ ] Patterns recorded
  - [ ] In-between wave reconciliation complete (per IN_BETWEEN_WAVE_RECONCILIATION.md)

**Validation Evidence**:
- [ ] Wave plan artifact attached
- [ ] QA execution report (100% GREEN)
- [ ] Builder evidence (PRs, test reports)
- [ ] Wave closure certification
- [ ] Learning loop artifacts (IBWR, lessons)

---

### 5.4 Overseer Validation Checklist

**Constitutional Compliance Validation**:

- [ ] **Constitutional Safeguards**
  - [ ] No CS1-CS6 violations introduced
  - [ ] Protected file modifications have CS2 approval
  - [ ] Governance changes comply with GOVERNANCE_RIPPLE_MODEL.md
  - [ ] Constitutional compliance report generated

- [ ] **Cross-Repository Integrity**
  - [ ] Changes don't break downstream repositories
  - [ ] Layer-down requirements satisfied (per CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md)
  - [ ] Ripple awareness communicated (if applicable)
  - [ ] Cross-repo impact analysis performed

- [ ] **Quality Gate Enforcement**
  - [ ] All applicable quality gates passed
  - [ ] No quality regressions introduced
  - [ ] Quality validation evidence provided
  - [ ] Quality gate report attached

- [ ] **Escalation Handling**
  - [ ] All escalations from subordinate agents resolved or documented
  - [ ] CS2 involvement obtained where required
  - [ ] Approval gates satisfied

**Validation Evidence**:
- [ ] Constitutional compliance report attached
- [ ] Cross-repo impact analysis attached
- [ ] Quality gate validation report attached
- [ ] Layer-down status (if applicable)

---

## 6. Validation Methods by Artifact Type

### 6.1 Type 1: Constitutional Canon

**Validation Requirements**:
- Schema validation (structure, required sections)
- Cross-reference validation (all references valid)
- Syntax validation (Markdown, formatting)
- CS2 approval (semantic changes)
- Ripple execution (MANDATORY)

**Validation Script** (example):
```bash
#!/bin/bash
# Validate Constitutional Canon

CANON_FILE=$1

# Schema validation
echo "Validating schema..."
# Check required sections (e.g., Status, Purpose, Authority)
grep -q "## Status" "$CANON_FILE" || { echo "Missing Status section"; exit 1; }
grep -q "## Purpose" "$CANON_FILE" || { echo "Missing Purpose section"; exit 1; }

# Syntax validation
echo "Validating syntax..."
markdownlint "$CANON_FILE"

# Cross-reference validation
echo "Validating cross-references..."
# Extract all links, verify they exist
grep -oP '\[.*?\]\(\K[^)]+' "$CANON_FILE" | while read link; do
  [ -f "$link" ] || echo "Broken link: $link"
done

echo "Validation complete"
```

---

### 6.2 Type 2: Governance Documentation

**Validation Requirements**:
- Schema validation (if schema exists)
- Cross-reference validation
- Syntax validation
- Self-alignment authority check

**Validation Script** (example):
```bash
#!/bin/bash
# Validate Governance Documentation

DOC_FILE=$1

# Syntax validation
echo "Validating syntax..."
markdownlint "$DOC_FILE"

# Cross-reference validation
echo "Validating cross-references..."
bash scripts/validate-cross-references.sh "$DOC_FILE"

# Inventory check
echo "Checking inventory..."
grep -q "$(basename $DOC_FILE)" GOVERNANCE_ARTIFACT_INVENTORY.md || {
  echo "WARNING: File not in inventory"
}

echo "Validation complete"
```

---

### 6.3 Type 3: Governance Scripts

**Validation Requirements**:
- Syntax validation (bash, python, etc.)
- Dry-run execution (non-destructive test)
- Unit tests (if test suite exists)
- Integration tests (if applicable)

**Validation Script** (example):
```bash
#!/bin/bash
# Validate Governance Script

SCRIPT_FILE=$1

# Syntax check
echo "Checking syntax..."
bash -n "$SCRIPT_FILE" || { echo "Syntax error"; exit 1; }

# Dry-run test
echo "Running dry-run..."
bash "$SCRIPT_FILE" --dry-run || { echo "Dry-run failed"; exit 1; }

# Unit tests (if exist)
if [ -f "${SCRIPT_FILE%.sh}.test.sh" ]; then
  echo "Running unit tests..."
  bash "${SCRIPT_FILE%.sh}.test.sh"
fi

echo "Validation complete"
```

---

### 6.4 Type 4: Governance Templates

**Validation Requirements**:
- Schema validation (structure)
- Syntax validation (Markdown, JSON, YAML)
- Example instantiation (can template be used?)
- Placeholder consistency (all placeholders documented)

**Validation Script** (example):
```bash
#!/bin/bash
# Validate Governance Template

TEMPLATE_FILE=$1

# Syntax validation
echo "Validating syntax..."
markdownlint "$TEMPLATE_FILE"

# Placeholder check
echo "Checking placeholders..."
# Extract placeholders, verify they're documented
grep -oP '<[^>]+>' "$TEMPLATE_FILE" | sort -u

echo "Validation complete"
```

---

### 6.5 Type 5: Governance Evidence

**Validation Requirements**:
- Schema validation (if structured - JSON, YAML)
- Completeness check (required fields present)
- Immutability check (not modified after generation)

**Validation Script** (example):
```bash
#!/bin/bash
# Validate Governance Evidence

EVIDENCE_FILE=$1

# If JSON, validate schema
if [[ "$EVIDENCE_FILE" == *.json ]]; then
  echo "Validating JSON..."
  jq empty "$EVIDENCE_FILE" || { echo "Invalid JSON"; exit 1; }
fi

# Completeness check (example)
echo "Checking completeness..."
grep -q "Date:" "$EVIDENCE_FILE" || { echo "Missing Date field"; exit 1; }
grep -q "Author:" "$EVIDENCE_FILE" || { echo "Missing Author field"; exit 1; }

echo "Validation complete"
```

---

## 7. Validation Failure Handling

### 7.1 Validation Failure Types

**Syntax Failures** (JSON, YAML, Markdown):
- **Impact**: HIGH (blocks merge)
- **Handler**: Agent fixes syntax errors
- **Retry**: Immediate (after fix)

**Schema Failures** (structure, required fields):
- **Impact**: HIGH (blocks merge)
- **Handler**: Agent fixes schema violations
- **Retry**: Immediate (after fix)

**Cross-Reference Failures** (broken links):
- **Impact**: MEDIUM (blocks merge if critical references)
- **Handler**: Liaison repairs cross-references
- **Retry**: Immediate (after fix)

**Ripple Failures** (ripple not executed):
- **Impact**: HIGH (blocks merge)
- **Handler**: Liaison executes ripple
- **Retry**: After ripple complete

**Authority Failures** (outside self-alignment bounds):
- **Impact**: CRITICAL (blocks merge, requires escalation)
- **Handler**: Escalate to CS2
- **Retry**: After CS2 approval and guidance

### 7.2 Failure Resolution Process

**When validation fails**:

1. **Identify Failure Type** - Categorize failure (syntax, schema, authority, etc.)
2. **Assess Impact** - Determine severity (CRITICAL, HIGH, MEDIUM, LOW)
3. **Resolve Failure**:
   - **Agent can fix** → Fix and re-validate
   - **Outside authority** → Escalate to CS2
   - **Blocker identified** → Document and escalate
4. **Re-Validate** - Execute validation checklist again
5. **Document Resolution** - Include resolution in PR description

---

## 8. Validation Evidence & Audit

### 8.1 Required Validation Evidence

**All PRs MUST include**:

1. **Validation Attestation** (in PR description):
   ```markdown
   ## Validation Performed
   
   - [x] Syntax validation: Passed
   - [x] Cross-reference validation: Passed
   - [x] Inventory synchronization: Complete
   - [x] Ripple execution: Complete (report attached)
   - [x] Self-alignment verification: Within bounds
   
   **Evidence**:
   - Syntax validation: See CI report
   - Ripple report: governance/ripple/ripple-report-pr-1234.md
   ```

2. **Validation Logs** (CI artifacts or attached files):
   - Syntax validation log
   - Schema validation log
   - Cross-reference validation report
   - Ripple report (if applicable)

3. **Checklist Completion** (in PR):
   - Agent-specific validation checklist completed
   - All items checked or explained if not applicable

### 8.2 Audit Trail

**Validation audit trail includes**:

- PR description validation section
- CI validation workflow logs
- Validation evidence artifacts
- Checklist completion in PR
- Reviewer validation confirmation

---

## 9. CI/CD Integration

### 9.1 Automated Validation Workflow

**Example GitHub Actions**:

```yaml
name: Governance Validation

on: [pull_request]

jobs:
  validate-syntax:
    runs-on: ubuntu-latest
    steps:
      - name: Validate JSON
        run: find governance -name "*.json" -exec jq empty {} \;
      
      - name: Validate YAML
        run: find governance -name "*.yml" -o -name "*.yaml" -exec yamllint {} \;
      
      - name: Validate Markdown
        run: markdownlint governance/**/*.md
        
  validate-cross-references:
    runs-on: ubuntu-latest
    steps:
      - name: Check Cross-References
        run: bash scripts/validate-cross-references.sh
        
  validate-inventory:
    runs-on: ubuntu-latest
    steps:
      - name: Check Inventory Sync
        run: bash scripts/validate-inventory-sync.sh
```

### 9.2 Manual Validation Workflow (Fallback)

**If CI unavailable**:

1. **Run validation scripts locally**:
   ```bash
   bash scripts/validate-syntax.sh
   bash scripts/validate-cross-references.sh
   bash scripts/validate-inventory.sh
   ```

2. **Complete validation checklist manually** (in PR description)

3. **Attach validation logs** (as PR comments or files)

---

## 10. Validation & Maintenance

### 10.1 Protocol Validation

This protocol MUST be validated:
- **Before use**: All agents understand validation requirements
- **After updates**: All agents re-validate procedures
- **Quarterly**: CS2 reviews validation effectiveness

### 10.2 Protocol Evolution

**Changes to this protocol**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agents

---

## 11. Cross-References

### 11.1 Primary Dependencies

- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact types and testing requirements
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-specific gates
- **BUILD_PHILOSOPHY.md** - Builder validation (100% GREEN)
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle
- **SELF_ALIGNMENT_AUTHORITY_MODEL.md** - Authority boundaries

### 11.2 Supporting Protocols

- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution validation
- **GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md** - Ripple signaling
- **LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md** - Wake-up validation

---

## 12. Summary: Validation Philosophy

**Core Tenets**:

1. **Every Change is Validated** - No governance change merges without validation
2. **Validation Differs by Agent** - Builders test, liaisons check artifacts, foremen verify waves, overseers audit compliance
3. **Validation is Evidence-Based** - Validation completion requires documented evidence
4. **Automation Where Possible** - CI/CD validates syntax, cross-refs, inventory
5. **Checklists for Clarity** - Non-BtG agents have explicit, actionable checklists

**Expected Outcome**: All governance changes are validated appropriately for their type and agent class. No ambiguity on "validation complete."

---

## 13. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical protocol addressing GAP-006 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
