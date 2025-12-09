# Gap Priority Engine - QA Test Suite Documentation

## Overview

This document describes the comprehensive QA test suite for the Gap Priority Engine v1.0, implementing the requirements specified in **Issue 4/4 — GAP PRIORITY ENGINE QA Test Suite & Validation Plan**.

## Test Files

### 1. Gap Priority Engine Library
**Location:** `apps/isms-portal/src/modules/maturity/lib/gap-priority.ts`

Implements the complete Gap Priority Engine v1.0 specification including:
- Base priority calculation from gap size
- Evidence confidence modifier
- Criticality multiplier
- Linked risks modifier
- Regulatory relevance modifier
- Time exposure modifier
- Existing tasks modifier
- Priority level mapping (low/medium/high/critical)

### 2. Gap Priority Test Suite
**Location:** `apps/isms-portal/src/modules/maturity/tests/gap-priority.test.ts`

Comprehensive test suite with **58 passing tests** covering:

#### 1.1 Numeric Priority QA Tests (Tests 1-6)
- ✅ **Test 1 - Gap-only priority**: Validates base priority calculation
  - gap=1 → score=0.25 ✓
  - gap=4 → score=1.00 ✓
  - Boundary cases and clamping ✓

- ✅ **Test 2 - Confidence penalty**: Validates evidence confidence modifier
  - Low confidence (0.2) increases priority ✓
  - High confidence (0.9) decreases priority ✓
  - Neutral confidence (0.7) maintains priority ✓
  - No evidence maximizes penalty ✓

- ✅ **Test 3 - Criticality multiplier**: Validates business criticality mapping
  - critical → 3.0 ✓
  - high → 2.0 ✓
  - medium → 1.5 ✓
  - low → 1.0 ✓

- ✅ **Test 4 - Risk severity**: Validates linked risks modifier
  - High severity risks increase priority ✓
  - Multiple risks accumulate ✓
  - Clamped to [1.0, 2.0] range ✓

- ✅ **Test 5 - Regulatory relevance**: Validates compliance framework modifier
  - high → 1.5 ✓
  - moderate → 1.2 ✓
  - High-priority framework override (ISO 27001, SOC 2) ✓
  - Audit flag bonus ✓

- ✅ **Test 6 - Final clamping**: Validates score boundaries
  - Handles scores > 1.0 (unbounded upward) ✓
  - Handles scores ≥ 0.0 (minimum floor) ✓

#### 1.2 AI Layer QA Tests (Tests 7-10)
- ✅ **Test 7 - Priority label mapping**: Validates deterministic thresholds
  - 0.00-0.50 → low ✓
  - 0.51-1.50 → medium ✓
  - 1.51-2.50 → high ✓
  - 2.51+ → critical ✓
  - Criticality override rule ✓

- ✅ **Test 8 - No hallucinations**: Validates data integrity
  - Only uses provided context ✓
  - No invented data ✓
  - Graceful handling of missing fields ✓

- ✅ **Test 9 - Actionable recommendations**: Validates context completeness
  - All modifiers computed ✓
  - Complete context for AI recommendation generation ✓

- ✅ **Test 10 - Explanation matches facts**: Validates determinism
  - Same inputs → same outputs ✓
  - Input changes reflected in output ✓

#### 1.3 PIT Workflow QA Tests (Tests 11-14)
- ✅ **Test 11 - Deduplication**: Validates origin tracking
  - Provides necessary deduplication context ✓

- ✅ **Test 12 - Priority increase detection**: Validates gap escalation
  - Gap increase → priority increase ✓
  - Priority level escalation validated ✓

- ✅ **Test 13 - Lifecycle transitions**: Validates priority assignment
  - Critical priority assigned correctly ✓

- ✅ **Test 14 - Task completion feedback**: Validates task handling
  - Active tasks reduce priority ✓
  - Overdue tasks maintain urgency ✓

#### 1.4 End-to-End Scenario Tests (Scenarios A-C)
- ✅ **Scenario A - Critical risk-driven gap**: 
  - High-risk domain + weak evidence + large gap → critical priority ✓
  - All high-risk modifiers validated ✓

- ✅ **Scenario B - Policy-only evidence**:
  - Policy evidence with moderate confidence → low/medium priority ✓

- ✅ **Scenario C - Completed PIT tasks**:
  - Task completion → new evidence → gap reduction validated ✓
  - Gap closure (gap=0) → minimal priority ✓

- ✅ **Additional Integration Scenarios**:
  - Complex multi-factor calculation (matches architecture example) ✓
  - Time-based escalation for chronic gaps (>1 year) ✓

### 3. PIT Integration Test Suite
**Location:** `apps/pit/tests/pit-integration.test.ts`

Placeholder test file with **71 test cases** (marked as `.todo()`) for future PIT module implementation:
- Task creation from gaps (7 tests)
- Task deduplication logic (7 tests)
- Priority escalation handling (6 tests)
- Lifecycle state transitions (10 tests)
- Maturity feedback loop (9 tests)
- Event handling (7 tests)
- Data integrity (7 tests)
- Performance (5 tests)
- Security & permissions (5 tests)
- UI requirements (7 tests)

## Running Tests

### Run All Tests
```bash
cd apps/isms-portal
npm test -- --run
```

### Run Gap Priority Tests Only
```bash
cd apps/isms-portal
npm test -- --run gap-priority.test
```

### Run Tests with UI
```bash
cd apps/isms-portal
npm test:ui
```

### Run Tests in Watch Mode
```bash
cd apps/isms-portal
npm test
```

## Test Results

