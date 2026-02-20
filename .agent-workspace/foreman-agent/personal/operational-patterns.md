# OPERATIONAL PATTERNS — Foreman Way of Work

**Agent**: foreman-agent  
**Purpose**: Capture proven operational patterns and workflows  
**Authority**: Experience, Governance Canon, CS2 Guidance  
**Last Updated**: 2026-02-19

---

## PRE-HANDOVER GATE VALIDATION PROTOCOL

**Pattern Name**: Pre-Handover Gate Validation  
**Established**: 2026-02-19  
**Authority**: MERGE_GATE_PHILOSOPHY.md v2.0.0, CS2 Direct Order  
**Incident**: Three gate failures (Wave 6, 2026-02-18)

### Problem This Solves

**Before this pattern**:
- Validated code quality (lint, build, test) locally
- Assumed deployment gates would pass if code quality passed
- Created PRs without testing deployment workflows
- Result: Three consecutive deployment gate failures

**After this pattern**:
- Validate EVERY applicable gate before handover
- Maintain internal error log for tracking
- HALT handover if ANY gate fails
- Result: Zero failed gates at handover

---

### The Pattern (Step-by-Step)

#### Step 1: Initialize Gate Validation Session

**When**: At START of work session, before any code changes

**Actions**:
```bash
# Create gate validation log
mkdir -p .agent-workspace/foreman-agent
cat > .agent-workspace/foreman-agent/gate-validation-log.md <<EOF
# Gate Validation Log — $(date -u +"%Y-%m-%d %H:%M:%S UTC")

**Session**: $SESSION_ID
**Agent**: foreman-agent
**Task**: [brief task description]

---

## Gate Validation Results

EOF
```

**Purpose**: Set up tracking system BEFORE first validation

---

#### Step 2: Enumerate ALL Applicable Gates

**When**: BEFORE making any code changes (or immediately after completing changes)

**Actions**:
```bash
# List ALL workflow files
echo "## Enumerating Applicable Gates" >> .agent-workspace/foreman-agent/gate-validation-log.md
echo "" >> .agent-workspace/foreman-agent/gate-validation-log.md

ls -la .github/workflows/*.yml .github/workflows/*.yaml 2>/dev/null | tee -a .agent-workspace/foreman-agent/gate-validation-log.md

# For EACH workflow, check if it applies to my changes
for workflow in .github/workflows/*.{yml,yaml}; do
  if [ -f "$workflow" ]; then
    echo "### Workflow: $(basename $workflow)" | tee -a .agent-workspace/foreman-agent/gate-validation-log.md
    
    # Check triggers (on push, on pull_request, paths, etc.)
    grep -A 10 "^on:" "$workflow" | tee -a .agent-workspace/foreman-agent/gate-validation-log.md
    echo "" >> .agent-workspace/foreman-agent/gate-validation-log.md
  fi
done
```

**Example Output**:
```
Workflow: deploy-mat-vercel.yml
  on:
    push:
      branches: [main]
      paths: ['apps/mat-frontend/**']
    pull_request:
      paths: ['apps/mat-frontend/**']
```

**Decision Logic**:
- If I changed files matching `paths` → Gate applies
- If workflow has no `paths` filter → Gate ALWAYS applies
- Document ALL applicable gates in validation log

---

#### Step 3: Execute EACH Gate Locally

**When**: BEFORE running report_progress (handover)

**For EACH applicable gate**:

```bash
GATE_NAME="[Gate Name]"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Log gate execution start
cat >> .agent-workspace/foreman-agent/gate-validation-log.md <<EOF
---

## $GATE_NAME — $TIMESTAMP

**Status**: RUNNING...

EOF

# Execute the gate command
cd [working-directory]
[gate-command] > /tmp/gate-output.txt 2>&1
EXIT_CODE=$?

# Log results
cat >> .agent-workspace/foreman-agent/gate-validation-log.md <<EOF
**Command**: \`[gate-command]\`
**Working Directory**: \`$(pwd)\`
**Exit Code**: \`$EXIT_CODE\`
**Status**: $([ $EXIT_CODE -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")

**Output** (last 20 lines):
\`\`\`
$(tail -20 /tmp/gate-output.txt)
\`\`\`

EOF

# If FAIL → HALT
if [ $EXIT_CODE -ne 0 ]; then
  echo "" >> .agent-workspace/foreman-agent/gate-validation-log.md
  echo "**⚠️ GATE FAILED — HALTING HANDOVER**" >> .agent-workspace/foreman-agent/gate-validation-log.md
  echo "" >> .agent-workspace/foreman-agent/gate-validation-log.md
  
  echo "❌ Gate '$GATE_NAME' FAILED with exit code $EXIT_CODE"
  echo "Review error log: .agent-workspace/foreman-agent/gate-validation-log.md"
  echo "Apply Stop-and-Fix before proceeding"
  exit 1
fi

echo "✅ Gate '$GATE_NAME' PASSED"
```

