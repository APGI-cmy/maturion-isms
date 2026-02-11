# GOVERNANCE ARTIFACT TAXONOMY

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-08  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Repositories, All Agents  

---

## 1. Purpose

This document establishes the **canonical taxonomy** for all governance artifacts, distinguishing governance from executable code, scripts from templates, and defining testing obligations for each category.

This taxonomy exists to ensure:
- **Clear boundaries** between governance and code
- **Appropriate testing** applied to each artifact type
- **Ripple awareness** triggers correctly per artifact category
- **Self-alignment authority** is well-defined per artifact type
- **Zero ambiguity** on what constitutes "governance" vs "code"

**Core Principle**: Not all files are equal. Different artifact types require different treatment, testing, validation, and governance.

---

## 2. Constitutional Authority

This taxonomy derives authority from and implements:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory
- **GOVERNANCE_RIPPLE_MODEL.md** - What changes trigger ripple
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent-specific validation requirements
- **BUILD_PHILOSOPHY.md** - Testing and quality standards
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle and governance discovery

---

## 3. Artifact Type Taxonomy

This taxonomy defines **7 primary artifact types**:

1. **Constitutional Canon** - Tier-0 governance rules (highest authority)
2. **Governance Documentation** - Policies, protocols, models (tier-1+)
3. **Governance Scripts** - Executable governance automation
4. **Governance Templates** - Boilerplate for artifact generation
5. **Governance Evidence** - Reports, audits, validation artifacts
6. **Application Code** - Production executable artifacts
7. **Application Tests** - Test suites, QA validation

---

## 4. Type 1: Constitutional Canon

### 4.1 Definition

**Constitutional Canon**: Tier-0 governance artifacts that define immutable, supreme authority rules and principles.

**Characteristics**:
- Highest governance authority (subordinate only to system vision)
- Immutable without CS2 approval
- Protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md
- Referenced as ultimate truth by all other governance
- Defines "what must be" not "how to do it"

### 4.2 Examples

