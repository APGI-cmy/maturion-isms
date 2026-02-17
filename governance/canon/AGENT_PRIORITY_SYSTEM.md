# AGENT PRIORITY SYSTEM

## Status
**Type**: Tier-0 Constitutional Canon  
**Authority**: Supreme - Constitutional  
**Version**: 1.0.0  
**Effective Date**: 2026-02-17  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Layer-Down Status**: PUBLIC_API  
**Applies To**: All Agents, All Repositories  

---

## 1. Purpose

This document establishes the **canonical priority-based context loading system** that enables agents to dynamically load governance context in order of criticality, ensuring constitutional constraints are loaded first and agent-specific customization is supported without contract modification.

### Core Principle

> **Critical context first. Agent-specific overrides second. Everything else on-demand.**

Priority-based loading solves:
- **Context overload**: Agents get what they need, when they need it
- **Stale context**: Dynamic loading ensures currency
- **Static contracts**: Governance updates without contract rewrites
- **Role confusion**: Agent-class-specific context eliminates generic bloat

---

## 2. Constitutional Authority

This system is mandated by:
- **AGENT_CONTRACT_ARCHITECTURE.md** - 4-phase architecture (Phase 2: Induction)
- **LIVING_AGENT_SYSTEM.md** - Dynamic context loading
- **AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md** - Context synchronization
- **GOVERNANCE_ARTIFACT_TAXONOMY.md** - Artifact classification

---

## 3. Priority Levels

The priority system defines **4 priority levels** for context loading:

| Level | Name | Description | Examples | Load Timing |
|-------|------|-------------|----------|-------------|
| **0** | **Critical** | Constitutional constraints that MUST be loaded first | BUILD_PHILOSOPHY.md, GOVERNANCE_PURPOSE_AND_SCOPE.md | Always, First |
| **1** | **High** | Role-specific canon and core responsibilities | FM_ROLE_CANON.md, BUILDER_ROLE_CANON.md | Always, Second |
| **2** | **Medium** | Domain-specific guidance and procedures | Testing policies, Quality standards | Context-dependent |
| **3** | **Low** | Reference material and supporting documentation | Templates, Examples, Runbooks | On-demand |

---

## 4. Priority File Structure

### 4.1 Directory Structure

```
governance/priorities/
├── README.md                          # Priority system overview
├── supervisor/                        # Foreman agent class
│   ├── level-0-critical.txt          # Critical context (constitutional)
│   ├── level-1-high.txt              # High priority (role-specific)
│   ├── level-2-medium.txt            # Medium priority (domain)
│   └── level-3-low.txt               # Low priority (reference)
├── implementer/                       # Builder agent class
│   ├── level-0-critical.txt
│   ├── level-1-high.txt
│   ├── level-2-medium.txt
│   └── level-3-low.txt
├── administrator/                     # Admin agents (governance-repo-administrator)
│   ├── level-0-critical.txt
│   ├── level-1-high.txt
│   ├── level-2-medium.txt
│   └── level-3-low.txt
├── overseer/                          # CodexAdvisor agent class
│   ├── level-0-critical.txt
│   ├── level-1-high.txt
│   ├── level-2-medium.txt
│   └── level-3-low.txt
├── liaison/                           # Governance liaison agents
│   ├── level-0-critical.txt
│   ├── level-1-high.txt
│   ├── level-2-medium.txt
│   └── level-3-low.txt
└── overrides/                         # Agent-specific overrides
    ├── foreman.txt                   # Foreman-specific context
    ├── governance-repo-administrator.txt
    └── CodexAdvisor-agent.txt
```

### 4.2 Priority File Format

Each priority file is a simple text file listing governance artifact paths, one per line:

```
# Level 0: Critical (Constitutional Constraints)
governance/CONSTITUTION.md
governance/canon/BUILD_PHILOSOPHY.md
governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
governance/canon/LIVING_AGENT_SYSTEM.md
governance/canon/AGENT_CONTRACT_ARCHITECTURE.md
```

**Format Rules**:
- One file path per line
- Paths relative to repository root
- Comments start with `#`
- Empty lines ignored
- Paths must exist (validation enforced)

---

## 5. Loading Sequence

### 5.1 Induction Phase Loading Order

During Phase 2 (Induction), agents load context in this order:

```
1. Load Level 0 (Critical) from governance/priorities/<agent-class>/level-0-critical.txt
        ↓
2. Load Level 1 (High) from governance/priorities/<agent-class>/level-1-high.txt
        ↓
3. Load agent-specific overrides from governance/priorities/overrides/<agent-type>.txt (if exists)
        ↓
4. Load Level 2 (Medium) — conditionally, based on task context
        ↓
5. Load Level 3 (Low) — on-demand only
```