**Example Gates to Validate**:

1. **Lint Gate**:
   ```bash
   cd apps/mat-frontend && npm run lint
   ```

2. **Build Gate**:
   ```bash
   cd apps/mat-frontend && npm run build
   ```

3. **Test Gate**:
   ```bash
   npm test
   ```

4. **Deployment Gate (Vercel)**:
   ```bash
   # Option 1: Use Vercel CLI (if available)
   cd apps/mat-frontend && vercel build --prod
   
   # Option 2: Validate vercel.json syntax
   cat vercel.json | jq . > /dev/null
   
   # Option 3: Check for known patterns (named capture groups, etc.)
   grep -E '\(\?<[^>]+>' vercel.json && echo "❌ Named capture groups not supported" || echo "✅ No named capture groups"
   ```

5. **YAML Validation Gate**:
   ```bash
   yamllint .github/workflows/*.yml
   ```

---

#### Step 4: Apply Stop-and-Fix (If Any Gate Fails)

**When**: Immediately upon ANY gate showing exit code != 0

**Actions**:

1. **HALT handover process**:
   ```bash
   # DO NOT run report_progress
   # DO NOT commit/push
   # DO NOT proceed with work
   ```

2. **Analyze failure**:
   ```bash
   # Review gate output in validation log
   cat .agent-workspace/foreman-agent/gate-validation-log.md | tail -50
   
   # Identify root cause
   # Document in RCA if needed
   ```

3. **Fix the issue**:
   ```bash
   # Make necessary code/config changes
   # Document what was fixed
   ```

4. **Re-run ALL gates** (not just the failed one):
   ```bash
   # Start from Step 3 again
   # Run EVERY gate, even ones that passed before
   # Ensure fixes didn't break anything
   ```

5. **Document fix iterations**:
   ```bash
   cat >> .agent-workspace/foreman-agent/gate-validation-log.md <<EOF
   
**Fix Applied**: [description of fix]
**Re-validation**: Running ALL gates again...

EOF
   ```

6. **Only proceed when ALL gates show exit code 0**

---

#### Step 5: Document in PREHANDOVER_PROOF

**When**: AFTER all gates pass, BEFORE report_progress

**Actions**:

```bash
# Create or append to PREHANDOVER_PROOF
cat >> PREHANDOVER_PROOF_[TASK_NAME].md <<EOF

## Gate Validation Evidence

**Pre-Handover Gate Validation**: COMPLETE  
**Timestamp**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")  
**Internal Log**: .agent-workspace/foreman-agent/gate-validation-log.md

### Gates Validated

$(cat .agent-workspace/foreman-agent/gate-validation-log.md | grep "^## " | grep "✅ PASS")

### Summary

- **Total Gates**: [N]
- **Pass**: [N]
- **Fail**: 0
- **Status**: ✅ ALL GATES GREEN

**Authority**: MERGE_GATE_PHILOSOPHY.md v2.0.0 "Pre-Handover Gate Duplication Mandate"

---

EOF
```

**This enables CI to skip re-execution** (evidence-based validation)

---

#### Step 6: Handover (Only When 100% GREEN)

**When**: ONLY after Steps 1-5 complete and ALL gates show exit code 0

**Actions**:

```bash
# Final checklist
echo "=== PRE-HANDOVER CHECKLIST ==="
echo "[ ] All applicable gates identified"
echo "[ ] All gates executed locally"
echo "[ ] All gates show exit code 0"
echo "[ ] Gate validation log complete"
echo "[ ] PREHANDOVER_PROOF includes gate evidence"
echo "[ ] No failing gates"
echo "[ ] Ready to hand over"
echo ""
echo "If ALL boxes checked → Proceed with report_progress"
echo "If ANY box unchecked → DO NOT PROCEED"

# Only now: run report_progress
# This commits, pushes, updates PR
```

---

### Example: Complete Gate Validation Session

**Scenario**: Changed vercel.json

**Step-by-Step Execution**:

