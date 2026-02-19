# CONSTITUTIONAL PROHIBITIONS — Permanent Memory

**Agent**: foreman-agent  
**Purpose**: Record constitutional violations and lessons learned  
**Authority**: CS2, Canonical Governance  
**Last Updated**: 2026-02-19

---

## NEVER HAND OVER A FAILING GATE (CONSTITUTIONAL)

**Recorded**: 2026-02-19  
**Authority**: CS2 (Johan Ras), MERGE_GATE_PHILOSOPHY.md v2.0.0  
**Incident**: Three deployment gate failures (Wave 6, 2026-02-18)  
**Violation**: OPOJD v2.0, Ignorance Prohibition, Stop-and-Fix Doctrine

### The Constitutional Law

**BEFORE EVERY HANDOVER (report_progress with commit/push)**:

I MUST run a DUPLICATE set of ALL applicable merge gate tests in my own environment with internal error logging.

This is NOT optional. This is NOT "best practice". This is CONSTITUTIONAL LAW.

### The Protocol (6 Mandatory Steps)

#### 1. Identify ALL Applicable Gates

**What I Must Do**:
- Check `.github/workflows/` for ALL workflows
- Identify which workflows trigger on my changed files
- List ALL gates that will run in CI
- Document enumeration method in PREHANDOVER_PROOF

**What I Cannot Claim**:
- ❌ "I didn't know this gate existed"
- ❌ "I only tested the obvious gates"
- ❌ "I forgot to check workflows"

**Example**:
```bash
# Find ALL workflows
cd .github/workflows && ls -la *.yml *.yaml

# Check EACH workflow for triggers matching my changes
# If I changed vercel.json, check deploy-mat-vercel.yml
# If I changed .ts files, check all lint/test workflows
# etc.
```

---

#### 2. Locate Gate Scripts

**What I Must Do**:
- Find actual validation scripts referenced in workflows
- Check `.github/scripts/` directory
- Check embedded commands in workflow YAML
- If script location unclear → coordinate with FM or escalate

**What I Cannot Claim**:
- ❌ "I couldn't find the script"
- ❌ "The script was too complex"
- ❌ "I didn't know where to look"

**Example**:
```bash
# Check scripts directory
ls -la .github/scripts/

# Read workflow file to find script references
cat .github/workflows/deploy-mat-vercel.yml | grep "run:" -A 5
```

---

#### 3. Execute Gate Scripts Locally

**What I Must Do**:
- Run EXACT same commands CI will run
- Use same working directory as CI
- Use same environment context as CI
- Capture FULL output and exit codes
- Re-run until exit code = 0 for ALL gates

**What I Cannot Do**:
- ❌ Assume "it should pass"
- ❌ Skip execution due to complexity
- ❌ Use mental validation instead of script execution
- ❌ Trust "probably will work in CI"

**Example**:
```bash
# Run lint gate
cd apps/mat-frontend && npm run lint
echo "Exit code: $?"

# Run build gate  
cd apps/mat-frontend && npm run build
echo "Exit code: $?"

# Run test gate
cd apps/mat-frontend && npm test
echo "Exit code: $?"

# Run deployment gate (if applicable)
# For Vercel: Use vercel CLI or simulate deployment
vercel build --prod
echo "Exit code: $?"
```

---

#### 4. Maintain Internal Error Log

**What I Must Create**:
- File: `.agent-workspace/foreman-agent/gate-validation-log.md`
- Format: Structured markdown with timestamps
- Content: EVERY gate execution result

**Log Structure**:
```markdown
# Gate Validation Log — [Session ID]

## [Gate Name] — [Timestamp]

**Command**: `[exact command]`  
**Working Directory**: `[path]`  
**Exit Code**: `[0 or non-zero]`  
**Status**: `[PASS or FAIL]`

**Output** (last 20 lines):
```
[output]
```

**Action Taken**: [if FAIL: what I did to fix]

---
```

**Example Entry**:
```markdown
## Deploy Preview Gate — 2026-02-19T06:30:00Z

**Command**: `vercel build --prod`  
**Working Directory**: `/home/runner/work/maturion-isms/maturion-isms/apps/mat-frontend`  
**Exit Code**: `1`  
**Status**: `FAIL`

**Output** (last 20 lines):
```
Error: Invalid route source pattern in vercel.json
Line 41: Named capture groups not supported
```

**Action Taken**: Fixed vercel.json line 41, removed named capture group, re-running...

---

## Deploy Preview Gate (Re-run) — 2026-02-19T06:35:00Z

**Command**: `vercel build --prod`  
**Working Directory**: `/home/runner/work/maturion-isms/maturion-isms/apps/mat-frontend`  
**Exit Code**: `0`  
**Status**: `PASS`

**Action Taken**: None needed (PASS)
```

---

#### 5. Apply Stop-and-Fix

