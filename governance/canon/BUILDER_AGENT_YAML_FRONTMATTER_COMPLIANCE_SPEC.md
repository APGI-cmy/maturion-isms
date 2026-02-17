# Builder Agent YAML Frontmatter Compliance Specification

**Type**: PUBLIC_API TIER-0  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Authority**: Supreme - Canonical  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Purpose**: Define permitted and prohibited YAML frontmatter fields for builder agent contracts to ensure GitHub Copilot recognition

---

## 1. Purpose

This specification defines the **canonical YAML frontmatter requirements** for builder agent contracts to ensure:
- GitHub Copilot parser compatibility
- Reliable agent discovery and recognition
- Consistent agent list visibility
- Prevention of agent contract deviation failures

This spec prevents:
- Agent files present but not recognized (BL-031 failure pattern)
- Non-standard fields breaking GitHub parser
- Inconsistent agent contract structure
- Wave execution delays due to missing agents

**Authority**: BL-031 (Agent Discovery Failure - Wave 5.5)

---

## 2. Scope

This specification applies to:
- **ALL builder agent contracts** (api-builder, ui-builder, qa-builder, schema-builder, integration-builder, etc.)
- **ALL repositories** with builder agents
- **ALL agent contract modifications** via PR

This specification does NOT apply to:
- Non-builder agent contracts (Foreman, Codex Advisor, Governance Liaison)
- Repository-level `.agent` files (see AGENT_FILE_SCHEMA.md)
- Application configuration files

---

## 3. Root Cause Analysis (BL-031)

### 3.1 Wave 5.5 Agent Discovery Failure

**What Happened**:
- ui-builder agent file existed at `.github/agents/ui-builder.md`
- ui-builder NOT visible in GitHub Copilot agent selection list
- Wave 5.5 execution stalled, generic coding agent substituted (governance violation)
- 2 hours wasted, PR closed, rework required

**Root Cause**:
- ui-builder YAML frontmatter included **non-standard field** `assigned_waves`
- GitHub Copilot parser rejected file due to unrecognized field
- Agent hidden from selection list despite file being present

**Fix**:
- Removed `assigned_waves` field from ui-builder contract
- Agent immediately appeared in selection list
- Wave execution resumed successfully

**Learning**: Only use GitHub-documented, parser-compatible YAML fields

---

## 4. Permitted YAML Fields

### 4.1 Standard GitHub Copilot Agent Fields

**REQUIRED** fields for builder agent contracts:

```yaml
---
id: <builder-identifier>              # REQUIRED: Unique builder ID
description: >                         # REQUIRED: Builder mission statement
  [Builder purpose and role]
agent:                                 # REQUIRED: Agent metadata
  id: <agent-id>                       # REQUIRED: Agent identifier
  class: implementer                   # REQUIRED: Always "implementer" for builders
  version: 6.2.0                       # REQUIRED: Living Agent System version
  contract_version: <version>          # REQUIRED: Contract version (e.g., 2.0.0)
governance:                            # REQUIRED: Governance bindings
  protocol: LIVING_AGENT_SYSTEM        # REQUIRED: Governance framework
  canon_inventory: governance/CANON_INVENTORY.json  # REQUIRED: Canon reference
  expected_artifacts: [...]            # REQUIRED: Expected outputs
  degraded_on_placeholder_hashes: true # REQUIRED: Placeholder detection
  degraded_action: escalate_and_block_merge  # REQUIRED: Degraded mode action
scope:                                 # REQUIRED: Scope boundaries
  repository: <repo-name>              # REQUIRED: Repository name
  domain: <domain>                     # REQUIRED: Builder domain (api, ui, qa, etc.)
  read_access: [...]                   # REQUIRED: Read permissions
  write_access: [...]                  # REQUIRED: Write permissions
  escalation_required: [...]           # REQUIRED: Escalation triggers
execution_identity:                    # REQUIRED: Execution identity
  name: "Maturion Bot"                 # REQUIRED: Bot name
  secret: MATURION_BOT_TOKEN           # REQUIRED: Auth token secret
  never_push_main: true                # REQUIRED: Branch protection
  write_via_pr: true                   # REQUIRED: PR-only writes
capabilities: [...]                    # REQUIRED: Builder capabilities
constraints: [...]                     # REQUIRED: Builder constraints
enforcement: [...]                     # REQUIRED: Enforcement rules
prohibitions: [...]                    # REQUIRED: Prohibited actions
metadata:                              # REQUIRED: Metadata
  canonical_home: <governance-repo>    # REQUIRED: Canon source
  this_copy: layered_down              # REQUIRED: Copy type
  authority: CS2                       # REQUIRED: Authority source
  last_updated: YYYY-MM-DD             # REQUIRED: Last update date
---
```