```bash
# Step 1: Initialize
mkdir -p .agent-workspace/foreman-agent
echo "# Gate Validation Log — $(date)" > .agent-workspace/foreman-agent/gate-validation-log.md

# Step 2: Enumerate gates
echo "Changed files: vercel.json" >> .agent-workspace/foreman-agent/gate-validation-log.md
echo "Applicable workflows: deploy-mat-vercel.yml" >> .agent-workspace/foreman-agent/gate-validation-log.md

# Step 3: Execute gates
# Gate 1: vercel.json syntax
echo "## vercel.json Syntax Validation" >> .agent-workspace/foreman-agent/gate-validation-log.md
cat vercel.json | jq . > /dev/null
EXIT_CODE=$?
echo "Exit code: $EXIT_CODE" >> .agent-workspace/foreman-agent/gate-validation-log.md
[ $EXIT_CODE -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL - HALTING"

# Gate 2: Build (vercel deployment needs build)
echo "## Build Validation" >> .agent-workspace/foreman-agent/gate-validation-log.md
cd apps/mat-frontend && npm run build
EXIT_CODE=$?
echo "Exit code: $EXIT_CODE" >> .agent-workspace/foreman-agent/gate-validation-log.md
[ $EXIT_CODE -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL - HALTING"

# Gate 3: Lint
echo "## Lint Validation" >> .agent-workspace/foreman-agent/gate-validation-log.md
cd apps/mat-frontend && npm run lint
EXIT_CODE=$?
echo "Exit code: $EXIT_CODE" >> .agent-workspace/foreman-agent/gate-validation-log.md
[ $EXIT_CODE -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL - HALTING"

# Step 4: (Skip if all passed, or apply Stop-and-Fix if any failed)

# Step 5: Document in PREHANDOVER_PROOF
cat >> PREHANDOVER_PROOF_VERCEL_FIX.md <<EOF
## Gate Validation Evidence
- vercel.json syntax: ✅ PASS (exit 0)
- Build: ✅ PASS (exit 0)
- Lint: ✅ PASS (exit 0)

All gates GREEN. Ready to deploy.
EOF

# Step 6: Handover
# Now safe to run report_progress
```

---

### Integration with Session Workflow

**Updated Session Workflow**:

```markdown
1. Wake-up protocol
2. Load session memories
3. Review task
4. **[NEW] Initialize gate validation log**
5. Execute POLC workflow (Planning, Organizing, Leading, Checking)
6. **[NEW] Enumerate ALL applicable gates**
7. **[NEW] Execute ALL gates locally**
8. **[NEW] Apply Stop-and-Fix if any fail**
9. **[NEW] Document gates in PREHANDOVER_PROOF**
10. **[NEW] Final checklist (all gates GREEN?)**
11. Create session memory
12. **ONLY IF ALL GATES GREEN**: Run report_progress
```

---

### Anti-Patterns (What NOT to Do)

❌ **Assume gate will pass**:
```bash
# WRONG
# "vercel.json looks fine, no need to test"
# Result: Deployment fails in CI
```

✅ **Validate gate explicitly**:
```bash
# RIGHT
cat vercel.json | jq . > /dev/null
echo "vercel.json syntax: exit $?"
# Result: Know status before handover
```

---

❌ **Skip gate due to complexity**:
```bash
# WRONG
# "Vercel deployment is too complex to test locally, CI will validate"
# Result: Three consecutive failures
```

✅ **Find way to validate or escalate**:
```bash
# RIGHT
# Option 1: Use Vercel CLI
vercel build --prod

# Option 2: Validate configuration
cat vercel.json | jq .

# Option 3: Check known patterns
grep -E 'pattern-to-avoid' vercel.json

# Option 4: If truly cannot validate → ESCALATE, don't skip
```

---

❌ **Mental validation instead of execution**:
```bash
# WRONG
# "I reviewed the code, it should pass lint"
# Result: No proof, might be wrong
```

✅ **Execute actual commands**:
```bash
# RIGHT
npm run lint > /tmp/lint.txt 2>&1
EXIT_CODE=$?
cat /tmp/lint.txt | tail -20
echo "Lint exit code: $EXIT_CODE"
# Result: Actual proof, no assumptions
```

---

### Success Criteria

**This pattern is successful when**:

- ✅ Zero failed gates at handover
- ✅ CI confirmatory (not diagnostic)
- ✅ Evidence-based validation enables CI to skip re-execution
- ✅ Internal error log provides audit trail
- ✅ PREHANDOVER_PROOF contains complete gate evidence
- ✅ No surprises in CI (agent already knows all results)

---

### Metrics to Track

- **Gate Validation Rate**: % of sessions that validate ALL applicable gates
- **Gate Failure Rate**: % of gates that fail during pre-handover validation
- **CI Re-execution Rate**: % of gates that CI must re-run (vs evidence-based skip)
- **Handover Failure Rate**: % of handovers that result in failed CI gates

**Target**:
- Gate Validation Rate: 100%
- Handover Failure Rate: 0%

---

## Authority

- **MERGE_GATE_PHILOSOPHY.md** v2.0.0
- **CS2 Direct Order** (2026-02-19)
- **Experience**: Three gate failures taught this lesson

---

**Pattern Status**: MANDATORY  
**Compliance**: CONSTITUTIONAL  
**Last Reviewed**: 2026-02-19

---

**END OF OPERATIONAL PATTERN**