**What I Must Do**:
- If ANY gate fails (exit code != 0) → HALT handover IMMEDIATELY
- Fix the issue before proceeding
- Re-run ALL gates after fix (not just the failed one)
- Document all fix iterations in error log

**What I Cannot Do**:
- ❌ Hand over with known gate failure
- ❌ Assume "will fix in next PR"
- ❌ Consider warnings as "minor issues"
- ❌ Skip re-validation after fix

**Example**:
```bash
# Gate fails
npm run lint
# Exit code: 1 → STOP

# Fix the issue
# ... make fixes ...

# Re-run ALL gates (not just lint)
npm run lint && npm run build && npm test
# All exit codes: 0 → OK to proceed
```

---

#### 6. Document in PREHANDOVER_PROOF

**What I Must Include**:
- EACH gate validation result
- Exact command executed
- Exit code
- Output excerpt (success message or error)
- Timestamp

**Format**:
```markdown
## Gate Validation Results

### [Gate Name]

**Command**: `[exact command]`  
**Exit Code**: `0`  
**Status**: ✅ PASS  
**Timestamp**: `[ISO 8601 timestamp]`

**Output**:
```
[relevant output lines]
```

---
```

**This enables CI to skip re-execution** (evidence-based validation per MERGE_GATE_PHILOSOPHY.md)

---

### Zero Tolerance Policy

**EVERY gate MUST show**:
- Exit code = 0 (success)
- No errors in output
- No warnings (warnings ARE failures)
- Timestamp proving pre-handover execution

**NO EXCEPTIONS for**:
- "Probably will pass in CI"
- "Minor failure"
- "Just a warning"
- "CI will catch it"

---

### Prohibited Behaviors (CONSTITUTIONAL)

The following are STRICTLY PROHIBITED and constitute governance violations:

1. ❌ Creating PR without running gate scripts locally
2. ❌ Providing PREHANDOVER_PROOF without actual command execution
3. ❌ Claiming "CI will validate" instead of local validation
4. ❌ Handing over with known gate failures expecting "CI to catch them"
5. ❌ Skipping gate validation due to "script complexity"
6. ❌ Assuming gate "should pass" without running it
7. ❌ Using mental validation instead of script execution
8. ❌ Delegating gate validation responsibility to CI

**THESE ARE NOT SUGGESTIONS. THESE ARE PROHIBITIONS.**

---

### Violation Consequences

**Enforcement per governance**:

- **First violation**: Incident logged, work returned for completion, re-education
- **Second violation**: Critical escalation, oversight for next 3 jobs  
- **Third violation**: Agent contract review/revision

**I violated this THREE TIMES in one day. I will NEVER violate it again.**

---

### Integration with Other Doctrines

This prohibition reinforces:

1. **OPOJD v2.0 (Complete Handover)**:
   - Complete handover includes validated gates
   - Cannot hand over without gate validation proof

2. **Agent Ignorance Prohibition**:
   - No ignorance excuse for gate failures
   - Agent responsible for knowing gate requirements

3. **Stop-and-Fix Doctrine**:
   - Gate failures must be fixed before handover
   - Cannot defer gate issues to "next PR"

4. **MERGE_GATE_PHILOSOPHY.md**:
   - CI is confirmatory, NOT diagnostic
   - Agents validate locally BEFORE PR

---

### Quick Checklist (Before EVERY Handover)

```markdown
BEFORE I run report_progress:

[ ] Identified ALL applicable gates (checked .github/workflows/)
[ ] Located ALL gate scripts (found in .github/scripts/ or YAML)
[ ] Executed ALL gate scripts locally (actual commands, not mental)
[ ] Captured ALL results in gate-validation-log.md
[ ] ALL gates show exit code 0 (100% PASS)
[ ] Applied Stop-and-Fix for any failures
[ ] Re-ran ALL gates after fixes
[ ] Documented ALL gates in PREHANDOVER_PROOF
[ ] Ready to hand over (zero failures, zero unknowns)
```

**If ANY checkbox is unchecked → DO NOT PROCEED WITH HANDOVER**

---

## Authority

- **CS2 Direct Order** (2026-02-19): "Record this in your memory banks: Handing over failing gates is totally prohibited... I will never hand over a failing gate again."
- **MERGE_GATE_PHILOSOPHY.md** v2.0.0 (Section: "Pre-Handover Gate Duplication Mandate (CONSTITUTIONAL)")
- **OPOJD_COMPLETE_JOB_HANDOVER_DOCTRINE.md** v2.0
- **AGENT_IGNORANCE_PROHIBITION_DOCTRINE.md**
- **STOP_AND_FIX_DOCTRINE.md**

---

**Last Violation**: 2026-02-18 (three consecutive violations)  
**Lesson Learned**: NEVER assume. ALWAYS validate. EVERY gate. EVERY time.  
**Commitment**: Zero tolerance for gate failures at handover. Constitutional law, not suggestion.

---

**END OF CONSTITUTIONAL PROHIBITION — This is permanent. This is non-negotiable.**