### 5.2 Loading Algorithm

```bash
load_priority_context() {
    local agent_class="$1"  # supervisor, implementer, administrator, overseer, liaison
    local agent_type="$2"   # foreman, builder, governance-repo-administrator, etc.
    
    local priorities_dir="governance/priorities"
    local class_dir="${priorities_dir}/${agent_class}"
    local override_file="${priorities_dir}/overrides/${agent_type}.txt"
    
    echo "[INDUCTION] Loading priority context for ${agent_type} (class: ${agent_class})"
    
    # Level 0: Critical (ALWAYS load)
    if [ -f "${class_dir}/level-0-critical.txt" ]; then
        echo "[INDUCTION] Loading Level 0 (Critical)..."
        load_files_from_list "${class_dir}/level-0-critical.txt"
    else
        echo "[ERROR] Level 0 critical context missing for ${agent_class}"
        exit 1
    fi
    
    # Level 1: High (ALWAYS load)
    if [ -f "${class_dir}/level-1-high.txt" ]; then
        echo "[INDUCTION] Loading Level 1 (High)..."
        load_files_from_list "${class_dir}/level-1-high.txt"
    fi
    
    # Agent-specific overrides (if exists)
    if [ -f "$override_file" ]; then
        echo "[INDUCTION] Loading agent-specific overrides for ${agent_type}..."
        load_files_from_list "$override_file"
    fi
    
    # Level 2: Medium (task-dependent - can be skipped)
    if [ "${LOAD_LEVEL_2:-true}" = "true" ]; then
        if [ -f "${class_dir}/level-2-medium.txt" ]; then
            echo "[INDUCTION] Loading Level 2 (Medium)..."
            load_files_from_list "${class_dir}/level-2-medium.txt"
        fi
    fi
    
    # Level 3: Low (on-demand only - never auto-loaded)
    echo "[INDUCTION] Level 3 (Low) available on-demand"
}

load_files_from_list() {
    local list_file="$1"
    
    while IFS= read -r line; do
        # Skip comments and empty lines
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue
        
        local file_path="${REPO_ROOT}/${line}"
        
        if [ -f "$file_path" ]; then
            echo "  ✓ Loaded: $line"
            # Store path for reference (actual loading mechanism depends on implementation)
            LOADED_CONTEXT+=("$file_path")
        else
            echo "  ✗ Missing: $line"
            MISSING_CONTEXT+=("$line")
        fi
    done < "$list_file"
}
```

---

## 6. Priority Level Definitions

### 6.1 Level 0: Critical (Constitutional Constraints)

**Purpose**: Constitutional documents that define immutable boundaries and supreme authority.

**Loading**: ALWAYS loaded, FIRST in sequence.

**Failure Mode**: Missing Level 0 = Preflight failure (halt session).

**Examples**:
- `governance/CONSTITUTION.md`
- `governance/canon/BUILD_PHILOSOPHY.md`
- `governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md`

**Characteristics**:
- Tier-0 constitutional canon
- Immutable without CS2 approval
- Defines "what must be"
- Universal applicability (all agents)

### 6.2 Level 1: High (Role-Specific Canon)

**Purpose**: Role-specific canonical guidance defining core responsibilities and authority.

**Loading**: ALWAYS loaded, SECOND in sequence.

**Failure Mode**: Missing Level 1 = Warning (session continues but degraded).

**Examples (Foreman)**:
- `governance/canon/FM_ROLE_CANON.md`
- `governance/canon/FOREMAN_MEMORY_PROTOCOL.md`
- `governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md`

**Examples (Builder)**:
- `governance/canon/BUILDER_ROLE_CANON.md` (to be created)
- `governance/canon/ARCHITECTURE_TO_GREEN_PROTOCOL.md` (to be created)

**Examples (Administrator)**:
- `governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md`
- `governance/canon/GOVERNANCE_RIPPLE_MODEL.md`
- `governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md`

**Characteristics**:
- Role-specific (varies by agent class)
- Defines "how I operate"
- Canonical authority for role
- Agent-class shared (all foremen, all builders, etc.)

### 6.3 Level 2: Medium (Domain-Specific Guidance)

**Purpose**: Domain-specific procedures, policies, and operational guidance.

**Loading**: CONDITIONAL - loaded based on task context.

**Failure Mode**: Missing Level 2 = Info (session continues normally).