### 4.2 Optional GitHub-Compatible Fields

**PERMITTED** optional fields (use sparingly):

```yaml
tags: [...]                            # Optional: Agent tags
priority: high                         # Optional: Priority indicator
```

**Guidelines**:
- Only use optional fields if they serve a clear, documented purpose
- Verify field compatibility with GitHub Copilot before adding
- Document rationale in PR description
- Test agent recognition after adding optional fields

---

## 5. Prohibited YAML Fields

### 5.1 Non-Standard Fields (NEVER USE)

**PROHIBITED** fields that break GitHub Copilot parser:

❌ `assigned_waves` - Custom metadata (BL-031 root cause)  
❌ `wave_assignments` - Custom metadata  
❌ `task_queue` - Custom metadata  
❌ `execution_state` - Runtime state (belongs in workspace)  
❌ `session_memory` - Runtime state (belongs in workspace)  
❌ `custom_*` - Any custom metadata fields  
❌ Undocumented fields - Any fields not in AGENT_FILE_SCHEMA.md

**Rationale**: GitHub Copilot parser has strict schema validation. Unrecognized fields cause parser rejection, hiding agent from selection list.

### 5.2 Alternative Solutions

Instead of prohibited fields, use:

**Wave Assignments**: Document in wave planning artifacts, not agent contract  
**Task Queue**: Use GitHub Issues with labels, not agent contract metadata  
**Execution State**: Store in `.agent-workspace/<agent-id>/state/`  
**Session Memory**: Store in `.agent-workspace/<agent-id>/memory/`  
**Custom Metadata**: Store in separate JSON files, not YAML frontmatter

---

## 6. YAML Structure Validation

### 6.1 Syntax Requirements

**Valid YAML Structure**:
```yaml
---
# YAML frontmatter starts with three dashes
id: builder-name
description: >
  Multi-line description
  using YAML folded scalar syntax
agent:
  id: builder-name
  class: implementer
  version: 6.2.0
# ... other required fields
---

# Markdown content follows YAML frontmatter
## Builder Mission
...
```

**Invalid YAML Structure**:
```yaml
# ❌ Missing opening delimiter
id: builder-name
---

---
# ❌ Malformed YAML
id: builder-name
  invalid: indentation
---

---
id: "builder-name'  # ❌ Mismatched quotes
---

---
id: builder-name
custom_field: value  # ❌ Non-standard field
---
```

### 6.2 Validation Procedure

**Pre-Merge Validation** (MANDATORY):

1. **YAML Parser Validation**
   ```bash
   yamllint .github/agents/*.agent.md
   ```
   - Must pass without errors
   - Warnings treated as errors (BL-028)

2. **Schema Compliance Check**
   ```bash
   # Verify only permitted fields present
   yq '.[] | keys' .github/agents/builder.agent.md
   # Compare against permitted fields list
   ```

3. **GitHub Recognition Test**
   - Commit changes to feature branch
   - Push to GitHub
   - Open GitHub Copilot agent selection
   - Verify builder appears in agent list
   - Document verification with screenshot

4. **Evidence Documentation**
   ```markdown
   ## YAML Frontmatter Validation
   
   - [x] YAML syntax valid (yamllint passed)
   - [x] Only permitted fields used
   - [x] No prohibited fields present
   - [x] GitHub Copilot recognition verified
   - [x] Screenshot attached
   
   **Validation Date**: YYYY-MM-DD HH:MM:SS UTC
   ```

---

## 7. Merge Gate Enforcement

### 7.1 Builder Agent Contract Gate

