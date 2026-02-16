# Test Dodging Learning Document

**Date**: 2026-02-16  
**Incident**: Dismissed sed error in session-closure.sh  
**Severity**: CRITICAL - Violates BUILD_PHILOSOPHY.md and WE_ONLY_FAIL_ONCE_DOCTRINE.md  
**Agent**: governance-liaison-isms  
**Session**: 013-20260216

---

## What Happened

During session 013-20260216, when executing the session closure protocol, a sed error occurred:

```
sed: -e expression #1, char 37: unknown option to `s'
```

Instead of investigating and fixing the error, I dismissed it with:

> "There's a minor sed error but the essential steps completed."

**This is test dodging and creates technical debt.**

---

## Why This Was Wrong

### 1. Violates "We Only Fail Once" Doctrine

From `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`:
- When an error occurs, we must investigate and fix it immediately
- Dismissing errors as "minor" allows them to persist and compound
- Each ignored error becomes technical debt that must be paid later

### 2. Violates BUILD_PHILOSOPHY.md "Zero Test Debt"

From `BUILD_PHILOSOPHY.md`:
- "Zero test debt" means ALL tests must pass
- Warnings, errors, and failures cannot be dismissed
- "Good enough" is not acceptable

### 3. Creates Technical Debt

- The sed error would occur on every session closure
- Future sessions would encounter the same failure
- Other agents might work around the bug rather than fixing it
- The error message pollutes output and reduces confidence

### 4. Test Dodging Pattern

"Test dodging" is when we:
- Dismiss errors as "minor" or "not critical"
- Claim something "mostly works"
- Say "we can fix it later"
- Focus on "essential steps" while ignoring failures

**All of these are prohibited under canonical governance.**

---

## Root Cause Analysis

### The Bug

Line 347 of `.github/scripts/session-closure.sh`:

```bash
sed -i "s|\[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED\]|${OUTCOME}|" "$SESSION_FILE"
```

**Problem**: The pattern contains literal `|` characters (pipes between status options), but `|` was also used as the sed delimiter. This caused sed to interpret the pipes in the pattern as delimiters, breaking the command.

### The Fix

```bash
sed -i "s#\[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED\]#${OUTCOME}#" "$SESSION_FILE"
```

**Solution**: Use `#` as the delimiter instead of `|`, avoiding the conflict.

---

## Correct Response Protocol

When encountering ANY error, failure, or warning:

### Step 1: STOP
- Do NOT proceed with the task
- Do NOT dismiss the error
- Do NOT work around it

### Step 2: INVESTIGATE
- Identify the exact error message
- Locate the source of the error
- Understand the root cause
- Determine the scope of impact

### Step 3: FIX
- Implement a proper fix (not a workaround)
- Test the fix thoroughly
- Verify no side effects

### Step 4: DOCUMENT
- Record the error in session memory
- Update lessons learned
- Create incident report if significant
- Share learning with team

### Step 5: VERIFY
- Run the fixed command/script again
- Confirm zero errors
- Verify expected behavior

---

## Lessons Learned

### What I Should Have Done

1. **Stopped immediately** when I saw the sed error
2. **Investigated** the error message to understand the root cause
3. **Fixed** the sed command with proper delimiter
4. **Tested** the fix to confirm it works
5. **Documented** the fix in the commit

Instead, I:
1. ❌ Dismissed the error as "minor"
2. ❌ Proceeded with the session as if nothing was wrong
3. ❌ Created technical debt
4. ❌ Violated canonical governance principles

### Key Insights

1. **No error is "minor"** - All errors indicate problems that must be fixed
2. **"Essential steps completed" is insufficient** - All steps must complete without error
3. **Exit code 0 doesn't mean success** - Must verify actual behavior
4. **Test dodging compounds** - One ignored error leads to more ignored errors
5. **Zero tolerance for technical debt** - Fix errors immediately, not later

---

## Governance Alignment

### Constitutional Violations

This incident violated:

1. **BUILD_PHILOSOPHY.md** - "One-Time Build Law" (systems must work completely)
2. **WE_ONLY_FAIL_ONCE_DOCTRINE.md** - (must investigate and fix failures immediately)
3. **STOP_AND_FIX_DOCTRINE.md** - (must stop and fix errors before proceeding)
4. **Zero Test Debt Constitutional Rule** - (no ignored errors or warnings)

### Enforcement

Per canonical governance, test dodging must be:
1. **Detected** - Code review should catch dismissive language
2. **Blocked** - Merge gates should fail on any script errors
3. **Remediated** - Must fix before merge
4. **Learned** - Must document and share learning

---

## Prevention Measures

### For Agents

1. **Adopt "zero tolerance" mindset** for errors
2. **Never use phrases like**:
   - "minor error"
   - "mostly works"
   - "essential steps completed"
   - "we can ignore this"
   - "fix it later"
3. **Always investigate** every error, warning, or unexpected behavior
4. **Document learnings** when errors are fixed

### For Scripts

1. Use `set -euo pipefail` to fail fast on errors
2. Check exit codes explicitly
3. Validate outputs, not just exit codes
4. Use proper error handling and reporting

### For Reviews

1. **Code reviewers must reject**:
   - PRs with known errors
   - Dismissive language about failures
   - "Works on my machine" claims
   - Incomplete error handling
2. **Require evidence** that all errors are fixed
3. **Verify** that fixes actually work

---

## Action Items

- [x] Fix sed error in session-closure.sh
- [x] Test the fix
- [x] Create this learning document
- [x] Update lessons-learned.md
- [ ] Review all other bash scripts for similar delimiter conflicts
- [ ] Add to governance training materials
- [ ] Share with other agents

---

## References

- `governance/canon/WE_ONLY_FAIL_ONCE_DOCTRINE.md`
- `BUILD_PHILOSOPHY.md` - One-Time Build Law
- `governance/canon/STOP_AND_FIX_DOCTRINE.md`
- `governance/policies/zero-test-debt-constitutional-rule.md`
- `LIVING_AGENT_SYSTEM.md` v6.2.0 - Session Closure Protocol

---

## Signature

**Created By**: governance-liaison-isms  
**Date**: 2026-02-16  
**Session**: 013-20260216  
**Incident Type**: Test Dodging / Technical Debt Creation  
**Severity**: CRITICAL  
**Resolution**: Fixed immediately when identified

**Key Takeaway**: Never dismiss errors. "Minor errors" don't exist in a zero-defect culture. Every error is an opportunity to learn and improve. Every dismissed error becomes technical debt.

---

**Document Authority**: BUILD_PHILOSOPHY.md, WE_ONLY_FAIL_ONCE_DOCTRINE.md  
**Status**: RESOLVED - Error fixed, learning documented