**Examples**:
- Testing policies
- Quality standards
- Deployment procedures
- Security protocols
- Compliance checklists

**Characteristics**:
- Derived from constitutional canon
- Context-dependent relevance
- Procedural "how-to" guidance
- Can evolve more frequently than Level 0/1

**Loading Control**:
```bash
# Load Level 2 only for testing tasks
if [[ "$TASK_TYPE" == "testing" ]]; then
    LOAD_LEVEL_2=true
else
    LOAD_LEVEL_2=false
fi
```

### 6.4 Level 3: Low (Reference Material)

**Purpose**: Supporting documentation, templates, examples, and runbooks.

**Loading**: ON-DEMAND only (never auto-loaded during induction).

**Failure Mode**: Missing Level 3 = No impact (purely reference).

**Examples**:
- Templates and examples
- Historical documentation
- Runbooks and playbooks
- Learning materials
- Archived artifacts

**Characteristics**:
- Reference-only (not canonical)
- Agent retrieves when needed
- No loading during induction
- Informational value only

**Access Pattern**:
```bash
# Agent requests Level 3 on-demand during Build phase
load_on_demand_reference() {
    local reference_file="$1"
    # Load specific Level 3 file when needed
}
```

---

## 7. Agent-Specific Overrides

### 7.1 Purpose

Enable agent-instance-specific context without duplicating class-level files or modifying agent contracts.

**Use Case**: Agent `foreman-isms` needs ISMS-specific context that other foremen don't need.

### 7.2 Override File Format

File: `governance/priorities/overrides/foreman-isms.txt`

```
# Foreman-ISMS-Specific Context
docs/isms-specific/security-requirements.md
docs/isms-specific/compliance-checklist.md
```

### 7.3 Override Loading

Overrides are loaded AFTER Level 1 (High) but BEFORE Level 2 (Medium):

```
Level 0 (Critical)
    ↓
Level 1 (High)
    ↓
Agent-Specific Overrides  <-- HERE
    ↓
Level 2 (Medium)
```

This ensures:
- Constitutional constraints apply first
- Role-specific canon applies second
- Agent customization applies third
- Domain guidance applies last

### 7.4 Override Best Practices

✅ **Good Overrides**:
- Repository-specific constraints
- Application-specific guidance
- Instance-specific configuration
- Temporary experimental context

❌ **Bad Overrides**:
- Weakening constitutional constraints
- Replacing role-specific canon
- Bypassing governance requirements
- Permanent agent-specific rules (should be in class-level)

---

## 8. Priority File Maintenance

### 8.1 Who Maintains Priority Files?

| Priority Level | Maintainer | Approval Required |
|----------------|------------|-------------------|
| Level 0 (Critical) | CS2 only | CS2 approval + ripple |
| Level 1 (High) | CS2 or Governance Admin | CS2 approval for new canon |
| Level 2 (Medium) | Governance Admin | Self-alignment authority |
| Level 3 (Low) | Any agent | PR review |
| Overrides | Agent owner + Governance Admin | PR review |

### 8.2 Adding New Canon to Priority Files

When new canonical governance is created:

1. **Determine Priority Level**:
   - Constitutional? → Level 0
   - Role-specific? → Level 1
   - Domain-specific? → Level 2
   - Reference? → Level 3

2. **Add to Appropriate Class Files**:
   ```bash
   # Example: New foreman canon (Level 1)
   echo "governance/canon/NEW_FOREMAN_CANON.md" >> governance/priorities/supervisor/level-1-high.txt
   ```

3. **Validate Priority Files**:
   ```bash
   .github/scripts/validate-priority-files.sh
   ```

4. **Update CANON_INVENTORY.json**:
   - Include priority_level metadata
   - Trigger ripple if PUBLIC_API

### 8.3 Priority File Validation

All priority files MUST pass validation:

```bash
validate_priority_file() {
    local file="$1"
    local errors=()
    
    # Check 1: File exists
    [ -f "$file" ] || errors+=("Priority file missing: $file")
    
    # Check 2: All referenced files exist
    while IFS= read -r line; do
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue
        
        if [ ! -f "${REPO_ROOT}/${line}" ]; then
            errors+=("Referenced file missing: $line")
        fi
    done < "$file"
    
    # Check 3: No duplicates within file
    local duplicates=$(grep -v '^#' "$file" | grep -v '^$' | sort | uniq -d)
    if [ -n "$duplicates" ]; then
        errors+=("Duplicate entries: $duplicates")
    fi
    
    # Report errors
    if [ ${#errors[@]} -gt 0 ]; then
        echo "Validation failed for $file:"
        printf '%s\n' "${errors[@]}"
        return 1
    fi
    
    return 0
}
```

