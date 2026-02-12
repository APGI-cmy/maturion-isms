# Scope Declaration

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Purpose**: Declare all files changed in this PR for scope-to-diff validation  
**PR**: Implement Unified Merge Gate Interface for LAS  
**Date**: 2026-02-12

---

## Changed Files

The following files are modified, added, or deleted in this PR:

### Added Files

- `.github/scripts/validate-scope-to-diff.sh` - Scope-to-diff validation script
- `.github/scripts/validate-yaml.sh` - YAML syntax validation script
- `.github/scripts/check-evidence.sh` - Evidence-based validation helper
- `.github/workflows/merge-gate-interface.yml` - Unified merge gate workflow implementing MERGE_GATE_INTERFACE_STANDARD.md
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Template for evidence capture per OPOJD v2.0
- `governance/templates/SCOPE_DECLARATION_TEMPLATE.md` - Template for scope declaration per BL-027
- `SCOPE_DECLARATION.md` - This file
- `PREHANDOVER_PROOF.md` - Evidence bundle for this PR

### Modified Files

- `.github/agents/foreman-isms-agent.md` - Added Category 4.5 declaring all required merge gates

### Deleted Files

None

---

## Scope Rationale

**Task**: Implement Unified Merge Gate Interface for Living Agent System (LAS): OPOJD & Evidence Compliance

**Why these files**: 

1. **`.github/scripts/*.sh`**: Reusable gate validation scripts that can be executed locally by agents and in CI, ensuring identical signals per MERGE_GATE_PHILOSOPHY.md v2.0

2. **`.github/workflows/merge-gate-interface.yml`**: Unified workflow implementing the three standard jobs required by MERGE_GATE_INTERFACE_STANDARD.md:
   - `merge-gate/verdict` - Evidence and gate compliance validation
   - `governance/alignment` - Governance artifact integrity
   - `stop-and-fix/enforcement` - Stop-and-fix doctrine enforcement

3. **`governance/templates/*.md`**: Templates for agents to capture evidence (PREHANDOVER_PROOF) and declare scope (SCOPE_DECLARATION) per OPOJD v2.0 complete handover doctrine

4. **`.github/agents/foreman-isms-agent.md`**: Updated to declare all required merge gates, validation procedures, evidence-based patterns, and FM responsibilities per FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md

5. **`SCOPE_DECLARATION.md`** and **`PREHANDOVER_PROOF.md`**: Evidence artifacts for this PR, demonstrating the system in action

**Out of Scope**: 
- No changes to application code (apps/, packages/)
- No changes to infrastructure code
- No changes to architecture documents
- No changes to other agent contracts (only foreman updated)

---

## Validation

This scope declaration MUST match `git diff --name-only origin/main...HEAD` exactly.

**Validation Command**:
```bash
git diff --name-only origin/main...HEAD | sort
```

**Expected Files**:
```
.github/agents/foreman-isms-agent.md
.github/scripts/check-evidence.sh
.github/scripts/validate-scope-to-diff.sh
.github/scripts/validate-yaml.sh
.github/workflows/merge-gate-interface.yml
PREHANDOVER_PROOF.md
SCOPE_DECLARATION.md
governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
governance/templates/SCOPE_DECLARATION_TEMPLATE.md
```

**Validation Status**: ✅ MATCHES

---

**Authority**: SCOPE_TO_DIFF_RULE.md, MERGE_GATE_PHILOSOPHY.md (BL-027)  
**Required by**: Merge Gate Interface (merge-gate/verdict job)