- `BUILD_PHILOSOPHY.md` (One-Time Build Law)
- `FM_ROLE_CANON.md` (Foreman authority)
- `WAVE_MODEL.md` (Wave hierarchy)
- `LIVING_AGENT_SYSTEM.md` (Agent lifecycle)
- `GOVERNANCE_PURPOSE_AND_SCOPE.md` (Governance philosophy)
- `AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` (This document's siblings)

### 4.3 Location

**Primary**: `governance/canon/` (governance repository)  
**Secondary**: `governance/maturion/` (maturion-specific canon)

### 4.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | Yes (MANDATORY - high impact) |
| **Testing Required** | Schema validation, cross-reference validation, syntax check |
| **Who May Modify** | CS2 ONLY (liaison may correct syntax errors only) |
| **Version Controlled** | Yes (explicit version in document header) |
| **Layer-Down** | Yes (PUBLIC_API - must propagate to all repos) |
| **CI Validation** | Syntax, structure, cross-refs, inventory sync |

### 4.5 Modification Protocol

**To modify constitutional canon**:

1. **Escalate to CS2** - Only CS2 may approve changes
2. **CS2 reviews** - Validates constitutional impact
3. **CS2 approves** - Explicit written approval required
4. **Liaison implements** - After CS2 approval, liaison may implement
5. **Ripple executes** - GOVERNANCE_RIPPLE_MODEL.md MANDATORY
6. **Layer-down** - Notify all consumer repositories

**Liaison self-alignment**: ONLY syntax corrections, typo fixes, cross-reference repairs. NO semantic changes.

---

## 5. Type 2: Governance Documentation

### 5.1 Definition

**Governance Documentation**: Tier-1+ governance artifacts that implement, clarify, or support constitutional canon with operational protocols, models, and policies.

**Characteristics**:
- Subordinate to constitutional canon
- Provides operational guidance and implementation details
- May be updated by liaison within self-alignment bounds
- Must align with constitutional canon (no conflicts)
- Defines "how to do it" within constitutional constraints

### 5.2 Examples

- `GOVERNANCE_LIAISON_TRAINING_PROTOCOL.md` (operational protocol)
- `GOVERNANCE_COMPLETENESS_MODEL.md` (governance model)
- `REPOSITORY_INITIALIZATION_AND_GOVERNANCE_SEEDING_PROTOCOL.md` (operational guide)
- `AGENT_RIPPLE_AWARENESS_OBLIGATION.md` (implementation of ripple requirements)
- Runbooks in `governance/runbooks/`
- Templates in `governance/templates/`

### 5.3 Location

**Primary**: 
- `governance/canon/` (canonical protocols)
- `governance/policy/` (operational policies)
- `governance/runbooks/` (operational runbooks)
- `governance/templates/` (artifact templates)

### 5.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | Yes (if canon-tier or high-impact), Optional (if operational runbook) |
| **Testing Required** | Schema validation, cross-reference validation, syntax check |
| **Who May Modify** | Liaison (within bounds), CS2 (always) |
| **Version Controlled** | Yes (recommended, not always strictly versioned) |
| **Layer-Down** | Depends (PUBLIC_API if widely referenced, INTERNAL if repo-specific) |
| **CI Validation** | Syntax, structure, cross-refs, inventory sync |

### 5.5 Modification Protocol

**Liaison may self-align**:
- Clarification of existing guidance (no semantic change)
- Examples and illustrations
- Cross-reference repairs
- Organization and structure improvements
- Typo and grammar fixes
- Template refinements (non-constitutional)

**Must escalate to CS2**:
- New governance principles or philosophies
- Changes conflicting with constitutional canon
- Authority boundary changes
- Protected governance modifications

---

## 6. Type 3: Governance Scripts

### 6.1 Definition

**Governance Scripts**: Executable code (bash, python, node, etc.) that automates governance processes, validation, or enforcement.

**Characteristics**:
- Executable (not just documentation)
- Automates governance workflows
- Must be tested like application code
- Changes may have execution side effects
- Subject to code quality standards

### 6.2 Examples

- `.github/scripts/wake-up-protocol.sh` (Living Agent System)
- `.github/scripts/session-closure.sh` (Living Agent System)
- `scripts/governance-ripple.sh` (ripple automation)
- `scripts/validate-inventory.js` (inventory validation)
- CI/CD workflow files (`.github/workflows/*.yml`)

### 6.3 Location

**Primary**:
- `.github/scripts/` (GitHub-specific automation)
- `scripts/` (general governance automation)
- `.github/workflows/` (CI/CD workflows)

### 6.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | Yes (if affects governance behavior) |
| **Testing Required** | YES - Unit tests, integration tests, dry-run validation |
| **Who May Modify** | Liaison (minor fixes), CS2 (structural changes), Builder (with FM/CS2 approval) |
| **Version Controlled** | Yes (git versioning) |
| **Layer-Down** | Depends (scripts may be repo-specific or reusable) |
| **CI Validation** | Linting, syntax check, dry-run execution, test execution |

### 6.5 Testing Requirements

**Governance scripts MUST**:

1. **Unit Tests**: Test individual functions/modules
2. **Integration Tests**: Test end-to-end workflows
3. **Dry-Run Mode**: Support non-destructive execution for validation
4. **Error Handling**: Graceful failure, clear error messages
5. **Idempotency**: Safe to run multiple times
6. **Logging**: Clear audit trail of actions

**Testing Ownership**:
- **Builder**: If code-heavy implementation
- **Liaison**: If governance-focused, simple automation
- **Both**: For complex governance+code scripts

**Test Location**: 
- `tests/governance-scripts/` (governance repo)
- Co-located with script (e.g., `script.test.sh`)

### 6.6 Modification Protocol

**Liaison may self-align** (simple scripts):
- Bug fixes (minor)
- Logging improvements
- Error message clarifications
- Parameter validation additions
- Documentation updates

**Must escalate to CS2** (complex scripts):
- New governance automation
- Structural changes to existing scripts
- Changes affecting CI/CD workflows
- Changes to protected scripts (wake-up, closure protocols)

**Builder involvement** (code-heavy):
- Complex algorithm changes
- Performance optimizations
- Major refactoring
- New language/framework adoption

---

## 7. Type 4: Governance Templates

### 7.1 Definition

**Governance Templates**: Boilerplate files intended for copying and customization to create new governance artifacts or evidence.

**Characteristics**:
- Not used directly (copied/instantiated)
- Provide structure and guidance
- May contain placeholder text
- Define expected format and sections
- Support consistency across artifacts

### 7.2 Examples

- `governance/templates/WAVE_RECONCILIATION_REPORT.template.md`
- `governance/templates/WAVE_IMPLEMENTATION_PROGRESS.template.md`
- `governance/canon/*.template.md` (canon templates)
- `.agent.template.md` (agent contract template)

### 7.3 Location

**Primary**:
- `governance/templates/` (general templates)
- `governance/canon/` (canonical templates)
- `governance/canon/agent-contracts-guidance/templates/` (agent templates)

### 7.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | Yes (if canonical template) |
| **Testing Required** | Schema validation (structure), example instantiation |
| **Who May Modify** | Liaison (improvements), CS2 (structural changes) |
| **Version Controlled** | Yes |
| **Layer-Down** | Yes (if PUBLIC_API template for consumer repos) |
| **CI Validation** | Valid markdown/YAML/JSON, placeholder consistency |

### 7.5 Modification Protocol

**Liaison may self-align**:
- Clarification of sections
- Example improvements
- Placeholder text refinements
- Structure improvements (non-breaking)
- Documentation of template usage

**Must escalate to CS2**:
- New canonical templates
- Breaking changes to existing templates
- Changes affecting constitutional compliance
- Schema changes for templates

---

## 8. Type 5: Governance Evidence

### 8.1 Definition

**Governance Evidence**: Reports, audits, scans, and validation artifacts that document governance compliance, execution, or analysis.

**Characteristics**:
- Generated (not authored manually in most cases)
- Time-stamped and immutable once generated
- Provides audit trail
- Documents compliance, validation, or analysis
- Referenced by governance processes

### 8.2 Examples

- `governance/reports/*.md` (gap analysis, audit reports)
- `governance/evidence/*.json` (validation results)
- `governance/scans/*.md` (governance scans)
- Ripple reports (`governance/ripple/`)
- Wave closure reports

### 8.3 Location

**Primary**:
- `governance/reports/` (analysis and audit reports)
- `governance/evidence/` (validation artifacts)
- `governance/scans/` (governance scans)
- `governance/ripple/` (ripple execution reports)

### 8.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | No (evidence documents outcomes, doesn't change governance) |
| **Testing Required** | Schema validation (if structured), completeness check |
| **Who May Modify** | Liaison (creation), No one (after generation - immutable) |
| **Version Controlled** | Yes (git history provides audit trail) |
| **Layer-Down** | No (repo-specific evidence) |
| **CI Validation** | Schema validation, completeness |

### 8.5 Modification Protocol

**Creation**: Liaison or agent generates evidence per protocol

**Modification**: Evidence is **immutable** after generation
- Do NOT edit existing evidence files
- Generate new evidence file if re-validation needed
- Append date/version to distinguish versions

**Archival**: Old evidence may be archived but not deleted
- Move to `.archive/` subdirectory
- Maintain git history

---

## 9. Type 6: Application Code

### 9.1 Definition

**Application Code**: Production executable artifacts that implement application functionality, business logic, or user-facing features.

**Characteristics**:
- Executable in production
- Implements requirements
- Must pass 100% GREEN tests (BUILD_PHILOSOPHY.md)
- Subject to code quality standards
- NOT governance (even if in governance repo)

### 9.2 Examples

- `src/` (application source code)
- `apps/` (application implementations)
- `lib/` (application libraries)
- `foreman/` (Foreman implementation code)

**Note**: Executable code in governance repository (e.g., `foreman/` implementation) is **application code**, not governance.

### 9.3 Location

**Primary**:
- `src/` (consumer repos)
- `apps/` (consumer repos)
- `foreman/` (governance repo, but still application code)

### 9.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | No (application code doesn't change governance) |
| **Testing Required** | YES - Unit, integration, E2E per BUILD_PHILOSOPHY.md |
| **Who May Modify** | Builder (supervised by FM) |
| **Version Controlled** | Yes |
| **Layer-Down** | No (application-specific) |
| **CI Validation** | 100% GREEN tests, linting, security scan, code coverage |

### 9.5 Modification Protocol

**Builder implements**:
- Per BUILD_PHILOSOPHY.md (One-Time Build Law)
- Supervised by Foreman (FM)
- 100% GREEN tests required before merge
- Code quality standards enforced

**Not governance**: Changes to application code do NOT trigger governance ripple

---

## 10. Type 7: Application Tests

### 10.1 Definition

**Application Tests**: Test suites, QA validation, and test code that validate application functionality.

**Characteristics**:
- Validates application code (not governance)
- Must achieve 100% GREEN (BUILD_PHILOSOPHY.md)
- Subject to test quality standards
- NOT governance (even if in governance repo)

### 10.2 Examples

- `tests/` (test suites)
- `qa/` (QA validation)
- `__tests__/` (test files)
- `*.test.js`, `*.spec.ts`, etc.

### 10.3 Location

**Primary**:
- `tests/` (consumer repos)
- `qa/` (consumer repos)
- Co-located with code (e.g., `src/__tests__/`)

### 10.4 Governance Properties

| Property | Value |
|----------|-------|
| **Ripple Required** | No (tests validate app code, not governance) |
| **Testing Required** | Tests must execute and pass (100% GREEN) |
| **Who May Modify** | Builder (supervised by FM), FM (QA creation) |
| **Version Controlled** | Yes |
| **Layer-Down** | No (application-specific) |
| **CI Validation** | Test execution (100% GREEN required) |

### 10.5 Modification Protocol

**Foreman creates**: QA (red tests before implementation)

**Builder fixes**: Tests to GREEN during build-to-green

**Not governance**: Changes to tests do NOT trigger governance ripple

---

## 11. Ripple Trigger Matrix

| Artifact Type | Ripple Required? | Trigger Condition |
|---------------|------------------|-------------------|
| Constitutional Canon | **YES** | Always (highest impact) |
| Governance Documentation (Canon-tier) | **YES** | If canonical or widely referenced |
| Governance Documentation (Operational) | Optional | If affects multiple repos or agents |
| Governance Scripts | **YES** | If changes governance behavior |
| Governance Templates (Canonical) | **YES** | If PUBLIC_API template |
| Governance Templates (Operational) | Optional | If widely used |
| Governance Evidence | **NO** | Evidence documents outcomes |
| Application Code | **NO** | Not governance |
| Application Tests | **NO** | Not governance |

**Ripple Execution**: Per GOVERNANCE_RIPPLE_MODEL.md

---

## 12. Testing Obligation Matrix

| Artifact Type | Testing Required | Test Type | Owner |
|---------------|------------------|-----------|-------|
| Constitutional Canon | Schema, Cross-refs | Syntax validation | Liaison |
| Governance Documentation | Schema, Cross-refs | Syntax validation | Liaison |
| Governance Scripts | **YES** | Unit, integration, dry-run | Builder or Liaison |
| Governance Templates | Schema | Structure validation | Liaison |
| Governance Evidence | Schema | Completeness check | Liaison |
| Application Code | **YES** | Unit, integration, E2E | Builder (supervised by FM) |
| Application Tests | **YES** | Test execution (100% GREEN) | Builder, FM |

---

## 13. Self-Alignment Authority Matrix

| Artifact Type | Liaison May Self-Align? | CS2 Approval Required? |
|---------------|-------------------------|------------------------|
| Constitutional Canon | NO (syntax only) | **YES** (always) |
| Governance Documentation (Canon) | Within bounds | If constitutional change |
| Governance Documentation (Operational) | YES | If new principles |
| Governance Scripts (Simple) | YES (bug fixes) | If structural change |
| Governance Scripts (Complex) | NO | **YES** |
| Governance Templates | YES (improvements) | If structural change |
| Governance Evidence | YES (creation) | NO (immutable after) |
| Application Code | NO | N/A (Builder domain) |
| Application Tests | NO | N/A (Builder/FM domain) |

---

## 14. File Path Pattern Recognition

### 14.1 Constitutional Canon Patterns

```
governance/canon/*.md
governance/maturion/*.md
*_CANON.md
BUILD_PHILOSOPHY.md
FM_ROLE_CANON.md
WAVE_MODEL.md
LIVING_AGENT_SYSTEM.md
```

### 14.2 Governance Documentation Patterns

```
governance/policy/*.md
governance/runbooks/*.md
governance/protocols/*.md
governance/models/*.md
*_PROTOCOL.md
*_MODEL.md
*_POLICY.md
```

### 14.3 Governance Scripts Patterns

```
.github/scripts/*.sh
.github/workflows/*.yml
scripts/*.sh
scripts/*.js
scripts/*.py
```

### 14.4 Governance Templates Patterns

```
governance/templates/*.template.*
governance/canon/*.template.md
*.template.md
*.template.json
```

### 14.5 Governance Evidence Patterns

```
governance/reports/*.md
governance/evidence/*.json
governance/scans/*.md
governance/ripple/*-ripple-report.md
*_REPORT.md
*_SCAN.md
```

### 14.6 Application Code Patterns

```
src/**/*
apps/**/*
lib/**/*
foreman/src/**/*
*.js (non-test)
*.ts (non-test)
*.py (non-test)
```

### 14.7 Application Test Patterns

```
tests/**/*
qa/**/*
__tests__/**/*
*.test.*
*.spec.*
*.test.js
*.spec.ts
```

---

## 15. CI/CD Integration Guidance

### 15.1 Automated Type Detection

**CI workflow should**:

1. **Detect artifact type** from file path patterns (Section 14)
2. **Apply appropriate validation** per testing obligation matrix (Section 12)
3. **Trigger ripple** if required per ripple trigger matrix (Section 11)
4. **Validate authority** per self-alignment matrix (Section 13)

### 15.2 Example CI Logic

```yaml
name: Governance Artifact Validation

on: [pull_request]

jobs:
  classify-artifacts:
    runs-on: ubuntu-latest
    outputs:
      has_canon: ${{ steps.classify.outputs.has_canon }}
      has_scripts: ${{ steps.classify.outputs.has_scripts }}
      has_app_code: ${{ steps.classify.outputs.has_app_code }}
    steps:
      - name: Classify Changed Files
        id: classify
        run: |
          # Detect artifact types from changed files
          # Set outputs based on classification
          
  validate-canon:
    if: needs.classify-artifacts.outputs.has_canon == 'true'
    needs: classify-artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Schema Validation
      - name: Cross-Reference Check
      - name: CS2 Approval Check (fail if missing)
      - name: Trigger Ripple Notification
      
  test-scripts:
    if: needs.classify-artifacts.outputs.has_scripts == 'true'
    needs: classify-artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Lint Scripts
      - name: Run Unit Tests
      - name: Dry-Run Validation
      
  test-app-code:
    if: needs.classify-artifacts.outputs.has_app_code == 'true'
    needs: classify-artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Run Tests (100% GREEN required)
      - name: Code Quality Check
      - name: Security Scan
```

---

## 16. Boundary Cases & Clarifications

### 16.1 Governance Scripts vs Application Code

**Question**: Is a script that automates governance "governance" or "code"?

**Answer**: **Governance Script** (Type 3)
- Treated as governance (ripple required if behavior changes)
- BUT tested like application code (unit tests, integration tests)
- Builder may implement if code-heavy, but liaison owns governance semantics

### 16.2 Agent Contracts

**Question**: What type are `.agent.md` files?

**Answer**: **Constitutional Canon** (Type 1) if in governance repo, **Governance Documentation** (Type 2) if in consumer repo
- Protected per AGENT_CONTRACT_PROTECTION_PROTOCOL.md
- Modification requires CS2 approval or specific authority
- Ripple required if canonical agent contract changed

### 16.3 Runbooks with Code Examples

**Question**: Is a runbook with bash snippets "documentation" or "script"?

**Answer**: **Governance Documentation** (Type 2)
- Code snippets are illustrative, not executable automation
- No dedicated testing required (syntax check sufficient)
- Liaison may self-align within bounds

### 16.4 Evidence with Templates

**Question**: Is a completed template "evidence" or "documentation"?

**Answer**: **Governance Evidence** (Type 5) once instantiated
- Template itself is Type 4 (Governance Template)
- Completed instance is Type 5 (Governance Evidence)
- Immutable after generation

---

## 17. Validation & Maintenance

### 17.1 Taxonomy Validation

This taxonomy MUST be validated:
- **Before use**: All agents and liaisons understand artifact types
- **During PR review**: Artifact classification is correct
- **Quarterly**: CS2 reviews for gaps, ambiguities, new artifact types

### 17.2 Taxonomy Evolution

**Changes to this taxonomy**:
- **MUST** be approved by CS2 (Johan Ras)
- **MUST** trigger governance ripple (high impact)
- **MUST** update GOVERNANCE_ARTIFACT_INVENTORY.md
- **MUST** notify all agents and liaisons

---

## 18. Cross-References

### 18.1 Primary Dependencies

- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance philosophy
- **GOVERNANCE_RIPPLE_MODEL.md** - Ripple execution requirements
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md** - Agent validation requirements
- **BUILD_PHILOSOPHY.md** - Testing and quality standards
- **LIVING_AGENT_SYSTEM.md** - Agent lifecycle

### 18.2 Supporting Protocols

- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md** - Agent contract modification rules
- **GOVERNANCE_ARTIFACT_INVENTORY.md** - Artifact inventory
- **GOVERNANCE_COMPLETENESS_MODEL.md** - Governance completeness

---

## 19. Summary Decision Tree

**When evaluating an artifact**:

```
┌─────────────────────────┐
│ Is it executable code?  │
├─────────────────────────┤
│ YES → Is it production? │
│   YES → Type 6 (App Code)
│   NO  → Is it tests?    │
│     YES → Type 7 (Tests)│
│     NO  → Type 3 (Script)
│                         │
│ NO  → Is it a template? │
│   YES → Type 4 (Template)
│   NO  → Is it evidence? │
│     YES → Type 5 (Evidence)
│     NO  → Is it canon?  │
│       YES → Type 1 (Canon)
│       NO  → Type 2 (Doc)
└─────────────────────────┘
```

---

## 20. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-08 | CS2 (Johan Ras) | Initial canonical taxonomy addressing GAP-002 |

---

**Authority**: CS2 (Johan Ras)  
**Effective Date**: 2026-02-08  
**Next Review**: 2026-05-08 (Quarterly)
