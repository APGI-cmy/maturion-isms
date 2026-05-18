# QA-to-Red Plan — ISMS Public Landing Harvest

**Stage**: 5 (QA-to-Red)
**Wave**: isms-public-landing-harvest-20260514
**Issue**: #1645
**PR**: #1646
**Authority**: foreman-v2-agent contract v6.2.0 Phase 2 Step 2.5
**Version**: v1.0.0

---

## 1. Purpose

This document defines the failing (RED) test suite that must exist and be confirmed failing before the builder starts, and GREEN after the builder delivers.

Per the Maturion Build Philosophy: **Architecture → QA-to-Red → Build-to-Green → Validation**

---

## 2. Test Coverage Areas

### 2.1 Route Accessibility Tests

These tests verify public routes render without authentication.

| Test ID | Test Description | Expected State Before Build | Expected State After Build |
|---|---|---|---|
| QA-R-001 | `/` renders ISMS landing page (no auth required) | FAIL — page not yet created | PASS |
| QA-R-002 | `/modules` renders without auth redirect | FAIL — page not yet created | PASS |
| QA-R-003 | `/journey` renders without auth redirect | FAIL — page not yet created | PASS |
| QA-R-004 | `/free-assessment` renders without auth redirect | FAIL — page not yet created | PASS |
| QA-R-005 | `/subscribe` renders without auth redirect | FAIL — page not yet created | PASS |
| QA-R-006 | `/subscribe/checkout` renders without auth redirect | FAIL — page not yet created | PASS |
| QA-R-007 | `/marketing/risk-management` renders without auth | FAIL — page not yet created | PASS |
| QA-R-008 | `/marketing/project-implementation` renders without auth | FAIL — page not yet created | PASS |
| QA-R-009 | `/marketing/data-analytics-assurance` renders without auth | FAIL — page not yet created | PASS |
| QA-R-010 | `/marketing/systems-integration` renders without auth | FAIL — page not yet created | PASS |
| QA-R-011 | `/marketing/skills-development` renders without auth | FAIL — page not yet created | PASS |
| QA-R-012 | `/marketing/incident-intelligence` renders without auth | FAIL — page not yet created | PASS |

### 2.2 Module Card Tests

| Test ID | Test Description | Expected State Before Build | Expected State After Build |
|---|---|---|---|
| QA-R-020 | Landing page renders 7 module cards | FAIL — page not yet created | PASS |
| QA-R-021 | Each module card has title, value prop, and click handler | FAIL — page not yet created | PASS |
| QA-R-022 | Maturity Roadmap card links to `/marketing/maturity-roadmap` | FAIL — page not yet created | PASS |
| QA-R-023 | Risk Management card links to `/marketing/risk-management` | FAIL — page not yet created | PASS |
| QA-R-024 | PIT card links to `/marketing/project-implementation` | FAIL — page not yet created | PASS |
| QA-R-025 | Data Analytics card links to `/marketing/data-analytics-assurance` | FAIL — page not yet created | PASS |
| QA-R-026 | Systems Integration card links to `/marketing/systems-integration` | FAIL — page not yet created | PASS |
| QA-R-027 | Skills Development card links to `/marketing/skills-development` | FAIL — page not yet created | PASS |
| QA-R-028 | Incident & Intelligence card links to `/marketing/incident-intelligence` | FAIL — page not yet created | PASS |

### 2.3 Route Constant Tests

| Test ID | Test Description | Expected State Before Build | Expected State After Build |
|---|---|---|---|
| QA-R-030 | ROUTES.HOME === '/' | FAIL — routes.ts not yet created | PASS |
| QA-R-031 | ROUTES.MARKETING_RISK_MANAGEMENT === '/marketing/risk-management' | FAIL — routes.ts not yet created | PASS |
| QA-R-032 | ROUTES.FREE_ASSESSMENT === '/free-assessment' | FAIL — routes.ts not yet created | PASS |
| QA-R-033 | All 7 MARKETING_* routes defined | FAIL — routes.ts not yet created | PASS |

---

## 3. Existing Tests to Protect

The following tests already exist in `apps/isms-portal/src/modules/maturity/tests/` and must remain GREEN:

| Test File | Tests | Must Stay GREEN |
|---|---|---|
| `scoring.test.ts` | Maturity scoring engine tests | YES — do not modify |
| `gap-priority.test.ts` | Gap priority calculation tests | YES — do not modify |

---

## 4. Test Implementation Notes

Since the existing test infrastructure uses Vitest, new tests for route accessibility can be written as:

```typescript
// Example: apps/isms-portal/src/pages/__tests__/routing.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Public Route Accessibility', () => {
  test('QA-R-001: landing page renders without auth', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
  // etc.
});
```

> **Note to ui-builder**: These tests should be written alongside the implementation to ensure RED→GREEN behavior is verifiable.

---

## 5. QA-to-Red Gate Status

```
Stage 5 QA-to-Red plan: DEFINED
RED suite defined: YES (QA-R-001 through QA-R-033)
Tests currently failing: YES (pages do not exist yet)
Gate status: READY FOR BUILDER APPOINTMENT
```

---

**Authority**: foreman-v2-agent | Wave: isms-public-landing-harvest-20260514
