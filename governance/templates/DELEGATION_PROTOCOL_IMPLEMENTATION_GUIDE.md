# DELEGATION_PROTOCOL_IMPLEMENTATION_GUIDE

**Type**: Implementation Guide  
**Version**: 1.0.0  
**Authority**: CS2 (Johan Ras)  
**Date**: 2026-02-20  
**Purpose**: Step-by-step guidance for implementing AGENT_DELEGATION_PROTOCOL.md in orchestrator and specialist agents

---

## Overview

This guide provides **concrete implementation steps** for teams creating orchestrator/specialist agent pairs. It translates the canonical delegation protocol into actionable steps with worked examples.

**Pre-requisite Reading**:
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md`
- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md`

---

## Part 1: Planning Your Orchestrator/Specialist Pair

### Step 1.1: Define the Orchestrator Scope

Before writing any contract, answer:

1. **What principal grants authority?** (CS2 directly, or via Foreman?)
2. **What is the overall task type?** (e.g., "security + compliance audit", "multi-repo deployment")
3. **What domains are needed?** (list each domain separately)
4. **Are any tasks sequential or parallel?** (draw the dependency graph)

**Example Scope Definition**:
```
Task: Full ISMS compliance audit
Principal: CS2 (direct)
Domains needed:
  - Security scanning (independent)
  - Compliance documentation review (independent)
  - Evidence package assembly (sequential: depends on both above)

Execution plan:
  1. Parallel: Security Specialist + Compliance Specialist
  2. Sequential: Evidence Specialist (after both complete)
```

### Step 1.2: Declare Specialist Domains

For each specialist, define explicit boundaries:

| Specialist | Primary Domain | In Scope | Out of Scope |
|------------|---------------|----------|--------------|
| Security Specialist | security | SAST scans, dependency audits, secret detection | Code fixes, config changes |
| Compliance Specialist | compliance | Policy review, gap analysis, evidence mapping | Policy creation, waivers |
| Evidence Specialist | evidence | Evidence package assembly, artifact linking | Executing audit work |

**Rule**: If a task falls outside all declared domains → **the task is misrouted** and must be escalated to principal for scope redefinition.

### Step 1.3: Map to AGENT_REGISTRY.json

Each specialist MUST have an entry in `governance/AGENT_REGISTRY.json` (not CANON_INVENTORY — CANON_INVENTORY tracks artifacts; AGENT_REGISTRY tracks deployed agents):

```bash
# Check if specialist exists in AGENT_REGISTRY.json
python3 -c "
import json
with open('governance/AGENT_REGISTRY.json') as f:
    reg = json.load(f)
specialists = [a for a in reg['agents'] if a.get('status') == 'active']
print('Registered active specialists:')
for s in specialists:
    print(f'  {s[\"agent_id\"]} — domain: {s.get(\"domain\", \"unknown\")}')
"
```

If specialist is not in `AGENT_REGISTRY.json` → **stop and add it before proceeding**.

---

## Part 2: Creating the Orchestrator Contract

### Step 2.1: Use the Template

Copy `governance/templates/ORCHESTRATOR_AGENT_TEMPLATE.md` and fill in:

1. **YAML frontmatter**: Replace all `<placeholders>`
2. **Mission**: State clearly what cross-domain task is orchestrated
3. **Specialist registry**: List all `registered_orchestrator` entries
4. **max_concurrent_specialists**: Set based on task dependency graph

### Step 2.2: Implement Delegation Packages

The delegation package (Phase 3) MUST include all required fields:

```json
{
  "delegation_id": "orch-001-20260220T091234Z",
  "timestamp": "2026-02-20T09:12:34Z",
  "orchestrator_id": "isms-audit-orchestrator",
  "specialist_id": "security-specialist",
  "authority_source": "issue-#142",
  "task": {
    "description": "Run full SAST scan on PartPulse repository",
    "domain": "security",
    "scope": "SAST scan only. No code fixes. No infrastructure changes.",
    "inputs": "Repository: APGI-cmy/PartPulse, branch: main, commit: abc1234",
    "expected_outputs": "SARIF report, finding summary JSON",
    "success_criteria": "SARIF file non-empty, finding_summary.count >= 0",
    "escalation_path": "Return ESCALATED to isms-audit-orchestrator"
  },
  "constraints": {
    "must_not": ["modify any files", "push to any branch", "create PRs"],
    "must_use": ["official SARIF format for output"],
    "evidence_required": true,
    "governance_alignment": "LIVING_AGENT_SYSTEM_v6_2_0"
  }
}
```

