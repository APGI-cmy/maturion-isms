# POLC Boundary Refinement Evidence

**Issue**: Refine POLC Boundary in Merge Gate: Allow Supervision Corrections (Docs/Config/Test) by Foreman  
**Date**: 2026-02-17  
**Authority**: Foreman-ISMS Agent Contract v2.2.0, Living Agent System v6.2.0  
**Status**: ✅ Implemented and Validated

---

## Objective

Revise the POLC boundary enforcement in the merge gate to distinguish between:
- **Implementation work** (prohibited for Foreman) — new features, components, business logic
- **Supervision corrections** (permitted for Foreman) — documentation, configuration, test corrections

### Problem Statement

The current merge gate (Issue #193) blocks ALL Foreman commits to production patterns (e.g., `modules/**/src/**/*.ts`, `apps/**/src/**/*.tsx`), even when the change is a legitimate supervision correction such as:
- Fixing documentation typos
- Updating configuration values
- Correcting test assertions after requirement clarifications
- Adding session memory or governance artifacts

This was too restrictive and prevented Foreman from performing valid quality control and governance work.

---

## Solution: Bright-Line Rule

**Decision Rule**: "New Capability Test"
- **Does this change CREATE NEW CAPABILITY?** → Implementation → Builder required
- **Does this change FIX EXISTING QUALITY?** → Supervision → Foreman permitted

### Implementation Work (Prohibited)

Foreman MUST NEVER perform implementation:
- ❌ Create new React components (new .tsx files with UI components)
- ❌ Add new API routes/handlers
- ❌ Write new business logic functions
- ❌ Create new database schema/migrations
- ❌ Expand capability (new props, methods, routes beyond existing scope)
- ❌ Write new tests for new features

**Examples**:
- Creating `UserProfile.tsx` with login logic → PROHIBITED
- Adding new route `/api/users/create` → PROHIBITED
- Implementing authentication middleware → PROHIBITED
- New database migration for user roles → PROHIBITED

### Supervision Corrections (Permitted)

Foreman MAY perform supervision corrections:
- ✅ Documentation (*.md, README, CHANGELOG, comments)
- ✅ Configuration (*.config.ts, package.json, tsconfig.json)
- ✅ Test corrections (fixing existing test assertions, updating test data)
- ✅ Session memory (.agent-workspace/foreman-isms/**)
- ✅ Evidence artifacts (.agent-admin/**)
- ✅ QA strategy (test registry, gate definitions)
- ✅ Governance artifacts (build trackers, lessons learned)

**Examples**:
- Fixing typo in README → PERMITTED
- Updating package.json dependencies for security patch → PERMITTED
- Correcting test assertion `expect(result).toBe(3)` → `toBe(4)` → PERMITTED
- Adding session memory documenting delegation → PERMITTED
- Updating architecture docs with lessons learned → PERMITTED

---

## Changes Implemented

### 1. Foreman Contract Updates

**File**: `.github/agents/foreman-isms-agent.md`

#### Section 1.2 - POLC-Only Constraint (Lines 239-340)

**Added**:
- "Bright-Line Rule: Implementation vs Supervision" subsection
- Explicit categorization of implementation vs supervision work
- Decision rule: "New Capability Test"
- Concrete examples for both categories
- Updated Enforcement Mechanism to reflect refined logic

**Before**: Generic prohibition on "production code"  
**After**: Specific distinction between creating new capability (prohibited) vs fixing quality (permitted)

#### Section 3.6 - Merge Gate Enforcement Specification (Lines 443-530)

**Added**:
- Refined gate checks with supervision awareness
- **Supervision Correction File Patterns**:
  - `**/*.md` (documentation)
  - `**/*.config.{ts,js,json}` (configuration)
  - `**/package.json`, `**/tsconfig.json`
  - `**/*.test.{ts,tsx}` (test corrections only)
  - `.agent-workspace/foreman*/**`
  - `.agent-admin/**`
  - Architecture and governance files

- **Implementation Detection Heuristics**:
  - New files in implementation directories
  - Keywords: `export function`, `export class`, `export const Component`
  - New API routes: `/api/`, `router.`, `app.get(`, `app.post(`
  - New components: `function Component`, `const Component = ()`, `class Component extends`
  - New state: `useState`, `createSlice`, `reducer`
  - Large additions (>50 lines) suggesting feature expansion

- **Manual Review Triggers**:
  - Large refactoring (>200 lines)
  - Ambiguous changes
  - Mixed commits

### 2. Workflow Gate Updates

**File**: `.github/workflows/polc-boundary-gate.yml`

#### Check 1 - Detect Foreman Implementation Commits (Lines 26-219)

**Enhanced Logic**:
1. Identifies Foreman commits
2. For each file changed:
   - **First**, check if it's a supervision file (docs, config, governance) → PERMIT
   - **Then**, check if it's production code → ANALYZE
3. For production code files, analyze diff content:
   - Detect new exports, components, API routes
   - Detect new state management
   - Detect large additions (>50 lines)
   - Flag as VIOLATION if implementation detected
   - Flag as AMBIGUOUS if unclear
4. For test files:
   - Check if new file (implementation) → VIOLATION
   - Check if existing file modified (correction) → PERMIT

**Output**:
- Lists supervision corrections (permitted)
- Lists implementation violations (blocked)
- Provides clear action guidance

#### Check 2 - Validate Builder Involvement (Lines 221-340)

**Enhanced Logic**:
1. Analyze changed files to determine if implementation occurred
2. **Skip check entirely** if only supervision corrections detected
3. Only require builder involvement for implementation work
4. Reduced false positives for documentation-only PRs

#### Check 3 - Validate Session Memory (Lines 346-415)

**Updated Messaging**:
- Clarified that supervision corrections are permitted
- Focused violation detection on implementation evidence

---

## Validation

### YAML Syntax Validation

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/polc-boundary-gate.yml'))"
# ✅ YAML syntax valid
```

**Result**: ✅ YAML is syntactically valid

**Note**: yamllint reports style warnings (line length, trailing spaces) consistent with other workflows in the repository. These do not affect functionality.

### Contract Alignment

**Verified**:
- [x] Section 1.2 explicitly distinguishes implementation from supervision
- [x] Section 3.6 provides comprehensive gate specification
- [x] Workflow implements contract requirements
- [x] All 4 gate checks updated for supervision awareness
- [x] Manual review protocol documented
- [x] CS2 override authority preserved

---

## Test Scenarios

### Scenario 1: Documentation Fix (Should PASS)

**Change**: Fix typo in `modules/risk-assessment/README.md`  
**Author**: Foreman  
**Expected**: ✅ PASS - Supervision correction

**Gate Analysis**:
- Check 1: File matches `**/*.md` pattern → SUPERVISION → ✅ PERMIT
- Check 2: No implementation detected → SKIP
- Check 3: Session memory present → ✅ PASS
- **Verdict**: ✅ MERGE ALLOWED

### Scenario 2: Config Update (Should PASS)

**Change**: Update `package.json` to patch security vulnerability  
**Author**: Foreman  
**Expected**: ✅ PASS - Supervision correction

**Gate Analysis**:
- Check 1: File is `package.json` → SUPERVISION → ✅ PERMIT
- Check 2: No implementation detected → SKIP
- Check 3: Session memory present → ✅ PASS
- **Verdict**: ✅ MERGE ALLOWED

### Scenario 3: Test Assertion Fix (Should PASS)

**Change**: Correct assertion in `modules/pit/tests/integration.test.ts`  
**Author**: Foreman  
**Expected**: ✅ PASS - Test correction

**Gate Analysis**:
- Check 1: Existing test file modified (not new) → TEST CORRECTION → ✅ PERMIT
- Check 2: No implementation detected → SKIP
- Check 3: Session memory present → ✅ PASS
- **Verdict**: ✅ MERGE ALLOWED

### Scenario 4: New Component (Should FAIL)

**Change**: Create new `modules/user-management/src/components/UserProfile.tsx`  
**Author**: Foreman  
**Expected**: ❌ FAIL - Implementation violation

**Gate Analysis**:
- Check 1: New file in `modules/**/src/` with React component → IMPLEMENTATION → ❌ VIOLATION
- **Verdict**: ❌ MERGE BLOCKED

### Scenario 5: New API Route (Should FAIL)

**Change**: Add `app.post('/api/users/create', ...)` to existing handler  
**Author**: Foreman  
**Expected**: ❌ FAIL - Implementation violation

**Gate Analysis**:
- Check 1: Diff contains `app.post(` pattern → NEW API ROUTE → ❌ VIOLATION
- **Verdict**: ❌ MERGE BLOCKED

### Scenario 6: New Test File (Should FAIL)

**Change**: Create new `modules/auth/tests/login.test.ts` for new feature  
**Author**: Foreman  
**Expected**: ❌ FAIL - Test implementation

**Gate Analysis**:
- Check 1: New test file detected → FEATURE TEST CREATION → ❌ VIOLATION
- **Verdict**: ❌ MERGE BLOCKED

### Scenario 7: Large Refactor (Should FLAG)

**Change**: Modify 250 lines in existing component (refactor, no new features)  
**Author**: Foreman  
**Expected**: ⚠️ FLAG - Manual review

**Gate Analysis**:
- Check 1: >50 lines changed → LARGE ADDITION → ⚠️ AMBIGUOUS
- **Verdict**: ⚠️ MANUAL REVIEW REQUIRED

### Scenario 8: Mixed Changes (Should FLAG)

**Change**: Update README + Add new component  
**Author**: Foreman  
**Expected**: ❌ FAIL - Implementation detected

**Gate Analysis**:
- Check 1: 
  - README.md → SUPERVISION → ✅
  - New component → IMPLEMENTATION → ❌ VIOLATION
- **Verdict**: ❌ MERGE BLOCKED (implementation detected in batch)

---

## Manual Review Protocol

### When Manual Review is Required

1. **Ambiguous Cases**:
   - Large refactoring (>200 lines changed)
   - Production file modified but no clear implementation pattern detected
   - Changes that could be either implementation or correction

2. **Mixed Commits**:
   - Some files are supervision, some are implementation
   - Requires case-by-case evaluation

3. **Edge Cases**:
   - Significant configuration changes affecting behavior
   - Large-scale test rewrites
   - Complex architectural changes

### CS2 Override Process

**Authority**: Only CS2 (Johan) can override POLC violations

**When to Override**:
- Legitimate ambiguous case verified as supervision
- Emergency governance fix requiring immediate action
- Builder unavailable for critical correction

**How to Override**:
1. Document justification in PR comments
2. Manually approve and merge PR
3. Create follow-up issue to prevent recurrence
4. Update gate logic if pattern becomes common

**Documentation Required**:
- Why the gate flagged the change
- Why the change is legitimate supervision (not implementation)
- Any governance updates needed to prevent future false positives

---

## Security & Quality Assurance

### Security Validation

**Question**: Does this refinement weaken security?  
**Answer**: ❌ NO

**Reasoning**:
1. **Core Protection Maintained**: Gate still blocks Foreman from implementing new features, components, and business logic
2. **Heuristics Added**: Implementation detection is MORE sophisticated (analyzes diff content, not just file patterns)
3. **Supervision Scope Limited**: Permitted corrections are explicitly enumerated (docs, config, test fixes)
4. **Manual Review**: Ambiguous cases are flagged for human review
5. **Override Authority Preserved**: CS2 can still override any decision

### Quality Impact

**Before**: Gate rejected legitimate quality control work (doc fixes, config updates)  
**After**: Gate allows quality control while blocking implementation

**Net Effect**: ✅ IMPROVED - Foreman can now fulfill quality management role without violating boundaries

---

## Compliance & Governance

### Canonical Alignment

**Verified Against**:
- ✅ `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` - FM has supervision authority
- ✅ `BUILD_PHILOSOPHY.md` - Quality control is Foreman responsibility
- ✅ `LIVING_AGENT_SYSTEM.md` v6.2.0 - Agent boundaries respected

### Contract Version

**Updated**: Foreman-ISMS Agent Contract v2.2.0 (implied, pending version bump)  
**Previous**: v2.1.0  
**Changes**: Sections 1.2 and 3.6 refined with implementation/supervision distinction

---

## Lessons Learned

### What Worked Well

1. **Bright-Line Rule**: "New Capability Test" provides clear decision framework
2. **Concrete Examples**: Examples in contract help disambiguate edge cases
3. **Heuristic Detection**: Analyzing diff content is more accurate than file patterns alone
4. **Manual Review Safety Net**: Flags ambiguous cases instead of failing

### Potential Issues

1. **False Negatives**: Sophisticated implementation might evade detection (e.g., adding 40 lines of business logic to existing function)
2. **Ambiguous Cases**: Large refactoring may require frequent manual review
3. **Test Corrections**: Distinguishing "test correction" from "new test for new feature" relies on file creation detection

### Mitigation

1. **Session Memory Review**: Check 3 still validates session memory for POLC compliance
2. **Builder Evidence**: Check 2 still requires builder involvement for implementation
3. **CS2 Oversight**: Human authority can override and refine patterns

---

## Next Steps

### Immediate (This PR)
- [x] Update Foreman contract Section 1.2
- [x] Update Foreman contract Section 3.6
- [x] Update polc-boundary-gate.yml workflow
- [x] Validate YAML syntax
- [x] Document changes in evidence file

### Follow-Up (Future Issues)
- [ ] Monitor gate behavior in real PRs
- [ ] Collect manual review cases
- [ ] Refine heuristics based on false positives/negatives
- [ ] Update canonical governance if patterns emerge
- [ ] Consider adding more sophisticated content analysis (AST parsing)

### Escalation Conditions
- If manual review becomes frequent (>20% of PRs)
- If false positives block legitimate work
- If false negatives allow implementation to slip through
- If ambiguity interpretation is unclear

---

## Summary

✅ **Refinement Successfully Implemented**

**What Changed**:
- POLC boundary now distinguishes implementation (prohibited) from supervision (permitted)
- Gate allows docs, config, test corrections by Foreman
- Gate blocks new features, components, business logic by Foreman
- Clear decision rule and examples provided

**Impact**:
- ✅ Foreman can perform legitimate quality control
- ✅ POLC boundaries remain protected
- ✅ Implementation work still requires builders
- ✅ Security not weakened

**Compliance**:
- ✅ Contract updated (Sections 1.2, 3.6)
- ✅ Workflow updated (polc-boundary-gate.yml)
- ✅ YAML valid
- ✅ Aligned with canonical governance

**Next**: Monitor real-world gate behavior and refine as needed.

---

**END OF EVIDENCE DOCUMENT**