---

## 9. Working Contract Integration

### 9.1 Priority Context in Working Contract

The working contract MUST document which priority levels were loaded:

```markdown
## Loaded Priority Context

### Level 0 (Critical) - Constitutional Constraints
- ✅ governance/CONSTITUTION.md
- ✅ governance/canon/BUILD_PHILOSOPHY.md
- ✅ governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
- ✅ governance/canon/LIVING_AGENT_SYSTEM.md
- ✅ governance/canon/AGENT_CONTRACT_ARCHITECTURE.md

### Level 1 (High) - Role-Specific Canon
- ✅ governance/canon/FM_ROLE_CANON.md
- ✅ governance/canon/FOREMAN_MEMORY_PROTOCOL.md
- ✅ governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md

### Agent-Specific Overrides
- ✅ docs/isms-specific/security-requirements.md

### Level 2 (Medium) - Domain Guidance
- ⊘ Skipped (not required for this task)

### Level 3 (Low) - Reference Material
- ⊘ On-demand only
```

### 9.2 Context Verification

Working contract generation MUST verify priority context loading:

```bash
verify_priority_loading() {
    local expected_level_0_count=5
    local actual_level_0_count=${#LEVEL_0_LOADED[@]}
    
    if [ "$actual_level_0_count" -ne "$expected_level_0_count" ]; then
        echo "ERROR: Level 0 context incomplete ($actual_level_0_count/$expected_level_0_count)"
        exit 1
    fi
    
    echo "✅ Priority context loading verified"
}
```

---

## 10. Dynamic Priority Updates

### 10.1 Priority File Updates Without Contract Changes

**Problem Solved**: New governance canon requires agent contract updates.

**Solution**: Update priority file instead of agent contract.

**Example**:
```bash
# New constitutional canon created: SECURITY_BASELINE.md
# Add to Level 0 for all agents (no contract changes needed)

echo "governance/canon/SECURITY_BASELINE.md" >> governance/priorities/supervisor/level-0-critical.txt
echo "governance/canon/SECURITY_BASELINE.md" >> governance/priorities/implementer/level-0-critical.txt
echo "governance/canon/SECURITY_BASELINE.md" >> governance/priorities/administrator/level-0-critical.txt

# Next agent wake-up automatically loads new canon
# No agent contract modification required
```

### 10.2 Ripple Integration

When priority files are updated:

1. **Update CANON_INVENTORY.json** with priority level metadata
2. **Trigger governance ripple** if PUBLIC_API canon added
3. **Validate priority files** in CI/CD
4. **Log priority changes** in governance/CHANGELOG.md

---

## 11. Class-Specific Priority Examples

### 11.1 Supervisor Class (Foreman)

**Level 0 (Critical)**:
```
governance/CONSTITUTION.md
governance/canon/BUILD_PHILOSOPHY.md
governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
governance/canon/LIVING_AGENT_SYSTEM.md
governance/canon/AGENT_CONTRACT_ARCHITECTURE.md
governance/canon/AGENT_PREFLIGHT_PATTERN.md
```

**Level 1 (High)**:
```
governance/canon/FM_ROLE_CANON.md
governance/canon/FOREMAN_MEMORY_PROTOCOL.md
governance/canon/AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md
governance/canon/MERGE_GATE_VERDICT_PROTOCOL.md
governance/canon/BUILDER_APPOINTMENT_PROTOCOL.md
```

**Level 2 (Medium)**:
```
governance/canon/QA_CATALOG_ALIGNMENT_GATE_CANON.md
governance/policy/testing-standards.md
governance/runbooks/foreman-qa-creation.md
```

### 11.2 Implementer Class (Builder)

**Level 0 (Critical)**:
```
governance/CONSTITUTION.md
governance/canon/BUILD_PHILOSOPHY.md
governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
governance/canon/LIVING_AGENT_SYSTEM.md
governance/canon/AGENT_CONTRACT_ARCHITECTURE.md
governance/canon/AGENT_PREFLIGHT_PATTERN.md
```

**Level 1 (High)**:
```
governance/canon/BUILDER_ROLE_CANON.md
governance/canon/ARCHITECTURE_TO_GREEN_PROTOCOL.md
governance/canon/TEST_DEBT_PROHIBITION.md
```

**Level 2 (Medium)**:
```
governance/policy/code-quality-standards.md
governance/policy/testing-best-practices.md
governance/runbooks/builder-implementation-workflow.md
```