**Gate**: Builder Agent YAML Compliance  
**Trigger**: Any PR modifying `.github/agents/*-builder*.agent.md`

**Validation Steps**:

1. **YAML Syntax Validation**
   - Run `yamllint` on modified agent files
   - Fail if any errors or warnings
   - Report specific line numbers and issues

2. **Prohibited Field Detection**
   - Parse YAML frontmatter
   - Check for prohibited fields (Section 5.1)
   - Fail if any prohibited fields found
   - List prohibited fields in error message

3. **Required Field Verification**
   - Verify all required fields present (Section 4.1)
   - Fail if any required fields missing
   - List missing fields in error message

4. **GitHub Recognition Test** (Manual)
   - Require manual verification comment
   - Format: "✅ Builder agent recognition verified in GitHub Copilot agent list (screenshot attached)"
   - Fail if manual verification not provided

**Gate Failure Consequences**:
- Block merge until all validation passes
- Require CS2 review for prohibited field usage
- Document validation results in PR

### 7.2 CI/CD Integration

**Workflow**: `.github/workflows/builder-agent-yaml-compliance.yml`

```yaml
name: Builder Agent YAML Compliance

on:
  pull_request:
    paths:
      - '.github/agents/*-builder*.agent.md'

jobs:
  yaml-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install yamllint
        run: pip install yamllint
      
      - name: Validate YAML syntax
        run: |
          yamllint .github/agents/*-builder*.agent.md
      
      - name: Check prohibited fields
        run: |
          # Parse YAML and check for prohibited fields
          # Fail if assigned_waves, wave_assignments, custom_*, etc. found
          
      - name: Verify required fields
        run: |
          # Parse YAML and check for required fields
          # Fail if any missing
      
      - name: Report results
        run: |
          echo "✅ YAML frontmatter compliance verified"
```

---

## 8. Migration Guide for Existing Contracts

### 8.1 Audit Existing Builder Agents

**Step 1: Identify All Builder Agents**
```bash
find . -path '.github/agents/*-builder*.agent.md' -type f
```

**Step 2: Check for Prohibited Fields**
```bash
# For each builder agent file
grep -E '(assigned_waves|wave_assignments|task_queue|custom_)' .github/agents/*.agent.md
```

**Step 3: Document Findings**
```markdown
## Builder Agent Audit Results

| Agent | Prohibited Fields Found | Action Required |
|-------|------------------------|-----------------|
| ui-builder | assigned_waves | Remove field |
| api-builder | None | Compliant |
| qa-builder | custom_metadata | Remove field |
```

### 8.2 Remediation Procedure

**For each non-compliant builder**:

1. **Create Remediation Issue**
   ```markdown
   Title: [GOVERNANCE] Fix YAML frontmatter compliance for [builder-name]
   
   ## Issue
   Builder agent contract contains prohibited YAML fields
   
   ## Prohibited Fields
   - `assigned_waves` (custom metadata)
   
   ## Required Action
   1. Remove prohibited fields from YAML frontmatter
   2. Move data to appropriate location (wave planning artifacts)
   3. Validate YAML syntax
   4. Test GitHub Copilot recognition
   5. Document migration in PR
   
   ## References
   - BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md v1.0.0
   - BL-031: Pre-Flight Builder Agent Availability Check
   ```

2. **Create Remediation PR**
   - Remove prohibited fields
   - Validate YAML syntax
   - Test agent recognition
   - Document migration

3. **Verify Compliance**
   - Agent appears in GitHub Copilot selection list
   - All required fields present
   - No prohibited fields remain

---

## 9. Cross-Repository Compliance Audit

### 9.1 Ecosystem-Wide Audit

**Scope**: ALL repositories with builder agents

**Audit Checklist**:
- [ ] maturion-foreman-governance (canonical)
- [ ] maturion-isms (MAT build)
- [ ] maturion-foreman-office-app (FO build)
- [ ] Any future repositories

**Audit Procedure**:
1. Clone each repository
2. List all builder agent files
3. Run prohibited field scan
4. Run required field verification
5. Test GitHub Copilot recognition
6. Document compliance status
7. Create remediation issues for non-compliant agents