**Critical**: `delegation_id` MUST be unique. Use format: `<orchestrator-short-id>-<NNN>-<ISO-timestamp>`.

### Step 2.3: Implement the Integration Gate

After all specialists return, the orchestrator runs an integration gate:

```bash
# Integration gate implementation
FAILED_COUNT=0
MISSING_COUNT=0

for delegation_id in "${DELEGATION_IDS[@]}"; do
  result_file=".agent-admin/delegations/results/${delegation_id}.json"
  
  if [ ! -f "${result_file}" ]; then
    echo "⚠️  Missing result for delegation ${delegation_id}"
    MISSING_COUNT=$((MISSING_COUNT + 1))
    continue
  fi
  
  status=$(jq -r '.status' "${result_file}")
  if [ "${status}" == "FAILED" ]; then
    FAILED_COUNT=$((FAILED_COUNT + 1))
    echo "❌  Delegation ${delegation_id} FAILED: $(jq -r '.result_summary' ${result_file})"
  fi
done

# Stop-and-fix trigger
if [ $((FAILED_COUNT + MISSING_COUNT)) -ge 2 ]; then
  echo "❌ [ORC_H] STOP-AND-FIX triggered: ${FAILED_COUNT} failed + ${MISSING_COUNT} missing"
  echo "ACTION: Halt all further delegation. Escalate to principal before retry."
  exit 1
fi
```

---

## Part 3: Creating the Specialist Contract

### Step 3.1: Use the Template

Copy `governance/templates/SPECIALIST_AGENT_TEMPLATE.md` and fill in:

1. **YAML frontmatter**: Replace all `<placeholders>`, especially `specialist.domain`
2. **Domain Boundaries**: Be explicit about IN SCOPE and OUT OF SCOPE
3. **Tier 1 knowledge**: Reference all constitutional domain documents with hashes
4. **Tier 2 knowledge**: Reference operational standards with versions

### Step 3.2: Implement Domain Validation

The specialist's Phase 3 MUST validate the delegation package:

```bash
# Read delegation package
DELEGATION_FILE=".agent-admin/delegations/packages/${DELEGATION_ID}.json"
TASK_DOMAIN=$(jq -r '.task.domain' "${DELEGATION_FILE}")
ORCHESTRATOR_ID=$(jq -r '.orchestrator_id' "${DELEGATION_FILE}")
REGISTERED_ORCHESTRATOR="<orchestrator-agent-id>"  # from contract

# Validate orchestrator
if [ "${ORCHESTRATOR_ID}" != "${REGISTERED_ORCHESTRATOR}" ]; then
  echo "❌ [SPEC_H] Delegation from non-registered orchestrator: ${ORCHESTRATOR_ID}"
  # Return rejected_delegation
  exit 1
fi

# Validate domain
MY_DOMAIN="<primary-domain>"  # from contract
if [ "${TASK_DOMAIN}" != "${MY_DOMAIN}" ]; then
  echo "❌ [SPEC_H] Task domain '${TASK_DOMAIN}' ≠ my domain '${MY_DOMAIN}'"
  # Return rejected_delegation with recommended_action
  exit 1
fi
echo "✅ [SPEC_H] Delegation validated"
```

### Step 3.3: Implement the Result Return Package

```bash
# Construct result package
cat > ".agent-admin/specialist-results/${DELEGATION_ID}.json" << EOF
{
  "delegation_id": "${DELEGATION_ID}",
  "specialist_id": "<specialist-agent-id>",
  "status": "${EXECUTION_STATUS}",
  "result_summary": "${RESULT_SUMMARY}",
  "evidence_artifact": "${EVIDENCE_PATH}",
  "domain_outputs": ${DOMAIN_OUTPUTS_JSON},
  "blockers": "${BLOCKERS:-null}",
  "lessons_learned": "${LESSONS:-null}"
}
EOF
echo "✅ [SPEC_M] Result package written: .agent-admin/specialist-results/${DELEGATION_ID}.json"
```

---