### 11.3 Administrator Class (Governance Repo Admin)

**Level 0 (Critical)**:
```
governance/CONSTITUTION.md
governance/canon/BUILD_PHILOSOPHY.md
governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
governance/canon/LIVING_AGENT_SYSTEM.md
governance/canon/AGENT_CONTRACT_ARCHITECTURE.md
governance/canon/AGENT_PREFLIGHT_PATTERN.md
```

**Level 1 (High)**:
```
governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md
governance/canon/GOVERNANCE_RIPPLE_MODEL.md
governance/canon/CANON_INVENTORY_INTEGRITY_REQUIREMENTS.md
governance/canon/SELF_ALIGNMENT_AUTHORITY_MODEL.md
governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md
```

**Level 2 (Medium)**:
```
governance/runbooks/ripple-execution.md
governance/runbooks/canon-maintenance.md
governance/templates/CANON_CREATION_AND_PROPAGATION_CHECKLIST.md
```

---

## 12. Compliance and Validation

### 12.1 Priority System Compliance

All agents MUST:
- ✅ Load Level 0 (Critical) during every induction
- ✅ Load Level 1 (High) during every induction
- ✅ Load agent-specific overrides (if exist)
- ✅ Document loaded context in working contract
- ✅ Validate priority files before loading

### 12.2 Validation Script

```bash
#!/bin/bash
# validate-priority-files.sh

REPO_ROOT="$(git rev-parse --show-toplevel)"
PRIORITIES_DIR="${REPO_ROOT}/governance/priorities"

ERRORS=0

# Validate each class directory
for class_dir in "$PRIORITIES_DIR"/{supervisor,implementer,administrator,overseer,liaison}; do
    if [ ! -d "$class_dir" ]; then
        echo "ERROR: Missing class directory: $(basename "$class_dir")"
        ((ERRORS++))
        continue
    fi
    
    # Validate Level 0 (mandatory)
    if ! validate_priority_file "$class_dir/level-0-critical.txt"; then
        ((ERRORS++))
    fi
    
    # Validate other levels (if exist)
    for level_file in "$class_dir"/level-*.txt; do
        if [ -f "$level_file" ]; then
            if ! validate_priority_file "$level_file"; then
                ((ERRORS++))
            fi
        fi
    done
done

# Validate overrides
if [ -d "$PRIORITIES_DIR/overrides" ]; then
    for override_file in "$PRIORITIES_DIR/overrides"/*.txt; do
        if [ -f "$override_file" ]; then
            if ! validate_priority_file "$override_file"; then
                ((ERRORS++))
            fi
        fi
    done
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ Priority file validation: PASS"
    exit 0
else
    echo "❌ Priority file validation: FAIL ($ERRORS errors)"
    exit 1
fi
```

---

## 13. Migration from Static Contracts

### 13.1 Extracting Context to Priority Files

For existing agent contracts with embedded context:

1. **Identify Constitutional References**:
   - Extract references to BUILD_PHILOSOPHY.md, CONSTITUTION.md, etc.
   - Add to Level 0 priority file

2. **Identify Role-Specific Canon**:
   - Extract references to role-specific documents
   - Add to Level 1 priority file

3. **Identify Domain Guidance**:
   - Extract procedural references
   - Add to Level 2 priority file

4. **Remove from Contract**:
   - Replace with "See governance/priorities/<class>/ for context"
   - Contract becomes thinner, priority files become richer

### 13.2 Migration Example

**Before (Static Contract)**:
```markdown
## Required Reading
- BUILD_PHILOSOPHY.md
- FM_ROLE_CANON.md
- AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md
- QA_CATALOG_ALIGNMENT_GATE_CANON.md
```

**After (Priority System)**:
```markdown
## Context Loading
Context loaded dynamically from priority system:
- Level 0 (Critical): Constitutional constraints
- Level 1 (High): Role-specific canon
- Level 2 (Medium): Domain guidance (task-dependent)

See: governance/priorities/supervisor/ for full context list.
```

---

## 14. Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-02-17 | Johan Ras | Initial canonical priority system definition |

---

**Authority**: CS2 (Johan Ras)  
**Parent**: AGENT_CONTRACT_ARCHITECTURE.md v1.0.0  
**Enforcement**: Merge Gate Interface + CodexAdvisor  
**Ripple**: PUBLIC_API (all consumer repositories)

---

*This document is Tier-0 constitutional canon. All agents MUST use priority-based context loading. Changes require CS2 approval and full governance ripple.*