**Audit Report Template**:
```markdown
## Cross-Repository Builder Agent YAML Compliance Audit

**Audit Date**: YYYY-MM-DD  
**Auditor**: governance-repo-administrator  
**Standard**: BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md v1.0.0

### Compliance Summary
- Total repositories: N
- Total builder agents: N
- Compliant agents: N
- Non-compliant agents: N
- Remediation issues created: N

### Repository Details
| Repository | Builder Agents | Compliant | Issues |
|------------|----------------|-----------|--------|
| maturion-isms | 5 | 4 | #NNN |
| ... | ... | ... | ... |

### Remediation Timeline
- Issues created: YYYY-MM-DD
- Target completion: YYYY-MM-DD + 7 days
- Follow-up audit: YYYY-MM-DD + 14 days
```

---

## 10. Learning Loop Integration

### 10.1 Bootstrap Learning BL-031

This specification implements prevention measures for:

**BL-031: Pre-Flight Builder Agent Availability Check**
- **Failure Pattern**: Non-standard YAML field broke GitHub parser
- **Specific Field**: `assigned_waves` in ui-builder contract
- **Consequence**: Agent hidden from selection list, 2 hours wasted
- **Prevention**: This compliance specification

### 10.2 "We Only Fail Once" Doctrine

Under WE_ONLY_FAIL_ONCE_DOCTRINE.md:
- BL-031 documented and canonized
- YAML compliance spec created (this document)
- Merge gate enforcement enabled
- Cross-repo audit required
- **If pattern repeats**: CATASTROPHIC FAILURE triggered

---

## 11. Related Documents

**Constitutional Canon**:
- LIVING_AGENT_SYSTEM.md v6.2.0 - Living Agent framework
- AGENT_FILE_SCHEMA.md - Repository-level agent file schema
- WE_ONLY_FAIL_ONCE_DOCTRINE.md - Learning promotion rule
- BOOTSTRAP_EXECUTION_LEARNINGS.md - BL-031 entry

**Operational Canon**:
- FOREMAN_PRE_WAVE_AGENT_AVAILABILITY_CHECK.md - Pre-wave check protocol
- AGENT_CONTRACT_PROTECTION_PROTOCOL.md - Contract protection
- BUILDER_CONTRACT_BINDING_CHECKLIST.md - Builder contract requirements

**Evidence**:
- RCA: modules/mat/05-build-evidence/RCA_WAVE_5.5_AGENT_CONTRACT_DEVIATION.md
- Issues: APGI-cmy/maturion-isms#290, #292
- PRs: APGI-cmy/maturion-isms#288, #291, #293

---

## 12. GitHub Copilot Agent System Reference

### 12.1 Known GitHub Copilot Parser Behavior

Based on BL-031 investigation:

**Parser Accepts**:
- Standard agent contract fields (id, description, agent, governance, scope, etc.)
- Standard YAML syntax (quoted strings, arrays, objects)
- Multi-line strings with `>` or `|` notation
- Nested objects and arrays

**Parser Rejects** (causes agent to be hidden):
- Unrecognized top-level fields
- Custom metadata fields
- Malformed YAML syntax
- Mismatched quotes or brackets

**Unknown Behavior** (requires testing):
- Deeply nested objects (>3 levels)
- Extremely long arrays (>100 items)
- Non-ASCII characters in field names
- Comments in YAML frontmatter

**Recommendation**: When in doubt, test in non-production repository first.

### 12.2 Future GitHub Copilot Schema Evolution

**Monitoring Required**:
- Track GitHub Copilot agent system updates
- Monitor for new permitted fields
- Test new fields before ecosystem-wide adoption
- Update this spec when GitHub schema changes

**Update Procedure**:
1. Detect GitHub Copilot schema change
2. Test new fields in sandbox repository
3. Verify agent recognition
4. Update this specification
5. Execute layer-down ripple to all repos
6. Document changes in CHANGELOG.md

---

## 13. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Governance-Repo-Administrator | Initial specification implementing BL-031 prevention measures, defining permitted/prohibited YAML fields |

---

**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0 | Approved by CS2 (Johan Ras) | File: governance/canon/BUILDER_AGENT_YAML_FRONTMATTER_COMPLIANCE_SPEC.md