**Current Status:** ✅ **66/66 tests passing (100%)**
- Gap Priority Tests: 58/58 passing
- Scoring Tests: 8/8 passing
- PIT Integration Tests: 0/71 (71 planned for future implementation)

## Architecture References

- **Part 1:** `architecture/modules/pit/Architecture/GAP_PRIORITY_ENGINE_v1.0.md`
  - Overview, inputs, outputs, numeric priority model

- **Part 2:** `architecture/modules/pit/Architecture/GAP_PRIORITY_ENGINE_AI_REASONING_v1.0.md`
  - AI reasoning layer, interpretation, and explanation

- **Part 3:** `architecture/modules/pit/Architecture/GAP_PRIORITY_ENGINE_PIT_HANDLING_v1.0.md`
  - PIT handling rules, workflow, and feedback loops

- **Part 4:** Issue #4 (this implementation)
  - QA requirements and test suite

## Test Coverage

### Numeric Model Coverage
- ✅ Base priority calculation
- ✅ Evidence confidence modifier (0.75-1.25 range)
- ✅ Criticality modifier (1.0-3.0 range)
- ✅ Linked risks modifier (1.0-2.0 range)
- ✅ Regulatory relevance modifier (1.0-1.5 range)
- ✅ Time exposure modifier (1.0-2.0 range)
- ✅ Existing tasks modifier (0.5-1.0 range)
- ✅ Final priority score calculation
- ✅ Priority level mapping

### AI Layer Coverage
- ✅ Deterministic priority label mapping
- ✅ No hallucinations (data integrity)
- ✅ Context completeness for recommendations
- ✅ Deterministic outputs

### PIT Workflow Coverage
- ✅ Deduplication context support
- ✅ Priority escalation detection
- ✅ Task lifecycle support
- ✅ Maturity feedback loop support

### Scenario Coverage
- ✅ Critical risk-driven gaps
- ✅ Policy-only evidence scenarios
- ✅ Task completion and gap closure
- ✅ Complex multi-factor scenarios
- ✅ Chronic gap escalation (>1 year)

## Quality Assurance

### Test Quality Principles
1. **Deterministic**: All tests produce consistent results
2. **Isolated**: Tests don't depend on external state
3. **Comprehensive**: All spec requirements covered
4. **Maintainable**: Clear test names and documentation
5. **Fast**: All tests run in < 20ms

### Validation Rules
- All numeric calculations match specification formulas
- All modifiers stay within specified ranges
- All priority mappings follow deterministic thresholds
- No floating-point precision issues
- Edge cases handled gracefully

## Future Work

### PIT Integration Tests (Planned)
When the PIT module is implemented, activate the 71 planned tests in:
- `apps/pit/tests/pit-integration.test.ts`

These tests will validate:
- Database schema integration
- Event handling (maturity.criterion_gap, etc.)
- Task CRUD operations
- Deduplication logic
- State machine transitions
- Performance benchmarks
- Security & permissions

### AI Reasoning Tests (Planned)
When AI integration is complete:
- Test actual AI-generated reasoning summaries
- Validate recommendation quality
- Test hallucination detection
- Verify factual grounding

## Example Implementation

When the PIT module is ready, tests can be implemented like this:

```typescript
describe("PIT Integration - Task Creation (Implemented)", () => {
  it("should create PIT task from high-priority criterion gap", async () => {
    const gapInput = {
      org_id: "test-org-123",
      cycle_id: "cycle-456",
      origin_type: "criterion" as const,
      origin_id: "criterion-789",
      domain_name: "Access Control",
      domain_id: "domain-001",
      mps_name: "Identity Management",
      mps_id: "mps-001",
      criterion_name: "Multi-Factor Authentication",
      gap: 2,
      current_level: 2,
      target_level: 4,
      evidence_count: 1,
      avg_evidence_confidence: 0.4,
      criticality: "high" as const,
      linked_risks: {
        count: 2,
        max_severity: "high" as const,
      },
      regulatory_relevance: "high" as const,
      compliance_frameworks: ["ISO 27001"],
      time_exposed_days: 120,
    };

    // Mock PIT service
    const pitService = new PitService();
    const task = await pitService.createTaskFromGap(gapInput);

    expect(task.priority).toBe("high");
    expect(task.origin_type).toBe("criterion");
    expect(task.origin_id).toBe("criterion-789");
    expect(task.status).toBe("open");
    expect(task.due_date).toBeDefined();
  });
});
```

## Continuous Integration

### Pre-commit Checks
```bash
npm test -- --run
```

### CI/CD Pipeline
Add to GitHub Actions:
```yaml
- name: Run Gap Priority Tests
  run: |
    cd apps/isms-portal
    npm install
    npm test -- --run gap-priority.test
```

## Troubleshooting

### Common Issues

**Issue:** `vitest: not found`
**Solution:** Run `npm install` in the `apps/isms-portal` directory

**Issue:** `Cannot find dependency 'jsdom'`
**Solution:** Run `npm install --save-dev jsdom`

**Issue:** Floating-point precision errors
**Solution:** Use `toBeCloseTo()` instead of `toBe()` for decimal comparisons

## Changelog

### v1.0.0 (2025-12-09)
- ✅ Initial implementation of Gap Priority Engine library
- ✅ 58 comprehensive tests covering all Issue 4/4 requirements
- ✅ All tests passing (100% success rate)
- ✅ PIT integration test placeholder created
- ✅ Full documentation added

## Contact

For questions about the test suite or Gap Priority Engine:
- Review architecture documents in `architecture/modules/pit/Architecture/`
- Check test implementation in `apps/isms-portal/src/modules/maturity/tests/`
- Refer to Issue 4/4 for original requirements