## Part 4: Testing the Delegation Chain

### Step 4.1: Pre-Flight Test

Before live execution, verify the delegation chain is wired correctly:

```bash
# Test: Orchestrator can find all registered specialists in AGENT_REGISTRY.json
echo "Testing specialist registry..."
for specialist_id in "<specialist-id-1>" "<specialist-id-2>"; do
  if python3 -c "
import json, sys
with open('governance/AGENT_REGISTRY.json') as f:
    reg = json.load(f)
found = any(a['agent_id'] == '${specialist_id}' and a['status'] == 'active' for a in reg['agents'])
sys.exit(0 if found else 1)
  "; then
    echo "  ✅ ${specialist_id} found in AGENT_REGISTRY.json"
  else
    echo "  ❌ ${specialist_id} NOT found in AGENT_REGISTRY.json — add before proceeding"
  fi
done
```

### Step 4.2: Dry-Run Delegation

Issue a dry-run delegation to verify the specialist accepts and returns correctly:

```bash
# Dry run: create test delegation package
cat > /tmp/test-delegation.json << EOF
{
  "delegation_id": "test-dry-run-001",
  "orchestrator_id": "<orchestrator-agent-id>",
  "specialist_id": "<specialist-agent-id>",
  "authority_source": "dry-run-test",
  "task": {
    "domain": "<specialist-domain>",
    "description": "Dry run test — validate delegation wiring",
    "scope": "validation only, no real execution",
    "inputs": "none",
    "expected_outputs": "confirmation of acceptance"
  }
}
EOF
echo "Dry run delegation constructed. Verify specialist acceptance protocol."
```

### Step 4.3: Evidence Verification

After a successful delegation cycle, verify evidence artifacts exist:

```bash
echo "Verifying evidence artifacts..."
[ -f ".agent-admin/delegations/log-*.json" ] && echo "✅ Delegation log present" || echo "❌ Delegation log missing"
[ -f ".agent-admin/specialist-results/*.json" ] && echo "✅ Result packages present" || echo "❌ Result packages missing"
[ -f ".agent-admin/prehandover/proof-*.md" ] && echo "✅ Prehandover proof present" || echo "❌ Prehandover proof missing"
```

---

## Part 5: Common Mistakes and How to Avoid Them

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Orchestrator executes specialist work "just this once" | Contract violation, governance drift | Always delegate; return if no specialist available |
| Specialist accepts out-of-domain task | Domain boundary violation | Implement strict domain check; return rejected_delegation |
| delegation_id reused across sessions | Audit log corruption | Use timestamp-based unique IDs |
| Evidence artifact not generated | Integration gate fails | Treat evidence generation as SPEC_H (non-deferrable) |
| Specialist not in AGENT_REGISTRY.json | Orchestrator cannot load registry | Add specialist to AGENT_REGISTRY.json before wiring |
| Stop-and-fix not triggered | Failure cascade continues | Implement ≥2-failure trigger in integration gate |

---

## Part 6: Adding to CANON_INVENTORY and AGENT_REGISTRY

When your orchestrator and specialist contracts are ready:

**Step 1: Register in CANON_INVENTORY.json** (artifact tracking with SHA256):
```bash
# Compute SHA256 for new agent files
sha256sum .github/agents/<orchestrator-id>.agent.md
sha256sum .github/agents/<specialist-id>.agent.md

# Add entries to governance/CANON_INVENTORY.json with:
# filename, version, file_hash, effective_date, description, type, path
# layer_down_status: "PUBLIC_API", file_hash_sha256 (full 64 chars)
```

**Step 2: Register in AGENT_REGISTRY.json** (agent operational status):
```bash
# Add entries to governance/AGENT_REGISTRY.json with:
# agent_id, agent_class, filename, path, domain (specialists only)
# orchestrator_link (specialists only), status: "active"
# registered_date, canon_inventory_ref, description, layer_down_status
# See governance/canon/AGENT_REGISTRY_ARCHITECTURE.md for full schema
```

---

## Authority

**Implementation Guide Version**: 1.0.0  
**Based On**: `governance/canon/AGENT_DELEGATION_PROTOCOL.md` v1.0.0  
**Authority**: CS2 (Johan Ras)  
**Last Updated**: 2026-02-20  
**Living Agent System**: v6.2.0
